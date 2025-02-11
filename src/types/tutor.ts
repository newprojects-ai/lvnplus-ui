export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gradeLevel: number;
  school: string;
  curriculum: string;
  subjects: Subject[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  focusAreas: string[];
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  tutorId: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface TestPlan {
  id: string;
  title: string;
  description?: string;
  subjectId: number;
  studentId?: string;
  groupId?: string;
  plannedBy: string;
  plannedByType: 'TUTOR';
  timeLimit?: number;
  configuration: {
    questionSetIds: number[];
    questionsPerSet: number;
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  students?: Student[];
  group?: StudyGroup;
  createdAt: string;
  updatedAt: string;
}

export interface TestExecution {
  id: string;
  testPlanId: string;
  studentId: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
  startedAt: string;
  completedAt?: string;
  score?: number;
  duration?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  answers: Array<{
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
    timeTaken: number;
  }>;
}

export interface PerformanceData {
  progress: {
    overallProgress: number;
    subjectProgress: Record<string, number>;
    improvementAreas: string[];
    strengthAreas: string[];
  };
  subjectMastery: Array<{
    id: string;
    subjectId: string;
    masteryLevel: number;
    subjects: {
      id: string;
      name: string;
    };
  }>;
  recentTests: TestExecution[];
}
