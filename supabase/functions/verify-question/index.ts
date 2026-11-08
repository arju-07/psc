// Supabase Edge Function: verify-question
// Admin-only endpoint to approve or reject extracted questions.
// Only approved questions are published to the student question bank.
// AI-suggested answers that are approved are promoted to the main mcq_questions table.
//
// CRITICAL: This is the final gatekeeper.
// No question ever enters the student bank without explicit admin approval here.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  extractedQuestionId: string;
  action: 'approve' | 'reject';
  adminNote?: string;
  // Optionally override the answer before approving
  overrideAnswer?: 'A' | 'B' | 'C' | 'D';
  overrideTopic?: string;
  overrideSubject?: string;
}

interface ExtractedQuestionRow {
  id: string;
  document_id: string;
  question_number: number;
  question_text: string;
  question_malayalam: string | null;
  options: { id: string; text: string }[];
  correct_answer: string;
  answer_source: string;
  explanation_text: string;
  confidence_score: number;
  is_duplicate: boolean;
  exam_slug: string;
  exam_name: string;
  subject: string;
  topic: string;
  source_paper_code: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify caller is an authenticated admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Verify calling user exists and is an admin
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const adminRoles = ['admin', 'moderator', 'content_admin'];
    if (!profile || !adminRoles.includes((profile as { role: string }).role)) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: VerifyRequest = await req.json();
    const { extractedQuestionId, action, adminNote, overrideAnswer, overrideTopic, overrideSubject } = body;

    if (!extractedQuestionId || !action) {
      return new Response(
        JSON.stringify({ error: 'extractedQuestionId and action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the extracted question
    const { data: eq, error: fetchError } = await supabaseAdmin
      .from('extracted_questions')
      .select('*')
      .eq('id', extractedQuestionId)
      .single();

    if (fetchError || !eq) {
      return new Response(
        JSON.stringify({ error: 'Extracted question not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const question = eq as ExtractedQuestionRow;

    if (action === 'reject') {
      // Mark as rejected in extracted_questions
      await supabaseAdmin.from('extracted_questions').update({
        verification_status: 'rejected',
        reviewed_by: user.id,
        updated_at: new Date().toISOString(),
      }).eq('id', extractedQuestionId);

      // Update document counters
      await supabaseAdmin.rpc('decrement_pending_increment_rejected', {
        doc_id: question.document_id,
      });

      return new Response(
        JSON.stringify({ success: true, action: 'rejected', questionId: extractedQuestionId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // action === 'approve'
    // Apply any admin overrides
    const finalAnswer = overrideAnswer ?? question.correct_answer;
    const finalTopic = overrideTopic ?? question.topic;
    const finalSubject = overrideSubject ?? question.subject;

    // Promote to published mcq_questions table
    const { data: insertedQuestion, error: insertError } = await supabaseAdmin
      .from('mcq_questions')
      .insert({
        exam_slug: question.exam_slug,
        exam_name: question.exam_name,
        subject: finalSubject,
        topic: finalTopic,
        difficulty: 'medium',
        question_text: question.question_text,
        question_malayalam: question.question_malayalam,
        options: question.options,
        correct_answer: finalAnswer,
        explanation: {
          correctReason: question.explanation_text,
          facts: [],
          relatedTopic: finalTopic,
          isAIGenerated: question.answer_source === 'ai_suggested',
          isReviewed: true,
        },
        verification_status: 'verified',
        is_verified_official_key: question.answer_source === 'official_key',
        source_paper_name: question.source_paper_code,
      })
      .select('id')
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Failed to publish question', detail: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark extracted question as approved
    await supabaseAdmin.from('extracted_questions').update({
      verification_status: 'approved_published',
      reviewed_by: user.id,
      correct_answer: finalAnswer,
      updated_at: new Date().toISOString(),
    }).eq('id', extractedQuestionId);

    // Update document approved counter
    await supabaseAdmin
      .from('processing_documents')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', question.document_id);

    return new Response(
      JSON.stringify({
        success: true,
        action: 'approved',
        extractedQuestionId,
        publishedQuestionId: (insertedQuestion as { id: string }).id,
        note: adminNote ?? 'Question approved and published to student question bank.',
        answerSource: question.answer_source,
        finalAnswer,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    const error = err as Error;
    console.error('verify-question error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
