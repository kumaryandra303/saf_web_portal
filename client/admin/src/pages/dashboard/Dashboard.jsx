import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardHome from './DashboardHome';
import SAFMembers from './SAFMembers';
import SAFUpdates from './SAFUpdates';
import SAFDonations from './SAFDonations';
import Reports from './Reports';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/members" element={<SAFMembers />} />
        <Route path="/updates" element={<SAFUpdates />} />
        <Route path="/donations" element={<SAFDonations />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;




