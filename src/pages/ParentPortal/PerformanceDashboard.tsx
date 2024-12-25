import React, { useState, useEffect } from 'react';
import { BarChart, LineChart, Activity, Target, TrendingUp } from 'lucide-react';
import { PerformanceMetrics } from '../../types/parent';

export function PerformanceDashboard() {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
          </select>
        </div>
      </div>

      {metrics && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Average Score</h3>
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-indigo-600">
                {metrics.averageScore}%
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Across {metrics.testsCompleted} tests
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Time Spent</h3>
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                {Math.floor(metrics.timeSpent / 60)}h {metrics.timeSpent % 60}m
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Total learning time
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {metrics.monthlyProgress[metrics.monthlyProgress.length - 1].improvement}%
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Improvement this month
              </p>
            </div>
          </div>

          {/* Topic Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Performance</h3>
            <div className="space-y-4">
              {Object.entries(metrics.topicPerformance).map(([topic, score]) => (
                <div key={topic}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{topic}</span>
                    <span>{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Areas for Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths</h3>
              <div className="space-y-2">
                {metrics.strengthAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Areas for Improvement
              </h3>
              <div className="space-y-2">
                {metrics.improvementAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-orange-600"
                  >
                    <Target className="h-5 w-5" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}