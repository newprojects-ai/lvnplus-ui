import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ListChecks, Play, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { testsApi } from '../api/tests';
import { parentApi } from '../api/parent.api';
import { distributeQuestions } from '../utils/questionDistribution';

import { Topic, TestType } from '../types/test';
import { LinkedChild } from '../types/parent';

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
  const [linkedChildren, setLinkedChildren] = useState<LinkedChild[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  useEffect(() => {
    const fetchChildren = async () => {
      if (user?.role === 'PARENT') {
        try {
          const children = await parentApi.getLinkedChildren();
          setLinkedChildren(children);
        } catch (error) {
          console.error('Error fetching linked children:', error);
          setError('Failed to load linked children');
        }
      }
    };
    fetchChildren();
  }, [user]);

  const selectedTopics = topics.filter(topic => 
    topic.subtopics.some(st => selectedSubtopics.includes(st.id))
  );

  const handleStartTest = async () => {
    console.group('Test Plan Creation Process');
    console.log('Current User Object (Full):', JSON.stringify(user, null, 2));
    console.log('Auth Loading State:', isAuthLoading);

    if (isAuthLoading) {
      console.warn('Authentication is still loading');
      setError('Please wait while authentication completes');
      console.groupEnd();
      return;
    }

    if (!user) {
      console.error('No user logged in');
      console.groupEnd();
      setError('You must be logged in to start a test');
      return;
    }

    if (user.role === 'PARENT' && selectedChildren.length === 0) {
      setError('Please select at least one child');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const questionDistribution = distributeQuestions(
        parseInt(config.questionCount),
        selectedTopics,
        selectedSubtopics
      );

      if (user.role === 'PARENT') {
        // Create test plan for each selected child
        await Promise.all(
          selectedChildren.map(async (childId) => {
            const testPlan = await testsApi.createTestPlan({
              studentId: childId,
              title: `${selectedTopics[0]?.name || 'Practice'} Test`,
              description: `Test covering ${selectedTopics.map(t => t.name).join(', ')}`,
              configuration: {
                questionDistribution,
                isTimed: config.isTimed,
                timeLimit: config.isTimed ? 30 : undefined
              }
            });
            console.log(`Created test plan for child ${childId}:`, testPlan);
          })
        );
        navigate('/parent/test/success');
      } else {
        const studentId = user.id ? Number(user.id) : null;
        if (!studentId) {
          throw new Error('Invalid student ID');
        }

        const testPlan = await testsApi.createTestPlan({
          studentId,
          title: `${selectedTopics[0]?.name || 'Practice'} Test`,
          description: `Test covering ${selectedTopics.map(t => t.name).join(', ')}`,
          configuration: {
            questionDistribution,
            isTimed: config.isTimed,
            timeLimit: config.isTimed ? 30 : undefined
          }
        });

        console.log('Created Test Plan:', testPlan);
        navigate('/test/session', { state: { testPlanId: testPlan.id } });
      }
    } catch (error) {
      console.error('Error creating test plan:', error);
      setError('Failed to create test plan');
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

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Summary</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <BookOpen className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Selected Topics</h3>
                <ul className="mt-1 text-sm text-gray-500">
                  {selectedTopics.map(topic => (
                    <li key={topic.id}>{topic.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center">
              <ListChecks className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Number of Questions</h3>
                <p className="mt-1 text-sm text-gray-500">{config.questionCount} questions</p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Time Limit</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {config.isTimed ? '30 minutes' : 'No time limit'}
                </p>
              </div>
            </div>

            {user?.role === 'PARENT' && (
              <div className="flex items-start">
                <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Assign To</h3>
                  <div className="mt-2 space-y-2">
                    {linkedChildren.map((child) => (
                      <label key={child.id} className="flex items-center">
                        <input
                          type="checkbox"
                          value={child.id}
                          checked={selectedChildren.includes(child.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChildren([...selectedChildren, child.id]);
                            } else {
                              setSelectedChildren(selectedChildren.filter(id => id !== child.id));
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {child.firstName} {child.lastName}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleStartTest}
            disabled={isLoading || (user?.role === 'PARENT' && selectedChildren.length === 0)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              'Creating Test Plan...'
            ) : user?.role === 'PARENT' ? (
              'Create Test Plans'
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Test
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}