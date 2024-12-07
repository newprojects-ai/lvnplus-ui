import React from 'react';
import { ArrowLeft, Clock, ListChecks, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Topic } from '../types/test';

interface TestConfirmationProps {
  config: {
    questionCount: string;
    isTimed: boolean;
  };
  topics: Topic[];
  selectedSubtopics: string[];
  onBack: () => void;
}

export function TestConfirmation({ config, topics, selectedSubtopics, onBack }: TestConfirmationProps) {
  const navigate = useNavigate();

  const selectedTopics = topics.filter(topic => 
    topic.subtopics.some(st => selectedSubtopics.includes(st.id))
  );

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
             {selectedTopics.length > 0 ? (
               <div className="mt-2 space-y-3">
                 {selectedTopics.map(topic => {
                   const topicSubtopics = topic.subtopics.filter(st => 
                     selectedSubtopics.includes(st.id)
                   );
                   const allSubtopicsSelected = topicSubtopics.length === topic.subtopics.length;

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
                         {topicSubtopics.map(st => st.name).join(', ')}
                       </div>
                     </div>
                   );
                 })}
               </div>
             ) : (
               <p className="mt-2 text-gray-500">No topics selected</p>
             )}
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