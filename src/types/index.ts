export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export type UserRole = 'student' | 'super_admin';

export const isSuperAdminRole = (role: UserRole | string | null | undefined): boolean => {
  return role === 'super_admin' || role === 'admin';
};

export const getRedirectForRole = (role: UserRole | string | null | undefined): string => {
  if (isSuperAdminRole(role)) return '/admin';
  if (role === 'student') return '/dashboard';
  return '/login';
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  targetExams: string[];
  preferredLanguage: 'English' | 'Malayalam' | 'Both';
  avatarUrl?: string;
  joinedDate: string;
  themePreference: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  dailyReminder: boolean;
}

export interface ExamCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  examCount: number;
}

export interface SubjectTopic {
  id: string;
  name: string;
  questionCount: number;
  weightagePercentage?: number;
}

export interface ExamSubject {
  id: string;
  name: string;
  topics: SubjectTopic[];
  totalQuestions: number;
}

export interface Exam {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  paperCount: number;
  practiceQuestionsCount: number;
  isPopular: boolean;
  isRecentlyAdded?: boolean;
  overview: string;
  eligibility: string;
  examPattern: string;
  officialWebsiteUrl?: string;
  subjects: ExamSubject[];
  importantTopics: string[];
  published: boolean;
}

export interface PYQPaper {
  id: string;
  examId: string;
  examSlug: string;
  examName: string;
  category: string;
  year: number;
  paperCode: string;
  language: 'Malayalam' | 'English' | 'Bilingual' | 'Tamil' | 'Kannada';
  subject: string;
  totalMarks: number;
  durationMinutes: number;
  verificationStatus: VerificationStatus;
  hasOfficialAnswerKey: boolean;
  fileSize: string;
  uploadedAt: string;
  downloadCount: number;
  published: boolean;
  pdfUrl?: string;
  answerKeyPdfUrl?: string;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuestionExplanation {
  correctReason: string;
  incorrectReason?: {
    [key in 'A' | 'B' | 'C' | 'D']?: string;
  };
  facts: string[];
  relatedTopic: string;
  source?: string;
  isAIGenerated?: boolean;
  isReviewed?: boolean;
}

export interface MCQQuestion {
  id: string;
  paperId?: string;
  examSlug: string;
  examName: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  year?: number;
  questionText: string;
  questionMalayalam?: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: QuestionExplanation;
  verificationStatus: VerificationStatus;
  isVerifiedOfficialKey: boolean;
  sourcePaperName?: string;
}

export interface MockTest {
  id: string;
  title: string;
  examSlug: string;
  examName: string;
  category: string;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  negativeMarking: number; // e.g. 0.33
  passMarks: number;
  questions: MCQQuestion[];
  instructions: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'available' | 'upcoming';
  scheduledDate?: string;
}

export interface MockTestAttempt {
  id: string;
  mockTestId: string;
  mockTestTitle: string;
  examName: string;
  date: string;
  timeTakenMinutes: number;
  totalMarks: number;
  score: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  answers: {
    questionId: string;
    selectedOption?: 'A' | 'B' | 'C' | 'D';
    isCorrect: boolean;
    timeSpentSeconds: number;
  }[];
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  questions: MCQQuestion[];
  streakRewardDays: number;
  isCompleted?: boolean;
}

export interface StudyPlanItem {
  id: string;
  examSlug: string;
  examName: string;
  subject: string;
  topic: string;
  targetDate: string;
  estimatedMinutes: number;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'paper' | 'mock' | 'challenge' | 'announcement' | 'system';
  date: string;
  read: boolean;
  link?: string;
}

export interface MistakeNotebookItem {
  id: string;
  question: MCQQuestion;
  wrongAttemptsCount: number;
  lastAttemptedDate: string;
  selectedWrongOption: 'A' | 'B' | 'C' | 'D';
  isCorrected: boolean;
}

export interface AdminStats {
  totalStudents: number;
  totalExams: number;
  totalPapers: number;
  totalQuestions: number;
  pendingContentApprovals: number;
  recentUploadsCount: number;
  reportedQuestionsCount: number;
  systemHealth: string;
}

export interface PaperCollectionJob {
  id: string;
  sourceName: string;
  sourceUrl: string;
  status: 'Completed' | 'Running' | 'Failed' | 'Pending Review';
  discoveredCount: number;
  approvedCount: number;
  lastRunDate: string;
}

// ---------------------------------------------------------------------------
// NEW: Chunked Resumable Upload & Automatic 11-Step Pipeline Types
// ---------------------------------------------------------------------------

export type DocumentUploadStatus =
  | 'queued'
  | 'uploading'
  | 'paused'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ChunkUploadMetadata {
  chunkSizeMB: number;
  totalChunks: number;
  uploadedChunks: number;
  uploadId: string;
  resumeToken: string;
}

export interface BatchProcessingInfo {
  currentBatch: number;
  totalBatches: number;
  pagesPerBatch: number;
  startPage: number;
  endPage: number;
  totalPages: number;
}

export type PipelineStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';

export interface PipelineStepState {
  stepNumber: number; // 1 to 11
  stepName: string;
  description: string;
  status: PipelineStepStatus;
  detailMessage?: string;
  timestamp?: string;
}

export interface ExtractedQuestionItem {
  id: string;
  documentId: string;
  documentTitle: string;
  questionNumber: number;
  questionText: string;
  questionMalayalam?: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  answerSource: 'official_key' | 'ai_suggested';
  explanationText: string;
  confidenceScore: number; // 0 to 100
  isDuplicate: boolean;
  flaggedError?: string;
  verificationStatus: 'pending_verification' | 'approved_published' | 'rejected';
  reviewedBy?: string;
  examSlug: string;
  examName: string;
  subject: string;
  topic: string;
  sourcePaperCode: string;
}

export interface ProcessingDocument {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  fileSizeDisplay: string;
  examSlug: string;
  examName: string;
  year: number;
  paperCode: string;
  language: 'Malayalam' | 'English' | 'Bilingual' | 'Tamil' | 'Kannada';
  hasOfficialAnswerKey: boolean;
  answerKeyFileName?: string;
  checksumHash: string; // SHA-256 duplicate detection
  isScanned: boolean;
  status: DocumentUploadStatus;
  uploadedBytes: number;
  progressPercentage: number;
  uploadSpeedMBps: number;
  remainingSeconds: number;
  chunkInfo: ChunkUploadMetadata;
  batchInfo: BatchProcessingInfo;
  currentStep: number; // 1 to 11
  stepsState: PipelineStepState[];
  extractedQuestions: ExtractedQuestionItem[];
  totalExtractedCount: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  errorLog?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingDashboardMetrics {
  totalUploadedDocuments: number;
  documentsProcessing: number;
  completedDocuments: number;
  failedDocuments: number;
  totalExtractedQuestions: number;
  questionsAwaitingVerification: number;
  approvedPublishedQuestions: number;
}
