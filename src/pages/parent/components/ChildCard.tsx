import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { LinkedChild } from '../../../types/parent';

interface ChildCardProps {
  child: LinkedChild;
  selected: boolean;
  onSelect: () => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child, selected, onSelect }) => {
  const navigate = useNavigate();

  const handleViewProgress = () => {
    navigate(`/parent/performance?childId=${child.id}`);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        selected ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
              {`${child.firstName[0]}${child.lastName[0]}`}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {child.firstName} {child.lastName}
              </h3>
              <p className="text-sm text-gray-500">Grade {child.gradeLevel}</p>
            </div>
          </div>
          <button
            onClick={handleViewProgress}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="View Performance"
          >
            <TrendingUp className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">School: {child.school}</p>
          <p className="text-sm text-gray-500">Curriculum: {child.curriculum}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {child.subjects.map((subject) => (
            <span
              key={subject.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {subject.name} - {subject.proficiencyLevel}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
