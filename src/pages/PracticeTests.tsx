import React from 'react';
import { Book, Shuffle, Brain } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface TestOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  color: string;
}

export function PracticeTests() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const getMathematicsTestOptions = (): TestOption[] => [
    {
      icon: <Book className="h-8 w-8" />,
      title: "Topic Wise",
      description: "Practice specific mathematical concepts one topic at a time",
      path: `/practice/tests/topic-wise/${subjectId}`,
      color: "indigo"
    },
    {
      icon: <Shuffle className="h-8 w-8" />,
      title: "Mixed",
      description: "Challenge yourself with questions from various topics",
      path: `/mixed-test-config`,
      color: "purple"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Mental Arithmetic",
      description: "Improve your mental calculation speed and accuracy",
      path: `/practice/tests/mental/${subjectId}`,
      color: "green"
    }
  ];

  const getEnglishTestOptions = (): TestOption[] => [
    {
      icon: <Book className="h-8 w-8" />,
      title: "Grammar Practice",
      description: "Improve your grammar and language skills",
      path: `/practice/tests/grammar/${subjectId}`,
      color: "emerald"
    },
    {
      icon: <Shuffle className="h-8 w-8" />,
      title: "Reading Comprehension",
      description: "Enhance your reading and understanding skills",
      path: `/practice/tests/reading/${subjectId}`,
      color: "blue"
    }
  ];

  const getTestOptions = (): TestOption[] => {
    switch(subjectId) {
      case '1': // Mathematics
        return getMathematicsTestOptions();
      case '2': // English
        return getEnglishTestOptions();
      default:
        return [];
    }
  };

  const testOptions = getTestOptions();

  if (testOptions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Practice Tests</h1>
        <p className="mt-4 text-lg text-gray-600">No practice tests available for this subject</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Select Test Type</h1>
        <p className="mt-4 text-lg text-gray-600">Choose your preferred testing mode</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testOptions.map((option) => (
          <Link
            key={option.title}
            to={option.path}
            className={`bg-white rounded-xl shadow-md p-8 border-2 border-${option.color}-100 hover:border-${option.color}-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className={`flex justify-center mb-6 text-${option.color}-600`}>
              {option.icon}
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">{option.title}</h2>
            <p className="text-gray-600 text-center">{option.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}