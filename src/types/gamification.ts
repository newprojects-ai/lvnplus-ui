export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Practice' | 'Performance' | 'Consistency' | 'Mastery';
  requiredCriteria: AchievementCriteria;
  points: number;
  unlockedAt?: string;
}

export interface AchievementCriteria {
  type: 'TestCount' | 'Score' | 'Streak' | 'TopicMastery';
  target: number;
  progress: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'Avatar' | 'Theme' | 'Badge' | 'Certificate';
  unlocked: boolean;
}

export interface StudentProgress {
  userId: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  achievements: Achievement[];
  rewards: Reward[];
  streakDays: number;
  lastActivityDate: string;
  totalPoints: number;
  subjectMastery: Record<string, number>;
}