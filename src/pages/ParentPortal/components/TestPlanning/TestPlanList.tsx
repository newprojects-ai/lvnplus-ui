import React, { useState } from 'react';
import { List, Card, Button, Modal, Empty, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TestPlanForm from './TestPlanForm';
import TestPlanCard from './TestPlanCard';
import { TestPlan, ChildProfile } from '../../../../types/parent';

interface Props {
  testPlans: TestPlan[];
  children: ChildProfile[];
  isLoading: boolean;
}

const TestPlanList: React.FC<Props> = ({ testPlans, children, isLoading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((key) => (
          <Card key={key} className="w-full">
            <Skeleton active />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Test Plans</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Create Test Plan
        </Button>
      </div>

      {!testPlans.length ? (
        <Empty
          description="No test plans created yet"
          className="my-8"
        />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 3,
          }}
          dataSource={testPlans}
          renderItem={(plan) => (
            <List.Item>
              <TestPlanCard plan={plan} />
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Create Test Plan"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <TestPlanForm
          children={children}
          onSuccess={() => setIsModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default TestPlanList;
