import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Exam, ExamCategory } from '../types';
import { mockExams, mockCategories } from '../data/mockData';

// Row shapes returned by Supabase (matches our SQL schema)
interface CategoryRow {
  id: string; name: string; slug: string; icon_name: string;
  description: string; exam_count: number;
}

interface ExamRow {
  id: string; name: string; slug: string; category: string; category_slug: string;
  short_description: string; paper_count: number; practice_questions_count: number;
  is_popular: boolean; is_recently_added: boolean; overview: string;
  eligibility: string; exam_pattern: string; official_website_url: string | null;
  important_topics: string[]; published: boolean;
}

export function useCategories() {
  const [categories, setCategories] = useState<ExamCategory[]>(mockCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data, error } = await supabase
        .from('exam_categories')
        .select('*')
        .order('name');

      if (error || !data || (data as CategoryRow[]).length === 0) {
        setCategories(mockCategories);
        if (error) setError(error.message);
      } else {
        setCategories(
          (data as CategoryRow[]).map((row) => ({
            id: row.id, name: row.name, slug: row.slug,
            iconName: row.icon_name, description: row.description, examCount: row.exam_count,
          }))
        );
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return { categories, loading, error };
}

export function useExams(categorySlug?: string) {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase.from('exams').select('*').eq('published', true).order('name');
      if (categorySlug) query = query.eq('category_slug', categorySlug);

      const { data, error } = await query;

      if (error || !data || (data as ExamRow[]).length === 0) {
        const filtered = categorySlug
          ? mockExams.filter((e) => e.categorySlug === categorySlug)
          : mockExams;
        setExams(filtered);
        if (error) setError(error.message);
      } else {
        setExams((data as ExamRow[]).map(rowToExam));
      }
      setLoading(false);
    }
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

  return { exams, loading, error };
}

export function useExam(slug: string) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    async function fetch() {
      setLoading(true);
      const { data, error } = await supabase.from('exams').select('*').eq('slug', slug).single();

      if (error || !data) {
        setExam(mockExams.find((e) => e.slug === slug) ?? null);
        if (error) setError(error.message);
      } else {
        setExam(rowToExam(data as ExamRow));
      }
      setLoading(false);
    }
    fetch();
  }, [slug]);

  return { exam, loading, error };
}

function rowToExam(row: ExamRow): Exam {
  return {
    id: row.id, name: row.name, slug: row.slug,
    category: row.category, categorySlug: row.category_slug,
    shortDescription: row.short_description, paperCount: row.paper_count,
    practiceQuestionsCount: row.practice_questions_count,
    isPopular: row.is_popular, isRecentlyAdded: row.is_recently_added,
    overview: row.overview, eligibility: row.eligibility, examPattern: row.exam_pattern,
    officialWebsiteUrl: row.official_website_url ?? undefined,
    importantTopics: row.important_topics ?? [], subjects: [], published: row.published,
  };
}
