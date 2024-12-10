import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Check, X, Pause, Play } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { testsApi } from '../api/tests';
import { TestExecution as TestExecutionType, Question } from '../types/test';

export function TestExecution() {
  const { executionId } = useParams<{ executionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [execution, setExecution] = useState<TestExecutionType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch test execution details
  const fetchTestExecution = useCallback(async () => {
    if (!executionId || !user) return;

    try {
      setIsLoading(true);
      const executionData = await testsApi.executions.getById(parseInt(executionId));
      setExecution(executionData);

      // Set initial time remaining if timed test
      if (executionData.testData.timingData.startTime) {
        const timeLimit = executionData.testPlanId; // Assuming time limit is stored in testPlanId
        const elapsedTime = Date.now() - executionData.testData.timingData.startTime;
        setTimeRemaining(Math.max(0, timeLimit - elapsedTime));
      }
    } catch (err) {
      console.error('Failed to fetch test execution:', err);
      setError('Failed to load test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [executionId, user]);

  // Timer effect
  useEffect(() => {
    if (!execution || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1000) {
          handleCompleteTest();
          clearInterval(timer);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [execution, timeRemaining]);

  // Initial fetch
  useEffect(() => {
    fetchTestExecution();
  }, [fetchTestExecution]);

  // Submit answer for current question
  const handleSubmitAnswer = async () => {
    if (!execution || !selectedAnswer) return;

    try {
      const currentQuestion = execution.testData.questions[currentQuestionIndex];
      await testsApi.executions.submitAnswer(
        execution.executionId, 
        parseInt(currentQuestion.id), 
        selectedAnswer
      );

      // Move to next question or complete test
      if (currentQuestionIndex < execution.testData.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        await handleCompleteTest();
      }

      // Reset selected answer
      setSelectedAnswer(null);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('Failed to submit answer. Please try again.');
    }
  };

  // Complete the test
  const handleCompleteTest = async () => {
    if (!execution) return;

    try {
      const completedExecution = await testsApi.executions.complete(execution.executionId);
      navigate(`/test/results/${completedExecution.executionId}`);
    } catch (err) {
      console.error('Failed to complete test:', err);
      setError('Failed to complete test. Please try again.');
    }
  };

  // Pause/Resume test
  const handlePauseResume = async () => {
    if (!execution) return;

    try {
      const updatedExecution = execution.status === 'IN_PROGRESS'
        ? await testsApi.executions.pause(execution.executionId)
        : await testsApi.executions.resume(execution.executionId);
      
      setExecution(updatedExecution);
    } catch (err) {
      console.error('Failed to pause/resume test:', err);
      setError('Failed to pause/resume test. Please try again.');
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchTestExecution}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No execution found
  if (!execution) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No test execution found.</p>
      </div>
    );
  }

  // Current question
  const currentQuestion = execution.testData.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePauseResume}
            className="text-gray-600 hover:text-gray-900"
          >
            {execution.status === 'IN_PROGRESS' ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            <span className="font-medium">
              {Math.floor(timeRemaining / 60000)}:
              {String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="text-gray-600">
          Question {currentQuestionIndex + 1} of {execution.testData.questions.length}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Question */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentQuestion.content}
            </h2>

            {/* Multiple Choice Options */}
            {currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(option)}
                    className={`w-full text-left px-4 py-3 rounded-md border-2 transition-all duration-200 
                      ${selectedAnswer === option 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Open-ended Question */}
            {!currentQuestion.options && (
              <textarea
                value={selectedAnswer || ''}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 border-2 border-gray-200 rounded-md focus:border-indigo-500 focus:outline-none"
                rows={4}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(prev => prev - 1);
                }
              }}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {currentQuestionIndex === execution.testData.questions.length - 1 
                ? 'Finish Test' 
                : 'Next Question'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
