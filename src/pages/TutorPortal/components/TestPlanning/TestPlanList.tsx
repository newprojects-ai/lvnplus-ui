import React, { useState } from 'react';
import { List, Button, Empty, Skeleton, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TestPlanCard from './TestPlanCard';
import TestPlanForm from './TestPlanForm';
import { TestPlan, Student, StudyGroup } from '../../../../types/tutor';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

interface Props {
  testPlans: TestPlan[];
  students: Student[];
  groups: StudyGroup[];
  isLoading: boolean;
}

const TestPlanList: React.FC<Props> = ({
  testPlans,
  students,
  groups,
  isLoading,
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TestPlan | null>(null);
  const navigate = useNavigate();

  const handleEdit = (plan: TestPlan) => {
    setEditingPlan(plan);
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setEditingPlan(null);
  };

  // Filter test plans by status
  const pendingPlans = testPlans.filter(plan => plan.status === 'PENDING');
  const inProgressPlans = testPlans.filter(plan => plan.status === 'IN_PROGRESS');
  const completedPlans = testPlans.filter(plan => plan.status === 'COMPLETED');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((key) => (
          <div key={key} className="w-full">
            <Skeleton active />
          </div>
        ))}
      </div>
    );
  }

  const renderTestPlanList = (plans: TestPlan[]) => {
    if (!plans.length) {
      return (
        <Empty
          description="No test plans found"
          className="my-8"
        />
      );
    }

    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        dataSource={plans}
        renderItem={(plan) => (
          <List.Item>
            <TestPlanCard
              plan={plan}
              onEdit={() => handleEdit(plan)}
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Test Plans</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsFormVisible(true)}
        >
          Create New Test Plan
        </Button>
      </div>

      <Tabs defaultActiveKey="pending">
        <TabPane tab={`Pending (${pendingPlans.length})`} key="pending">
          {renderTestPlanList(pendingPlans)}
        </TabPane>
        
        <TabPane tab={`In Progress (${inProgressPlans.length})`} key="inProgress">
          {renderTestPlanList(inProgressPlans)}
        </TabPane>
        
        <TabPane tab={`Completed (${completedPlans.length})`} key="completed">
          {renderTestPlanList(completedPlans)}
        </TabPane>
      </Tabs>

      <TestPlanForm
        visible={isFormVisible}
        onClose={handleFormClose}
        plan={editingPlan}
        students={students}
        groups={groups}
      />
    </div>
  );
};

export default TestPlanList;
