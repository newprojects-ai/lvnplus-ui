import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { Mathematics } from './pages/Mathematics';
import { Progress } from './pages/Progress';
import { TestPage } from './pages/TestPage';
import { LoginForm } from './components/Auth/LoginForm';
import { Unauthorized } from './pages/Unauthorized';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { PracticeTests } from './pages/PracticeTests';
import { TopicTests } from './pages/TopicTests';
import { MixedTestConfig } from './pages/MixedTestConfig';
import { MentalArithmeticConfig } from './pages/MentalArithmeticConfig';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/mathematics"
                element={
                  <ProtectedRoute allowedRoles={['student', 'tutor', 'administrator']}>
                    <Mathematics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mathematics/practice"
                element={
                  <ProtectedRoute allowedRoles={['student', 'tutor', 'administrator']}>
                    <PracticeTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mathematics/tests/topic-wise"
                element={
                  <ProtectedRoute allowedRoles={['student', 'tutor', 'administrator']}>
                    <TopicTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mathematics/tests/mixed"
                element={
                  <ProtectedRoute allowedRoles={['student', 'tutor', 'administrator']}>
                    <MixedTestConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mathematics/tests/mental"
                element={
                  <ProtectedRoute allowedRoles={['student', 'tutor', 'administrator']}>
                    <MentalArithmeticConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute allowedRoles={['student', 'parent', 'tutor', 'administrator']}>
                    <Progress />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test/:subject/:testId"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <TestPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;