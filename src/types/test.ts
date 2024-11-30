export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  name: string;
  topicId: string;
}

export interface Question {
  id: string;
  content: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  topicId: string;
  subtopicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestConfig {
  id?: string;
  userId: string;
  testType: 'topic' | 'mixed' | 'mental';
  isTimed: boolean;
  selectedTopics: string[];
  selectedSubtopics: string[];
  questionCount: number;
  timeLimit?: number; // in seconds
  createdAt?: string;
}

export interface TestSession {
  id: string;
  testConfigId: string;
  startTime: string;
  endTime?: string;
  questions: Question[];
  answers: Record<string, string>;
  status: 'in-progress' | 'completed' | 'expired';
  score?: number;
  timeSpent?: number; // in seconds
}

export interface TestResult {
  id: string;
  testSessionId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
  accuracy: number;
  topicPerformance: {
    topicId: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
}