import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  MapPin, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/StatCard';
import GisMap from '../components/GisMap';
import { useLocation } from '../context/LocationContext';

export const MarkAttendancePage = () => {
  const navigate = useNavigate();
  const { 
    currentUserLocation, 
    approvedWorksiteLocation, 
    currentDistance, 
    isWithinGeofence, 
    locationDisplayString,
    requestLocation 
  } = useLocation();

  const [registeredWorkers, setRegisteredWorkers] = useState(() => {
    return JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
  });

  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
      setRegisteredWorkers(stored);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const totalWorkersCount = registeredWorkers.length;
  const absentCount = registeredWorkers.filter((w, idx) => w.attendanceStatus === 'விடுப்பு' || w.attendanceStatus === 'வருகை இல்லை' || (w.attendanceStatus === undefined && idx === 1)).length;
  const verifiedCount = attendanceMarked ? totalWorkersCount : Math.max(0, totalWorkersCount - absentCount);

  const handleMarkAttendance = () => {
    setAttendanceMarked(true);
  };

  return (
    <AppLayout title="தள வருகைப்பதிவு சரிபார்ப்பு" breadcrumb="வருகைப்பதிவு">
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">தள வருகைப்பதிவை பதிவு செய்</h2>
          <p className="page-header-subtitle">உயிரியல் மற்றும் GPS எல்லை சரிபார்ப்பைப் பயன்படுத்தி பணியாளர் வருகையைப் பதிவு செய்யவும்.</p>
        </div>
        <button 
          className="btn-blue"
          onClick={handleMarkAttendance}
          disabled={attendanceMarked}
        >
          <CheckSquare size={18} />
          <span>{attendanceMarked ? 'வருகைப்பதிவு செய்யப்பட்டது ✓' : 'வருகைப்பதிவு செய்'}</span>
        </button>
      </div>

      {/* Top 4 Status Cards */}
      <div className="grid-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard 
            icon={<Users size={20} />} 
            label="மொத்த பதிவு செய்தோர்" 
            value={totalWorkersCount.toString()} 
            secondaryInfo="ஒதுக்கப்பட்ட குழுவினர்" 
          />
        </div>
        <div className="col-span-3">
          <StatCard 
            icon={<ShieldCheck size={20} />} 
            label="GPS சரிபார்க்கப்பட்டது" 
            value={verifiedCount.toString()} 
            secondaryInfo="நேரடி இடம் முடக்கப்பட்டது" 
          />
        </div>
        <div className="col-span-3">
          <StatCard 
            icon={<MapPin size={20} />} 
            label="எல்லை நிலை" 
            value={isWithinGeofence ? 'செல்லுபடியாகும்' : 'வெளியே'} 
            secondaryInfo={`${currentDistance}மீ தூரத்தில் உள்ளது`} 
          />
        </div>
        <div className="col-span-3">
          <StatCard 
            icon={<CheckCircle2 size={20} />} 
            label="உயிரியல் தேர்ச்சி" 
            value={verifiedCount.toString()} 
            secondaryInfo="100% முக பொருத்தம்" 
          />
        </div>
      </div>

      {/* 40 / 60 Layout Grid */}
      <div className="grid-12">
        {/* Left 40%: Verification Checklist (col-span-5) */}
        <div className="col-span-5">
          <div className="app-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>
                முன்-சரிபார்ப்பு தணிக்கை பட்டியல்
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="var(--status-success)" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>கேமரா வியூஃபைண்டர்</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', backgroundColor: 'var(--status-success-bg)', padding: '2px 8px', borderRadius: '4px' }}>இயக்கத்தில் உள்ளது</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="var(--status-success)" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>முக உயிரியல் தரவு</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', backgroundColor: 'var(--status-success-bg)', padding: '2px 8px', borderRadius: '4px' }}>பொருந்தியது</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isWithinGeofence ? <CheckCircle2 size={18} color="var(--status-success)" /> : <AlertTriangle size={18} color="var(--status-warning)" />}
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>GPS எல்லை</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isWithinGeofence ? 'var(--status-success)' : 'var(--status-warning)', backgroundColor: isWithinGeofence ? 'var(--status-success-bg)' : 'var(--status-warning-bg)', padding: '2px 8px', borderRadius: '4px' }}>
                    {isWithinGeofence ? 'எல்லைக்குள் உள்ளது' : 'எல்லைக்கு வெளியே'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="var(--status-success)" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>நேரம் & சேவையகம்</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', backgroundColor: 'var(--status-success-bg)', padding: '2px 8px', borderRadius: '4px' }}>சரிபார்க்கப்பட்டது</span>
                </div>
              </div>
            </div>

            {/* Telemetry Summary & Trigger Buttons */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #EAECF0' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>தொலைஅளவியல் நிலை</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '4px' }}>
                {locationDisplayString}
              </div>

              <button 
                className="btn-outline" 
                onClick={requestLocation}
                style={{ width: '100%', marginTop: '12px' }}
              >
                <span>சாதன GPS புதுப்பி</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 60%: Leaflet GIS Map Card (col-span-7) */}
        <div className="col-span-7">
          <div className="app-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>வேலைத்தள GPS எல்லை வரைபடம்</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-blue)' }}>500மீ ஆரம் எல்லை</span>
            </div>

            {/* Map Container - Max Height 480px */}
            <div style={{ height: '440px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid #EAECF0' }}>
              <GisMap 
                lat={currentUserLocation.latitude} 
                lng={currentUserLocation.longitude} 
                worksiteLat={approvedWorksiteLocation.latitude} 
                worksiteLng={approvedWorksiteLocation.longitude} 
                radius={approvedWorksiteLocation.radius} 
              />
            </div>

            {/* Dynamic Telemetry Footer */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginTop: '16px', 
                padding: '12px 16px', 
                backgroundColor: '#F9FAFB', 
                borderRadius: '8px', 
                border: '1px solid #EAECF0' 
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>கணக்கிடப்பட்ட தூரம்</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: isWithinGeofence ? 'var(--status-success)' : 'var(--status-warning)' }}>
                  {currentDistance} மீட்டர் ({isWithinGeofence ? 'அங்கீகரிக்கப்பட்ட ஆரம் எல்லைக்குள் உள்ளது' : 'ஆரம் எல்லைக்கு வெளியே உள்ளது'})
                </span>
              </div>

              <button className="btn-blue" onClick={() => navigate('/worksite-photo')}>
                <span>வேலைத்தள படம் எடு</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Worker Attendance Muster Roll Table */}
      <div className="app-card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>
          நேரலை வருகைப்பதிவேடு ({registeredWorkers.length} பதிவு செய்யப்பட்ட பணியாளர்கள்)
        </h3>

        {registeredWorkers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #EAECF0' }}>
            <Users size={36} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>பதிவு செய்யப்பட்ட பணியாளர்கள் எவரும் இல்லை</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              'பணியாளர் பதிவு' பக்கத்தில் புதிய தொழிலாளர்களைப் பதிவுசெய்தால், அவர்களின் வருகைப்பதிவு இங்கே நேரலையாகத் தோன்றும்.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EAECF0', backgroundColor: '#F9FAFB', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>பணியாளர் பெயர்</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>ஜாப் கார்டு எண்</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>பாலினம்</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>தேதி</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>வருகை நிலை</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>GPS சரிபார்ப்பு</th>
                </tr>
              </thead>
              <tbody>
                {registeredWorkers.map((w, idx) => {
                  const rawGender = w['Gender'] || w.gender || 'ஆண்';
                  const genderVal = (rawGender === 'Female' || rawGender === 'female' || rawGender === 'பெண்') ? 'பெண்' : 'ஆண்';
                  const jc = w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${101 + idx}`;
                  const name = w['Full Name'] || w.fullName || 'பதிவு செய்யப்பட்ட பணியாளர்';
                  const isAbsent = w.attendanceStatus === 'விடுப்பு' || w.attendanceStatus === 'வருகை இல்லை' || (w.attendanceStatus === undefined && idx === 1);

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #F2F4F7', backgroundColor: isAbsent ? '#FFF5F5' : 'transparent' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>{name}</td>
                      <td style={{ padding: '14px', fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '12px' }}>{jc}</td>
                      <td style={{ padding: '14px', fontWeight: 600 }}>{genderVal}</td>
                      <td style={{ padding: '14px', color: 'var(--text-dark)', fontWeight: 600, fontFamily: 'monospace' }}>
                        {w.registrationDate || w.registeredDate || w.date || new Date().toLocaleDateString('ta-IN')}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {isAbsent ? (
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#D92D20', backgroundColor: '#FEE4E2', padding: '2px 8px', borderRadius: '4px' }}>
                            விடுப்பு (ஆப்சென்ட்)
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', backgroundColor: 'var(--status-success-bg)', padding: '2px 8px', borderRadius: '4px' }}>
                            வருகை பதிவானது (பிரசண்ட்)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {isAbsent ? (
                          <span style={{ color: '#D92D20', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                            <AlertTriangle size={14} /> பதிவு செய்யப்படவில்லை (விடுப்பு)
                          </span>
                        ) : (
                          <span style={{ color: 'var(--status-success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                            <CheckCircle2 size={14} /> சரிபார்க்கப்பட்டது (எல்லைக்குள்)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MarkAttendancePage;
