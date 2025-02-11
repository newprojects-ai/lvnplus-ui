import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { parentApi } from '../../../api/parent.api';
import { PerformanceMetrics } from '../../../types/parent';

interface PerformanceChartProps {
  childId: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ childId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!childId) return;
      try {
        const metrics = await parentApi.getChildPerformance(childId);
        setData(metrics);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [childId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">No performance data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="#4f46e5"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            name="Accuracy"
            stroke="#10b981"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="speed"
            name="Speed"
            stroke="#f59e0b"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
