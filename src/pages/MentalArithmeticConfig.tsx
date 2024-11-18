import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, Brain } from 'lucide-react';

export function MentalArithmeticConfig() {
  const navigate = useNavigate();
  const [timeLimit, setTimeLimit] = useState('2');

  // Generate time options from 2 to 20 minutes in 2-minute intervals
  const timeOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 2);

  const handleStartTest = () => {
    navigate(`/test/mathematics/mental-arithmetic-${timeLimit}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Mental Arithmetic Test</h1>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-8">
          <p className="text-gray-700">
            Test your mental calculation speed and accuracy. Questions will be presented one at a time,
            and you'll need to answer them quickly without using a calculator.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Limit
            </label>
            <div className="relative">
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none"
              >
                {timeOptions.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} minutes
                  </option>
                ))}
              </select>
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Choose how long you want to practice mental arithmetic
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleStartTest}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 transition-colors"
          >
            Start Test
            <Play className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}