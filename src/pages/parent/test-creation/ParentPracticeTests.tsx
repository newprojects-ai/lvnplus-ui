import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Brain, GraduationCap, Dices, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../api/client';

interface TestOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  color: string;
}

interface Subject {
  id: number;
  name: string;
  description: string;
}

export function ParentPracticeTests() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Subject>(`/subjects/${subjectId}`);
        setSubject(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load subject:', err);
        setError('Failed to load subject data');
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  const getMathematicsTestOptions = (): TestOption[] => [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Topic Wise Practice",
      description: "Practice specific mathematical concepts one topic at a time",
      path: `/parent/test-creation/practice/tests/topic-wise/${subjectId}`,
      color: "indigo"
    },
    {
      icon: <Dices className="h-8 w-8" />,
      title: "Mixed Practice",
      description: "Challenge yourself with questions from various topics",
      path: `/parent/test-creation/practice/tests/mixed/${subjectId}`,
      color: "purple"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Mental Arithmetic",
      description: "Improve mental calculation speed and accuracy",
      path: `/parent/test-creation/practice/tests/mental/${subjectId}`,
      color: "green"
    }
  ];

  const getTestOptions = (): TestOption[] => {
    if (!subject) return [];
    
    const subjectName = subject.name.toLowerCase();
    return getMathematicsTestOptions();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const testOptions = getTestOptions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Select Test Type
        </h1>
        <p className="mt-4 text-lg text-gray-600">Choose your preferred testing mode</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testOptions.map((option) => (
          <Link
            key={option.title}
            to={option.path}
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`flex justify-center mb-6 text-${option.color}-600`}>
              {option.icon}
            </div>
            <h2 className="text-xl font-bold text-center mb-4">{option.title}</h2>
            <p className="text-gray-600 text-center">{option.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
