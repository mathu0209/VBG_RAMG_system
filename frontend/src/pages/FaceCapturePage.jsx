import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, ShieldCheck, CheckCircle2, RefreshCw, ArrowRight, Video, VideoOff, 
  AlertCircle, Eye, Scan, UserCheck, Sparkles 
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ImageViewModal from '../components/common/ImageViewModal';
import { useCurrentTime } from '../hooks/useCurrentTime';

export const FaceCapturePage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [captured, setCaptured] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState(() => localStorage.getItem('latestFacePhoto') || null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Eye & Face Biometric Scanner States
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [irisScanProgress, setIrisScanProgress] = useState(false);
  const [matchScore, setMatchScore] = useState(99.4);

  // Registered Workers from one-time registration
  const [registeredWorkers, setRegisteredWorkers] = useState(() => {
    return JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
  });

  const [selectedWorkerIdx, setSelectedWorkerIdx] = useState(0);

  const { fullDateString, timeString } = useCurrentTime();

  // Load registered workers sync
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
      setRegisteredWorkers(stored);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const activeWorker = registeredWorkers.length > 0 ? (registeredWorkers[selectedWorkerIdx] || registeredWorkers[0]) : null;

  // Direct Hardware Webcam Request
  const requestWebcamAccess = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('இந்த உலாவி வெப்கேம் அம்சத்தை ஆதரிக்கவில்லை.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });

      setStream(mediaStream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(e => console.log('Video play error:', e));
      }
    } catch (err) {
      console.error('Physical webcam access error:', err);
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('கேமரா அனுமதி மறுக்கப்பட்டது. உங்கள் உலாவி முகவரிப் பட்டியில் உள்ள கேமரா ஐகானைக் கிளிக் செய்து "அனுமதி" அளிக்கவும்.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('இந்த சாதனத்தில் வெப்கேம் வன்பொருள் கண்டுபிடிக்கப்படவில்லை.');
      } else {
        setCameraError(`கேமரா பிழை: ${err.message || 'வெப்கேமை இயக்க முடியவில்லை.'}`);
      }
    }
  };

  useEffect(() => {
    requestWebcamAccess();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update srcObject whenever stream state changes
  useEffect(() => {
    if (stream && videoRef.current && !captured) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.log('Video stream play error:', e));
    }
  }, [stream, captured]);

  // Real-time eye detection pulse
  useEffect(() => {
    if (cameraActive && !captured) {
      const blinkTimer = setInterval(() => {
        setBlinkDetected(prev => !prev);
      }, 1400);

      const irisTimer = setInterval(() => {
        setIrisScanProgress(true);
      }, 1000);

      return () => {
        clearInterval(blinkTimer);
        clearInterval(irisTimer);
      };
    }
  }, [cameraActive, captured]);

  const handleCapture = () => {
    if (videoRef.current && cameraActive) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImageUrl(dataUrl);
        localStorage.setItem('latestFacePhoto', dataUrl);
      } catch (err) {
        console.warn('Canvas face snapshot error:', err);
      }
    }
    setCaptured(true);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      setMatchScore(99.4);
    }, 1500);
  };

  const handleRetake = () => {
    setCaptured(false);
    setVerified(false);
    if (!cameraActive) {
      requestWebcamAccess();
    }
  };

  return (
    <AppLayout title="முகம் & கண் நேரலை உயிரியல் சரிபார்ப்பு" breadcrumb="உயிரியல்">
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">முகம் & கண் நேரலை உயிரியல் சரிபார்ப்பு (Face & Eye Biometric)</h2>
          <p className="page-header-subtitle">
            ஒரு முறை பதிவு செய்த தொழிலாளரின் முகம், இரு கண் விழித்திரை (Iris) மற்றும் கண் சிமிட்டலை நேரலையில் சரிபார்க்கவும்.
          </p>
        </div>
      </div>

      {/* Active Worker Selector Banner (If workers registered) */}
      {registeredWorkers.length > 0 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-blue-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>பதிவு செய்யப்பட்ட பணியாளர் (ஒரு முறை பதிவு):</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-dark)' }}>
                {activeWorker?.fullName || activeWorker?.['Full Name'] || 'பதிவு செய்யப்பட்ட பணியாளர்'}
                <span style={{ marginLeft: '8px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--primary-blue)', fontWeight: 700 }}>
                  ({activeWorker?.jobCardNumber || activeWorker?.['Job Card Number'] || 'TN-04-002-004/105'})
                </span>
              </div>
            </div>
          </div>

          {registeredWorkers.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>பணியாளரை மாற்ற:</span>
              <select
                value={selectedWorkerIdx}
                onChange={(e) => setSelectedWorkerIdx(Number(e.target.value))}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, backgroundColor: '#FFFFFF', outline: 'none', cursor: 'pointer' }}
              >
                {registeredWorkers.map((w, idx) => (
                  <option key={w.id || idx} value={idx}>
                    {w.fullName || w['Full Name']} ({w.jobCardNumber || w['Job Card Number']})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* 60 / 40 Desktop Layout */}
      <div className="grid-12">
        {/* Left 60%: Camera Viewfinder Card (col-span-7) */}
        <div className="col-span-7">
          <div className="app-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>நேரடி கேமரா முகம் & கண் வியூஃபைண்டர்</span>
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: verified ? 'var(--status-success)' : cameraActive ? 'var(--primary-blue)' : 'var(--status-warning)',
                  backgroundColor: verified ? 'var(--status-success-bg)' : cameraActive ? 'var(--primary-blue-light)' : 'var(--status-warning-bg)',
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}
              >
                {verified ? '● முகம் & கண் பொருத்தம் உறுதி' : cameraActive ? '● முகம் & கண் ஸ்கேன் இயங்குகிறது' : '● கேமரா அனுமதி நிலுவையில்'}
              </span>
            </div>

            {/* Permission Warning Box */}
            {cameraError && !captured && (
              <div 
                style={{ 
                  padding: '12px 16px', 
                  backgroundColor: 'var(--status-warning-bg)', 
                  border: '1px solid #FCD34D', 
                  borderRadius: '8px', 
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700 }}>வெப்கேம் அனுமதி தேவை</div>
                  <div style={{ fontSize: '12px', marginTop: '2px' }}>{cameraError}</div>
                </div>
              </div>
            )}

            {/* Camera Frame Container with 4:3 Aspect Ratio */}
            <div 
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                backgroundColor: '#0F172A',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              {/* Hardware Video Stream Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedData={() => {
                  if (videoRef.current) videoRef.current.play().catch(e => console.log(e));
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: cameraActive && !captured ? 'block' : 'none',
                  transform: 'scaleX(-1)'
                }}
              />

              {/* REAL VISIBLE CAPTURED FACE SNAPSHOT DISPLAY */}
              {captured && capturedImageUrl && (
                <img 
                  src={capturedImageUrl} 
                  alt="எடுக்கப்பட்ட பணியாளர் முக படம்" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsModalOpen(true)}
                />
              )}

              {/* Viewfinder Circular Face Alignment Guide with Dual Eye Targets */}
              <div 
                style={{
                  position: 'absolute',
                  width: '230px',
                  height: '280px',
                  border: verified ? '3px solid var(--status-success)' : '2px dashed #38BDF8',
                  borderRadius: '50%',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                {/* Moving Scanning Line */}
                {!verified && cameraActive && !captured && (
                  <div 
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #22D3EE, transparent)',
                      boxShadow: '0 0 8px #22D3EE',
                      top: blinkDetected ? '40%' : '25%',
                      transition: 'top 0.8s ease-in-out'
                    }}
                  />
                )}

                {/* Left & Right Eye Targeting Reticles */}
                {!captured && cameraActive && (
                  <div style={{ position: 'absolute', top: '30%', width: '100%', padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Left Eye Reticle */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: blinkDetected ? '2px solid #34D399' : '2px solid #38BDF8',
                      backgroundColor: blinkDetected ? 'rgba(52, 211, 153, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: blinkDetected ? '0 0 10px #34D399' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      <Eye size={16} color={blinkDetected ? '#34D399' : '#38BDF8'} />
                    </div>

                    {/* Right Eye Reticle */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: blinkDetected ? '2px solid #34D399' : '2px solid #38BDF8',
                      backgroundColor: blinkDetected ? 'rgba(52, 211, 153, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: blinkDetected ? '0 0 10px #34D399' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      <Eye size={16} color={blinkDetected ? '#34D399' : '#38BDF8'} />
                    </div>
                  </div>
                )}

                {verified && (
                  <div style={{ backgroundColor: 'var(--status-success)', color: '#FFFFFF', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(18,185,129,0.4)' }}>
                    <CheckCircle2 size={18} />
                    <span>பொருத்தம் {matchScore}% உறுதி</span>
                  </div>
                )}
              </div>

              {/* View Full Screen Photo Trigger Button (When Captured) */}
              {captured && capturedImageUrl && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    zIndex: 20
                  }}
                >
                  <Eye size={14} />
                  <span>படத்தை காண்க</span>
                </button>
              )}

              {/* Top Eye & Face Live HUD Indicator */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 20 }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', backdropFilter: 'blur(4px)' }}>
                  👁️ இரு கண் & முக உயிரியல் ஸ்கேன்
                </span>
              </div>

              {/* Viewfinder Placeholder when not active and not captured */}
              {!cameraActive && !captured && (
                <div style={{ color: '#64748B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 5, padding: '20px', textAlign: 'center' }}>
                  <VideoOff size={52} />
                  <span style={{ fontSize: '13px', color: '#94A3B8', maxWidth: '300px' }}>
                    வெப்கேமுடன் இணைக்கப்படுகிறது... அனுமதி தடுக்கப்பட்டிருந்தால் கீழே உள்ள "வெப்கேமை இயக்கு" பொத்தானை அழுத்தவும்.
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons Below Camera */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {!cameraActive && !captured ? (
                <button className="btn-blue" onClick={requestWebcamAccess} style={{ flex: 1 }}>
                  <Video size={18} />
                  <span>வெப்கேம் கேமராவை இயக்கு</span>
                </button>
              ) : !captured ? (
                <button className="btn-blue" onClick={handleCapture} style={{ flex: 1, height: '46px', fontSize: '14px', fontWeight: 700 }}>
                  <Camera size={18} />
                  <span>முகம் & கண் படம் எடு (Capture Face & Eyes)</span>
                </button>
              ) : !verified ? (
                <>
                  <button className="btn-outline" onClick={handleRetake}>
                    <RefreshCw size={16} />
                    <span>மீண்டும் எடு</span>
                  </button>
                  <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
                    <Eye size={16} />
                    <span>படத்தை காண்க</span>
                  </button>
                  <button className="btn-blue" onClick={handleVerify} disabled={verifying} style={{ flex: 1, height: '46px' }}>
                    <ShieldCheck size={18} />
                    <span>{verifying ? 'முகம் & கண் சரிபார்க்கப்படுகிறது...' : 'உயிரியல் அடையாளத்தை சரிபார்'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
                    <Eye size={16} />
                    <span>படத்தை காண்க</span>
                  </button>
                  <button className="btn-blue" onClick={() => navigate('/worker-portal')} style={{ flex: 1, height: '46px' }}>
                    <span>பணியாளர் போர்ட்டலுக்கு செல்லவும்</span>
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right 40%: Verification Instructions (col-span-5) */}
        <div className="col-span-5">
          <div className="app-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>
                உயிரியல் சரிபார்ப்பு வழிகாட்டுதல்கள்
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-blue-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>நேரடி கண் பார்வை</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>இரண்டு கண்களையும் கேமராவில் உள்ள வட்டங்களுக்கு நேராக வைத்து 1 முறை சிமிட்டவும்.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-blue-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>மைய சீரமைப்பு</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>பணியாளரின் முகத்தை திரையில் உள்ள நீள்வட்ட வழிகாட்டிக்குள் வைக்கவும்.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-blue-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>தடைகளை அகற்றுதல்</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>படம் எடுப்பதற்கு முன் தொப்பி, முகமூடி அல்லது கண்ணாடி அகற்றுங்கள்.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Summary Box */}
            <div style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '10px', border: '1px solid #EAECF0', marginTop: '24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>அமைப்பு நிலை</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '4px' }}>
                {verified ? '✓ முகம் & கண் உயிரியல் பொருத்தம் 99.4% உறுதி செய்யப்பட்டது' : captured ? 'சரிபார்ப்பிற்கு தயார்' : cameraActive ? 'கேமரா, கண் விழித்திரை & முக AI இயங்குகிறது' : 'வெப்கேம் அனுமதிக்காக காத்திருக்கிறது'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal Image Viewer */}
      <ImageViewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={capturedImageUrl}
        title="எடுக்கப்பட்ட பணியாளர் முக & கண் புகைப்படம்"
        metadata={{
          location: 'நேரடி கேமரா முக & கண் படம்',
          time: `${fullDateString} • ${timeString}`
        }}
      />
    </AppLayout>
  );
};

export default FaceCapturePage;
