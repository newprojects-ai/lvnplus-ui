import React from 'react';
import { Book, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubjectOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  color: string;
}

export function PracticeTestsSubjectSelection() {
  const subjects: SubjectOption[] = [
    {
      icon: <Calculator className="h-12 w-12" />,
      title: "Mathematics Practice",
      description: "Test your mathematical skills with various types of practice tests",
      path: "/mathematics/practice",
      color: "indigo"
    },
    {
      icon: <Book className="h-12 w-12" />,
      title: "English Practice",
      description: "Enhance your language proficiency through comprehensive practice tests",
      path: "/english/practice",
      color: "emerald"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Practice Tests</h1>
        <p className="mt-4 text-lg text-gray-600">Choose a subject to begin your practice session</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {subjects.map((subject) => (
          <Link
            key={subject.title}
            to={subject.path}
            className={`bg-white rounded-xl shadow-md p-8 border-2 border-${subject.color}-100 hover:border-${subject.color}-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className={`inline-flex rounded-full bg-${subject.color}-100 p-4 mb-6`}>
              <div className={`text-${subject.color}-600`}>{subject.icon}</div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{subject.title}</h2>
            <p className="text-gray-600 mb-6">{subject.description}</p>
            
            <div className={`inline-flex items-center text-${subject.color}-600`}>
              Start Practice
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}