import React, { useState, useEffect } from 'react';
import { Check, Plus, MinusCircle, ArrowLeft } from 'lucide-react';
import { TestConfig } from './TestConfig';
import { topicsApi } from '../api/topics';
import { Topic } from '../types/test';
import { useParams, useNavigate } from 'react-router-dom';

export function TopicTests() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [selectedSubtopics, setSelectedSubtopics] = useState<Set<string>>(new Set());
  const [showConfig, setShowConfig] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, [subjectId]);

  useEffect(() => {
    // Set first topic as active by default
    if (topics.length > 0 && !activeTopic) {
      setActiveTopic(topics[0].id);
    }
  }, [topics]);

  const loadTopics = async () => {
    try {
      setLoading(true);
      if (!subjectId) {
        throw new Error('No subject ID provided');
      }
      const topicsData = await topicsApi.getTopics(parseInt(subjectId));
      setTopics(topicsData);
      setError(null);
    } catch (err) {
      console.error('Error loading topics:', err);
      setError('Failed to load topics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topicId: string) => {
    setActiveTopic(topicId);
  };

  const handleTopicSelect = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const newSelectedSubtopics = new Set(selectedSubtopics);
    const allSubtopicsSelected = topic.subtopics.every(
      st => selectedSubtopics.has(st.id)
    );

    if (allSubtopicsSelected) {
      topic.subtopics.forEach(st => newSelectedSubtopics.delete(st.id));
    } else {
      topic.subtopics.forEach(st => newSelectedSubtopics.add(st.id));
    }

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

  const getTopicSelectionState = (topicId: string) => {
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
        topics={topics}
        selectedSubtopics={Array.from(selectedSubtopics)}
        onBack={() => setShowConfig(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button 
            onClick={loadTopics}
            className="text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="text-center">
          <div className="text-xl text-gray-600">No topics available for this subject</div>
        </div>
      </div>
    );
  }

  const anySubtopicsSelected = selectedSubtopics.size > 0;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Topic-wise Practice</h1>
        <p className="mt-2 text-gray-600">Select topics and subtopics to practice</p>
      </div>

      <div className="flex gap-12">
        {/* Topics List */}
        <div className="w-[500px] flex-shrink-0">
          {topics.map((topic) => {
            const selectionState = getTopicSelectionState(topic.id);
            const isActive = activeTopic === topic.id;
            
            return (
              <div
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                className={`
                  mb-2 p-4 rounded-lg cursor-pointer flex items-center gap-3
                  ${isActive ? 'ring-2 ring-blue-400' : ''}
                  ${selectionState === 'none' ? 'bg-gray-50 hover:bg-gray-100' : ''}
                  ${selectionState === 'full' ? 'bg-green-50 hover:bg-green-100' : ''}
                  ${selectionState === 'partial' ? 'bg-amber-50 hover:bg-amber-100' : ''}
                `}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTopicSelect(topic.id);
                  }}
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                    ${selectionState === 'full' ? 'text-green-600' : ''}
                    ${selectionState === 'partial' ? 'text-amber-600' : ''}
                    ${selectionState === 'none' ? 'text-gray-400' : ''}
                  `}
                >
                  {selectionState === 'full' && <Check className="w-4 h-4" />}
                  {selectionState === 'partial' && <MinusCircle className="w-4 h-4" />}
                  {selectionState === 'none' && <Plus className="w-4 h-4" />}
                </div>
                <span className="flex-grow">{topic.name}</span>
              </div>
            );
          })}
        </div>

        {/* Subtopics Panel */}
        <div className="flex-grow">
          {activeTopic && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {topics.find(t => t.id === activeTopic)?.name} Subtopics
              </h2>
              <div className="space-y-2">
                {topics
                  .find(t => t.id === activeTopic)
                  ?.subtopics.map((subtopic) => {
                    const isSelected = selectedSubtopics.has(subtopic.id);
                    return (
                      <div
                        key={subtopic.id}
                        onClick={() => handleSubtopicSelect(subtopic.id)}
                        className={`
                          p-4 rounded-lg cursor-pointer flex items-center gap-3
                          ${isSelected ? 'bg-amber-50 hover:bg-amber-100' : 'bg-gray-50 hover:bg-gray-100'}
                        `}
                      >
                        <div className={`
                          flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                          ${isSelected ? 'text-amber-600' : 'text-gray-400'}
                        `}>
                          {isSelected ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </div>
                        <span>{subtopic.name}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowConfig(true)}
          disabled={!anySubtopicsSelected}
          className={`
            px-6 py-2 rounded-lg font-medium
            ${anySubtopicsSelected
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}