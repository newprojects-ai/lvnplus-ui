import React, { useState } from 'react';
import { List, Card, Button, Modal, Input, message, Empty, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StudentCard from './StudentCard';
import { Student } from '../../../../types/tutor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorApi } from '../../../../api/tutor.api';

interface Props {
  students: Student[];
  isLoading: boolean;
}

const StudentList: React.FC<Props> = ({ students, isLoading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [studentId, setStudentId] = useState('');
  const queryClient = useQueryClient();

  const linkStudent = useMutation(
    (id: number) => tutorApi.linkStudent(id),
    {
      onSuccess: () => {
        message.success('Student linked successfully');
        queryClient.invalidateQueries(['linkedStudents']);
        setIsModalVisible(false);
        setStudentId('');
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to link student');
      },
    }
  );

  const handleLink = () => {
    if (!studentId) {
      message.error('Please enter a student ID');
      return;
    }
    linkStudent.mutate(Number(studentId));
  };

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Students</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Link New Student
        </Button>
      </div>

      {!students.length ? (
        <Empty
          description="No students linked to your account"
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
          dataSource={students}
          renderItem={(student) => (
            <List.Item>
              <StudentCard student={student} />
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Link New Student"
        open={isModalVisible}
        onOk={handleLink}
        onCancel={() => {
          setIsModalVisible(false);
          setStudentId('');
        }}
        confirmLoading={linkStudent.isLoading}
      >
        <div className="space-y-4">
          <p>Enter the student's ID to link them to your account:</p>
          <Input
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            type="number"
          />
        </div>
      </Modal>
    </div>
  );
};

export default StudentList;
