// Centralized API client for Kerala PYQ Hub

const API_BASE = '/api';

export const api = {
  // Health
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },
  createCategory: async (data) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateCategory: async (id, data) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Examinations
  getExams: async (categoryId = null) => {
    const url = categoryId ? `${API_BASE}/exams?category_id=${categoryId}` : `${API_BASE}/exams`;
    const res = await fetch(url);
    return res.json();
  },
  getExamDetail: async (id) => {
    const res = await fetch(`${API_BASE}/exams/${id}`);
    return res.json();
  },
  createExam: async (data) => {
    const res = await fetch(`${API_BASE}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Question Papers
  getPapers: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.exam_id) searchParams.append('exam_id', params.exam_id);
    if (params.category_id) searchParams.append('category_id', params.category_id);
    if (params.year) searchParams.append('year', params.year);
    if (params.search) searchParams.append('search', params.search);
    if (params.language) searchParams.append('language', params.language);
    if (params.verified_only !== undefined) searchParams.append('verified_only', params.verified_only);

    const res = await fetch(`${API_BASE}/papers?${searchParams.toString()}`);
    return res.json();
  },
  getPaperDetail: async (id) => {
    const res = await fetch(`${API_BASE}/papers/${id}`);
    return res.json();
  },
  getPaperQuestions: async (id, testMode = false) => {
    const res = await fetch(`${API_BASE}/papers/${id}/questions?test_mode=${testMode}`);
    return res.json();
  },
  uploadPaperPdf: async (formData) => {
    const res = await fetch(`${API_BASE}/papers/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },
  createPaper: async (data) => {
    const res = await fetch(`${API_BASE}/papers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deletePaper: async (id) => {
    const res = await fetch(`${API_BASE}/papers/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Student Attempts & Performance
  submitAttempt: async (payload) => {
    const res = await fetch(`${API_BASE}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  getStudentAttempts: async (userId) => {
    const res = await fetch(`${API_BASE}/students/${userId}/attempts`);
    return res.json();
  },
  getStudentStats: async (userId) => {
    const res = await fetch(`${API_BASE}/students/${userId}/stats`);
    return res.json();
  },
  getBookmarks: async (userId) => {
    const res = await fetch(`${API_BASE}/students/${userId}/bookmarks`);
    return res.json();
  },
  toggleBookmark: async (userId, questionId, note = '') => {
    const res = await fetch(`${API_BASE}/students/${userId}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId, note })
    });
    return res.json();
  },
  getFavorites: async (userId) => {
    const res = await fetch(`${API_BASE}/students/${userId}/favorites`);
    return res.json();
  },
  toggleFavorite: async (userId, examId) => {
    const res = await fetch(`${API_BASE}/students/${userId}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exam_id: examId })
    });
    return res.json();
  },

  // Collection Engine & Admin
  triggerCollectionJob: async (sourceId = null) => {
    const res = await fetch(`${API_BASE}/collection/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_id: sourceId })
    });
    return res.json();
  },
  getSources: async () => {
    const res = await fetch(`${API_BASE}/collection/sources`);
    return res.json();
  },
  addSource: async (data) => {
    const res = await fetch(`${API_BASE}/collection/sources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getUnverifiedQueue: async () => {
    const res = await fetch(`${API_BASE}/collection/unverified`);
    return res.json();
  },
  approvePaper: async (id, adminName = 'Admin Reviewer') => {
    const res = await fetch(`${API_BASE}/collection/approve/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_name: adminName })
    });
    return res.json();
  },
  rejectPaper: async (id, reason = 'Quality rejection') => {
    const res = await fetch(`${API_BASE}/collection/reject/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },
  getAuditReport: async () => {
    const res = await fetch(`${API_BASE}/collection/audit`);
    return res.json();
  },
  runAudit: async () => {
    const res = await fetch(`${API_BASE}/collection/audit/run`, { method: 'POST' });
    return res.json();
  },

  // AI Analysis
  getAIRepeatedQuestions: async (examId = null) => {
    const url = examId ? `${API_BASE}/ai/repeated-questions?exam_id=${examId}` : `${API_BASE}/ai/repeated-questions`;
    const res = await fetch(url);
    return res.json();
  },
  getAITopicFrequency: async (examId = null) => {
    const url = examId ? `${API_BASE}/ai/topic-frequency?exam_id=${examId}` : `${API_BASE}/ai/topic-frequency`;
    const res = await fetch(url);
    return res.json();
  },
  generateAIPracticeTest: async (payload) => {
    const res = await fetch(`${API_BASE}/ai/practice-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  getAIDiagnostic: async (userId) => {
    const res = await fetch(`${API_BASE}/ai/student-diagnostic/${userId}`);
    return res.json();
  },

  // Subjects & Topics (Phase 2)
  getSubjects: async () => {
    const res = await fetch(`${API_BASE}/subjects`);
    return res.json();
  },
  getSubjectDetail: async (subjectId) => {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}`);
    return res.json();
  },
  createSubject: async (data) => {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getTopics: async (subjectId = null) => {
    const url = subjectId ? `${API_BASE}/topics?subject_id=${subjectId}` : `${API_BASE}/topics`;
    const res = await fetch(url);
    return res.json();
  },
  createTopic: async (data) => {
    const res = await fetch(`${API_BASE}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getTopicQuestions: async (topicId, page = 1, limit = 20) => {
    const res = await fetch(`${API_BASE}/topics/${topicId}/questions?page=${page}&limit=${limit}`);
    return res.json();
  },

  // Question Bank (Phase 2 Admin & Filtering)
  getQuestionBank: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.subject_id) searchParams.append('subject_id', params.subject_id);
    if (params.topic_id) searchParams.append('topic_id', params.topic_id);
    if (params.exam_id) searchParams.append('exam_id', params.exam_id);
    if (params.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params.verified_only !== undefined) searchParams.append('verified_only', params.verified_only);
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    const res = await fetch(`${API_BASE}/questions?${searchParams.toString()}`);
    return res.json();
  },
  createQuestion: async (data) => {
    const res = await fetch(`${API_BASE}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateQuestion: async (id, data) => {
    const res = await fetch(`${API_BASE}/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteQuestion: async (id) => {
    const res = await fetch(`${API_BASE}/questions/${id}`, { method: 'DELETE' });
    return res.json();
  },
  getAIQuestionExplanation: async (questionId, language = 'both') => {
    const res = await fetch(`${API_BASE}/questions/${questionId}/ai-explanation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language })
    });
    return res.json();
  },

  // Mock Test System (Phase 2)
  getMockTests: async (examId = null) => {
    const url = examId ? `${API_BASE}/mock-tests?exam_id=${examId}` : `${API_BASE}/mock-tests`;
    const res = await fetch(url);
    return res.json();
  },
  getMockTestDetail: async (id) => {
    const res = await fetch(`${API_BASE}/mock-tests/${id}`);
    return res.json();
  },
  createMockTest: async (data) => {
    const res = await fetch(`${API_BASE}/mock-tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateMockTest: async (id, data) => {
    const res = await fetch(`${API_BASE}/mock-tests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteMockTest: async (id) => {
    const res = await fetch(`${API_BASE}/mock-tests/${id}`, { method: 'DELETE' });
    return res.json();
  },
  submitMockAttempt: async (id, payload) => {
    const res = await fetch(`${API_BASE}/mock-tests/${id}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Daily Practice Challenge (Phase 2)
  getDailyChallenge: async (userId, count = 10) => {
    const res = await fetch(`${API_BASE}/daily-challenge?user_id=${userId}&count=${count}`);
    return res.json();
  },
  submitDailyChallenge: async (payload) => {
    const res = await fetch(`${API_BASE}/daily-challenge/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  getDailyHistory: async (userId, days = 30) => {
    const res = await fetch(`${API_BASE}/students/${userId}/daily-history?days=${days}`);
    return res.json();
  },

  // Student Performance Analytics (Phase 2)
  getStudentPerformance: async (userId) => {
    const res = await fetch(`${API_BASE}/students/${userId}/performance`);
    return res.json();
  },

  // Historical Exam Question Analysis (Phase 2)
  getHistoricalRepeated: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.exam_id) searchParams.append('exam_id', params.exam_id);
    if (params.subject_id) searchParams.append('subject_id', params.subject_id);
    if (params.topic_id) searchParams.append('topic_id', params.topic_id);
    const res = await fetch(`${API_BASE}/analysis/repeated-questions?${searchParams.toString()}`);
    return res.json();
  },
  getHistoricalTopicFrequency: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.exam_id) searchParams.append('exam_id', params.exam_id);
    if (params.subject_id) searchParams.append('subject_id', params.subject_id);
    const res = await fetch(`${API_BASE}/analysis/topic-frequency?${searchParams.toString()}`);
    return res.json();
  },

  // Auth
  login: async (email) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  }
};
