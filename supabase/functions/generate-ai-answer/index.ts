// Supabase Edge Function: generate-ai-answer
// Generates AI-powered explanations and suggested answers for MCQ questions
// using Google Gemini API. These answers are ALWAYS marked as ai_suggested
// and require admin verification before publishing.
//
// IMPORTANT: AI answers must NEVER be auto-published.
// All responses are stored with answer_source = 'ai_suggested'
// and verification_status = 'pending_verification'.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateAnswerRequest {
  questionId?: string;         // Single question from mcq_questions table
  extractedQuestionId?: string; // Single question from extracted_questions table
  // Or provide inline question data
  questionText?: string;
  options?: { id: string; text: string }[];
  examName?: string;
  subject?: string;
  topic?: string;
}

interface GeminiCandidate {
  content: { parts: { text: string }[] };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY secret not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const body: GenerateAnswerRequest = await req.json();

    let questionText = body.questionText ?? '';
    let options: { id: string; text: string }[] = body.options ?? [];
    let examName = body.examName ?? 'Kerala PSC';
    let subject = body.subject ?? 'General Knowledge';
    let topic = body.topic ?? '';
    let targetTable: 'mcq_questions' | 'extracted_questions' | null = null;
    let targetId: string | null = null;

    // Load from DB if ID provided
    if (body.questionId) {
      const { data, error } = await supabaseAdmin
        .from('mcq_questions')
        .select('question_text, options, exam_name, subject, topic')
        .eq('id', body.questionId)
        .single();
      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'Question not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const q = data as { question_text: string; options: { id: string; text: string }[]; exam_name: string; subject: string; topic: string };
      questionText = q.question_text;
      options = q.options;
      examName = q.exam_name;
      subject = q.subject;
      topic = q.topic;
      targetTable = 'mcq_questions';
      targetId = body.questionId;
    } else if (body.extractedQuestionId) {
      const { data, error } = await supabaseAdmin
        .from('extracted_questions')
        .select('question_text, options, exam_name, subject, topic')
        .eq('id', body.extractedQuestionId)
        .single();
      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'Extracted question not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const q = data as { question_text: string; options: { id: string; text: string }[]; exam_name: string; subject: string; topic: string };
      questionText = q.question_text;
      options = q.options;
      examName = q.exam_name;
      subject = q.subject;
      topic = q.topic;
      targetTable = 'extracted_questions';
      targetId = body.extractedQuestionId;
    }

    if (!questionText || options.length === 0) {
      return new Response(
        JSON.stringify({ error: 'questionText and options are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format options for prompt
    const optionsText = options.map((o) => `${o.id}) ${o.text}`).join('\n');

    const prompt = `You are an expert educator specializing in Kerala competitive examinations including Kerala PSC, Police, Teaching, Banking, SSC, Railway, and UPSC examinations.

Exam: ${examName}
Subject: ${subject}${topic ? `\nTopic: ${topic}` : ''}

Question:
${questionText}

Options:
${optionsText}

Please provide:
1. The correct answer (A, B, C, or D only)
2. Why the correct answer is right (1-2 clear sentences)
3. Why each wrong option is incorrect (1 sentence each)
4. An interesting fact or memory tip related to this topic (1 sentence)
5. Your confidence score (0-100) based on how certain you are

Respond with ONLY valid JSON in this exact format:
{
  "correctAnswer": "B",
  "explanation": {
    "correctReason": "...",
    "incorrectReason": {
      "A": "...",
      "C": "...",
      "D": "..."
    },
    "facts": ["Interesting fact or memory tip here"],
    "relatedTopic": "${topic || subject}",
    "isAIGenerated": true,
    "isReviewed": false
  },
  "confidence": 85
}`;

    // Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json',
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          ],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(
        JSON.stringify({ error: 'Gemini API error', detail: errText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData: GeminiResponse = await geminiRes.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

    let parsed: {
      correctAnswer: string;
      explanation: Record<string, unknown>;
      confidence: number;
    };

    try {
      parsed = JSON.parse(responseText);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Failed to parse Gemini response', raw: responseText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate answer is A/B/C/D
    if (!['A', 'B', 'C', 'D'].includes(parsed.correctAnswer)) {
      return new Response(
        JSON.stringify({ error: 'AI returned invalid answer option', raw: parsed }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Persist AI answer to DB (always marked as ai_suggested, never auto-published)
    if (targetTable && targetId) {
      await supabaseAdmin
        .from(targetTable)
        .update({
          correct_answer: parsed.correctAnswer,
          explanation: parsed.explanation,
          confidence_score: parsed.confidence ?? 70,
          answer_source: 'ai_suggested',    // Always ai_suggested
          verification_status: 'pending_verification', // Never auto-published
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        correctAnswer: parsed.correctAnswer,
        explanation: parsed.explanation,
        confidence: parsed.confidence ?? 70,
        answerSource: 'ai_suggested',
        verificationStatus: 'pending_verification',
        note: 'This AI-generated answer requires admin review and approval before publishing.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    const error = err as Error;
    console.error('generate-ai-answer error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
