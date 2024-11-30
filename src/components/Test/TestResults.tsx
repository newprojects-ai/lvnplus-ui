import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import { TestResult } from '../../types/test';

interface TestResultsProps {
  result: TestResult;
  timeTaken: number;
}

export function TestResults({ result, timeTaken }: TestResultsProps) {
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
          <p className="mt-2 text-lg text-gray-600">
            You've completed the test! Here's how you did:
          </p>
        </div>

        {/* Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-indigo-900 mb-2">Score</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {Math.round(result.accuracy * 100)}%
            </p>
            <p className="text-sm text-indigo-700 mt-1">
              {result.score} / {result.totalQuestions} correct
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-green-900 mb-2">Time Taken</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatTime(timeTaken)}
            </p>
            <p className="text-sm text-green-700 mt-1">minutes</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-purple-900 mb-2">Questions</h3>
            <p className="text-3xl font-bold text-purple-600">
              {result.totalQuestions}
            </p>
            <p className="text-sm text-purple-700 mt-1">total questions</p>
          </div>
        </div>

        {/* Topic Performance */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Performance by Topic</h2>
          <div className="space-y-4">
            {result.topicPerformance.map((topic) => (
              <div
                key={topic.topicId}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{topic.topicId}</h3>
                  <span className="text-sm font-medium text-gray-600">
                    {topic.correct} / {topic.total} correct
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${topic.accuracy * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/mathematics/practice')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <span>Try Another Test</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}