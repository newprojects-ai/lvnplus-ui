import { useState, useEffect } from 'react';
import { TestSession, Question } from '../types/test';
import { questionsApi } from '../api/questions';
import { sessionsApi } from '../api/sessions';

interface UseTestSessionProps {
  sessionId: string;
  onComplete?: (result: TestSession) => void;
}

export function useTestSession({ sessionId, onComplete }: UseTestSessionProps) {
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const sessionData = await sessionsApi.getSession(sessionId);
      setSession(sessionData);
      if (sessionData.questions.length > 0) {
        setCurrentQuestion(sessionData.questions[0]);
      }
    } catch (err) {
      setError('Failed to load test session');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!session || !currentQuestion) return;

    try {
      await questionsApi.submitAnswer(session.id, currentQuestion.id, answer);
      
      // Move to next question if available
      if (questionIndex < session.questions.length - 1) {
        setQuestionIndex(prev => prev + 1);
        setCurrentQuestion(session.questions[questionIndex + 1]);
      }
    } catch (err) {
      setError('Failed to submit answer');
    }
  };

  const completeTest = async () => {
    if (!session) return;

    try {
      const result = await questionsApi.completeTest(session.id);
      onComplete?.(result);
    } catch (err) {
      setError('Failed to complete test');
    }
  };

  return {
    session,
    currentQuestion,
    questionIndex,
    loading,
    error,
    submitAnswer,
    completeTest,
    totalQuestions: session?.questions.length ?? 0,
    isLastQuestion: questionIndex === (session?.questions.length ?? 0) - 1
  };
}