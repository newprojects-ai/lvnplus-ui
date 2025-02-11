import React from 'react';
import { Table, Tag, Button, Skeleton, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { TestExecution } from '../../../../types/tutor';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface Props {
  testHistory: TestExecution[];
  isLoading: boolean;
}

const TestResults: React.FC<Props> = ({ testHistory, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!testHistory?.length) {
    return (
      <Empty
        description="No test results available"
        className="my-8"
      />
    );
  }

  const columns = [
    {
      title: 'Test Title',
      dataIndex: ['testPlan', 'title'],
      key: 'title',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        switch (status) {
          case 'COMPLETED':
            color = 'success';
            break;
          case 'IN_PROGRESS':
            color = 'processing';
            break;
          case 'NOT_STARTED':
            color = 'default';
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: 'Completed', value: 'COMPLETED' },
        { text: 'In Progress', value: 'IN_PROGRESS' },
        { text: 'Not Started', value: 'NOT_STARTED' },
      ],
      onFilter: (value: string, record: TestExecution) => record.status === value,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => {
        if (!score) return '-';
        let color = 'green';
        if (score < 60) color = 'red';
        else if (score < 80) color = 'orange';
        return <Tag color={color}>{score}%</Tag>;
      },
      sorter: (a: TestExecution, b: TestExecution) => (a.score || 0) - (b.score || 0),
    },
    {
      title: 'Time Taken',
      key: 'duration',
      render: (record: TestExecution) => {
        if (!record.duration) return '-';
        const minutes = Math.floor(record.duration / 60);
        const seconds = record.duration % 60;
        return `${minutes}m ${seconds}s`;
      },
      sorter: (a: TestExecution, b: TestExecution) => (a.duration || 0) - (b.duration || 0),
    },
    {
      title: 'Questions',
      key: 'questions',
      render: (record: TestExecution) => {
        const total = record.answers.length;
        const correct = record.answers.filter(a => a.isCorrect).length;
        return `${correct}/${total}`;
      },
    },
    {
      title: 'Started',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (date: string) => dayjs(date).format('MMM D, YYYY HH:mm'),
      sorter: (a: TestExecution, b: TestExecution) =>
        dayjs(a.startedAt).unix() - dayjs(b.startedAt).unix(),
    },
    {
      title: 'Completed',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date: string) => date ? dayjs(date).format('MMM D, YYYY HH:mm') : '-',
      sorter: (a: TestExecution, b: TestExecution) => {
        if (!a.completedAt) return -1;
        if (!b.completedAt) return 1;
        return dayjs(a.completedAt).unix() - dayjs(b.completedAt).unix();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: TestExecution) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/tutor/test-executions/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={testHistory}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} tests`,
      }}
      className="mt-4"
      scroll={{ x: true }}
    />
  );
};

export default TestResults;
