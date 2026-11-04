import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Search, 
  UserX, 
  MapPinOff, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  Send, 
  Eye,
  Camera,
  Upload,
  RefreshCw,
  UserCheck,
  Sparkles,
  MapPin,
  Calendar,
  AlertTriangle,
  X,
  Check,
  Users,
  Image as ImageIcon
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ImageViewModal from '../components/common/ImageViewModal';
import { useCurrentTime } from '../hooks/useCurrentTime';

const DEFAULT_WORKSITE_PHOTO = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

// Standard sample worker portrait photos
const SAMPLE_WORKER_PHOTOS = [
  {
    name: 'மாதிரி 1 (பெண் தொழிலாளி)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'மாதிரி 2 (ஆண் தொழிலாளி)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'மாதிரி 3 (மூத்த தொழிலாளி)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  }
];

// Fallback mock workers if registeredWorkers in localStorage is empty
const DEFAULT_MOCK_WORKERS = [
  {
    id: 1,
    fullName: 'ரமேஷ் நாயுடு',
    jobCardNumber: 'TN-04-002-004/101',
    workerId: 'W10235',
    worksiteName: 'குளம் தூர்வாருதல் & சீரமைத்தல்',
    villageName: 'பூண்டி கிராமம்',
    district: 'திருவள்ளூர் மாவட்டம்',
    riskScore: 82,
    riskLevel: 'உயர் ஆபத்து முரண்பாடு',
    riskColor: 'var(--status-danger)',
    riskBg: '#FEF3F2',
    riskBorder: '#FECDCA',
    facePhoto: SAMPLE_WORKER_PHOTOS[0].url,
    registrationDate: '10/10/2026'
  },
  {
    id: 2,
    fullName: 'லட்சுமி தேவி',
    jobCardNumber: 'TN-04-002-004/102',
    workerId: 'W10482',
    worksiteName: 'கால்வாய் வடிகால் தூர்வாருதல்',
    villageName: 'பூண்டி கிராமம்',
    district: 'திருவள்ளூர் மாவட்டம்',
    riskScore: 24,
    riskLevel: 'குறைந்த ஆபத்து (சரிபார்க்கப்பட்டது)',
    riskColor: 'var(--status-success)',
    riskBg: '#ECFDF3',
    riskBorder: '#A6F4C5',
    facePhoto: SAMPLE_WORKER_PHOTOS[1].url,
    registrationDate: '08/10/2026'
  },
  {
    id: 3,
    fullName: 'முருகன் குமார்',
    jobCardNumber: 'TN-04-002-004/103',
    workerId: 'W10593',
    worksiteName: 'தடுப்பணை பழுதுபார்க்கும் பணி',
    villageName: 'பூண்டி கிராமம்',
    district: 'திருவள்ளூர் மாவட்டம்',
    riskScore: 68,
    riskLevel: 'நடுத்தர ஆபத்து முரண்பாடு',
    riskColor: 'var(--status-warning)',
    riskBg: '#FFFAEB',
    riskBorder: '#FEDF89',
    facePhoto: SAMPLE_WORKER_PHOTOS[2].url,
    registrationDate: '06/10/2026'
  }
];

export const AiFraudPage = () => {
  const fileInputRef = useRef(null);
  const worksiteFileInputRef = useRef(null);
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);

  // Workers List from localStorage
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerIndex, setSelectedWorkerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Photo states
  const [facePhotoUrl, setFacePhotoUrl] = useState('');
  const [worksitePhotoUrl, setWorksitePhotoUrl] = useState(() => {
    return localStorage.getItem('latestWorksitePhoto') || DEFAULT_WORKSITE_PHOTO;
  });
  const [photoCapturedTime, setPhotoCapturedTime] = useState(() => {
    return localStorage.getItem('latestWorksitePhotoTime') || 'Monday, 12 October 2026 • 09:01:04 pm';
  });
  const [faceUpdatedTime, setFaceUpdatedTime] = useState('');

  // UI Modals & Actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [reviewSent, setReviewSent] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Live Camera Modal for Photo Update
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Helper to normalize and load workers from localStorage
  const loadWorkersFromStorage = () => {
    const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    const latestStoredFace = localStorage.getItem('latestFacePhoto');

    if (stored && stored.length > 0) {
      return stored.map((w, idx) => {
        const jc = w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${105 + idx}`;
        const name = w['Full Name'] || w.fullName || `பணியாளர் ${idx + 1}`;
        const workerId = w.workerId || `W${10230 + idx}`;
        
        // Face photo priority: worker.facePhoto -> latestFacePhoto (for active worker) -> sample portrait
        const face = w.facePhoto || w.photo || (idx === 0 && latestStoredFace ? latestStoredFace : SAMPLE_WORKER_PHOTOS[idx % SAMPLE_WORKER_PHOTOS.length].url);

        const score = w.riskScore !== undefined ? Number(w.riskScore) : (idx === 0 ? 82 : (20 + (idx * 21) % 65));
        const isHigh = score >= 70;
        const isMedium = score >= 40 && score < 70;

        return {
          ...w,
          id: w.id || idx + 1,
          fullName: name,
          jobCardNumber: jc,
          workerId: workerId,
          facePhoto: face,
          worksiteName: w.worksiteName || 'குளம் தூர்வாருதல் & சீரமைத்தல்',
          villageName: w.villageName || w.panchayat || 'பூண்டி கிராமம்',
          district: w.district || 'திருவள்ளூர் மாவட்டம்',
          riskScore: score,
          riskLevel: isHigh ? 'உயர் ஆபத்து முரண்பாடு' : isMedium ? 'நடுத்தர ஆபத்து முரண்பாடு' : 'குறைந்த ஆபத்து (சரிபார்க்கப்பட்டது)',
          riskColor: isHigh ? 'var(--status-danger)' : isMedium ? 'var(--status-warning)' : 'var(--status-success)',
          riskBg: isHigh ? '#FEF3F2' : isMedium ? '#FFFAEB' : '#ECFDF3',
          riskBorder: isHigh ? '#FECDCA' : isMedium ? '#FEDF89' : '#A6F4C5'
        };
      });
    }

    // Fallback to default mock workers
    return DEFAULT_MOCK_WORKERS.map((w, idx) => ({
      ...w,
      facePhoto: (idx === 0 && latestStoredFace) ? latestStoredFace : w.facePhoto
    }));
  };

  // Initial load
  useEffect(() => {
    const workerList = loadWorkersFromStorage();
    setWorkers(workerList);

    if (workerList.length > 0) {
      const active = workerList[0];
      setFacePhotoUrl(active.facePhoto);
      setSearchQuery(active.jobCardNumber || active.workerId);
    }
  }, []);

  // Listen to storage events across tabs or components
  useEffect(() => {
    const handleStorageChange = () => {
      const workerList = loadWorkersFromStorage();
      setWorkers(workerList);

      const storedWorksite = localStorage.getItem('latestWorksitePhoto');
      if (storedWorksite) setWorksitePhotoUrl(storedWorksite);

      const storedTime = localStorage.getItem('latestWorksitePhotoTime');
      if (storedTime) setPhotoCapturedTime(storedTime);

      const storedFace = localStorage.getItem('latestFacePhoto');
      if (storedFace && selectedWorkerIndex === 0) {
        setFacePhotoUrl(storedFace);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedWorkerIndex]);

  const activeWorker = workers[selectedWorkerIndex] || workers[0] || DEFAULT_MOCK_WORKERS[0];

  // When selected worker changes, update photo & query
  const handleSelectWorker = (idx) => {
    setSelectedWorkerIndex(idx);
    const target = workers[idx];
    if (target) {
      setFacePhotoUrl(target.facePhoto);
      setSearchQuery(target.jobCardNumber || target.workerId);
      setReviewSent(false);
    }
  };

  // Search input filter / match
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toLowerCase();
    const foundIdx = workers.findIndex(w => 
      (w.fullName && w.fullName.toLowerCase().includes(q)) ||
      (w.jobCardNumber && w.jobCardNumber.toLowerCase().includes(q)) ||
      (w.workerId && w.workerId.toLowerCase().includes(q))
    );

    if (foundIdx !== -1) {
      handleSelectWorker(foundIdx);
      showToast(`பணியாளர் "${workers[foundIdx].fullName}" கண்டறியப்பட்டு தேர்ந்தெடுக்கப்பட்டார்!`);
    } else {
      showToast(`தேடல் வினவல் "${searchQuery}" உடன் பொருந்தும் பணியாளர் கிடைக்கவில்லை.`);
    }
  };

  // Core handler: Apply new worker photo and sync everywhere
  const updateWorkerFacePhoto = (newPhotoUrl, sourceLabel = 'புதிய புகைப்படம்') => {
    setFacePhotoUrl(newPhotoUrl);
    const nowTime = new Date().toLocaleTimeString('ta-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setFaceUpdatedTime(nowTime);

    // 1. Update localStorage latestFacePhoto
    localStorage.setItem('latestFacePhoto', newPhotoUrl);

    // 2. Update worker in registeredWorkers localStorage
    const currentStored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    let updatedWorkers = [];

    if (currentStored.length > 0) {
      const activeJc = activeWorker?.jobCardNumber;
      updatedWorkers = currentStored.map((w, idx) => {
        const jc = w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${105 + idx}`;
        if (jc === activeJc || idx === selectedWorkerIndex) {
          return {
            ...w,
            facePhoto: newPhotoUrl,
            photo: newPhotoUrl,
            biometricVerified: true
          };
        }
        return w;
      });
      localStorage.setItem('registeredWorkers', JSON.stringify(updatedWorkers));
    }

    // 3. Update in-memory workers state
    setWorkers(prev => prev.map((w, idx) => {
      if (idx === selectedWorkerIndex) {
        return { ...w, facePhoto: newPhotoUrl };
      }
      return w;
    }));

    // 4. Dispatch storage event so other tabs and components reflect immediately
    window.dispatchEvent(new Event('storage'));

    showToast(`பணியாளர் "${activeWorker.fullName}" முகப் புகைப்படம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது! (${sourceLabel}) ✓`);
  };

  // Upload Photo File Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('தயவுசெய்து சரியான புகைப்படக் கோப்பைத் தேர்ந்தெடுக்கவும் (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        updateWorkerFacePhoto(base64Data, 'பதிவேற்றப்பட்டது');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Worksite Photo Upload Handler
  const handleWorksiteFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        setWorksitePhotoUrl(base64Data);
        localStorage.setItem('latestWorksitePhoto', base64Data);
        window.dispatchEvent(new Event('storage'));
        showToast('வேலைத்தள புவிசார் புகைப்பட சான்று வெற்றிகரமாக புதுப்பிக்கப்பட்டது! ✓');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Live Camera Handlers
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('இந்த உலாவியில் வெப்கேம் நேரலை ஆதரவு இல்லை.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      cameraStreamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(e => console.log('Camera video play error:', e));
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      setCameraError('கேமரா அணுகல் மறுக்கப்பட்டது அல்லது வன்பொருள் கண்டறியப்படவில்லை. மாதிரி புகைப்படத்தைப் பயன்படுத்தலாம்.');
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const openCameraModal = () => {
    setIsCameraModalOpen(true);
    setTimeout(() => {
      startCamera();
    }, 150);
  };

  const closeCameraModal = () => {
    stopCamera();
    setIsCameraModalOpen(false);
  };

  const capturePhotoFromCamera = () => {
    if (videoRef.current && isCameraActive) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        closeCameraModal();
        updateWorkerFacePhoto(dataUrl, 'நேரலை கேமரா மூலம் எடுக்கப்பட்டது');
      } catch (err) {
        console.warn('Canvas capture error:', err);
        closeCameraModal();
        updateWorkerFacePhoto(SAMPLE_WORKER_PHOTOS[0].url, 'மாதிரி படம்');
      }
    } else {
      closeCameraModal();
      updateWorkerFacePhoto(SAMPLE_WORKER_PHOTOS[0].url, 'மாதிரி படம்');
    }
  };

  // Run Neural Re-Audit simulation
  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      showToast(`பணியாளர் "${activeWorker.fullName}"-க்கான நரம்பியல் AI தணிக்கை வெற்றிகரமாக நிறைவடைந்தது!`);
    }, 1200);
  };

  const openViewer = (url, title) => {
    setModalImage(url);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  // Dynamic Risk Factors based on worker risk score
  const isHighRisk = (activeWorker?.riskScore || 82) >= 70;
  const isMediumRisk = (activeWorker?.riskScore || 82) >= 40 && (activeWorker?.riskScore || 82) < 70;

  const riskFactors = isHighRisk ? [
    {
      title: 'முக பொருத்தம் முரண்பாடு',
      icon: UserX,
      severity: 'உயர்',
      description: 'மதிய உருட்டல் அழைப்பின் போது முக அங்கீகார நம்பிக்கை 60% வரம்பிற்கு கீழே குறைந்தது.',
      confidence: '88% முரண்பாடு சாத்தியக்கூறு'
    },
    {
      title: 'இருப்பிட முரண்பாடு',
      icon: MapPinOff,
      severity: 'உயர்',
      description: 'அங்கீகரிக்கப்பட்ட 500மீ எல்லைக்கு வெளியே 820 மீட்டரில் GPS பதிவு செய்யப்பட்டது.',
      confidence: '94% எல்லை மீறல்'
    },
    {
      title: 'வருகைப்பதிவு முரண்பாடு',
      icon: Clock,
      severity: 'நடுத்தர',
      description: 'இரண்டு தொலைதூர வேலைத்தளங்களில் ஒரே நேரத்தில் வருகைப்பதிவு செய்யப்பட்டுள்ளது.',
      confidence: '72% இரட்டை முறை'
    },
    {
      title: 'ஊதிய செலுத்துகை முரண்பாடு',
      icon: AlertOctagon,
      severity: 'குறைவு',
      description: 'தள புகைப்பட சான்று இல்லாமல் அதிகபட்ச ஊதிய வரம்பிற்கான கோரிக்கை கொடியிடப்பட்டுள்ளது.',
      confidence: '55% தணிக்கை வரம்பு'
    }
  ] : isMediumRisk ? [
    {
      title: 'நேர இடைவெளி முரண்பாடு',
      icon: Clock,
      severity: 'நடுத்தர',
      description: 'வருகை ஸ்கேன் மற்றும் பணி தொடக்க நேரத்திற்கு இடையே 45 நிமிட தாமதம் கண்டறியப்பட்டது.',
      confidence: '64% நேர முரண்பாடு'
    },
    {
      title: 'முக பொருத்தம் சரிபார்ப்பு தேவை',
      icon: UserX,
      severity: 'நடுத்தர',
      description: 'பார்வை கோண மாறுபாட்டால் முக பொருத்த நம்பிக்கை 78% ஆக உள்ளது.',
      confidence: '78% நரம்பியல் பொருத்தம்'
    },
    {
      title: 'புவிசார் வேலைத்தள சான்று',
      icon: CheckCircle2,
      severity: 'குறைவு',
      description: 'வேலைத்தள எல்லைக்குள் சரியாக பதிவு செய்யப்பட்டுள்ளது.',
      confidence: '99% எல்லை ஏற்பு'
    },
    {
      title: 'வங்கி கணக்கு சரிபார்ப்பு',
      icon: CheckCircle2,
      severity: 'குறைவு',
      description: 'ஆதார் இணைக்கப்பட்ட வங்கி கணக்கு DBT முறைக்கு சரியாக உள்ளது.',
      confidence: '100% வங்கி சரிபார்ப்பு'
    }
  ] : [
    {
      title: 'முக உயிரியல் சரிபார்ப்பு',
      icon: CheckCircle2,
      severity: 'இயல்பானது',
      description: '100% நேரலை முக மற்றும் விழித்திரை பொருத்தம் உறுதி செய்யப்பட்டது.',
      confidence: '99.4% உயர் பொருத்தம்'
    },
    {
      title: 'புவிசார் இருப்பிடம் (GPS Geofence)',
      icon: CheckCircle2,
      severity: 'இயல்பானது',
      description: 'வேலைத்தளத்தின் 500மீ எல்லைக்குள் துல்லியமாக பதிவு செய்யப்பட்டுள்ளது.',
      confidence: '98.8% எல்லை சரிபார்ப்பு'
    },
    {
      title: 'வருகைப்பதிவு நிலை',
      icon: CheckCircle2,
      severity: 'இயல்பானது',
      description: 'இரட்டை பதிவு அல்லது போலி உள்ளீடுகள் எதுவும் கண்டறியப்படவில்லை.',
      confidence: '100% உண்மையான வருகை'
    },
    {
      title: 'ஊதிய தகுதி நிலை',
      icon: CheckCircle2,
      severity: 'இயல்பானது',
      description: 'பணி முன்னேற்ற சான்று புகைப்படத்துடன் ஊதிய கணக்கீடு ஒத்துள்ளது.',
      confidence: '100% ஊதிய தகுதி'
    }
  ];

  return (
    <AppLayout title="AI மோசடி தணிக்கை" breadcrumb="AI தணிக்கை">
      {/* Hidden file inputs for photo upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={handleFileUpload} 
      />
      <input 
        type="file" 
        ref={worksiteFileInputRef} 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={handleWorksiteFileUpload} 
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          backgroundColor: '#ECFDF3',
          border: '1px solid #6CE9A6',
          color: '#027A48',
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '13px',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <CheckCircle2 size={18} style={{ color: '#12B76A', flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">AI மோசடி கண்டறிதல் & தணிக்கை அமைப்பு</h2>
          <p className="page-header-subtitle">
            போலி பணியாளர்கள் மற்றும் முக உயிரியல் முரண்பாடுகளைக் கண்டறிவதற்கான நரம்பியல் ஆபத்து மதிப்பீடு.
          </p>
        </div>
      </div>

      {/* Worker Selector & Search Bar Container */}
      <div className="app-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} style={{ color: 'var(--primary-blue)' }} />
            <span>AI தணிக்கைக்கான பணியாளர் தேர்வு & தேடல் ({workers.length} பதிவு செய்யப்பட்ட பணியாளர்கள்):</span>
          </div>

          {/* Quick Worker Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>பணியாளர் மாற்று:</span>
            <select
              value={selectedWorkerIndex}
              onChange={(e) => handleSelectWorker(Number(e.target.value))}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #D0D5DD',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--text-dark)',
                backgroundColor: '#F8FAFC',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {workers.map((w, idx) => (
                <option key={w.id || idx} value={idx}>
                  {w.fullName} • {w.jobCardNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="பணியாளர் பெயர் அல்லது ஜாப் கார்டு எண்ணை உள்ளிடவும் (எ.கா. W10235, TN-04-002-004/101)..."
              style={{
                width: '100%',
                height: '42px',
                padding: '0 16px 0 40px',
                borderRadius: '8px',
                border: '1px solid #EAECF0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-blue"
            disabled={isAuditing}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isAuditing ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            <span>{isAuditing ? 'தணிக்கை நடைபெறுகிறது...' : 'நரம்பியல் தணிக்கை நடத்து'}</span>
          </button>
        </form>
      </div>

      {/* Worker Risk Summary Card */}
      <div 
        className="app-card" 
        style={{ 
          marginBottom: '24px', 
          backgroundColor: activeWorker.riskBg || '#FEF3F2', 
          border: `1px solid ${activeWorker.riskBorder || '#FECDCA'}` 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: activeWorker.riskColor || 'var(--status-danger)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                flexShrink: 0
              }}
            >
              <ShieldAlert size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-dark)' }}>
                  {activeWorker.fullName} ({activeWorker.jobCardNumber})
                </span>
                <span 
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    color: activeWorker.riskColor || 'var(--status-danger)', 
                    backgroundColor: '#FFFFFF', 
                    padding: '3px 10px', 
                    borderRadius: '12px', 
                    border: `1px solid ${activeWorker.riskBorder || '#FDA29B'}` 
                  }}
                >
                  ● {activeWorker.riskLevel || 'உயர் ஆபத்து முரண்பாடு'}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#475467', fontWeight: 500, marginTop: '4px' }}>
                ஒதுக்கப்பட்ட வேலைத்தளம்: <strong>{activeWorker.worksiteName}</strong> • {activeWorker.villageName}, {activeWorker.district}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#475467' }}>நரம்பியல் ஆபத்து மதிப்பெண்</div>
            <div 
              style={{ 
                fontSize: '36px', 
                fontWeight: 900, 
                color: activeWorker.riskColor || 'var(--status-danger)', 
                letterSpacing: '-0.02em', 
                lineHeight: 1, 
                marginTop: '2px' 
              }}
            >
              {activeWorker.riskScore} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Live Geotagged & Facial Proof Evidence Panel */}
      <div className="app-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>
            நேரடி புவிசார் சான்று & முக புகைப்பட தணிக்கை
          </h3>

          {/* Quick Sample Photos Selector for Easy Testing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>மாதிரி படங்கள்:</span>
            {SAMPLE_WORKER_PHOTOS.map((sample, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => updateWorkerFacePhoto(sample.url, sample.name)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #D0D5DD',
                  backgroundColor: '#F8FAFC',
                  color: 'var(--text-dark)',
                  cursor: 'pointer'
                }}
                title="மாதிரி புகைப்படத்திற்கு மாற்றுக"
              >
                {sample.name.split(' ')[0]} {sIdx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-12">
          {/* Worksite Photo Proof */}
          <div className="col-span-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                தற்போதைய புவிசார் வேலைத்தள புகைப்பட சான்று
              </div>
              <button
                type="button"
                onClick={() => worksiteFileInputRef.current?.click()}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--primary-blue)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Upload size={12} />
                <span>தள படம் மாற்று</span>
              </button>
            </div>

            <div 
              style={{
                width: '100%',
                height: '190px',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#0F172A',
                cursor: 'pointer'
              }}
              onClick={() => openViewer(worksitePhotoUrl, 'புவிசார் வேலைத்தள புகைப்பட சான்று')}
            >
              <img 
                src={worksitePhotoUrl} 
                alt="எடுக்கப்பட்ட புவிசார் வேலைத்தள புகைப்பட சான்று" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.src = DEFAULT_WORKSITE_PHOTO; }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#10B981',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCircle2 size={12} />
                <span>SHA-256 புவிசார் முத்திரை</span>
              </div>
              <div 
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.90)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} style={{ color: '#38BDF8' }} />
                  <span>{localStorage.getItem('latestWorksitePhotoLocation') || 'பூண்டி, திருவள்ளூர்'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} style={{ color: '#FCD34D' }} />
                  <span>{photoCapturedTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Facial Snapshot Proof with Dedicated Photo Update Options */}
          <div className="col-span-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                எடுக்கப்பட்ட முக உயிரியல் புகைப்படம் (AI Biometric Face)
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#12B76A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                <span>உயிரியல் ஒத்திசைவு செயலில்</span>
              </div>
            </div>

            <div 
              style={{
                width: '100%',
                height: '190px',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: facePhotoUrl ? 'pointer' : 'default',
                border: '2px solid #334155'
              }}
              onClick={() => { if (facePhotoUrl) openViewer(facePhotoUrl, `பணியாளர் ${activeWorker.fullName} முக புகைப்படம்`); }}
            >
              {facePhotoUrl ? (
                <img 
                  src={facePhotoUrl} 
                  alt="எடுக்கப்பட்ட பணியாளர் முக படம்" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.src = SAMPLE_WORKER_PHOTOS[0].url; }}
                />
              ) : (
                <div style={{ color: '#94A3B8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                  <Camera size={36} style={{ margin: '0 auto 8px', color: '#64748B' }} />
                  <div>இந்த தணிக்கை ஓட்டத்தில் இன்னும் முக படம் எடுக்கப்படவில்லை.</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>கீழே உள்ள பொத்தானைப் பயன்படுத்தி புகைப்படத்தைப் புதுப்பிக்கவும்.</div>
                </div>
              )}

              {/* Photo Verification HUD Overlay */}
              {facePhotoUrl && (
                <>
                  <div 
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#38BDF8',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <UserCheck size={12} />
                    <span>{activeWorker.fullName} ({activeWorker.jobCardNumber})</span>
                  </div>

                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.90)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} style={{ color: '#38BDF8' }} />
                      <span>கிளிக் செய்து பெரிதாக்குக</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} style={{ color: '#A7F3D0' }} />
                      <span>{faceUpdatedTime ? `புதுப்பித்தது: ${faceUpdatedTime}` : photoCapturedTime}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Direct Worker Photo Update Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-outline"
                style={{
                  flex: 1,
                  height: '36px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D0D5DD',
                  color: 'var(--text-dark)'
                }}
              >
                <Upload size={14} style={{ color: 'var(--primary-blue)' }} />
                <span>புகைப்படம் பதிவேற்று</span>
              </button>

              <button
                type="button"
                onClick={openCameraModal}
                className="btn-blue"
                style={{
                  flex: 1,
                  height: '36px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Camera size={14} />
                <span>நேரலை கேமராவில் எடு</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Risk Factor Cards Grid */}
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>
        கண்டறியப்பட்ட ஆபத்து காரணிகள் ({riskFactors.length})
      </h3>

      <div className="grid-12" style={{ marginBottom: '24px' }}>
        {riskFactors.map((factor, index) => {
          const Icon = factor.icon;
          return (
            <div key={index} className="col-span-6">
              <div className="app-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div 
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          backgroundColor: factor.severity === 'உயர்' ? 'var(--status-danger-bg)' : factor.severity === 'நடுத்தர' ? 'var(--status-warning-bg)' : '#ECFDF3', 
                          color: factor.severity === 'உயர்' ? 'var(--status-danger)' : factor.severity === 'நடுத்தர' ? 'var(--status-warning)' : 'var(--status-success)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>{factor.title}</span>
                    </div>

                    <span 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        color: factor.severity === 'உயர்' ? 'var(--status-danger)' : factor.severity === 'நடுத்தர' ? 'var(--status-warning)' : 'var(--status-success)',
                        backgroundColor: factor.severity === 'உயர்' ? 'var(--status-danger-bg)' : factor.severity === 'நடுத்தர' ? 'var(--status-warning-bg)' : '#ECFDF3',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {factor.severity}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
                    {factor.description}
                  </p>
                </div>

                <div style={{ paddingTop: '10px', borderTop: '1px solid #EAECF0', fontSize: '12px', fontWeight: 700, color: 'var(--primary-blue)' }}>
                  {factor.confidence}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Human Review Actions Container */}
      <div className="app-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>அதிகாரி பரிசீலனை & பரிந்துரை</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            உயர் ஆபத்து கொடிகளை கைமுறை புல சரிபார்ப்பிற்கு அல்லது வட்டார அதிகாரி பரிசீலனைக்கு அனுப்பவும்.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn-outline"
            onClick={() => {
              if (facePhotoUrl) openViewer(facePhotoUrl, `முழு தணிக்கைப் பதிவு: ${activeWorker.fullName}`);
              else showToast('தணிக்கைப் பதிவுக்கான முகப் படம் இன்னும் கிடைக்கவில்லை.');
            }}
          >
            <Eye size={16} />
            <span>முழு தணிக்கைப் பதிவை காண்க</span>
          </button>

          <button 
            type="button"
            className="btn-blue"
            onClick={() => {
              setReviewSent(true);
              showToast(`பணியாளர் "${activeWorker.fullName}"-ன் தணிக்கை அறிக்கை வட்டார அதிகாரியிடம் சமர்ப்பிக்கப்பட்டது! ✓`);
            }}
            disabled={reviewSent}
          >
            {reviewSent ? <CheckCircle2 size={16} /> : <Send size={16} />}
            <span>{reviewSent ? 'வட்டார அதிகாரியிடம் சமர்ப்பிக்கப்பட்டது ✓' : 'அதிகாரி பரிசீலனைக்கு அனுப்பு'}</span>
          </button>
        </div>
      </div>

      {/* Live Camera Snapshot Modal for Instant Worker Face Photo Update */}
      {isCameraModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#0F172A',
            borderRadius: '16px',
            border: '1px solid #334155',
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            color: '#FFFFFF'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#1E293B'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} style={{ color: '#38BDF8' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>
                  நேரலை கேமரா மூலம் முகப் புகைப்படம் எடு
                </h4>
              </div>
              <button 
                type="button"
                onClick={closeCameraModal}
                style={{
                  background: '#334155',
                  border: 'none',
                  color: '#94A3B8',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Viewport */}
            <div style={{ position: 'relative', width: '100%', height: '360px', backgroundColor: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />

              {/* Scanning Reticle HUD */}
              <div style={{
                position: 'absolute',
                width: '220px',
                height: '220px',
                border: '2px dashed #38BDF8',
                borderRadius: '50%',
                pointerEvents: 'none',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)'
              }} />

              {cameraError && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(2, 6, 23, 0.9)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '12px'
                }}>
                  <AlertTriangle size={36} style={{ color: '#F87171' }} />
                  <p style={{ fontSize: '13px', color: '#FCA5A5', maxWidth: '380px' }}>{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      closeCameraModal();
                      updateWorkerFacePhoto(SAMPLE_WORKER_PHOTOS[0].url, 'மாதிரி படம்');
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#38BDF8',
                      color: '#020617',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    மாதிரி புகைப்படத்தைப் பயன்படுத்து
                  </button>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                தொழிலாளி: <strong>{activeWorker.fullName}</strong>
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={closeCameraModal}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid #475569',
                    color: '#CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ரத்து செய்
                </button>

                <button
                  type="button"
                  onClick={capturePhotoFromCamera}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#10B981',
                    color: '#020617',
                    fontSize: '13px',
                    fontWeight: 800,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Camera size={16} />
                  <span>புகைப்படம் எடு & புதுப்பி</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal Image Viewer */}
      <ImageViewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={modalImage}
        title={modalTitle}
        metadata={{
          location: 'AI மோசடி சான்று பதிவு • பூண்டி கிராமம்',
          time: photoCapturedTime
        }}
      />
    </AppLayout>
  );
};

export default AiFraudPage;
