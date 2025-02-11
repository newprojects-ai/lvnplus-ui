import { axiosInstance } from './axios';
import { 
  LinkedChild, 
  TestPlan, 
  TestExecution,
  PerformanceMetrics,
  LearningGoal,
  Subject
} from '../types/parent';

interface CreateTestPlanRequest {
  subjectId: string;
  typeId: string;
  config: {
    questionCount: number;
    timeLimit: number;
    difficulty: 'easy' | 'medium' | 'hard';
    isTimed: boolean;
  };
  assignedTo: string[];
}

class ParentApi {
  private baseUrl = '/parents';

  // Child Management
  async getLinkedChildren(): Promise<LinkedChild[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/children`);
    return response.data;
  }

  async getLinkedChild(childId: string): Promise<LinkedChild> {
    const response = await axiosInstance.get(`${this.baseUrl}/children/${childId}`);
    return response.data;
  }

  // Subject Management
  async getSubjects(): Promise<Subject[]> {
    const response = await axiosInstance.get('subjects');
    return response.data;
  }

  async getSubject(subjectId: string): Promise<Subject> {
    const response = await axiosInstance.get(`subjects/${subjectId}`);
    return response.data;
  }

  // Test Planning
  async createTestPlan(data: CreateTestPlanRequest): Promise<TestPlan> {
    const response = await axiosInstance.post(`${this.baseUrl}/test-plans`, data);
    return response.data;
  }

  async getTestPlans(): Promise<TestPlan[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/test-plans`);
    return response.data;
  }

  async getTestPlan(testPlanId: string): Promise<TestPlan> {
    const response = await axiosInstance.get(`${this.baseUrl}/test-plans/${testPlanId}`);
    return response.data;
  }

  async deleteTestPlan(testPlanId: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/test-plans/${testPlanId}`);
  }

  // Performance Monitoring
  async getChildPerformance(childId: string): Promise<PerformanceMetrics> {
    const response = await axiosInstance.get(`${this.baseUrl}/children/${childId}/performance`);
    return response.data;
  }

  async getTestExecutions(childId: string): Promise<TestExecution[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/children/${childId}/test-executions`);
    return response.data;
  }

  // Learning Goals
  async getLearningGoals(childId: string): Promise<LearningGoal[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/children/${childId}/goals`);
    return response.data;
  }

  async createLearningGoal(childId: string, data: {
    description: string;
    subject: string;
    targetDate: string;
  }): Promise<LearningGoal> {
    const response = await axiosInstance.post(
      `${this.baseUrl}/children/${childId}/goals`,
      data
    );
    return response.data;
  }

  async updateLearningGoal(
    childId: string,
    goalId: string,
    data: Partial<LearningGoal>
  ): Promise<LearningGoal> {
    const response = await axiosInstance.put(
      `${this.baseUrl}/children/${childId}/goals/${goalId}`,
      data
    );
    return response.data;
  }

  async deleteLearningGoal(childId: string, goalId: string): Promise<void> {
    await axiosInstance.delete(
      `${this.baseUrl}/children/${childId}/goals/${goalId}`
    );
  }

  // Child Subjects
  async getChildSubjects(childId: string): Promise<Subject[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/children/${childId}/subjects`);
    return response.data;
  }

  async updateSubjectProficiency(
    childId: string,
    subjectId: string,
    proficiencyLevel: string
  ): Promise<Subject> {
    const response = await axiosInstance.put(
      `${this.baseUrl}/children/${childId}/subjects/${subjectId}/proficiency`,
      { proficiencyLevel }
    );
    return response.data;
  }

  async getSubjectsEndpoint(): Promise<any> {
    const response = await axiosInstance.get('subjects/endpoint');
    return response.data;
  }

  async getSubjectsEndpointById(subjectId: string): Promise<any> {
    const response = await axiosInstance.get(`subjects/${subjectId}/endpoint`);
    return response.data;
  }

  async getSubjectPerformance(childId: string, subjectId: string): Promise<PerformanceMetrics[]> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/children/${childId}/subjects/${subjectId}/performance`
    );
    return response.data;
  }

  async updateTestPlan(id: number, data: {
    title?: string;
    description?: string;
    timeLimit?: number;
  }): Promise<TestPlan> {
    const response = await axiosInstance.put(`${this.baseUrl}/test-plans/${id}`, data);
    return response.data;
  }
}

export const parentApi = new ParentApi();
