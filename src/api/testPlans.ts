import { apiClient } from './client';
import { TestPlan } from '../types/test';

export const testPlansApi = {
  create: async (config: Omit<TestPlan, 'testPlanId' | 'plannedAt'>): Promise<TestPlan> => {
    const response = await apiClient.post<TestPlan>('/tests/plans', config);
    return response.data;
  },

  getById: async (planId: number): Promise<TestPlan> => {
    const response = await apiClient.get<TestPlan>(`/tests/plans/${planId}`);
    return response.data;
  },

  update: async (planId: number, updates: Partial<TestPlan>): Promise<TestPlan> => {
    const response = await apiClient.patch<TestPlan>(`/tests/plans/${planId}`, updates);
    return response.data;
  },

  delete: async (planId: number): Promise<void> => {
    await apiClient.delete(`/tests/plans/${planId}`);
  }
};