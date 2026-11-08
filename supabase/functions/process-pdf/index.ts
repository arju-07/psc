// Supabase Edge Function: process-pdf
// Handles the 11-step PDF processing pipeline:
//   Step 1: Validate PDF
//   Step 2: Detect text vs scanned
//   Step 3: Extract text (native)
//   Step 4: OCR for scanned PDFs (via external API)
//   Step 5: Detect question numbers
//   Step 6: Extract question text + options A-D
//   Step 7: Match against official answer key
//   Step 8: AI-suggested answers if no official key
//   Step 9: Duplicate detection + flag errors
//   Step 10: Send to verification queue
//   Step 11: Await admin approval before publishing

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessPDFRequest {
  documentId: string;      // UUID in processing_documents table
  storagePath: string;     // e.g. "papers/exam-ldc-2023.pdf"
  hasAnswerKey: boolean;
  answerKeyPath?: string;  // e.g. "answer-keys/ldc-2023-key.pdf"
  examSlug: string;
  examName: string;
  subject: string;
  paperCode: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const body: ProcessPDFRequest = await req.json();
    const { documentId, storagePath, hasAnswerKey, answerKeyPath, examSlug, examName, subject, paperCode } = body;

    if (!documentId || !storagePath) {
      return new Response(
        JSON.stringify({ error: 'documentId and storagePath are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Helper to update step state
    const updateStep = async (step: number, status: string, detail?: string) => {
      const { data: doc } = await supabaseAdmin
        .from('processing_documents')
        .select('steps_state')
        .eq('id', documentId)
        .single();

      const steps = (doc?.steps_state as Record<string, unknown>[] | null) ?? [];
      const updatedSteps = steps.map((s: Record<string, unknown>) =>
        s.stepNumber === step
          ? { ...s, status, detailMessage: detail ?? '', timestamp: new Date().toISOString() }
          : s
      );

      await supabaseAdmin
        .from('processing_documents')
        .update({
          steps_state: updatedSteps,
          current_step: step,
          status: status === 'failed' ? 'failed' : 'processing',
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);
    };

    // ── STEP 1: Validate PDF ────────────────────────────────────────────────
    await updateStep(1, 'in_progress', 'Validating PDF file integrity...');

    const { data: fileData, error: downloadError } = await supabaseAdmin
      .storage.from('papers')
      .download(storagePath);

    if (downloadError || !fileData) {
      await updateStep(1, 'failed', `Cannot retrieve file: ${downloadError?.message}`);
      await supabaseAdmin.from('processing_documents').update({
        status: 'failed',
        error_log: `Step 1 failed: ${downloadError?.message}`,
        updated_at: new Date().toISOString(),
      }).eq('id', documentId);
      return new Response(
        JSON.stringify({ error: 'File download failed', detail: downloadError?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pdfBytes = await fileData.arrayBuffer();
    const pdfMagic = new Uint8Array(pdfBytes.slice(0, 4));
    const isPDF = pdfMagic[0] === 0x25 && pdfMagic[1] === 0x50 && // %P
                  pdfMagic[2] === 0x44 && pdfMagic[3] === 0x46;   // DF

    if (!isPDF) {
      await updateStep(1, 'failed', 'File does not appear to be a valid PDF.');
      return new Response(
        JSON.stringify({ error: 'Invalid PDF file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await updateStep(1, 'completed', `PDF validated — ${(pdfBytes.byteLength / 1024 / 1024).toFixed(1)} MB`);

    // ── STEP 2: Detect text vs scanned ─────────────────────────────────────
    await updateStep(2, 'in_progress', 'Detecting document type (selectable text vs scanned image)...');

    // Check for /Text objects in PDF stream — basic heuristic
    const pdfText = new TextDecoder('utf-8', { fatal: false }).decode(pdfBytes.slice(0, 65536));
    const hasSelectableText = pdfText.includes('BT') && pdfText.includes('ET'); // Begin/End Text markers
    const isScanned = !hasSelectableText;

    await supabaseAdmin.from('processing_documents').update({
      is_scanned: isScanned,
      updated_at: new Date().toISOString(),
    }).eq('id', documentId);

    await updateStep(2, 'completed',
      isScanned
        ? 'Scanned PDF detected — OCR will be applied.'
        : 'Selectable text detected — direct extraction possible.'
    );

    // ── STEP 3: Extract text (native) ───────────────────────────────────────
    await updateStep(3, isScanned ? 'skipped' : 'in_progress',
      isScanned ? 'Skipped — document is scanned.' : 'Extracting selectable text...');

    let rawText = '';

    if (!isScanned) {
      // For real deployments: use pdf-parse via a Deno-compatible library
      // or pipe to an external microservice. Here we extract visible ASCII text.
      const fullText = new TextDecoder('utf-8', { fatal: false }).decode(pdfBytes);
      // Extract text between BT (Begin Text) and ET (End Text) PDF operators
      const textBlocks: string[] = [];
      const btEtRegex = /BT([\s\S]*?)ET/g;
      let match;
      while ((match = btEtRegex.exec(fullText)) !== null) {
        // Extract string literals from Tj / TJ operators
        const tjMatches = match[1].matchAll(/\(([^)]+)\)\s*Tj/g);
        for (const tj of tjMatches) {
          textBlocks.push(tj[1]);
        }
      }
      rawText = textBlocks.join('\n');

      if (!isScanned) {
        await updateStep(3, 'completed', `Extracted ~${rawText.length} characters of text.`);
      }
    }

    // ── STEP 4: OCR for scanned PDFs ───────────────────────────────────────
    await updateStep(4, isScanned ? 'in_progress' : 'skipped',
      isScanned ? 'Running OCR on scanned pages...' : 'Skipped — text already extracted.');

    if (isScanned) {
      // Real OCR integration: call Google Vision API / Tesseract microservice
      // The endpoint and key are set as Supabase Edge Function secrets
      const ocrApiUrl = Deno.env.get('OCR_API_URL');
      const ocrApiKey = Deno.env.get('OCR_API_KEY');

      if (ocrApiUrl && ocrApiKey) {
        try {
          const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
          const ocrRes = await fetch(ocrApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-API-Key': ocrApiKey },
            body: JSON.stringify({ pdf_base64: pdfBase64, language: 'mal+eng' }),
          });
          if (ocrRes.ok) {
            const ocrData = await ocrRes.json();
            rawText = ocrData.text ?? '';
            await updateStep(4, 'completed', `OCR complete — ${rawText.length} characters extracted.`);
          } else {
            await updateStep(4, 'failed', `OCR API error: ${ocrRes.status}`);
          }
        } catch (e) {
          await updateStep(4, 'failed', `OCR error: ${(e as Error).message}`);
        }
      } else {
        // OCR API not configured — flag for manual processing
        await updateStep(4, 'failed', 'OCR API not configured. Set OCR_API_URL and OCR_API_KEY secrets.');
        await supabaseAdmin.from('processing_documents').update({
          status: 'failed',
          error_log: 'OCR API secrets not set. Configure OCR_API_URL and OCR_API_KEY in Edge Function secrets.',
          updated_at: new Date().toISOString(),
        }).eq('id', documentId);
        return new Response(
          JSON.stringify({ error: 'OCR API not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // ── STEP 5: Detect question numbers ────────────────────────────────────
    await updateStep(5, 'in_progress', 'Detecting and segmenting individual questions...');

    // Question detection patterns for Kerala PSC style papers
    const questionPattern = /(?:^|\n)\s*(\d{1,3})[.)]\s+(.+?)(?=\n\s*\d{1,3}[.)]\s+|\n\s*[A-D][.)]\s*$|$)/gms;
    const optionPattern = /^\s*([A-D])[.)]\s*(.+)$/gm;

    interface RawQuestion {
      number: number;
      text: string;
      rawBlock: string;
    }

    const rawQuestions: RawQuestion[] = [];
    let qMatch;

    while ((qMatch = questionPattern.exec(rawText)) !== null) {
      rawQuestions.push({
        number: parseInt(qMatch[1]),
        text: qMatch[2].trim(),
        rawBlock: qMatch[0],
      });
    }

    await updateStep(5, 'completed', `Detected ${rawQuestions.length} questions.`);

    // ── STEP 6: Extract question text + options ─────────────────────────────
    await updateStep(6, 'in_progress', 'Extracting question text and answer options A, B, C, D...');

    interface ParsedQuestion {
      number: number;
      questionText: string;
      options: { id: string; text: string }[];
    }

    const parsedQuestions: ParsedQuestion[] = [];

    for (const rq of rawQuestions) {
      const options: { id: string; text: string }[] = [];
      let oMatch;
      while ((oMatch = optionPattern.exec(rq.rawBlock)) !== null) {
        options.push({ id: oMatch[1], text: oMatch[2].trim() });
      }
      if (options.length === 4) {
        parsedQuestions.push({
          number: rq.number,
          questionText: rq.text,
          options,
        });
      }
    }

    await updateStep(6, 'completed',
      `Extracted ${parsedQuestions.length} complete questions with options.`);

    // ── STEP 7: Match against official answer key ───────────────────────────
    await updateStep(7, hasAnswerKey ? 'in_progress' : 'skipped',
      hasAnswerKey ? 'Matching questions against official answer key...' : 'No official answer key provided.');

    const officialAnswers: Record<number, string> = {};

    if (hasAnswerKey && answerKeyPath) {
      const { data: keyData } = await supabaseAdmin
        .storage.from('answer-keys')
        .download(answerKeyPath);

      if (keyData) {
        const keyText = new TextDecoder('utf-8', { fatal: false }).decode(await keyData.arrayBuffer());
        // Parse answer key: patterns like "1-B", "1. B", "1) B"
        const answerPattern = /(\d{1,3})\s*[-.)]\s*([A-D])/g;
        let aMatch;
        while ((aMatch = answerPattern.exec(keyText)) !== null) {
          officialAnswers[parseInt(aMatch[1])] = aMatch[2];
        }
        await updateStep(7, 'completed',
          `Matched ${Object.keys(officialAnswers).length} official answers.`);
      } else {
        await updateStep(7, 'failed', 'Could not read answer key file.');
      }
    }

    // ── STEP 8: AI-suggested answers ────────────────────────────────────────
    await updateStep(8, 'in_progress', 'Generating AI-suggested answers and explanations...');

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const aiAnswers: Record<number, { answer: string; explanation: string; confidence: number }> = {};

    if (geminiApiKey) {
      // Batch questions in groups of 5 to avoid token limits
      const batchSize = 5;
      for (let i = 0; i < parsedQuestions.length; i += batchSize) {
        const batch = parsedQuestions.slice(i, i + batchSize);
        const questionsText = batch.map((q) =>
          `Q${q.number}: ${q.questionText}\nA) ${q.options[0]?.text}\nB) ${q.options[1]?.text}\nC) ${q.options[2]?.text}\nD) ${q.options[3]?.text}`
        ).join('\n\n');

        const prompt = `You are an expert in Kerala competitive examinations. For each question below, provide:
1. The correct answer (A, B, C, or D)
2. A brief explanation (1-2 sentences)
3. Your confidence score (0-100)

Format your response as JSON array: [{"questionNumber": N, "answer": "A", "explanation": "...", "confidence": 85}]

Questions:
${questionsText}

Respond with only the JSON array, no markdown.`;

        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
            const cleanJson = responseText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
            const batchAnswers = JSON.parse(cleanJson);
            for (const ans of batchAnswers) {
              aiAnswers[ans.questionNumber] = {
                answer: ans.answer,
                explanation: ans.explanation,
                confidence: ans.confidence ?? 70,
              };
            }
          }
        } catch (_e) {
          // Continue with other batches even if one fails
        }
      }
    }

    await updateStep(8, 'completed',
      geminiApiKey
        ? `AI suggestions generated for ${Object.keys(aiAnswers).length} questions.`
        : 'GEMINI_API_KEY not set — AI suggestions skipped.'
    );

    // ── STEP 9: Duplicate detection + flag errors ───────────────────────────
    await updateStep(9, 'in_progress', 'Checking for duplicate questions...');

    // Check existing question texts to detect duplicates
    const { data: existingQuestions } = await supabaseAdmin
      .from('mcq_questions')
      .select('id, question_text')
      .eq('exam_slug', examSlug)
      .limit(1000);

    const existingTexts = new Set(
      (existingQuestions ?? []).map((q: { question_text: string }) =>
        q.question_text.toLowerCase().trim().slice(0, 100)
      )
    );

    let duplicateCount = 0;
    const flaggedQuestions: number[] = [];

    for (const q of parsedQuestions) {
      const key = q.questionText.toLowerCase().trim().slice(0, 100);
      if (existingTexts.has(key)) duplicateCount++;
      if (q.options.length < 4) flaggedQuestions.push(q.number);
    }

    await updateStep(9, 'completed',
      `${duplicateCount} duplicates found, ${flaggedQuestions.length} questions flagged.`);

    // ── STEP 10: Insert into verification queue ─────────────────────────────
    await updateStep(10, 'in_progress', 'Sending extracted questions to admin verification queue...');

    const extractedRows = parsedQuestions.map((q) => {
      const officialAnswer = officialAnswers[q.number];
      const aiSuggestion = aiAnswers[q.number];
      const correctAnswer = officialAnswer ?? aiSuggestion?.answer ?? 'A';
      const answerSource = officialAnswer ? 'official_key' : 'ai_suggested';
      const isDuplicate = existingTexts.has(q.questionText.toLowerCase().trim().slice(0, 100));
      const flaggedError = q.options.length < 4 ? 'Incomplete options detected' : null;

      return {
        document_id: documentId,
        question_number: q.number,
        question_text: q.questionText,
        options: q.options,
        correct_answer: correctAnswer,
        answer_source: answerSource,
        explanation_text: aiSuggestion?.explanation ?? '',
        confidence_score: aiSuggestion?.confidence ?? (officialAnswer ? 100 : 0),
        is_duplicate: isDuplicate,
        flagged_error: flaggedError,
        verification_status: 'pending_verification',
        exam_slug: examSlug,
        exam_name: examName,
        subject: subject,
        topic: '',
        source_paper_code: paperCode,
      };
    });

    if (extractedRows.length > 0) {
      await supabaseAdmin.from('extracted_questions').insert(extractedRows);
    }

    const pendingCount = extractedRows.filter((r) => !r.is_duplicate && !r.flagged_error).length;

    await supabaseAdmin.from('processing_documents').update({
      total_extracted_count: extractedRows.length,
      pending_count: pendingCount,
      updated_at: new Date().toISOString(),
    }).eq('id', documentId);

    await updateStep(10, 'completed',
      `${extractedRows.length} questions sent to verification queue.`);

    // ── STEP 11: Await admin approval ───────────────────────────────────────
    await updateStep(11, 'completed',
      'Questions are in the verification queue. Admin must approve before publishing.');

    // Final status update
    await supabaseAdmin.from('processing_documents').update({
      status: 'completed',
      current_step: 11,
      updated_at: new Date().toISOString(),
    }).eq('id', documentId);

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        totalExtracted: extractedRows.length,
        duplicates: duplicateCount,
        flagged: flaggedQuestions.length,
        pendingVerification: pendingCount,
        hasOfficialAnswers: Object.keys(officialAnswers).length,
        hasAIAnswers: Object.keys(aiAnswers).length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    const error = err as Error;
    console.error('process-pdf error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
