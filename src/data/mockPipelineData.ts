import { ProcessingDocument, PipelineStepState, ExtractedQuestionItem, ProcessingDashboardMetrics } from '../types';

export const PIPELINE_STEPS_DEFINITION = [
  { stepNumber: 1, stepName: 'Upload & Validate PDF', description: 'Validate document header, page structure, and verify file integrity.' },
  { stepNumber: 2, stepName: 'Extract Bilingual Text & OCR', description: 'Extract Malayalam & English text with neural character recognition.' },
  { stepNumber: 3, stepName: 'Parse Questions & Match Key', description: 'Segment question stems, options (A-D), and correlate with official answer key.' },
  { stepNumber: 4, stepName: 'Publish to Question Bank', description: 'Complete processing and add verified questions to the repository.' },
];

export const createInitialPipelineSteps = (currentStep: number, isScanned = false): PipelineStepState[] => {
  return PIPELINE_STEPS_DEFINITION.map((stepDef) => {
    let status: PipelineStepState['status'] = 'pending';
    let detailMessage = '';

    if (stepDef.stepNumber < currentStep) {
      status = 'completed';
      detailMessage = 'Successfully completed';
    } else if (stepDef.stepNumber === currentStep) {
      status = 'in_progress';
      detailMessage = 'Processing in background...';
    }

    return {
      stepNumber: stepDef.stepNumber,
      stepName: stepDef.stepName,
      description: stepDef.description,
      status,
      detailMessage,
    };
  });
};

export const sampleExtractedQuestions: ExtractedQuestionItem[] = [
  {
    id: 'ext-q-1',
    documentId: 'doc-1',
    documentTitle: 'Kerala PSC LDC Master Booklet 2024 (Compilation)',
    questionNumber: 1,
    questionText: 'Who was the Viceroy of India when the Indian National Congress was founded in 1885?',
    questionMalayalam: '1885-ൽ ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസ് രൂപീകരിക്കപ്പെടുമ്പോൾ ഇന്ത്യയിലെ വൈസ്രോയി ആരായിരുന്നു?',
    options: [
      { id: 'A', text: 'Lord Curzon' },
      { id: 'B', text: 'Lord Dufferin' },
      { id: 'C', text: 'Lord Ripon' },
      { id: 'D', text: 'Lord Canning' },
    ],
    correctAnswer: 'B',
    answerSource: 'official_key',
    explanationText: 'Lord Dufferin served as Viceroy of India from 1884 to 1888. Allan Octavian Hume met him before the first session was convened in Bombay.',
    confidenceScore: 99,
    isDuplicate: false,
    verificationStatus: 'approved_published',
    reviewedBy: 'Dr. Radhakrishnan V.',
    examSlug: 'kerala-psc-ldc',
    examName: 'Kerala PSC LDC',
    subject: 'Modern Indian History',
    topic: 'Indian National Congress Formation',
    sourcePaperCode: '042/2024-M',
  },
  {
    id: 'ext-q-2',
    documentId: 'doc-1',
    documentTitle: 'Kerala PSC LDC Master Booklet 2024 (Compilation)',
    questionNumber: 2,
    questionText: 'Which constitutional amendment added the Fundamental Duty regarding education of children between 6 and 14 years?',
    questionMalayalam: '6 മുതൽ 14 വയസ്സുവരെയുള്ള കുട്ടികളുടെ വിദ്യാഭ്യാസം മൗലിക കടമയായി ചേർത്ത ഭരണഘടനാ ഭേദഗതി ഏത്?',
    options: [
      { id: 'A', text: '42nd Amendment (1976)' },
      { id: 'B', text: '44th Amendment (1978)' },
      { id: 'C', text: '86th Amendment (2002)' },
      { id: 'D', text: '91st Amendment (2003)' },
    ],
    correctAnswer: 'C',
    answerSource: 'official_key',
    explanationText: 'The 86th Constitutional Amendment Act 2002 inserted Article 21A, modified Article 45, and added sub-clause (k) to Article 51A.',
    confidenceScore: 98,
    isDuplicate: false,
    verificationStatus: 'pending_verification',
    examSlug: 'kerala-psc-ldc',
    examName: 'Kerala PSC LDC',
    subject: 'Indian Polity & Constitution',
    topic: 'Fundamental Duties & Amendments',
    sourcePaperCode: '042/2024-M',
  },
  {
    id: 'ext-q-3',
    documentId: 'doc-2',
    documentTitle: 'Kerala Degree Level Prelims Scanned Archive 2024',
    questionNumber: 15,
    questionText: 'Which river in Kerala is known as the "Dakshina Bhagirathi"?',
    questionMalayalam: 'കേരളത്തിന്റെ ദക്ഷിണ ഭാഗീരഥി എന്നറിയപ്പെടുന്ന നദി ഏത്?',
    options: [
      { id: 'A', text: 'Periyar' },
      { id: 'B', text: 'Pamba' },
      { id: 'C', text: 'Bharathapuzha' },
      { id: 'D', text: 'Kallada' },
    ],
    correctAnswer: 'B',
    answerSource: 'ai_suggested',
    explanationText: 'Pamba River is reverentially called Dakshina Bhagirathi due to its holy association with Sabarimala shrine. It is the third longest river in Kerala (176 km).',
    confidenceScore: 94,
    isDuplicate: false,
    flaggedError: 'AI Answer Suggested - Official answer key was not supplied with this booklet.',
    verificationStatus: 'pending_verification',
    examSlug: 'kerala-psc-degree-prelims',
    examName: 'Kerala PSC Degree Level',
    subject: 'Kerala Geography',
    topic: 'Drainage & Rivers of Kerala',
    sourcePaperCode: '115/2024',
  },
  {
    id: 'ext-q-4',
    documentId: 'doc-2',
    documentTitle: 'Kerala Degree Level Prelims Scanned Archive 2024',
    questionNumber: 16,
    questionText: 'Who founded the "Sadhu Jana Paripalana Sangham" (SJPS) in 1907?',
    questionMalayalam: '1907-ൽ സാധുജന പരിപാലന സംഘം സ്ഥാപിച്ച സാമൂഹിക പരിഷ്കർത്താവ് ആര്?',
    options: [
      { id: 'A', text: 'Sree Narayana Guru' },
      { id: 'B', text: 'Ayyankali' },
      { id: 'C', text: 'Chattampi Swamikal' },
      { id: 'D', text: 'Vakkom Moulavi' },
    ],
    correctAnswer: 'B',
    answerSource: 'ai_suggested',
    explanationText: 'Mahatma Ayyankali founded SJPS at Venganoor in 1907.',
    confidenceScore: 99,
    isDuplicate: true,
    flaggedError: 'Duplicate detected: Similar item already published under Kerala PSC LDC Paper 042/2024-M (Q#2).',
    verificationStatus: 'pending_verification',
    examSlug: 'kerala-psc-degree-prelims',
    examName: 'Kerala PSC Degree Level',
    subject: 'Kerala Renaissance',
    topic: 'Social Reformers',
    sourcePaperCode: '115/2024',
  }
];

