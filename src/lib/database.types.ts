// Auto-generated Supabase database types for Kerala PYQ Hub
// Run `npx supabase gen types typescript` to regenerate after schema changes.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'student' | 'super_admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'student' | 'super_admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: 'student' | 'super_admin';
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'student' | 'super_admin';
          target_exams: string[];
          preferred_language: 'English' | 'Malayalam' | 'Both';
          avatar_url: string | null;
          joined_date: string;
          theme_preference: 'light' | 'dark' | 'system';
          email_notifications: boolean;
          daily_reminder: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'student' | 'super_admin';
          target_exams?: string[];
          preferred_language?: 'English' | 'Malayalam' | 'Both';
          avatar_url?: string | null;
          joined_date?: string;
          theme_preference?: 'light' | 'dark' | 'system';
          email_notifications?: boolean;
          daily_reminder?: boolean;
        };
        Update: {
          name?: string;
          role?: 'student' | 'super_admin';
          target_exams?: string[];
          preferred_language?: 'English' | 'Malayalam' | 'Both';
          avatar_url?: string | null;
          theme_preference?: 'light' | 'dark' | 'system';
          email_notifications?: boolean;
          daily_reminder?: boolean;
          updated_at?: string;
        };
      };
      exam_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon_name: string;
          description: string;
          exam_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon_name: string;
          description: string;
          exam_count?: number;
        };
        Update: {
          name?: string;
          slug?: string;
          icon_name?: string;
          description?: string;
          exam_count?: number;
        };
      };
      exams: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: string;
          category_slug: string;
          short_description: string;
          paper_count: number;
          practice_questions_count: number;
          is_popular: boolean;
          is_recently_added: boolean;
          overview: string;
          eligibility: string;
          exam_pattern: string;
          official_website_url: string | null;
          important_topics: string[];
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category: string;
          category_slug: string;
          short_description: string;
          paper_count?: number;
          practice_questions_count?: number;
          is_popular?: boolean;
          is_recently_added?: boolean;
          overview: string;
          eligibility: string;
          exam_pattern: string;
          official_website_url?: string | null;
          important_topics?: string[];
          published?: boolean;
        };
        Update: {
          name?: string;
          short_description?: string;
          paper_count?: number;
          practice_questions_count?: number;
          is_popular?: boolean;
          overview?: string;
          eligibility?: string;
          exam_pattern?: string;
          official_website_url?: string | null;
          important_topics?: string[];
          published?: boolean;
          updated_at?: string;
        };
      };
      pyq_papers: {
        Row: {
          id: string;
          exam_id: string | null;
          exam_slug: string;
          exam_name: string;
          category: string;
          year: number;
          paper_code: string;
          language: 'Malayalam' | 'English' | 'Bilingual' | 'Tamil' | 'Kannada';
          subject: string;
          total_marks: number;
          duration_minutes: number;
          verification_status: 'verified' | 'pending' | 'rejected';
          has_official_answer_key: boolean;
          file_size: string;
          uploaded_at: string;
          download_count: number;
          published: boolean;
          pdf_url: string | null;
          answer_key_pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exam_id?: string | null;
          exam_slug: string;
          exam_name: string;
          category: string;
          year: number;
          paper_code: string;
          language: 'Malayalam' | 'English' | 'Bilingual' | 'Tamil' | 'Kannada';
          subject: string;
          total_marks: number;
          duration_minutes: number;
          verification_status?: 'verified' | 'pending' | 'rejected';
          has_official_answer_key?: boolean;
          file_size?: string;
          download_count?: number;
          published?: boolean;
          pdf_url?: string | null;
          answer_key_pdf_url?: string | null;
        };
        Update: {
          verification_status?: 'verified' | 'pending' | 'rejected';
          has_official_answer_key?: boolean;
          download_count?: number;
          published?: boolean;
          pdf_url?: string | null;
          answer_key_pdf_url?: string | null;
          updated_at?: string;
        };
      };
      mcq_questions: {
        Row: {
          id: string;
          paper_id: string | null;
          exam_slug: string;
          exam_name: string;
          subject: string;
          topic: string;
          difficulty: 'easy' | 'medium' | 'hard';
          year: number | null;
          question_text: string;
          question_malayalam: string | null;
          options: Json;
          correct_answer: 'A' | 'B' | 'C' | 'D';
          explanation: Json;
          verification_status: 'verified' | 'pending' | 'rejected';
          is_verified_official_key: boolean;
          source_paper_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          paper_id?: string | null;
          exam_slug: string;
          exam_name: string;
          subject: string;
          topic: string;
          difficulty: 'easy' | 'medium' | 'hard';
          year?: number | null;
          question_text: string;
          question_malayalam?: string | null;
          options: Json;
          correct_answer: 'A' | 'B' | 'C' | 'D';
          explanation: Json;
          verification_status?: 'verified' | 'pending' | 'rejected';
          is_verified_official_key?: boolean;
          source_paper_name?: string | null;
        };
        Update: {
          verification_status?: 'verified' | 'pending' | 'rejected';
          is_verified_official_key?: boolean;
          explanation?: Json;
          updated_at?: string;
        };
      };
      bookmarks_questions: {
        Row: {
          user_id: string;
          question_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          question_id: string;
        };
        Update: Record<string, never>;
      };
      bookmarks_papers: {
        Row: {
          user_id: string;
          paper_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          paper_id: string;
        };
        Update: Record<string, never>;
      };
      mistake_notebook: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          wrong_attempts_count: number;
          last_attempted_date: string;
          selected_wrong_option: 'A' | 'B' | 'C' | 'D';
          is_corrected: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          wrong_attempts_count?: number;
          last_attempted_date?: string;
          selected_wrong_option: 'A' | 'B' | 'C' | 'D';
          is_corrected?: boolean;
        };
        Update: {
          wrong_attempts_count?: number;
          last_attempted_date?: string;
          selected_wrong_option?: 'A' | 'B' | 'C' | 'D';
          is_corrected?: boolean;
          updated_at?: string;
        };
      };
      study_plan: {
        Row: {
          id: string;
          user_id: string;
          exam_slug: string;
          exam_name: string;
          subject: string;
          topic: string;
          target_date: string;
          estimated_minutes: number;
          status: 'pending' | 'in_progress' | 'completed';
          priority: 'low' | 'medium' | 'high';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_slug: string;
          exam_name: string;
          subject: string;
          topic: string;
          target_date: string;
          estimated_minutes: number;
          status?: 'pending' | 'in_progress' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          notes?: string | null;
        };
        Update: {
          status?: 'pending' | 'in_progress' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          target_date?: string;
          estimated_minutes?: number;
          notes?: string | null;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          type: 'paper' | 'mock' | 'challenge' | 'announcement' | 'system';
          date: string;
          read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          message: string;
          type: 'paper' | 'mock' | 'challenge' | 'announcement' | 'system';
          date?: string;
          read?: boolean;
          link?: string | null;
        };
        Update: {
          read?: boolean;
        };
      };
      processing_documents: {
        Row: {
          id: string;
          file_name: string;
          file_size_bytes: number;
          file_size_display: string;
          exam_slug: string;
          exam_name: string;
          year: number;
          paper_code: string;
          language: string;
          has_official_answer_key: boolean;
          checksum_hash: string;
          is_scanned: boolean;
          status: string;
          uploaded_bytes: number;
          progress_percentage: number;
          current_step: number;
          steps_state: Json;
          total_extracted_count: number;
          approved_count: number;
          rejected_count: number;
          pending_count: number;
          error_log: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_size_bytes: number;
          file_size_display: string;
          exam_slug: string;
          exam_name: string;
          year: number;
          paper_code: string;
          language: string;
          has_official_answer_key?: boolean;
          checksum_hash: string;
          is_scanned?: boolean;
          status?: string;
          uploaded_bytes?: number;
          progress_percentage?: number;
          current_step?: number;
          steps_state?: Json;
          total_extracted_count?: number;
          approved_count?: number;
          rejected_count?: number;
          pending_count?: number;
          error_log?: string | null;
        };
        Update: {
          status?: string;
          uploaded_bytes?: number;
          progress_percentage?: number;
          current_step?: number;
          steps_state?: Json;
          total_extracted_count?: number;
          approved_count?: number;
          rejected_count?: number;
          pending_count?: number;
          error_log?: string | null;
          updated_at?: string;
        };
      };
      extracted_questions: {
        Row: {
          id: string;
          document_id: string;
          question_number: number;
          question_text: string;
          question_malayalam: string | null;
          options: Json;
          correct_answer: 'A' | 'B' | 'C' | 'D';
          answer_source: 'official_key' | 'ai_suggested';
          explanation_text: string;
          confidence_score: number;
          is_duplicate: boolean;
          flagged_error: string | null;
          verification_status: 'pending_verification' | 'approved_published' | 'rejected';
          reviewed_by: string | null;
          exam_slug: string;
          exam_name: string;
          subject: string;
          topic: string;
          source_paper_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          question_number: number;
          question_text: string;
          question_malayalam?: string | null;
          options: Json;
          correct_answer: 'A' | 'B' | 'C' | 'D';
          answer_source: 'official_key' | 'ai_suggested';
          explanation_text: string;
          confidence_score?: number;
          is_duplicate?: boolean;
          flagged_error?: string | null;
          verification_status?: 'pending_verification' | 'approved_published' | 'rejected';
          reviewed_by?: string | null;
          exam_slug: string;
          exam_name: string;
          subject: string;
          topic: string;
          source_paper_code: string;
        };
        Update: {
          verification_status?: 'pending_verification' | 'approved_published' | 'rejected';
          reviewed_by?: string | null;
          flagged_error?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
