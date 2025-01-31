import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Book, Settings, Clock } from 'lucide-react';

interface TestConfig {
  subject: string;
  topics: string[];
  difficulty: string;
  duration: number;
  questionCount: number;
}

export function TestCreate() {
  const navigate = useNavigate();
  const { subject } = useParams<{ subject: string }>();
  const [step, setStep] = useState(2); // Start at topic selection since we have subject
  const [config, setConfig] = useState<TestConfig>({
    subject: subject || '',
    topics: [],
    difficulty: 'medium',
    duration: 30,
    questionCount: 10
  });

  useEffect(() => {
    if (!subject) {
      navigate('/test/create');
    }
  }, [subject, navigate]);

  const handleTopicSelect = (topic: string) => {
    setConfig(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleConfigUpdate = (key: keyof TestConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateTest = async () => {
    try {
      // API call to create test will go here
      navigate('/test/preview');
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Create {subject?.charAt(0).toUpperCase() + subject?.slice(1)} Test</h1>
        <p className="mt-2 text-gray-600">Customize your test by selecting topics and settings</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`w-24 h-1 mx-1 rounded ${
              s <= step ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Topic Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subject?.toLowerCase() === 'mathematics' ? (
              ['Algebra', 'Geometry', 'Arithmetic', 'Statistics'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicSelect(topic)}
                  className={`p-4 border rounded-lg transition-all ${
                    config.topics.includes(topic)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'hover:border-indigo-500'
                  }`}
                >
                  {topic}
                </button>
              ))
            ) : (
              ['Grammar', 'Vocabulary', 'Reading', 'Writing'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicSelect(topic)}
                  className={`p-4 border rounded-lg transition-all ${
                    config.topics.includes(topic)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'hover:border-indigo-500'
                  }`}
                >
                  {topic}
                </button>
              ))
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setStep(3)}
              disabled={config.topics.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Test Configuration */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <Settings className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-medium mb-4">Difficulty Level</h3>
              <select
                value={config.difficulty}
                onChange={(e) => handleConfigUpdate('difficulty', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="p-6 border rounded-lg">
              <Clock className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-medium mb-4">Duration (minutes)</h3>
              <input
                type="number"
                value={config.duration}
                onChange={(e) => handleConfigUpdate('duration', parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="5"
                max="180"
              />
            </div>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Number of Questions</h3>
            <input
              type="number"
              value={config.questionCount}
              onChange={(e) => handleConfigUpdate('questionCount', parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              min="5"
              max="50"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={handleCreateTest}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Create Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
