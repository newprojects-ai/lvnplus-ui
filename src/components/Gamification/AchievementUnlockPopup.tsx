import React, { useEffect, useState } from 'react';
import { Medal } from 'lucide-react';
import { Achievement } from '../../types/gamification';

interface AchievementUnlockPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementUnlockPopup({ achievement, onClose }: AchievementUnlockPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`
      fixed bottom-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500
      text-white p-4 rounded-lg shadow-lg transform transition-all duration-300
      max-w-sm z-50
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
    `}>
      <div className="flex items-start gap-4">
        <div className="bg-white bg-opacity-20 rounded-full p-2">
          <Medal className="h-6 w-6" />
        </div>
        <div>
          <div className="font-bold text-lg">Achievement Unlocked!</div>
          <div className="font-medium">{achievement.title}</div>
          <div className="text-sm opacity-90 mt-1">{achievement.description}</div>
          <div className="mt-2 text-sm font-medium">+{achievement.points} XP</div>
        </div>
      </div>
    </div>
  );
}