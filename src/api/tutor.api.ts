import { axiosInstance } from './axios';
import { 
  Student, 
  StudyGroup, 
  TestPlan, 
  TestExecution, 
  PerformanceData 
} from '../types/tutor';

class TutorApi {
  private baseUrl = '/api/tutor';

  // Student Management
  async getLinkedStudents(): Promise<Student[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/students`);
    return response.data;
  }

  async linkStudent(studentId: number): Promise<Student> {
    const response = await axiosInstance.post(`${this.baseUrl}/students`, { studentId });
    return response.data;
  }

  async unlinkStudent(studentId: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/students/${studentId}`);
  }

  // Group Management
  async createGroup(data: {
    name: string;
    description?: string;
    studentIds: number[];
  }): Promise<StudyGroup> {
    const response = await axiosInstance.post(`${this.baseUrl}/groups`, data);
    return response.data;
  }

  async getGroups(): Promise<StudyGroup[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/groups`);
    return response.data;
  }

  async updateGroup(groupId: number, data: {
    name?: string;
    description?: string;
  }): Promise<StudyGroup> {
    const response = await axiosInstance.put(`${this.baseUrl}/groups/${groupId}`, data);
    return response.data;
  }

  async deleteGroup(groupId: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/groups/${groupId}`);
  }

  async addStudentsToGroup(groupId: number, studentIds: number[]): Promise<StudyGroup> {
    const response = await axiosInstance.post(
      `${this.baseUrl}/groups/${groupId}/students`,
      { studentIds }
    );
    return response.data;
  }

  async removeStudentFromGroup(groupId: number, studentId: number): Promise<void> {
    await axiosInstance.delete(
      `${this.baseUrl}/groups/${groupId}/students/${studentId}`
    );
  }

  // Test Planning
  async createTestPlan(data: {
    studentId?: number;
    groupId?: number;
    title: string;
    description?: string;
    subjectId: number;
    questionSetIds: number[];
    questionsPerSet: number;
    timeLimit?: number;
  }): Promise<TestPlan | TestPlan[]> {
    const response = await axiosInstance.post(`${this.baseUrl}/test-plans`, data);
    return response.data;
  }

  async getTestPlans(): Promise<TestPlan[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/test-plans`);
    return response.data;
  }

  async getTestPlan(id: number): Promise<TestPlan> {
    const response = await axiosInstance.get(`${this.baseUrl}/test-plans/${id}`);
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

  async deleteTestPlan(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/test-plans/${id}`);
  }

  // Performance Tracking
  async getStudentPerformance(studentId: number): Promise<PerformanceData> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/students/${studentId}/performance`
    );
    return response.data;
  }

  async getGroupPerformance(groupId: number): Promise<{
    groupInfo: StudyGroup;
    progress: any[];
    subjectMastery: any[];
    recentTests: TestExecution[];
  }> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/groups/${groupId}/performance`
    );
    return response.data;
  }

  async getStudentTestHistory(studentId: number): Promise<TestExecution[]> {
    const response = await axiosInstance.get(
      `${this.baseUrl}/students/${studentId}/tests`
    );
    return response.data;
  }
}

export const tutorApi = new TutorApi();
