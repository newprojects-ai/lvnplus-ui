import React from 'react';
import { Card, Tag, Button, Popconfirm, message } from 'antd';
import { 
  DeleteOutlined, 
  EditOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { TestPlan } from '../../../../types/parent';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parentApi } from '../../../../api/parent.api';
import { useNavigate } from 'react-router-dom';

interface Props {
  plan: TestPlan;
}

const TestPlanCard: React.FC<Props> = ({ plan }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    () => parentApi.deleteTestPlan(Number(plan.id)),
    {
      onSuccess: () => {
        message.success('Test plan deleted successfully');
        queryClient.invalidateQueries(['testPlans']);
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to delete test plan');
      },
    }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'processing';
      default:
        return 'default';
    }
  };

  return (
    <Card
      className="w-full hover:shadow-lg transition-shadow duration-200"
      actions={[
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => navigate(`/parent/test-plans/${plan.id}/edit`)}
        />,
        <Popconfirm
          title="Are you sure you want to delete this test plan?"
          onConfirm={() => deleteMutation.mutate()}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            icon={<DeleteOutlined />}
            loading={deleteMutation.isLoading}
          />
        </Popconfirm>,
      ]}
    >
      <Card.Meta
        title={
          <div className="flex justify-between items-center">
            <span>{plan.title}</span>
            <Tag color={getStatusColor(plan.status)}>{plan.status}</Tag>
          </div>
        }
        description={
          <div className="space-y-2 mt-3">
            {plan.description && (
              <div className="text-gray-500">{plan.description}</div>
            )}
            
            <div className="flex items-center space-x-2">
              <UserOutlined className="text-gray-400" />
              <span>Assigned to: {plan.studentId}</span>
            </div>

            {plan.timeLimit && (
              <div className="flex items-center space-x-2">
                <ClockCircleOutlined className="text-gray-400" />
                <span>Time Limit: {plan.timeLimit} minutes</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <CheckCircleOutlined className="text-gray-400" />
              <span>Questions: {plan.configuration.questionsPerSet} per set</span>
            </div>

            <div className="mt-3">
              <Button
                type="link"
                onClick={() => navigate(`/parent/test-plans/${plan.id}/results`)}
                className="p-0"
              >
                View Results
              </Button>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default TestPlanCard;
