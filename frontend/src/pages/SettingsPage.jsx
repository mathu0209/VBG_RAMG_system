import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  Camera, 
  Save, 
  CheckCircle2, 
  Sliders, 
  Lock,
  Globe
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

export const SettingsPage = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'ரமேஷ் குமார்',
    designation: 'ஊராட்சி வேலைத்தள மேற்பார்வையாளர்',
    email: 'ramesh.kumar@mgnrega.tn.gov.in',
    phone: '+91 98765 43210',
    district: 'காஞ்சிபுரம்',
    panchayat: 'கொத்தப்பள்ளி ஊராட்சி'
  });

  const [systemConfig, setSystemConfig] = useState({
    geofenceRadius: 500,
    faceConfidenceThreshold: 80,
    cameraResolution: '720p',
    autoSyncInterval: '5',
    enableAiFraudAlerts: true,
    enableAudioBeep: true,
    enable2FA: true
  });

  const [saveToast, setSaveToast] = useState('');

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemConfig({
      ...systemConfig,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveToast('அமைப்பு அமைப்புகள் மற்றும் சுயவிவர விருப்பத்தேர்வுகள் வெற்றிகரமாக சேமிக்கப்பட்டன!');
    setTimeout(() => setSaveToast(''), 3500);
  };

  return (
    <AppLayout title="அமைப்பு அமைப்புகள்" breadcrumb="அமைப்புகள்">
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">அமைப்பு & அதிகாரி அமைப்புகள்</h2>
          <p className="page-header-subtitle">அதிகாரி சுயவிவரம், GPS எல்லை வரம்புகள், முக அங்கீகார உணர்திறன் மற்றும் எச்சரிக்கை விருப்பங்களை உள்ளமைக்கவும்.</p>
        </div>
        <button className="btn-blue" onClick={handleSave}>
          <Save size={18} />
          <span>அனைத்து அமைப்புகளையும் சேமிக்கவும்</span>
        </button>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--status-success-bg)', border: '1px solid #ABEFC6', borderRadius: '8px', color: '#027A48', fontWeight: 700, fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid-12">
        {/* Left Column (col-span-6): User Profile & Officer Info */}
        <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="app-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #EAECF0', paddingBottom: '12px' }}>
              <User size={20} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                அதிகாரி சுயவிவர விவரங்கள்
              </h3>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>முழு பெயர்</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={profileData.fullName} 
                  onChange={handleProfileChange}
                  style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #EAECF0', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>அதிகாரப்பூர்வ பதவி</label>
                <input 
                  type="text" 
                  name="designation" 
                  value={profileData.designation} 
                  onChange={handleProfileChange}
                  style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #EAECF0', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>மின்னஞ்சல் முகவரி</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={profileData.email} 
                    onChange={handleProfileChange}
                    style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #EAECF0', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>கைபேசி எண்</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleProfileChange}
                    style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #EAECF0', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>ஒதுக்கப்பட்ட மாவட்டம்</label>
                  <input 
                    type="text" 
                    name="district" 
                    value={profileData.district} 
                    onChange={handleProfileChange}
                    style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #EAECF0', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>கிராம ஊராட்சி</label>
                  <input 
                    type="text" 
                    name="panchayat" 
                    value={profileData.panchayat} 
                    onChange={handleProfileChange}
                    style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #EAECF0', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Security & Aadhaar Verification Card */}
          <div className="app-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #EAECF0', paddingBottom: '12px' }}>
              <Lock size={20} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                பாதுகாப்பு & அங்கீகாரம்
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>ஆதார் e-KYC இரண்டு காரணி பாதுகாப்பு (2FA)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>உயர் மதிப்பு ஊதிய ஒப்புதல்களுக்கு OTP சரிபார்ப்பை கட்டாயமாக்குங்கள்</div>
                </div>
                <input 
                  type="checkbox" 
                  name="enable2FA" 
                  checked={systemConfig.enable2FA} 
                  onChange={handleConfigChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>பாதுகாக்கப்பட்ட SHA-256 முத்திரை</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>வேலைத்தள படங்கள் மற்றும் வருகைப்பதிவு ஏடுகளை மாற்ற முடியாதவாறு கையொப்பமிடுங்கள்</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', backgroundColor: 'var(--status-success-bg)', padding: '2px 8px', borderRadius: '4px' }}>இயக்கத்தில் உள்ளது</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (col-span-6): Telemetry, Geofence & AI Settings */}
        <div className="col-span-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="app-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #EAECF0', paddingBottom: '12px' }}>
              <Sliders size={20} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                தொலைஅளவியல் & உயிரியல் வரம்புகள்
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Geofence Radius Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="var(--primary-blue)" />
                    <span>GPS எல்லை தணிக்கை எல்லை</span>
                  </label>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary-blue)' }}>
                    {systemConfig.geofenceRadius} மீட்டர்
                  </span>
                </div>
                <input 
                  type="range" 
                  name="geofenceRadius" 
                  min="100" 
                  max="1000" 
                  step="50"
                  value={systemConfig.geofenceRadius} 
                  onChange={handleConfigChange}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>100மீ (கடுமையானது)</span>
                  <span>500மீ (பரிந்துரைக்கப்பட்டது)</span>
                  <span>1000மீ (விரிவானது)</span>
                </div>
              </div>

              {/* Facial Match Confidence Threshold Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={15} color="var(--primary-blue)" />
                    <span>முக பொருத்தம் நம்பிக்கை வரம்பு</span>
                  </label>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary-blue)' }}>
                    {systemConfig.faceConfidenceThreshold}% நம்பிக்கை
                  </span>
                </div>
                <input 
                  type="range" 
                  name="faceConfidenceThreshold" 
                  min="50" 
                  max="95" 
                  step="5"
                  value={systemConfig.faceConfidenceThreshold} 
                  onChange={handleConfigChange}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>50% (சாதாரண)</span>
                  <span>80% (தரப்படுத்தப்பட்டது)</span>
                  <span>95% (உயர் பாதுகாப்பு)</span>
                </div>
              </div>

              {/* Hardware Camera Resolution Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={15} color="var(--primary-blue)" />
                  <span>வெப்கேம் கேமரா தெளிவுத்திறன்</span>
                </label>
                <select 
                  name="cameraResolution" 
                  value={systemConfig.cameraResolution} 
                  onChange={handleConfigChange}
                  style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #EAECF0', fontSize: '13px', outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  <option value="480p">சாதாரண தெளிவு (640 x 480 px - குறைவான தரவு)</option>
                  <option value="720p">உயர் தெளிவு (1280 x 720 px - பரிந்துரைக்கப்பட்டது)</option>
                  <option value="1080p">முழு HD தெளிவு (1920 x 1080 px)</option>
                </select>
              </div>

              {/* Auto Sync Interval */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={15} color="var(--primary-blue)" />
                  <span>சேவையகம் தரவு ஒத்திசைவு அதிர்வெண்</span>
                </label>
                <select 
                  name="autoSyncInterval" 
                  value={systemConfig.autoSyncInterval} 
                  onChange={handleConfigChange}
                  style={{ height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #EAECF0', fontSize: '13px', outline: 'none', backgroundColor: '#FFFFFF' }}
                >
                  <option value="1">உடனடி ஒத்திசைவு (1 நிமிடம்)</option>
                  <option value="5">தரப்படுத்தப்பட்ட (5 நிமிடங்கள்)</option>
                  <option value="15">குறிப்பிட்ட காலம் (15 நிமிடங்கள்)</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Fraud & Alert Preferences */}
          <div className="app-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #EAECF0', paddingBottom: '12px' }}>
              <Bell size={20} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                AI மோசடி எச்சரிக்கை விருப்பத்தேர்வுகள்
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>நேரடி AI முரண்பாடு எச்சரிக்கை பதாகைகள்</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>எல்லை அல்லது முக முரண்பாடுகள் ஏற்படும் போது எச்சரிக்கை பதாகைகளை காட்டவும்</div>
                </div>
                <input 
                  type="checkbox" 
                  name="enableAiFraudAlerts" 
                  checked={systemConfig.enableAiFraudAlerts} 
                  onChange={handleConfigChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>சரிபார்ப்பு தோல்வியடையும் போது ஒலி எச்சரிக்கை</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>முக அங்கீகார நம்பிக்கை குறைந்தால் ஒலி எச்சரிக்கை அனுப்பவும்</div>
                </div>
                <input 
                  type="checkbox" 
                  name="enableAudioBeep" 
                  checked={systemConfig.enableAudioBeep} 
                  onChange={handleConfigChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
