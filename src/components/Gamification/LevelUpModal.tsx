import React from 'react';
import { Trophy, Star, X } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  rewards?: string[];
  onClose: () => void;
}

export function LevelUpModal({ level, rewards = [], onClose }: LevelUpModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 relative overflow-hidden">
        {/* Confetti Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8 relative">
          {/* Level Up Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Trophy className="h-16 w-16 text-yellow-500" />
              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                {level}
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-4">
            Level Up!
          </h2>
          
          <p className="text-gray-600 text-center mb-6">
            Congratulations! You've reached Level {level}
          </p>

          {rewards.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                New Rewards Unlocked
              </h3>
              <ul className="space-y-2">
                {rewards.map((reward, index) => (
                  <li 
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    {reward}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}