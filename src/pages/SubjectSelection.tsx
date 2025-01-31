import React, { useState, useEffect } from 'react';
import { Briefcase, Book, Globe, Microscope, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

interface Subject {
  id: number;
  name: string;
  description: string;
}

export function SubjectSelection() {
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
        return <Briefcase className="h-12 w-12 text-indigo-600" />;
      case 'english':
        return <Book className="h-12 w-12 text-emerald-600" />;
      case 'science':
        return <Microscope className="h-12 w-12 text-blue-600" />;
      case 'geography':
        return <Globe className="h-12 w-12 text-green-600" />;
      case 'art':
        return <Palette className="h-12 w-12 text-purple-600" />;
      default:
        return <Book className="h-12 w-12 text-gray-600" />;
    }
  };

  const getSubjectRoute = (subjectName: string): string => {
    // Map any subject name variations to their correct route
    switch(subjectName.toLowerCase()) {
      case 'mathematics':
      case 'maths':
        return '/mathematics';
      case 'english':
        return '/english';
      case 'science':
        return '/science';
      case 'geography':
        return '/geography';
      case 'art':
        return '/art';
      default:
        return `/${subjectName.toLowerCase()}`;
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

  if (subjects.length === 0) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-gray-600">No subjects available</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Our Subjects</h1>
          <p className="mt-4 text-lg text-gray-600">Explore and learn across various disciplines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <div 
              key={subject.id} 
              className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                {getSubjectIcon(subject.name)}
                <span className="text-2xl font-bold text-gray-900">{subject.name}</span>
              </div>
              <p className="text-gray-600 mb-6">{subject.description}</p>
              <div className="flex justify-between items-center">
                <Link 
                  to={getSubjectRoute(subject.name)}
                  className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                >
                  Explore {subject.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}