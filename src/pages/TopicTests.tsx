import React, { useState } from 'react';
import { TopicSelector } from '../components/Test/TopicSelector';
import { TestConfig } from './TestConfig';

export function TopicTests() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [showConfig, setShowConfig] = useState(false);

  const handleSelectionChange = (topics: string[], subtopics: string[]) => {
    setSelectedTopics(topics);
    setSelectedSubtopics(subtopics);
  };

  if (showConfig) {
    return (
      <TestConfig
        selectedTopics={selectedTopics}
        selectedSubtopics={selectedSubtopics}
        onBack={() => setShowConfig(false)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Topic-wise Practice</h1>
        <p className="mt-2 text-lg text-gray-600">Select topics and subtopics to practice</p>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowConfig(true)}
          disabled={selectedSubtopics.length === 0}
          className={`px-4 py-2 rounded-md text-white ${
            selectedSubtopics.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Next
        </button>
      </div>

      <TopicSelector onSelectionChange={handleSelectionChange} />
    </div>
  );
}