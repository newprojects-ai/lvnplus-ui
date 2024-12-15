import { apiClient } from './client';
import { Topic, Question, TestResult } from '../types/test';
import { testPlansApi } from './testPlans';
import { testExecutionsApi } from './testExecutions';

export const testsApi = {
  plans: testPlansApi,
  executions: testExecutionsApi,

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

  getTestResult: async (executionId: string): Promise<TestResult> => {
    const response = await apiClient.get<TestResult>(`/tests/executions/${executionId}/results`);
    return response.data.data;
  }
};