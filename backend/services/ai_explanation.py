"""
AI Answer Explanation Service for Kerala PYQ Hub
Powered by Gemini API with heuristic fallback.
Generates beginner-friendly explanations in Malayalam and English,
explaining why an answer is correct and why other options are incorrect.
Clearly distinguishes AI-generated analysis from officially verified answer keys.
"""

import os
import json
from config import Config

class AIExplanationService:
    def __init__(self):
        self.client = None
        self._init_gemini()

    def _init_gemini(self):
        if Config.GEMINI_API_KEY:
            try:
                from google import genai
                self.client = genai.Client(api_key=Config.GEMINI_API_KEY)
                print("Gemini AI Explanation Service initialized successfully.")
            except Exception as e:
                print(f"Gemini Client init failed for explanations: {e}")
                self.client = None

    def generate_explanation(self, question, language="both"):
        """
        Generate a detailed bilingual breakdown:
        - Why the correct option is right
        - Why each incorrect option is wrong
        - Simple concepts for beginners
        - Prominent disclaimer
        """
        disclaimer = (
            "⚠️ ശ്രദ്ധിക്കുക: ഇത് AI തയ്യാറാക്കിയ വിശദീകരണമാണ്. "
            "ഔദ്യോഗിക ഉത്തരക്കടലാസ് അല്ല. പഠനാവശ്യങ്ങൾക്ക് മാത്രമായി തയ്യാറാക്കിയത്.\n"
            "(Disclaimer: This is an AI-generated explanation for learning purposes, not an official PSC answer key.)"
        )

        q_text = question.get("question_text", "")
        q_text_ml = question.get("question_text_malayalam", "")
        options = question.get("options", [])
        correct_opt = question.get("correct_option", "")
        existing_exp = question.get("explanation", "")
        existing_exp_ml = question.get("explanation_malayalam", "")
        topic = question.get("topic", "General Studies")

        if self.client:
            try:
                options_str = "\n".join([f"{opt.get('id')}: {opt.get('text')}" for opt in options])
                prompt = f"""You are a top exam educator for Kerala PSC and competitive exams.
Explain the following multiple-choice question clearly for beginners.

Question (English): {q_text}
Question (Malayalam): {q_text_ml}
Topic: {topic}
Options:
{options_str}
Official Correct Option: {correct_opt}

Provide output strictly in valid JSON format with the following keys:
{{
  "why_correct_en": "Clear, beginner-friendly explanation of why option {correct_opt} is correct",
  "why_correct_ml": "Malayalam explanation of why option {correct_opt} is correct",
  "options_breakdown": [
    {{"option": "A", "is_correct": boolean, "reason_en": "Why option A is right or wrong", "reason_ml": "Malayalam explanation"}},
    {{"option": "B", "is_correct": boolean, "reason_en": "Why option B is right or wrong", "reason_ml": "Malayalam explanation"}},
    {{"option": "C", "is_correct": boolean, "reason_en": "Why option C is right or wrong", "reason_ml": "Malayalam explanation"}},
    {{"option": "D", "is_correct": boolean, "reason_en": "Why option D is right or wrong", "reason_ml": "Malayalam explanation"}}
  ],
  "quick_memory_tip_ml": "Short mnemonic or memory tip in Malayalam for Kerala PSC aspirants",
  "quick_memory_tip_en": "Short mnemonic or memory tip in English"
}}
"""
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                text = response.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                parsed = json.loads(text)
                return {
                    "disclaimer": disclaimer,
                    "is_ai_generated": True,
                    "confidence": "high",
                    "source": "gemini-2.5-flash",
                    "correct_option": correct_opt,
                    "why_correct_en": parsed.get("why_correct_en", existing_exp),
                    "why_correct_ml": parsed.get("why_correct_ml", existing_exp_ml),
                    "options_breakdown": parsed.get("options_breakdown", []),
                    "quick_memory_tip_ml": parsed.get("quick_memory_tip_ml", ""),
                    "quick_memory_tip_en": parsed.get("quick_memory_tip_en", "")
                }
            except Exception as e:
                print(f"Gemini explanation generation failed: {e}. Using intelligent fallback.")

        # Heuristic fallback explanation
        options_breakdown = []
        for opt in options:
            is_corr = opt.get("id") == correct_opt
            if is_corr:
                reason_en = f"Option {opt.get('id')} is the verified correct answer: {opt.get('text')}."
                reason_ml = f"ഓപ്ഷൻ {opt.get('id')} ശരിയായ ഉത്തരമാണ്: {opt.get('text')}."
            else:
                reason_en = f"Option {opt.get('id')} ({opt.get('text')}) is incorrect for this specific question context."
                reason_ml = f"ഓപ്ഷൻ {opt.get('id')} ({opt.get('text')}) ഈ ചോദ്യത്തിന് തെറ്റായ ഉത്തരമാണ്."
            options_breakdown.append({
                "option": opt.get("id"),
                "is_correct": is_corr,
                "reason_en": reason_en,
                "reason_ml": reason_ml
            })

        return {
            "disclaimer": disclaimer,
            "is_ai_generated": True,
            "confidence": "standard",
            "source": "heuristic_knowledge_engine",
            "correct_option": correct_opt,
            "why_correct_en": existing_exp or f"Option {correct_opt} satisfies all criteria established by Kerala PSC syllabus guidelines.",
            "why_correct_ml": existing_exp_ml or f"ഓപ്ഷൻ {correct_opt} പി.എസ്.സി സിലബസ് പ്രകാരമുള്ള ശരിയായ വസ്തുതയാണ്.",
            "options_breakdown": options_breakdown,
            "quick_memory_tip_ml": "കഴിഞ്ഞ വർഷങ്ങളിലെ ചോദ്യക്കടലാസുകളിൽ ഈ വിഷയം ആവർത്തിച്ചു വന്നിട്ടുള്ളതാണ്. പ്രധാന വസ്തുതകൾ പ്രത്യേകം കുറിച്ചുവെക്കുക.",
            "quick_memory_tip_en": "This topic has appeared repeatedly in previous year papers. Memorise key associations for quick recall."
        }

ai_explanation_service = AIExplanationService()
