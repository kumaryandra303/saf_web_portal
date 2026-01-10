import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardHome from './DashboardHome';
import PlaceholderPage from './PlaceholderPage';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/users" element={<PlaceholderPage title="Users Management" />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports & Analytics" />} />
        <Route path="/documents" element={<PlaceholderPage title="Documents" />} />
        <Route path="/projects" element={<PlaceholderPage title="Projects" />} />
        <Route path="/calendar" element={<PlaceholderPage title="Calendar" />} />
        <Route path="/messages" element={<PlaceholderPage title="Messages" />} />
        <Route path="/database" element={<PlaceholderPage title="Database" />} />
        <Route path="/security" element={<PlaceholderPage title="Security" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;




