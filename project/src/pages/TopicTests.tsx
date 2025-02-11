import React, { useState, useEffect } from 'react';
import { Check, Plus, MinusCircle } from 'lucide-react';
import { TestConfig } from './TestConfig';
import { topicsApi } from '../api/topics';
import { Topic, Subtopic } from '../types/topics';
import { useParams } from 'react-router-dom';

export function TopicTests() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<number | null>(null);
  const [selectedSubtopics, setSelectedSubtopics] = useState<Set<number>>(new Set());
  const [showConfig, setShowConfig] = useState(false);
  const { subjectId } = useParams<{ subjectId: string }>();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (!subjectId || isNaN(parseInt(subjectId))) {
          setError('Invalid subject ID');
          return;
        }
        const data = await topicsApi.getTopics(parseInt(subjectId));
        setTopics(data);
      } catch (err) {
        setError('Failed to load topics. Please try again later.');
        console.error('Error fetching topics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (subjectId && !isNaN(parseInt(subjectId))) {
      fetchTopics();
    }
  }, [subjectId]);

  const handleTopicClick = (topicId: number) => {
    setActiveTopic(activeTopic === topicId ? null : topicId);
  };

  const handleTopicSelect = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const newSelectedSubtopics = new Set(selectedSubtopics);
    const allSubtopicsSelected = topic.subtopics.every(
      st => selectedSubtopics.has(st.id)
    );

    if (allSubtopicsSelected) {
      // Deselect all subtopics of this topic
      topic.subtopics.forEach(st => newSelectedSubtopics.delete(st.id));
    } else {
      // Select all subtopics of this topic
      topic.subtopics.forEach(st => newSelectedSubtopics.add(st.id));
    }

    setSelectedSubtopics(newSelectedSubtopics);
  };

  const handleSubtopicSelect = (subtopicId: number) => {
    const newSelectedSubtopics = new Set(selectedSubtopics);
    if (selectedSubtopics.has(subtopicId)) {
      newSelectedSubtopics.delete(subtopicId);
    } else {
      newSelectedSubtopics.add(subtopicId);
    }
    setSelectedSubtopics(newSelectedSubtopics);
  };

  const getTopicSelectionState = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return 'none';

    const selectedSubtopicCount = topic.subtopics.filter(
      subtopic => selectedSubtopics.has(subtopic.id)
    ).length;

    if (selectedSubtopicCount === 0) return 'none';
    if (selectedSubtopicCount === topic.subtopics.length) return 'full';
    return 'partial';
  };

  if (showConfig) {
    return (
      <TestConfig
        selectedTopics={topics.filter(topic => 
          topic.subtopics.some(st => selectedSubtopics.has(st.id))
        ).map(t => t.id)}
        selectedSubtopics={Array.from(selectedSubtopics)}
        onBack={() => setShowConfig(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500">
          No topics available for this subject.
        </div>
      </div>
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
          disabled={selectedSubtopics.size === 0}
          className={`px-4 py-2 rounded-md text-white ${
            selectedSubtopics.size === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topics List */}
        <div className="lg:col-span-1 space-y-2">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`w-full flex items-center justify-between p-3 rounded-md text-left transition-colors ${
                activeTopic === topic.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : getTopicSelectionState(topic.id) === 'full'
                  ? 'bg-green-50 text-green-600'
                  : getTopicSelectionState(topic.id) === 'partial'
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div 
                className="flex items-center gap-2 flex-grow cursor-pointer"
                onClick={() => handleTopicClick(topic.id)}
              >
                <span>{topic.name}</span>
                {getTopicSelectionState(topic.id) === 'partial' && (
                  <MinusCircle className="h-4 w-4 text-yellow-500" />
                )}
                {getTopicSelectionState(topic.id) === 'full' && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
              <button
                onClick={() => handleTopicSelect(topic.id)}
                className={`p-1 rounded-md transition-colors ${
                  getTopicSelectionState(topic.id) === 'full'
                    ? 'text-green-600 hover:bg-green-100'
                    : getTopicSelectionState(topic.id) === 'partial'
                    ? 'text-yellow-600 hover:bg-yellow-100'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                {getTopicSelectionState(topic.id) === 'full' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Subtopics Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTopic ? (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  {topics.find(t => t.id === activeTopic)?.name} Subtopics
                </h2>
                <div className="space-y-2">
                  {topics
                    .find(t => t.id === activeTopic)
                    ?.subtopics.map((subtopic) => (
                      <div
                        key={subtopic.id}
                        className={`flex items-center justify-between p-3 rounded-md border ${
                          selectedSubtopics.has(subtopic.id)
                            ? 'border-indigo-200 bg-indigo-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <span className="text-gray-700">{subtopic.name}</span>
                        <button
                          onClick={() => handleSubtopicSelect(subtopic.id)}
                          className={`p-1 rounded-md ${
                            selectedSubtopics.has(subtopic.id)
                              ? 'text-indigo-600 hover:bg-indigo-100'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {selectedSubtopics.has(subtopic.id) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a topic to view its subtopics
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}