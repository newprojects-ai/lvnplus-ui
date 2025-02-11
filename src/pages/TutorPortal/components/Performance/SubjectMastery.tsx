import React from 'react';
import { Card, Row, Col, Progress, Skeleton, Empty } from 'antd';

interface SubjectMasteryItem {
  id: string;
  subjectId: string;
  masteryLevel: number;
  subjects: {
    id: string;
    name: string;
  };
}

interface Props {
  subjectMastery: SubjectMasteryItem[];
  isLoading: boolean;
}

const getMasteryColor = (level: number) => {
  if (level >= 80) return '#52c41a'; // High mastery - Green
  if (level >= 60) return '#1890ff'; // Good mastery - Blue
  if (level >= 40) return '#faad14'; // Medium mastery - Yellow
  return '#f5222d'; // Low mastery - Red
};

const getMasteryStatus = (level: number) => {
  if (level >= 80) return 'High Mastery';
  if (level >= 60) return 'Good Progress';
  if (level >= 40) return 'Developing';
  return 'Needs Attention';
};

const SubjectMastery: React.FC<Props> = ({ subjectMastery, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  if (!subjectMastery?.length) {
    return (
      <Empty
        description="No subject mastery data available"
        className="my-8"
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {subjectMastery.map((subject) => (
        <Col key={subject.id} xs={24} sm={12} md={8} lg={6}>
          <Card
            className="h-full"
            bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <div className="text-center flex-1">
              <h3 className="text-lg font-medium mb-4">
                {subject.subjects.name}
              </h3>
              
              <Progress
                type="circle"
                percent={subject.masteryLevel}
                strokeColor={getMasteryColor(subject.masteryLevel)}
                className="mb-4"
              />
              
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  Status
                </div>
                <div
                  className="font-medium"
                  style={{ color: getMasteryColor(subject.masteryLevel) }}
                >
                  {getMasteryStatus(subject.masteryLevel)}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SubjectMastery;
