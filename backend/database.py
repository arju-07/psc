import os
import json
import uuid
import datetime
from pathlib import Path
from config import Config
from seed_data import (INITIAL_CATEGORIES, INITIAL_EXAMINATIONS, INITIAL_QUESTION_PAPERS,
                       INITIAL_QUESTIONS, INITIAL_SOURCES, INITIAL_SUBJECTS, INITIAL_TOPICS,
                       INITIAL_MOCK_TESTS, get_enriched_questions)

class Database:
    def __init__(self):
        self.use_firestore = False
        self.firestore_db = None
        self.local_db_path = Path(Config.DATA_FOLDER) / "db.json"
        self._init_connection()

    def _init_connection(self):
        if Config.FIREBASE_CREDENTIALS and os.path.exists(Config.FIREBASE_CREDENTIALS):
            try:
                import firebase_admin
                from firebase_admin import credentials, firestore
                if not firebase_admin._apps:
                    cred = credentials.Certificate(Config.FIREBASE_CREDENTIALS)
                    firebase_admin.initialize_app(cred, {
                        'storageBucket': Config.FIREBASE_STORAGE_BUCKET
                    })
                self.firestore_db = firestore.client()
                self.use_firestore = True
                print("Connected to live Firebase Firestore!")
            except Exception as e:
                print(f"Firebase initialization failed: {e}. Falling back to persistent local datastore.")
                self.use_firestore = False
        else:
            print("No Firebase credentials provided. Operating in persistent local storage mode.")

        self._ensure_initialized()

    def _ensure_initialized(self):
        """Initializes collections and seed data if store is empty"""
        if self.use_firestore:
            # Check if categories collection has documents
            docs = list(self.firestore_db.collection("categories").limit(1).stream())
            if not docs:
                print("Seeding initial data into Firestore...")
                self._seed_firestore()
        else:
            if not self.local_db_path.exists():
                self._init_local_db()
            else:
                try:
                    with open(self.local_db_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    # Verify basic keys exist
                    if "categories" not in data or len(data.get("categories", [])) == 0:
                        self._init_local_db()
                    else:
                        # Migrate existing DB to add new Phase 2 collections if missing
                        changed = False
                        if "subjects" not in data or not data["subjects"]:
                            data["subjects"] = INITIAL_SUBJECTS
                            changed = True
                        if "topics" not in data or not data["topics"]:
                            data["topics"] = INITIAL_TOPICS
                            changed = True
                        if "mock_tests" not in data or not data["mock_tests"]:
                            data["mock_tests"] = INITIAL_MOCK_TESTS
                            changed = True
                        if "daily_challenges" not in data:
                            data["daily_challenges"] = []
                            changed = True
                        if "daily_participation" not in data:
                            data["daily_participation"] = []
                            changed = True
                        # Enrich questions with subject_id/topic_id if missing
                        enriched = get_enriched_questions()
                        enriched_map = {q["id"]: q for q in enriched}
                        for i, q in enumerate(data.get("questions", [])):
                            if "subject_id" not in q and q["id"] in enriched_map:
                                data["questions"][i]["subject_id"] = enriched_map[q["id"]].get("subject_id", "")
                                data["questions"][i]["topic_id"] = enriched_map[q["id"]].get("topic_id", "")
                                changed = True
                        # Sync examinations from seed if any missing
                        existing_exam_ids = {e["id"] for e in data.get("exams", [])}
                        for e in INITIAL_EXAMINATIONS:
                            if e["id"] not in existing_exam_ids:
                                data["exams"].append(e)
                                changed = True
                        if changed:
                            with open(self.local_db_path, "w", encoding="utf-8") as f:
                                json.dump(data, f, indent=2, ensure_ascii=False)
                            print("Migrated local datastore to Phase 2 schema.")
                except Exception:
                    self._init_local_db()

    def _init_local_db(self):
        data = {
            "categories": INITIAL_CATEGORIES,
            "exams": INITIAL_EXAMINATIONS,
            "papers": INITIAL_QUESTION_PAPERS,
            "questions": get_enriched_questions(),
            "subjects": INITIAL_SUBJECTS,
            "topics": INITIAL_TOPICS,
            "mock_tests": INITIAL_MOCK_TESTS,
            "daily_challenges": [],
            "daily_participation": [],
            "sources": INITIAL_SOURCES,
            "attempts": [],
            "bookmarks": [],
            "favorites": ["exam-kpsc-degree-prelims", "exam-police-si"],
            "users": [
                {
                    "id": "usr-admin-01",
                    "email": "admin@keralapyqhub.org",
                    "name": "Arun Kumar (System Admin)",
                    "role": "ADMIN",
                    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Arun",
                    "created_at": "2024-01-01T00:00:00Z"
                },
                {
                    "id": "usr-student-01",
                    "email": "student@keralapyqhub.org",
                    "name": "Devika Nair (Aspirant)",
                    "role": "STUDENT",
                    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Devika",
                    "target_exam": "Kerala PSC Degree Level Prelims",
                    "study_streak_days": 14,
                    "created_at": "2024-01-10T00:00:00Z"
                }
            ],
            "duplicates": [],
            "broken_links": []
        }
        with open(self.local_db_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Local datastore initialized with complete seed catalogue.")

    def _seed_firestore(self):
        batch = self.firestore_db.batch()
        for cat in INITIAL_CATEGORIES:
            ref = self.firestore_db.collection("categories").document(cat["id"])
            batch.set(ref, cat)
        for exam in INITIAL_EXAMINATIONS:
            ref = self.firestore_db.collection("exams").document(exam["id"])
            batch.set(ref, exam)
        for paper in INITIAL_QUESTION_PAPERS:
            ref = self.firestore_db.collection("papers").document(paper["id"])
            batch.set(ref, paper)
        for q in INITIAL_QUESTIONS:
            ref = self.firestore_db.collection("questions").document(q["id"])
            batch.set(ref, q)
        for src in INITIAL_SOURCES:
            ref = self.firestore_db.collection("sources").document(src["id"])
            batch.set(ref, src)
        batch.commit()

    # Helpers for local DB read/write
    def _read_local(self):
        with open(self.local_db_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _write_local(self, data):
        with open(self.local_db_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    # Categories CRUD
    def get_categories(self):
        if self.use_firestore:
            docs = self.firestore_db.collection("categories").stream()
            return [d.to_dict() for d in docs]
        data = self._read_local()
        return sorted(data.get("categories", []), key=lambda x: x.get("order", 99))

    def get_category(self, cat_id):
        cats = self.get_categories()
        for c in cats:
            if c["id"] == cat_id:
                return c
        return None

    def create_category(self, cat_data):
        cat_id = cat_data.get("id") or f"cat-{uuid.uuid4().hex[:8]}"
        cat_data["id"] = cat_id
        if self.use_firestore:
            self.firestore_db.collection("categories").document(cat_id).set(cat_data)
            return cat_data
        data = self._read_local()
        data["categories"].append(cat_data)
        self._write_local(data)
        return cat_data

    def update_category(self, cat_id, cat_data):
        if self.use_firestore:
            self.firestore_db.collection("categories").document(cat_id).update(cat_data)
            return {**cat_data, "id": cat_id}
        data = self._read_local()
        for i, c in enumerate(data.get("categories", [])):
            if c["id"] == cat_id:
                data["categories"][i].update(cat_data)
                self._write_local(data)
                return data["categories"][i]
        return None

    def delete_category(self, cat_id):
        if self.use_firestore:
            self.firestore_db.collection("categories").document(cat_id).delete()
            return True
        data = self._read_local()
        data["categories"] = [c for c in data.get("categories", []) if c["id"] != cat_id]
        self._write_local(data)
        return True

    # Examinations CRUD
    def get_exams(self, category_id=None):
        if self.use_firestore:
            query = self.firestore_db.collection("exams")
            if category_id:
                query = query.where("category_id", "==", category_id)
            return [d.to_dict() for d in query.stream()]
        data = self._read_local()
        exams = data.get("exams", [])
        if category_id:
            exams = [e for e in exams if e.get("category_id") == category_id]
        return exams

    def get_exam(self, exam_id):
        if self.use_firestore:
            doc = self.firestore_db.collection("exams").document(exam_id).get()
            return doc.to_dict() if doc.exists else None
        data = self._read_local()
        for e in data.get("exams", []):
            if e["id"] == exam_id:
                return e
        return None

    def create_exam(self, exam_data):
        exam_id = exam_data.get("id") or f"exam-{uuid.uuid4().hex[:8]}"
        exam_data["id"] = exam_id
        if self.use_firestore:
            self.firestore_db.collection("exams").document(exam_id).set(exam_data)
            return exam_data
        data = self._read_local()
        data["exams"].append(exam_data)
        self._write_local(data)
        return exam_data

    def update_exam(self, exam_id, exam_data):
        if self.use_firestore:
            self.firestore_db.collection("exams").document(exam_id).update(exam_data)
            return {**exam_data, "id": exam_id}
        data = self._read_local()
        for i, e in enumerate(data.get("exams", [])):
            if e["id"] == exam_id:
                data["exams"][i].update(exam_data)
                self._write_local(data)
                return data["exams"][i]
        return None

    # Question Papers CRUD
    def get_papers(self, exam_id=None, category_id=None, year=None, search=None, language=None, verified_only=True):
        if self.use_firestore:
            docs = self.firestore_db.collection("papers").stream()
            papers = [d.to_dict() for d in docs]
        else:
            data = self._read_local()
            papers = data.get("papers", [])

        # Filter in memory
        filtered = []
        for p in papers:
            if verified_only and not p.get("is_verified", False):
                continue
            if exam_id and p.get("exam_id") != exam_id:
                continue
            if year and str(p.get("year")) != str(year):
                continue
            if language:
                p_lang = p.get("language", "").lower()
                req_lang = language.lower()
                if req_lang not in p_lang:
                    continue
            if search:
                s_low = search.lower()
                p_code = p.get("paper_code", "").lower()
                p_session = p.get("session_name", "").lower()
                p_notes = p.get("notes", "").lower()
                if (s_low not in p_code and
                    s_low not in p_session and
                    s_low not in p_notes and
                    s_low not in str(p.get("year", ""))):
                    continue
            filtered.append(p)
        return filtered

    def get_paper(self, paper_id):
        if self.use_firestore:
            doc = self.firestore_db.collection("papers").document(paper_id).get()
            return doc.to_dict() if doc.exists else None
        data = self._read_local()
        for p in data.get("papers", []):
            if p["id"] == paper_id:
                return p
        return None

    def create_paper(self, paper_data):
        paper_id = paper_data.get("id") or f"paper-{uuid.uuid4().hex[:10]}"
        paper_data["id"] = paper_id
        if "created_at" not in paper_data:
            paper_data["created_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()

        if self.use_firestore:
            self.firestore_db.collection("papers").document(paper_id).set(paper_data)
            return paper_data
        data = self._read_local()
        data["papers"].append(paper_data)
        self._write_local(data)
        return paper_data

    def update_paper(self, paper_id, update_data):
        if self.use_firestore:
            self.firestore_db.collection("papers").document(paper_id).update(update_data)
            return self.get_paper(paper_id)
        data = self._read_local()
        for i, p in enumerate(data.get("papers", [])):
            if p["id"] == paper_id:
                data["papers"][i].update(update_data)
                self._write_local(data)
                return data["papers"][i]
        return None

    def delete_paper(self, paper_id):
        if self.use_firestore:
            self.firestore_db.collection("papers").document(paper_id).delete()
            return True
        data = self._read_local()
        data["papers"] = [p for p in data.get("papers", []) if p["id"] != paper_id]
        data["questions"] = [q for q in data.get("questions", []) if q.get("paper_id") != paper_id]
        self._write_local(data)
        return True

    # Questions CRUD
    def get_questions_by_paper(self, paper_id):
        if self.use_firestore:
            docs = self.firestore_db.collection("questions").where("paper_id", "==", paper_id).stream()
            return sorted([d.to_dict() for d in docs], key=lambda x: x.get("question_number", 0))
        data = self._read_local()
        qs = [q for q in data.get("questions", []) if q.get("paper_id") == paper_id]
        return sorted(qs, key=lambda x: x.get("question_number", 0))

    def get_all_questions(self, verified_only=True):
        if self.use_firestore:
            docs = self.firestore_db.collection("questions").stream()
            qs = [d.to_dict() for d in docs]
        else:
            data = self._read_local()
            qs = data.get("questions", [])
        if verified_only:
            qs = [q for q in qs if q.get("is_verified", True)]
        return qs

    def add_question(self, q_data):
        q_id = q_data.get("id") or f"q-{uuid.uuid4().hex[:8]}"
        q_data["id"] = q_id
        if self.use_firestore:
            self.firestore_db.collection("questions").document(q_id).set(q_data)
            return q_data
        data = self._read_local()
        data["questions"].append(q_data)
        self._write_local(data)
        return q_data

    # Attempts & Practice Tests
    def save_attempt(self, attempt_data):
        attempt_id = attempt_data.get("id") or f"att-{uuid.uuid4().hex[:10]}"
        attempt_data["id"] = attempt_id
        attempt_data["completed_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
        if self.use_firestore:
            self.firestore_db.collection("attempts").document(attempt_id).set(attempt_data)
            return attempt_data
        data = self._read_local()
        data["attempts"].append(attempt_data)
        self._write_local(data)
        return attempt_data

    def get_user_attempts(self, user_id):
        if self.use_firestore:
            docs = self.firestore_db.collection("attempts").where("user_id", "==", user_id).stream()
            attempts = [d.to_dict() for d in docs]
        else:
            data = self._read_local()
            attempts = [a for a in data.get("attempts", []) if a.get("user_id") == user_id]
        return sorted(attempts, key=lambda x: x.get("completed_at", ""), reverse=True)

    # Bookmarks & Favorites
    def get_user_bookmarks(self, user_id):
        data = self._read_local()
        bookmarks = [b for b in data.get("bookmarks", []) if b.get("user_id") == user_id]
        # Hydrate with question details
        all_qs = {q["id"]: q for q in data.get("questions", [])}
        for b in bookmarks:
            b["question"] = all_qs.get(b.get("question_id"))
        return bookmarks

    def toggle_bookmark(self, user_id, question_id, note=""):
        data = self._read_local()
        existing = [b for b in data.get("bookmarks", []) if b.get("user_id") == user_id and b.get("question_id") == question_id]
        if existing:
            data["bookmarks"] = [b for b in data.get("bookmarks", []) if not (b.get("user_id") == user_id and b.get("question_id") == question_id)]
            self._write_local(data)
            return {"bookmarked": False}
        else:
            new_bm = {
                "id": f"bm-{uuid.uuid4().hex[:8]}",
                "user_id": user_id,
                "question_id": question_id,
                "note": note,
                "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            data["bookmarks"].append(new_bm)
            self._write_local(data)
            return {"bookmarked": True, "bookmark": new_bm}

    def get_user_favorites(self, user_id):
        data = self._read_local()
        return data.get("favorites", [])

    def toggle_favorite(self, user_id, exam_id):
        data = self._read_local()
        favs = data.get("favorites", [])
        if exam_id in favs:
            favs.remove(exam_id)
            is_fav = False
        else:
            favs.append(exam_id)
            is_fav = True
        data["favorites"] = favs
        self._write_local(data)
        return {"favorited": is_fav, "favorites": favs}

    # Sources & Collection
    def get_sources(self):
        data = self._read_local()
        return data.get("sources", [])

    def add_source(self, src_data):
        src_id = src_data.get("id") or f"src-{uuid.uuid4().hex[:8]}"
        src_data["id"] = src_id
        data = self._read_local()
        data["sources"].append(src_data)
        self._write_local(data)
        return src_data

    def update_source(self, src_id, update_data):
        data = self._read_local()
        for i, s in enumerate(data.get("sources", [])):
            if s["id"] == src_id:
                data["sources"][i].update(update_data)
                self._write_local(data)
                return data["sources"][i]
        return None

    def get_unverified_queue(self):
        data = self._read_local()
        return [p for p in data.get("papers", []) if not p.get("is_verified", False) or p.get("status") == "PENDING_REVIEW"]

    def approve_paper(self, paper_id, admin_name="Admin Reviewer"):
        return self.update_paper(paper_id, {
            "is_verified": True,
            "status": "APPROVED",
            "verified_by": admin_name,
            "verified_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        })

    def reject_paper(self, paper_id, reason="Does not meet criteria"):
        return self.update_paper(paper_id, {
            "is_verified": False,
            "status": "REJECTED",
            "rejection_reason": reason,
            "rejected_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        })

    # Duplicates & Broken link auditing
    def get_audit_reports(self):
        data = self._read_local()
        return {
            "duplicates": data.get("duplicates", []),
            "broken_links": data.get("broken_links", [])
        }

    def save_audit_results(self, duplicates, broken_links):
        data = self._read_local()
        data["duplicates"] = duplicates
        data["broken_links"] = broken_links
        self._write_local(data)

    # Users
    def get_users(self):
        data = self._read_local()
        return data.get("users", [])

    def update_user_role(self, user_id, role):
        data = self._read_local()
        for u in data.get("users", []):
            if u["id"] == user_id:
                u["role"] = role
                self._write_local(data)
                return u
        return None

    # ─── SUBJECTS ─────────────────────────────────────────────────────────────
    def get_subjects(self):
        data = self._read_local()
        return sorted(data.get("subjects", []), key=lambda x: x.get("order", 99))

    def get_subject(self, subject_id):
        for s in self.get_subjects():
            if s["id"] == subject_id:
                return s
        return None

    def create_subject(self, s_data):
        s_id = s_data.get("id") or f"subj-{uuid.uuid4().hex[:8]}"
        s_data["id"] = s_id
        data = self._read_local()
        data.setdefault("subjects", []).append(s_data)
        self._write_local(data)
        return s_data

    def update_subject(self, subject_id, update_data):
        data = self._read_local()
        for i, s in enumerate(data.get("subjects", [])):
            if s["id"] == subject_id:
                data["subjects"][i].update(update_data)
                self._write_local(data)
                return data["subjects"][i]
        return None

    # ─── TOPICS ───────────────────────────────────────────────────────────────
    def get_topics(self, subject_id=None):
        data = self._read_local()
        topics = data.get("topics", [])
        if subject_id:
            topics = [t for t in topics if t.get("subject_id") == subject_id]
        return sorted(topics, key=lambda x: x.get("order", 99))

    def get_topic(self, topic_id):
        data = self._read_local()
        for t in data.get("topics", []):
            if t["id"] == topic_id:
                return t
        return None

    def create_topic(self, t_data):
        t_id = t_data.get("id") or f"topic-{uuid.uuid4().hex[:8]}"
        t_data["id"] = t_id
        data = self._read_local()
        data.setdefault("topics", []).append(t_data)
        self._write_local(data)
        return t_data

    def update_topic(self, topic_id, update_data):
        data = self._read_local()
        for i, t in enumerate(data.get("topics", [])):
            if t["id"] == topic_id:
                data["topics"][i].update(update_data)
                self._write_local(data)
                return data["topics"][i]
        return None

    # ─── QUESTIONS (PHASE 2 EXTENSIONS) ───────────────────────────────────────
    def get_questions_filtered(self, subject_id=None, topic_id=None, exam_id=None,
                               difficulty=None, verified_only=True, page=1, limit=20):
        data = self._read_local()
        qs = data.get("questions", [])
        if verified_only:
            qs = [q for q in qs if q.get("is_verified", True)]
        if subject_id:
            qs = [q for q in qs if q.get("subject_id") == subject_id]
        if topic_id:
            qs = [q for q in qs if q.get("topic_id") == topic_id]
        if difficulty:
            qs = [q for q in qs if q.get("difficulty", "").lower() == difficulty.lower()]
        if exam_id:
            # Match by paper_id's linked exam or exam_ids array
            papers_in_exam = {p["id"] for p in data.get("papers", []) if p.get("exam_id") == exam_id}
            qs = [q for q in qs if q.get("paper_id") in papers_in_exam
                  or exam_id in q.get("exam_ids", [])]
        total = len(qs)
        start = (page - 1) * limit
        end = start + limit
        return {"questions": qs[start:end], "total": total, "page": page, "limit": limit}

    def get_question(self, q_id):
        data = self._read_local()
        for q in data.get("questions", []):
            if q["id"] == q_id:
                return q
        return None

    def create_question(self, q_data):
        return self.add_question(q_data)

    def update_question(self, q_id, update_data):
        data = self._read_local()
        for i, q in enumerate(data.get("questions", [])):
            if q["id"] == q_id:
                data["questions"][i].update(update_data)
                self._write_local(data)
                return data["questions"][i]
        return None

    def delete_question(self, q_id):
        data = self._read_local()
        data["questions"] = [q for q in data.get("questions", []) if q["id"] != q_id]
        self._write_local(data)
        return True

    # ─── MOCK TESTS ───────────────────────────────────────────────────────────
    def get_mock_tests(self, exam_id=None):
        data = self._read_local()
        mts = data.get("mock_tests", [])
        if exam_id:
            mts = [m for m in mts if m.get("exam_id") == exam_id]
        return [m for m in mts if m.get("is_active", True)]

    def get_mock_test(self, mt_id):
        data = self._read_local()
        for m in data.get("mock_tests", []):
            if m["id"] == mt_id:
                return m
        return None

    def create_mock_test(self, mt_data):
        mt_id = mt_data.get("id") or f"mock-{uuid.uuid4().hex[:8]}"
        mt_data["id"] = mt_id
        mt_data["created_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
        data = self._read_local()
        data.setdefault("mock_tests", []).append(mt_data)
        self._write_local(data)
        return mt_data

    def update_mock_test(self, mt_id, update_data):
        data = self._read_local()
        for i, m in enumerate(data.get("mock_tests", [])):
            if m["id"] == mt_id:
                data["mock_tests"][i].update(update_data)
                self._write_local(data)
                return data["mock_tests"][i]
        return None

    def delete_mock_test(self, mt_id):
        data = self._read_local()
        data["mock_tests"] = [m for m in data.get("mock_tests", []) if m["id"] != mt_id]
        self._write_local(data)
        return True

    # ─── DAILY CHALLENGES ─────────────────────────────────────────────────────
    def get_daily_challenge(self, challenge_date, count=10):
        data = self._read_local()
        challenges = data.get("daily_challenges", [])
        for ch in challenges:
            if ch.get("date") == challenge_date:
                return ch
        # Auto-generate a challenge for today using verified questions
        all_qs = [q for q in data.get("questions", []) if q.get("is_verified", True)]
        import random
        selected = random.sample(all_qs, min(count, len(all_qs)))
        new_challenge = {
            "id": f"dc-{challenge_date.replace('-', '')}",
            "date": challenge_date,
            "question_count": len(selected),
            "question_ids": [q["id"] for q in selected],
            "questions": [{k: v for k, v in q.items() if k not in ["correct_option", "explanation", "explanation_malayalam"]} for q in selected],
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        data.setdefault("daily_challenges", []).append(new_challenge)
        self._write_local(data)
        return new_challenge

    def save_daily_participation(self, user_id, challenge_date, answers, score, correct, incorrect, total):
        data = self._read_local()
        # Update or insert participation
        existing = [p for p in data.get("daily_participation", [])
                    if p.get("user_id") == user_id and p.get("date") == challenge_date]
        part = {
            "id": f"dp-{user_id}-{challenge_date.replace('-', '')}",
            "user_id": user_id,
            "date": challenge_date,
            "answers": answers,
            "score": score,
            "correct_count": correct,
            "incorrect_count": incorrect,
            "total_questions": total,
            "accuracy_pct": round((correct / max(1, correct + incorrect)) * 100, 1),
            "completed_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        if existing:
            data["daily_participation"] = [p if not (p.get("user_id") == user_id and p.get("date") == challenge_date) else part
                                            for p in data.get("daily_participation", [])]
        else:
            data.setdefault("daily_participation", []).append(part)
        self._write_local(data)
        return part

    def get_daily_history(self, user_id, days=30):
        data = self._read_local()
        participations = [p for p in data.get("daily_participation", []) if p.get("user_id") == user_id]
        return sorted(participations, key=lambda x: x.get("date", ""), reverse=True)[:days]

    def get_daily_streak(self, user_id):
        history = self.get_daily_history(user_id)
        if not history:
            return 0
        streak = 0
        today = datetime.date.today()
        for i in range(len(history)):
            expected = (today - datetime.timedelta(days=i)).isoformat()
            if any(p["date"] == expected for p in history):
                streak += 1
            else:
                break
        return streak

    # ─── PERFORMANCE ANALYTICS ────────────────────────────────────────────────
    def get_user_performance_summary(self, user_id):
        data = self._read_local()
        attempts = [a for a in data.get("attempts", []) if a.get("user_id") == user_id]
        all_qs = {q["id"]: q for q in data.get("questions", [])}

        subject_stats = {}
        topic_stats = {}
        total_correct = 0
        total_attempted = 0

        for attempt in attempts:
            for ev in attempt.get("evaluations", []):
                q = all_qs.get(ev.get("question_id"), {})
                subj = q.get("subject_id", "unknown")
                topic = q.get("topic_id", "unknown")
                is_correct = ev.get("status") == "CORRECT"
                was_attempted = ev.get("status") != "UNATTEMPTED"

                if was_attempted:
                    total_attempted += 1
                    if is_correct:
                        total_correct += 1

                    if subj not in subject_stats:
                        subject_stats[subj] = {"correct": 0, "attempted": 0}
                    subject_stats[subj]["attempted"] += 1
                    if is_correct:
                        subject_stats[subj]["correct"] += 1

                    if topic not in topic_stats:
                        topic_stats[topic] = {"correct": 0, "attempted": 0}
                    topic_stats[topic]["attempted"] += 1
                    if is_correct:
                        topic_stats[topic]["correct"] += 1

        # Build enriched subject/topic accuracy
        subjects_map = {s["id"]: s for s in data.get("subjects", [])}
        topics_map = {t["id"]: t for t in data.get("topics", [])}

        subject_performance = []
        for s_id, stats in subject_stats.items():
            acc = round((stats["correct"] / max(1, stats["attempted"])) * 100, 1)
            s_info = subjects_map.get(s_id, {"name": s_id, "name_malayalam": ""})
            subject_performance.append({
                "subject_id": s_id,
                "name": s_info.get("name", s_id),
                "name_malayalam": s_info.get("name_malayalam", ""),
                "correct": stats["correct"],
                "attempted": stats["attempted"],
                "accuracy_pct": acc,
                "status": "strong" if acc >= 70 else ("average" if acc >= 50 else "weak")
            })

        topic_performance = []
        for t_id, stats in topic_stats.items():
            acc = round((stats["correct"] / max(1, stats["attempted"])) * 100, 1)
            t_info = topics_map.get(t_id, {"name": t_id, "name_malayalam": ""})
            topic_performance.append({
                "topic_id": t_id,
                "name": t_info.get("name", t_id),
                "name_malayalam": t_info.get("name_malayalam", ""),
                "correct": stats["correct"],
                "attempted": stats["attempted"],
                "accuracy_pct": acc,
                "status": "strong" if acc >= 70 else ("average" if acc >= 50 else "weak")
            })

        # Daily challenge stats
        daily_history = self.get_daily_history(user_id, days=30)
        streak = self.get_daily_streak(user_id)

        return {
            "user_id": user_id,
            "total_tests": len(attempts),
            "total_questions_attempted": total_attempted,
            "total_correct": total_correct,
            "overall_accuracy_pct": round((total_correct / max(1, total_attempted)) * 100, 1),
            "subject_performance": sorted(subject_performance, key=lambda x: x["accuracy_pct"]),
            "topic_performance": sorted(topic_performance, key=lambda x: x["accuracy_pct"]),
            "weak_subjects": [s for s in subject_performance if s["status"] == "weak"],
            "strong_subjects": [s for s in subject_performance if s["status"] == "strong"],
            "mock_test_history": attempts[-10:],
            "daily_streak": streak,
            "daily_challenges_completed": len(daily_history),
            "recent_daily_history": daily_history[:7]
        }

db = Database()
