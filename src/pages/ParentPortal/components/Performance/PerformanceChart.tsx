import React from 'react';
import { Card, Row, Col, Statistic, Progress, Skeleton, Empty } from 'antd';
import { 
  TrophyOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import { PerformanceMetrics } from '../../../../types/parent';
import { Line } from '@ant-design/plots';

interface Props {
  performance?: {
    progress: any;
    subjectMastery: any[];
    recentTests: any[];
  };
  isLoading: boolean;
}

const PerformanceChart: React.FC<Props> = ({ performance, isLoading }) => {
  if (isLoading) {
    return <Skeleton active />;
  }

  if (!performance) {
    return (
      <Empty
        description="No performance data available"
        className="my-8"
      />
    );
  }

  const { progress, subjectMastery, recentTests } = performance;

  // Calculate overall statistics
  const averageScore = recentTests.reduce((acc, test) => acc + (test.score || 0), 0) / recentTests.length;
  const totalTests = recentTests.length;
  const totalTime = recentTests.reduce((acc, test) => acc + (test.duration || 0), 0);

  // Prepare data for line chart
  const chartData = recentTests.map(test => ({
    date: new Date(test.completedAt).toLocaleDateString(),
    score: test.score || 0
  }));

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Score"
              value={averageScore}
              precision={1}
              suffix="%"
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tests Completed"
              value={totalTests}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Time Spent"
              value={Math.round(totalTime / 60)}
              suffix="minutes"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Subject Mastery */}
      <Card title="Subject Mastery">
        <Row gutter={[16, 16]}>
          {subjectMastery.map(subject => (
            <Col span={8} key={subject.id}>
              <div className="text-center">
                <div className="mb-2">{subject.subjects.name}</div>
                <Progress
                  type="circle"
                  percent={subject.masteryLevel}
                  width={80}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Performance Trend */}
      <Card title="Performance Trend">
        <div style={{ height: 300 }}>
          <Line
            data={chartData}
            xField="date"
            yField="score"
            point={{
              size: 5,
              shape: 'diamond',
            }}
            label={{
              style: {
                fill: '#aaa',
              },
            }}
            xAxis={{
              label: {
                autoRotate: true,
              },
            }}
            yAxis={{
              min: 0,
              max: 100,
              label: {
                formatter: (v) => `${v}%`,
              },
            }}
          />
        </div>
      </Card>

      {/* Improvement Areas */}
      {progress?.improvementAreas && (
        <Card title="Areas for Improvement">
          <ul className="list-disc pl-4">
            {progress.improvementAreas.map((area: string, index: number) => (
              <li key={index} className="mb-2">{area}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default PerformanceChart;
