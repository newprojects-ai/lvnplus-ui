import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Brain } from 'lucide-react';

interface TestConfig {
  questionCount: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isTimed: boolean;
}

export function ParentTestConfig() {
  const navigate = useNavigate();
  const { subjectId, testType } = useParams<{ subjectId: string; testType: string }>();
  
  const [config, setConfig] = useState<TestConfig>({
    questionCount: 10,
    timeLimit: 30,
    difficulty: 'medium',
    isTimed: true
  });

  const handleBack = () => {
    navigate(`/parent/test-creation/practice/tests/${subjectId}`);
  };

  const handleContinue = () => {
    navigate(`/parent/test-creation/${subjectId}/review`, { 
      state: { config, testType }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Test Type
      </button>

      <h1 className="text-2xl font-bold mb-6">Configure Test Parameters</h1>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <select
            value={config.questionCount}
            onChange={(e) => setConfig({ ...config, questionCount: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {[5, 10, 15, 20, 25, 30].map((num) => (
              <option key={num} value={num}>
                {num} questions
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={config.difficulty}
            onChange={(e) => setConfig({ ...config, difficulty: e.target.value as TestConfig['difficulty'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Time Limit</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={config.isTimed}
                onChange={(e) => setConfig({ ...config, isTimed: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Enable time limit</span>
            </div>
          </div>
          {config.isTimed && (
            <select
              value={config.timeLimit}
              onChange={(e) => setConfig({ ...config, timeLimit: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {[15, 30, 45, 60, 90, 120].map((time) => (
                <option key={time} value={time}>
                  {time} minutes
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="pt-4">
          <button
            onClick={handleContinue}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue to Review
          </button>
        </div>
      </div>
    </div>
  );
}
