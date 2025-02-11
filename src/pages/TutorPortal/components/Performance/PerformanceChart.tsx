import React from 'react';
import { Card, Empty, Skeleton } from 'antd';
import { Line, Column } from '@ant-design/plots';
import { PerformanceData } from '../../../../types/tutor';

interface Props {
  studentPerformance?: PerformanceData;
  groupPerformance?: {
    groupInfo: any;
    progress: any[];
    subjectMastery: any[];
    recentTests: any[];
  };
  isLoading: boolean;
}

const PerformanceChart: React.FC<Props> = ({
  studentPerformance,
  groupPerformance,
  isLoading,
}) => {
  if (isLoading) {
    return <Skeleton active />;
  }

  if (!studentPerformance) {
    return (
      <Empty
        description="No performance data available"
        className="my-8"
      />
    );
  }

  // Prepare data for score trend chart
  const scoreData = studentPerformance.recentTests.map(test => ({
    date: new Date(test.completedAt || test.startedAt).toLocaleDateString(),
    score: test.score || 0,
    type: 'Student Score',
  }));

  if (groupPerformance) {
    groupPerformance.recentTests.forEach(test => {
      scoreData.push({
        date: new Date(test.completedAt || test.startedAt).toLocaleDateString(),
        score: test.score || 0,
        type: 'Group Average',
      });
    });
  }

  // Prepare data for subject comparison
  const subjectData = studentPerformance.subjectMastery.map(subject => ({
    subject: subject.subjects.name,
    mastery: subject.masteryLevel,
    type: 'Student Mastery',
  }));

  if (groupPerformance) {
    groupPerformance.subjectMastery.forEach(subject => {
      subjectData.push({
        subject: subject.subjects.name,
        mastery: subject.masteryLevel,
        type: 'Group Average',
      });
    });
  }

  const scoreTrendConfig = {
    data: scoreData,
    xField: 'date',
    yField: 'score',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: true,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    legend: {
      position: 'top',
    },
  };

  const subjectComparisonConfig = {
    data: subjectData,
    isGroup: true,
    xField: 'subject',
    yField: 'mastery',
    seriesField: 'type',
    groupField: 'type',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    legend: {
      position: 'top',
    },
  };

  return (
    <div className="space-y-6">
      <Card title="Score Trend">
        <div style={{ height: 400 }}>
          <Line {...scoreTrendConfig} />
        </div>
      </Card>

      <Card title="Subject Mastery Comparison">
        <div style={{ height: 400 }}>
          <Column {...subjectComparisonConfig} />
        </div>
      </Card>
    </div>
  );
};

export default PerformanceChart;
