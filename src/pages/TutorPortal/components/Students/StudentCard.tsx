import React from 'react';
import { Card, Tag, Button, Popconfirm, message, Tooltip } from 'antd';
import { 
  DeleteOutlined, 
  BarChartOutlined,
  BookOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Student } from '../../../../types/tutor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorApi } from '../../../../api/tutor.api';
import { useNavigate } from 'react-router-dom';

interface Props {
  student: Student;
}

const StudentCard: React.FC<Props> = ({ student }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const unlinkStudent = useMutation(
    () => tutorApi.unlinkStudent(Number(student.id)),
    {
      onSuccess: () => {
        message.success('Student unlinked successfully');
        queryClient.invalidateQueries(['linkedStudents']);
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to unlink student');
      },
    }
  );

  return (
    <Card
      className="w-full hover:shadow-lg transition-shadow duration-200"
      actions={[
        <Tooltip title="View Performance">
          <Button
            type="text"
            icon={<BarChartOutlined />}
            onClick={() => navigate(`/tutor/students/${student.id}/performance`)}
          />
        </Tooltip>,
        <Tooltip title="Assign Test">
          <Button
            type="text"
            icon={<BookOutlined />}
            onClick={() => navigate(`/tutor/test-plans/new?studentId=${student.id}`)}
          />
        </Tooltip>,
        <Tooltip title="Add to Group">
          <Button
            type="text"
            icon={<UsergroupAddOutlined />}
            onClick={() => navigate(`/tutor/groups/new?studentId=${student.id}`)}
          />
        </Tooltip>,
        <Popconfirm
          title="Are you sure you want to unlink this student?"
          onConfirm={() => unlinkStudent.mutate()}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={unlinkStudent.isLoading}
          />
        </Popconfirm>,
      ]}
    >
      <Card.Meta
        title={`${student.firstName} ${student.lastName}`}
        description={
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Email: </span>
              <span>{student.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Grade: </span>
              <span>{student.gradeLevel}</span>
            </div>
            <div>
              <span className="text-gray-500">School: </span>
              <span>{student.school}</span>
            </div>
            <div>
              <span className="text-gray-500">Curriculum: </span>
              <span>{student.curriculum}</span>
            </div>
            <div className="mt-2">
              {student.subjects.map((subject) => (
                <Tag key={subject.id} color="blue" className="mr-1 mb-1">
                  {subject.name} - {subject.proficiencyLevel}
                </Tag>
              ))}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default StudentCard;
