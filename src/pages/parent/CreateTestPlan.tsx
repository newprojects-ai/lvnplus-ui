import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parentApi } from '../../api/parent.api';
import { LinkedChild, Subject, QuestionSet } from '../../types/parent';

export const CreateTestPlan: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedQuestionSets, setSelectedQuestionSets] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questionsPerSet: '10',
    timeLimit: '60'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childrenData, subjectsData] = await Promise.all([
          parentApi.getLinkedChildren(),
          parentApi.getSubjects()
        ]);
        setChildren(childrenData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchQuestionSets = async () => {
      if (!selectedSubject) return;
      try {
        const sets = await parentApi.getQuestionSets(selectedSubject);
        setQuestionSets(sets);
      } catch (error) {
        console.error('Error fetching question sets:', error);
      }
    };
    fetchQuestionSets();
  }, [selectedSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild || !selectedSubject || selectedQuestionSets.length === 0) {
      return;
    }

    setSubmitting(true);
    try {
      await parentApi.createTestPlan({
        studentId: selectedChild,
        title: formData.title,
        description: formData.description,
        subjectId: selectedSubject,
        questionSetIds: selectedQuestionSets,
        questionsPerSet: parseInt(formData.questionsPerSet),
        timeLimit: parseInt(formData.timeLimit)
      });
      navigate('/parent/scheduler');
    } catch (error) {
      console.error('Error creating test plan:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Test Plan</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Student Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Student</label>
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            required
          >
            <option value="">Select a student</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Title & Description */}
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

        {/* Subject & Question Sets */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            required
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSubject && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Question Sets</label>
            <div className="mt-2 space-y-2">
              {questionSets.map((set) => (
                <label key={set.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={set.id}
                    checked={selectedQuestionSets.includes(set.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuestionSets([...selectedQuestionSets, set.id]);
                      } else {
                        setSelectedQuestionSets(selectedQuestionSets.filter(id => id !== set.id));
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{set.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Questions Per Set & Time Limit */}
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/parent/scheduler')}
            className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Test Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};
