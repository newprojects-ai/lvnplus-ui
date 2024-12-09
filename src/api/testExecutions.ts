import { apiClient } from './client';
import { TestExecution, Question } from '../types/test';

export const testExecutionsApi = {
  create: async (testPlanId: number): Promise<TestExecution> => {
    const response = await apiClient.post<TestExecution>(`/tests/plans/${testPlanId}/executions`);
    return response.data;
  },

  getById: async (executionId: number): Promise<TestExecution> => {
    const response = await apiClient.get<TestExecution>(`/tests/executions/${executionId}`);
    return response.data;
  },

  submitAnswer: async (executionId: number, questionId: number, answer: string): Promise<void> => {
    await apiClient.post(`/tests/executions/${executionId}/answers`, {
      questionId,
      answer
    });
  },

  complete: async (executionId: number): Promise<TestExecution> => {
    const response = await apiClient.post<TestExecution>(
      `/tests/executions/${executionId}/complete`
    );
    return response.data;
  },

  pause: async (executionId: number): Promise<TestExecution> => {
    const response = await apiClient.post<TestExecution>(
      `/tests/executions/${executionId}/pause`
    );
    return response.data;
  },

  resume: async (executionId: number): Promise<TestExecution> => {
    const response = await apiClient.post<TestExecution>(
      `/tests/executions/${executionId}/resume`
    );
    return response.data;
  }
};