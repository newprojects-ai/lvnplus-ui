import React, { useEffect, useState } from 'react';
import { parentApi } from '../../api/parent.api';
import { LinkedChild } from '../../types/parent';
import { PerformanceChart } from './components/PerformanceChart';

export const Performance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childrenData = await parentApi.getLinkedChildren();
        setChildren(childrenData);
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0].id);
        }
      } catch (error) {
        console.error('Error fetching children:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Performance Overview</h1>
        {children.length > 0 && (
          <select
            value={selectedChild || ''}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedChild ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="h-[400px]">
              <PerformanceChart childId={selectedChild} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          No children found. Add a child to view performance metrics.
        </div>
      )}
    </div>
  );
};
