import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { testsApi } from '../api/tests';
import { TestExecution as TestExecutionType, Question } from '../types/test';

export function TestSession() {
  const { executionId } = useParams<{ executionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [execution, setExecution] = useState<TestExecutionType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch test execution details
  useEffect(() => {
    const fetchTestExecution = async () => {
      if (!executionId || !user) return;

      try {
        setIsLoading(true);
        const executionData = await testsApi.executions.getById(parseInt(executionId));
        setExecution(executionData);

        // Set initial time remaining if timed test
        if (executionData.testPlan.timingType === 'TIMED') {
          const timeLimit = executionData.testPlan.timeLimit * 1000; // Convert to milliseconds
          const startTime = executionData.startTime ? new Date(executionData.startTime).getTime() : Date.now();
          const elapsedTime = Date.now() - startTime;
          setTimeRemaining(Math.max(0, timeLimit - elapsedTime));
        }
      } catch (err) {
        console.error('Failed to fetch test execution:', err);
        setError('Failed to load test. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestExecution();
  }, [executionId, user]);

  // Timer effect
  useEffect(() => {
    if (!timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (!prev || prev <= 1000) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleNextQuestion = async () => {
    if (!execution || !selectedAnswer) return;

    try {
      await testsApi.executions.submitAnswer(
        parseInt(executionId!),
        execution.questions[currentQuestionIndex].id,
        selectedAnswer
      );

      if (currentQuestionIndex < execution.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        await handleSubmitTest();
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('Failed to submit answer. Please try again.');
    }
  };

  const handleSubmitTest = async () => {
    if (!execution) return;

    try {
      await testsApi.executions.complete(parseInt(executionId!));
      navigate(`/test/results/${executionId}`);
    } catch (err) {
      console.error('Failed to complete test:', err);
      setError('Failed to complete test. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/practice-tests')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Return to Practice Tests
        </button>
      </div>
    );
  }

  if (!execution) {
    return null;
  }

  const currentQuestion = execution.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {execution.questions.length}
          </div>
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-5 w-5" />
              <span>
                {Math.floor(timeRemaining / 60000)}:
                {Math.floor((timeRemaining % 60000) / 1000)
                  .toString()
                  .padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedAnswer === option.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option.id
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedAnswer === option.id && (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 flex items-center gap-2 text-gray-600 disabled:opacity-50"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {currentQuestionIndex === execution.questions.length - 1 ? (
              'Submit Test'
            ) : (
              <>
                Next
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}