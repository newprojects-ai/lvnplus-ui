import React, { useState } from 'react';
import { Card, Select, Empty, Skeleton, Tabs } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { parentApi } from '../../../../api/parent.api';
import { ChildProfile } from '../../../../types/parent';
import TestResults from './TestResults';
import PerformanceChart from './PerformanceChart';

const { Option } = Select;
const { TabPane } = Tabs;

interface Props {
  children: ChildProfile[];
  isLoading: boolean;
}

const ChildProgress: React.FC<Props> = ({ children, isLoading }) => {
  const [selectedChild, setSelectedChild] = useState<string>();

  const { data: performance, isLoading: performanceLoading } = useQuery(
    ['childPerformance', selectedChild],
    () => selectedChild ? parentApi.getChildPerformance(Number(selectedChild)) : null,
    { enabled: !!selectedChild }
  );

  const { data: testHistory, isLoading: historyLoading } = useQuery(
    ['childTestHistory', selectedChild],
    () => selectedChild ? parentApi.getChildTestHistory(Number(selectedChild)) : null,
    { enabled: !!selectedChild }
  );

  if (isLoading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  if (!children.length) {
    return (
      <Empty
        description="No children linked to your account"
        className="my-8"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Child
        </label>
        <Select
          placeholder="Select a child to view progress"
          onChange={setSelectedChild}
          value={selectedChild}
          className="w-full max-w-md"
        >
          {children.map((child) => (
            <Option key={child.id} value={child.id}>
              {child.firstName} {child.lastName}
            </Option>
          ))}
        </Select>
      </div>

      {selectedChild && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Overview" key="1">
            <PerformanceChart
              performance={performance}
              isLoading={performanceLoading}
            />
          </TabPane>
          <TabPane tab="Test Results" key="2">
            <TestResults
              testHistory={testHistory}
              isLoading={historyLoading}
            />
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default ChildProgress;
