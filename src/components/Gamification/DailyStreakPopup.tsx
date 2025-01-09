import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

interface DailyStreakPopupProps {
  days: number;
  onClose: () => void;
}

export function DailyStreakPopup({ days, onClose }: DailyStreakPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`
      fixed bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-500
      text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300
      flex items-center gap-3 z-50
      ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
    `}>
      <div className="relative">
        <Flame className="h-6 w-6 text-yellow-300" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping" />
      </div>
      <div>
        <div className="font-bold">{days} Day Streak!</div>
        <div className="text-sm opacity-90">Keep up the great work!</div>
      </div>
    </div>
  );
}