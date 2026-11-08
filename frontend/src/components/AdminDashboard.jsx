import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Globe,
  Users,
  FileText,
  BarChart2,
  Trash2,
  ExternalLink,
  RefreshCw,
  FolderPlus,
  Key
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({
  currentUser,
  categories,
  onRefreshCategories
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('queue'); // 'queue' | 'categories' | 'exams' | 'upload' | 'sources' | 'audit' | 'users'
  const [unverifiedQueue, setUnverifiedQueue] = useState([]);
  const [sources, setSources] = useState([]);
  const [auditReport, setAuditReport] = useState({ duplicates: [], broken_links: [] });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Forms state
  const [newCategory, setNewCategory] = useState({ name: '', name_malayalam: '', description: '', icon: 'BookOpen' });
  const [newExam, setNewExam] = useState({ name: '', name_malayalam: '', code: '', category_id: '', description: '' });
  const [newSource, setNewSource] = useState({ name: '', base_url: '', target_url: '', category_id: 'cat-kpsc', frequency: 'Weekly' });

  // PDF upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMeta, setUploadMeta] = useState({
    exam_id: 'exam-kpsc-degree-prelims',
    paper_code: '',
    year: 2024,
    language: 'Malayalam & English',
    session_name: ''
  });

  // Question Bank Management State (Phase 2)
  const [questionBank, setQuestionBank] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [qPage, setQPage] = useState(1);
  const [qSubjectFilter, setQSubjectFilter] = useState('');
  const [subjectsList, setSubjectsList] = useState([]);
  const [topicsList, setTopicsList] = useState([]);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newQuestionForm, setNewQuestionForm] = useState({
    question_text: '',
    question_text_malayalam: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correct_option: 'A',
    explanation: '',
    explanation_malayalam: '',
    subject_id: 'subj-kerala-history',
    topic_id: 'topic-social-reform',
    difficulty: 'Medium',
    year: 2024,
    is_verified: true
  });

  // Mock Tests State (Phase 2)
  const [adminMockTests, setAdminMockTests] = useState([]);
  const [showAddMockModal, setShowAddMockModal] = useState(false);
  const [newMockForm, setNewMockForm] = useState({
    name: '',
    name_malayalam: '',
    exam_id: 'exam-kpsc-degree-prelims',
    description: '',
    duration_minutes: 75,
    total_questions: 100,
    marks_per_question: 1.0,
    negative_marking: 0.33,
    difficulty: 'Medium'
  });

  useEffect(() => {
    loadAdminData();
  }, [activeAdminTab]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (activeAdminTab === 'queue') {
        const q = await api.getUnverifiedQueue();
        setUnverifiedQueue(q || []);
      } else if (activeAdminTab === 'sources') {
        const s = await api.getSources();
        setSources(s || []);
      } else if (activeAdminTab === 'audit') {
        const a = await api.getAuditReport();
        setAuditReport(a || { duplicates: [], broken_links: [] });
      } else if (activeAdminTab === 'users') {
        const u = await api.getUsers();
        setUsers(u || []);
      } else if (activeAdminTab === 'questions') {
        const [qRes, subRes] = await Promise.all([
          api.getQuestionBank({ subject_id: qSubjectFilter || undefined, page: qPage, limit: 15, verified_only: false }),
          api.getSubjects()
        ]);
        setQuestionBank(qRes.questions || []);
        setTotalQuestions(qRes.total || 0);
        setSubjectsList(subRes || []);
      } else if (activeAdminTab === 'mocks') {
        const mocks = await api.getMockTests();
        setAdminMockTests(mocks || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Queue actions
  const handleApprove = async (paperId) => {
    try {
      await api.approvePaper(paperId, currentUser?.name || 'Admin Officer');
      showNotification('Question paper verified and published to public catalogue.');
      loadAdminData();
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleReject = async (paperId) => {
    try {
      await api.rejectPaper(paperId, 'Does not match official format requirements.');
      showNotification('Paper rejected and excluded.');
      loadAdminData();
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  // Trigger Collection Engine Scan
  const handleTriggerCollection = async () => {
    setLoading(true);
    try {
      const res = await api.triggerCollectionJob();
      showNotification(`Collection job completed! Discovered: ${res.papers_discovered}, Queued for Review: ${res.items_queued_for_review.length}`);
      loadAdminData();
    } catch (err) {
      console.error('Collection trigger failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run audit
  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await api.runAudit();
      showNotification(`Audit complete! Checked ${res.total_papers_checked} papers.`);
      loadAdminData();
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    try {
      await api.createCategory(newCategory);
      setNewCategory({ name: '', name_malayalam: '', description: '', icon: 'BookOpen' });
      showNotification('New exam category created successfully.');
      if (onRefreshCategories) onRefreshCategories();
    } catch (err) {
      console.error('Create category failed:', err);
    }
  };

  // Create Exam
  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!newExam.name || !newExam.category_id) return;
    try {
      await api.createExam(newExam);
      setNewExam({ name: '', name_malayalam: '', code: '', category_id: '', description: '' });
      showNotification('New examination created successfully.');
    } catch (err) {
      console.error('Create exam failed:', err);
    }
  };

  // Create Source
  const handleCreateSource = async (e) => {
    e.preventDefault();
    if (!newSource.name || !newSource.base_url) return;
    try {
      await api.addSource(newSource);
      setNewSource({ name: '', base_url: '', target_url: '', category_id: 'cat-kpsc', frequency: 'Weekly' });
      showNotification('Approved source website added.');
      loadAdminData();
    } catch (err) {
      console.error('Add source failed:', err);
    }
  };

  // Upload PDF Handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPdf = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.uploadPaperPdf(formData);
      setUploadResult(res);
      setUploadMeta({
        ...uploadMeta,
        paper_code: res.detected_code || uploadMeta.paper_code || 'MANUAL-UPLOAD',
        year: res.detected_year || uploadMeta.year,
        language: res.detected_language || uploadMeta.language
      });
      showNotification('PDF analyzed with PyMuPDF! Metadata extracted.');
    } catch (err) {
      console.error('PDF upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalizePaperCreation = async () => {
    if (!uploadResult) return;
    try {
      await api.createPaper({
        exam_id: uploadMeta.exam_id,
        paper_code: uploadMeta.paper_code || '001/2024',
        session_name: uploadMeta.session_name || 'Official Examination',
        year: parseInt(uploadMeta.year),
        language: uploadMeta.language,
        total_questions: uploadResult.questions_parsed_count || 100,
        duration_minutes: 75,
        file_url: uploadResult.file_url,
        file_hash: uploadResult.file_hash,
        file_size_bytes: uploadResult.file_size,
        source_url: 'Administrator Manual Upload',
        is_verified: true,
        status: 'APPROVED',
        has_interactive_test: uploadResult.questions_parsed_count > 0,
        notes: 'Manually verified and published by Administrator.'
      });
      setSelectedFile(null);
      setUploadResult(null);
      showNotification('Question paper successfully published to student catalogue!');
    } catch (err) {
      console.error('Paper creation failed:', err);
    }
  };

  // Question Bank Handlers
  const handleCreateQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        question_text: newQuestionForm.question_text,
        question_text_malayalam: newQuestionForm.question_text_malayalam,
        options: [
          { id: 'A', text: newQuestionForm.optionA },
          { id: 'B', text: newQuestionForm.optionB },
          { id: 'C', text: newQuestionForm.optionC },
          { id: 'D', text: newQuestionForm.optionD }
        ],
        correct_option: newQuestionForm.correct_option,
        explanation: newQuestionForm.explanation,
        explanation_malayalam: newQuestionForm.explanation_malayalam,
        subject_id: newQuestionForm.subject_id,
        topic_id: newQuestionForm.topic_id,
        difficulty: newQuestionForm.difficulty,
        year: parseInt(newQuestionForm.year) || 2024,
        is_verified: true
      };
      await api.createQuestion(payload);
      setShowAddQuestionModal(false);
      showNotification('New verified question successfully added to bank!');
      loadAdminData();
    } catch (err) {
      console.error('Failed to create question:', err);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm('Are you sure you want to remove this question?')) return;
    try {
      await api.deleteQuestion(qId);
      showNotification('Question deleted.');
      loadAdminData();
    } catch (err) {
      console.error('Delete question failed:', err);
    }
  };

  const handleToggleQuestionVerify = async (q) => {
    try {
      await api.updateQuestion(q.id, { is_verified: !q.is_verified });
      showNotification(`Question verification status updated to ${!q.is_verified ? 'VERIFIED' : 'UNVERIFIED'}`);
      loadAdminData();
    } catch (err) {
      console.error('Toggle verify failed:', err);
    }
  };

  // Mock Test Handler
  const handleCreateMockSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createMockTest(newMockForm);
      setShowAddMockModal(false);
      showNotification('Mock test created successfully!');
      loadAdminData();
    } catch (err) {
      console.error('Failed to create mock test:', err);
    }
  };

  const handleDeleteMockTest = async (mtId) => {
    if (!confirm('Delete this mock test?')) return;
    try {
      await api.deleteMockTest(mtId);
      showNotification('Mock test removed.');
      loadAdminData();
    } catch (err) {
      console.error('Delete mock test failed:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Kerala PYQ Hub System Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 ml-text">
            ക്യാറ്റലോഗ് മാനേജ്മെന്റ്, ഓട്ടോമാറ്റിക് കളക്ഷൻ ക്യൂ, സോഴ്സ് വെബ്സൈറ്റുകൾ, സിസ്റ്റം ഓഡിറ്റ്.
          </p>
        </div>

        {/* Global Action: Trigger Collection Engine */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTriggerCollection}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center space-x-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Run Collection Engine</span>
          </button>
        </div>
      </div>

      {/* Floating Action Message Banner */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2 shadow-sm animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'queue', label: `Review Queue (${unverifiedQueue.length})`, icon: AlertTriangle },
          { id: 'questions', label: 'Question Bank & Curation', icon: FileText },
          { id: 'mocks', label: 'Mock Test Patterns', icon: BarChart2 },
          { id: 'upload', label: 'Upload Question Paper', icon: Upload },
          { id: 'categories', label: 'Catalogue & Categories', icon: FolderPlus },
          { id: 'exams', label: 'Add Examinations', icon: Plus },
          { id: 'sources', label: 'Approved Sources', icon: Globe },
          { id: 'audit', label: 'Duplicate & Link Auditor', icon: RotateCcw },
          { id: 'users', label: 'Users & Roles', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          // Question Bank Handlers
  const handleCreateQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        question_text: newQuestionForm.question_text,
        question_text_malayalam: newQuestionForm.question_text_malayalam,
        options: [
          { id: 'A', text: newQuestionForm.optionA },
          { id: 'B', text: newQuestionForm.optionB },
          { id: 'C', text: newQuestionForm.optionC },
          { id: 'D', text: newQuestionForm.optionD }
        ],
        correct_option: newQuestionForm.correct_option,
        explanation: newQuestionForm.explanation,
        explanation_malayalam: newQuestionForm.explanation_malayalam,
        subject_id: newQuestionForm.subject_id,
        topic_id: newQuestionForm.topic_id,
        difficulty: newQuestionForm.difficulty,
        year: parseInt(newQuestionForm.year) || 2024,
        is_verified: true
      };
      await api.createQuestion(payload);
      setShowAddQuestionModal(false);
      showNotification('New verified question successfully added to bank!');
      loadAdminData();
    } catch (err) {
      console.error('Failed to create question:', err);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm('Are you sure you want to remove this question?')) return;
    try {
      await api.deleteQuestion(qId);
      showNotification('Question deleted.');
      loadAdminData();
    } catch (err) {
      console.error('Delete question failed:', err);
    }
  };

  const handleToggleQuestionVerify = async (q) => {
    try {
      await api.updateQuestion(q.id, { is_verified: !q.is_verified });
      showNotification(`Question verification status updated to ${!q.is_verified ? 'VERIFIED' : 'UNVERIFIED'}`);
      loadAdminData();
    } catch (err) {
      console.error('Toggle verify failed:', err);
    }
  };

  // Mock Test Handler
  const handleCreateMockSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createMockTest(newMockForm);
      setShowAddMockModal(false);
      showNotification('Mock test created successfully!');
      loadAdminData();
    } catch (err) {
      console.error('Failed to create mock test:', err);
    }
  };

  const handleDeleteMockTest = async (mtId) => {
    if (!confirm('Delete this mock test?')) return;
    try {
      await api.deleteMockTest(mtId);
      showNotification('Mock test removed.');
      loadAdminData();
    } catch (err) {
      console.error('Delete mock test failed:', err);
    }
  };

  return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: REVIEW QUEUE */}
      {activeAdminTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Unverified Scraped Papers Queue
              </h2>
              <p className="text-xs text-slate-500">
                Newly discovered PDF documents requiring human validation before student publication.
              </p>
            </div>
            <button
              onClick={loadAdminData}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Queue</span>
            </button>
          </div>

          {unverifiedQueue.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="mt-2 text-sm font-bold text-slate-800 dark:text-white">
                Review Queue is Empty
              </p>
              <p className="text-xs text-slate-400 mt-1">
                All auto-collected and uploaded question papers have been reviewed and approved.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {unverifiedQueue.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
                        {item.paper_code}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        Year: {item.year}
                      </span>
                      <span className="text-[11px] text-amber-600 font-semibold">
                        Awaiting Verification
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.session_name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Source: <a href={item.source_url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">{item.source_url}</a>
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      SHA256: {item.file_hash?.substring(0, 24)}...
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: UPLOAD QUESTION PAPER */}
      {activeAdminTab === 'upload' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Upload className="w-5 h-5 text-purple-600" />
              <span>Manual PDF Upload & PyMuPDF Parser</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload official question papers. PyMuPDF automatically computes SHA256 hashes and extracts metadata.
            </p>
          </div>

          <div className="space-y-4">
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-purple-500 transition">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                {selectedFile ? selectedFile.name : 'Select or drop official Question Paper PDF'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size: 50MB</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mt-3 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
              />
            </div>

            {selectedFile && !uploadResult && (
              <button
                onClick={handleUploadPdf}
                disabled={isUploading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition disabled:opacity-50"
              >
                {isUploading ? 'Extracting text and checksum...' : 'Process PDF with PyMuPDF'}
              </button>
            )}

            {/* Post Extraction Form */}
            {uploadResult && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                  <span className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    PyMuPDF Extraction Completed
                  </span>
                  <span className="font-mono text-slate-500">Hash: {uploadResult.file_hash.substring(0, 16)}...</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Paper Code</label>
                    <input
                      type="text"
                      value={uploadMeta.paper_code}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, paper_code: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Year</label>
                    <input
                      type="number"
                      value={uploadMeta.year}
                      onChange={(e) => setUploadMeta({ ...uploadMeta, year: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-500 mb-1">Session / Post Title</label>
                  <input
                    type="text"
                    value={uploadMeta.session_name}
                    placeholder="e.g. Stage 1 Morning Session"
                    onChange={(e) => setUploadMeta({ ...uploadMeta, session_name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>

                <button
                  onClick={handleFinalizePaperCreation}
                  className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                >
                  Confirm & Publish to Student Catalogue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EXPAND CATALOGUE & CATEGORIES */}
      {activeAdminTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Category Form */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <FolderPlus className="w-4 h-4 text-purple-600" />
              <span>Add New Examination Category</span>
            </h3>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name (English)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kerala Judicial Service"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name (Malayalam Unicode)
                </label>
                <input
                  type="text"
                  placeholder="e.g. കേരള ജുഡീഷ്യൽ സർവീസ്"
                  value={newCategory.name_malayalam}
                  onChange={(e) => setNewCategory({ ...newCategory, name_malayalam: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl ml-text"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description of recruitment types included..."
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition"
              >
                Create Category
              </button>
            </form>
          </div>

          {/* Current Categories List */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Current Active Categories ({categories.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {categories.map((c, i) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{i + 1}. {c.name}</p>
                    <p className="text-[11px] text-slate-400 ml-text">{c.name_malayalam}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {c.exam_count || 0} Exams
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADD EXAMINATIONS */}
      {activeAdminTab === 'exams' && (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <Plus className="w-4 h-4 text-purple-600" />
            <span>Register New Examination</span>
          </h3>

          <form onSubmit={handleCreateExam} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Parent Category
              </label>
              <select
                required
                value={newExam.category_id}
                onChange={(e) => setNewExam({ ...newExam, category_id: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exam Title (English)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Village Extension Officer (VEO)"
                value={newExam.name}
                onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exam Title (Malayalam Unicode)
              </label>
              <input
                type="text"
                placeholder="e.g. വില്ലേജ് എക്സ്റ്റൻഷൻ ഓഫീസർ"
                value={newExam.name_malayalam}
                onChange={(e) => setNewExam({ ...newExam, name_malayalam: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl ml-text"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exam Code
              </label>
              <input
                type="text"
                placeholder="e.g. KPSC-VEO"
                value={newExam.code}
                onChange={(e) => setNewExam({ ...newExam, code: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition"
            >
              Add Examination to Catalogue
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: APPROVED SOURCES */}
      {activeAdminTab === 'sources' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Approved Source Portals & Crawlers
              </h2>
              <p className="text-xs text-slate-500">
                Websites monitored by the Python collection engine. Respects copyright, TOS, and robots.txt.
              </p>
            </div>
            <button
              onClick={handleTriggerCollection}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Scan All Sources
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {src.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {src.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Base: <a href={src.base_url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">{src.base_url}</a>
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span>Frequency: {src.frequency}</span>
                  <span>Discovered: {src.total_discovered || 0} Papers</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Source Form */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Add New Approved Source Portal
            </h3>
            <form onSubmit={handleCreateSource} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kerala Police Recruitment Board"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Base URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://keralapolice.gov.in"
                  value={newSource.base_url}
                  onChange={(e) => setNewSource({ ...newSource, base_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                Add Approved Source
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: DUPLICATE & BROKEN LINK AUDITOR */}
      {activeAdminTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Platform Integrity & Broken Link Auditor
              </h2>
              <p className="text-xs text-slate-500">
                Automated detection of SHA256 duplicate files and dead external URLs.
              </p>
            </div>
            <button
              onClick={handleRunAudit}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Run Live Integrity Audit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duplicates Report */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Duplicate SHA256 Checksum Logs</span>
              </h3>
              {auditReport.duplicates?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Zero duplicate files detected in repository.
                </p>
              ) : (
                <div className="space-y-2 text-xs">
                  {auditReport.duplicates.map((d, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="font-bold text-slate-800 dark:text-white">{d.candidate_title || d.session_name}</p>
                      <p className="text-[11px] font-mono text-slate-400 truncate">Hash: {d.file_hash || d.hash}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Broken Links Report */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Audited Source URLs (Live Status)</span>
              </h3>
              {auditReport.broken_links?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  All active links verified and responsive.
                </p>
              ) : (
                <div className="space-y-2 text-xs max-h-80 overflow-y-auto pr-1">
                  {auditReport.broken_links.map((b, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-white truncate max-w-xs">{b.paper_code}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700">
                          Status: {b.status_code || 404}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate font-mono">{b.url}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: USERS & ROLES */}
      {activeAdminTab === 'users' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            User Accounts & Permission Roles
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <img src={u.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: QUESTION BANK & CURATION (PHASE 2) */}
      {activeAdminTab === 'questions' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Master Question Bank Management ({totalQuestions} Questions)
              </h2>
              <p className="text-xs text-slate-500">
                Curate verified questions, assign subjects/topics, and control official answer keys.
              </p>
            </div>

            <button
              onClick={() => setShowAddQuestionModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition self-start sm:self-auto shrink-0 shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question Manually</span>
            </button>
          </div>

          {/* Add Question Modal */}
          {showAddQuestionModal && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add New Question to Question Bank</h3>
                <button
                  onClick={() => setShowAddQuestionModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateQuestionSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Question Text (English):</label>
                  <textarea
                    required
                    value={newQuestionForm.question_text}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, question_text: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                    rows={2}
                    placeholder="Enter English question text..."
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Question Text (Malayalam Unicode):</label>
                  <textarea
                    value={newQuestionForm.question_text_malayalam}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, question_text_malayalam: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white ml-text"
                    rows={2}
                    placeholder="മലയാളത്തിലുള്ള ചോദ്യം നൽകുക..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Option A:</label>
                    <input
                      required
                      type="text"
                      value={newQuestionForm.optionA}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, optionA: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Option B:</label>
                    <input
                      required
                      type="text"
                      value={newQuestionForm.optionB}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, optionB: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Option C:</label>
                    <input
                      required
                      type="text"
                      value={newQuestionForm.optionC}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, optionC: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Option D:</label>
                    <input
                      required
                      type="text"
                      value={newQuestionForm.optionD}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, optionD: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Official Correct Option:</label>
                    <select
                      value={newQuestionForm.correct_option}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, correct_option: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Assign Subject:</label>
                    <select
                      value={newQuestionForm.subject_id}
                      onChange={(e) => setNewQuestionForm({ ...newQuestionForm, subject_id: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      {subjectsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Difficulty & Year:</label>
                    <div className="flex gap-2">
                      <select
                        value={newQuestionForm.difficulty}
                        onChange={(e) => setNewQuestionForm({ ...newQuestionForm, difficulty: e.target.value })}
                        className="w-1/2 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                      <input
                        type="number"
                        value={newQuestionForm.year}
                        onChange={(e) => setNewQuestionForm({ ...newQuestionForm, year: e.target.value })}
                        className="w-1/2 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Verified Official Explanation (English):</label>
                  <textarea
                    value={newQuestionForm.explanation}
                    onChange={(e) => setNewQuestionForm({ ...newQuestionForm, explanation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Question to Official Bank
                </button>
              </form>
            </div>
          )}

          {/* Question Bank Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Question</th>
                  <th className="py-2.5 px-3">Subject / Topic</th>
                  <th className="py-2.5 px-3">Ans</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {questionBank.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 max-w-sm">
                      <p className="font-semibold text-slate-800 dark:text-white line-clamp-2">{q.question_text}</p>
                      {q.question_text_malayalam && (
                        <p className="text-[11px] text-slate-400 ml-text line-clamp-1 mt-0.5">{q.question_text_malayalam}</p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      <span className="block font-medium">{q.topic || 'General'}</span>
                      <span className="text-[10px] text-slate-400">Year: {q.year || '2023'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-center">
                        {q.correct_option}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleQuestionVerify(q)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.is_verified
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                        }`}
                      >
                        {q.is_verified ? 'VERIFIED' : 'PENDING'}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: MOCK TEST PATTERNS (PHASE 2) */}
      {activeAdminTab === 'mocks' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Mock Examination Pattern Management
              </h2>
              <p className="text-xs text-slate-500">
                Configure exam-specific mock patterns, negative marking policies, and time limits.
              </p>
            </div>

            <button
              onClick={() => setShowAddMockModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition self-start sm:self-auto shrink-0 shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Mock Test</span>
            </button>
          </div>

          {showAddMockModal && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create New Mock Test Configuration</h3>
                <button
                  onClick={() => setShowAddMockModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateMockSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Mock Test Name (English):</label>
                    <input
                      required
                      type="text"
                      value={newMockForm.name}
                      onChange={(e) => setNewMockForm({ ...newMockForm, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      placeholder="e.g. Kerala PSC Degree Level Full Mock"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Name (Malayalam):</label>
                    <input
                      type="text"
                      value={newMockForm.name_malayalam}
                      onChange={(e) => setNewMockForm({ ...newMockForm, name_malayalam: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 ml-text"
                      placeholder="മലയാളത്തിലുള്ള പേര്..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Target Examination:</label>
                    <select
                      value={newMockForm.exam_id}
                      onChange={(e) => setNewMockForm({ ...newMockForm, exam_id: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="exam-kpsc-degree-prelims">Kerala PSC Degree Level</option>
                      <option value="exam-kpsc-ldc">LDC / Clerk-Typist</option>
                      <option value="exam-police-si">Police Sub-Inspector</option>
                      <option value="exam-kas-officer">KAS Officer</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Duration (Mins):</label>
                    <input
                      type="number"
                      value={newMockForm.duration_minutes}
                      onChange={(e) => setNewMockForm({ ...newMockForm, duration_minutes: parseInt(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Question Count:</label>
                    <input
                      type="number"
                      value={newMockForm.total_questions}
                      onChange={(e) => setNewMockForm({ ...newMockForm, total_questions: parseInt(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Negative Marking:</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newMockForm.negative_marking}
                      onChange={(e) => setNewMockForm({ ...newMockForm, negative_marking: parseFloat(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Description:</label>
                  <textarea
                    value={newMockForm.description}
                    onChange={(e) => setNewMockForm({ ...newMockForm, description: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md"
                >
                  Create Mock Test Configuration
                </button>
              </form>
            </div>
          )}

          {/* Mock Tests List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adminMockTests.map((mt) => (
              <div
                key={mt.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {mt.exam_name}
                    </span>
                    <button
                      onClick={() => handleDeleteMockTest(mt.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{mt.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{mt.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">{mt.duration_minutes} Mins • {mt.total_questions} Qs</span>
                  <span className="text-red-500 font-bold">-{mt.negative_marking} / wrong</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
