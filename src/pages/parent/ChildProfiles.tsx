import React, { useEffect, useState } from 'react';
import { parentApi } from '../../api/parent.api';
import { LinkedChild } from '../../types/parent';
import { ChildCard } from './components/ChildCard';

export const ChildProfiles: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<LinkedChild[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childrenData = await parentApi.getLinkedChildren();
        setChildren(childrenData);
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
        <h1 className="text-2xl font-bold text-gray-900">Child Profiles</h1>
      </div>
      {children.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              selected={false}
              onSelect={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No children are currently linked to your account.</p>
          <p className="text-gray-500 mt-2">Please contact your school administrator to link children to your account.</p>
        </div>
      )}
    </div>
  );
};
