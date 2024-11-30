import { apiClient } from './client';
import { TestSession, TestConfig } from '../types/test';

export const sessionsApi = {
  createSession: async (config: TestConfig): Promise<TestSession> => {
    const response = await apiClient.post<TestSession>('/test-sessions', config);
    return response.data;
  },

  getSession: async (sessionId: string): Promise<TestSession> => {
    const response = await apiClient.get<TestSession>(`/test-sessions/${sessionId}`);
    return response.data;
  },

  updateSession: async (sessionId: string, data: Partial<TestSession>): Promise<TestSession> => {
    const response = await apiClient.patch<TestSession>(`/test-sessions/${sessionId}`, data);
    return response.data;
  }
};