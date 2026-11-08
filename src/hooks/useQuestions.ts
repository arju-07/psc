import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MCQQuestion, QuestionOption, QuestionExplanation } from '../types';
import { mockQuestions } from '../data/mockData';

interface QuestionRow {
  id: string; paper_id: string | null; exam_slug: string; exam_name: string;
  subject: string; topic: string; difficulty: string; year: number | null;
  question_text: string; question_malayalam: string | null;
  options: unknown; correct_answer: string; explanation: unknown;
  verification_status: string; is_verified_official_key: boolean;
  source_paper_name: string | null;
}

interface QuestionsFilter {
  examSlug?: string; subject?: string; topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard'; paperId?: string;
  verifiedOnly?: boolean; limit?: number;
}

export function useQuestions(filter: QuestionsFilter = {}) {
  const [questions, setQuestions] = useState<MCQQuestion[]>(mockQuestions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase.from('mcq_questions').select('*').order('created_at', { ascending: false });

      if (filter.examSlug) query = query.eq('exam_slug', filter.examSlug);
      if (filter.subject) query = query.eq('subject', filter.subject);
      if (filter.topic) query = query.eq('topic', filter.topic);
      if (filter.difficulty) query = query.eq('difficulty', filter.difficulty);
      if (filter.paperId) query = query.eq('paper_id', filter.paperId);
      if (filter.verifiedOnly) query = query.eq('verification_status', 'verified');
      if (filter.limit) query = query.limit(filter.limit);

      const { data, error } = await query;

      if (error || !data || (data as QuestionRow[]).length === 0) {
        let filtered = mockQuestions;
        if (filter.examSlug) filtered = filtered.filter((q) => q.examSlug === filter.examSlug);
        if (filter.subject) filtered = filtered.filter((q) => q.subject === filter.subject);
        if (filter.difficulty) filtered = filtered.filter((q) => q.difficulty === filter.difficulty);
        if (filter.limit) filtered = filtered.slice(0, filter.limit);
        setQuestions(filtered);
        if (error) setError(error.message);
      } else {
        setQuestions(
          (data as QuestionRow[]).map((row) => ({
            id: row.id, paperId: row.paper_id ?? undefined,
            examSlug: row.exam_slug, examName: row.exam_name,
            subject: row.subject, topic: row.topic,
            difficulty: row.difficulty as MCQQuestion['difficulty'],
            year: row.year ?? undefined, questionText: row.question_text,
            questionMalayalam: row.question_malayalam ?? undefined,
            options: row.options as QuestionOption[],
            correctAnswer: row.correct_answer as MCQQuestion['correctAnswer'],
            explanation: row.explanation as QuestionExplanation,
            verificationStatus: row.verification_status as MCQQuestion['verificationStatus'],
            isVerifiedOfficialKey: row.is_verified_official_key,
            sourcePaperName: row.source_paper_name ?? undefined,
          }))
        );
      }
      setLoading(false);
    }
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.examSlug, filter.subject, filter.topic, filter.difficulty, filter.paperId, filter.verifiedOnly, filter.limit]);

  return { questions, loading, error };
}
