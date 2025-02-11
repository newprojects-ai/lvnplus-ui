import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Users, Calendar, TrendingUp } from 'lucide-react';
import { ChildProfiles } from './ChildProfiles';
import { Performance } from './Performance';
import { ParentSubjectSelection } from './test-creation/ParentSubjectSelection';
import { ParentPracticeTests } from './test-creation/ParentPracticeTests';
import { ParentTestConfig } from './test-creation/ParentTestConfig';
import { ParentTestConfirmation } from './test-creation/ParentTestConfirmation';

export const ParentPortal: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => navigate('/parent/profiles')}
                className={`${
                  isActive('profiles')
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                <Users className="h-5 w-5 mr-2" />
                Child Profiles
              </button>

              <button
                onClick={() => navigate('/parent/test-creation')}
                className={`${
                  isActive('test-creation')
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Test Creation
              </button>

              <button
                onClick={() => navigate('/parent/performance')}
                className={`${
                  isActive('performance')
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance
              </button>
            </nav>
          </div>
        </div>

        {/* Routes */}
        <div className="mt-8">
          <Routes>
            <Route path="profiles" element={<ChildProfiles />} />
            <Route path="performance" element={<Performance />} />
            <Route path="test-creation" element={<ParentSubjectSelection />} />
            <Route path="test-creation/practice/tests/:subjectId" element={<ParentPracticeTests />} />
            <Route path="test-creation/practice/tests/:testType/:subjectId" element={<ParentTestConfig />} />
            <Route path="test-creation/:subjectId/review" element={<ParentTestConfirmation />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
