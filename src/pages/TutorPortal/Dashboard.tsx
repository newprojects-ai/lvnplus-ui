import React, { useState } from 'react';
import { Tabs, Layout } from 'antd';
import StudentList from './components/Students/StudentList';
import GroupList from './components/Groups/GroupList';
import TestPlanList from './components/TestPlanning/TestPlanList';
import StudentProgress from './components/Performance/StudentProgress';
import { useQuery } from '@tanstack/react-query';
import { tutorApi } from '../../api/tutor.api';

const { Content } = Layout;
const { TabPane } = Tabs;

const TutorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');

  // Fetch linked students
  const { data: students, isLoading: studentsLoading } = useQuery(
    ['linkedStudents'],
    () => tutorApi.getLinkedStudents()
  );

  // Fetch study groups
  const { data: groups, isLoading: groupsLoading } = useQuery(
    ['studyGroups'],
    () => tutorApi.getGroups()
  );

  // Fetch test plans
  const { data: testPlans, isLoading: plansLoading } = useQuery(
    ['testPlans'],
    () => tutorApi.getTestPlans()
  );

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Tutor Dashboard</h1>
          
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="My Students" key="1">
              <StudentList 
                students={students || []}
                isLoading={studentsLoading}
              />
            </TabPane>
            
            <TabPane tab="Study Groups" key="2">
              <GroupList 
                groups={groups || []}
                students={students || []}
                isLoading={groupsLoading}
              />
            </TabPane>
            
            <TabPane tab="Test Plans" key="3">
              <TestPlanList 
                testPlans={testPlans || []}
                students={students || []}
                groups={groups || []}
                isLoading={plansLoading}
              />
            </TabPane>
            
            <TabPane tab="Performance Tracking" key="4">
              <StudentProgress 
                students={students || []}
                groups={groups || []}
                isLoading={studentsLoading || groupsLoading}
              />
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  );
};

export default TutorDashboard;
