import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';
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

  // Validate and parse execution ID
  const validateExecutionId = (id?: string): number | null => {
    console.log('Validating Execution ID:', { id, type: typeof id });
    
    if (!id) {
      console.warn('No execution ID provided');
      return null;
    }

    // Trim and remove any non-numeric characters
    const cleanedId = id.trim().replace(/[^0-9]/g, '');
    
    if (cleanedId === '') {
      console.warn('Execution ID is empty after cleaning');
      return null;
    }

    const parsedId = parseInt(cleanedId, 10);
    
    if (isNaN(parsedId) || parsedId <= 0) {
      console.warn(`Invalid execution ID: ${id}, parsed as: ${parsedId}`);
      return null;
    }

    console.log('Validated Execution ID:', parsedId);
    return parsedId;
  };

  // Fetch test execution details
  useEffect(() => {
    const fetchTestExecution = async () => {
      console.log('TestSession Component - Initial State:', {
        executionId,
        user: user ? 'User Logged In' : 'No User',
        authContextAvailable: !!user
      });

      // Validate user and execution ID
      if (!user) {
        console.warn('No user authenticated');
        setError('Please log in to access the test');
        return;
      }

      // Validate execution ID
      const validExecutionId = validateExecutionId(executionId);
      if (!validExecutionId) {
        console.error('Invalid Execution ID Validation Failed');
        setError('Invalid execution ID provided.');
        return;
      }

      try {
        setIsLoading(true);
        console.group('Test Execution Fetch');
        console.log('Fetching test execution with validated ID:', validExecutionId);
        
        // Fetch execution data
        const executionData = await testsApi.executions.getById(validExecutionId);
        
        console.log('Execution data received:', JSON.stringify(executionData, null, 2));
        
        // Validate execution data
        if (!executionData) {
          console.error('No execution data found for the given ID');
          throw new Error('No execution data found for the given ID');
        }

        // Additional validation for critical data
        if (!executionData.testData || !executionData.testData.questions || executionData.testData.questions.length === 0) {
          console.error('No questions found in execution data', executionData);
          setError('No questions available for this test execution.');
          return;
        }

        setExecution(executionData);

        // Set initial time remaining if timed test
        if (executionData.testPlan?.timingType === 'TIMED') {
          const timeLimit = executionData.testPlan.timeLimit * 1000; // Convert to milliseconds
          const startTime = executionData.startTime ? new Date(executionData.startTime).getTime() : Date.now();
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, timeLimit - elapsedTime);
          
          console.log('Time Calculation:', {
            timeLimit,
            startTime,
            elapsedTime,
            remainingTime
          });

          setTimeRemaining(remainingTime);
        }
      } catch (apiError) {
        console.error('API Error fetching test execution:', apiError);
        
        // More detailed error handling
        if (axios.isAxiosError(apiError)) {
          const errorDetails = {
            url: apiError.config?.url,
            method: apiError.config?.method,
            status: apiError.response?.status,
            data: apiError.response?.data,
            headers: apiError.response?.headers
          };
          
          console.error('Detailed Axios Error:', errorDetails);
          
          const errorMessage = apiError.response?.data?.message || 
                               apiError.response?.statusText || 
                               'Unknown API error';
          
          setError(`Failed to load test: ${errorMessage}`);
          
          // Additional logging for debugging
          console.error('Full Axios Error Object:', apiError);
          console.error('Request Configuration:', apiError.config);
        } else if (apiError instanceof Error) {
          setError(`Failed to load test: ${apiError.message}`);
        } else {
          setError('Failed to load test. Please try again.');
        }
      } finally {
        console.groupEnd();
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

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (!execution || !selectedAnswer) return;

    try {
      await testsApi.executions.submitAnswer(
        parseInt(executionId!),
        execution.testData.questions[currentQuestionIndex].id,
        selectedAnswer
      );

      if (currentQuestionIndex < execution.testData.questions.length - 1) {
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

  if (!execution || !execution.testData?.questions || execution.testData.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="text-red-600 mb-4">No questions available for this test.</div>
        <button
          onClick={() => navigate('/practice-tests')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Return to Practice Tests
        </button>
      </div>
    );
  }

  const currentQuestion = execution.testData.questions[currentQuestionIndex];
  const currentResponse = execution.testData.responses[currentQuestionIndex];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Pane - Question Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Questions</h2>
          <p className="text-sm text-gray-500">Total: {execution.testData.questions.length}</p>
        </div>
        
        {/* Timer */}
        {timeRemaining !== null && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-semibold">
                {Math.floor(timeRemaining / 60000)}:
                {Math.floor((timeRemaining % 60000) / 1000)
                  .toString()
                  .padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {/* Question Navigation Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {execution.testData.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`
                w-full aspect-square rounded-lg text-sm font-medium
                ${
                  currentQuestionIndex === index
                    ? 'bg-indigo-600 text-white'
                    : execution.testData.responses[index]?.student_answer
                    ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Right Pane - Current Question */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Question Content */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{currentQuestion.question_text}</h2>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedAnswer === option
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === option
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedAnswer === option && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
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
                {currentQuestionIndex === execution.testData.questions.length - 1 ? (
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
      </div>
    </div>
  );
}