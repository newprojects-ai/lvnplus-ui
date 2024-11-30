import React from 'react';
import { Book, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubjectCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  color: string;
  bgImage: string;
}

export function SubjectSelection() {
  const subjects: SubjectCard[] = [
    {
      icon: <Calculator className="h-12 w-12" />,
      title: "Mathematics",
      description: "Master essential mathematical concepts through interactive learning and practice tests",
      path: "/mathematics",
      color: "indigo",
      bgImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=2670"
    },
    {
      icon: <Book className="h-12 w-12" />,
      title: "English",
      description: "Develop strong language skills with comprehensive reading and writing exercises",
      path: "/english",
      color: "emerald",
      bgImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=2670"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Subject</h1>
          <p className="mt-4 text-lg text-gray-600">Select a subject to begin your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjects.map((subject) => (
            <Link
              key={subject.title}
              to={subject.path}
              className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl`}
            >
              <div className="absolute inset-0">
                <img
                  src={subject.bgImage}
                  alt={subject.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-${subject.color}-900/70`} />
              </div>
              
              <div className="relative p-8 sm:p-12">
                <div className={`inline-flex rounded-full bg-${subject.color}-100 p-4 mb-6`}>
                  <div className={`text-${subject.color}-600`}>{subject.icon}</div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">{subject.title}</h2>
                <p className="text-lg text-white/90 mb-8">{subject.description}</p>
                
                <div className={`inline-flex items-center rounded-lg bg-${subject.color}-500 px-6 py-3 text-white transition-colors hover:bg-${subject.color}-600`}>
                  Start Learning
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}