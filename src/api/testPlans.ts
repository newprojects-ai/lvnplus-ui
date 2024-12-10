import { apiClient } from './client';
import { TestPlan } from '../types/test';
import { getAuthToken } from '../utils/auth';

export const testPlansApi = {
  create: async (testPlanData: Partial<TestPlan>) => {
    try {
      console.group('Test Plan Creation Request');
      console.log('Payload:', JSON.stringify(testPlanData, null, 2));
      
      if (!testPlanData.studentId) {
        throw new Error('Student ID is required');
      }

      const response = await apiClient.post<TestPlan>('/tests/plans', testPlanData);
      
      console.log('Test Plan Creation Response:', JSON.stringify(response.data, null, 2));
      console.groupEnd();
      
      return response.data;
    } catch (error: any) {
      console.group('Test Plan Creation Error');
      console.error('Full Error Object:', error);
      
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        console.error('Response Headers:', error.response.headers);
      }
      
      console.groupEnd();
      throw error;
    }
  },

  getById: async (planId: number): Promise<TestPlan> => {
    try {
      console.group('Get Test Plan by ID Request');
      console.log('Plan ID:', planId);
      
      const token = getAuthToken();
      console.log('Authentication Token:', token);
      
      const requestConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log('Request Configuration:', JSON.stringify(requestConfig, null, 2));
      
      const response = await apiClient.get<TestPlan>(`/tests/plans/${planId}`, requestConfig);
      
      console.log('Get Test Plan by ID Response:', JSON.stringify(response.data, null, 2));
      console.groupEnd();
      
      return response.data;
    } catch (error: any) {
      console.group('Get Test Plan by ID Error');
      console.error('Full Error Object:', error);
      
      // Log specific error details
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        console.error('Response Headers:', error.response.headers);
      }
      
      // Log request configuration if available
      if (error.config) {
        console.error('Request Config:', JSON.stringify(error.config, null, 2));
      }
      
      console.groupEnd();
      
      // Rethrow the error with more context
      throw new Error(`Get test plan by ID failed: ${error.response?.data?.message || error.message}`);
    }
  },

  update: async (planId: number, updates: Partial<TestPlan>): Promise<TestPlan> => {
    try {
      console.group('Update Test Plan Request');
      console.log('Plan ID:', planId);
      console.log('Updates:', JSON.stringify(updates, null, 2));
      
      const token = getAuthToken();
      console.log('Authentication Token:', token);
      
      const requestConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log('Request Configuration:', JSON.stringify(requestConfig, null, 2));
      
      const response = await apiClient.patch<TestPlan>(`/tests/plans/${planId}`, updates, requestConfig);
      
      console.log('Update Test Plan Response:', JSON.stringify(response.data, null, 2));
      console.groupEnd();
      
      return response.data;
    } catch (error: any) {
      console.group('Update Test Plan Error');
      console.error('Full Error Object:', error);
      
      // Log specific error details
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        console.error('Response Headers:', error.response.headers);
      }
      
      // Log request configuration if available
      if (error.config) {
        console.error('Request Config:', JSON.stringify(error.config, null, 2));
      }
      
      console.groupEnd();
      
      // Rethrow the error with more context
      throw new Error(`Update test plan failed: ${error.response?.data?.message || error.message}`);
    }
  },

  delete: async (planId: number): Promise<void> => {
    try {
      console.group('Delete Test Plan Request');
      console.log('Plan ID:', planId);
      
      const token = getAuthToken();
      console.log('Authentication Token:', token);
      
      const requestConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log('Request Configuration:', JSON.stringify(requestConfig, null, 2));
      
      await apiClient.delete(`/tests/plans/${planId}`, requestConfig);
      
      console.log('Delete Test Plan Response: Success');
      console.groupEnd();
    } catch (error: any) {
      console.group('Delete Test Plan Error');
      console.error('Full Error Object:', error);
      
      // Log specific error details
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        console.error('Response Headers:', error.response.headers);
      }
      
      // Log request configuration if available
      if (error.config) {
        console.error('Request Config:', JSON.stringify(error.config, null, 2));
      }
      
      console.groupEnd();
      
      // Rethrow the error with more context
      throw new Error(`Delete test plan failed: ${error.response?.data?.message || error.message}`);
    }
  }
};