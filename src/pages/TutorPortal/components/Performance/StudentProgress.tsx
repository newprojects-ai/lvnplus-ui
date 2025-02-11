import React, { useState } from 'react';
import { Card, Select, Empty, Skeleton, Tabs, Row, Col, Statistic } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { tutorApi } from '../../../../api/tutor.api';
import { Student, StudyGroup } from '../../../../types/tutor';
import PerformanceChart from './PerformanceChart';
import TestResults from './TestResults';
import SubjectMastery from './SubjectMastery';

const { Option } = Select;
const { TabPane } = Tabs;

interface Props {
  students: Student[];
  groups: StudyGroup[];
  isLoading: boolean;
}

const StudentProgress: React.FC<Props> = ({ students, groups, isLoading }) => {
  const [selectedStudent, setSelectedStudent] = useState<string>();
  const [selectedGroup, setSelectedGroup] = useState<string>();

  const { data: performance, isLoading: performanceLoading } = useQuery(
    ['studentPerformance', selectedStudent],
    () => selectedStudent ? tutorApi.getStudentPerformance(Number(selectedStudent)) : null,
    { enabled: !!selectedStudent }
  );

  const { data: testHistory, isLoading: historyLoading } = useQuery(
    ['studentTestHistory', selectedStudent],
    () => selectedStudent ? tutorApi.getStudentTestHistory(Number(selectedStudent)) : null,
    { enabled: !!selectedStudent }
  );

  const { data: groupPerformance, isLoading: groupLoading } = useQuery(
    ['groupPerformance', selectedGroup],
    () => selectedGroup ? tutorApi.getGroupPerformance(Number(selectedGroup)) : null,
    { enabled: !!selectedGroup }
  );

  if (isLoading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  if (!students.length) {
    return (
      <Empty
        description="No students linked to your account"
        className="my-8"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Student
          </label>
          <Select
            placeholder="Select a student to view progress"
            onChange={setSelectedStudent}
            value={selectedStudent}
            className="w-full"
          >
            {students.map((student) => (
              <Option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </Option>
            ))}
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compare with Group
          </label>
          <Select
            placeholder="Select a group to compare"
            onChange={setSelectedGroup}
            value={selectedGroup}
            className="w-full"
            allowClear
          >
            {groups.map((group) => (
              <Option key={group.id} value={group.id}>
                {group.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {selectedStudent && performance && (
        <div>
          <Row gutter={16} className="mb-6">
            <Col span={8}>
              <Card>
                <Statistic
                  title="Overall Progress"
                  value={performance.progress.overallProgress}
                  suffix="%"
                  precision={1}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tests Completed"
                  value={testHistory?.length || 0}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Average Score"
                  value={
                    testHistory?.reduce((acc, test) => acc + (test.score || 0), 0) /
                    (testHistory?.length || 1)
                  }
                  suffix="%"
                  precision={1}
                />
              </Card>
            </Col>
          </Row>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Performance Overview" key="1">
              <PerformanceChart
                studentPerformance={performance}
                groupPerformance={groupPerformance}
                isLoading={performanceLoading || groupLoading}
              />
            </TabPane>

            <TabPane tab="Subject Mastery" key="2">
              <SubjectMastery
                subjectMastery={performance.subjectMastery}
                isLoading={performanceLoading}
              />
            </TabPane>

            <TabPane tab="Test History" key="3">
              <TestResults
                testHistory={testHistory || []}
                isLoading={historyLoading}
              />
            </TabPane>

            <TabPane tab="Areas for Improvement" key="4">
              <Card>
                <h3 className="text-lg font-medium mb-4">Improvement Areas</h3>
                <ul className="list-disc pl-4">
                  {performance.progress.improvementAreas.map((area, index) => (
                    <li key={index} className="mb-2">{area}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-medium mb-4 mt-6">Strengths</h3>
                <ul className="list-disc pl-4">
                  {performance.progress.strengthAreas.map((area, index) => (
                    <li key={index} className="mb-2">{area}</li>
                  ))}
                </ul>
              </Card>
            </TabPane>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
