import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parentApi } from '../../api/parent.api';
import { TestPlan } from '../../types/parent';
import { TestPlanCard } from './components/TestPlanCard';

export const TestScheduler: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testPlansData = await parentApi.getTestPlans();
        setTestPlans(testPlansData);
      } catch (error) {
        console.error('Error fetching test plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Test Scheduler</h1>
        <button
          onClick={() => navigate('/parent/scheduler/create')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Schedule Test
        </button>
      </div>
      {testPlans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testPlans.map((plan) => (
            <TestPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No test plans have been created yet.</p>
          <p className="text-gray-500 mt-2">Click "Schedule Test" to create your first test plan.</p>
        </div>
      )}
    </div>
  );
};
