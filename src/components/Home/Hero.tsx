import React from 'react';
import { Calculator, PenTool, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Hero() {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Calculator className="h-8 w-8 text-indigo-600" />,
      title: "Core Mathematics",
      description: "Master essential mathematical concepts aligned with the Year 7 curriculum.",
      link: "/mathematics",
      allowedRoles: ['student', 'tutor', 'administrator']
    },
    {
      icon: <PenTool className="h-8 w-8 text-indigo-600" />,
      title: "Practice Tests",
      description: "Strengthen your skills with targeted quizzes and comprehensive assessments.",
      link: "/mathematics/practice",
      allowedRoles: ['student', 'tutor', 'administrator']
    },
    {
      icon: <LineChart className="h-8 w-8 text-indigo-600" />,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed performance analytics.",
      link: "/progress",
      allowedRoles: ['student', 'parent', 'tutor', 'administrator']
    }
  ];

  const isFeatureEnabled = (allowedRoles?: string[]) => {
    if (!isAuthenticated || !user || !allowedRoles) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 bg-white">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Master</span>
                <span className="block text-indigo-600">Year 7 Mathematics</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                Build strong mathematical foundations through interactive practice tests, comprehensive assessments, and detailed progress tracking.
              </p>
              {!isAuthenticated ? (
                <div className="mt-5 sm:mt-8 flex justify-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
              ) : isFeatureEnabled(['student']) && (
                <div className="mt-5 sm:mt-8 flex justify-center">
                  <Link
                    to="/mathematics"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg md:px-10"
                  >
                    Start Learning
                  </Link>
                </div>
              )}
            </div>
          </main>

          <div className="mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    {...feature}
                    isEnabled={isFeatureEnabled(feature.allowedRoles)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  isEnabled: boolean;
}

function FeatureCard({ icon, title, description, link, isEnabled }: FeatureCardProps) {
  const content = (
    <>
      <div className="flex justify-center">{icon}</div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 text-center">{description}</p>
    </>
  );

  if (!isEnabled) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 opacity-50 cursor-not-allowed">
        {content}
      </div>
    );
  }

  return (
    <Link 
      to={link}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1"
    >
      {content}
    </Link>
  );
}