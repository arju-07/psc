import os
from pathlib import Path
from config import Config
from database import db
from services.pdf_processor import PDFProcessor

def generate_all_seed_pdfs():
    papers = db.get_papers(verified_only=False)
    all_qs = db.get_all_questions(verified_only=False)
    qs_by_paper = {}
    for q in all_qs:
        p_id = q.get("paper_id")
        if p_id not in qs_by_paper:
            qs_by_paper[p_id] = []
        qs_by_paper[p_id].append(q)

    for paper in papers:
        # Generate question paper PDF
        # file_url is like /api/papers/download/filename.pdf
        url = paper.get("file_url", "")
        filename = url.split("/")[-1] if url else f"{paper['id']}.pdf"
        dest_path = Path(Config.PAPERS_FOLDER) / filename

        exam = db.get_exam(paper.get("exam_id"))
        exam_name = exam.get("name") if exam else "Kerala Competitive Examination"

        paper_qs = qs_by_paper.get(paper["id"], [])
        PDFProcessor.create_official_styled_pdf(
            filepath=dest_path,
            title="Kerala Competitive Exam Paper",
            exam_name=exam_name,
            paper_code=paper.get("paper_code", "GEN-01"),
            year=paper.get("year", 2023),
            duration_mins=paper.get("duration_minutes", 75),
            questions=paper_qs,
            is_sample=paper.get("is_sample", False)
        )
        print(f"Generated PDF: {dest_path}")

        # Also generate answer key file if applicable
        ak_url = paper.get("answer_key_url")
        if ak_url:
            ak_filename = ak_url.split("/")[-1]
            ak_dest = Path(Config.KEYS_FOLDER) / ak_filename
            # Generate answer key PDF
            PDFProcessor.create_official_styled_pdf(
                filepath=ak_dest,
                title="Official Final Answer Key",
                exam_name=f"{exam_name} - FINAL ANSWER KEY",
                paper_code=paper.get("paper_code", "GEN-01"),
                year=paper.get("year", 2023),
                duration_mins=75,
                questions=[
                    {"num": 1, "text": "Question 1: Correct Answer is (B)", "opts": ["(B) Verified Official Key", "", "", ""]},
                    {"num": 2, "text": "Question 2: Correct Answer is (B)", "opts": ["(B) Verified Official Key", "", "", ""]},
                    {"num": 3, "text": "Question 3: Correct Answer is (A)", "opts": ["(A) Verified Official Key", "", "", ""]},
                    {"num": 4, "text": "Question 4: Correct Answer is (B)", "opts": ["(B) Verified Official Key", "", "", ""]},
                    {"num": 5, "text": "Question 5: Correct Answer is (C)", "opts": ["(C) Verified Official Key", "", "", ""]}
                ],
                is_sample=False
            )
            print(f"Generated Key: {ak_dest}")

if __name__ == "__main__":
    generate_all_seed_pdfs()
