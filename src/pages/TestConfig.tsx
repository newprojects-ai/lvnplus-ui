import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { TestConfirmation } from './TestConfirmation';
import { Topic } from '../types/test';

interface TestConfigProps {
  topics: Topic[];
  selectedSubtopics: string[];
  onBack: () => void;
}

export function TestConfig({ topics, selectedSubtopics, onBack }: TestConfigProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [config, setConfig] = useState({
    questionCount: '10',
    isTimed: true
  });

  const questionOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 5);

  if (showConfirmation) {
    return (
      <TestConfirmation 
        topics={topics}
        config={config}
        selectedSubtopics={selectedSubtopics}
        onBack={() => setShowConfirmation(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Topic Selection
        </button>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <select
            value={config.questionCount}
            onChange={(e) => setConfig({ ...config, questionCount: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {questionOptions.map((count) => (
              <option key={count} value={count}>
                {count} questions
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Test Mode
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setConfig({ ...config, isTimed: true })}
              className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                config.isTimed
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Clock className={`h-6 w-6 mx-auto mb-2 ${
                config.isTimed ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <div className="font-medium text-gray-900">Timed</div>
              <p className="text-sm text-gray-500 mt-1">
                Complete within time limit
              </p>
            </div>

            <div
              onClick={() => setConfig({ ...config, isTimed: false })}
              className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                !config.isTimed
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CheckCircle2 className={`h-6 w-6 mx-auto mb-2 ${
                !config.isTimed ? 'text-indigo-500' : 'text-gray-400'
              }`} />
              <div className="font-medium text-gray-900">Un-timed</div>
              <p className="text-sm text-gray-500 mt-1">
                Take your time to answer
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowConfirmation(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          Review Selections
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}