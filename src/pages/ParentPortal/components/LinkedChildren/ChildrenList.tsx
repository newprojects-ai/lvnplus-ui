import React from 'react';
import { List, Card, Skeleton, Empty } from 'antd';
import ChildCard from './ChildCard';
import { ChildProfile } from '../../../../types/parent';

interface Props {
  children: ChildProfile[];
  isLoading: boolean;
}

const LinkedChildrenList: React.FC<Props> = ({ children, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((key) => (
          <Card key={key} className="w-full">
            <Skeleton active />
          </Card>
        ))}
      </div>
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
      dataSource={children}
      renderItem={(child) => (
        <List.Item>
          <ChildCard child={child} />
        </List.Item>
      )}
    />
  );
};

export default LinkedChildrenList;
