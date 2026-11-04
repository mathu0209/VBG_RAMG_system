import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  FolderKanban, 
  CreditCard, 
  ShieldAlert, 
  FileText, 
  History, 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Landmark 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/Sidebar.css';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { path: user?.role === 'ADMIN' ? '/admin' : '/supervisor', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/workers/register', label: t('workers'), icon: Users },
    { path: '/attendance', label: t('attendance'), icon: CheckSquare },
    { path: '/work-progress', label: t('works'), icon: FolderKanban },
    { path: '/wages', label: t('payments'), icon: CreditCard },
    { path: '/fraud-detection', label: t('aiFraud'), icon: ShieldAlert },
    { path: '/reports', label: t('reports'), icon: FileText },
    { path: '/gis-view', label: t('auditLogs'), icon: History },
    { path: '/settings', label: t('settings'), icon: Settings },
  ];

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <>
      <div 
        className={`sidebar-drawer-overlay ${isOpen ? 'drawer-open' : ''}`} 
        onClick={onClose} 
      />
      <aside className={`app-sidebar ${isOpen ? 'drawer-open' : ''}`}>
        <div className="sidebar-brand-box" onClick={() => navigate('/supervisor')}>
          <div className="brand-emblem">
            <Landmark size={20} />
          </div>
          <div>
            <div className="brand-title">VB–G RAM G</div>
            <div className="brand-subtitle">{lang === 'ta' ? 'ஸ்மார்ட் அமைப்பு' : 'SMART SYSTEM'}</div>
          </div>
        </div>

        <nav className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue-light)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                border: '1px solid #D1E9FF'
              }}
            >
              <User size={18} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.fullName || (lang === 'ta' ? 'ரமேஷ் குமார்' : 'Ramesh Kumar')}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>
                {user?.role === 'ADMIN' ? (lang === 'ta' ? 'மாநில நிர்வாகி' : 'State Administrator') : (lang === 'ta' ? 'மேற்பார்வையாளர்' : 'Site Supervisor')}
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="sidebar-nav-item" 
            style={{ color: 'var(--status-danger)', marginTop: '4px' }}
          >
            <LogOut size={18} />
            <span>{lang === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
