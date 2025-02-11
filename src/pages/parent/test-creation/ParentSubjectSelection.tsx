import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowLeft } from 'lucide-react';
import { parentApi } from '../../../api/parent.api';

interface Subject {
  id: string;
  name: string;
  description: string;
}

export function ParentSubjectSelection() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await parentApi.getSubjects();
        setSubjects(response);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load subjects:', err);
        setError('Failed to load subjects');
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectSelect = (subjectId: string) => {
    navigate(`/parent/test-creation/practice/tests/${subjectId}`);
  };

  const handleBack = () => {
    navigate('/parent');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">Select a Subject for Test Creation</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => handleSubjectSelect(subject.id)}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Book className="h-12 w-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{subject.name}</h2>
            <p className="text-gray-600 text-center">{subject.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
