import axios from 'axios';
import { Student, StudyGroup, TestPlan, TestExecution, PerformanceData } from '../types/tutor';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class Api {
  // Auth
  async login(email: string, password: string) {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: any) {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  }

  // Students
  async getStudents(): Promise<Student[]> {
    const response = await axiosInstance.get('/api/students');
    return response.data;
  }

  async getStudent(id: number): Promise<Student> {
    const response = await axiosInstance.get(`/api/students/${id}`);
    return response.data;
  }

  async createStudent(student: Partial<Student>): Promise<Student> {
    const response = await axiosInstance.post('/api/students', student);
    return response.data;
  }

  async updateStudent(id: number, student: Partial<Student>): Promise<Student> {
    const response = await axiosInstance.put(`/api/students/${id}`, student);
    return response.data;
  }

  async deleteStudent(id: number): Promise<void> {
    await axiosInstance.delete(`/api/students/${id}`);
  }

  // Study Groups
  async getGroups(): Promise<StudyGroup[]> {
    const response = await axiosInstance.get('/api/groups');
    return response.data;
  }

  async getGroup(id: number): Promise<StudyGroup> {
    const response = await axiosInstance.get(`/api/groups/${id}`);
    return response.data;
  }

  async createGroup(group: Partial<StudyGroup>): Promise<StudyGroup> {
    const response = await axiosInstance.post('/api/groups', group);
    return response.data;
  }

  async updateGroup(id: number, group: Partial<StudyGroup>): Promise<StudyGroup> {
    const response = await axiosInstance.put(`/api/groups/${id}`, group);
    return response.data;
  }

  async deleteGroup(id: number): Promise<void> {
    await axiosInstance.delete(`/api/groups/${id}`);
  }

  // Test Plans
  async getTestPlans(): Promise<TestPlan[]> {
    const response = await axiosInstance.get('/api/test-plans');
    return response.data;
  }

  async getTestPlan(id: number): Promise<TestPlan> {
    const response = await axiosInstance.get(`/api/test-plans/${id}`);
    return response.data;
  }

  async createTestPlan(testPlan: Partial<TestPlan>): Promise<TestPlan> {
    const response = await axiosInstance.post('/api/test-plans', testPlan);
    return response.data;
  }

  async updateTestPlan(id: number, testPlan: Partial<TestPlan>): Promise<TestPlan> {
    const response = await axiosInstance.put(`/api/test-plans/${id}`, testPlan);
    return response.data;
  }

  async deleteTestPlan(id: number): Promise<void> {
    await axiosInstance.delete(`/api/test-plans/${id}`);
  }

  // Test Executions
  async getTestExecutions(): Promise<TestExecution[]> {
    const response = await axiosInstance.get('/api/test-executions');
    return response.data;
  }

  async getTestExecution(id: number): Promise<TestExecution> {
    const response = await axiosInstance.get(`/api/test-executions/${id}`);
    return response.data;
  }

  async startTestExecution(testPlanId: number): Promise<TestExecution> {
    const response = await axiosInstance.post(`/api/test-executions`, { testPlanId });
    return response.data;
  }

  async submitTestExecution(id: number, answers: any[]): Promise<TestExecution> {
    const response = await axiosInstance.put(`/api/test-executions/${id}`, { answers });
    return response.data;
  }

  // Performance
  async getStudentPerformance(studentId: number): Promise<PerformanceData> {
    const response = await axiosInstance.get(`/api/students/${studentId}/performance`);
    return response.data;
  }

  async getGroupPerformance(groupId: number): Promise<PerformanceData> {
    const response = await axiosInstance.get(`/api/groups/${groupId}/performance`);
    return response.data;
  }

  // Parent-specific endpoints
  async getLinkedChildren(): Promise<Student[]> {
    const response = await axiosInstance.get('/api/parents/children');
    return response.data;
  }

  async linkChild(code: string): Promise<Student> {
    const response = await axiosInstance.post('/api/parents/children/link', { code });
    return response.data;
  }

  async unlinkChild(childId: number): Promise<void> {
    await axiosInstance.delete(`/api/parents/children/${childId}`);
  }
}

export const api = new Api();
