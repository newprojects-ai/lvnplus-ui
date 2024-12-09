import React, { useState, useEffect } from 'react';
import { Book, Calculator, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

interface Subject {
  id: number;
  name: string;
  description: string;
}

export function PracticeTestsSubjectSelection() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await apiClient.get<Subject[]>('/subjects');
        setSubjects(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load subjects:', err);
        setError('Failed to load subjects');
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const getSubjectIcon = (subjectName: string) => {
    switch(subjectName.toLowerCase()) {
      case 'mathematics':
        return <Calculator className="h-12 w-12" />;
      case 'english':
        return <Book className="h-12 w-12" />;
      default:
        return <ChevronRight className="h-12 w-12" />;
    }
  };

  const getSubjectColor = (subjectName: string) => {
    switch(subjectName.toLowerCase()) {
      case 'mathematics':
        return 'indigo';
      case 'english':
        return 'emerald';
      default:
        return 'gray';
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-gray-600">Loading subjects...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Practice Tests</h1>
        <p className="mt-4 text-lg text-gray-600">Choose a subject to begin your practice session</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {subjects.map((subject) => {
          const color = getSubjectColor(subject.name);
          const icon = getSubjectIcon(subject.name);

          return (
            <Link
              key={subject.id}
              to={`/${subject.name.toLowerCase()}/practice`}
              className={`bg-white rounded-xl shadow-md p-8 border-2 border-${color}-100 hover:border-${color}-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className={`inline-flex rounded-full bg-${color}-100 p-4 mb-6`}>
                <div className={`text-${color}-600`}>{icon}</div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{subject.name} Practice</h2>
              <p className="text-gray-600 mb-6">{subject.description}</p>
              
              <div className="flex items-center text-blue-600 font-semibold">
                Start Practice
                <ChevronRight className="ml-2 h-5 w-5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}