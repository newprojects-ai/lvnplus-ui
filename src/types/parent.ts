export interface ChildProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gradeLevel: number;
  school: string;
  curriculum: string;
  subjects: Subject[];
  learningGoals: LearningGoal[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  focusAreas: string[];
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface LearningGoal {
  id: string;
  description: string;
  targetDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  subject: string;
}

export interface TestSchedule {
  id: string;
  childId: string;
  testType: 'Topic' | 'Mixed' | 'Mental';
  subjects: string[];
  topics?: string[];
  scheduledDate: string;
  deadline: string;
  recurringPattern?: {
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    interval: number;
    endDate?: string;
  };
  reminderSettings: {
    enabled: boolean;
    reminderTime: number; // hours before deadline
  };
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Missed';
}

export interface PerformanceMetrics {
  childId: string;
  subject: string;
  averageScore: number;
  testsCompleted: number;
  timeSpent: number;
  topicPerformance: Record<string, number>;
  monthlyProgress: Array<{
    month: string;
    score: number;
    improvement: number;
  }>;
  strengthAreas: string[];
  improvementAreas: string[];
}