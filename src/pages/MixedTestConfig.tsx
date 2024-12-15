import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { testsApi } from '../services/testService';

export const MixedTestConfig: React.FC = () => {
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [isTimed, setIsTimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const questionOptions = [5, 10, 20, 30, 50];

  const handleStartTest = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const testData = await testsApi.createMixedTest({
        numberOfQuestions,
        isTimed: false  // Default to untimed for now
      });

      console.log('Test data received:', testData);

      // Navigate to test session with the new test execution
      navigate(`/test/${testData.executionId}`, {
        state: { testType: 'mixed' }
      });
    } catch (error) {
      console.error('Failed to start mixed test:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(`Error: ${error.response.data.message || 'Failed to create test'}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Error setting up the test. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white shadow-xl rounded-xl p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Mixed Test Configuration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Configure your random mixed test
          </p>
        </div>

        <div className="space-y-6">
          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <div className="grid grid-cols-5 gap-2">
              {questionOptions.map((num) => (
                <button
                  key={num}
                  onClick={() => setNumberOfQuestions(num)}
                  className={`
                    py-2 rounded-lg transition-colors
                    ${numberOfQuestions === num 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Timed Toggle */}
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm text-gray-700">
              <Clock className="mr-2 h-5 w-5 text-gray-500" />
              Timed Test
            </span>
            <button
              onClick={() => setIsTimed(!isTimed)}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer 
                rounded-full border-2 border-transparent transition-colors 
                duration-200 ease-in-out focus:outline-none focus:ring-2 
                focus:ring-indigo-500 focus:ring-offset-2
                ${isTimed ? 'bg-indigo-600' : 'bg-gray-200'}
              `}
            >
              <span
                aria-hidden="true"
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full 
                  bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${isTimed ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={handleStartTest}
            disabled={isLoading}
            className={`
              w-full flex justify-center py-3 px-4 border border-transparent 
              rounded-lg shadow-sm text-sm font-medium text-white 
              ${isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            `}
          >
            {isLoading ? 'Starting Test...' : 'Start Mixed Test'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MixedTestConfig;
