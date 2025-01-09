import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { Achievement } from '../../types/gamification';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = !!achievement.unlockedAt;
  const progress = Math.min(
    100,
    (achievement.requiredCriteria.progress / achievement.requiredCriteria.target) * 100
  );

  return (
    <div className={`
      relative bg-white rounded-lg shadow-sm p-4 border-2 transition-all duration-300
      ${isUnlocked ? 'border-green-200' : 'border-gray-200'}
    `}>
      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-full
          ${isUnlocked ? 'bg-green-100' : 'bg-gray-100'}
        `}>
          {isUnlocked ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <Lock className="h-6 w-6 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
          
          {!isUnlocked && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{achievement.requiredCriteria.progress} / {achievement.requiredCriteria.target}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {isUnlocked && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">+{achievement.points} XP</span>
              <span className="text-xs text-gray-500">
                Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}