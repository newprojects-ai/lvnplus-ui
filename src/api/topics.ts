import { apiClient } from './client';
import { Topic, Subtopic } from '../types/test';

export const topicsApi = {
  getTopics: async (): Promise<Topic[]> => {
    const response = await apiClient.get<Topic[]>('/topics');
    return response.data;
  },

  getSubtopics: async (topicId: string): Promise<Subtopic[]> => {
    const response = await apiClient.get<Subtopic[]>(`/topics/${topicId}/subtopics`);
    return response.data;
  }
};