import React, { useState } from 'react';
import { ArrowLeft, Clock, ListChecks, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { testsApi } from '../api/tests';

import { Topic, TestType } from '../types/test';

interface TestConfirmationProps {
  config: {
    questionCount: string;
    isTimed: boolean;
  };
  topics: Topic[];
  selectedSubtopics: string[];
  onBack: () => void;
}

export function TestConfirmation({ config, topics, selectedSubtopics, onBack }: TestConfirmationProps) {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTopics = topics.filter(topic => 
    topic.subtopics.some(st => selectedSubtopics.includes(st.id))
  );

  const handleStartTest = async () => {
    // Extremely comprehensive logging
    console.group('Test Plan Creation Process');
    console.log('Current User Object (Full):', JSON.stringify(user, null, 2));
    console.log('Auth Loading State:', isAuthLoading);

    // Check if authentication is still loading
    if (isAuthLoading) {
      console.warn('Authentication is still loading');
      setError('Please wait while authentication completes');
      console.groupEnd();
      return;
    }

    // Enhanced user and studentId validation
    if (!user) {
      console.error('No user logged in');
      console.groupEnd();
      setError('You must be logged in to start a test');
      return;
    }

    // Robust studentId validation
    const studentId = user.id ? Number(user.id) : null;
    console.log('Extracted Student ID:', studentId, 'User ID Type:', typeof user.id);

    if (!studentId || isNaN(studentId)) {
      console.error('Invalid Student ID', { 
        userId: user.id, 
        studentId: studentId,
        userObject: user
      });
      console.groupEnd();
      setError('Unable to identify student. Please log out and log in again.');
      return;
    }

    // Check if user has student role with detailed logging
    const isStudent = user.roles.includes('Student');
    console.log('Is Student Role Present:', isStudent);
    if (!isStudent) {
      console.error('User does not have student role');
      console.log('User Roles:', user.roles);
      console.groupEnd();
      setError('Only students can start a test');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Prepare question counts object with logging
      const questionCounts: Record<string, number> = {};
      selectedTopics.forEach(topic => {
        questionCounts[topic.id] = parseInt(config.questionCount);
        console.log(`Question Count for Topic ${topic.id}:`, questionCounts[topic.id]);
      });

      // Detailed payload logging with forced number conversion
      const payload = {
        templateId: null,
        boardId: 1,
        testType: 'TOPIC',
        timingType: config.isTimed ? 'TIMED' : 'UNTIMED',
        timeLimit: config.isTimed ? 1800 : 0,
        studentId: studentId, // Use validated studentId
        plannedBy: studentId, // Use same validated studentId
        configuration: {
          topics: selectedTopics.map(t => Number(t.id)),
          subtopics: selectedSubtopics.map(st => Number(st)),
          questionCounts: questionCounts
        }
      };
      console.log('Detailed Test Plan Payload:', JSON.stringify(payload, null, 2));

      // Create test plan with extensive logging
      console.log('Attempting to create test plan...');
      const testPlan = await testsApi.plans.create(payload);
      console.log('Test Plan Created Successfully:', JSON.stringify(testPlan, null, 2));

      // Create test execution with logging
      console.log('Attempting to create test execution...');
      const execution = await testsApi.executions.create(testPlan.testPlanId);
      console.log('Test Execution Created Successfully:', JSON.stringify(execution, null, 2));
      
      // Navigate to test execution page
      console.log('Navigating to test execution page...');
      navigate(`/test/${execution.executionId}`);
    } catch (err: any) {
      console.error('Failed to start test - Full Error:', err);
      
      // More detailed error handling
      if (err.response) {
        console.error('Error Response Data:', err.response.data);
        console.error('Error Response Status:', err.response.status);
        console.error('Error Response Headers:', err.response.headers);
        
        // Set a more specific error message
        setError(err.response.data?.message || 'Failed to start the test. Please try again.');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Test Configuration
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Test Settings</h2>

      <div className="space-y-6">
         <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
           <BookOpen className="h-6 w-6 text-indigo-500 mt-1" />
           <div className="flex-1">
             <h3 className="font-medium text-gray-900">Selected Topics</h3>
             {selectedTopics.length > 0 ? (
               <div className="mt-2 space-y-3">
                 {selectedTopics.map(topic => {
                   const topicSubtopics = topic.subtopics.filter(st => 
                     selectedSubtopics.includes(st.id)
                   );
                   const allSubtopicsSelected = topicSubtopics.length === topic.subtopics.length;

                   return (
                     <div key={topic.id} className="border-l-2 border-indigo-200 pl-3">
                       <div className="font-medium text-gray-800 flex items-center gap-2">
                         {topic.name}
                         {!allSubtopicsSelected && (
                           <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                             Partial
                           </span>
                         )}
                       </div>
                       <div className="mt-1 text-sm text-gray-600">
                         {topicSubtopics.map(st => st.name).join(', ')}
                       </div>
                     </div>
                   );
                 })}
               </div>
             ) : (
               <p className="mt-2 text-gray-500">No topics selected</p>
             )}
           </div>
         </div>

        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <ListChecks className="h-6 w-6 text-indigo-500 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Number of Questions</h3>
            <p className="text-gray-600">{config.questionCount} questions</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <Clock className="h-6 w-6 text-indigo-500 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Test Mode</h3>
            <p className="text-gray-600">{config.isTimed ? 'Timed' : 'Un-timed'}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleStartTest}
          disabled={isLoading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="animate-pulse">Starting Test...</span>
            </>
          ) : (
            <>
              Start Test
              <Play className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}