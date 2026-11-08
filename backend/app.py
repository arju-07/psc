import os
import json
import datetime
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from config import Config
from database import db
from services.pdf_processor import PDFProcessor
from services.collection_engine import collection_engine
from services.ai_analysis import ai_service

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
CORS(app)

# Helper function to sanitize user session
def get_current_user_id():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        if token == "admin-token":
            return "usr-admin-01"
        if token == "student-token":
            return "usr-student-01"
        return token
    return request.args.get("user_id", "usr-student-01")

# ----------------- HEALTH & STATS -----------------
@app.route("/api/health", methods=["GET"])
def health_check():
    all_papers = db.get_papers(verified_only=False)
    verified = [p for p in all_papers if p.get("is_verified", False)]
    pending = [p for p in all_papers if not p.get("is_verified", False)]
    cats = db.get_categories()
    exams = db.get_exams()

    return jsonify({
        "status": "healthy",
        "system": "Kerala PYQ Hub Backend",
        "mode": "Firestore (Live)" if db.use_firestore else "Persistent Document Store (Local Fallback)",
        "total_categories": len(cats),
        "total_exams": len(exams),
        "total_papers": len(all_papers),
        "verified_papers": len(verified),
        "pending_papers": len(pending),
        "total_sources": len(db.get_sources())
    })

# ----------------- CATEGORIES -----------------
@app.route("/api/categories", methods=["GET"])
def list_categories():
    categories = db.get_categories()
    # Augment with exam and paper counts
    all_exams = db.get_exams()
    all_papers = db.get_papers(verified_only=True)

    exam_counts = {}
    for e in all_exams:
        c_id = e.get("category_id")
        exam_counts[c_id] = exam_counts.get(c_id, 0) + 1

    paper_counts = {}
    exam_to_cat = {e["id"]: e.get("category_id") for e in all_exams}
    for p in all_papers:
        c_id = exam_to_cat.get(p.get("exam_id"))
        if c_id:
            paper_counts[c_id] = paper_counts.get(c_id, 0) + 1

    for c in categories:
        c["exam_count"] = exam_counts.get(c["id"], 0)
        c["paper_count"] = paper_counts.get(c["id"], 0)

    return jsonify(categories)

@app.route("/api/categories", methods=["POST"])
def create_category():
    data = request.json or {}
    if not data.get("name"):
        return jsonify({"error": "Category name is required"}), 400
    created = db.create_category(data)
    return jsonify(created), 201

@app.route("/api/categories/<cat_id>", methods=["GET"])
def get_category_detail(cat_id):
    cat = db.get_category(cat_id)
    if not cat:
        return jsonify({"error": "Category not found"}), 404
    exams = db.get_exams(category_id=cat_id)
    return jsonify({**cat, "exams": exams})

@app.route("/api/categories/<cat_id>", methods=["PUT"])
def update_category(cat_id):
    data = request.json or {}
    updated = db.update_category(cat_id, data)
    if not updated:
        return jsonify({"error": "Category not found"}), 404
    return jsonify(updated)

@app.route("/api/categories/<cat_id>", methods=["DELETE"])
def delete_category(cat_id):
    success = db.delete_category(cat_id)
    return jsonify({"success": success})

# ----------------- EXAMINATIONS -----------------
@app.route("/api/exams", methods=["GET"])
def list_exams():
    cat_id = request.args.get("category_id")
    exams = db.get_exams(category_id=cat_id)
    all_papers = db.get_papers(verified_only=True)
    paper_counts = {}
    for p in all_papers:
        e_id = p.get("exam_id")
        paper_counts[e_id] = paper_counts.get(e_id, 0) + 1

    for e in exams:
        e["paper_count"] = paper_counts.get(e["id"], 0)

    return jsonify(exams)

@app.route("/api/exams/<exam_id>", methods=["GET"])
def get_exam_detail(exam_id):
    exam = db.get_exam(exam_id)
    if not exam:
        return jsonify({"error": "Examination not found"}), 404
    papers = db.get_papers(exam_id=exam_id, verified_only=True)
    return jsonify({**exam, "papers": papers})

@app.route("/api/exams", methods=["POST"])
def create_exam():
    data = request.json or {}
    if not data.get("name") or not data.get("category_id"):
        return jsonify({"error": "Exam name and category_id are required"}), 400
    created = db.create_exam(data)
    return jsonify(created), 201

@app.route("/api/exams/<exam_id>", methods=["PUT"])
def update_exam(exam_id):
    data = request.json or {}
    updated = db.update_exam(exam_id, data)
    if not updated:
        return jsonify({"error": "Exam not found"}), 404
    return jsonify(updated)

