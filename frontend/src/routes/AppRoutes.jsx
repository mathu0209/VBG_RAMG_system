import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import SupervisorDashboard from '../pages/SupervisorDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import { WorkerRegistrationPage } from '../pages/WorkerRegistrationPage';
import { FaceCapturePage } from '../pages/FaceCapturePage';
import { MarkAttendancePage } from '../pages/MarkAttendancePage';
import { AttendancePage } from '../pages/AttendancePage';
import { WorksitePhotoPage } from '../pages/WorksitePhotoPage';
import { WorkProgressPage } from '../pages/WorkProgressPage';
import { AiFraudPage } from '../pages/AiFraudPage';
import { WorkerPortal } from '../pages/WorkerPortal';
import { BlockOfficerPortal } from '../pages/BlockOfficerPortal';
import { MasterDataPage } from '../pages/MasterDataPage';
import { WorkerManagementPage } from '../pages/WorkerManagementPage';
import { ProjectManagementPage } from '../pages/ProjectManagementPage';
import { WageManagementPage } from '../pages/WageManagementPage';
import { ComplaintPage } from '../pages/ComplaintPage';
import { GisViewPage } from '../pages/GisViewPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Approved Preserved Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Unified Enterprise AppLayout Pages */}
      <Route path="/supervisor" element={<SupervisorDashboard />} />
      <Route path="/worker-dashboard" element={<SupervisorDashboard />} />

      <Route path="/workers/register" element={<WorkerRegistrationPage />} />
      <Route path="/registration" element={<WorkerRegistrationPage />} />

      <Route path="/face-verification" element={<FaceCapturePage />} />
      <Route path="/face-capture" element={<FaceCapturePage />} />

      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/mark-attendance" element={<MarkAttendancePage />} />

      <Route path="/worksite-photo" element={<WorksitePhotoPage />} />
      <Route path="/work-progress" element={<WorkProgressPage />} />

      <Route path="/fraud-detection" element={<AiFraudPage />} />
      <Route path="/ai-fraud" element={<AiFraudPage />} />

      {/* Auxiliary Operations Modules */}
      <Route path="/worker-portal" element={<WorkerPortal />} />
      <Route path="/block-officer-portal" element={<BlockOfficerPortal />} />
      <Route path="/master-data" element={<MasterDataPage />} />
      <Route path="/workers" element={<WorkerManagementPage />} />
      <Route path="/projects" element={<ProjectManagementPage />} />
      <Route path="/wages" element={<WageManagementPage />} />
      <Route path="/complaints" element={<ComplaintPage />} />
      <Route path="/gis-view" element={<GisViewPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/settings" element={<SettingsPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
