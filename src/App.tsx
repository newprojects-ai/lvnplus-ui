import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { SubjectSelection } from './pages/SubjectSelection';
import { Home } from './pages/Home';
import { Mathematics } from './pages/Mathematics';
import { English } from './pages/English';
import { Progress } from './pages/Progress';
import { TestPage } from './pages/TestPage';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
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
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/subjects"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <SubjectSelection />
                  </ProtectedRoute>
                }
              />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/mathematics"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <Mathematics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/english"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <English />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mathematics/practice"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <PracticeTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mathematics/tests/topic-wise"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <TopicTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mathematics/tests/mixed"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <MixedTestConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mathematics/tests/mental"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <MentalArithmeticConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Parent', 'Tutor', 'Admin']}>
                    <Progress />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test/:subject/:testId"
                element={
                  <ProtectedRoute allowedRoles={['Student']}>
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