import React, { useState } from 'react';
import { Users, Calendar, BarChart } from 'lucide-react';
import { ChildProfiles } from './ChildProfiles';
import { TestScheduler } from './TestScheduler';
import { PerformanceDashboard } from './PerformanceDashboard';

export function ParentPortal() {
  const [activeTab, setActiveTab] = useState<'profiles' | 'scheduler' | 'performance'>('profiles');

  const tabs = [
    {
      id: 'profiles',
      label: 'Child Profiles',
      icon: Users,
      component: ChildProfiles
    },
    {
      id: 'scheduler',
      label: 'Test Scheduler',
      icon: Calendar,
      component: TestScheduler
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: BarChart,
      component: PerformanceDashboard
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ChildProfiles;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    group inline-flex items-center px-4 py-4 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon
                    className={`
                      -ml-0.5 mr-2 h-5 w-5
                      ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main>
        <ActiveComponent />
      </main>
    </div>
  );
}