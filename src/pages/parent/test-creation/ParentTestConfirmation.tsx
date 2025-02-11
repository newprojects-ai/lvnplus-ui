import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { parentApi } from '../../../api/parent.api';
import { LinkedChild } from '../../../types/parent';

interface TestConfig {
  questionCount: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isTimed: boolean;
}

export function ParentTestConfirmation() {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const location = useLocation();
  const { config, testType } = location.state as { config: TestConfig; testType: string };

  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await parentApi.getLinkedChildren();
        setChildren(response);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load children:', err);
        setError('Failed to load children');
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const handleBack = () => {
    navigate(`/parent/test-creation/${subjectId}/practice/${testType}`);
  };

  const handleChildSelect = (childId: string) => {
    setSelectedChildren(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const handleSaveForLater = async () => {
    try {
      await parentApi.createTestPlan({
        subjectId,
        typeId: testType,
        config,
        assignedTo: []
      });
      navigate('/parent/test-plans', { 
        state: { message: 'Test plan saved successfully' }
      });
    } catch (err) {
      console.error('Failed to save test plan:', err);
      setError('Failed to save test plan');
    }
  };

  const handleAssignToChildren = async () => {
    if (selectedChildren.length === 0) {
      setError('Please select at least one child');
      return;
    }

    try {
      await parentApi.createTestPlan({
        subjectId,
        typeId: testType,
        config,
        assignedTo: selectedChildren
      });
      navigate('/parent/test-plans', { 
        state: { message: 'Test plan assigned successfully' }
      });
    } catch (err) {
      console.error('Failed to assign test plan:', err);
      setError('Failed to assign test plan');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Configuration
      </button>

      <h1 className="text-2xl font-bold mb-6">Review Test Plan</h1>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Test Configuration</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Questions</dt>
                <dd className="mt-1 text-sm text-gray-900">{config.questionCount}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Difficulty</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{config.difficulty}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Time Limit</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {config.isTimed ? `${config.timeLimit} minutes` : 'No time limit'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Test Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">
                  {testType.replace(/-/g, ' ')}
                </dd>
              </div>
            </dl>
          </div>

          {!isLoading && children.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Assign to Children</h2>
              <div className="space-y-2">
                {children.map((child) => (
                  <label
                    key={child.id}
                    className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedChildren.includes(child.id)}
                      onChange={() => handleChildSelect(child.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-900">
                      {child.firstName} {child.lastName}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleSaveForLater}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save for Later
            </button>
            <button
              onClick={handleAssignToChildren}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign to Children
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
