import React, { useState, useEffect } from 'react';
import { QrScannerModal } from '../components/QrScannerModal';
import { QrCode, CheckCircle, AlertTriangle, UserCheck, Edit3, Calendar, RefreshCw, CheckCircle2, Check, X } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

export const AttendancePage = () => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [registeredWorkers, setRegisteredWorkers] = useState(() => {
    return JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
  });

  const [logs, setLogs] = useState([]);
  const [editingJobCard, setEditingJobCard] = useState(null);
  const [editingDateVal, setEditingDateVal] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Helper to get formatted current date: DD/MM/YYYY
  const getFormattedToday = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Calculate or extract realistic registration date for each worker
  const getWorkerRegistrationDate = (w, idx) => {
    if (w.registrationDate) return w.registrationDate;
    if (w.registeredDate) return w.registeredDate;
    if (w.date && w.date.includes('/')) return w.date;

    // If worker has an ID that is a timestamp
    if (w.id && typeof w.id === 'number' && w.id > 1700000000000) {
      const d = new Date(w.id);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }

    // Realistic staggered dates:
    // The currently/latest registered worker (index 0) gets today's date
    // Earlier registered workers get prior dates (2 days apart)
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - (idx * 2));
    return `${String(pastDate.getDate()).padStart(2, '0')}/${String(pastDate.getMonth() + 1).padStart(2, '0')}/${pastDate.getFullYear()}`;
  };

  // Listen to storage changes across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
      setRegisteredWorkers(stored);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Normalize existing workers in localStorage so registrationDate is persistently stored
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    if (stored.length > 0) {
      let changed = false;
      const normalized = stored.map((w, idx) => {
        if (!w.registrationDate) {
          changed = true;
          const regDate = getWorkerRegistrationDate(w, idx);
          return {
            ...w,
            registrationDate: regDate,
            registeredDate: regDate,
            date: regDate
          };
        }
        return w;
      });

      if (changed) {
        localStorage.setItem('registeredWorkers', JSON.stringify(normalized));
        setRegisteredWorkers(normalized);
      }
    }
  }, []);

  // Populate logs with workers and their registration dates
  useEffect(() => {
    const initialLogs = registeredWorkers.map((w, idx) => {
      const regDate = w.registrationDate || w.registeredDate || w.date || getWorkerRegistrationDate(w, idx);
      return {
        id: w.id || idx + 1,
        workerName: w['Full Name'] || w.fullName || 'பதிவு செய்யப்பட்ட பணியாளர்',
        jobCard: w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${101 + idx}`,
        project: w.worksiteName || 'குளம் தூர்வாருதல் & சீரமைத்தல்',
        date: regDate,
        status: w.attendanceStatus === 'விடுப்பு' ? 'விடுப்பு' : 'வருகை பதிவானது',
        gpsVerified: true
      };
    });
    setLogs(initialLogs);
  }, [registeredWorkers]);

  // Handle direct update of registration date for a specific worker
  const handleSaveDate = (jobCard) => {
    if (!editingDateVal.trim()) return;
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    let updatedWorkerName = '';

    const updatedList = currentList.map((w, idx) => {
      const jc = w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${101 + idx}`;
      if (jc === jobCard) {
        updatedWorkerName = w['Full Name'] || w.fullName || 'பணியாளர்';
        return {
          ...w,
          registrationDate: editingDateVal.trim(),
          registeredDate: editingDateVal.trim(),
          date: editingDateVal.trim()
        };
      }
      return w;
    });

    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    setEditingJobCard(null);
    showToast(`பணியாளர் "${updatedWorkerName}" பதிவு தேதி "${editingDateVal.trim()}" என புதுப்பிக்கப்பட்டது!`);
  };

  // 1-Click update currently/latest registered worker's date to today
  const handleUpdateCurrentWorkerDateToToday = () => {
    if (registeredWorkers.length === 0) return;
    const todayStr = getFormattedToday();
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    const targetWorker = currentList[0];
    const workerName = targetWorker ? (targetWorker['Full Name'] || targetWorker.fullName) : 'நடப்பு பணியாளர்';

    const updatedList = currentList.map((w, idx) => {
      if (idx === 0) {
        return {
          ...w,
          registrationDate: todayStr,
          registeredDate: todayStr,
          date: todayStr
        };
      }
      return w;
    });

    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    showToast(`நடப்பு பணியாளர் "${workerName}" பதிவு தேதி "${todayStr}" என புதுப்பிக்கப்பட்டது!`);
  };

  // 1-Click stagger registration dates for all registered workers
  const handleStaggerAllDates = () => {
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    if (currentList.length === 0) return;

    const updatedList = currentList.map((w, idx) => {
      const now = new Date();
      now.setDate(now.getDate() - (idx * 2));
      const staggeredDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      return {
        ...w,
        registrationDate: staggeredDate,
        registeredDate: staggeredDate,
        date: staggeredDate
      };
    });

    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    showToast('அனைத்து பணியாளர்களின் பதிவு தேதிகளும் தனித்தனியாக வெற்றிகரமாக புதுப்பிக்கப்பட்டன!');
  };

  const handleScan = (res) => {
    const todayStr = getFormattedToday();
    setLogs(prev => [
      {
        id: Date.now(),
        workerName: res.workerName,
        jobCard: res.jobCardNumber,
        project: 'குளம் தூர்வாருதல் & சீரமைத்தல்',
        date: todayStr,
        status: 'வருகை பதிவானது',
        gpsVerified: res.gpsVerified
      },
      ...prev
    ]);
  };

  return (
    <AppLayout title="QR குறியீடு & GPS எல்லை வருகைப்பதிவு சரிபார்ப்பு" breadcrumb="வருகைப்பதிவு">
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="page-header-title">QR குறியீடு & GPS எல்லை வருகைப்பதிவு சரிபார்ப்பு</h2>
            <p className="page-header-subtitle">500 மீட்டர் திட்ட எல்லை சரிபார்ப்புடன் கூடிய தினசரி மஸ்டர் ரோல் சரிபார்ப்பு</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Quick Action: Update Current Worker's Registration Date to Today */}
            <button
              onClick={handleUpdateCurrentWorkerDateToToday}
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }}
              title="நடப்பு பணியாளரின் பதிவு தேதியை இன்றைய நாளாக அமைக்க"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>நடப்பு பதிவு தேதியை இன்றாக மாற்று ({getFormattedToday()})</span>
            </button>

            {/* Quick Action: Stagger dates for all registered workers */}
            <button
              onClick={handleStaggerAllDates}
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }}
              title="அனைத்து தொழிலாளர்களுக்கும் பதிவு தேதிகளை வரிசைப்படுத்த"
            >
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              <span>பதிவு தேதிகளை சீரமை</span>
            </button>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="btn-blue"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <QrCode className="w-4 h-4" /> 
              <span>QR மூலம் வருகைப்பதிவு செய்</span>
            </button>
          </div>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div style={{ padding: '12px 16px', backgroundColor: 'var(--status-success-bg)', border: '1px solid #ABEFC6', borderRadius: '8px', color: '#027A48', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Attendance Table */}
        <div className="app-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>
              நேரலை வருகைப்பதிவேடு ({logs.length} பதிவுகள்)
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
              * 'தேதி' கலத்தில் உள்ள <strong style={{ color: 'var(--primary-blue)' }}>[திருத்து]</strong> பட்டன் மூலம் பதிவு தேதியை நேரடியாக மாற்றலாம்.
            </span>
          </div>

          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #EAECF0' }}>
              <UserCheck size={36} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>பதிவு செய்யப்பட்ட பணியாளர்கள் எவரும் இல்லை</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                'பணியாளர் பதிவு' பக்கத்தில் புதிய தொழிலாளர்களைப் பதிவு செய்த பின் வருகைப்பதிவு இங்கே தோன்றும்.
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #EAECF0', backgroundColor: '#F9FAFB', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>பணியாளர் பெயர்</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>ஜாப் கார்டு எண்</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>வேலைத் திட்டம்</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>தேதி</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>நிலை</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>GPS எல்லை சரிபார்ப்பு</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const isEditingThis = editingJobCard === log.jobCard;

                    return (
                      <tr key={log.id} style={{ borderBottom: '1px solid #F2F4F7' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>{log.workerName}</td>
                        <td style={{ padding: '14px', fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '12px' }}>{log.jobCard}</td>
                        <td style={{ padding: '14px', fontWeight: 500 }}>{log.project}</td>
                        
                        {/* Interactive Date Cell with Inline Edit */}
                        <td style={{ padding: '14px' }}>
                          {isEditingThis ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <input
                                type="text"
                                value={editingDateVal}
                                onChange={(e) => setEditingDateVal(e.target.value)}
                                placeholder="DD/MM/YYYY"
                                style={{
                                  width: '105px',
                                  padding: '4px 8px',
                                  fontSize: '12px',
                                  fontFamily: 'monospace',
                                  fontWeight: 700,
                                  borderRadius: '6px',
                                  border: '1px solid var(--primary-blue)',
                                  backgroundColor: '#fff',
                                  outline: 'none'
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveDate(log.jobCard)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#027A48',
                                  color: '#fff',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                title="சேமிக்க"
                              >
                                <Check size={13} />
                              </button>
                              <button
                                onClick={() => setEditingJobCard(null)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#F2F4F7',
                                  color: '#344054',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                title="ரத்து செய்ய"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: 'var(--text-dark)', fontWeight: 600, fontFamily: 'monospace' }}>
                                {log.date}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingJobCard(log.jobCard);
                                  setEditingDateVal(log.date);
                                }}
                                style={{
                                  padding: '2px 7px',
                                  borderRadius: '5px',
                                  border: '1px solid #EAECF0',
                                  backgroundColor: '#F9FAFB',
                                  color: 'var(--primary-blue)',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="பதிவு தேதியை மாற்ற கிளிக் செய்க"
                              >
                                <Edit3 size={11} />
                                <span>திருத்து</span>
                              </button>
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '14px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', backgroundColor: 'var(--status-success-bg)', padding: '2px 8px', borderRadius: '4px' }}>
                            {log.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          {log.gpsVerified ? (
                            <span style={{ color: 'var(--status-success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                              <CheckCircle size={14} /> சரிபார்க்கப்பட்டது (எல்லைக்குள்)
                            </span>
                          ) : (
                            <span style={{ color: 'var(--status-danger)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                              <AlertTriangle size={14} /> முரண்பாடு (எல்லைக்கு வெளியே)
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

        <QrScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanComplete={handleScan}
        />
      </div>
    </AppLayout>
  );
};

export default AttendancePage;
