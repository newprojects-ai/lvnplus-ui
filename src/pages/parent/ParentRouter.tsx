import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ParentDashboard } from './ParentDashboard';
import { ParentSubjectSelection } from './test-creation/ParentSubjectSelection';
import { ParentPracticeTests } from './test-creation/ParentPracticeTests';
import { ParentTestConfig } from './test-creation/ParentTestConfig';
import { ParentTestConfirmation } from './test-creation/ParentTestConfirmation';
import { ParentTestPlans } from './ParentTestPlans';

export function ParentRouter() {
  return (
    <Routes>
      <Route path="/" element={<ParentDashboard />} />
      <Route path="/test-creation" element={<ParentSubjectSelection />} />
      <Route path="/test-creation/practice/tests/:subjectId" element={<ParentPracticeTests />} />
      <Route path="/test-creation/practice/tests/:testType/:subjectId" element={<ParentTestConfig />} />
      <Route path="/test-creation/:subjectId/review" element={<ParentTestConfirmation />} />
      <Route path="/test-plans" element={<ParentTestPlans />} />
    </Routes>
  );
}
