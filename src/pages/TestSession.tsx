import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { testsApi } from '../api/tests';
import { TestExecution as TestExecutionType, Question } from '../types/test';
import { getAuthToken } from '../utils/auth';
import { renderMathContent } from '../utils/katexParser';
import 'katex/dist/katex.min.css';

export function TestSession() {
  const { executionId } = useParams<{ executionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [execution, setExecution] = useState<TestExecutionType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [testStartTime] = useState<number>(Date.now());
  const [testElapsedTime, setTestElapsedTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [seenQuestions, setSeenQuestions] = useState<Set<number>>(new Set());
  const [questionStartTimes, setQuestionStartTimes] = useState<{ [key: string]: number }>({});
  const [questionElapsedTime, setQuestionElapsedTime] = useState<number>(0);
  const [questionTimeSpent, setQuestionTimeSpent] = useState<{ [key: string]: number }>({});

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

  // Initialize test start time and elapsed time tracking
  useEffect(() => {
    if (execution?.status === 'IN_PROGRESS' && !testElapsedTime) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
        setTestElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [execution?.status, testStartTime, execution?.startTime]);

  // Track elapsed time
  useEffect(() => {
    if (!testStartTime || !execution || execution.status !== 'IN_PROGRESS') return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
      setTestElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [testStartTime, execution?.status]);

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

  // Track seen questions
  useEffect(() => {
    setSeenQuestions(prev => new Set([...prev, currentQuestionIndex]));
  }, [currentQuestionIndex]);

  // Initialize question start time when switching questions
  useEffect(() => {
    if (!execution || execution.status !== 'IN_PROGRESS') return;
    
    // Save time spent on previous question if switching questions
    const currentQuestionId = execution.testData.questions[currentQuestionIndex].question_id;
    const prevQuestionId = currentQuestionIndex > 0 
      ? execution.testData.questions[currentQuestionIndex - 1].question_id 
      : null;

    if (prevQuestionId && questionStartTimes[prevQuestionId]) {
      const timeSpent = Math.floor((Date.now() - questionStartTimes[prevQuestionId]) / 1000);
      setQuestionTimeSpent(prev => ({
        ...prev,
        [prevQuestionId]: (prev[prevQuestionId] || 0) + timeSpent
      }));
    }
    
    // Reset question elapsed time and set new start time
    setQuestionElapsedTime(0);
    setQuestionStartTimes(prev => ({
      ...prev,
      [currentQuestionId]: Date.now()
    }));
  }, [currentQuestionIndex, execution]);

  // Question timer effect
  useEffect(() => {
    if (!execution || execution.status !== 'IN_PROGRESS') return;
    const currentQuestionId = execution.testData.questions[currentQuestionIndex].question_id;
    const startTime = questionStartTimes[currentQuestionId];
    if (!startTime) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setQuestionElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, questionStartTimes, execution]);

  // Handle answer selection for current question
  const handleAnswerSelect = (answer: string) => {
    if (!execution) return;
    
    const currentQuestion = execution.testData.questions[currentQuestionIndex];
    const questionId = currentQuestion.question_id;
    
    // Update selected answers
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Toggle flag for current question
  const toggleQuestionFlag = () => {
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(currentQuestionIndex)) {
        newFlags.delete(currentQuestionIndex);
      } else {
        newFlags.add(currentQuestionIndex);
      }
      return newFlags;
    });
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Navigate to next question
  const handleNext = () => {
    if (!execution) return;

    if (currentQuestionIndex < execution.testData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Get question status
  const getQuestionStatus = (index: number) => {
    if (selectedAnswers[execution.testData.questions[index].question_id]) return 'answered';
    if (flaggedQuestions.has(index)) return 'flagged';
    if (seenQuestions.has(index)) return 'seen';
    return 'not-seen';
  };

  // Handle test submission
  const handleSubmitTest = async () => {
    if (!execution) return;

    try {
      setIsSubmitting(true);

      // Calculate final timing data
      const endTime = Date.now();
      
      // Save time spent on the last question
      const lastQuestionId = execution.testData.questions[currentQuestionIndex].question_id;
      const lastQuestionTimeSpent = Math.floor((endTime - questionStartTimes[lastQuestionId]) / 1000);
      const finalQuestionTimeSpent = {
        ...questionTimeSpent,
        [lastQuestionId]: (questionTimeSpent[lastQuestionId] || 0) + lastQuestionTimeSpent
      };

      // Calculate total test time
      const totalTimeTaken = {
        minutes: Math.floor(testElapsedTime / 60),
        seconds: testElapsedTime % 60
      };

      // Prepare answers payload with time spent for each question
      const answersPayload = {
        executionId: parseInt(executionId),
        endTime: Math.floor(endTime / 1000),
        responses: Object.entries(selectedAnswers).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          answer,
          timeTaken: finalQuestionTimeSpent[questionId] || 0
        }))
      };

      // Get auth token
      const token = getAuthToken();
      
      // Submit all answers with individual question timing data
      await axios.post(
        `http://localhost:3000/api/tests/executions/${executionId}/submitAllAnswers`, 
        answersPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined
          }
        }
      );

      // Complete the test with timing data
      await axios.post(
        `http://localhost:3000/api/tests/executions/${executionId}/complete`,
        {
          timingData: {
            endTime: Math.floor(endTime / 1000),
            startTime: Math.floor(testStartTime / 1000),
            TotalTimeTaken: testElapsedTime,
            testTotalTimeTaken: testElapsedTime
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined
          }
        }
      );

      // Navigate to results
      navigate(`/test/results/${executionId}`);
    } catch (error) {
      console.error('Failed to submit test:', error);
      setError('Failed to submit test. Please try again.');
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Timers */}
      <header className="bg-white shadow-sm p-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Test Progress */}
          <div className="flex items-center space-x-4">
            {/* Total Time */}
            <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-md">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-base font-semibold text-indigo-700">
                Total: {String(Math.floor(testElapsedTime / 60)).padStart(2, '0')}:
                {String(testElapsedTime % 60).padStart(2, '0')}
              </span>
            </div>

            {/* Question Timer */}
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-md">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-base font-semibold text-green-700">
                Question: {String(Math.floor(questionElapsedTime / 60)).padStart(2, '0')}:
                {String(questionElapsedTime % 60).padStart(2, '0')}
              </span>
            </div>

            {/* Time Remaining (if timed test) */}
            {timeRemaining !== null && (
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-md">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-base font-semibold text-gray-700">
                  Left: {String(Math.floor(timeRemaining / 60000)).padStart(2, '0')}:
                  {String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {/* Question Progress */}
          <div className="text-gray-600">
            Question {currentQuestionIndex + 1} of {execution?.testData.questions.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane - Question Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          {/* Progress Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Progress</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xl font-bold">{execution.testData.questions.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {Object.keys(selectedAnswers).length}
                </div>
                <div className="text-sm text-green-600">Answered</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-red-600">
                  {flaggedQuestions.size}
                </div>
                <div className="text-sm text-red-600">Flagged</div>
              </div>
            </div>
          </div>
          
          {/* Question Groups */}
          {Array.from({ length: Math.ceil(execution.testData.questions.length / 10) }, (_, i) => {
            const start = i * 10 + 1;
            const end = Math.min((i + 1) * 10, execution.testData.questions.length);
            return (
              <div key={i} className="mb-6">
                <h3 className="text-sm text-gray-600 mb-2">Questions {start}-{end}</h3>
                <div className="grid grid-cols-5 gap-2">
                  {execution.testData.questions.slice(i * 10, (i + 1) * 10).map((_, idx) => {
                    const questionIndex = i * 10 + idx;
                    const status = getQuestionStatus(questionIndex);
                    return (
                      <button
                        key={questionIndex}
                        onClick={() => setCurrentQuestionIndex(questionIndex)}
                        className={`
                          w-full aspect-square rounded-lg text-sm font-medium
                          ${currentQuestionIndex === questionIndex ? 'ring-2 ring-indigo-500' : ''}
                          ${status === 'answered' ? 'bg-green-100 text-green-700' :
                            status === 'flagged' ? 'bg-red-100 text-red-700' :
                            status === 'seen' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-gray-100 text-gray-600'}
                        `}
                      >
                        {questionIndex + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>Flagged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 rounded"></div>
              <span>Seen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>Not Seen</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Question Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-4 py-6 max-w-3xl">
              {/* Question Card */}
              <div className="bg-white rounded-lg shadow mb-4">
                {/* Question Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Question {currentQuestionIndex + 1}</h2>
                  <button
                    onClick={toggleQuestionFlag}
                    className={`p-2 rounded-lg transition-colors ${
                      flaggedQuestions.has(currentQuestionIndex)
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Flag className={`h-5 w-5 ${
                      flaggedQuestions.has(currentQuestionIndex) ? 'fill-current' : ''
                    }`} />
                  </button>
                </div>

                {/* Question Text */}
                <div className="p-6 border-b">
                  <div className="w-full">
                    <div className="text-lg" style={{
                      width: '100%',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                      hyphens: 'auto'
                    }}>
                      {renderMathContent(execution.testData.questions[currentQuestionIndex].question_text)}
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="p-6">
                  <div className="space-y-4">
                    {execution.testData.questions[currentQuestionIndex].options.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`rounded-lg border-2 cursor-pointer ${
                          selectedAnswers[execution.testData.questions[currentQuestionIndex].question_id] === option
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200'
                        }`}
                      >
                        <div className="p-4 flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswers[execution.testData.questions[currentQuestionIndex].question_id] === option
                                ? 'border-indigo-500 bg-indigo-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedAnswers[execution.testData.questions[currentQuestionIndex].question_id] === option && (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1" style={{
                            width: '100%',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere',
                            hyphens: 'auto'
                          }}>
                            {renderMathContent(option)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevious}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    ${currentQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}
                  `}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                  Previous
                </button>

                {currentQuestionIndex === execution.testData.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitTest}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Submit Test
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Next
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}