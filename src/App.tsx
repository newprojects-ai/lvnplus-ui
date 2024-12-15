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
import { PracticeTestsSubjectSelection } from './pages/PracticeTestsSubjectSelection';
import { PracticeTests } from './pages/PracticeTests';
import { TopicTests } from './pages/TopicTests';
import { MentalArithmeticConfig } from './pages/MentalArithmeticConfig';
import { TestExecution } from './pages/TestExecution';
import { TestResults } from './pages/TestResults';
import { TestSession } from './pages/TestSession';
import MixedTestConfig from './pages/MixedTestConfig';

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
                path="/science"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <h1 className="text-3xl font-bold text-center mb-6">Science</h1>
                      <p className="text-center text-gray-600">Science content coming soon!</p>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/geography"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <h1 className="text-3xl font-bold text-center mb-6">Geography</h1>
                      <p className="text-center text-gray-600">Geography content coming soon!</p>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/art"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <h1 className="text-3xl font-bold text-center mb-6">Art</h1>
                      <p className="text-center text-gray-600">Art content coming soon!</p>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice/tests/:subjectId"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <PracticeTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice/tests/topic-wise/:subjectId"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <TopicTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice/tests/mixed/:subjectId"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <h1 className="text-3xl font-bold text-center mb-6">Mixed Test</h1>
                      <p className="text-center text-gray-600">Mixed Test content coming soon!</p>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice/tests/mental/:subjectId"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <MentalArithmeticConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test/topics/:subjectId"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <TopicTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test/topics/:subjectId/:topicId"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <TopicTests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test/topics/:subjectId/:topicId/:subTopicId"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <TopicTests />
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
                path="/test/:subjectId/:testId"
                element={
                  <ProtectedRoute allowedRoles={['Student']}>
                    <TestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test/:executionId"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <TestSession />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice-tests"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <PracticeTestsSubjectSelection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test-results"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <TestResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test/results/:executionId"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <TestResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mixed-test-config"
                element={
                  <ProtectedRoute allowedRoles={['Student', 'Tutor', 'Admin']}>
                    <MixedTestConfig />
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