# ----------------- QUESTION PAPERS -----------------
@app.route("/api/papers", methods=["GET"])
def list_papers():
    exam_id = request.args.get("exam_id")
    category_id = request.args.get("category_id")
    year = request.args.get("year")
    search = request.args.get("search")
    language = request.args.get("language")
    verified_only = request.args.get("verified_only", "true").lower() == "true"

    papers = db.get_papers(
        exam_id=exam_id,
        category_id=category_id,
        year=year,
        search=search,
        language=language,
        verified_only=verified_only
    )

    # Attach exam details
    all_exams = {e["id"]: e for e in db.get_exams()}
    for p in papers:
        p["exam_name"] = all_exams.get(p.get("exam_id"), {}).get("name", "Kerala Competitive Exam")
        p["exam_code"] = all_exams.get(p.get("exam_id"), {}).get("code", "")

    return jsonify(papers)

@app.route("/api/papers/<paper_id>", methods=["GET"])
def get_paper_detail(paper_id):
    paper = db.get_paper(paper_id)
    if not paper:
        return jsonify({"error": "Question paper not found"}), 404
    exam = db.get_exam(paper.get("exam_id"))
    questions = db.get_questions_by_paper(paper_id)
    return jsonify({
        **paper,
        "exam": exam,
        "questions_count": len(questions)
    })

@app.route("/api/papers", methods=["POST"])
def create_paper_manual():
    data = request.json or {}
    if not data.get("paper_code") or not data.get("exam_id"):
        return jsonify({"error": "Paper code and exam_id are required"}), 400

    # Ensure hash exists or generate one
    if not data.get("file_hash"):
        data["file_hash"] = PDFProcessor.calculate_file_hash(data.get("paper_code", "").encode())

    # Set as verified if uploaded by admin
    if "is_verified" not in data:
        data["is_verified"] = True
        data["status"] = "APPROVED"
        data["verified_by"] = "Administrator (Manual Upload)"

    created = db.create_paper(data)
    return jsonify(created), 201

@app.route("/api/papers/<paper_id>", methods=["PUT"])
def update_paper(paper_id):
    data = request.json or {}
    updated = db.update_paper(paper_id, data)
    if not updated:
        return jsonify({"error": "Question paper not found"}), 404
    return jsonify(updated)

@app.route("/api/papers/<paper_id>", methods=["DELETE"])
def delete_paper(paper_id):
    success = db.delete_paper(paper_id)
    return jsonify({"success": success})

# ----------------- QUESTIONS & INTERACTIVE TESTS -----------------
@app.route("/api/papers/<paper_id>/questions", methods=["GET"])
def get_paper_questions(paper_id):
    paper = db.get_paper(paper_id)
    if not paper:
        return jsonify({"error": "Paper not found"}), 404
    questions = db.get_questions_by_paper(paper_id)
    exam = db.get_exam(paper.get("exam_id"))

    # Mask correct answer and explanation if requested in student test mode
    is_test_mode = request.args.get("test_mode", "false").lower() == "true"
    sanitized_questions = []
    for q in questions:
        q_copy = dict(q)
        if is_test_mode:
            q_copy.pop("correct_option", None)
            q_copy.pop("explanation", None)
            q_copy.pop("explanation_malayalam", None)
        sanitized_questions.append(q_copy)

    return jsonify({
        "paper": paper,
        "exam": exam,
        "questions": sanitized_questions,
        "total_questions": len(sanitized_questions),
        "duration_minutes": paper.get("duration_minutes", 75),
        "negative_marking": 0.33,
        "marks_per_question": 1.0
    })

@app.route("/api/papers/<paper_id>/questions", methods=["POST"])
def add_question_to_paper(paper_id):
    data = request.json or {}
    data["paper_id"] = paper_id
    if not data.get("question_text") or not data.get("options"):
        return jsonify({"error": "Question text and options are required"}), 400
    created = db.add_question(data)
    return jsonify(created), 201

# ----------------- FILE DOWNLOADS & SERVING -----------------
@app.route("/api/papers/download/<filename>", methods=["GET"])
def download_paper(filename):
    safe_name = secure_filename(filename)
    file_path = os.path.join(Config.PAPERS_FOLDER, safe_name)
    if not os.path.exists(file_path):
        # Generate placeholder valid PDF on the fly if needed
        PDFProcessor.create_official_styled_pdf(
            filepath=file_path,
            title="Kerala Question Paper",
            exam_name="Kerala Competitive Examination",
            paper_code=safe_name.replace(".pdf", ""),
            year=2023,
            is_sample=True
        )
    return send_file(file_path, mimetype="application/pdf", as_attachment=False)

