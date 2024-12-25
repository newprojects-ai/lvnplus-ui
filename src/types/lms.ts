// User Types
export type UserRole = 'Parent' | 'Tutor' | 'Student' | 'Admin';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  grade: number;
  parentId?: string;
  tutorIds: string[];
  subjects: Subject[];
  createdAt: string;
  updatedAt: string;
}

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  children: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subjects: Subject[];
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

// Test Types
export interface Test {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  grade: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in minutes
  questions: Question[];
  createdBy: string;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestAssignment {
  id: string;
  testId: string;
  studentIds: string[];
  assignedBy: string;
  dueDate: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  score: number;
  timeSpent: number;
  answers: Answer[];
  completedAt: string;
}

// Question Types
export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: Subject;
  topic: string;
  subtopic?: string;
}

export type QuestionType = 
  | 'MultipleChoice'
  | 'TrueFalse'
  | 'ShortAnswer'
  | 'Essay'
  | 'MathEquation';

export interface Answer {
  questionId: string;
  studentAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

// Analytics Types
export interface PerformanceMetrics {
  studentId: string;
  subject: Subject;
  averageScore: number;
  testsCompleted: number;
  timeSpent: number;
  strengthTopics: string[];
  weaknessTopics: string[];
  progressTrend: ProgressPoint[];
}

export interface ProgressPoint {
  date: string;
  score: number;
  subject: Subject;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'TestAssigned'
  | 'TestCompleted'
  | 'TestDueSoon'
  | 'PerformanceReport';

// Subject and Grade Types
export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  name: string;
}