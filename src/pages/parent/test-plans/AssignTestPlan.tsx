import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parentApi } from '../../../api/parent.api';
import { TestPlan, LinkedChild } from '../../../types/parent';

export const AssignTestPlan: React.FC = () => {
  const navigate = useNavigate();
  const { planId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testPlan, setTestPlan] = useState<TestPlan | null>(null);
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planData, childrenData] = await Promise.all([
          parentApi.getTestPlan(planId!),
          parentApi.getLinkedChildren()
        ]);
        setTestPlan(planData);
        setChildren(childrenData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [planId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPlan || selectedChildren.length === 0) return;

    setSubmitting(true);
    try {
      await Promise.all(
        selectedChildren.map(childId =>
          parentApi.assignTestPlan(testPlan.id, childId)
        )
      );
      navigate('/parent/test-plans');
    } catch (error) {
      console.error('Error assigning test plan:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!testPlan) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Test plan not found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assign Test Plan</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{testPlan.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{testPlan.description}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Subject</dt>
              <dd className="mt-1 text-sm text-gray-900">{testPlan.subject.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Time Limit</dt>
              <dd className="mt-1 text-sm text-gray-900">{testPlan.timeLimit} minutes</dd>
            </div>
          </dl>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Children to Assign
          </label>
          <div className="space-y-2">
            {children.map((child) => (
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

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/parent/test-plans')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || selectedChildren.length === 0}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Assigning...' : 'Assign Test Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};
