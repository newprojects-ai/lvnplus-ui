import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Popconfirm, 
  message, 
  Tooltip, 
  Modal, 
  Select,
  Avatar,
  List 
} from 'antd';
import { 
  DeleteOutlined, 
  EditOutlined, 
  UserAddOutlined,
  BarChartOutlined,
  BookOutlined,
  UserDeleteOutlined
} from '@ant-design/icons';
import { StudyGroup, Student } from '../../../../types/tutor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorApi } from '../../../../api/tutor.api';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface Props {
  group: StudyGroup;
  onEdit: () => void;
  availableStudents: Student[];
}

const GroupCard: React.FC<Props> = ({ group, onEdit, availableStudents }) => {
  const [isAddingStudents, setIsAddingStudents] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteGroup = useMutation(
    () => tutorApi.deleteGroup(Number(group.id)),
    {
      onSuccess: () => {
        message.success('Group deleted successfully');
        queryClient.invalidateQueries(['studyGroups']);
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to delete group');
      },
    }
  );

  const addStudents = useMutation(
    (studentIds: number[]) => tutorApi.addStudentsToGroup(Number(group.id), studentIds),
    {
      onSuccess: () => {
        message.success('Students added successfully');
        queryClient.invalidateQueries(['studyGroups']);
        setIsAddingStudents(false);
        setSelectedStudents([]);
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to add students');
      },
    }
  );

  const removeStudent = useMutation(
    (studentId: number) => tutorApi.removeStudentFromGroup(Number(group.id), studentId),
    {
      onSuccess: () => {
        message.success('Student removed from group');
        queryClient.invalidateQueries(['studyGroups']);
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to remove student');
      },
    }
  );

  const handleAddStudents = () => {
    if (!selectedStudents.length) {
      message.warning('Please select at least one student');
      return;
    }
    addStudents.mutate(selectedStudents.map(id => Number(id)));
  };

  return (
    <Card
      className="w-full hover:shadow-lg transition-shadow duration-200"
      title={group.name}
      actions={[
        <Tooltip title="View Performance">
          <Button
            type="text"
            icon={<BarChartOutlined />}
            onClick={() => navigate(`/tutor/groups/${group.id}/performance`)}
          />
        </Tooltip>,
        <Tooltip title="Create Test">
          <Button
            type="text"
            icon={<BookOutlined />}
            onClick={() => navigate(`/tutor/test-plans/new?groupId=${group.id}`)}
          />
        </Tooltip>,
        <Tooltip title="Add Students">
          <Button
            type="text"
            icon={<UserAddOutlined />}
            onClick={() => setIsAddingStudents(true)}
          />
        </Tooltip>,
        <Tooltip title="Edit Group">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={onEdit}
          />
        </Tooltip>,
        <Popconfirm
          title="Are you sure you want to delete this group?"
          onConfirm={() => deleteGroup.mutate()}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deleteGroup.isLoading}
          />
        </Popconfirm>,
      ]}
    >
      <div className="space-y-4">
        {group.description && (
          <p className="text-gray-500">{group.description}</p>
        )}

        <div>
          <h4 className="font-medium mb-2">Students ({group.students.length})</h4>
          <List
            dataSource={group.students}
            renderItem={student => (
              <List.Item
                actions={[
                  <Popconfirm
                    title="Remove student from group?"
                    onConfirm={() => removeStudent.mutate(Number(student.id))}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      icon={<UserDeleteOutlined />}
                      danger
                      size="small"
                    />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar>
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </Avatar>
                  }
                  title={`${student.firstName} ${student.lastName}`}
                />
              </List.Item>
            )}
          />
        </div>
      </div>

      <Modal
        title="Add Students to Group"
        open={isAddingStudents}
        onOk={handleAddStudents}
        onCancel={() => {
          setIsAddingStudents(false);
          setSelectedStudents([]);
        }}
        confirmLoading={addStudents.isLoading}
      >
        <Select
          mode="multiple"
          placeholder="Select students to add"
          value={selectedStudents}
          onChange={setSelectedStudents}
          className="w-full"
          optionFilterProp="children"
        >
          {availableStudents.map((student) => (
            <Option key={student.id} value={student.id}>
              {student.firstName} {student.lastName}
            </Option>
          ))}
        </Select>
      </Modal>
    </Card>
  );
};

export default GroupCard;
