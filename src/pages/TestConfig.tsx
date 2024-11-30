import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { testsApi } from '../api/tests';
import { TestConfig as TestConfigType } from '../types/test';

interface TestConfigProps {
  selectedTopics: string[];
  selectedSubtopics: string[];
  onBack: () => void;
}

export function TestConfig({ selectedTopics, selectedSubtopics, onBack }: TestConfigProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState({
    questionCount: 10,
    isTimed: true
  });

  const questionOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 5);

  const handleStartTest = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Calculate time limit based on question count (30 seconds per question)
      const timeLimit = config.isTimed ? config.questionCount * 30 : undefined;

      const testConfig: Omit<TestConfigType, 'id'> = {
        userId: user.id,
        testType: 'topic',
        isTimed: config.isTimed,
        selectedTopics,
        selectedSubtopics,
        questionCount: config.questionCount,
        timeLimit
      };

      // Create test configuration
      const createdConfig = await testsApi.createTestConfig(testConfig);

      // Start test session
      const session = await testsApi.startTestSession(createdConfig.id!);

      // Navigate to test page with session ID
      navigate(`/test/mathematics/${session.id}`);
    } catch (err) {
      console.error('Failed to start test:', err);
      setError('Failed to start test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Configure Your Test</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              value={config.questionCount}
              onChange={(e) => setConfig(prev => ({ ...prev, questionCount: Number(e.target.value) }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {questionOptions.map((count) => (
                <option key={count} value={count}>
                  {count} questions
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Test Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setConfig(prev => ({ ...prev, isTimed: true }))}
                className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  config.isTimed
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Clock className={`h-6 w-6 mx-auto mb-2 ${
                  config.isTimed ? 'text-indigo-500' : 'text-gray-400'
                }`} />
                <div className="font-medium text-gray-900">Timed</div>
                <p className="text-sm text-gray-500 mt-1">
                  30 seconds per question
                </p>
              </div>

              <div
                onClick={() => setConfig(prev => ({ ...prev, isTimed: false }))}
                className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  !config.isTimed
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Clock className={`h-6 w-6 mx-auto mb-2 ${
                  !config.isTimed ? 'text-indigo-500' : 'text-gray-400'
                }`} />
                <div className="font-medium text-gray-900">Un-timed</div>
                <p className="text-sm text-gray-500 mt-1">
                  Take your time
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
          <button
            onClick={handleStartTest}
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Starting...' : (
              <>
                Start Test
                <Play className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}