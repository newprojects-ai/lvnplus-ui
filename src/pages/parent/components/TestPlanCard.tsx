import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, BookOpen, Edit2 } from 'lucide-react';
import { TestPlan } from '../../../types/parent';

interface TestPlanCardProps {
  plan: TestPlan;
}

export const TestPlanCard: React.FC<TestPlanCardProps> = ({ plan }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'not started':
        return 'bg-gray-100 text-gray-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                plan.status
              )}`}
            >
              {plan.status}
            </span>
          </div>
          <button
            onClick={() => navigate(`/parent/test-plan/${plan.id}/edit`)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Edit2 className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Due: {new Date(plan.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>{plan.timeLimit} minutes</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{plan.plannedByType}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate(`/parent/test-plan/${plan.id}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
