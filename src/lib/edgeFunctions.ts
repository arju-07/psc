import { supabase } from './supabase';

export interface ProcessPDFPayload {
  documentId: string;
  storagePath: string;
  hasAnswerKey: boolean;
  answerKeyPath?: string;
  examSlug: string;
  examName: string;
  subject: string;
  paperCode: string;
}

export interface ProcessPDFResponse {
  success: boolean;
  documentId: string;
  totalExtracted: number;
  duplicates: number;
  flagged: number;
  pendingVerification: number;
  hasOfficialAnswers: number;
  hasAIAnswers: number;
  error?: string;
}

export interface GenerateAiAnswerPayload {
  questionId?: string;
  extractedQuestionId?: string;
  questionText?: string;
  options?: { id: string; text: string }[];
  examName?: string;
  subject?: string;
  topic?: string;
}

export interface GenerateAiAnswerResponse {
  success: boolean;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: {
    correctReason: string;
    incorrectReason?: Record<string, string>;
    facts: string[];
    relatedTopic: string;
    isAIGenerated: boolean;
    isReviewed: boolean;
  };
  confidence: number;
  answerSource: 'ai_suggested';
  verificationStatus: 'pending_verification';
  note?: string;
  error?: string;
}

export interface VerifyQuestionPayload {
  extractedQuestionId: string;
  action: 'approve' | 'reject';
  adminNote?: string;
  overrideAnswer?: 'A' | 'B' | 'C' | 'D';
  overrideTopic?: string;
  overrideSubject?: string;
}

export interface VerifyQuestionResponse {
  success: boolean;
  action: 'approved' | 'rejected';
  questionId?: string;
  publishedQuestionId?: string;
  note?: string;
  error?: string;
}

/**
 * Trigger the 11-step PDF processing pipeline via Supabase Edge Function
 */
export async function invokeProcessPdf(payload: ProcessPDFPayload): Promise<ProcessPDFResponse> {
  const { data, error } = await supabase.functions.invoke<ProcessPDFResponse>('process-pdf', {
    body: payload,
  });

  if (error) {
    console.warn('[invokeProcessPdf] Edge function invocation error:', error);
    return {
      success: false,
      documentId: payload.documentId,
      totalExtracted: 0,
      duplicates: 0,
      flagged: 0,
      pendingVerification: 0,
      hasOfficialAnswers: 0,
      hasAIAnswers: 0,
      error: error.message,
    };
  }

  return data || {
    success: false,
    documentId: payload.documentId,
    totalExtracted: 0,
    duplicates: 0,
    flagged: 0,
    pendingVerification: 0,
    hasOfficialAnswers: 0,
    hasAIAnswers: 0,
    error: 'No response data from function',
  };
}

/**
 * Generate AI-suggested answers and explanations via Supabase Edge Function
 */
export async function invokeGenerateAiAnswer(payload: GenerateAiAnswerPayload): Promise<GenerateAiAnswerResponse> {
  const { data, error } = await supabase.functions.invoke<GenerateAiAnswerResponse>('generate-ai-answer', {
    body: payload,
  });

  if (error) {
    console.warn('[invokeGenerateAiAnswer] Edge function invocation error:', error);
    return {
      success: false,
      correctAnswer: 'A',
      explanation: {
        correctReason: '',
        facts: [],
        relatedTopic: payload.topic || payload.subject || 'General',
        isAIGenerated: true,
        isReviewed: false,
      },
      confidence: 0,
      answerSource: 'ai_suggested',
      verificationStatus: 'pending_verification',
      error: error.message,
    };
  }

  return data!;
}

/**
 * Verify or reject an extracted question via Supabase Edge Function
 */
export async function invokeVerifyQuestion(payload: VerifyQuestionPayload): Promise<VerifyQuestionResponse> {
  const { data, error } = await supabase.functions.invoke<VerifyQuestionResponse>('verify-question', {
    body: payload,
  });

  if (error) {
    console.warn('[invokeVerifyQuestion] Edge function invocation error:', error);
    return {
      success: false,
      action: payload.action === 'approve' ? 'approved' : 'rejected',
      error: error.message,
    };
  }

  return data!;
}
