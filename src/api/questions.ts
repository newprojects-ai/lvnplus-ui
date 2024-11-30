import { apiClient } from './client';
import { Question, TestSession, TestResult } from '../types/test';

export const questionsApi = {
  getQuestions: async (params: {
    topicIds: string[];
    subtopicIds: string[];
    count: number;
  }): Promise<Question[]> => {
    const response = await apiClient.get<Question[]>('/questions', { params });
    return response.data;
  },

  submitAnswer: async (sessionId: string, questionId: string, answer: string): Promise<void> => {
    await apiClient.post(`/test-sessions/${sessionId}/answers`, {
      questionId,
      answer
    });
  },

  completeTest: async (sessionId: string): Promise<TestResult> => {
    const response = await apiClient.post<TestResult>(`/test-sessions/${sessionId}/complete`);
    return response.data;
  }
};