@app.route("/api/papers/answer-key/<filename>", methods=["GET"])
def download_answer_key(filename):
    safe_name = secure_filename(filename)
    file_path = os.path.join(Config.KEYS_FOLDER, safe_name)
    if not os.path.exists(file_path):
        PDFProcessor.create_official_styled_pdf(
            filepath=file_path,
            title="Official Final Answer Key",
            exam_name="Kerala Competitive Examination - FINAL KEY",
            paper_code=safe_name.replace(".pdf", ""),
            year=2023,
            is_sample=False
        )
    return send_file(file_path, mimetype="application/pdf", as_attachment=False)

@app.route("/api/papers/upload", methods=["POST"])
def upload_paper_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    dest_path = os.path.join(Config.PAPERS_FOLDER, filename)
    file.save(dest_path)

    # Process with PyMuPDF
    file_hash = PDFProcessor.calculate_file_hash(dest_path)
    metadata = PDFProcessor.extract_text_and_metadata(dest_path)
    extracted_questions = PDFProcessor.extract_questions_from_text(metadata.get("raw_text", ""))

    return jsonify({
        "filename": filename,
        "file_url": f"/api/papers/download/{filename}",
        "file_hash": file_hash,
        "file_size": metadata["file_size"],
        "page_count": metadata["page_count"],
        "detected_year": metadata["detected_year"],
        "detected_code": metadata["detected_code"],
        "detected_language": metadata["detected_language"],
        "questions_parsed_count": len(extracted_questions),
        "questions_preview": extracted_questions[:5]
    })

# ----------------- ATTEMPTS & TEST EVALUATION -----------------
@app.route("/api/attempts", methods=["POST"])
def submit_attempt():
    """
    Submits student responses for automatic evaluation.
    Kerala PSC standard marking scheme:
    Correct: +1.0 mark
    Incorrect: -0.33 mark
    Unattempted: 0 mark
    """
    data = request.json or {}
    user_id = data.get("user_id") or get_current_user_id()
    paper_id = data.get("paper_id")
    submitted_answers = data.get("answers", {}) # {question_id: "A" | "B" | "C" | "D"}
    time_spent_seconds = data.get("time_spent_seconds", 0)

    # Fetch ground truth questions
    if paper_id.startswith("ai-test-"):
        # Custom AI practice test passed in request
        questions = data.get("test_questions", [])
    else:
        questions = db.get_questions_by_paper(paper_id)

    correct_count = 0
    incorrect_count = 0
    unattempted_count = 0
    question_evaluations = []

    for q in questions:
        q_id = q["id"]
        correct_opt = q.get("correct_option")
        chosen_opt = submitted_answers.get(q_id)

        if not chosen_opt:
            status = "UNATTEMPTED"
            unattempted_count += 1
            delta = 0.0
        elif chosen_opt == correct_opt:
            status = "CORRECT"
            correct_count += 1
            delta = 1.0
        else:
            status = "INCORRECT"
            incorrect_count += 1
            delta = -0.33

        question_evaluations.append({
            "question_id": q_id,
            "question_number": q.get("question_number"),
            "question_text": q.get("question_text"),
            "question_text_malayalam": q.get("question_text_malayalam"),
            "chosen_option": chosen_opt,
            "correct_option": correct_opt,
            "explanation": q.get("explanation"),
            "explanation_malayalam": q.get("explanation_malayalam"),
            "topic": q.get("topic"),
            "status": status,
            "score_delta": delta
        })

    raw_score = (correct_count * 1.0) - (incorrect_count * 0.33)
    final_score = round(max(0.0, raw_score), 2)
    max_score = float(len(questions))
    accuracy = round((correct_count / max(1, (correct_count + incorrect_count))) * 100, 1)

    attempt_record = {
        "user_id": user_id,
        "paper_id": paper_id,
        "score": final_score,
        "max_score": max_score,
        "accuracy_pct": accuracy,
        "correct_count": correct_count,
        "incorrect_count": incorrect_count,
        "unattempted_count": unattempted_count,
        "time_spent_seconds": time_spent_seconds,
        "evaluations": question_evaluations
    }

    saved = db.save_attempt(attempt_record)
    return jsonify(saved), 201

@app.route("/api/students/<user_id>/attempts", methods=["GET"])
def get_student_attempts(user_id):
    attempts = db.get_user_attempts(user_id)
    all_papers = {p["id"]: p for p in db.get_papers(verified_only=False)}
    all_exams = {e["id"]: e for e in db.get_exams()}

    for a in attempts:
        p_id = a.get("paper_id")
        paper = all_papers.get(p_id, {})
        a["paper_code"] = paper.get("paper_code", "AI Practice Test")
        a["session_name"] = paper.get("session_name", "AI Practice Session")
        exam_id = paper.get("exam_id")
        a["exam_name"] = all_exams.get(exam_id, {}).get("name", "Kerala Competitive Examination")

    return jsonify(attempts)

