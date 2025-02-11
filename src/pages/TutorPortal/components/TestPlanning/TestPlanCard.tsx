import React from 'react';
import { Card, Tag, Button, Popconfirm, message, Tooltip, Badge } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons';
import { TestPlan } from '../../../../types/tutor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorApi } from '../../../../api/tutor.api';
import { useNavigate } from 'react-router-dom';

interface Props {
  plan: TestPlan;
  onEdit: () => void;
}

const TestPlanCard: React.FC<Props> = ({ plan, onEdit }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    () => tutorApi.deleteTestPlan(Number(plan.id)),
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
      case 'PENDING':
        return 'default';
      default:
        return 'default';
    }
  };

  const renderAssignedTo = () => {
    if (plan.studentId) {
      const student = plan.students?.[0];
      return (
        <div className="flex items-center space-x-2">
          <UserOutlined className="text-gray-400" />
          <span>
            {student ? `${student.firstName} ${student.lastName}` : 'Loading...'}
          </span>
        </div>
      );
    }

    if (plan.groupId) {
      const group = plan.group;
      return (
        <div className="flex items-center space-x-2">
          <TeamOutlined className="text-gray-400" />
          <span>{group ? group.name : 'Loading...'}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <Card
      className="w-full hover:shadow-lg transition-shadow duration-200"
      actions={[
        <Tooltip title="View Results">
          <Button
            type="text"
            icon={<BarChartOutlined />}
            onClick={() => navigate(`/tutor/test-plans/${plan.id}/results`)}
          />
        </Tooltip>,
        <Tooltip title="Edit Plan">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={onEdit}
            disabled={plan.status !== 'PENDING'}
          />
        </Tooltip>,
        <Popconfirm
          title="Are you sure you want to delete this test plan?"
          onConfirm={() => deleteMutation.mutate()}
          okText="Yes"
          cancelText="No"
          disabled={plan.status !== 'PENDING'}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deleteMutation.isLoading}
            disabled={plan.status !== 'PENDING'}
          />
        </Popconfirm>,
      ]}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <Badge status={getStatusColor(plan.status) as any} />
              <span className="text-lg font-medium">{plan.title}</span>
            </div>
            {plan.description && (
              <p className="text-gray-500 mt-2">{plan.description}</p>
            )}
          </div>
          <Tag color={getStatusColor(plan.status)}>{plan.status}</Tag>
        </div>

        <div className="space-y-2">
          {renderAssignedTo()}

          <div className="flex items-center space-x-2">
            <BookOutlined className="text-gray-400" />
            <span>
              {plan.configuration.questionSetIds.length} sets,{' '}
              {plan.configuration.questionsPerSet} questions per set
            </span>
          </div>

          {plan.timeLimit && (
            <div className="flex items-center space-x-2">
              <ClockCircleOutlined className="text-gray-400" />
              <span>Time Limit: {plan.timeLimit} minutes</span>
            </div>
          )}
        </div>

        {plan.status === 'COMPLETED' && (
          <div className="mt-4">
            <Button
              type="link"
              onClick={() => navigate(`/tutor/test-plans/${plan.id}/results`)}
              className="p-0"
            >
              View Results
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TestPlanCard;
