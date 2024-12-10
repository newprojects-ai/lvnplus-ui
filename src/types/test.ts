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
  testType: TestType;
  isTimed: boolean;
  selectedTopics: string[];
  selectedSubtopics: string[];
  questionCount: number;
  timeLimit?: number; // in seconds
  createdAt?: string;
}

export type TestType = 'TOPIC' | 'MIXED' | 'MENTAL_ARITHMETIC';

export type TestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface TestPlan {
  testPlanId?: number;
  templateId?: number | null;
  boardId: number;
  testType: TestType;
  timingType: 'TIMED' | 'UNTIMED';
  timeLimit?: number;
  studentId: number;
  plannedBy: number;
  plannedAt?: string;
  configuration: {
    topics: number[];
    subtopics: number[];
    questionCounts: Record<string, number>;
  };
}

export interface TestExecution {
  executionId: number;
  testPlanId: number;
  status: TestStatus;
  startedAt?: string;
  completedAt?: string;
  testData: {
    questions: Question[];
    responses: Record<string, string>;
    timingData: {
      startTime: number;
      endTime?: number;
      pausedDuration?: number;
    };
  };
  score?: number;
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