@app.route("/api/students/<user_id>/stats", methods=["GET"])
def get_student_stats(user_id):
    attempts = db.get_user_attempts(user_id)
    bookmarks = db.get_user_bookmarks(user_id)
    favorites = db.get_user_favorites(user_id)

    total_attempts = len(attempts)
    avg_score = round(sum(a.get("score", 0) for a in attempts) / max(1, total_attempts), 1) if attempts else 0
    total_correct = sum(a.get("correct_count", 0) for a in attempts)
    total_attempted = sum((a.get("correct_count", 0) + a.get("incorrect_count", 0)) for a in attempts)
    accuracy = round((total_correct / max(1, total_attempted)) * 100, 1) if total_attempted else 0

    return jsonify({
        "user_id": user_id,
        "total_tests_attempted": total_attempts,
        "average_score": avg_score,
        "accuracy_pct": accuracy,
        "study_streak_days": 14,
        "bookmarks_count": len(bookmarks),
        "favorites_count": len(favorites),
        "recent_attempts": attempts[:3]
    })

# ----------------- BOOKMARKS & FAVORITES -----------------
@app.route("/api/students/<user_id>/bookmarks", methods=["GET"])
def get_bookmarks(user_id):
    return jsonify(db.get_user_bookmarks(user_id))

@app.route("/api/students/<user_id>/bookmarks", methods=["POST"])
def toggle_bookmark(user_id):
    data = request.json or {}
    q_id = data.get("question_id")
    note = data.get("note", "")
    if not q_id:
        return jsonify({"error": "question_id required"}), 400
    res = db.toggle_bookmark(user_id, q_id, note)
    return jsonify(res)

@app.route("/api/students/<user_id>/favorites", methods=["GET"])
def get_favorites(user_id):
    fav_ids = db.get_user_favorites(user_id)
    all_exams = {e["id"]: e for e in db.get_exams()}
    fav_exams = [all_exams[eid] for eid in fav_ids if eid in all_exams]
    return jsonify({"favorite_ids": fav_ids, "exams": fav_exams})

@app.route("/api/students/<user_id>/favorites", methods=["POST"])
def toggle_favorite(user_id):
    data = request.json or {}
    exam_id = data.get("exam_id")
    if not exam_id:
        return jsonify({"error": "exam_id required"}), 400
    res = db.toggle_favorite(user_id, exam_id)
    return jsonify(res)

# ----------------- COLLECTION ENGINE & AUDIT -----------------
@app.route("/api/collection/run", methods=["POST"])
def trigger_collection():
    data = request.json or {}
    source_id = data.get("source_id")
    result = collection_engine.run_collection(source_id=source_id)
    return jsonify(result)

@app.route("/api/collection/sources", methods=["GET"])
def get_sources():
    return jsonify(db.get_sources())

@app.route("/api/collection/sources", methods=["POST"])
def add_source():
    data = request.json or {}
    if not data.get("name") or not data.get("base_url"):
        return jsonify({"error": "Source name and base_url required"}), 400
    created = db.add_source(data)
    return jsonify(created), 201

@app.route("/api/collection/sources/<src_id>", methods=["PUT"])
def update_source(src_id):
    data = request.json or {}
    updated = db.update_source(src_id, data)
    return jsonify(updated)

@app.route("/api/collection/unverified", methods=["GET"])
def get_unverified_queue():
    queue = db.get_unverified_queue()
    all_exams = {e["id"]: e for e in db.get_exams()}
    for p in queue:
        p["exam_name"] = all_exams.get(p.get("exam_id"), {}).get("name", "Kerala Competitive Exam")
    return jsonify(queue)

@app.route("/api/collection/approve/<paper_id>", methods=["POST"])
def approve_paper(paper_id):
    data = request.json or {}
    admin_name = data.get("admin_name", "Senior Administrator")
    approved = db.approve_paper(paper_id, admin_name=admin_name)
    if not approved:
        return jsonify({"error": "Paper not found"}), 404
    return jsonify(approved)

@app.route("/api/collection/reject/<paper_id>", methods=["POST"])
def reject_paper(paper_id):
    data = request.json or {}
    reason = data.get("reason", "Document does not match quality guidelines")
    rejected = db.reject_paper(paper_id, reason=reason)
    if not rejected:
        return jsonify({"error": "Paper not found"}), 404
    return jsonify(rejected)

