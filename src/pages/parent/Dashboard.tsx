import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parentApi } from '../../api/parent.api';
import { LinkedChild, TestPlan, PerformanceMetrics } from '../../types/parent';
import { ChildCard } from './components/ChildCard';
import { TestPlanCard } from './components/TestPlanCard';
import { PerformanceChart } from './components/PerformanceChart';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childrenData, testPlansData] = await Promise.all([
          parentApi.getLinkedChildren(),
          parentApi.getTestPlans(),
        ]);
        setChildren(childrenData);
        setTestPlans(testPlansData);
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Children Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
            <button
              onClick={() => navigate('/parent/child/add')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Child
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                selected={child.id === selectedChild}
                onSelect={() => setSelectedChild(child.id)}
              />
            ))}
          </div>
        </div>

        {/* Test Plans Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Test Plans</h2>
            <button
              onClick={() => navigate('/parent/test-plan/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Test Plan
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testPlans
              .filter((plan) => !selectedChild || plan.studentId === selectedChild)
              .map((plan) => (
                <TestPlanCard key={plan.id} plan={plan} />
              ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Performance Overview
            </h2>
            <div className="h-[300px]">
              <PerformanceChart childId={selectedChild || ''} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
