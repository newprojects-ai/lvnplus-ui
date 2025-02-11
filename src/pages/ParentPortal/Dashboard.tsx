import React, { useState } from 'react';
import { Tabs, Layout } from 'antd';
import LinkedChildrenList from './components/LinkedChildren/ChildrenList';
import TestPlanList from './components/TestPlanning/TestPlanList';
import ChildProgress from './components/Performance/ChildProgress';
import { useQuery } from '@tanstack/react-query';
import { parentApi } from '../../api/parent.api';

const { Content } = Layout;
const { TabPane } = Tabs;

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');

  // Fetch linked children
  const { data: children, isLoading: childrenLoading } = useQuery(
    ['linkedChildren'],
    () => parentApi.getLinkedChildren()
  );

  // Fetch test plans
  const { data: testPlans, isLoading: plansLoading } = useQuery(
    ['testPlans'],
    () => parentApi.getTestPlans()
  );

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Parent Dashboard</h1>
          
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="My Children" key="1">
              <LinkedChildrenList 
                children={children || []}
                isLoading={childrenLoading}
              />
            </TabPane>
            
            <TabPane tab="Test Plans" key="2">
              <TestPlanList 
                testPlans={testPlans || []}
                isLoading={plansLoading}
                children={children || []}
              />
            </TabPane>
            
            <TabPane tab="Performance Tracking" key="3">
              <ChildProgress 
                children={children || []}
                isLoading={childrenLoading}
              />
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  );
};

export default ParentDashboard;
