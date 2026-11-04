import React from 'react';
import Login from '../pages/Login';
import SupervisorDashboard from '../pages/SupervisorDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { WorkerRegistrationPage } from '../pages/WorkerRegistrationPage';
import { FaceCapturePage } from '../pages/FaceCapturePage';
import { MarkAttendancePage } from '../pages/MarkAttendancePage';
import { WorksitePhotoPage } from '../pages/WorksitePhotoPage';
import { WorkProgressPage } from '../pages/WorkProgressPage';
import { AiFraudPage } from '../pages/AiFraudPage';
import { useLanguage } from '../context/LanguageContext';

export const NineScreenGridView = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-slate-950 p-6 md:p-8 min-h-screen text-slate-100 space-y-8 font-sans">
      
      {/* Title Header */}
      <div className="text-center space-y-2 border-b border-slate-800 pb-6 max-w-4xl mx-auto">
        <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest">
          SYSTEM MODULES SHOWCASE
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          VB–G RAM G SMART RURAL SYSTEM — 9-MODULE GRID VIEW
        </h1>
        <p className="text-sm text-slate-400 font-semibold">
          Strict 9-Module Architectural Alignment (Screens 1 to 9)
        </p>
      </div>

      {/* Grid of 9 Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Module 1: Login Screen */}
        <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-3">
          <div className="bg-blue-600 px-3.5 py-1.5 rounded-xl text-xs font-black text-white inline-block shadow-md">
            1. Login Portal (All Roles)
          </div>
          <div className="transform scale-[0.80] origin-top border border-slate-800 rounded-2xl overflow-hidden max-h-[480px]">
            <Login />
          </div>
        </div>

        {/* Module 2: Supervisor Dashboard */}
        <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-3">
          <div className="bg-blue-600 px-3.5 py-1.5 rounded-xl text-xs font-black text-white inline-block shadow-md">
            2. Supervisor Portal (Mate / GRS)
          </div>
          <div className="transform scale-[0.80] origin-top border border-slate-800 rounded-2xl overflow-hidden max-h-[480px]">
            <SupervisorDashboard />
          </div>
        </div>

        {/* Module 3: Admin Dashboard */}
        <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-3">
          <div className="bg-blue-600 px-3.5 py-1.5 rounded-xl text-xs font-black text-white inline-block shadow-md">
            3. Admin Dashboard (Master Web)
          </div>
          <div className="transform scale-[0.80] origin-top border border-slate-800 rounded-2xl overflow-hidden max-h-[480px] overflow-y-auto">
            <AdminDashboard />
          </div>
        </div>

        {/* Module 4: Worker Registration */}
        <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-3">
          <div className="bg-blue-600 px-3.5 py-1.5 rounded-xl text-xs font-black text-white inline-block shadow-md">
            4. Worker Registration Portal
          </div>
          <div className="transform scale-[0.80] origin-top border border-slate-800 rounded-2xl overflow-hidden max-h-[480px]">
            <WorkerRegistrationPage />
          </div>
        </div>

        {/* Module 5: Face Capture */}
        <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-3">
          <div className="bg-blue-600 px-3.5 py-1.5 rounded-xl text-xs font-black text-white inline-block shadow-md">
            5. Biometric Face Verification
          </div>
          <div className="transform scale-[0.80] origin-top border border-slate-800 rounded-2xl overflow-hidden max-h-[480px]">
            <FaceCapturePage />
          </div>
        </div>

        {/* Module 6: Mark Attendance */}
        <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-3">
          <div className="bg-blue-600 px-3.5 py-1.5 rounded-xl text-xs font-black text-white inline-block shadow-md">
            6. Site Attendance Verification
          </div>
          <div className="transform scale-[0.80] origin-top border border-slate-800 rounded-2xl overflow-hidden max-h-[480px]">
            <MarkAttendancePage />
          </div>
        </div>

        {/* Module 7: Worksite Photo Capture */}
        <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-3">
          <div className="bg-blue-600 px-3.5 py-1.5 rounded-xl text-xs font-black text-white inline-block shadow-md">
            7. Geotag Worksite Photo
          </div>
          <div className="transform scale-[0.80] origin-top border border-slate-800 rounded-2xl overflow-hidden max-h-[480px]">
            <WorksitePhotoPage />
          </div>
        </div>

        {/* Module 8: Work Progress */}
        <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-3">
          <div className="bg-blue-600 px-3.5 py-1.5 rounded-xl text-xs font-black text-white inline-block shadow-md">
            8. Real-Time Work Inspection
          </div>
          <div className="transform scale-[0.80] origin-top border border-slate-800 rounded-2xl overflow-hidden max-h-[480px]">
            <WorkProgressPage />
          </div>
        </div>

        {/* Module 9: AI Fraud Detection */}
        <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-3">
          <div className="bg-blue-600 px-3.5 py-1.5 rounded-xl text-xs font-black text-white inline-block shadow-md">
            9. AI Fraud Detection & Audit
          </div>
          <div className="transform scale-[0.80] origin-top border border-slate-800 rounded-2xl overflow-hidden max-h-[480px]">
            <AiFraudPage />
          </div>
        </div>

      </div>
    </div>
  );
};
