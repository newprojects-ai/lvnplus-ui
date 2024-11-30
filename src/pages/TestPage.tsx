import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, AlertCircle, Send, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { testsApi } from '../api/tests';
import { Question, TestSession } from '../types/test';
import { useTimer } from '../hooks/useTimer';

export function TestPage() {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<string, 'unseen' | 'seen' | 'answered' | 'flagged'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { time, isRunning, start, formatTime } = useTimer({
    initialTime: session?.timeLimit,
    autoStart: true,
    onTimeUp: handleTimeUp
  });

  useEffect(() => {
    loadTestSession();
  }, [testId]);

  async function loadTestSession() {
    try {
      if (!testId) return;
      const sessionData = await testsApi.getTestSession(testId);
      setSession(sessionData);
      
      // Initialize question status
      const initialStatus: Record<string, 'unseen' | 'seen' | 'answered' | 'flagged'> = {};
      sessionData.questions.forEach(q => {
        initialStatus[q.id] = 'unseen';
      });
      setQuestionStatus(initialStatus);
    } catch (err) {
      setError('Failed to load test session');
      console.error('Failed to load test session:', err);
    }
  }

  async function handleAnswerSubmit(questionId: string, answer: string) {
    try {
      await testsApi.submitAnswer(session!.id, questionId, answer);
      setAnswers(prev => ({ ...prev, [questionId]: answer }));
      setQuestionStatus(prev => ({ ...prev, [questionId]: 'answered' }));
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  }

  async function handleTimeUp() {
    if (!session) return;
    try {
      const result = await testsApi.completeTestSession(session.id);
      navigate(`/results/${result.id}`);
    } catch (err) {
      console.error('Failed to complete test:', err);
    }
  }

  async function handleTestSubmit() {
    if (!session) return;
    setIsSubmitting(true);
    try {
      const result = await testsApi.completeTestSession(session.id);
      navigate(`/results/${result.id}`);
    } catch (err) {
      setError('Failed to submit test');
      console.error('Failed to submit test:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!session || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="text-gray-600">Loading test...</div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Topic Test</h1>
        <div className="flex items-center space-x-4">
          {session.timeLimit && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{formatTime(time).formatted}</span>
            </div>
          )}
          <button
            onClick={handleTestSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <span>Submit Test</span>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question Display */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h2>
            <button
              onClick={() => setQuestionStatus(prev => ({
                ...prev,
                [currentQuestion.id]: prev[currentQuestion.id] === 'flagged' ? 'seen' : 'flagged'
              }))}
              className={`p-2 rounded-md ${
                questionStatus[currentQuestion.id] === 'flagged'
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Flag className="h-5 w-5" />
            </button>
          </div>

          <div className="text-lg mb-4">{currentQuestion.content}</div>

          <input
            type="text"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerSubmit(currentQuestion.id, e.target.value)}
            placeholder="Enter your answer"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(session.questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === session.questions.length - 1}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}