import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Camera, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Lock,
  Eye
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ProgressBar from '../components/ProgressBar';
import ActivityTimeline from '../components/ActivityTimeline';
import ImageViewModal from '../components/common/ImageViewModal';
import { useLocation } from '../context/LocationContext';
import { useCurrentTime } from '../hooks/useCurrentTime';

const DEFAULT_WORKSITE_PHOTO = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

export const WorkProgressPage = () => {
  const navigate = useNavigate();
  const { approvedWorksiteLocation, currentUserLocation, locationDisplayString } = useLocation();
  const { fullDateString, timeString } = useCurrentTime();

  const [worksitePhotoUrl, setWorksitePhotoUrl] = useState(() => {
    return localStorage.getItem('latestWorksitePhoto') || DEFAULT_WORKSITE_PHOTO;
  });

  // Fixed Captured Time when photo was taken (not running live clock)
  const [photoCapturedTime, setPhotoCapturedTime] = useState(() => {
    return localStorage.getItem('latestWorksitePhotoTime') || 'Monday, 12 October 2026 • 09:01:04 pm';
  });

  const [photoCapturedLocation, setPhotoCapturedLocation] = useState(() => {
    return localStorage.getItem('latestWorksitePhotoLocation') || `அட்சரேகை: ${currentUserLocation.latitude.toFixed(4)}, தீர்க்கரேகை: ${currentUserLocation.longitude.toFixed(4)}`;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // If not yet set in localStorage, save the initial fixed photo time so it never runs live
    if (!localStorage.getItem('latestWorksitePhotoTime')) {
      localStorage.setItem('latestWorksitePhotoTime', 'Monday, 12 October 2026 • 09:01:04 pm');
    }

    const handleStorageChange = () => {
      const updatedPhoto = localStorage.getItem('latestWorksitePhoto');
      if (updatedPhoto) {
        setWorksitePhotoUrl(updatedPhoto);
      }
      const updatedTime = localStorage.getItem('latestWorksitePhotoTime');
      if (updatedTime) {
        setPhotoCapturedTime(updatedTime);
      }
      const updatedLoc = localStorage.getItem('latestWorksitePhotoLocation');
      if (updatedLoc) {
        setPhotoCapturedLocation(updatedLoc);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AppLayout title="பணி முன்னேற்ற கண்காணிப்பு" breadcrumb="பணிகள்">
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">பௌதிக பணி முன்னேற்ற தணிக்கை</h2>
          <p className="page-header-subtitle">நிகழ்நேர நிறைவு அளவீடுகள், புவிசார் பணி சான்றுகள் மற்றும் தள காலவரிசை பதிவுகள்.</p>
        </div>
        <button className="btn-blue" onClick={() => navigate('/fraud-detection')}>
          <ShieldCheck size={18} />
          <span>AI மோசடி தணிக்கை நடத்து</span>
        </button>
      </div>

      {/* Top Work Summary Card */}
      <div className="app-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-blue)', backgroundColor: 'var(--primary-blue-light)', padding: '2px 8px', borderRadius: '4px' }}>
                {approvedWorksiteLocation.code}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>செயலில் உள்ள திட்டம்</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)' }}>
              குளம் தூர்வாருதல் & சீரமைத்தல்
            </h3>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ஒதுக்கப்பட்ட நிதி</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)' }}>₹2,50,000</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #EAECF0' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>GPS நிலை</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="var(--primary-blue)" />
              <span>{locationDisplayString}</span>
            </span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>இலக்கு காலக்கெடு</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>30 நாட்கள் (நாள் 22)</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>பணியாளர்கள் குழு</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>32 பணியாளர்கள் ஒதுக்கப்பட்டுள்ளனர்</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>கடைசி ஆய்வு</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{timeString} இன்று</span>
          </div>
        </div>
      </div>

      {/* Large Progress Bar Card */}
      <div className="app-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>ஒட்டுமொத்த பௌதிக பணி நிறைவு</span>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>ஆரம்பநிலை புவிசார் கணக்கெடுப்புடன் சரிபார்க்கப்பட்டது</p>
          </div>
          <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-blue)', letterSpacing: '-0.02em' }}>
            75%
          </span>
        </div>

        <ProgressBar value={75} height="16px" color="var(--primary-blue)" />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '10px' }}>
          <span>0% ஆரம்ப கணக்கெடுப்பு</span>
          <span>50% தூர்வாருதல் கட்டம்</span>
          <span style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>75% தற்போதைய கட்டம்</span>
          <span>100% முடிவு இலக்கு</span>
        </div>
      </div>

      {/* 50 / 50 Bottom Grid: Latest Geotagged Proof + Activity Timeline */}
      <div className="grid-12">
        {/* Left 50%: Latest Worksite Proof (col-span-6) */}
        <div className="col-span-6">
          <div className="app-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>சமீபத்திய புவிசார் புகைப்பட சான்று</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', backgroundColor: 'var(--status-success-bg)', padding: '2px 8px', borderRadius: '4px' }}>சரிபார்க்கப்பட்ட சான்று</span>
              </div>

              {/* Real Visible Worksite Photo Display Container */}
              <div 
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  backgroundColor: '#0F172A',
                  cursor: 'pointer'
                }}
                onClick={() => setIsModalOpen(true)}
              >
                {/* Visible Image of Worksite */}
                <img 
                  src={worksitePhotoUrl}
                  alt="வேலைத்தள புவிசார் புகைப்பட சான்று" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = DEFAULT_WORKSITE_PHOTO;
                  }}
                />

                {/* View Photo Badge Top Left */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Eye size={13} />
                  <span>பெரிதாக்கி பார்க்க கிளிக் செய்யவும்</span>
                </div>

                {/* SHA-256 Tamper Seal Top Right Badge */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(16, 24, 40, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Lock size={12} color="#12B76A" />
                  <span>SHA-256 பாதுகாப்பு முத்திரை</span>
                </div>

                {/* Overlaid Telemetry Metadata Bar (Bottom Left) */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(16, 24, 40, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8' }}>
                    <MapPin size={13} />
                    <span>{photoCapturedLocation}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                    <Clock size={13} />
                    <span>{photoCapturedTime}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-muted)' }}>படம் எடுத்தவர்:</span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 700 }}>ரமேஷ் குமார் (மேற்பார்வையாளர்)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-muted)' }}>எடுக்கப்பட்ட நேரம்:</span>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 700 }}>{photoCapturedTime}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="btn-outline" onClick={() => setIsModalOpen(true)} style={{ flex: 1 }}>
                <Eye size={16} />
                <span>முழு புகைப்படத்தையும் காண்க</span>
              </button>
              <button className="btn-blue" onClick={() => navigate('/worksite-photo')} style={{ flex: 1 }}>
                <Camera size={16} />
                <span>புதிய படம் எடு</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 50%: Activity Timeline (col-span-6) */}
        <div className="col-span-6">
          <div className="app-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>தணிக்கை & சரிபார்ப்பு காலவரிசை</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>இன்றைய பதிவு</span>
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
        title="வேலைத்தள புகைப்பட சான்று"
        metadata={{
          location: photoCapturedLocation,
          time: photoCapturedTime
        }}
      />
    </AppLayout>
  );
};

export default WorkProgressPage;
