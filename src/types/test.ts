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
  question_id: number;
  subtopic_id: number;
  question_text: string;
  options: string[];
  difficulty_level: number;
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
    totalQuestionCount: number;
  };
}

export interface TestResponse {
  question_id: number;
  student_answer: string | null;
  is_correct: boolean | null;
  time_spent: number;
}

export interface TestExecution {
  executionId: string;
  testPlanId: string;
  status: TestStatus;
  startedAt: string | null;
  completedAt: string | null;
  score: number | null;
  testData: {
    questions: Question[];
    responses: TestResponse[];
  };
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
  executionId: string;
  testPlanId: string;
  studentId: string;
  status: string;
  startedAt: string;
  score: number;
  testData: {
    totalQuestions: number;
    correctAnswers: number;
    questions: {
      question_id: number;
      subtopic_id: number;
      question_text: string;
      options: string[];
      difficulty_level: number;
      correct_answer: string;
      correct_answer_plain: string;
    }[];
    responses: {
      question_id: number;
      student_answer: string;
      is_correct: boolean;
      time_spent: number;
    }[];
  };
}