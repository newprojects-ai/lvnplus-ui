export type Subject = 'Mathematics' | 'English';

export type TestType = 'short' | 'long';

export interface Question {
  id: string;
  subject: Subject;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Test {
  id: string;
  subject: Subject;
  type: TestType;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // in minutes
}

export interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

export interface StudentProgress {
  subject: Subject;
  testsCompleted: number;
  averageScore: number;
  recentResults: TestResult[];
}