import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import '../../styles/global.css';
import '../../styles/AppLayout.css';

export const AppLayout = ({ children, title = 'Dashboard', breadcrumb = 'Overview' }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-layout-root">
      {/* 240px Fixed Sidebar */}
      <Sidebar 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />

      {/* Main Content Area (Offset by 240px) */}
      <div className="app-main-wrapper">
        {/* 72px Top Navbar */}
        <TopNavbar 
          title={title} 
          breadcrumb={breadcrumb} 
          onMenuToggle={() => setDrawerOpen(!drawerOpen)} 
        />

        {/* Max 1600px Content Container */}
        <main className="app-content-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
