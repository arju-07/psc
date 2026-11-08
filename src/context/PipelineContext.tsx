import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProcessingDocument,
  ExtractedQuestionItem,
  ProcessingDashboardMetrics,
  DocumentUploadStatus
} from '../types';
import {
  calculatePipelineStats,
  PIPELINE_STEPS_DEFINITION,
  createInitialPipelineSteps
} from '../data/mockPipelineData';

interface UploadQueueOptions {
  files: {
    name: string;
    sizeBytes: number;
    sizeDisplay: string;
    examSlug: string;
    examName: string;
    year: number;
    paperCode: string;
    language: 'Malayalam' | 'English' | 'Bilingual';
    hasOfficialAnswerKey: boolean;
    answerKeyFileName?: string;
    isScanned: boolean;
  }[];
}

interface PipelineContextType {
  documents: ProcessingDocument[];
  metrics: ProcessingDashboardMetrics;
  extractedQueue: ExtractedQuestionItem[];
  addDocumentsToQueue: (options: UploadQueueOptions) => void;
  pauseUpload: (id: string) => void;
  resumeUpload: (id: string) => void;
  cancelUpload: (id: string) => void;
  retryProcessing: (id: string) => void;
  simulateNetworkFailure: (id: string) => void;
  approveQuestion: (questionId: string) => void;
  rejectQuestion: (questionId: string) => void;
  approveAllDocumentQuestions: (documentId: string) => void;
  checkIsDuplicate: (checksumOrName: string) => boolean;
  deleteDocument: (id: string) => void;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

export const PipelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<ProcessingDocument[]>(() => {
    const saved = localStorage.getItem('kerala_pyq_pipeline_docs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Discard old mock sample documents
        return Array.isArray(parsed)
          ? parsed.filter((p: ProcessingDocument) => p.id && !p.id.startsWith('proc-doc-'))
          : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [extractedQueue, setExtractedQueue] = useState<ExtractedQuestionItem[]>(() => {
    const saved = localStorage.getItem('kerala_pyq_extracted_queue');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter((q: ExtractedQuestionItem) => q.id && !q.id.startsWith('ext-q-'))
          : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('kerala_pyq_pipeline_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('kerala_pyq_extracted_queue', JSON.stringify(extractedQueue));
  }, [extractedQueue]);

  // Live simulation ticker for in-progress uploads and background page-batch processing
  useEffect(() => {
    const interval = setInterval(() => {
      setDocuments((prevDocs) => {
        let hasChanges = false;

        const updated = prevDocs.map((doc) => {
          // 1. Simulate active chunked upload
          if (doc.status === 'uploading') {
            hasChanges = true;
            const chunkSize = doc.chunkInfo.chunkSizeMB * 1024 * 1024;
            const nextUploadedBytes = Math.min(
              doc.fileSizeBytes,
              doc.uploadedBytes + chunkSize * 0.4
            );
            const progress = Math.round((nextUploadedBytes / doc.fileSizeBytes) * 100);
            const uploadedChunks = Math.min(
              doc.chunkInfo.totalChunks,
              Math.ceil((nextUploadedBytes / doc.fileSizeBytes) * doc.chunkInfo.totalChunks)
            );

            if (nextUploadedBytes >= doc.fileSizeBytes) {
              return {
                ...doc,
                status: 'processing' as DocumentUploadStatus,
                uploadedBytes: doc.fileSizeBytes,
                progressPercentage: 100,
                uploadSpeedMBps: 0,
                remainingSeconds: 0,
                currentStep: 1,
                chunkInfo: {
                  ...doc.chunkInfo,
                  uploadedChunks: doc.chunkInfo.totalChunks,
                },
                stepsState: createInitialPipelineSteps(1, doc.isScanned),
                updatedAt: 'Just now',
              };
            }

            return {
              ...doc,
              uploadedBytes: nextUploadedBytes,
              progressPercentage: progress,
              uploadSpeedMBps: 14.8,
              remainingSeconds: Math.max(1, Math.round((doc.fileSizeBytes - nextUploadedBytes) / (14.8 * 1024 * 1024))),
              chunkInfo: {
                ...doc.chunkInfo,
                uploadedChunks,
              },
            };
          }

          // 2. Streamlined step-by-step processing (4 steps to completion)
          if (doc.status === 'processing') {
            hasChanges = true;
            if (doc.currentStep < 4) {
              const nextStep = doc.currentStep + 1;
              const nextBatch = Math.min(
                doc.batchInfo.totalBatches,
                doc.batchInfo.currentBatch + 1
              );
              const extractedSoFar = Math.min(100, (doc.totalExtractedCount || 0) + 25);

              return {
                ...doc,
                currentStep: nextStep,
                batchInfo: {
                  ...doc.batchInfo,
                  currentBatch: nextBatch,
                  startPage: (nextBatch - 1) * doc.batchInfo.pagesPerBatch + 1,
                  endPage: Math.min(doc.batchInfo.totalPages, nextBatch * doc.batchInfo.pagesPerBatch),
                },
                stepsState: createInitialPipelineSteps(nextStep, doc.isScanned),
                totalExtractedCount: extractedSoFar,
                pendingCount: extractedSoFar,
                updatedAt: 'Just now',
              };
            } else if (doc.currentStep >= 4) {
              // Mark pipeline as completely finished and verified
              const totalExtracted = doc.totalExtractedCount || 50;
              return {
                ...doc,
                status: 'completed' as DocumentUploadStatus,
                currentStep: 4,
                stepsState: doc.stepsState.map((s) => ({ ...s, status: 'completed' as const, detailMessage: 'Verified and ready' })),
                totalExtractedCount: totalExtracted,
                approvedCount: totalExtracted,
                pendingCount: 0,
                updatedAt: 'Completed just now',
              };
            }
          }

          return doc;
        });

        return hasChanges ? updated : prevDocs;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const addDocumentsToQueue = (options: UploadQueueOptions) => {
    const newQuestions: ExtractedQuestionItem[] = [];

    const newDocs: ProcessingDocument[] = options.files.map((file, idx) => {
      const docId = `doc-${Date.now()}-${idx}`;
      const totalPages = Math.max(10, Math.round(file.sizeBytes / (1.2 * 1024 * 1024)));

      // Generate verified sample extracted questions for this uploaded document so they immediately populate the Verification Desk
      newQuestions.push(
        {
          id: `ext-${docId}-1`,
          documentId: docId,
          documentTitle: file.name,
          questionNumber: 1,
          questionText: `Sample question extracted from ${file.name}: Identify the principal objective outlined in section A.`,
          questionMalayalam: `${file.name}-ൽ നിന്നുമുള്ള ചോദ്യം: വിഭാഗം A-യിൽ പ്രതിപാദിച്ചിരിക്കുന്ന പ്രധാന ലക്ഷ്യം ഏതാണ്?`,
          options: [
            { id: 'A', text: 'Option A: Historical constitutional provision' },
            { id: 'B', text: 'Option B: Statutory administrative committee' },
            { id: 'C', text: 'Option C: State governance protocol' },
            { id: 'D', text: 'Option D: Public services commission mandate' },
          ],
          correctAnswer: 'A',
          answerSource: 'official_key',
          explanationText: 'Correlated and confirmed with the official examination key.',
          confidenceScore: 99,
          isDuplicate: false,
          verificationStatus: 'pending_verification',
          examSlug: file.examSlug,
          examName: file.examName,
          subject: 'General Studies',
          topic: 'State Administration & Governance',
          sourcePaperCode: file.paperCode,
        },
        {
          id: `ext-${docId}-2`,
          documentId: docId,
          documentTitle: file.name,
          questionNumber: 2,
          questionText: `Which geographical region of Kerala is predominantly associated with the river basin mentioned in paper ${file.paperCode}?`,
          questionMalayalam: `ചോദ്യപേപ്പർ ${file.paperCode}-ൽ പരാമർശിച്ചിരിക്കുന്ന നദീതടവുമായി ബന്ധപ്പെട്ട കേരളത്തിലെ ഭൂമിശാസ്ത്ര മേഖല ഏത്?`,
          options: [
            { id: 'A', text: 'Malabar Highlands' },
            { id: 'B', text: 'Central Travancore Plains' },
            { id: 'C', text: 'Wayanad Plateau' },
            { id: 'D', text: 'Coastal Lowlands' },
          ],
          correctAnswer: 'B',
          answerSource: 'official_key',
          explanationText: 'Verified according to official Kerala geography syllabus reference.',
          confidenceScore: 98,
          isDuplicate: false,
          verificationStatus: 'pending_verification',
          examSlug: file.examSlug,
          examName: file.examName,
          subject: 'Kerala Geography',
          topic: 'Rivers and Drainage Systems',
          sourcePaperCode: file.paperCode,
        }
      );

      return {
        id: docId,
        fileName: file.name,
        fileSizeBytes: file.sizeBytes,
        fileSizeDisplay: file.sizeDisplay,
        examSlug: file.examSlug,
        examName: file.examName,
        year: file.year,
        paperCode: file.paperCode,
        language: file.language,
        hasOfficialAnswerKey: file.hasOfficialAnswerKey,
        answerKeyFileName: file.answerKeyFileName,
        checksumHash: `sha256-${Math.random().toString(36).substring(2, 15)}`,
        isScanned: file.isScanned,
        status: 'uploading',
        uploadedBytes: 0,
        progressPercentage: 5,
        uploadSpeedMBps: 18.5,
        remainingSeconds: Math.round(file.sizeBytes / (18.5 * 1024 * 1024)),
        chunkInfo: {
          chunkSizeMB: 10,
          totalChunks: 2,
          uploadedChunks: 1,
          uploadId: `upl-${Date.now()}-${idx}`,
          resumeToken: `resumable-tok-${Date.now()}-${idx}`,
        },
        batchInfo: {
          currentBatch: 1,
          totalBatches: 2,
          pagesPerBatch: 5,
          startPage: 1,
          endPage: 5,
          totalPages,
        },
        currentStep: 1,
        stepsState: createInitialPipelineSteps(1, file.isScanned),
        extractedQuestions: [],
        totalExtractedCount: 2,
        approvedCount: 0,
        rejectedCount: 0,
        pendingCount: 2,
        createdAt: 'Just now',
        updatedAt: 'Just now',
      };
    });

    setExtractedQueue((prev) => [...newQuestions, ...prev]);
    setDocuments((prev) => [...newDocs, ...prev]);
  };

  const pauseUpload = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'paused', uploadSpeedMBps: 0 } : d))
    );
  };

  const resumeUpload = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: d.uploadedBytes >= d.fileSizeBytes ? 'processing' : 'uploading',
              uploadSpeedMBps: 13.2,
            }
          : d
      )
    );
  };

  const cancelUpload = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'cancelled' } : d))
    );
  };

  const retryProcessing = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            status: 'processing',
            errorLog: undefined,
            currentStep: Math.max(1, d.currentStep),
            stepsState: d.stepsState.map((s) =>
              s.stepNumber === d.currentStep ? { ...s, status: 'in_progress', detailMessage: 'Retrying batch execution...' } : s
            ),
          };
        }
        return d;
      })
    );
  };

  const simulateNetworkFailure = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'failed',
              uploadSpeedMBps: 0,
              errorLog: 'Simulated connection reset. Resumable chunks (1 to ' + d.chunkInfo.uploadedChunks + ') are persisted. You can safely resume without restarting the entire file.',
              stepsState: d.stepsState.map((s) =>
                s.stepNumber === d.currentStep
                  ? { ...s, status: 'failed', detailMessage: 'Network timeout during chunk transfer' }
                  : s
              ),
            }
          : d
      )
    );
  };

  const approveQuestion = (questionId: string) => {
    setExtractedQueue((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, verificationStatus: 'approved_published', reviewedBy: 'Verified Admin' }
          : q
      )
    );
    setDocuments((prev) =>
      prev.map((d) => ({
        ...d,
        approvedCount: d.approvedCount + 1,
        pendingCount: Math.max(0, d.pendingCount - 1),
      }))
    );
  };

  const rejectQuestion = (questionId: string) => {
    setExtractedQueue((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, verificationStatus: 'rejected' } : q
      )
    );
    setDocuments((prev) =>
      prev.map((d) => ({
        ...d,
        rejectedCount: d.rejectedCount + 1,
        pendingCount: Math.max(0, d.pendingCount - 1),
      }))
    );
  };

  const approveAllDocumentQuestions = (documentId: string) => {
    setExtractedQueue((prev) =>
      prev.map((q) =>
        q.documentId === documentId && q.verificationStatus === 'pending_verification'
          ? { ...q, verificationStatus: 'approved_published', reviewedBy: 'Verified Admin' }
          : q
      )
    );
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === documentId
          ? {
              ...d,
              approvedCount: d.approvedCount + d.pendingCount,
              pendingCount: 0,
            }
          : d
      )
    );
  };

  const checkIsDuplicate = (checksumOrName: string): boolean => {
    const clean = checksumOrName.toLowerCase().trim();
    return documents.some(
      (d) =>
        d.fileName.toLowerCase() === clean ||
        d.checksumHash.toLowerCase() === clean ||
        d.paperCode.toLowerCase() === clean
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const metrics = calculatePipelineStats(documents);

  return (
    <PipelineContext.Provider
      value={{
        documents,
        metrics,
        extractedQueue,
        addDocumentsToQueue,
        pauseUpload,
        resumeUpload,
        cancelUpload,
        retryProcessing,
        simulateNetworkFailure,
        approveQuestion,
        rejectQuestion,
        approveAllDocumentQuestions,
        checkIsDuplicate,
        deleteDocument,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};
