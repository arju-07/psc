import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ExploreExamsPage } from './pages/public/ExploreExamsPage';
import { ExamDetailPage } from './pages/public/ExamDetailPage';
import { PaperLibraryPage } from './pages/public/PaperLibraryPage';
import { AboutPage } from './pages/public/AboutPage';

// Student Dashboard Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentExamsPage } from './pages/student/StudentExamsPage';
import { StudentPapersPage } from './pages/student/StudentPapersPage';
import { StudentPracticePage } from './pages/student/StudentPracticePage';
import { StudentMockTestsPage } from './pages/student/StudentMockTestsPage';
import { StudentDailyChallengePage } from './pages/student/StudentDailyChallengePage';
import { StudentBookmarksPage } from './pages/student/StudentBookmarksPage';
import { StudentMistakesPage } from './pages/student/StudentMistakesPage';
import { StudentAIAssistantPage } from './pages/student/StudentAIAssistantPage';
import { StudentPlannerPage } from './pages/student/StudentPlannerPage';
import { StudentPerformancePage } from './pages/student/StudentPerformancePage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentSettingsPage } from './pages/student/StudentSettingsPage';

// Admin Portal Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminPipelinePage } from './pages/admin/AdminPipelinePage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminExamsPage } from './pages/admin/AdminExamsPage';
import { AdminSubjectsPage } from './pages/admin/AdminSubjectsPage';
import { AdminPapersPage } from './pages/admin/AdminPapersPage';
import { AdminAnswerKeysPage } from './pages/admin/AdminAnswerKeysPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminMockTestsPage } from './pages/admin/AdminMockTestsPage';
import { AdminAIContentPage } from './pages/admin/AdminAIContentPage';
import { AdminCollectionPage } from './pages/admin/AdminCollectionPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminRolesPage } from './pages/admin/AdminRolesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

/**
 * Root Route Handler:
 * When the website opens:
 * - Unauthenticated users see the ONE Common Login Page as the initial screen.
 * - Authenticated students automatically land on /dashboard.
 * - Authenticated Super Admin automatically lands on /admin.
 */
function RootScreen() {
  const { isAuthenticated, role, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 border-2 border-navy-700 dark:border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Loading Kerala PYQ Hub...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !role) {
    return <LoginPage />;
  }

  if (role === 'super_admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

export function App() {
  return (
    <Routes>
      {/* 1. Public Routes with Common Login Page as Initial Screen */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RootScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/exams" element={<ExploreExamsPage />} />
        <Route path="/exams/:slug" element={<ExamDetailPage />} />
        <Route path="/papers" element={<PaperLibraryPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Redirect legacy /admin/login directly to Common Login */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* 2. Protected Student Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboardPage />} />
        <Route path="exams" element={<StudentExamsPage />} />
        <Route path="papers" element={<StudentPapersPage />} />
        <Route path="practice" element={<StudentPracticePage />} />
        <Route path="mock-tests" element={<StudentMockTestsPage />} />
        <Route path="daily-challenge" element={<StudentDailyChallengePage />} />
        <Route path="bookmarks" element={<StudentBookmarksPage />} />
        <Route path="mistakes" element={<StudentMistakesPage />} />
        <Route path="ai-assistant" element={<StudentAIAssistantPage />} />
        <Route path="planner" element={<StudentPlannerPage />} />
        <Route path="performance" element={<StudentPerformancePage />} />
        <Route path="notifications" element={<StudentNotificationsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="settings" element={<StudentSettingsPage />} />
      </Route>

      {/* 3. Protected Single Super Admin Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin allowedRoles={['super_admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="pipeline" element={<AdminPipelinePage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="exams" element={<AdminExamsPage />} />
        <Route path="subjects" element={<AdminSubjectsPage />} />
        <Route path="papers" element={<AdminPapersPage />} />
        <Route path="answer-keys" element={<AdminAnswerKeysPage />} />
        <Route path="questions" element={<AdminQuestionsPage />} />
        <Route path="mock-tests" element={<AdminMockTestsPage />} />
        <Route path="ai-content" element={<AdminAIContentPage />} />
        <Route path="collection" element={<AdminCollectionPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="roles" element={<AdminRolesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
