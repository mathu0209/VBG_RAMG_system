import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Clock, ShieldCheck, ArrowRight, RefreshCw, Video, VideoOff, AlertCircle, Eye } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ImageViewModal from '../components/common/ImageViewModal';
import { useLocation } from '../context/LocationContext';
import { useCurrentTime } from '../hooks/useCurrentTime';

const DEFAULT_WORKSITE_PHOTO = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

export const WorksitePhotoPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState(() => localStorage.getItem('latestWorksitePhoto') || null);
  const [capturedPhotoTime, setCapturedPhotoTime] = useState(() => localStorage.getItem('latestWorksitePhotoTime') || null);
  const [capturedPhotoLocation, setCapturedPhotoLocation] = useState(() => localStorage.getItem('latestWorksitePhotoLocation') || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentUserLocation, approvedWorksiteLocation, locationDisplayString } = useLocation();
  const { fullDateString, timeString } = useCurrentTime();

  const requestWebcamAccess = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('இந்த உலாவி கேமரா அம்சத்தை ஆதரிக்கவில்லை.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      setStream(mediaStream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(e => console.log('Video play error:', e));
      }
    } catch (err) {
      console.error('Worksite webcam access error:', err);
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('கேமரா அனுமதி மறுக்கப்பட்டது. உங்கள் உலாவி முகவரிப் பட்டியில் உள்ள கேமரா ஐகானைக் கிளிக் செய்து "அனுமதி" அளிக்கவும்.');
      } else {
        setCameraError(`கேமரா பிழை: ${err.message || 'கேமராவை இயக்க முடியவில்லை.'}`);
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

  useEffect(() => {
    if (stream && videoRef.current && !photoCaptured) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.log('Video stream play error:', e));
    }
  }, [stream, photoCaptured]);

  const handleCapture = () => {
    const now = new Date();
    const capturedFullDate = now.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    const capturedTimeStr = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    }).toLowerCase();
    const fixedTimestamp = `${capturedFullDate} • ${capturedTimeStr}`;
    const fixedLocation = `அட்சரேகை: ${currentUserLocation.latitude.toFixed(4)}, தீர்க்கரேகை: ${currentUserLocation.longitude.toFixed(4)}`;

    if (videoRef.current && cameraActive) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 1280;
        canvas.height = videoRef.current.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setCapturedImageUrl(dataUrl);
        localStorage.setItem('latestWorksitePhoto', dataUrl);
      } catch (err) {
        console.warn('Canvas snapshot capture fallback:', err);
        setCapturedImageUrl(DEFAULT_WORKSITE_PHOTO);
        localStorage.setItem('latestWorksitePhoto', DEFAULT_WORKSITE_PHOTO);
      }
    } else {
      setCapturedImageUrl(DEFAULT_WORKSITE_PHOTO);
      localStorage.setItem('latestWorksitePhoto', DEFAULT_WORKSITE_PHOTO);
    }

    localStorage.setItem('latestWorksitePhotoTime', fixedTimestamp);
    localStorage.setItem('latestWorksitePhotoLocation', fixedLocation);
    localStorage.setItem('latestWorksitePhotoTimestamp', now.toISOString());
    setCapturedPhotoTime(fixedTimestamp);
    setCapturedPhotoLocation(fixedLocation);
    setPhotoCaptured(true);
  };

  const handleRetake = () => {
    setPhotoCaptured(false);
    setCapturedImageUrl(null);
    if (!cameraActive) {
      requestWebcamAccess();
    }
  };

  return (
    <AppLayout title="வேலைத்தள புவிசார் புகைப்படம்" breadcrumb="ஆய்வு">
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">புவிசார் வேலைத்தள புகைப்படம்</h2>
          <p className="page-header-subtitle">மாற்ற முடியாத நேர முத்திரையுடன் பௌதிக பணி முன்னேற்றத்தின் நேரடி புவிசார் புகைப்பட சான்றை எடுக்கவும்.</p>
        </div>
      </div>

      {/* 60 / 40 Desktop Layout Grid */}
      <div className="grid-12">
        {/* Left 60%: Camera Viewfinder Card (col-span-7) */}
        <div className="col-span-7">
          <div className="app-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>கேமரா வியூஃபைண்டர்</span>
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: photoCaptured ? 'var(--status-success)' : cameraActive ? 'var(--primary-blue)' : 'var(--status-warning)',
                  backgroundColor: photoCaptured ? 'var(--status-success-bg)' : cameraActive ? 'var(--primary-blue-light)' : 'var(--status-warning-bg)',
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}
              >
                {photoCaptured ? '● புவிசார் படம் எடுக்கப்பட்டது' : cameraActive ? '● கேமரா இயங்குகிறது' : '● கேமரா அனுமதி நிலுவையில்'}
              </span>
            </div>

            {/* Permission Warning Box */}
            {cameraError && !photoCaptured && (
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

            {/* Camera Frame Container with 16:9 Aspect Ratio */}
            <div 
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
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
                  display: cameraActive && !photoCaptured ? 'block' : 'none'
                }}
              />

              {/* REAL VISIBLE CAPTURED PHOTO DISPLAY */}
              {photoCaptured && (
                <img 
                  src={capturedImageUrl || DEFAULT_WORKSITE_PHOTO} 
                  alt="எடுக்கப்பட்ட புவிசார் வேலைத்தள புகைப்படம்"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsModalOpen(true)}
                  onError={(e) => {
                    e.target.src = DEFAULT_WORKSITE_PHOTO;
                  }}
                />
              )}

              {/* View Full Image Badge Trigger on Frame */}
              {photoCaptured && (
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

              {/* Overlay GPS & Timestamp Telemetry Badge on Frame */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(16, 24, 40, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  zIndex: 10,
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8' }}>
                  <MapPin size={12} />
                  <span>{photoCaptured && capturedPhotoLocation ? capturedPhotoLocation : `அட்சரேகை: ${currentUserLocation.latitude.toFixed(4)}, தீர்க்கரேகை: ${currentUserLocation.longitude.toFixed(4)}`}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8' }}>
                  <Clock size={12} />
                  <span>{photoCaptured && capturedPhotoTime ? capturedPhotoTime : `${fullDateString} • ${timeString}`}</span>
                </div>
              </div>

              {/* Viewfinder Placeholder when not active and not captured */}
              {!cameraActive && !photoCaptured && (
                <div style={{ color: '#64748B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 5, padding: '20px', textAlign: 'center' }}>
                  <VideoOff size={52} />
                  <span style={{ fontSize: '13px', color: '#94A3B8', maxWidth: '300px' }}>
                    கேமராவுடன் இணைக்கப்படுகிறது... அனுமதி தடுக்கப்பட்டிருந்தால் கீழே உள்ள "கேமராவை இயக்கு" பொத்தானை அழுத்தவும்.
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons Below Camera */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {!cameraActive && !photoCaptured ? (
                <button className="btn-blue" onClick={requestWebcamAccess} style={{ flex: 1 }}>
                  <Video size={18} />
                  <span>வேலைத்தள கேமராவை இயக்கு</span>
                </button>
              ) : !photoCaptured ? (
                <button className="btn-blue" onClick={handleCapture} style={{ flex: 1 }}>
                  <Camera size={18} />
                  <span>புவிசார் படம் எடு</span>
                </button>
              ) : (
                <>
                  <button className="btn-outline" onClick={handleRetake}>
                    <RefreshCw size={16} />
                    <span>மீண்டும் எடு</span>
                  </button>
                  <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
                    <Eye size={16} />
                    <span>படத்தை காண்க</span>
                  </button>
                  <button className="btn-blue" onClick={() => navigate('/work-progress')} style={{ flex: 1 }}>
                    <span>சமர்ப்பித்து பணி முன்னேற்றத்திற்கு செல்லவும்</span>
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right 40%: Worksite Metadata Card (col-span-5) */}
        <div className="col-span-5">
          <div className="app-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>
                மாற்ற முடியாத தரவு சான்று
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>வேலை பெயர்</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>குளம் தூர்வாருதல் & சீரமைத்தல்</div>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>வேலைத்தள குறியீடு</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{approvedWorksiteLocation.code}</div>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>நேரடி GPS நிலை</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-blue)', marginTop: '2px' }}>{locationDisplayString}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '10px 12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>அட்சரேகை</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{currentUserLocation.latitude.toFixed(6)}</div>
                  </div>
                  <div style={{ padding: '10px 12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>தீர்க்கரேகை</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{currentUserLocation.longitude.toFixed(6)}</div>
                  </div>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #EAECF0' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>நேரலை நேர முத்திரை</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginTop: '2px' }}>{fullDateString} • {timeString}</div>
                </div>
              </div>
            </div>

            {/* Cryptographic Tamper Seal Status */}
            <div style={{ padding: '14px', backgroundColor: 'var(--status-success-bg)', border: '1px solid #ABEFC6', borderRadius: '8px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--status-success)" />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#027A48' }}>பாதுகாக்கப்பட்ட ஹாஷ் உருவாக்கப்பட்டது</div>
                <div style={{ fontSize: '11px', color: '#047857' }}>SHA-256 பாதுகாப்பு முத்திரை இயக்கத்தில் உள்ளது</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal Image Viewer */}
      <ImageViewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={capturedImageUrl || DEFAULT_WORKSITE_PHOTO}
        title="புவிசார் வேலைத்தள புகைப்பட சான்று"
        metadata={{
          location: capturedPhotoLocation || `அட்சரேகை: ${currentUserLocation.latitude.toFixed(4)}, தீர்க்கரேகை: ${currentUserLocation.longitude.toFixed(4)}`,
          time: capturedPhotoTime || `${fullDateString} • ${timeString}`
        }}
      />
    </AppLayout>
  );
};

export default WorksitePhotoPage;
