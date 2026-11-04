import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  IndianRupee, 
  ArrowRight, 
  CheckSquare, 
  Calendar,
  MapPin,
  Eye,
  Camera
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import ActivityTimeline from '../components/ActivityTimeline';
import ImageViewModal from '../components/common/ImageViewModal';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { useLocation } from '../context/LocationContext';

const DEFAULT_WORKSITE_PHOTO = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

export const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { dateString, timeString, fullDateString } = useCurrentTime();
  const { approvedWorksiteLocation, locationDisplayString, isWithinGeofence, currentDistance, currentUserLocation } = useLocation();

  const [registeredWorkers, setRegisteredWorkers] = useState(() => {
    return JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
  });

  const [worksitePhotoUrl, setWorksitePhotoUrl] = useState(() => {
    return localStorage.getItem('latestWorksitePhoto') || DEFAULT_WORKSITE_PHOTO;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedWorkers = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
      setRegisteredWorkers(storedWorkers);

      const storedPhoto = localStorage.getItem('latestWorksitePhoto');
      if (storedPhoto) {
        setWorksitePhotoUrl(storedPhoto);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const totalWorkers = registeredWorkers.length;
  const presentToday = registeredWorkers.length;
  const attendanceRate = totalWorkers > 0 ? ((presentToday / totalWorkers) * 100).toFixed(1) : '0.0';
  const todaysWage = (presentToday * 310).toLocaleString('ta-IN');

  const workProgressItems = [
    { title: 'குளம் தூர்வாருதல் & சீரமைத்தல்', percent: 75 },
    { title: 'கிராமப்புற சாலை பராமரிப்பு', percent: 60 },
    { title: 'கால்வாய் வடிகால் தூர்வாருதல்', percent: 90 }
  ];

  return (
    <AppLayout title="மேற்பார்வையாளர் முகப்பு" breadcrumb="மேற்பார்வையாளர்">
      {/* Top Header Banner */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">வணக்கம், ரமேஷ் குமார்</h2>
          <p className="page-header-subtitle">உங்களுக்கு ஒதுக்கப்பட்ட கிராமப்புற வேலைவாய்ப்பு நடவடிக்கைகளை கண்காணிக்கவும்.</p>
        </div>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #EAECF0',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <Calendar size={16} color="var(--primary-blue)" />
          <span style={{ padding: '2px 8px', backgroundColor: 'var(--primary-blue-light)', color: 'var(--primary-blue)', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
            நேரலை
          </span>
          <span>{dateString} • {timeString}</span>
        </div>
      </div>

      {/* 4 Stat Cards Row - Dynamic Tamil Calculations */}
      <div className="grid-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard 
            icon={<Users size={20} />} 
            label="மொத்த பணியாளர்கள்" 
            value={totalWorkers.toString()} 
            secondaryInfo={`${registeredWorkers.length > 0 ? `+${registeredWorkers.length} புதிய நபர்கள் பதிவு` : 'பதிவு செய்யப்பட்ட பணியாளர்கள்'}`} 
          />
        </div>
        <div className="col-span-3">
          <StatCard 
            icon={<UserCheck size={20} />} 
            label="இன்று வருகை தந்தோர்" 
            value={presentToday.toString()} 
            secondaryInfo={`${attendanceRate}% வருகை சதவீதம்`} 
          />
        </div>
        <div className="col-span-3">
          <StatCard 
            icon={<TrendingUp size={20} />} 
            label="வருகை சதவீதம்" 
            value={`${attendanceRate}%`} 
            secondaryInfo="நேற்றை விட +4.2% அதிகம்" 
          />
        </div>
        <div className="col-span-3">
          <StatCard 
            icon={<IndianRupee size={20} />} 
            label="இன்றைய மொத்த ஊதியம்" 
            value={`₹${todaysWage}`} 
            secondaryInfo={`${presentToday} பணியாளர்களுக்கு கணக்கிடப்பட்டது`} 
          />
        </div>
      </div>

      {/* 60 / 40 Main Content Grid */}
      <div className="grid-12" style={{ marginBottom: '24px' }}>
        {/* Left 60%: Assigned Worksite (col-span-7) */}
        <div className="col-span-7">
          <div className="app-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>ஒதுக்கப்பட்ட வேலைத்தளம் & புகைப்பட சான்று</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-blue)', backgroundColor: 'var(--primary-blue-light)', padding: '4px 10px', borderRadius: '12px' }}>
                  {isWithinGeofence ? '● தளத்தில் உள்ளார்' : '● GPS சரிபார்க்கப்பட்டது'}
                </span>
              </div>

              {/* Dynamic Live Geotagged Photo Preview Card */}
              <div 
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  position: 'relative',
                  backgroundColor: '#0F172A',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
                onClick={() => setIsModalOpen(true)}
              >
                <img 
                  src={worksitePhotoUrl} 
                  alt="வேலைத்தள புவிசார் புகைப்படம்" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.src = DEFAULT_WORKSITE_PHOTO; }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={13} />
                  <span>புகைப்படத்தை பெரிதாக்கி காண்க</span>
                </div>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '16px' }}>
                குளம் தூர்வாருதல் & சீரமைத்தல்
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '14px', backgroundColor: '#F9FAFB', borderRadius: '10px', border: '1px solid #EAECF0', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>வேலைத்தள குறியீடு</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{approvedWorksiteLocation.code}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>GPS தொலைஅளவியல்</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--primary-blue)" />
                    <span>{locationDisplayString}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>தளத்திற்கான தூரம்</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: isWithinGeofence ? 'var(--status-success)' : 'var(--status-warning)', marginTop: '2px' }}>
                    {currentDistance} மீட்டர்
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ஒட்டுமொத்த பணி நிறைவு</span>
                  <span style={{ color: 'var(--primary-blue)', fontWeight: 800 }}>75%</span>
                </div>
                <ProgressBar value={75} height="12px" color="var(--primary-blue)" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                className="btn-outline" 
                onClick={() => setIsModalOpen(true)}
              >
                <Eye size={16} />
                <span>புகைப்படத்தை காண்க</span>
              </button>
              <button 
                className="btn-blue" 
                onClick={() => navigate('/worksite-photo')}
              >
                <Camera size={16} />
                <span>வேலைத்தள படம் எடு</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 40%: Today's Attendance (col-span-5) */}
        <div className="col-span-5">
          <div className="app-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>இன்றைய வருகைப்பதிவு</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>நேரடி வருகைப்பட்டி</span>
              </div>

              <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
                {presentToday} / {totalWorkers}
              </div>

              <div style={{ margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>வருகை விகிதம்</span>
                  <span style={{ color: 'var(--status-success)', fontWeight: 800 }}>{attendanceRate}%</span>
                </div>
                <ProgressBar value={parseFloat(attendanceRate)} height="10px" color="var(--status-success)" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '14px', borderTop: '1px solid #EAECF0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-success)' }} />
                    <span>வருகை தந்தார்</span>
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{presentToday}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-danger)' }} />
                    <span>வரவில்லை</span>
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>4</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#98A2B3' }} />
                    <span>நிலுவையில்</span>
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>0</span>
                </div>
              </div>
            </div>

            <button 
              className="btn-blue" 
              onClick={() => navigate('/attendance')}
              style={{ marginTop: '24px', width: 'fit-content' }}
            >
              <CheckSquare size={18} />
              <span>வருகைப்பதிவு செய்</span>
            </button>
          </div>
        </div>
      </div>

      {/* 50 / 50 Bottom Grid */}
      <div className="grid-12">
        {/* Left 50%: Work Progress */}
        <div className="col-span-6">
          <div className="app-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>பணி முன்னேற்றம்</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ஒதுக்கப்பட்ட தளங்கள்</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {workProgressItems.map((work) => (
                <div key={work.title} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>
                    <span>{work.title}</span>
                    <span style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>{work.percent}%</span>
                  </div>
                  <ProgressBar value={work.percent} height="8px" color="var(--primary-blue)" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 50%: Recent Activity */}
        <div className="col-span-6">
          <div className="app-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>சமீபத்திய தணிக்கை நடவடிக்கைகள்</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>தணிக்கை பதிவு</span>
            </div>

            <ActivityTimeline />
          </div>
        </div>
      </div>

      {/* Interactive Modal Image Viewer */}
      <ImageViewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={worksitePhotoUrl}
        title="நேரடி புவிசார் வேலைத்தள புகைப்பட சான்று"
        metadata={{
          location: localStorage.getItem('latestWorksitePhotoLocation') || `அட்சரேகை: ${currentUserLocation.latitude.toFixed(4)}, தீர்க்கரேகை: ${currentUserLocation.longitude.toFixed(4)}`,
          time: localStorage.getItem('latestWorksitePhotoTime') || 'Monday, 12 October 2026 • 09:01:04 pm'
        }}
      />
    </AppLayout>
  );
};

export default SupervisorDashboard;
