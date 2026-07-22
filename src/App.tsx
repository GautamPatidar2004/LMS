import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { getDashboardRoute } from './utils/roles';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import StudentDashboard from './pages/Student/Dashboard';
import StudentCourses from './pages/Student/Courses';
import StudentBrowseCourse from './pages/Student/BrowseCourse.tsx';
import StudentCourseDetail from './pages/Student/CourseDetail';
import StudentLearnCourse from './pages/Student/LearnCourse';
import StudentCertificates from './pages/Student/Certificates';
import StudentMessages from './pages/Student/Messages';
import StudentSettings from './pages/Student/Settings';
import StudentWishlist from './pages/Student/Wishlist';
import StudentProfile from './pages/Student/Profile';
import StudentTerms from './pages/Student/Terms';
import TeacherDashboard from './pages/Teacher/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';

// Components & Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import LoadingScreen from './components/auth/LoadingScreen';

// Root redirect handler
function RootRedirect() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Redirecting to your workspace..." />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role) {
    return <Navigate to={getDashboardRoute(role)} replace />;
  }
  return null;
}

function AppContent() {
  const { loading } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'
    }`}>
      {/* Show global loading overlay during session verification */}
      {loading && <LoadingScreen message="Restoring active session..." />}

      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Role-Based Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:slug"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentCourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses/:slug/learn"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLearnCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/browseCourse"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentBrowseCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/certificates"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/messages"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/wishlist"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentWishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/settings"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/terms"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentTerms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Root Path Redirection */}
          <Route
            path="/"
            element={
              <RootRedirect />
            }
          />

          {/* Wildcard 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
