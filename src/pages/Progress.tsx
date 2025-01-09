import React from 'react';
import { LineChart, Trophy, Target } from 'lucide-react';
import { LevelProgress } from '../components/Gamification/LevelProgress';
import { StreakTracker } from '../components/Gamification/StreakTracker';
import { AchievementCard } from '../components/Gamification/AchievementCard';

export function Progress() {
  const mockProgress = {
    mathematics: {
      testsCompleted: 5,
      averageScore: 85,
      recentResults: [
        { testId: 'math-short-1', score: 90, totalQuestions: 10, completedAt: new Date('2024-03-10') },
        { testId: 'math-long-1', score: 80, totalQuestions: 25, completedAt: new Date('2024-03-08') }
      ]
    },
    english: {
      testsCompleted: 4,
      averageScore: 78,
      recentResults: [
        { testId: 'eng-short-1', score: 80, totalQuestions: 10, completedAt: new Date('2024-03-09') },
        { testId: 'eng-long-1', score: 75, totalQuestions: 20, completedAt: new Date('2024-03-07') }
      ]
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
        <p className="mt-2 text-lg text-gray-600">Track your learning journey</p>
        
        {/* Gamification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
          <LevelProgress />
          <StreakTracker />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.entries(mockProgress).map(([subject, data]) => (
          <div key={subject} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold capitalize">{subject}</h2>
              <LineChart className="h-6 w-6 text-indigo-600" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">Tests Completed</span>
                </div>
                <p className="mt-2 text-2xl font-bold">{data.testsCompleted}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Average Score</span>
                </div>
                <p className="mt-2 text-2xl font-bold">{data.averageScore}%</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Recent Results</h3>
              <div className="space-y-4">
                {data.recentResults.map((result) => (
                  <div key={result.testId} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{result.testId}</p>
                        <p className="text-sm text-gray-500">
                          {result.completedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {Math.round((result.score / result.totalQuestions) * 100)}%
                        </p>
                        <p className="text-sm text-gray-500">
                          {result.score}/{result.totalQuestions} correct
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}