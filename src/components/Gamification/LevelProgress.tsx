import React from 'react';
import { Trophy } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';

export function LevelProgress() {
  const { studentProgress } = useGamification();

  if (!studentProgress) return null;

  const progressPercentage = (studentProgress.currentXP / studentProgress.nextLevelXP) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold text-gray-900">Level {studentProgress.level}</span>
        </div>
        <span className="text-sm text-gray-600">
          {studentProgress.currentXP} / {studentProgress.nextLevelXP} XP
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        {Math.round(studentProgress.nextLevelXP - studentProgress.currentXP)} XP until next level
      </div>
    </div>
  );
}