export const mockInitialProcessingDocuments: ProcessingDocument[] = [
  {
    id: 'doc-1',
    fileName: 'Kerala_PSC_LDC_10Year_Mega_Compilation_120Pages.pdf',
    fileSizeBytes: 149317222,
    fileSizeDisplay: '142.4 MB',
    examSlug: 'kerala-psc-ldc',
    examName: 'Kerala PSC LDC',
    year: 2024,
    paperCode: '042/2024-M-MEGA',
    language: 'Bilingual',
    hasOfficialAnswerKey: true,
    answerKeyFileName: 'Official_Key_LDC_2024_Gazette.pdf',
    checksumHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isScanned: true,
    status: 'completed',
    uploadedBytes: 149317222,
    progressPercentage: 100,
    uploadSpeedMBps: 0,
    remainingSeconds: 0,
    chunkInfo: {
      chunkSizeMB: 10,
      totalChunks: 15,
      uploadedChunks: 15,
      uploadId: 'upl-chunk-001',
      resumeToken: 'tok-ldc-mega-final',
    },
    batchInfo: {
      currentBatch: 12,
      totalBatches: 12,
      pagesPerBatch: 10,
      startPage: 111,
      endPage: 120,
      totalPages: 120,
    },
    currentStep: 11,
    stepsState: createInitialPipelineSteps(12, true),
    extractedQuestions: sampleExtractedQuestions.filter(q => q.documentId === 'doc-1'),
    totalExtractedCount: 100,
    approvedCount: 88,
    rejectedCount: 2,
    pendingCount: 10,
    createdAt: '2026-11-06 14:30',
    updatedAt: '2026-11-06 15:12',
  },
  {
    id: 'doc-2',
    fileName: 'Kerala_Degree_Level_Prelims_Stage1_Full_Booklet.pdf',
    fileSizeBytes: 90709934,
    fileSizeDisplay: '86.5 MB',
    examSlug: 'kerala-psc-degree-prelims',
    examName: 'Kerala PSC Degree Level',
    year: 2024,
    paperCode: '115/2024-FULL',
    language: 'English',
    hasOfficialAnswerKey: false,
    checksumHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    isScanned: false,
    status: 'processing',
    uploadedBytes: 90709934,
    progressPercentage: 100,
    uploadSpeedMBps: 0,
    remainingSeconds: 0,
    chunkInfo: {
      chunkSizeMB: 10,
      totalChunks: 9,
      uploadedChunks: 9,
      uploadId: 'upl-chunk-002',
      resumeToken: 'tok-deg-prelims-9',
    },
    batchInfo: {
      currentBatch: 5,
      totalBatches: 8,
      pagesPerBatch: 10,
      startPage: 41,
      endPage: 50,
      totalPages: 80,
    },
    currentStep: 6, // Step 6: Extract question text and options A, B, C and D
    stepsState: createInitialPipelineSteps(6, false),
    extractedQuestions: sampleExtractedQuestions.filter(q => q.documentId === 'doc-2'),
    totalExtractedCount: 45,
    approvedCount: 0,
    rejectedCount: 0,
    pendingCount: 45,
    createdAt: '2026-11-06 20:15',
    updatedAt: '2026-11-06 21:40',
  },
  {
    id: 'doc-3',
    fileName: 'Kerala_Police_SI_Executive_Scanned_OMR_Comp.pdf',
    fileSizeBytes: 120586240,
    fileSizeDisplay: '115.0 MB',
    examSlug: 'kerala-police-si',
    examName: 'Kerala Police SI',
    year: 2023,
    paperCode: '142/2023-SI-SCAN',
    language: 'Malayalam',
    hasOfficialAnswerKey: true,
    checksumHash: '3b95d9e3b129e14d0ad0e1e9d5012f3bc34f017654d822cd00322f70d432cbfb',
    isScanned: true,
    status: 'failed',
    uploadedBytes: 120586240,
    progressPercentage: 100,
    uploadSpeedMBps: 0,
    remainingSeconds: 0,
    chunkInfo: {
      chunkSizeMB: 10,
      totalChunks: 12,
      uploadedChunks: 12,
      uploadId: 'upl-chunk-003',
      resumeToken: 'tok-pol-si-err',
    },
    batchInfo: {
      currentBatch: 4,
      totalBatches: 9,
      pagesPerBatch: 10,
      startPage: 31,
      endPage: 40,
      totalPages: 90,
    },
    currentStep: 4, // Failed at OCR
    stepsState: [
      { stepNumber: 1, stepName: 'Validate PDF', description: 'Header verified.', status: 'completed' },
      { stepNumber: 2, stepName: 'Detect Text Type', description: 'Scanned bitmap detected.', status: 'completed' },
      { stepNumber: 3, stepName: 'Extract Text (Normal)', description: 'Skipped for raster.', status: 'skipped' },
      { stepNumber: 4, stepName: 'OCR Engine (Scanned)', description: 'OCR worker timed out on blurred page 37 (Batch 4/9).', status: 'failed', detailMessage: 'Neural OCR worker timed out. Click "Retry Batch Recovery" to resume without restarting upload.' },
      { stepNumber: 5, stepName: 'Detect Questions', description: 'Pending.', status: 'pending' },
      { stepNumber: 6, stepName: 'Extract Options (A-D)', description: 'Pending.', status: 'pending' },
      { stepNumber: 7, stepName: 'Match Official Key', description: 'Pending.', status: 'pending' },
      { stepNumber: 8, stepName: 'AI Answer & Explanation', description: 'Pending.', status: 'pending' },
      { stepNumber: 9, stepName: 'Detect Duplicates & Errors', description: 'Pending.', status: 'pending' },
      { stepNumber: 10, stepName: 'Admin Verification Queue', description: 'Pending.', status: 'pending' },
      { stepNumber: 11, stepName: 'Publish to Question Bank', description: 'Pending.', status: 'pending' },
    ],
    extractedQuestions: [],
    totalExtractedCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
    errorLog: 'Neural OCR service worker heartbeat timeout at page 37. Document byte stream is safe. Resumable retry ready.',
    createdAt: '2026-11-06 18:00',
    updatedAt: '2026-11-06 18:25',
  }
];

export const calculatePipelineStats = (docs: ProcessingDocument[]): ProcessingDashboardMetrics => {
  const totalUploaded = docs.length;
  const processing = docs.filter(d => d.status === 'processing' || d.status === 'uploading').length;
  const completed = docs.filter(d => d.status === 'completed').length;
  const failed = docs.filter(d => d.status === 'failed').length;

  let totalExtracted = 0;
  let awaitingVerification = 0;
  let approvedPublished = 0;

  docs.forEach(d => {
    totalExtracted += d.totalExtractedCount;
    awaitingVerification += d.pendingCount;
    approvedPublished += d.approvedCount;
  });

  return {
    totalUploadedDocuments: totalUploaded,
    documentsProcessing: processing,
    completedDocuments: completed,
    failedDocuments: failed,
    totalExtractedQuestions: totalExtracted,
    questionsAwaitingVerification: awaitingVerification,
    approvedPublishedQuestions: approvedPublished,
  };
};
