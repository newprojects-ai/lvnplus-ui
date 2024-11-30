import { apiClient } from './client';
import { Topic } from '../types/topics';

export const topicsApi = {
  getTopics: async (subjectId: number): Promise<Topic[]> => {
    const response = await apiClient.get<Topic[]>(`/api/topics?subjectId=${subjectId}`);
    return response.data;
  }
};