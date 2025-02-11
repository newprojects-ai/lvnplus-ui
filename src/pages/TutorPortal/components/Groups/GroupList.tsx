import React, { useState } from 'react';
import { List, Button, Empty, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GroupCard from './GroupCard';
import GroupForm from './GroupForm';
import { StudyGroup, Student } from '../../../../types/tutor';

interface Props {
  groups: StudyGroup[];
  students: Student[];
  isLoading: boolean;
}

const GroupList: React.FC<Props> = ({ groups, students, isLoading }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StudyGroup | null>(null);

  const handleEdit = (group: StudyGroup) => {
    setEditingGroup(group);
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setEditingGroup(null);
  };

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Study Groups</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsFormVisible(true)}
        >
          Create New Group
        </Button>
      </div>

      {!groups.length ? (
        <Empty
          description="No study groups created yet"
          className="my-8"
        />
      ) : (
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
          dataSource={groups}
          renderItem={(group) => (
            <List.Item>
              <GroupCard 
                group={group} 
                onEdit={() => handleEdit(group)}
                availableStudents={students.filter(
                  student => !group.students.find(s => s.id === student.id)
                )}
              />
            </List.Item>
          )}
        />
      )}

      <GroupForm
        visible={isFormVisible}
        onClose={handleFormClose}
        group={editingGroup}
        availableStudents={students.filter(student => 
          !editingGroup?.students.find(s => s.id === student.id)
        )}
      />
    </div>
  );
};

export default GroupList;
