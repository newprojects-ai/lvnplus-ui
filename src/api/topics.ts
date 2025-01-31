import { apiClient } from './client';
import { Topic, Subtopic } from '../types/test';

interface TopicsParams {
  subjectId: number;
}

export const topicsApi = {
  getTopics: async (subjectId: number): Promise<Topic[]> => {
    const response = await apiClient.get<Topic[]>('/topics', {
      params: { subjectId }
    });
    return response.data;
  },

  getSubtopics: async (topicId: string): Promise<Subtopic[]> => {
    const response = await apiClient.get<Subtopic[]>(`/topics/${topicId}/subtopics`);
    return response.data;
  }
};