import React from 'react';
import { Search, Bell, Globe, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/TopNavbar.css';

export const TopNavbar = ({ title = 'Dashboard', breadcrumb = 'Overview', onMenuToggle }) => {
  const { user } = useAuth();
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="app-top-navbar">
      {/* Left: Breadcrumb & Title */}
      <div className="navbar-left">
        <button 
          className="navbar-toggle-btn"
          onClick={onMenuToggle}
          aria-label="Toggle Menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <div className="navbar-breadcrumb">
            <span>{t('tamilnadu')}</span>
            <span>•</span>
            <span style={{ color: 'var(--primary-blue)' }}>{breadcrumb}</span>
          </div>
          <h1 className="navbar-page-title">{title}</h1>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="navbar-center-search">
        <Search className="navbar-search-icon" size={18} />
        <input 
          type="text" 
          placeholder={lang === 'ta' ? 'பணியாளர்கள், வேலைத்தளங்கள், ஜாப் கார்டுகள் தேடவும்...' : 'Search workers, worksites, job cards...'} 
          aria-label="Global Search"
        />
      </div>

      {/* Right: Controls & Telemetry */}
      <div className="navbar-right-controls">
        <div className="system-live-pill">
          <span className="system-live-dot" />
          <span>{t('systemOnline')}</span>
        </div>

        <div className="language-dropdown-box">
          <Globe size={16} color="var(--primary-blue)" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)} 
            aria-label="Language Selector"
          >
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="navbar-profile-badge">
          <div className="navbar-profile-avatar">
            {user?.fullName?.charAt(0) || 'R'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="navbar-profile-name">{user?.fullName || (lang === 'ta' ? 'ரமேஷ் குமார்' : 'Ramesh Kumar')}</span>
            <span className="navbar-profile-role">
              {user?.role === 'ADMIN' ? (lang === 'ta' ? 'மாநில நிர்வாகி' : 'State Administrator') : (lang === 'ta' ? 'மேற்பார்வையாளர்' : 'Site Supervisor')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
