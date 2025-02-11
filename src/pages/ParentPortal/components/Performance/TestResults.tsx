import React from 'react';
import { Table, Tag, Skeleton, Empty } from 'antd';
import { TestExecution } from '../../../../types/parent';
import dayjs from 'dayjs';

interface Props {
  testHistory?: TestExecution[];
  isLoading: boolean;
}

const TestResults: React.FC<Props> = ({ testHistory, isLoading }) => {
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
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => score ? `${score}%` : '-',
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
    },
    {
      title: 'Started',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (date: string) => dayjs(date).format('MMM D, YYYY HH:mm'),
    },
    {
      title: 'Completed',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date: string) => date ? dayjs(date).format('MMM D, YYYY HH:mm') : '-',
    },
  ];

  return (
    <Table
      dataSource={testHistory}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
      }}
      className="mt-4"
    />
  );
};

export default TestResults;
