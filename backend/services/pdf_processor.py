import os
import re
import hashlib
from pathlib import Path
import pymupdf # modern PyMuPDF import

class PDFProcessor:
    @staticmethod
    def calculate_file_hash(filepath_or_bytes):
        """Calculates SHA-256 hash of a file or byte stream to detect duplicates"""
        sha256 = hashlib.sha256()
        if isinstance(filepath_or_bytes, (str, Path)):
            with open(filepath_or_bytes, "rb") as f:
                while chunk := f.read(8192):
                    sha256.update(chunk)
        else:
            sha256.update(filepath_or_bytes)
        return sha256.hexdigest()

    @staticmethod
    def extract_text_and_metadata(pdf_path):
        """Extracts text, metadata and layout attributes from a PDF"""
        doc = pymupdf.open(pdf_path)
        metadata = {
            "title": doc.metadata.get("title", ""),
            "author": doc.metadata.get("author", ""),
            "subject": doc.metadata.get("subject", ""),
            "page_count": len(doc),
            "file_size": os.path.getsize(pdf_path) if os.path.exists(pdf_path) else 0
        }

        full_text = []
        for page_num in range(len(doc)):
            page = doc[page_num]
            full_text.append(f"--- PAGE {page_num + 1} ---\n" + page.get_text())

        raw_text = "\n".join(full_text)

        # Heuristic metadata extraction
        detected_year = None
        year_match = re.search(r"\b(20[12][0-9])\b", raw_text)
        if year_match:
            detected_year = int(year_match.group(1))

        detected_code = None
        code_match = re.search(r"(?:Question Code|Paper Code|Alpha Code|Code No)[:.\s]*([0-9]{2,3}/[0-9]{4}(?:-[A-Z])?)", raw_text, re.IGNORECASE)
        if not code_match:
            code_match = re.search(r"\b([0-9]{2,3}/[0-9]{4}-[A-Z])\b", raw_text)
        if code_match:
            detected_code = code_match.group(1)

        # Detect language
        has_malayalam = bool(re.search(r"[\u0D00-\u0D7F]", raw_text))
        has_english = bool(re.search(r"[a-zA-Z]{4,}", raw_text))
        detected_lang = "Malayalam & English" if (has_malayalam and has_english) else ("Malayalam" if has_malayalam else "English")

        metadata["detected_year"] = detected_year
        metadata["detected_code"] = detected_code
        metadata["detected_language"] = detected_lang
        metadata["raw_text"] = raw_text

        doc.close()
        return metadata

    @staticmethod
    def extract_questions_from_text(raw_text):
        """
        Extracts structured multiple-choice questions from raw examination text.
        Recognizes question numbering (e.g., 1., 2., Q1, etc.) and options (A), (B), (C), (D)
        """
        questions = []
        # Pattern to split by question start
        pattern = re.compile(r"(?:(?<=\n)|^)[\s]*([0-9]{1,3})[\s]*[.)][\s]+(.*?)(?=(?:(?<=\n)|^)[\s]*[0-9]{1,3}[\s]*[.)]|\Z)", re.DOTALL)
        matches = pattern.findall(raw_text)

        for match in matches:
            q_num = int(match[0])
            q_body = match[1].strip()

            # Attempt to split options A, B, C, D
            opt_pattern = re.compile(r"(?:\((?:[A-Da-d])\)|(?:[A-Da-d]\.))\s*(.*?)(?=(?:\((?:[A-Da-d])\)|(?:[A-Da-d]\.))|\Z)", re.DOTALL)
            opt_matches = opt_pattern.findall(q_body)

            options = []
            if len(opt_matches) >= 4:
                # Text before the first option is the question statement
                first_opt_idx = re.search(r"(?:\((?:[A-Da-d])\)|(?:[A-Da-d]\.))", q_body)
                q_text = q_body[:first_opt_idx.start()].strip() if first_opt_idx else q_body

                labels = ["A", "B", "C", "D"]
                for i in range(min(4, len(opt_matches))):
                    options.append({
                        "id": labels[i],
                        "text": opt_matches[i].strip()
                    })
            else:
                q_text = q_body

            questions.append({
                "question_number": q_num,
                "question_text": q_text,
                "options": options
            })

        return questions

    @staticmethod
    def create_official_styled_pdf(filepath, title, exam_name, paper_code, year, duration_mins=75, questions=None, is_sample=False):
        """
        Creates a PDF document for offline download & viewing.
        Uses PyMuPDF to draw clean government/exam style layouts.
        """
        doc = pymupdf.open()
        page = doc.new_page(width=595, height=842) # A4 format

        # Header Box
        header_rect = pymupdf.Rect(30, 25, 565, 120)
        page.draw_rect(header_rect, color=(0.1, 0.3, 0.2), width=1.5)

        # Title & Banner
        page.insert_text((40, 50), "KERALA COMPETITIVE EXAMINATIONS COMMISSION", fontsize=11, fontname="helv", color=(0.1, 0.2, 0.4))
        page.insert_text((40, 72), f"{exam_name.upper()}", fontsize=13, fontname="helv", color=(0.05, 0.05, 0.05))
        page.insert_text((40, 92), f"QUESTION BOOKLET - ALPHA CODE: A | PAPER CODE: {paper_code} | YEAR: {year}", fontsize=9, fontname="helv", color=(0.3, 0.3, 0.3))
        page.insert_text((40, 110), f"Max Marks: 100  |  Duration: {duration_mins} Minutes  |  Negative Marking: 0.33 Mark", fontsize=8.5, fontname="helv", color=(0.2, 0.2, 0.2))

        if is_sample:
            # Watermark notice
            page.insert_text((380, 48), "[SAMPLE BENCHMARK SET]", fontsize=9, fontname="helv", color=(0.8, 0.2, 0.2))

        # Instructions bar
        instr_rect = pymupdf.Rect(30, 130, 565, 165)
        page.draw_rect(instr_rect, fill=(0.95, 0.96, 0.98), color=(0.8, 0.8, 0.8))
        page.insert_text((40, 145), "INSTRUCTIONS TO CANDIDATES:", fontsize=8.5, fontname="helv", color=(0.1, 0.1, 0.1))
        page.insert_text((40, 158), "1. Check that the Question Booklet contains all pages. 2. Mark your answers strictly on the OMR Answer Sheet.", fontsize=7.5, fontname="helv", color=(0.3, 0.3, 0.3))

        # Questions listing
        y = 190
        sample_questions = questions or [
            {
                "num": 1,
                "text": "Who led the Kallumala Samaram in Kerala in 1915?",
                "opts": ["(A) Sree Narayana Guru", "(B) Ayyankali", "(C) Vaikunda Swamikal", "(D) Chattampi Swamikal"]
            },
            {
                "num": 2,
                "text": "Which Article of the Constitution of India provides for State Public Service Commissions?",
                "opts": ["(A) Article 312", "(B) Article 315", "(C) Article 324", "(D) Article 280"]
            },
            {
                "num": 3,
                "text": "Which is the longest river flowing entirely within Kerala?",
                "opts": ["(A) Periyar", "(B) Bharathapuzha", "(C) Pamba", "(D) Chaliyar"]
            },
            {
                "num": 4,
                "text": "The SI unit of electric power is:",
                "opts": ["(A) Joule", "(B) Ampere", "(C) Watt", "(D) Volt"]
            },
            {
                "num": 5,
                "text": "The average of five consecutive even numbers is 28. Find the smallest number.",
                "opts": ["(A) 22", "(B) 24", "(C) 26", "(D) 28"]
            }
        ]

        for q in sample_questions:
            if y > 760:
                page = doc.new_page(width=595, height=842)
                y = 40

            page.insert_text((35, y), f"{q.get('num', q.get('question_number', 1))}.", fontsize=9.5, fontname="helv", color=(0.1, 0.1, 0.1))
            page.insert_text((55, y), f"{q.get('text', q.get('question_text', ''))[:110]}", fontsize=9, fontname="helv", color=(0.05, 0.05, 0.05))
            y += 18

            opts = q.get("opts")
            if not opts and "options" in q:
                opts = [f"({opt['id']}) {opt['text']}" for opt in q["options"]]
            opts = opts or ["(A) Option A", "(B) Option B", "(C) Option C", "(D) Option D"]

            # Draw options in 2 columns
            page.insert_text((60, y), str(opts[0])[:40], fontsize=8.5, fontname="helv", color=(0.25, 0.25, 0.25))
            page.insert_text((300, y), str(opts[1])[:40] if len(opts) > 1 else "", fontsize=8.5, fontname="helv", color=(0.25, 0.25, 0.25))
            y += 15
            page.insert_text((60, y), str(opts[2])[:40] if len(opts) > 2 else "", fontsize=8.5, fontname="helv", color=(0.25, 0.25, 0.25))
            page.insert_text((300, y), str(opts[3])[:40] if len(opts) > 3 else "", fontsize=8.5, fontname="helv", color=(0.25, 0.25, 0.25))
            y += 24

        # Footer
        page.insert_text((220, 810), f"Kerala PYQ Hub Verified Archive - Page {len(doc)}", fontsize=8, fontname="helv", color=(0.5, 0.5, 0.5))

        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        doc.save(str(filepath))
        doc.close()
        return filepath
