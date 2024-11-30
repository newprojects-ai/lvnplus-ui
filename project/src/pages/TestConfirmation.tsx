import React from 'react';
import { ArrowLeft, Clock, ListChecks, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Topic {
  id: string;
  name: string;
  subtopics: Array<{
    id: string;
    name: string;
  }>;
}

const topics: Topic[] = [
  {
    id: 'decimals',
    name: 'Decimals',
    subtopics: [
      { id: 'decimals-add', name: 'Addition' },
      { id: 'decimals-sub', name: 'Subtraction' },
      { id: 'decimals-mul', name: 'Multiplication' },
      { id: 'decimals-div', name: 'Division' }
    ]
  },
  {
    id: 'fractions',
    name: 'Fractions',
    subtopics: [
      { id: 'fractions-add', name: 'Addition' },
      { id: 'fractions-sub', name: 'Subtraction' },
      { id: 'fractions-mul', name: 'Multiplication' },
      { id: 'fractions-div', name: 'Division' }
    ]
  },
  {
    id: 'percentages',
    name: 'Percentages',
    subtopics: [
      { id: 'percentages-increase', name: 'Increase' },
      { id: 'percentages-decrease', name: 'Decrease' }
    ]
  },
  {
    id: 'factors',
    name: 'Factors',
    subtopics: [
      { id: 'factors-lcm', name: 'LCM' },
      { id: 'factors-hcf', name: 'HCF' }
    ]
  }
];

interface TestConfirmationProps {
  config: {
    questionCount: string;
    isTimed: boolean;
  };
  selectedTopics: string[];
  selectedSubtopics: string[];
  onBack: () => void;
}

export function TestConfirmation({ config, selectedTopics, selectedSubtopics, onBack }: TestConfirmationProps) {
  const navigate = useNavigate();

  const getSelectedSubtopicsForTopic = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return [];
    
    return topic.subtopics.filter(subtopic => 
      selectedSubtopics.includes(subtopic.id)
    );
  };

  const handleStartTest = () => {
    navigate('/test/mathematics/custom-test');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Test Configuration
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Test Settings</h2>

      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <BookOpen className="h-6 w-6 text-indigo-500 mt-1" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Selected Topics</h3>
            <div className="mt-2 space-y-3">
              {topics.filter(topic => 
                topic.subtopics.some(subtopic => 
                  selectedSubtopics.includes(subtopic.id)
                )
              ).map(topic => {
                const selectedSubtopicsForTopic = getSelectedSubtopicsForTopic(topic.id);
                const allSubtopicsSelected = selectedSubtopicsForTopic.length === topic.subtopics.length;
                
                return (
                  <div key={topic.id} className="border-l-2 border-indigo-200 pl-3">
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                      {topic.name}
                      {!allSubtopicsSelected && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Partial
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {selectedSubtopicsForTopic.map(st => st.name).join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <ListChecks className="h-6 w-6 text-indigo-500 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Number of Questions</h3>
            <p className="text-gray-600">{config.questionCount} questions</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <Clock className="h-6 w-6 text-indigo-500 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Test Mode</h3>
            <p className="text-gray-600">{config.isTimed ? 'Timed' : 'Un-timed'}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleStartTest}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          Start Test
          <Play className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}