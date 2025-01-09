import React from 'react';
import { Flame } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';

export function StreakTracker() {
  const { studentProgress } = useGamification();

  if (!studentProgress) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Flame className="h-6 w-6 text-orange-500" />
            {studentProgress.streakDays >= 7 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            )}
          </div>
          <span className="font-semibold text-gray-900">
            {studentProgress.streakDays} Day Streak
          </span>
        </div>
        
        <div className="flex gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`
                w-2 h-8 rounded-full transition-all duration-300
                ${i < (studentProgress.streakDays % 7)
                  ? 'bg-gradient-to-t from-orange-500 to-yellow-400'
                  : 'bg-gray-100'
                }
              `}
            />
          ))}
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        {studentProgress.streakDays === 0
          ? "Start your learning streak today!"
          : `Keep learning daily to maintain your streak!`
        }
      </p>
    </div>
  );
}