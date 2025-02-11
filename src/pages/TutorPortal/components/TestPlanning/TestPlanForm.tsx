import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message, Radio } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tutorApi } from '../../../../api/tutor.api';
import { TestPlan, Student, StudyGroup } from '../../../../types/tutor';

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  plan?: TestPlan | null;
  students: Student[];
  groups: StudyGroup[];
}

const TestPlanForm: React.FC<Props> = ({
  visible,
  onClose,
  plan,
  students,
  groups,
}) => {
  const [form] = Form.useForm();
  const [assignmentType, setAssignmentType] = useState<'student' | 'group'>('student');
  const queryClient = useQueryClient();

  // Fetch available subjects
  const { data: subjects } = useQuery(
    ['subjects'],
    () => tutorApi.getSubjects(),
    { staleTime: Infinity }
  );

  // Fetch question sets based on selected subject
  const { data: questionSets } = useQuery(
    ['questionSets', form.getFieldValue('subjectId')],
    () => tutorApi.getQuestionSets(form.getFieldValue('subjectId')),
    {
      enabled: !!form.getFieldValue('subjectId'),
    }
  );

  useEffect(() => {
    if (plan) {
      form.setFieldsValue({
        ...plan,
        studentId: plan.studentId || undefined,
        groupId: plan.groupId || undefined,
      });
      setAssignmentType(plan.studentId ? 'student' : 'group');
    }
  }, [plan, form]);

  const createMutation = useMutation(
    (data: any) => tutorApi.createTestPlan(data),
    {
      onSuccess: () => {
        message.success('Test plan created successfully');
        queryClient.invalidateQueries(['testPlans']);
        form.resetFields();
        onClose();
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to create test plan');
      },
    }
  );

  const updateMutation = useMutation(
    (data: any) => tutorApi.updateTestPlan(Number(plan?.id), data),
    {
      onSuccess: () => {
        message.success('Test plan updated successfully');
        queryClient.invalidateQueries(['testPlans']);
        form.resetFields();
        onClose();
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to update test plan');
      },
    }
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        [assignmentType === 'student' ? 'groupId' : 'studentId']: undefined,
      };

      if (plan) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(data);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={plan ? 'Edit Test Plan' : 'Create New Test Plan'}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      confirmLoading={createMutation.isLoading || updateMutation.isLoading}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <Form.Item
          name="title"
          label="Test Title"
          rules={[{ required: true, message: 'Please enter a test title' }]}
        >
          <Input placeholder="Enter test title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea
            placeholder="Enter test description"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label="Assign To"
          required
        >
          <Radio.Group
            value={assignmentType}
            onChange={(e) => setAssignmentType(e.target.value)}
            className="mb-4"
          >
            <Radio.Button value="student">Individual Student</Radio.Button>
            <Radio.Button value="group">Study Group</Radio.Button>
          </Radio.Group>

          {assignmentType === 'student' ? (
            <Form.Item
              name="studentId"
              noStyle
              rules={[{ required: true, message: 'Please select a student' }]}
            >
              <Select placeholder="Select student">
                {students.map((student) => (
                  <Option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              name="groupId"
              noStyle
              rules={[{ required: true, message: 'Please select a group' }]}
            >
              <Select placeholder="Select group">
                {groups.map((group) => (
                  <Option key={group.id} value={group.id}>
                    {group.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item
          name="subjectId"
          label="Subject"
          rules={[{ required: true, message: 'Please select a subject' }]}
        >
          <Select
            placeholder="Select subject"
            onChange={() => {
              form.setFieldValue('questionSetIds', undefined);
            }}
          >
            {subjects?.map((subject) => (
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
            disabled={!form.getFieldValue('subjectId')}
          >
            {questionSets?.map((set) => (
              <Option key={set.id} value={set.id}>
                {set.name}
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
      </Form>
    </Modal>
  );
};

export default TestPlanForm;
