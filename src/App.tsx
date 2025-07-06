import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import CourseDetailPage from './pages/CourseDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;