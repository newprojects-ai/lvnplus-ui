import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parentApi } from '../../../api/parent.api';
import { TestType } from '../../../types/parent';

export const CreateTestPlan: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [testType, setTestType] = useState<TestType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    timeLimit: '60',
    questionSets: [] as string[],
    questionsPerSet: '10'
  });

  const testTypes = [
    {
      id: 'PRACTICE',
      title: 'Practice Test',
      description: 'Create a practice test for specific subjects and topics',
      icon: '📝'
    },
    {
      id: 'MOCK',
      title: 'Mock Test',
      description: 'Create a full-length mock test simulating real exam conditions',
      icon: '📚'
    },
    {
      id: 'CUSTOM',
      title: 'Custom Test',
      description: 'Create a customized test with specific requirements',
      icon: '⚡'
    }
  ];

  const handleTestTypeSelect = (type: TestType) => {
    setTestType(type);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testType) return;

    try {
      await parentApi.createTestPlan({
        ...formData,
        type: testType,
        questionsPerSet: parseInt(formData.questionsPerSet),
        timeLimit: parseInt(formData.timeLimit)
      });
      navigate('/parent/test-plans');
    } catch (error) {
      console.error('Error creating test plan:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Test Plan</h1>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Select Test Type</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {testTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTestTypeSelect(type.id as TestType)}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center space-y-3 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <div className="text-4xl">{type.icon}</div>
                <div className="flex-1">
                  <h3 className="text-gray-900 text-sm font-medium">{type.title}</h3>
                  <p className="text-gray-500 text-sm">{type.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select a subject</option>
              {/* Subject options will be populated from API */}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Questions Per Set</label>
              <input
                type="number"
                min="1"
                value={formData.questionsPerSet}
                onChange={(e) => setFormData({ ...formData, questionsPerSet: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time Limit (minutes)</label>
              <input
                type="number"
                min="1"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Test Plan
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
