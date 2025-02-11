import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Clock, Award } from 'lucide-react';
import { api } from '../../api/api';

export function PerformanceDashboard() {
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestExecutions();
  }, []);

  const loadTestExecutions = async () => {
    try {
      const response = await api.getTestExecutions();
      setExecutions(response);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load test executions:', error);
      setLoading(false);
    }
  };

  const calculateStats = (executions: any[]) => {
    if (!executions.length) return { avgScore: 0, totalTests: 0, avgTime: 0 };

    const totalTests = executions.length;
    const avgScore = executions.reduce((sum, exec) => sum + (exec.score || 0), 0) / totalTests;
    const avgTime = executions.reduce((sum, exec) => sum + (exec.duration || 0), 0) / totalTests;

    return { avgScore, totalTests, avgTime };
  };

  const stats = calculateStats(executions);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Performance Dashboard</h1>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.avgScore.toFixed(1)}%</p>
                </div>
                <BarChart2 className="h-8 w-8 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tests Taken</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalTests}</p>
                </div>
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Time per Test</p>
                  <p className="text-2xl font-semibold text-gray-900">{Math.round(stats.avgTime)} min</p>
                </div>
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Test Results</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Taken
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {executions.map((execution) => (
                      <tr key={execution.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {execution.test_plan.student.firstName} {execution.test_plan.student.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {execution.test_plan.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full
                            ${execution.score >= 80 ? 'bg-green-100 text-green-800' :
                              execution.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}
                          >
                            {execution.score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(execution.completed_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.round(execution.duration)} min
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}