@app.route("/api/collection/audit", methods=["GET"])
def get_audit_report():
    return jsonify(db.get_audit_reports())

@app.route("/api/collection/audit/run", methods=["POST"])
def run_audit():
    res = collection_engine.run_full_audit()
    return jsonify(res)

# ----------------- AI ANALYSIS MODULE -----------------
@app.route("/api/ai/repeated-questions", methods=["GET"])
def get_ai_repeated_questions():
    exam_id = request.args.get("exam_id")
    repeats = ai_service.identify_repeated_questions(exam_id=exam_id)
    return jsonify(repeats)

@app.route("/api/ai/topic-frequency", methods=["GET"])
def get_ai_topic_frequency():
    exam_id = request.args.get("exam_id")
    trends = ai_service.calculate_topic_frequency_and_trends(exam_id=exam_id)
    return jsonify(trends)

@app.route("/api/ai/practice-test", methods=["POST"])
def generate_ai_practice_test():
    data = request.json or {}
    topic = data.get("topic")
    difficulty = data.get("difficulty")
    count = int(data.get("count", 10))
    test = ai_service.generate_custom_practice_test(topic=topic, difficulty=difficulty, count=count)
    return jsonify(test)

@app.route("/api/ai/student-diagnostic/<user_id>", methods=["GET"])
def get_student_diagnostic(user_id):
    diagnostic = ai_service.analyze_student_performance(user_id)
    return jsonify(diagnostic)

# ----------------- USERS & AUTH -----------------
@app.route("/api/users", methods=["GET"])
def list_users():
    return jsonify(db.get_users())

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email", "").lower().strip()
    users = db.get_users()
    matched = next((u for u in users if u["email"].lower() == email), None)

    if not matched:
        # Auto register as student
        name = email.split("@")[0].replace(".", " ").title()
        role = "ADMIN" if "admin" in email else "STUDENT"
        new_usr = {
            "id": f"usr-{int(os.urandom(3).hex(), 16)}",
            "email": email,
            "name": name,
            "role": role,
            "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={name}",
            "created_at": "2024-01-01T00:00:00Z"
        }
        data_all = db._read_local()
        data_all["users"].append(new_usr)
        db._write_local(data_all)
        matched = new_usr

    token = "admin-token" if matched["role"] == "ADMIN" else "student-token"
    return jsonify({
        "user": matched,
        "token": token
    })

# ----------------- SUBJECTS -----------------
@app.route("/api/subjects", methods=["GET"])
def list_subjects():
    subjects = db.get_subjects()
    # Enrich with question counts
    data_local = db._read_local()
    all_qs = data_local.get("questions", [])
    for s in subjects:
        s["question_count"] = sum(1 for q in all_qs if q.get("subject_id") == s["id"] and q.get("is_verified", True))
        topics = db.get_topics(s["id"])
        s["topic_count"] = len(topics)
    return jsonify(subjects)

@app.route("/api/subjects", methods=["POST"])
def create_subject():
    data = request.json or {}
    if not data.get("name"):
        return jsonify({"error": "Subject name is required"}), 400
    created = db.create_subject(data)
    return jsonify(created), 201

@app.route("/api/subjects/<subject_id>", methods=["GET"])
def get_subject_detail(subject_id):
    subject = db.get_subject(subject_id)
    if not subject:
        return jsonify({"error": "Subject not found"}), 404
    topics = db.get_topics(subject_id)
    return jsonify({**subject, "topics": topics})

@app.route("/api/subjects/<subject_id>", methods=["PUT"])
def update_subject(subject_id):
    data = request.json or {}
    updated = db.update_subject(subject_id, data)
    if not updated:
        return jsonify({"error": "Subject not found"}), 404
    return jsonify(updated)

@app.route("/api/subjects/<subject_id>/questions", methods=["GET"])
def get_subject_questions(subject_id):
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    result = db.get_questions_filtered(subject_id=subject_id, page=page, limit=limit)
    return jsonify(result)

# ----------------- TOPICS -----------------
@app.route("/api/topics", methods=["GET"])
def list_topics():
    subject_id = request.args.get("subject_id")
    topics = db.get_topics(subject_id=subject_id)
    # Enrich with question count
    data_local = db._read_local()
    all_qs = data_local.get("questions", [])
    for t in topics:
        t["question_count"] = sum(1 for q in all_qs if q.get("topic_id") == t["id"] and q.get("is_verified", True))
    return jsonify(topics)

@app.route("/api/topics", methods=["POST"])
def create_topic():
    data = request.json or {}
    if not data.get("name") or not data.get("subject_id"):
        return jsonify({"error": "Topic name and subject_id are required"}), 400
    created = db.create_topic(data)
    return jsonify(created), 201

