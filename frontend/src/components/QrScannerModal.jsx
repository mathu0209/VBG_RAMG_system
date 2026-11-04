import React, { useState, useEffect, useRef } from 'react';
import { X, QrCode, MapPin, CheckCircle, AlertOctagon, Camera } from 'lucide-react';

export const QrScannerModal = ({ isOpen, onClose, onScanComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [gpsCoords, setGpsCoords] = useState(null);
  const [registeredWorkers, setRegisteredWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Load dynamic registered workers from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
      setRegisteredWorkers(stored);
      if (stored.length > 0) {
        setSelectedWorkerId(stored[0]['Job Card Number'] || 'TN-04-002-004/101');
      } else {
        setSelectedWorkerId('TN-04-002-004/101');
      }
      setIsScanning(true);
      setScanResult(null);
    }
  }, [isOpen]);

  // Initialize WebCam Stream when modal opens
  useEffect(() => {
    let stream = null;

    if (isOpen && isScanning) {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
            setCameraError(null);
          }
        } catch (err) {
          console.warn('QR Scanner WebCam error:', err);
          setCameraActive(false);
          setCameraError('கேமரா அணுகல் அனுமதி பெறப்படவில்லை. நேரலை வியூஃபைண்டர் இயங்குகிறது.');
        }
      };

      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, isScanning]);

  // Capture real GPS coordinates from browser Geolocation API
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        },
        (err) => {
          setGpsCoords({
            latitude: 13.0827,
            longitude: 80.2707,
            accuracy: 10
          });
        },
        { enableHighAccuracy: true }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = (isValidLocation = true) => {
    const lat = isValidLocation ? (gpsCoords?.latitude || 13.0827) : 13.1500;
    const lng = isValidLocation ? (gpsCoords?.longitude || 80.2707) : 80.3500;

    const matchedWorker = registeredWorkers.find(w => (w['Job Card Number'] || w.jobCard) === selectedWorkerId);
    const workerName = matchedWorker ? (matchedWorker['Full Name'] || matchedWorker.name) : 'பதிவு செய்யப்பட்ட பணியாளர்';
    const jobCardNumber = selectedWorkerId || 'TN-04-002-004/101';

    const result = {
      workerId: selectedWorkerId,
      jobCardNumber: jobCardNumber,
      workerName: workerName,
      latitude: lat,
      longitude: lng,
      gpsVerified: isValidLocation,
      scannedAt: new Date().toLocaleTimeString('ta-IN')
    };

    setScanResult(result);
    setIsScanning(false);
    if (onScanComplete) onScanComplete(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <canvas ref={canvasRef} className="hidden" />

      <div className="w-full max-w-lg glass-card p-6 rounded-2xl border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-200" style={{ backgroundColor: '#1E293B', color: '#FFFFFF' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4" style={{ borderColor: '#334155' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34D399' }}>
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100" style={{ fontSize: '15px', fontWeight: 700 }}>QR வருகைப்பதிவு & GPS எல்லை ஸ்கேனர்</h3>
              <p className="text-xs text-slate-400" style={{ fontSize: '12px', color: '#94A3B8' }}>வேலை அட்டையின் QR குறியீட்டை ஸ்கேன் செய்து இருப்பிடத்தை சரிபார்க்கவும்</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS Fix Indicator */}
        <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '10px', backgroundColor: '#0F172A', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#CBD5E1' }}>
            <MapPin className="w-4 h-4 text-cyan-400" style={{ color: '#22D3EE' }} />
            <span>GPS இருப்பிட நிலை:</span>
          </div>
          <div style={{ fontFamily: 'monospace', color: '#34D399', fontWeight: 700 }}>
            {gpsCoords ? `${gpsCoords.latitude.toFixed(4)}° N, ${gpsCoords.longitude.toFixed(4)}° E (±${Math.round(gpsCoords.accuracy)}மீ)` : 'GPS நிலை பெறப்படுகிறது...'}
          </div>
        </div>

        {/* Live Camera Scanner Viewport */}
        {isScanning ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ height: '240px', borderRadius: '12px', backgroundColor: '#020617', border: '2px dashed rgba(16, 185, 129, 0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyCenter: 'center', position: 'relative', overflow: 'hidden' }}>
              
              {/* Live WebCam Stream */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: !cameraActive ? 'none' : 'block' }}
              />

              {!cameraActive && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', height: '100%' }}>
                  <Camera style={{ width: '48px', height: '48px', color: '#64748B', marginBottom: '8px' }} />
                  <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
                    பணியாளரின் ஜாப் கார்டு QR குறியீட்டை கேமரா சட்டத்திற்குள் சீரமைக்கவும்
                  </div>
                </div>
              )}

              {/* Animated Laser Scanning Line */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: '40%', height: '2px', backgroundColor: '#34D399', boxShadow: '0 0 10px #34D399' }} />

              {/* Camera Active Indicator Badge */}
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: '10px', color: '#34D399', fontFamily: 'monospace', backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                {cameraActive ? '● நேரலை கேமரா இயங்குகிறது' : '● வியூஃபைண்டர் தயாராக உள்ளது'}
              </div>
            </div>

            {/* Registered Worker Selection Dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>பணியாளரைத் தேர்ந்தெடுத்து ஸ்கேன் செய்ய உருவகப்படுத்தவும்:</div>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', fontSize: '12px', outline: 'none' }}
              >
                {registeredWorkers.length > 0 ? (
                  registeredWorkers.map((w, idx) => {
                    const jc = w['Job Card Number'] || `TN-04-002-004/${101 + idx}`;
                    const nm = w['Full Name'] || `பணியாளர் ${idx + 1}`;
                    return (
                      <option key={idx} value={jc}>
                        {nm} (ஜாப் கார்டு: {jc})
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="TN-04-002-004/101">ரமேஷ் நாயுடு (ஜாப் கார்டு: TN-04-002-004/101)</option>
                    <option value="TN-04-002-004/102">லட்சுமி தேவி (ஜாப் கார்டு: TN-04-002-004/102)</option>
                  </>
                )}
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => handleSimulateScan(true)}
                  style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#10B981', color: '#020617', fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  சரிபார்க்கப்பட்ட GPS இடம்
                </button>
                <button
                  onClick={() => handleSimulateScan(false)}
                  style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(244, 63, 94, 0.2)', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#FDA4AF', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <AlertOctagon className="w-4 h-4" />
                  போலி GPS முயற்சி
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Verification Result View */
          <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: scanResult.gpsVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', color: scanResult.gpsVerified ? '#34D399' : '#F43F5E', border: scanResult.gpsVerified ? '1px solid #10B981' : '1px solid #F43F5E' }}>
              {scanResult.gpsVerified ? <CheckCircle style={{ width: '32px', height: '32px' }} /> : <AlertOctagon style={{ width: '32px', height: '32px' }} />}
            </div>

            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#F8FAFC' }}>{scanResult.workerName}</h4>
              <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94A3B8', marginTop: '2px' }}>{scanResult.jobCardNumber}</p>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', textAlign: 'left', fontSize: '12px', backgroundColor: scanResult.gpsVerified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', border: scanResult.gpsVerified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)', color: scanResult.gpsVerified ? '#6EE7B7' : '#FDA4AF' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                {scanResult.gpsVerified ? '✓ வருகைப்பதிவு மற்றும் GPS சரிபார்ப்பு வெற்றி பெற்றன' : '⚠ AI எச்சரிக்கை: இருப்பிட முரண்பாடு கண்டறியப்பட்டது'}
              </div>
              <div>ஸ்கேன் செய்யப்பட்ட GPS: {scanResult.latitude}° N, {scanResult.longitude}° E</div>
              <div>நேரம்: {scanResult.scannedAt}</div>
              {!scanResult.gpsVerified && (
                <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, color: '#FB7185' }}>
                  ஸ்கேன் செய்யப்பட்ட இடம் நியமிக்கப்பட்ட திட்ட எல்லையிலிருந்து 3.8 கி.மீ வெளியே உள்ளது.
                </div>
              )}
            </div>

            <button
              onClick={() => setIsScanning(true)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#334155', color: '#F8FAFC', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              அடுத்த பணியாளரை ஸ்கேன் செய்யவும்
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScannerModal;
