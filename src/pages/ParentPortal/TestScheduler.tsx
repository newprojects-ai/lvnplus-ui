import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, Repeat, User } from 'lucide-react';
import { TestSchedule } from '../../types/parent';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api/api';

export function TestScheduler() {
  const [schedules, setSchedules] = useState<TestSchedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadChildren();
    loadTestPlans();
  }, []);

  const loadChildren = async () => {
    try {
      const response = await api.getLinkedChildren();
      setChildren(response);
    } catch (error) {
      console.error('Failed to load children:', error);
    }
  };

  const loadTestPlans = async () => {
    try {
      const response = await api.getTestPlans();
      setSchedules(response.map((plan: any) => ({
        id: plan.id,
        studentName: `${plan.student.firstName} ${plan.student.lastName}`,
        testType: plan.title,
        status: plan.status || 'Pending',
        scheduledDate: plan.planned_at,
        subjects: [plan.subject_id], // TODO: Map subject IDs to names
        reminderSettings: { enabled: false },
      })));
      setLoading(false);
    } catch (error) {
      console.error('Failed to load test plans:', error);
      setLoading(false);
    }
  };

  const createTestPlan = async (data: any) => {
    try {
      await api.createTestPlan(data);
      loadTestPlans(); // Reload plans after creating new one
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create test plan:', error);
    }
  };

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

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <TestPlanForm
              children={children}
              onSubmit={createTestPlan}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
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
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {schedule.testType}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <User className="h-4 w-4" />
                    <span>{schedule.studentName}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {schedule.subjects.map(subject => (
                    <span
                      key={subject}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(schedule.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}