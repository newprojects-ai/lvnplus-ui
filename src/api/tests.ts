import { apiClient } from './client';
import { Topic, Question, TestConfig, TestSession, TestResult } from '../types/test';

export const testsApi = {
  // Topics and subtopics
  getTopics: async (): Promise<Topic[]> => {
    const response = await apiClient.get<Topic[]>('/topics');
    return response.data;
  },

  // Questions
  getQuestionsByTopics: async (params: {
    topicIds: string[];
    subtopicIds: string[];
    count: number;
  }): Promise<Question[]> => {
    const response = await apiClient.get<Question[]>('/questions', { params });
    return response.data;
  },

  // Test configuration
  createTestConfig: async (config: Omit<TestConfig, 'id'>): Promise<TestConfig> => {
    const response = await apiClient.post<TestConfig>('/tests/config', config);
    return response.data;
  },

  // Test session
  startTestSession: async (testConfigId: string): Promise<TestSession> => {
    const response = await apiClient.post<TestSession>(`/tests/sessions/${testConfigId}/start`);
    return response.data;
  },

  submitAnswer: async (sessionId: string, questionId: string, answer: string): Promise<void> => {
    await apiClient.post(`/tests/sessions/${sessionId}/answers`, {
      questionId,
      answer
    });
  },

  completeTestSession: async (sessionId: string): Promise<TestResult> => {
    const response = await apiClient.post<TestResult>(`/tests/sessions/${sessionId}/complete`);
    return response.data;
  },

  getTestResult: async (sessionId: string): Promise<TestResult> => {
    const response = await apiClient.get<TestResult>(`/tests/results/${sessionId}`);
    return response.data;
  }
};