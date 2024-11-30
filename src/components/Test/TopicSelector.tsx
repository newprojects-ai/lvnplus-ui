import React, { useEffect, useState } from 'react';
import { Topic } from '../../types/test';
import { testsApi } from '../../api/tests';
import { Check, Plus, MinusCircle, Loader2 } from 'lucide-react';

interface TopicSelectorProps {
  onSelectionChange: (topics: string[], subtopics: string[]) => void;
}

export function TopicSelector({ onSelectionChange }: TopicSelectorProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubtopics, setSelectedSubtopics] = useState<Set<string>>(new Set());
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const topicsData = await testsApi.getTopics();
      setTopics(topicsData);
    } catch (err) {
      setError('Failed to load topics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const selectedTopics = topics
      .filter(topic => 
        topic.subtopics.some(st => selectedSubtopics.has(st.id))
      )
      .map(t => t.id);

    onSelectionChange(selectedTopics, Array.from(selectedSubtopics));
  }, [selectedSubtopics, topics, onSelectionChange]);

  const handleTopicSelect = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const newSelectedSubtopics = new Set(selectedSubtopics);
    const allSubtopicsSelected = topic.subtopics.every(
      st => selectedSubtopics.has(st.id)
    );

    topic.subtopics.forEach(st => {
      if (allSubtopicsSelected) {
        newSelectedSubtopics.delete(st.id);
      } else {
        newSelectedSubtopics.add(st.id);
      }
    });

    setSelectedSubtopics(newSelectedSubtopics);
  };

  const handleSubtopicSelect = (subtopicId: string) => {
    const newSelectedSubtopics = new Set(selectedSubtopics);
    if (selectedSubtopics.has(subtopicId)) {
      newSelectedSubtopics.delete(subtopicId);
    } else {
      newSelectedSubtopics.add(subtopicId);
    }
    setSelectedSubtopics(newSelectedSubtopics);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadTopics}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const getTopicSelectionState = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return 'none';

    const selectedCount = topic.subtopics.filter(
      subtopic => selectedSubtopics.has(subtopic.id)
    ).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === topic.subtopics.length) return 'full';
    return 'partial';
  };

  return (
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
              onClick={() => setActiveTopic(activeTopic === topic.id ? null : topic.id)}
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
  );
}