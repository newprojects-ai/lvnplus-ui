import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Clock, ClipboardList } from 'lucide-react';

export function Mathematics() {
  const tests = [
    {
      id: 'math-short-1',
      title: 'Numbers and Operations',
      type: 'short',
      duration: 15,
      questionsCount: 10,
      description: 'Practice basic arithmetic operations and number properties'
    },
    {
      id: 'math-long-1',
      title: 'Algebra Foundations',
      type: 'long',
      duration: 45,
      questionsCount: 25,
      description: 'Comprehensive test on basic algebraic concepts'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Mathematics</h1>
        <p className="mt-2 text-lg text-gray-600">Master key mathematical concepts through practice tests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div key={test.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-gray-600 mb-4">{test.description}</p>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {test.duration} mins
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ClipboardList className="h-4 w-4 mr-1" />
                {test.questionsCount} questions
              </div>
            </div>
            <Link
              to={`/test/mathematics/${test.id}`}
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Test
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}