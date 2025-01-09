import React, { createContext, useContext, useState, useEffect } from 'react';
import { Achievement, Reward, StudentProgress } from '../types/gamification';
import { useAuth } from './AuthContext';

interface GamificationContextType {
  studentProgress: StudentProgress | null;
  achievements: Achievement[];
  rewards: Reward[];
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  checkAchievements: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    if (user) {
      // Load student progress from API
      // This is where you'd fetch the actual data
      const mockProgress: StudentProgress = {
        userId: user.id.toString(),
        level: 1,
        currentXP: 0,
        nextLevelXP: 1000,
        achievements: [],
        rewards: [],
        streakDays: 0,
        lastActivityDate: new Date().toISOString(),
        totalPoints: 0,
        subjectMastery: {}
      };
      setStudentProgress(mockProgress);
    }
  }, [user]);

  const addXP = (amount: number) => {
    if (!studentProgress) return;

    setStudentProgress(prev => {
      if (!prev) return prev;

      const newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let nextXP = prev.nextLevelXP;

      // Level up if XP threshold reached
      while (newXP >= nextXP) {
        newLevel++;
        newXP -= nextXP;
        nextXP = Math.round(nextXP * 1.5); // Increase XP required for next level
      }

      return {
        ...prev,
        level: newLevel,
        currentXP: newXP,
        nextLevelXP: nextXP
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId
          ? { ...achievement, unlockedAt: new Date().toISOString() }
          : achievement
      )
    );
  };

  const updateStreak = () => {
    if (!studentProgress) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = new Date(studentProgress.lastActivityDate).toISOString().split('T')[0];

    if (today === lastActivity) return;

    setStudentProgress(prev => {
      if (!prev) return prev;

      const isConsecutiveDay = 
        new Date(today).getTime() - new Date(lastActivity).getTime() === 86400000;

      return {
        ...prev,
        streakDays: isConsecutiveDay ? prev.streakDays + 1 : 1,
        lastActivityDate: today
      };
    });
  };

  const checkAchievements = () => {
    if (!studentProgress) return;

    // Check for unlockable achievements based on progress
    achievements.forEach(achievement => {
      if (achievement.unlockedAt) return;

      let shouldUnlock = false;
      const criteria = achievement.requiredCriteria;

      switch (criteria.type) {
        case 'TestCount':
          // Check test completion count
          break;
        case 'Score':
          // Check score achievements
          break;
        case 'Streak':
          shouldUnlock = studentProgress.streakDays >= criteria.target;
          break;
        case 'TopicMastery':
          // Check topic mastery levels
          break;
      }

      if (shouldUnlock) {
        unlockAchievement(achievement.id);
        addXP(achievement.points);
      }
    });
  };

  const value = {
    studentProgress,
    achievements,
    rewards,
    addXP,
    unlockAchievement,
    updateStreak,
    checkAchievements
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};