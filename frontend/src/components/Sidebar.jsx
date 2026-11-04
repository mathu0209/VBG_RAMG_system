import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Briefcase, 
  CreditCard, 
  ShieldAlert, 
  BarChart3, 
  History, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Building2
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/supervisor', icon: LayoutDashboard },
  { name: 'Workers', path: '/registration', icon: Users },
  { name: 'Attendance', path: '/mark-attendance', icon: ClipboardCheck },
  { name: 'Works', path: '/work-progress', icon: Briefcase },
  { name: 'Payments', path: '/wages', icon: CreditCard },
  { name: 'AI Detection', path: '/ai-fraud', icon: ShieldAlert },
  { name: 'Audit Logs', path: '/gis-view', icon: History },
  { name: 'Settings', path: '/supervisor', icon: Settings }
];

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'mobile-open' : ''}`}
        onClick={onClose}
      />
      <aside className={`dashboard-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          {/* Top Logo */}
          <div className="sidebar-logo" onClick={() => handleNavigation('/supervisor')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon-box">
              <Building2 size={22} />
            </div>
            <div>
              <div className="logo-text-title">VB–G RAM G</div>
              <div className="logo-text-sub">SMART SYSTEM</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/supervisor' && (location.pathname === '/' || location.pathname === '/supervisor'));
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-item-icon">
                    <Icon size={18} />
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => handleNavigation('/supervisor')}>
            <span className="nav-item-icon">
              <User size={18} />
            </span>
            <span>Profile</span>
          </button>
          <button className="nav-item" style={{ color: 'var(--danger)' }} onClick={() => handleNavigation('/login')}>
            <span className="nav-item-icon">
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
