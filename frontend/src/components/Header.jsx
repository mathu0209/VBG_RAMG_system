import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

export const Header = ({ onToggleMobileSidebar }) => {
  return (
    <header className="dashboard-header">
      {/* Left: Title and Breadcrumb */}
      <div className="header-left">
        <button 
          className="mobile-menu-toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Navigation"
        >
          <Menu size={24} />
        </button>
        <div className="header-title-group">
          <h1>Dashboard</h1>
          <div className="header-breadcrumb">Home / Dashboard</div>
        </div>
      </div>

      {/* Center: Search Input */}
      <div className="header-search">
        <Search className="header-search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search workers, worksites..." 
          aria-label="Search workers, worksites"
        />
      </div>

      {/* Right: Status Badge, Notifications, User Profile */}
      <div className="header-right">
        <div className="system-status-badge">
          <span className="status-dot"></span>
          <span>System Online</span>
        </div>

        <div className="header-profile">
          <div className="profile-avatar">RK</div>
          <div className="profile-info">
            <span className="profile-name">Ramesh Kumar</span>
            <span className="profile-role">Site Supervisor</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
