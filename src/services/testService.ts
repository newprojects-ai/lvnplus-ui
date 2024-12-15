import { apiClient } from '../api/client';
import { getUser, getAuthToken, verifyToken } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const testsApi = {
  fetchTestResults: async (executionId: number) => {
    try {
      console.log(`Fetching test results for executionId: ${executionId}`);
      console.log(`Full URL: ${API_BASE_URL}/tests/executions/${executionId}/results`);
      
      const response = await apiClient.get(`/tests/executions/${executionId}/results`);
      
      console.log('API Response:', response.data);
      
      // Ensure we're returning the correct data structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching test results:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  createMixedTest: async (params: {
    numberOfQuestions: number;
    isTimed: boolean;
  }) => {
    try {
      console.log('API Base URL:', API_BASE_URL);
      
      // Get user data, verify token if needed
      let user = getUser();
      if (!user) {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        user = await verifyToken(token);
        if (!user) {
          throw new Error('Failed to verify authentication token');
        }
      }

      // Convert user.id to number if it's a string
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      if (isNaN(userId)) {
        throw new Error('Invalid user ID');
      }
      
      console.log('Creating test plan with user ID:', userId);
      
      // First create a test plan
      const testPlan = await apiClient.post('/tests/plans', {
        templateId: null,
        boardId: 1,
        plannedBy: userId,
        studentId: userId,  // Add studentId for self-test
        testType: 'MIXED',
        timingType: params.isTimed ? 'TIMED' : 'UNTIMED',
        timeLimit: params.isTimed ? 1800 : 0,
        configuration: {
          totalQuestionCount: params.numberOfQuestions,
          topics: [],
          subtopics: [],
          difficulty: 'ALL'
        }
      });
      console.log('Test plan created:', testPlan.data);

      // Then create an execution
      const execution = await apiClient.post(`/tests/plans/${testPlan.data.testPlanId}/executions`, {});
      console.log('Test execution created:', execution.data);

      // Start the execution
      const startedExecution = await apiClient.post(`/tests/executions/${execution.data.executionId}/start`);
      console.log('Test execution started:', startedExecution.data);

      return {
        executionId: execution.data.executionId,
        ...startedExecution.data
      };
    } catch (error) {
      console.error('Error creating mixed test:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
};
