import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PYQPaper } from '../types';
import { mockPapers } from '../data/mockData';

interface PaperRow {
  id: string; exam_id: string | null; exam_slug: string; exam_name: string;
  category: string; year: number; paper_code: string; language: string;
  subject: string; total_marks: number; duration_minutes: number;
  verification_status: string; has_official_answer_key: boolean;
  file_size: string; uploaded_at: string; download_count: number;
  published: boolean; pdf_url: string | null; answer_key_pdf_url: string | null;
}

interface PapersFilter {
  examSlug?: string; category?: string; year?: number;
  language?: string; verificationStatus?: string;
}

export function usePapers(filter: PapersFilter = {}) {
  const [papers, setPapers] = useState<PYQPaper[]>(mockPapers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase.from('pyq_papers').select('*').eq('published', true).order('year', { ascending: false });

      if (filter.examSlug) query = query.eq('exam_slug', filter.examSlug);
      if (filter.category) query = query.eq('category', filter.category);
      if (filter.year) query = query.eq('year', filter.year);
      if (filter.language) query = query.eq('language', filter.language);
      if (filter.verificationStatus) query = query.eq('verification_status', filter.verificationStatus);

      const { data, error } = await query;

      if (error || !data || (data as PaperRow[]).length === 0) {
        let filtered = mockPapers;
        if (filter.examSlug) filtered = filtered.filter((p) => p.examSlug === filter.examSlug);
        if (filter.category) filtered = filtered.filter((p) => p.category === filter.category);
        if (filter.year) filtered = filtered.filter((p) => p.year === filter.year);
        setPapers(filtered);
        if (error) setError(error.message);
      } else {
        setPapers(
          (data as PaperRow[]).map((row) => ({
            id: row.id, examId: row.exam_id ?? '', examSlug: row.exam_slug,
            examName: row.exam_name, category: row.category, year: row.year,
            paperCode: row.paper_code, language: row.language as PYQPaper['language'],
            subject: row.subject, totalMarks: row.total_marks, durationMinutes: row.duration_minutes,
            verificationStatus: row.verification_status as PYQPaper['verificationStatus'],
            hasOfficialAnswerKey: row.has_official_answer_key, fileSize: row.file_size,
            uploadedAt: row.uploaded_at, downloadCount: row.download_count,
            published: row.published, pdfUrl: row.pdf_url ?? undefined,
            answerKeyPdfUrl: row.answer_key_pdf_url ?? undefined,
          }))
        );
      }
      setLoading(false);
    }
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.examSlug, filter.category, filter.year, filter.language, filter.verificationStatus]);

  return { papers, loading, error };
}

export async function incrementDownloadCount(paperId: string) {
  await supabase.rpc('increment_paper_downloads', { paper_id: paperId });
}
