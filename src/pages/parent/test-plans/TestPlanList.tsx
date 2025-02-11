import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { parentApi } from '../../../api/parent.api';
import { TestPlan } from '../../../types/parent';

export const TestPlanList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);

  useEffect(() => {
    loadTestPlans();
  }, []);

  const loadTestPlans = async () => {
    try {
      const plans = await parentApi.getTestPlans();
      setTestPlans(plans);
    } catch (error) {
      console.error('Error loading test plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this test plan?')) return;
    try {
      await parentApi.deleteTestPlan(planId);
      loadTestPlans();
    } catch (error) {
      console.error('Error deleting test plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Plans</h1>
        <button
          onClick={() => navigate('/parent/test-plans/create')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Test Plan
        </button>
      </div>

      {testPlans.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No test plans</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new test plan.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/parent/test-plans/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Test Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {testPlans.map((plan) => (
              <li key={plan.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{plan.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="truncate">Subject: {plan.subject.name}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex space-x-4">
                      <button
                        onClick={() => navigate(`/parent/test-plans/${plan.id}/assign`)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Assign
                      </button>
                      <button
                        onClick={() => navigate(`/parent/test-plans/${plan.id}/edit`)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
