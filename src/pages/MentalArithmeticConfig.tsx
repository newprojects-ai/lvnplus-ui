import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, Brain } from 'lucide-react';
import { testsApi } from '../services/testService';
import { useAuth } from '../contexts/AuthContext';

export function MentalArithmeticConfig() {
  const navigate = useNavigate();
  const [timeLimit, setTimeLimit] = useState('2');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Generate time options from 2 to 20 minutes in 2-minute intervals
  const timeOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 2);

  const handleStartTest = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      // Calculate number of questions based on time limit (2 questions per minute)
      const numberOfQuestions = parseInt(timeLimit) * 2;
      
      const testData = await testsApi.createMentalArithmeticTest({
        numberOfQuestions,
        isTimed: true
      });
      
      // Navigate to test session with the new test execution
      navigate(`/test/${testData.executionId}`, {
        state: { testType: 'mental' }
      });
    } catch (error) {
      console.error('Error starting mental arithmetic test:', error);
      
      // More detailed error handling
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to create test'}`);
      } else if (error.request) {
        alert('No response received from server. Please check your connection.');
      } else {
        alert('Error setting up the test. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
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

          <button
            onClick={handleStartTest}
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting Test...
              </>
            ) : (
              <>
                Start Test
                <Play className="ml-2 -mr-1 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}