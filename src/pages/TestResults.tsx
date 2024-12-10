import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  BarChart2, 
  Clock, 
  Repeat, 
  BookOpen 
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { testsApi } from '../api/tests';
import { TestResult } from '../types/test';

export function TestResults() {
  const { executionId } = useParams<{ executionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestResult = async () => {
      if (!executionId || !user) return;

      try {
        setIsLoading(true);
        const testResult = await testsApi.getTestResult(executionId);
        setResult(testResult);
      } catch (err) {
        console.error('Failed to fetch test result:', err);
        setError('Failed to load test results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestResult();
  }, [executionId, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No test results found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <span className="text-gray-600">
                {new Date(result.completedAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Overall Performance */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-800">Score</h3>
              <p className="text-2xl font-bold text-green-600">
                {result.score} / {result.totalQuestions}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <BarChart2 className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-indigo-800">Accuracy</h3>
              <p className="text-2xl font-bold text-indigo-600">
                {(result.accuracy * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-blue-800">Time Spent</h3>
              <p className="text-2xl font-bold text-blue-600">
                {Math.floor(result.timeSpent / 60)} mins
              </p>
            </div>
          </div>

          {/* Topic Performance */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-indigo-500" />
              Topic Performance
            </h2>
            <div className="space-y-3">
              {result.topicPerformance.map(topic => (
                <div 
                  key={topic.topicId} 
                  className="bg-white rounded-md p-4 shadow-sm flex items-center"
                >
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{topic.topicId}</h3>
                    <div className="text-sm text-gray-600">
                      {topic.correct} / {topic.total} correct
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {((topic.correct / topic.total) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/practice-tests')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <Repeat className="h-5 w-5" />
              Practice More
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
