import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface XPPopupProps {
  xp: number;
  message?: string;
  onClose: () => void;
}

export function XPPopup({ xp, message, onClose }: XPPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`
      fixed top-16 right-4 bg-gradient-to-r from-indigo-500 to-purple-600
      text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300
      flex items-center gap-3 z-50
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <Trophy className="h-5 w-5 text-yellow-300" />
      <div>
        <div className="font-bold">+{xp} XP</div>
        {message && <div className="text-sm opacity-90">{message}</div>}
      </div>
    </div>
  );
}