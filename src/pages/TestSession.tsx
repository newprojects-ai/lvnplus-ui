import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios'; // Import axios directly
import { useAuth } from '../contexts/AuthContext';
import { testsApi } from '../api/tests';
import { TestExecution as TestExecutionType, Question } from '../types/test';
import { getAuthToken } from '../utils/auth'; // Import auth token utility

export function TestSession() {
  const { executionId } = useParams<{ executionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [execution, setExecution] = useState<TestExecutionType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate and parse execution ID
  const validateExecutionId = (id?: string): number | null => {
    if (!id) return null;
    const cleanedId = id.trim().replace(/[^0-9]/g, '');
    if (cleanedId === '') return null;
    const parsedId = parseInt(cleanedId, 10);
    return isNaN(parsedId) || parsedId <= 0 ? null : parsedId;
  };

  // Fetch test execution details
  useEffect(() => {
    const fetchTestExecution = async () => {
      if (!user) {
        setError('Please log in to access the test');
        return;
      }

      const validExecutionId = validateExecutionId(executionId);
      if (!validExecutionId) {
        setError('Invalid execution ID provided.');
        return;
      }

      try {
        setIsLoading(true);
        const executionData = await testsApi.executions.getById(validExecutionId);
        
        if (!executionData) {
          throw new Error('No execution data found for the given ID');
        }

        if (!executionData.testData?.questions || executionData.testData.questions.length === 0) {
          setError('No questions available for this test execution. Please contact support.');
          return;
        }

        setExecution(executionData);

        // Set initial time remaining if timed test
        if (executionData.testPlan?.timingType === 'TIMED') {
          const timeLimit = executionData.testPlan.timeLimit * 1000; // Convert to milliseconds
          const startTime = executionData.startTime ? new Date(executionData.startTime).getTime() : Date.now();
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, timeLimit - elapsedTime);
          
          setTimeRemaining(remainingTime);
        }
      } catch (apiError) {
        console.error('API Error fetching test execution:', apiError);
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

  // Handle answer selection for current question
  const handleAnswerSelect = (answer: string) => {
    if (!execution) return;
    
    const currentQuestion = execution.testData.questions[currentQuestionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.question_id]: answer
    }));
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Navigate to next question or submit test
  const handleNextQuestion = () => {
    if (!execution) return;

    // If not on last question, move to next
    if (currentQuestionIndex < execution.testData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } 
    // If on last question, submit test
    else {
      handleSubmitTest();
    }
  };

  // Submit entire test with all answers
  const handleSubmitTest = async () => {
    if (!execution) return;

    try {
      // Prepare answers payload with time tracking
      const startTime = execution.startTime ? new Date(execution.startTime).getTime() : Date.now();
      const endTime = Date.now();

      const answersPayload = {
        executionId: parseInt(executionId),
        endTime: Math.floor(endTime / 1000), // Convert to seconds
        responses: Object.entries(selectedAnswers).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer,
          timeTaken: Math.floor((Date.now() - startTime) / 1000) // Convert to seconds
        }))
      };

      console.log('Submitting answers payload:', {
        executionId,
        payload: answersPayload
      });

      // Use axios directly with full URL and auth token
      const token = getAuthToken();
      
      try {
        const submitResponse = await axios.post(
          `http://localhost:3000/api/tests/executions/${executionId}/submitAllAnswers`, 
          answersPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : undefined
            }
          }
        );
        console.log('Submit answers response:', submitResponse);
      } catch (submitError) {
        console.error('Submit answers error details:', {
          error: submitError,
          message: submitError.response?.data,
          status: submitError.response?.status,
          headers: submitError.response?.headers
        });
        throw submitError;
      }

      try {
        // Complete the test using axios directly
        const completeResponse = await axios.post(
          `http://localhost:3000/api/tests/executions/${executionId}/complete`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : undefined
            }
          }
        );
        console.log('Complete test response:', completeResponse);
      } catch (completeError) {
        console.error('Complete test error details:', {
          error: completeError,
          message: completeError.response?.data,
          status: completeError.response?.status,
          headers: completeError.response?.headers
        });
        throw completeError;
      }
      
      // Navigate to results
      navigate(`/test/results/${executionId}`);
    } catch (err) {
      console.error('Failed to submit test:', err);
      setError(`Failed to submit test: ${err.message}`);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Ensure we have execution data
  if (!execution) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">No test execution data found.</div>
      </div>
    );
  }

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
                    : selectedAnswers[execution.testData.questions[index].question_id]
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
              <h2 className="text-xl font-semibold mb-4">{execution.testData.questions[currentQuestionIndex].question_text}</h2>
              <div className="space-y-4">
                {execution.testData.questions[currentQuestionIndex].options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedAnswers[execution.testData.questions[currentQuestionIndex].question_id] === option
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[execution.testData.questions[currentQuestionIndex].question_id] === option
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedAnswers[execution.testData.questions[currentQuestionIndex].question_id] === option && (
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
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 flex items-center gap-2 text-gray-600 disabled:opacity-50"
              >
                <ArrowLeft className="h-5 w-5" />
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={!selectedAnswers[execution.testData.questions[currentQuestionIndex].question_id]}
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