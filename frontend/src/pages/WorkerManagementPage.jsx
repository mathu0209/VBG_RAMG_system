import React, { useState, useEffect } from 'react';
import { QrCodeDisplay } from '../components/QrCodeDisplay';
import { Users, UserPlus, ShieldCheck, Cpu, Trash2, X, AlertCircle, UserCheck, CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

import { TAMIL_NADU_DISTRICTS } from '../constants/districts';

export const WorkerManagementPage = () => {
  const [registeredWorkers, setRegisteredWorkers] = useState(() => {
    return JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
  });

  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('அனைத்து மாவட்டங்கள்');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedQrWorker, setSelectedQrWorker] = useState(null);
  const [notification, setNotification] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'ஆண்',
    dob: '1992-05-15',
    aadhaarNumber: '',
    bankAccount: '',
    ifscCode: 'SBIN0001234',
    district: 'திருவள்ளூர் மாவட்டம்',
    villageName: 'பூண்டி'
  });

  const [aiAlert, setAiAlert] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
      setRegisteredWorkers(stored);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleRegisterWorker = (e) => {
    e.preventDefault();
    
    const isDuplicate = registeredWorkers.some(w => (w.bankAccount || w['Bank Account']) === formData.bankAccount);
    
    if (isDuplicate) {
      setAiAlert('AI எச்சரிக்கை: ஏற்கனவே பதிவு செய்யப்பட்ட பணியாளரின் வங்கி கணக்கு எண் மீண்டும் கண்டறியப்பட்டது!');
    } else {
      setAiAlert(null);
    }

    const jcNum = `TN-04-002-004/${105 + registeredWorkers.length}`;

    const newWorkerRecord = {
      id: Date.now(),
      'Job Card Number': jcNum,
      jobCardNumber: jcNum,
      'Full Name': formData.fullName || 'பதிவு செய்யப்பட்ட பணியாளர்',
      fullName: formData.fullName || 'பதிவு செய்யப்பட்ட பணியாளர்',
      'Gender': formData.gender || 'ஆண்',
      gender: formData.gender || 'ஆண்',
      'Bank Account': `XXXX-XXXX-${formData.aadhaarNumber ? formData.aadhaarNumber.slice(-4) : '6821'}`,
      bankAccount: `XXXX-XXXX-${formData.aadhaarNumber ? formData.aadhaarNumber.slice(-4) : '6821'}`,
      ifscCode: formData.ifscCode,
      status: isDuplicate ? 'நிராகரிக்கப்பட்டது' : 'சரிபார்க்கப்பட்டது',
      'Status': isDuplicate ? 'நிராகரிக்கப்பட்டது' : 'சரிபார்க்கப்பட்டது',
      workDays: 1,
      absentDays: 0,
      attendanceStatus: 'வருகை தந்தார்',
      villageName: formData.villageName
    };

    const updatedList = [newWorkerRecord, ...registeredWorkers];
    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    setNotification(`பணியாளர் "${newWorkerRecord.fullName}" வெற்றிகரமாக பதிவு செய்யப்பட்டார்!`);
    setTimeout(() => setNotification(''), 4000);
    setIsRegisterModalOpen(false);
  };

  // Delete worker from localStorage and state
  const handleDeleteWorker = (jobCardNumber, name) => {
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    const updatedList = currentList.filter(w => (w['Job Card Number'] || w.jobCardNumber) !== jobCardNumber);
    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    setNotification(`பணியாளர் "${name}" (${jobCardNumber}) அமைப்பிலிருந்து நீக்கப்பட்டார்!`);
    setTimeout(() => setNotification(''), 4000);
  };

  const formattedWorkers = registeredWorkers
    .map((w, idx) => {
      const rawGender = w['Gender'] || w.gender || 'ஆண்';
      const genderVal = (rawGender === 'Female' || rawGender === 'female' || rawGender === 'பெண்') ? 'பெண்' : 'ஆண்';
      const rawStatus = w['Status'] || w.status || w.verificationStatus || 'சரிபார்க்கப்பட்டது';
      const statusVal = (rawStatus === 'REJECTED' || rawStatus === 'rejected' || rawStatus === 'நிராகரிக்கப்பட்டது') ? 'நிராகரிக்கப்பட்டது' : 'சரிபார்க்கப்பட்டது';
      const distVal = w.district || w['District'] || 'திருவள்ளூர் மாவட்டம்';

      return {
        id: w.id || idx + 1,
        jobCardNumber: w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${105 + idx}`,
        fullName: w['Full Name'] || w.fullName || 'பதிவு செய்யப்பட்ட பணியாளர்',
        gender: genderVal,
        bankAccountNumber: w['Bank Account'] || w.bankAccount || 'XXXX-XXXX-6821',
        ifscCode: w.ifscCode || 'SBIN0001234',
        district: distVal,
        villageName: w.villageName || 'பூண்டி',
        verificationStatus: statusVal
      };
    })
    .filter(w => selectedDistrictFilter === 'அனைத்து மாவட்டங்கள்' || w.district.includes(selectedDistrictFilter.replace(' மாவட்டம்', '')));

  return (
    <AppLayout title="பணியாளர் மேலாண்மை & ஜாப் கார்டு பதிவேடு" breadcrumb="பணியாளர்கள்">
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 className="page-header-title">பணியாளர் மேலாண்மை & ஜாப் கார்டு பதிவேடு</h2>
            <p className="page-header-subtitle">பதிவு செய்யப்பட்ட பணியாளர்களின் விவரங்கள், ஆதார் சரிபார்ப்பு மற்றும் QR அட்டை மேலாண்மை</p>
          </div>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="btn-blue"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <UserPlus className="w-4 h-4" /> 
            <span>புதிய பணியாளரை பதிவு செய்</span>
          </button>
        </div>

        {/* Success/Notification Banner */}
        {notification && (
          <div style={{ padding: '12px 16px', backgroundColor: 'var(--status-success-bg)', border: '1px solid #ABEFC6', borderRadius: '8px', color: '#027A48', fontWeight: 700, fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* AI Duplicate Alert Ticker */}
        {aiAlert && (
          <div style={{ padding: '12px 16px', backgroundColor: 'var(--status-danger-bg)', border: '1px solid #FDA4AF', borderRadius: '8px', color: '#9F1239', fontWeight: 700, fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{aiAlert}</span>
          </div>
        )}

        {/* District Filter Bar */}
        <div style={{ padding: '14px 18px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
            <span>மாவட்டத்தின் அடிப்படையில் வடிகட்டவும் (Filter by District):</span>
          </div>
          <select
            value={selectedDistrictFilter}
            onChange={(e) => setSelectedDistrictFilter(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, backgroundColor: '#FFFFFF', cursor: 'pointer', outline: 'none' }}
          >
            <option value="அனைத்து மாவட்டங்கள்">அனைத்து மாவட்டங்கள் (All Districts)</option>
            {TAMIL_NADU_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Workers Table */}
        <div className="app-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>
            பதிவு செய்யப்பட்ட பணியாளர்கள் ({selectedDistrictFilter}) ({formattedWorkers.length} நபர்கள்)
          </h3>

          {formattedWorkers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #EAECF0' }}>
              <UserCheck size={36} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>பதிவு செய்யப்பட்ட பணியாளர்கள் எவரும் இல்லை</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                'புதிய பணியாளரை பதிவு செய்' பொத்தானைக் கிளிக் செய்து புதிய தொழிலாளர்களை பதிவு செய்யலாம்.
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #EAECF0', backgroundColor: '#F9FAFB', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>ஜாப் கார்டு எண்</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>பணியாளர் பெயர்</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>பாலினம்</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>வங்கி கணக்கு</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>கிராமம்</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700 }}>சரிபார்ப்பு நிலை</th>
                    <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>செயல்பாடுகள்</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedWorkers.map((w) => (
                    <tr key={w.id} style={{ borderBottom: '1px solid #F2F4F7' }}>
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-blue)' }}>{w.jobCardNumber}</td>
                      <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>{w.fullName}</td>
                      <td style={{ padding: '14px', fontWeight: 600 }}>{w.gender}</td>
                      <td style={{ padding: '14px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{w.bankAccountNumber}</td>
                      <td style={{ padding: '14px' }}>{w.villageName}</td>
                      <td style={{ padding: '14px' }}>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            padding: '3px 8px', 
                            borderRadius: '4px',
                            color: w.verificationStatus === 'சரிபார்க்கப்பட்டது' ? 'var(--status-success)' : 'var(--status-danger)',
                            backgroundColor: w.verificationStatus === 'சரிபார்க்கப்பட்டது' ? 'var(--status-success-bg)' : 'var(--status-danger-bg)'
                          }}
                        >
                          {w.verificationStatus}
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button
                            onClick={() => setSelectedQrWorker(w)}
                            className="btn-outline"
                            style={{ height: '32px', padding: '0 10px', fontSize: '11px' }}
                          >
                            QR கார்டு காண்க
                          </button>
                          <button
                            onClick={() => handleDeleteWorker(w.jobCardNumber, w.fullName)}
                            style={{
                              height: '32px',
                              padding: '0 10px',
                              fontSize: '11px',
                              backgroundColor: '#FEF2F2',
                              color: '#9F1239',
                              border: '1px solid #FDA4AF',
                              borderRadius: '6px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="பணியாளரை நீக்கு"
                          >
                            <Trash2 size={13} />
                            <span>நீக்கு</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Worker Modal */}
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              <h3 className="text-base font-extrabold text-slate-900">புதிய பணியாளரை பதிவு செய்</h3>
              
              <form onSubmit={handleRegisterWorker} className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">முழு பெயர்</label>
                  <input 
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="எ.கா. மாரியப்பன்"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">பாலினம்</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    >
                      <option value="ஆண்">ஆண்</option>
                      <option value="பெண்">பெண்</option>
                      <option value="இதர">இதர</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">கிராமம்</label>
                    <input 
                      type="text"
                      value={formData.villageName}
                      onChange={(e) => setFormData({ ...formData, villageName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">வங்கி கணக்கு எண்</label>
                  <input 
                    type="text"
                    required
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    placeholder="991029402941"
                    className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs mt-2"
                >
                  பதிவு செய்
                </button>
              </form>
            </div>
          </div>
        )}

        {/* QR Display Modal */}
        {selectedQrWorker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setSelectedQrWorker(null)}
                className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
              <h3 className="text-base font-extrabold text-slate-900">டிஜிட்டல் QR வேலை அட்டை</h3>
              <p className="text-xs text-slate-500 font-bold">{selectedQrWorker.fullName}</p>
              <p className="text-xs font-mono text-blue-600 font-bold">{selectedQrWorker.jobCardNumber}</p>
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-center">
                <QrCodeDisplay value={selectedQrWorker.jobCardNumber} size={160} />
              </div>

              <button 
                onClick={() => setSelectedQrWorker(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                மூடுக
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default WorkerManagementPage;
