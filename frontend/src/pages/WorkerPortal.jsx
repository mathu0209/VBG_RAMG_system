import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, QrCode, Calendar, CreditCard, CheckCircle2, ShieldCheck, MapPin, 
  Clock, LogOut, UserCheck, Users, Eye, Trash2, Camera, Scan, 
  UserX, AlertCircle, Plus, Minus, Edit3, Filter, Check, X, ArrowRight, RefreshCw, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LiveLocationHeader } from '../components/shared/LiveLocationHeader';
import { FaceEyeScannerModal } from '../components/FaceEyeScannerModal';

export const WorkerPortal = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, lang } = useLanguage();

  const [registeredWorkers, setRegisteredWorkers] = useState(() => {
    return JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFaceEyeModal, setShowFaceEyeModal] = useState(false);
  
  // Table filter: 'ALL' | 'PRESENT' | 'ABSENT'
  const [tableFilter, setTableFilter] = useState('ALL');

  // Edit Modal State
  const [editingWorker, setEditingWorker] = useState(null);
  const [editWorkDays, setEditWorkDays] = useState(20);
  const [editAbsentDays, setEditAbsentDays] = useState(0);
  const [editStatus, setEditStatus] = useState('வருகை தந்தார்');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Standard realistic default working days list
  const standardWorkDaysList = [22, 28, 16, 24, 18, 20, 25];
  const standardAbsentDaysList = [1, 2, 4, 1, 3, 2, 0];

  // Helper function to extract or initialize realistic dynamic stats per worker
  const getWorkerStats = (w, idx) => {
    const defaultWorkDays = standardWorkDaysList[idx % standardWorkDaysList.length];
    const defaultAbsentDays = standardAbsentDaysList[idx % standardAbsentDaysList.length];
    const defaultStatus = idx === 2 ? 'விடுப்பு' : 'வருகை தந்தார்';

    const workDays = (w.workDays !== undefined && Number(w.workDays) >= 5) 
      ? Number(w.workDays) 
      : defaultWorkDays;
      
    const absentDays = w.absentDays !== undefined ? Math.max(0, Number(w.absentDays)) : defaultAbsentDays;
    const attendanceStatus = w.attendanceStatus || defaultStatus;
    const isAbsent = attendanceStatus === 'விடுப்பு' || attendanceStatus === 'வருகை இல்லை' || attendanceStatus === 'ABSENT';
    const dailyWage = 310;
    const totalWage = workDays * dailyWage;
    const remainingDays = Math.max(0, 100 - workDays);

    return {
      workDays,
      absentDays,
      attendanceStatus: isAbsent ? 'விடுப்பு' : 'வருகை தந்தார்',
      dailyWage,
      totalWage,
      remainingDays,
      isAbsent
    };
  };

  // Ensure workers in localStorage have normalized realistic workDays, absentDays & attendanceStatus
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    if (stored.length > 0) {
      let changed = false;

      const normalized = stored.map((w, idx) => {
        // If days are unassigned or were set to low test values (< 5)
        if (w.workDays === undefined || w.absentDays === undefined || !w.attendanceStatus || Number(w.workDays) < 5) {
          changed = true;
          return {
            ...w,
            workDays: standardWorkDaysList[idx % standardWorkDaysList.length],
            absentDays: w.absentDays !== undefined ? Number(w.absentDays) : standardAbsentDaysList[idx % standardAbsentDaysList.length],
            attendanceStatus: w.attendanceStatus || (idx === 2 ? 'விடுப்பு' : 'வருகை தந்தார்')
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

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
      setRegisteredWorkers(stored);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const activeJc = sessionStorage.getItem('activeWorkerJobCard');
    if (activeJc && registeredWorkers.length > 0) {
      const foundIdx = registeredWorkers.findIndex(w => (w['Job Card Number'] || w.jobCardNumber) === activeJc);
      if (foundIdx !== -1) {
        setSelectedIndex(foundIdx);
      }
    }
  }, [registeredWorkers]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteWorker = (jobCardNumber, name) => {
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    const updatedList = currentList.filter(w => (w['Job Card Number'] || w.jobCardNumber) !== jobCardNumber);
    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    if (selectedIndex >= updatedList.length) {
      setSelectedIndex(Math.max(0, updatedList.length - 1));
    }
    showToast(`பணியாளர் "${name}" அமைப்பிலிருந்து நீக்கப்பட்டார்!`);
  };

  // Direct set of work days via inline input box
  const handleDirectSetDays = (jobCardNumber, val) => {
    const num = Math.max(0, Math.min(100, Number(val) || 0));
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    const updatedList = currentList.map((w, idx) => {
      const jc = w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${105 + idx}`;
      if (jc === jobCardNumber) {
        return {
          ...w,
          workDays: num
        };
      }
      return w;
    });

    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
  };

  // Quick Increment / Decrement of Work Days directly from UI
  const handleQuickAdjustDays = (jobCardNumber, delta) => {
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    const updatedList = currentList.map((w, idx) => {
      const jc = w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${105 + idx}`;
      if (jc === jobCardNumber) {
        const stats = getWorkerStats(w, idx);
        const newDays = Math.max(0, Math.min(100, stats.workDays + delta));
        return {
          ...w,
          workDays: newDays,
          absentDays: stats.absentDays,
          attendanceStatus: stats.attendanceStatus
        };
      }
      return w;
    });

    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    showToast(`வேலை நாட்கள் ${delta > 0 ? '+1 நாள் கூட்டப்பட்டது' : '-1 நாள் குறைக்கப்பட்டது'}!`);
  };

  // Batch Update all workers to standard realistic working days
  const handleUpdateStandardDays = () => {
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    const updatedList = currentList.map((w, idx) => {
      return {
        ...w,
        workDays: standardWorkDaysList[idx % standardWorkDaysList.length],
        absentDays: standardAbsentDaysList[idx % standardAbsentDaysList.length],
        attendanceStatus: idx === 2 ? 'விடுப்பு' : 'வருகை தந்தார்'
      };
    });

    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    showToast('அனைத்து பணியாளர்களின் நடப்பு வேலை நாட்கள் மற்றும் ஊதியம் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!');
  };

  // Toggle Attendance between Present (வருகை தந்தார்) and Absent (விடுப்பு)
  const handleToggleAttendance = (jobCardNumber) => {
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    let updatedWorkerName = '';
    let newStatusStr = '';

    const updatedList = currentList.map((w, idx) => {
      const jc = w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${105 + idx}`;
      if (jc === jobCardNumber) {
        const stats = getWorkerStats(w, idx);
        updatedWorkerName = w['Full Name'] || w.fullName || 'பணியாளர்';
        if (stats.isAbsent) {
          // Change to Present: workDays + 1, absentDays stays or -1
          newStatusStr = 'வருகை தந்தார்';
          return {
            ...w,
            attendanceStatus: 'வருகை தந்தார்',
            workDays: Math.min(100, stats.workDays + 1),
            absentDays: Math.max(0, stats.absentDays - 1)
          };
        } else {
          // Change to Absent: absentDays + 1
          newStatusStr = 'விடுப்பு';
          return {
            ...w,
            attendanceStatus: 'விடுப்பு',
            absentDays: stats.absentDays + 1
          };
        }
      }
      return w;
    });

    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    showToast(`பணியாளர் "${updatedWorkerName}" நிலை "${newStatusStr}" என மாற்றப்பட்டது!`);
  };

  // Open Edit Modal for exact days update
  const handleOpenEditModal = (worker, idx) => {
    const stats = getWorkerStats(worker, idx);
    setEditingWorker({ worker, idx });
    setEditWorkDays(stats.workDays);
    setEditAbsentDays(stats.absentDays);
    setEditStatus(stats.attendanceStatus);
  };

  // Save Modal Edits
  const handleSaveModal = () => {
    if (!editingWorker) return;
    const currentList = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    const targetJc = editingWorker.worker['Job Card Number'] || editingWorker.worker.jobCardNumber;

    const updatedList = currentList.map((w, idx) => {
      const jc = w['Job Card Number'] || w.jobCardNumber;
      if (jc === targetJc) {
        return {
          ...w,
          workDays: Math.max(0, Math.min(100, Number(editWorkDays))),
          absentDays: Math.max(0, Number(editAbsentDays)),
          attendanceStatus: editStatus
        };
      }
      return w;
    });

    localStorage.setItem('registeredWorkers', JSON.stringify(updatedList));
    setRegisteredWorkers(updatedList);
    setEditingWorker(null);
    showToast('பணியாளர் வேலை நாட்கள் மற்றும் வருகை விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன!');
  };

  const activeWorker = registeredWorkers.length > 0 ? (registeredWorkers[selectedIndex] || registeredWorkers[0]) : null;

  const workerName = activeWorker 
    ? (activeWorker['Full Name'] || activeWorker.fullName || activeWorker.workerName || 'பதிவு செய்யப்பட்ட பணியாளர்')
    : (user?.fullName || 'பதிவு செய்யப்பட்ட பணியாளர்');

  const jobCard = activeWorker 
    ? (activeWorker['Job Card Number'] || activeWorker.jobCardNumber || activeWorker.jobCard || 'TN-04-002-004/105')
    : 'TN-04-002-004/105';

  const rawGender = activeWorker ? (activeWorker['Gender'] || activeWorker.gender || 'ஆண்') : 'ஆண்';
  const genderVal = (rawGender === 'Female' || rawGender === 'female' || rawGender === 'பெண்') ? 'பெண்' : 'ஆண்';
  const bankAccount = activeWorker ? (activeWorker['Bank Account'] || activeWorker.bankAccount || 'XXXX-XXXX-6821') : 'XXXX-XXXX-6821';
  const rawStatus = activeWorker ? (activeWorker['Status'] || activeWorker.status || 'சரிபார்க்கப்பட்டது') : 'சரிபார்க்கப்பட்டது';
  const statusVal = (rawStatus === 'REJECTED' || rawStatus === 'rejected' || rawStatus === 'நிராகரிக்கப்பட்டது') ? 'நிராகரிக்கப்பட்டது' : 'சரிபார்க்கப்பட்டது';

  const workerVillage = activeWorker 
    ? (activeWorker.villageName || activeWorker['Panchayat'] || activeWorker.panchayat || activeWorker.village || 'பூண்டி கிராமம்')
    : (user?.village || 'பூண்டி கிராமம்');
  const workerDistrict = activeWorker
    ? (activeWorker.district || activeWorker['District'] || 'திருவள்ளூர் மாவட்டம்')
    : (user?.district || 'திருவள்ளூர் மாவட்டம்');

  // Active Worker Dynamic Stats
  const activeStats = activeWorker ? getWorkerStats(activeWorker, selectedIndex) : {
    workDays: 22,
    absentDays: 0,
    attendanceStatus: 'வருகை தந்தார்',
    dailyWage: 310,
    totalWage: 6820,
    remainingDays: 78,
    isAbsent: false
  };

  // Filter workers for the table
  const filteredWorkersWithStats = registeredWorkers.map((w, idx) => ({
    worker: w,
    originalIndex: idx,
    stats: getWorkerStats(w, idx)
  })).filter(item => {
    if (tableFilter === 'PRESENT') return !item.stats.isAbsent;
    if (tableFilter === 'ABSENT') return item.stats.isAbsent;
    return true;
  });

  const presentCount = registeredWorkers.filter((w, idx) => !getWorkerStats(w, idx).isAbsent).length;
  const absentCount = registeredWorkers.filter((w, idx) => getWorkerStats(w, idx).isAbsent).length;
  const attendanceRate = registeredWorkers.length > 0 
    ? Math.round((presentCount / registeredWorkers.length) * 100) 
    : 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <LiveLocationHeader 
        title="கிராமப்புற பணியாளர் சேவை போர்ட்டல்" 
        subtitle="100 நாட்கள் வேலை அட்டை நிலை, வருகைப்பதிவு வரலாறு & நேரடி வங்கி ஊதியக் கொடுப்பனவு" 
        showLogout={true} 
      />
      
      {/* Precision Widescreen Container: max-w-[1440px] with responsive padding */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="bg-emerald-500/20 border border-emerald-500/50 p-4 rounded-xl flex items-center gap-3 text-emerald-300 font-bold text-xs animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {registeredWorkers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-3">
            <UserCheck className="w-12 h-12 text-slate-500 mx-auto" />
            <h2 className="text-base font-extrabold text-white">பதிவு செய்யப்பட்ட பணியாளர்கள் எவரும் இல்லை</h2>
            <p className="text-xs text-slate-400">
              'பணியாளர் பதிவு' பக்கத்தில் புதிய தொழிலாளர்களைப் பதிவுசெய்தால், அவர்களின் விவரங்கள் மற்றும் ஜாப் கார்டு தகவல்கள் இங்கே தோன்றும்.
            </p>
          </div>
        ) : (
          <>
            {/* Worker Selector Dropdown (If multiple workers exist) */}
            {registeredWorkers.length > 1 && (
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>பதிவு செய்யப்பட்ட பணியாளரைத் தேர்ந்தெடுக்கவும் ({registeredWorkers.length} நபர்கள் பதிவு):</span>
                </div>

                <select
                  value={selectedIndex}
                  onChange={(e) => setSelectedIndex(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-emerald-400 outline-none cursor-pointer hover:border-emerald-500/60 transition-all max-w-md"
                >
                  {registeredWorkers.map((w, idx) => {
                    const nm = w['Full Name'] || w.fullName || `பணியாளர் ${idx + 1}`;
                    const jc = w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${105 + idx}`;
                    const wStats = getWorkerStats(w, idx);
                    return (
                      <option key={idx} value={idx}>
                        {nm} ({jc}) — {wStats.workDays} நாட்கள் வேலை • {wStats.isAbsent ? '[விடுப்பு]' : '[வருகை]'}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* Top Selected Worker Identity Header Card - Spans Full 1440px Container Width */}
            <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-2xl shrink-0 shadow-inner ${
                  activeStats.isAbsent 
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' 
                    : 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400'
                }`}>
                  {workerName.charAt(0) || 'ப'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{workerName}</h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                      பணியாளர் ({genderVal})
                    </span>
                    {/* Real-Time Attendance Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-bold text-xs border ${
                      activeStats.isAbsent 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {activeStats.isAbsent ? <UserX className="w-3.5 h-3.5 text-rose-400" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{activeStats.isAbsent ? 'இன்று: விடுப்பு (வராதவர்)' : 'இன்று: பணிக்கு வந்தார்'}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    ஜாப் கார்டு எண்: <strong className="text-slate-200 font-mono text-sm">{jobCard}</strong> • {workerVillage}, {workerDistrict}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* 1-Click Toggle Attendance Button */}
                <button
                  onClick={() => handleToggleAttendance(jobCard)}
                  className={`h-10 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                    activeStats.isAbsent 
                      ? 'bg-emerald-950/80 border-emerald-500/50 hover:bg-emerald-900 text-emerald-300' 
                      : 'bg-rose-950/80 border-rose-500/50 hover:bg-rose-900 text-rose-300'
                  }`}
                  title="இன்றைய வருகை நிலையை மாற்றுக"
                >
                  {activeStats.isAbsent ? <UserCheck className="w-4 h-4 text-emerald-400" /> : <UserX className="w-4 h-4 text-rose-400" />}
                  <span>{activeStats.isAbsent ? 'இன்று வருகை என மாற்று' : 'இன்று விடுப்பு என மாற்று'}</span>
                </button>

                <button
                  onClick={() => setShowFaceEyeModal(true)}
                  className="h-10 px-4 rounded-xl bg-blue-900/50 border border-blue-500/50 hover:bg-blue-800 text-cyan-300 text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Scan className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span>👁️ முகம் & கண் சரிபார்</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="h-10 px-4 rounded-xl bg-slate-950 border border-slate-700 hover:border-rose-500/60 text-slate-200 hover:text-rose-400 text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>வெளியேறு</span>
                </button>
              </div>
            </div>

            {/* Worker KPI Summary Grid - 4 Perfectly Balanced Cards (Height: 180px, Gap: 20px) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Dynamic Work Days Logged */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl min-h-[175px] flex flex-col justify-between shadow-xl relative overflow-hidden group">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>வேலை செய்த மொத்த நாட்கள்</span>
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-black text-white">{activeStats.workDays}</div>
                    <div className="text-xs font-bold text-slate-400">/ 100 நாட்கள்</div>
                  </div>
                  {/* Visual Progress Bar to 100 Days Guarantee */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, activeStats.workDays)}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  மீதமுள்ள உத்தரவாத நாட்கள்: <strong className="text-blue-300">{activeStats.remainingDays} நாட்கள்</strong>
                </p>
              </div>

              {/* Card 2: Dynamic Wage Earnings (Computed directly from workDays * 310) */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl min-h-[175px] flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>வழங்கப்பட்ட மொத்த ஊதியம்</span>
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">
                    ₹ {activeStats.totalWage.toLocaleString('ta-IN')}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                    தினசரி ஊதியம்: ₹310 • வங்கி: {bankAccount}
                  </p>
                </div>
                <div className="text-[11px] text-emerald-400/90 font-mono font-bold">
                  கணக்கீடு: {activeStats.workDays} நாட்கள் × ₹310 = ₹{activeStats.totalWage}
                </div>
              </div>

              {/* Card 3: Today's Attendance & Absence Status - No Ugly Word Breaks */}
              <div className={`p-5 rounded-2xl min-h-[175px] flex flex-col justify-between shadow-xl border ${
                activeStats.isAbsent 
                  ? 'bg-rose-950/20 border-rose-500/30' 
                  : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>இன்றைய வருகை & விடுப்பு</span>
                  {activeStats.isAbsent ? <UserX className="w-4 h-4 text-rose-400" /> : <UserCheck className="w-4 h-4 text-emerald-400" />}
                </div>
                <div>
                  <div className="text-xl font-extrabold flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full animate-pulse ${activeStats.isAbsent ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    <span className={activeStats.isAbsent ? 'text-rose-400' : 'text-emerald-400'}>
                      {activeStats.isAbsent ? 'விடுப்பு (Absent)' : 'வருகை (Present)'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium whitespace-nowrap mt-1">
                    நடப்பு ஆண்டில் விடுப்பு: <strong className={activeStats.isAbsent ? 'text-rose-300 font-bold' : 'text-slate-200'}>{activeStats.absentDays} நாட்கள்</strong>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleAttendance(jobCard)}
                  className="w-full h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer transition-all border border-slate-700"
                >
                  {activeStats.isAbsent ? '🔄 வருகை என மாற்று' : '🔄 விடுப்பு என மாற்று'}
                </button>
              </div>

              {/* Card 4: Assigned Worksite */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl min-h-[175px] flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>தற்போதைய வேலைத்தளம்</span>
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-white leading-tight">
                    குளம் தூர்வாருதல் & சீரமைத்தல்
                  </div>
                  <p className="text-xs text-emerald-400 font-mono font-bold mt-1">
                    திட்ட குறியீடு: WK12345 • {workerVillage}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400">
                  ஜாப் கார்டு நிலை: <span className="text-emerald-400 font-bold">{statusVal}</span>
                </div>
              </div>

            </div>

            {/* Attendance & Absence Live Statistics Strip with Clean Flex Alignment */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-lg min-h-[64px]">
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">மொத்த தொழிலாளர்கள்:</span>
                  <span className="font-extrabold text-white bg-slate-800 px-3 py-1 rounded-lg font-mono border border-slate-700">
                    {registeredWorkers.length} நபர்கள்
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">🟢 இன்று வருகை தந்தோர்:</span>
                  <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 font-mono">
                    {presentCount} நபர்கள்
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">🔴 இன்று விடுப்பு / வராதோர்:</span>
                  <span className="font-extrabold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/30 font-mono">
                    {absentCount} நபர்கள்
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">வருகை சதவீதம்:</span>
                  <span className="font-extrabold text-cyan-400 font-mono">
                    {attendanceRate}%
                  </span>
                </div>
              </div>

              {/* Attendance Quick Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setTableFilter('ALL')}
                  className={`h-9 px-4 rounded-xl font-bold transition-all cursor-pointer ${
                    tableFilter === 'ALL' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  அனைத்தும் ({registeredWorkers.length})
                </button>
                <button
                  onClick={() => setTableFilter('PRESENT')}
                  className={`h-9 px-4 rounded-xl font-bold transition-all cursor-pointer ${
                    tableFilter === 'PRESENT' 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  🟢 பணிக்கு வந்தோர் ({presentCount})
                </button>
                <button
                  onClick={() => setTableFilter('ABSENT')}
                  className={`h-9 px-4 rounded-xl font-bold transition-all cursor-pointer ${
                    tableFilter === 'ABSENT' 
                      ? 'bg-rose-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-rose-300'
                  }`}
                >
                  🔴 விடுப்பு எடுத்தோர் ({absentCount})
                </button>
              </div>
            </div>

            {/* ALL Registered Workers List Table Container with Locked Pixel Proportions */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span>
                      {tableFilter === 'ALL' && `பதிவு செய்யப்பட்ட அனைத்து பணியாளர்கள் பட்டியல் (${registeredWorkers.length} நபர்கள்)`}
                      {tableFilter === 'PRESENT' && `🟢 இன்று பணிக்கு வந்த பணியாளர்கள் (${presentCount} நபர்கள்)`}
                      {tableFilter === 'ABSENT' && `🔴 இன்று விடுப்பு எடுத்த பணியாளர்கள் (${absentCount} நபர்கள்)`}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    * வேலை நாட்களை நேரடியாக உள்ளிடலாம், <strong className="text-blue-400 font-mono">[+] / [-]</strong> கிளிக் செய்யலாம் அல்லது <strong className="text-emerald-400">[திருத்து]</strong> பயன்படுத்தலாம்.
                  </p>
                </div>

                {/* 1-Click Batch Update Standard Working Days */}
                <button
                  onClick={handleUpdateStandardDays}
                  className="h-9 px-4 rounded-xl bg-blue-900/40 border border-blue-500/40 hover:bg-blue-800/60 text-cyan-300 text-xs font-bold flex items-center gap-2 cursor-pointer shadow transition-all"
                  title="அனைத்து தொழிலாளர்களுக்கும் தரநிலையான நடப்பு வேலை நாட்களை அமைத்தல்"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
                  <span>நடப்பு வேலை நாட்களை தரநிலையாகப் புதுப்பி</span>
                </button>
              </div>

              {filteredWorkersWithStats.length === 0 ? (
                <div className="p-10 text-center text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="font-bold text-sm text-slate-300">
                    {tableFilter === 'ABSENT' 
                      ? 'இன்று யாரும் விடுப்பு எடுக்கவில்லை! அனைத்து பணியாளர்களும் பணிக்கு வந்துள்ளனர்.' 
                      : 'பணியாளர்கள் விவரங்கள் எதுவும் கிடைக்கவில்லை.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
                  <table className="w-full text-left text-xs border-collapse min-w-[1360px]">
                    
                    {/* Explicit Colgroup for Exact Locked Pixel Widths */}
                    <colgroup>
                      <col style={{ width: '64px' }} />
                      <col style={{ width: '230px' }} />
                      <col style={{ width: '190px' }} />
                      <col style={{ width: '180px' }} />
                      <col style={{ width: '250px' }} />
                      <col style={{ width: '130px' }} />
                      <col style={{ width: '160px' }} />
                      <col style={{ width: '210px' }} />
                    </colgroup>

                    <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800 tracking-wider">
                      <tr className="h-12">
                        <th className="py-3 px-3 text-center font-extrabold text-slate-400">#</th>
                        <th className="py-3 px-4 font-extrabold text-slate-300">பணியாளர் பெயர்</th>
                        <th className="py-3 px-4 font-extrabold text-slate-300">ஜாப் கார்டு எண்</th>
                        <th className="py-3 px-4 font-extrabold text-slate-300 text-center">இன்றைய வருகை நிலை</th>
                        <th className="py-3 px-4 font-extrabold text-slate-300">நடப்பு வேலை நாட்கள்</th>
                        <th className="py-3 px-4 font-extrabold text-slate-300 text-center">விடுப்பு நாட்கள்</th>
                        <th className="py-3 px-4 font-extrabold text-slate-300 text-right">மொத்த ஊதியம் (₹310/நாள்)</th>
                        <th className="py-3 px-4 font-extrabold text-slate-300 text-right">செயல்பாடுகள்</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {filteredWorkersWithStats.map((item, rowIdx) => {
                        const { worker: w, originalIndex: idx, stats } = item;
                        const nm = w['Full Name'] || w.fullName || `பணியாளர் ${idx + 1}`;
                        const jc = w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${105 + idx}`;
                        const isSelected = selectedIndex === idx;

                        return (
                          <tr 
                            key={idx} 
                            className={`h-[68px] hover:bg-slate-800/40 transition-colors ${
                              isSelected ? 'bg-emerald-500/10' : ''
                            } ${stats.isAbsent ? 'bg-rose-950/10' : ''}`}
                          >
                            {/* 1. Col: # - Centered Circular Pill Badge */}
                            <td className="py-3.5 px-3 text-center">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${
                                isSelected 
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black' 
                                  : 'bg-slate-800/90 text-slate-300 border-slate-700/80'
                              }`}>
                                {rowIdx + 1}
                              </span>
                            </td>
                            
                            {/* 2. Col: Worker Name & Gender Badge */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                                  {nm.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                    <span>{nm}</span>
                                    {stats.isAbsent && (
                                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                                        விடுப்பு
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-400">{w['Gender'] || w.gender || 'ஆண்'}</span>
                                </div>
                              </div>
                            </td>

                            {/* 3. Col: Job Card No - Clean Monospace Pill */}
                            <td className="py-3.5 px-4">
                              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/25 whitespace-nowrap">
                                {jc}
                              </span>
                            </td>

                            {/* 4. Col: Today's Status Badge with 1-Click Toggle */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => handleToggleAttendance(jc)}
                                className={`w-full h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                                  stats.isAbsent 
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30' 
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                }`}
                                title="வருகை நிலையை மாற்ற கிளிக் செய்யவும்"
                              >
                                {stats.isAbsent ? (
                                  <>
                                    <UserX className="w-3.5 h-3.5 text-rose-400" />
                                    <span>🔴 விடுப்பு (Absent)</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>🟢 வருகை (Present)</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* 5. Col: Current Work Days (Direct Input + Stepper + Progress Bar) */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleQuickAdjustDays(jc, -1)}
                                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-700/80 cursor-pointer transition-colors"
                                  title="-1 நாள் குறைக்க"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={stats.workDays}
                                  onChange={(e) => handleDirectSetDays(jc, e.target.value)}
                                  className="w-14 h-7 text-center rounded-lg bg-slate-950 border border-slate-700 text-blue-400 font-mono font-bold text-xs focus:border-blue-500 outline-none"
                                  title="வேலை நாட்களை நேரடியாக மாற்றவும்"
                                />
                                <button
                                  onClick={() => handleQuickAdjustDays(jc, 1)}
                                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center font-bold text-sm border border-slate-700/80 cursor-pointer transition-colors"
                                  title="+1 நாள் கூட்ட"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-slate-300 ml-1">நாட்கள்</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                                <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-blue-500 h-full rounded-full transition-all" 
                                    style={{ width: `${Math.min(100, stats.workDays)}%` }} 
                                  />
                                </div>
                                <span>மீதம்: <strong className="text-blue-300">{stats.remainingDays}</strong> நாட்கள்</span>
                              </div>
                            </td>

                            {/* 6. Col: Absent Days */}
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold whitespace-nowrap ${
                                stats.absentDays > 0 
                                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                                  : 'bg-slate-800/60 text-slate-400'
                              }`}>
                                {stats.absentDays} நாட்கள்
                              </span>
                            </td>

                            {/* 7. Col: Dynamically Computed Total Wage */}
                            <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-400 text-sm whitespace-nowrap">
                              ₹ {stats.totalWage.toLocaleString('ta-IN')}.00
                            </td>

                            {/* 8. Col: Clean Aligned Action Buttons */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedIndex(idx)}
                                  className={`h-8 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md' 
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                  }`}
                                >
                                  {isSelected ? '✓ நடப்பு' : 'காண்க'}
                                </button>

                                <button
                                  onClick={() => handleOpenEditModal(w, idx)}
                                  className="h-8 px-2.5 rounded-lg bg-blue-900/40 border border-blue-500/30 text-blue-300 hover:bg-blue-800/50 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                  title="நாட்கள் மற்றும் வருகை விவரங்களை திருத்த"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>திருத்து</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteWorker(jc, nm)}
                                  className="h-8 w-8 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 flex items-center justify-center cursor-pointer transition-colors"
                                  title="பணியாளரை நீக்கு"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Edit Work Days & Attendance Modal */}
        {editingWorker && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-white text-base">பணியாளர் வேலை & விடுப்பு புதுப்பிப்பு</h3>
                </div>
                <button
                  onClick={() => setEditingWorker(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Worker Identity Banner */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-white font-bold text-sm">
                    {editingWorker.worker['Full Name'] || editingWorker.worker.fullName}
                  </div>
                  <div className="text-emerald-400 font-mono font-bold">
                    ஜாப் கார்டு: {editingWorker.worker['Job Card Number'] || editingWorker.worker.jobCardNumber}
                  </div>
                </div>

                {/* Work Days Input */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 flex items-center justify-between">
                    <span>நடப்பு வேலை செய்த நாட்கள் (Work Days):</span>
                    <span className="text-emerald-400 font-mono">ஊதியம்: ₹{(Number(editWorkDays) * 310).toLocaleString('ta-IN')}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editWorkDays}
                      onChange={(e) => setEditWorkDays(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:border-emerald-500 outline-none"
                    />
                    <span className="text-slate-400 font-bold whitespace-nowrap">/ 100 நாட்கள்</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    2026-27 ஆண்டில் மீதமுள்ள உத்தரவாத நாட்கள்: {Math.max(0, 100 - Number(editWorkDays))} நாட்கள்
                  </p>
                </div>

                {/* Absent Days Input */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">
                    நடப்பு விடுப்பு எடுத்த நாட்கள் (Absent Days):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editAbsentDays}
                    onChange={(e) => setEditAbsentDays(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Today's Attendance Status */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-300">
                    இன்றைய வருகை நிலை (Today's Status):
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditStatus('வருகை தந்தார்')}
                      className={`h-10 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        editStatus === 'வருகை தந்தார்'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>வருகை தந்தார்</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStatus('விடுப்பு')}
                      className={`h-10 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        editStatus === 'விடுப்பு'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <UserX className="w-4 h-4" />
                      <span>விடுப்பு (Absent)</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingWorker(null)}
                  className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  ரத்து செய்
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>சேமித்து புதுப்பி</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Face & Eye Scanner Modal */}
        <FaceEyeScannerModal
          isOpen={showFaceEyeModal}
          onClose={() => setShowFaceEyeModal(false)}
          onVerified={() => setShowFaceEyeModal(false)}
          registeredWorkers={registeredWorkers}
        />

      </div>
    </div>
  );
};

export default WorkerPortal;
