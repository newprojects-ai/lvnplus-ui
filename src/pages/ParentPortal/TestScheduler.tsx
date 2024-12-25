import React, { useState } from 'react';
import { Calendar, Clock, Bell, Repeat } from 'lucide-react';
import { TestSchedule } from '../../types/parent';

export function TestScheduler() {
  const [schedules, setSchedules] = useState<TestSchedule[]>([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Test Scheduler</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Calendar className="h-5 w-5" />
          Schedule Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map(schedule => (
          <div
            key={schedule.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${schedule.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  schedule.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  schedule.status === 'Missed' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'}`}
              >
                {schedule.status}
              </span>
              {schedule.recurringPattern && (
                <Repeat className="h-5 w-5 text-indigo-600" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {schedule.testType} Test
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {schedule.subjects.map(subject => (
                    <span
                      key={subject}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(schedule.scheduledDate).toLocaleDateString()} at{' '}
                  {new Date(schedule.scheduledDate).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bell className="h-4 w-4" />
                <span>
                  {schedule.reminderSettings.enabled
                    ? `Reminder ${schedule.reminderSettings.reminderTime}h before`
                    : 'No reminder set'}
                </span>
              </div>

              {schedule.recurringPattern && (
                <div className="text-sm text-gray-600">
                  Repeats {schedule.recurringPattern.frequency.toLowerCase()} 
                  {schedule.recurringPattern.endDate
                    ? ` until ${new Date(schedule.recurringPattern.endDate).toLocaleDateString()}`
                    : ''}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}