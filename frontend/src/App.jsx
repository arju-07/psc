import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentDashboard from './components/StudentDashboard';
import ExamCatalogue from './components/ExamCatalogue';
import TestRunner from './components/TestRunner';
import TopicPractice from './components/TopicPractice';
import MockTestCenter from './components/MockTestCenter';
import BookmarksView from './components/BookmarksView';
import PerformanceDashboard from './components/PerformanceDashboard';
import DailyChallenge from './components/DailyChallenge';
import QuestionAnalysis from './components/QuestionAnalysis';
import AIAnalysisView from './components/AIAnalysisView';
import AdminDashboard from './components/AdminDashboard';
import PdfViewerModal from './components/PdfViewerModal';
import AuthModal from './components/AuthModal';
import { api } from './services/api';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('kerala_pyq_theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // User state
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-student-01',
    email: 'student@keralapyqhub.org',
    name: 'Devika Nair (Aspirant)',
    role: 'STUDENT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devika'
  });

  // App navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [activePdfPaper, setActivePdfPaper] = useState(null);
  const [isAnswerKeyMode, setIsAnswerKeyMode] = useState(false);

  // Active test mode
  const [activeTestPaperId, setActiveTestPaperId] = useState(null);
  const [activeCustomTest, setActiveCustomTest] = useState(null);

  // Apply dark mode class to root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kerala_pyq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kerala_pyq_theme', 'light');
    }
  }, [isDark]);

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadBookmarkCount();
  }, [currentUser]);

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadBookmarkCount = async () => {
    if (!currentUser?.id) return;
    try {
      const bms = await api.getBookmarks(currentUser.id);
      setBookmarkCount((bms || []).length);
    } catch (err) {
      console.error('Failed to load bookmark count:', err);
    }
  };

  const handleSwitchUser = async (targetId) => {
    if (targetId === 'usr-admin-01') {
      setCurrentUser({
        id: 'usr-admin-01',
        email: 'admin@keralapyqhub.org',
        name: 'Arun Kumar (System Admin)',
        role: 'ADMIN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun'
      });
    } else {
      setCurrentUser({
        id: 'usr-student-01',
        email: 'student@keralapyqhub.org',
        name: 'Devika Nair (Aspirant)',
        role: 'STUDENT',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devika'
      });
    }
  };

  const handleStartTest = (paperId) => {
    setActiveTestPaperId(paperId);
    setActiveCustomTest(null);
    setActiveTab('tests');
  };

  const handleLaunchCustomTest = (customTest) => {
    setActiveCustomTest(customTest);
    setActiveTestPaperId(customTest.test_id);
    setActiveTab('tests');
  };

  const handleOpenPdf = (paper) => {
    setActivePdfPaper(paper);
    setIsAnswerKeyMode(false);
    setPdfModalOpen(true);
  };

  const handleOpenAnswerKey = (paper) => {
    setActivePdfPaper(paper);
    setIsAnswerKeyMode(true);
    setPdfModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar & Mobile Bottom Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'tests') {
            setActiveTestPaperId(null);
            setActiveCustomTest(null);
          }
          setActiveTab(tab);
        }}
        isDark={isDark}
        setIsDark={setIsDark}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={() => setActiveTab('catalogue')}
        bookmarkCount={bookmarkCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 xl:pb-6">
        {/* 1. Student Dashboard */}
        {activeTab === 'dashboard' && (
          <StudentDashboard
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            onStartTest={handleStartTest}
            onViewPaper={handleOpenPdf}
          />
        )}

        {/* 2. Exam Catalogue & Previous Papers */}
        {activeTab === 'catalogue' && (
          <ExamCatalogue
            categories={categories}
            currentUser={currentUser}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onStartTest={handleStartTest}
            onOpenPdf={handleOpenPdf}
            onOpenAnswerKey={handleOpenAnswerKey}
          />
        )}

        {/* 3. Topic-wise Question Practice */}
        {activeTab === 'practice' && (
          <TopicPractice
            currentUser={currentUser}
            onBookmarkToggle={loadBookmarkCount}
          />
        )}

        {/* 4. Mock Examination Center */}
        {activeTab === 'mock-tests' && (
          <MockTestCenter
            currentUser={currentUser}
            categories={categories}
            onStartTest={handleStartTest}
          />
        )}

        {/* 5. Daily Practice Challenge & Streak */}
        {activeTab === 'daily-challenge' && (
          <DailyChallenge
            currentUser={currentUser}
          />
        )}

        {/* 6. Bookmarked & Saved Questions */}
        {activeTab === 'bookmarks' && (
          <BookmarksView
            currentUser={currentUser}
            onStartCustomPractice={handleLaunchCustomTest}
          />
        )}

        {/* 7. Student Performance Dashboard */}
        {activeTab === 'performance' && (
          <PerformanceDashboard
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* 8. Previous Exam Question Analysis */}
        {activeTab === 'analysis' && (
          <QuestionAnalysis
            categories={categories}
          />
        )}

        {/* 9. Interactive Timed Test Runner */}
        {activeTab === 'tests' && (
          activeTestPaperId ? (
            <TestRunner
              paperId={activeTestPaperId}
              customTestData={activeCustomTest}
              currentUser={currentUser}
              onExit={() => {
                setActiveTestPaperId(null);
                setActiveCustomTest(null);
                setActiveTab('catalogue');
              }}
            />
          ) : (
            <div className="space-y-6 pb-12">
              <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-xl sm:text-2xl font-black">
                  Select a Paper or Mock Test to Launch
                </h1>
                <p className="text-xs text-emerald-100/90 mt-1 ml-text">
                  ടൈമറും നെഗറ്റീവ് മാർക്കിംഗും ഉള്ള തത്സമയ പരീക്ഷാ പരിശീലനം
                </p>
              </div>

              <ExamCatalogue
                categories={categories}
                currentUser={currentUser}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onStartTest={handleStartTest}
                onOpenPdf={handleOpenPdf}
                onOpenAnswerKey={handleOpenAnswerKey}
              />
            </div>
          )
        )}

        {/* 10. AI Insights & Diagnostics */}
        {activeTab === 'ai-analysis' && (
          <AIAnalysisView
            currentUser={currentUser}
            categories={categories}
            onLaunchCustomTest={handleLaunchCustomTest}
          />
        )}

        {/* 11. Admin Control Dashboard */}
        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            categories={categories}
            onRefreshCategories={loadCategories}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 mt-auto hidden xl:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Kerala PYQ Hub 2.0</span>
            <span>•</span>
            <span className="ml-text">കേരളത്തിലെ ഉദ്യോഗാർത്ഥികൾക്കായി സമർപ്പിക്കുന്നു</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Official Government Sources</span>
            <span>•</span>
            <span>Topic-wise Drill</span>
            <span>•</span>
            <span>AI Answer Explanations</span>
            <span>•</span>
            <span>Mock Examination System</span>
          </div>
        </div>
      </footer>

      {/* PDF Viewer & Download Modal */}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        paper={activePdfPaper}
        isAnswerKey={isAnswerKeyMode}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
