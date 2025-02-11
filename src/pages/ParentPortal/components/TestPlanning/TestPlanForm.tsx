import React from 'react';
import { Form, Input, Select, InputNumber, Button, message } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parentApi } from '../../../../api/parent.api';
import { ChildProfile } from '../../../../types/parent';

const { Option } = Select;

interface Props {
  children: ChildProfile[];
  onSuccess: () => void;
}

const TestPlanForm: React.FC<Props> = ({ children, onSuccess }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch subjects and question sets
  const { data: subjects, isLoading: subjectsLoading } = useQuery(
    ['subjects'],
    () => fetch('/api/subjects').then(res => res.json())
  );

  const { data: questionSets, isLoading: setsLoading } = useQuery(
    ['questionSets'],
    () => fetch('/api/question-sets').then(res => res.json())
  );

  // Create test plan mutation
  const createTestPlan = useMutation(
    (values: any) => parentApi.createTestPlan(values),
    {
      onSuccess: () => {
        message.success('Test plan created successfully');
        queryClient.invalidateQueries(['testPlans']);
        form.resetFields();
        onSuccess();
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to create test plan');
      },
    }
  );

  const handleSubmit = async (values: any) => {
    createTestPlan.mutate({
      ...values,
      questionSetIds: values.questionSetIds.map(Number),
      studentId: Number(values.studentId),
      subjectId: Number(values.subjectId)
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="max-w-3xl mx-auto"
    >
      <Form.Item
        name="studentId"
        label="Select Child"
        rules={[{ required: true, message: 'Please select a child' }]}
      >
        <Select placeholder="Select a child">
          {children.map((child) => (
            <Option key={child.id} value={child.id}>
              {child.firstName} {child.lastName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="title"
        label="Test Title"
        rules={[{ required: true, message: 'Please enter a title' }]}
      >
        <Input placeholder="Enter test title" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <Input.TextArea 
          placeholder="Enter test description"
          rows={4}
        />
      </Form.Item>

      <Form.Item
        name="subjectId"
        label="Subject"
        rules={[{ required: true, message: 'Please select a subject' }]}
      >
        <Select
          placeholder="Select a subject"
          loading={subjectsLoading}
        >
          {subjects?.map((subject: any) => (
            <Option key={subject.id} value={subject.id}>
              {subject.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="questionSetIds"
        label="Question Sets"
        rules={[{ required: true, message: 'Please select at least one question set' }]}
      >
        <Select
          mode="multiple"
          placeholder="Select question sets"
          loading={setsLoading}
        >
          {questionSets?.map((set: any) => (
            <Option key={set.id} value={set.id}>
              {set.title}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="questionsPerSet"
        label="Questions Per Set"
        rules={[{ required: true, message: 'Please enter number of questions' }]}
      >
        <InputNumber
          min={1}
          placeholder="Enter number of questions"
          className="w-full"
        />
      </Form.Item>

      <Form.Item
        name="timeLimit"
        label="Time Limit (minutes)"
      >
        <InputNumber
          min={1}
          placeholder="Enter time limit"
          className="w-full"
        />
      </Form.Item>

      <Form.Item className="mb-0">
        <div className="flex justify-end space-x-4">
          <Button onClick={onSuccess}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createTestPlan.isLoading}
          >
            Create Test Plan
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default TestPlanForm;
