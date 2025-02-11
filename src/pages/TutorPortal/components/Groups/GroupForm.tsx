import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorApi } from '../../../../api/tutor.api';
import { StudyGroup, Student } from '../../../../types/tutor';

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  group?: StudyGroup | null;
  availableStudents: Student[];
}

const GroupForm: React.FC<Props> = ({
  visible,
  onClose,
  group,
  availableStudents,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    (data: { name: string; description?: string; studentIds: number[] }) =>
      tutorApi.createGroup(data),
    {
      onSuccess: () => {
        message.success('Group created successfully');
        queryClient.invalidateQueries(['studyGroups']);
        form.resetFields();
        onClose();
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to create group');
      },
    }
  );

  const updateMutation = useMutation(
    (data: { id: number; name: string; description?: string }) =>
      tutorApi.updateGroup(data.id, {
        name: data.name,
        description: data.description,
      }),
    {
      onSuccess: () => {
        message.success('Group updated successfully');
        queryClient.invalidateQueries(['studyGroups']);
        form.resetFields();
        onClose();
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to update group');
      },
    }
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (group) {
        updateMutation.mutate({
          id: Number(group.id),
          ...values,
        });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={group ? 'Edit Study Group' : 'Create New Study Group'}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={group || {}}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Group Name"
          rules={[{ required: true, message: 'Please enter a group name' }]}
        >
          <Input placeholder="Enter group name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea
            placeholder="Enter group description"
            rows={4}
          />
        </Form.Item>

        {!group && (
          <Form.Item
            name="studentIds"
            label="Add Students"
            rules={[{ required: true, message: 'Please select at least one student' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select students"
              className="w-full"
              optionFilterProp="children"
            >
              {availableStudents.map((student) => (
                <Option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default GroupForm;