@app.route("/api/topics/<topic_id>", methods=["GET"])
def get_topic_detail(topic_id):
    topic = db.get_topic(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found"}), 404
    return jsonify(topic)

@app.route("/api/topics/<topic_id>", methods=["PUT"])
def update_topic(topic_id):
    data = request.json or {}
    updated = db.update_topic(topic_id, data)
    if not updated:
        return jsonify({"error": "Topic not found"}), 404
    return jsonify(updated)

@app.route("/api/topics/<topic_id>/questions", methods=["GET"])
def get_topic_questions(topic_id):
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    test_mode = request.args.get("test_mode", "false").lower() == "true"
    result = db.get_questions_filtered(topic_id=topic_id, page=page, limit=limit)
    if test_mode:
        for q in result.get("questions", []):
            q.pop("correct_option", None)
            q.pop("explanation", None)
            q.pop("explanation_malayalam", None)
    return jsonify(result)

# ----------------- QUESTIONS (PHASE 2 ADMIN CRUD) -----------------
@app.route("/api/questions", methods=["GET"])
def list_question_bank():
    subject_id = request.args.get("subject_id")
    topic_id = request.args.get("topic_id")
    exam_id = request.args.get("exam_id")
    difficulty = request.args.get("difficulty")
    verified_only = request.args.get("verified_only", "true").lower() == "true"
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    result = db.get_questions_filtered(
        subject_id=subject_id, topic_id=topic_id, exam_id=exam_id,
        difficulty=difficulty, verified_only=verified_only, page=page, limit=limit
    )
    return jsonify(result)

@app.route("/api/questions", methods=["POST"])
def create_question_admin():
    data = request.json or {}
    if not data.get("question_text") or not data.get("options"):
        return jsonify({"error": "question_text and options are required"}), 400
    if "is_verified" not in data:
        data["is_verified"] = False  # Admin must explicitly verify
    created = db.create_question(data)
    return jsonify(created), 201

@app.route("/api/questions/<q_id>", methods=["GET"])
def get_question_detail(q_id):
    q = db.get_question(q_id)
    if not q:
        return jsonify({"error": "Question not found"}), 404
    return jsonify(q)

@app.route("/api/questions/<q_id>", methods=["PUT"])
def update_question_admin(q_id):
    data = request.json or {}
    updated = db.update_question(q_id, data)
    if not updated:
        return jsonify({"error": "Question not found"}), 404
    return jsonify(updated)

@app.route("/api/questions/<q_id>", methods=["DELETE"])
def delete_question_admin(q_id):
    success = db.delete_question(q_id)
    return jsonify({"success": success})

@app.route("/api/questions/<q_id>/ai-explanation", methods=["POST"])
def generate_ai_explanation(q_id):
    q = db.get_question(q_id)
    if not q:
        return jsonify({"error": "Question not found"}), 404
    data = request.json or {}
    language = data.get("language", "both")
    try:
        from services.ai_explanation import ai_explanation_service
        result = ai_explanation_service.generate_explanation(q, language=language)
    except Exception as e:
        result = {
            "disclaimer": "⚠️ AI-generated explanation. NOT an official verified answer. This is an AI analysis only.",
            "explanation_en": q.get("explanation", "No explanation available."),
            "explanation_ml": q.get("explanation_malayalam", ""),
            "why_correct": f"Option {q.get('correct_option')} is the correct answer based on the question content.",
            "why_others_wrong": "Other options are incorrect based on factual analysis.",
            "confidence": "low",
            "source": "fallback"
        }
    return jsonify(result)

# ----------------- MOCK TESTS -----------------
@app.route("/api/mock-tests", methods=["GET"])
def list_mock_tests():
    exam_id = request.args.get("exam_id")
    mts = db.get_mock_tests(exam_id=exam_id)
    all_exams = {e["id"]: e for e in db.get_exams()}
    for m in mts:
        exam = all_exams.get(m.get("exam_id"), {})
        m["exam_name"] = exam.get("name", "Kerala Competitive Exam")
        m["exam_code"] = exam.get("code", "")
        # Get actual question count for this mock test
        q_ids = m.get("question_ids", [])
        if not q_ids:
            # Use all verified questions as a pool if no specific questions assigned
            pool = db.get_questions_filtered(verified_only=True, limit=1000)
            m["available_questions"] = pool.get("total", 0)
        else:
            m["available_questions"] = len(q_ids)
    return jsonify(mts)

@app.route("/api/mock-tests", methods=["POST"])
def create_mock_test():
    data = request.json or {}
    if not data.get("name") or not data.get("exam_id"):
        return jsonify({"error": "Mock test name and exam_id are required"}), 400
    created = db.create_mock_test(data)
    return jsonify(created), 201

@app.route("/api/mock-tests/<mt_id>", methods=["GET"])
def get_mock_test_detail(mt_id):
    mt = db.get_mock_test(mt_id)
    if not mt:
        return jsonify({"error": "Mock test not found"}), 404
    # Fetch the actual questions for the test
    q_ids = mt.get("question_ids", [])
    if q_ids:
        all_local = db._read_local()
        questions = [q for q in all_local.get("questions", []) if q["id"] in q_ids and q.get("is_verified", True)]
    else:
        # Pull from general pool limited to test size
        result = db.get_questions_filtered(verified_only=True, limit=mt.get("total_questions", 20))
        questions = result.get("questions", [])
    return jsonify({
        **mt,
        "questions": questions,
        "question_count": len(questions)
    })

@app.route("/api/mock-tests/<mt_id>", methods=["PUT"])
def update_mock_test(mt_id):
    data = request.json or {}
    updated = db.update_mock_test(mt_id, data)
    if not updated:
        return jsonify({"error": "Mock test not found"}), 404
    return jsonify(updated)

@app.route("/api/mock-tests/<mt_id>", methods=["DELETE"])
def delete_mock_test(mt_id):
    success = db.delete_mock_test(mt_id)
    return jsonify({"success": success})

@app.route("/api/mock-tests/<mt_id>/attempt", methods=["POST"])
def submit_mock_attempt(mt_id):
    """Submit a mock test attempt - reuses the same evaluation logic as regular attempts"""
    mt = db.get_mock_test(mt_id)
    if not mt:
        return jsonify({"error": "Mock test not found"}), 404

    data = request.json or {}
    data["paper_id"] = f"mock-{mt_id}"
    data["mock_test_id"] = mt_id
    data["mock_test_name"] = mt.get("name", "Mock Test")
    data["marks_per_question"] = mt.get("marks_per_question", 1.0)
    neg_mark = mt.get("negative_marking", 0.33)

    user_id = data.get("user_id") or get_current_user_id()
    submitted_answers = data.get("answers", {})
    time_spent_seconds = data.get("time_spent_seconds", 0)

    # Get questions for this mock test
    q_ids = mt.get("question_ids", [])
    if q_ids:
        all_local = db._read_local()
        questions = [q for q in all_local.get("questions", []) if q["id"] in q_ids]
    else:
        result = db.get_questions_filtered(verified_only=True, limit=mt.get("total_questions", 20))
        questions = result.get("questions", [])

    correct_count = 0
    incorrect_count = 0
    unattempted_count = 0
    question_evaluations = []
    mpq = mt.get("marks_per_question", 1.0)

    for q in questions:
        q_id = q["id"]
        correct_opt = q.get("correct_option")
        chosen_opt = submitted_answers.get(q_id)
        if not chosen_opt:
            status = "UNATTEMPTED"
            unattempted_count += 1
            delta = 0.0
        elif chosen_opt == correct_opt:
            status = "CORRECT"
            correct_count += 1
            delta = mpq
        else:
            status = "INCORRECT"
            incorrect_count += 1
            delta = -neg_mark * mpq

        question_evaluations.append({
            "question_id": q_id,
            "question_number": q.get("question_number"),
            "question_text": q.get("question_text"),
            "question_text_malayalam": q.get("question_text_malayalam"),
            "chosen_option": chosen_opt,
            "correct_option": correct_opt,
            "explanation": q.get("explanation"),
            "explanation_malayalam": q.get("explanation_malayalam"),
            "topic": q.get("topic"),
            "subject_id": q.get("subject_id"),
            "topic_id": q.get("topic_id"),
            "status": status,
            "score_delta": delta
        })

    raw_score = (correct_count * mpq) - (incorrect_count * neg_mark * mpq)
    final_score = round(max(0.0, raw_score), 2)
    max_score = float(len(questions)) * mpq
    accuracy = round((correct_count / max(1, correct_count + incorrect_count)) * 100, 1)

    attempt_record = {
        "user_id": user_id,
        "paper_id": f"mock-{mt_id}",
        "mock_test_id": mt_id,
        "mock_test_name": mt.get("name", "Mock Test"),
        "score": final_score,
        "max_score": max_score,
        "accuracy_pct": accuracy,
        "correct_count": correct_count,
        "incorrect_count": incorrect_count,
        "unattempted_count": unattempted_count,
        "time_spent_seconds": time_spent_seconds,
        "evaluations": question_evaluations
    }

    saved = db.save_attempt(attempt_record)
    return jsonify(saved), 201

# ----------------- DAILY CHALLENGE -----------------
@app.route("/api/daily-challenge", methods=["GET"])
def get_daily_challenge():
    user_id = request.args.get("user_id") or get_current_user_id()
    count = int(request.args.get("count", 10))
    today = datetime.date.today().isoformat()
    challenge = db.get_daily_challenge(today, count=count)

    # Check if user already participated today
    daily_data = db._read_local()
    participation = next(
        (p for p in daily_data.get("daily_participation", [])
         if p.get("user_id") == user_id and p.get("date") == today),
        None
    )

    streak = db.get_daily_streak(user_id)
    return jsonify({
        "challenge": challenge,
        "already_participated": participation is not None,
        "participation": participation,
        "streak": streak,
        "today": today
    })

@app.route("/api/daily-challenge/submit", methods=["POST"])
def submit_daily_challenge():
    data = request.json or {}
    user_id = data.get("user_id") or get_current_user_id()
    challenge_date = data.get("date", datetime.date.today().isoformat())
    answers = data.get("answers", {})

    # Get the challenge for that date
    daily_data = db._read_local()
    challenges = daily_data.get("daily_challenges", [])
    challenge = next((c for c in challenges if c.get("date") == challenge_date), None)
    if not challenge:
        return jsonify({"error": "Challenge not found for this date"}), 404

    # Evaluate answers
    all_qs = {q["id"]: q for q in daily_data.get("questions", [])}
    correct = 0
    incorrect = 0
    evaluations = []
    for q_id in challenge.get("question_ids", []):
        q = all_qs.get(q_id)
        if not q:
            continue
        chosen = answers.get(q_id)
        correct_opt = q.get("correct_option")
        if not chosen:
            status = "UNATTEMPTED"
        elif chosen == correct_opt:
            status = "CORRECT"
            correct += 1
        else:
            status = "INCORRECT"
            incorrect += 1
        evaluations.append({
            "question_id": q_id,
            "question_text": q.get("question_text"),
            "chosen_option": chosen,
            "correct_option": correct_opt,
            "explanation": q.get("explanation"),
            "status": status
        })

    total = len(challenge.get("question_ids", []))
    score = round((correct / max(1, total)) * 100, 1)
    participation = db.save_daily_participation(user_id, challenge_date, answers, score, correct, incorrect, total)
    return jsonify({"participation": participation, "evaluations": evaluations, "streak": db.get_daily_streak(user_id)})

@app.route("/api/students/<user_id>/daily-history", methods=["GET"])
def get_daily_history(user_id):
    days = int(request.args.get("days", 30))
    history = db.get_daily_history(user_id, days=days)
    streak = db.get_daily_streak(user_id)
    return jsonify({"history": history, "streak": streak, "total_completed": len(history)})

# ----------------- STUDENT PERFORMANCE (PHASE 2) -----------------
@app.route("/api/students/<user_id>/performance", methods=["GET"])
def get_student_performance(user_id):
    summary = db.get_user_performance_summary(user_id)
    return jsonify(summary)

# ----------------- ANALYSIS (HISTORICAL) -----------------
@app.route("/api/analysis/repeated-questions", methods=["GET"])
def get_analysis_repeated():
    exam_id = request.args.get("exam_id")
    subject_id = request.args.get("subject_id")
    topic_id = request.args.get("topic_id")
    # Delegate to AI service but filter results
    repeats = ai_service.identify_repeated_questions(exam_id=exam_id)
    if subject_id:
        repeats = [r for r in repeats if r.get("subject_id") == subject_id]
    if topic_id:
        repeats = [r for r in repeats if r.get("topic_id") == topic_id]
    return jsonify({
        "data": repeats,
        "disclaimer": "This is based on historical question paper data only. No predictions are made.",
        "source": "historical_analysis"
    })

@app.route("/api/analysis/topic-frequency", methods=["GET"])
def get_analysis_topic_frequency():
    exam_id = request.args.get("exam_id")
    subject_id = request.args.get("subject_id")
    trends = ai_service.calculate_topic_frequency_and_trends(exam_id=exam_id)
    if subject_id and isinstance(trends, list):
        trends = [t for t in trends if t.get("subject_id") == subject_id]
    return jsonify({
        "data": trends,
        "disclaimer": "Topic frequency calculated from historical verified question papers only.",
        "source": "historical_analysis"
    })

# Serve frontend build in production
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if os.path.exists(os.path.join(app.static_folder, "index.html")):
        return send_from_directory(app.static_folder, "index.html")
    return jsonify({
        "message": "Kerala PYQ Hub API is running. Vite dev server handles frontend during development."
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=True)