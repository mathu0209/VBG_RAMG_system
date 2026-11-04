import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Search,
  FileSpreadsheet,
  UserCheck
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

export const ReportsPage = () => {
  const [selectedReportType, setSelectedReportType] = useState('பணியாளர் அறிக்கை');
  const [exportSuccess, setExportSuccess] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  
  const [registeredWorkers, setRegisteredWorkers] = useState(() => {
    return JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
      setRegisteredWorkers(stored);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const reportOptions = [
    { title: 'பணியாளர் அறிக்கை', desc: 'ஜாப் கார்டு பதிவேடு, ஆதார் சரிபார்ப்பு மற்றும் விவரங்கள்' },
    { title: 'வருகைப்பதிவு அறிக்கை', desc: 'தினசரி மஸ்டர் ரோல், QR ஸ்கேன் பதிவுகள் மற்றும் GPS சரிபார்ப்பு' },
    { title: 'திட்ட அறிக்கை', desc: 'அங்கீகரிக்கப்பட்ட பணிகள், வரவு செலவுத் திட்டங்கள், நிறைவு %' },
    { title: 'மாவட்ட அறிக்கை', desc: 'ஒட்டுமொத்த மாவட்ட அளவிலான செலவினங்கள் மற்றும் பணிஅமர்வு' },
    { title: 'ஊராட்சி அறிக்கை', desc: 'கிராம ஊராட்சி முன்னேற்றம், பணி ஒதுக்கீடுகள் மற்றும் சமூக தணிக்கை' },
    { title: 'கிராம அறிக்கை', desc: 'கிராம அளவிலான சொத்து உருவாக்கம் மற்றும் வேலை தேவை அளவீடுகள்' },
    { title: 'மோசடி அறிக்கை', desc: 'AI கொடியிடப்பட்ட முரண்பாடுகள், போலி பணியாளர்கள் மற்றும் போலி பதிவுகள்' },
    { title: 'ஊதிய அறிக்கை', desc: 'DBT வங்கி பரிமாற்ற நிலைகள், ஊதிய கால மொத்தங்கள் மற்றும் குறிப்புகள்' },
    { title: 'புகார் அறிக்கை', desc: 'பொது மக்கள் குறைகள் மற்றும் தீர்வு நிலைகள்' },
  ];

  // Derive report entries exclusively from registered workers in localStorage with 100% Tamil translation
  const sanitizedRegisteredWorkers = registeredWorkers.map(w => {
    const rawGender = w['Gender'] || w.gender || 'ஆண்';
    let genderVal = 'ஆண்';
    if (rawGender === 'Female' || rawGender === 'female' || rawGender === 'பெண்') {
      genderVal = 'பெண்';
    } else if (rawGender === 'Transgender' || rawGender === 'இதர') {
      genderVal = 'இதர';
    } else {
      genderVal = 'ஆண்';
    }

    const rawStatus = w['Status'] || w.status || w.verificationStatus || 'சரிபார்க்கப்பட்டது';
    let statusVal = 'சரிபார்க்கப்பட்டது';
    if (rawStatus === 'PENDING' || rawStatus === 'pending' || rawStatus === 'நிலுவையில்') {
      statusVal = 'நிலுவையில்';
    } else if (rawStatus === 'REJECTED' || rawStatus === 'rejected' || rawStatus === 'நிராகரிக்கப்பட்டது') {
      statusVal = 'நிராகரிக்கப்பட்டது';
    } else {
      statusVal = 'சரிபார்க்கப்பட்டது';
    }

    return {
      'ஜாப் கார்டு எண்': w['Job Card Number'] || w.jobCardNumber || 'TN-04-002-004/101',
      'முழு பெயர்': w['Full Name'] || w.fullName || 'பதிவு செய்யப்பட்ட பணியாளர்',
      'பாலினம்': genderVal,
      'வங்கி கணக்கு': w['Bank Account'] || w.bankAccount || w.bankAccountNumber || 'XXXX-XXXX-6821',
      'நிலை': statusVal
    };
  });

  // Dynamic Attendance Report entries derived from registered workers
  const attendanceReportData = registeredWorkers.map((w, idx) => {
    const isAbsent = w.attendanceStatus === 'விடுப்பு' || w.attendanceStatus === 'வருகை இல்லை' || (w.attendanceStatus === undefined && idx === 1);
    return {
      'ஜாப் கார்டு எண்': w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${101 + idx}`,
      'பணியாளர் பெயர்': w['Full Name'] || w.fullName || 'பதிவு செய்யப்பட்ட பணியாளர்',
      'மஸ்டர் தேதி': new Date().toLocaleDateString('ta-IN'),
      'ஒதுக்கப்பட்ட வேலை': 'குளம் தூர்வாருதல் & சீரமைத்தல்',
      'வருகைப்பதிவு நிலை': isAbsent ? 'விடுப்பு (ஆப்சென்ட்)' : 'வருகை பதிவானது (பிரசண்ட்)',
      'GPS இருப்பிட சான்று': isAbsent ? 'இருப்பிடம் இல்லை (விடுப்பு)' : 'சரிபார்க்கப்பட்டது (எல்லைக்குள்)'
    };
  });

  // Dynamic Wages Report entries derived from registered workers
  const wagesReportData = registeredWorkers.map((w, idx) => {
    const days = w.workDays !== undefined ? Number(w.workDays) : (18 - (idx * 4 > 14 ? (idx % 3) * 4 : idx * 4));
    const totalWage = days * 310;
    return {
      'ஜாப் கார்டு எண்': w['Job Card Number'] || w.jobCardNumber || `TN-04-002-004/${101 + idx}`,
      'பணியாளர் பெயர்': w['Full Name'] || w.fullName || 'பதிவு செய்யப்பட்ட பணியாளர்',
      'வேலை செய்த நாட்கள்': `${days} நாட்கள்`,
      'தினசரி ஊதியம்': '₹310.00',
      'மொத்த தொகை': `₹${totalWage.toLocaleString('ta-IN')}.00`,
      'DBT வங்கி பரிமாற்ற நிலை': idx % 2 === 0 ? 'செலுத்தப்பட்டது (DBT)' : 'ஒப்புதலளிக்கப்பட்டது'
    };
  });

  const mockDataMap = {
    'பணியாளர் அறிக்கை': sanitizedRegisteredWorkers,
    'வருகைப்பதிவு அறிக்கை': attendanceReportData,
    'திட்ட அறிக்கை': [
      { 'திட்ட குறியீடு': 'WK12345', 'தலைப்பு': 'குளம் தூர்வாருதல் & சீரமைத்தல்', 'பணி வகை': 'நீர் பாதுகாப்பு', 'செலவு (ரூ)': '₹2,50,000', 'ஒதுக்கப்பட்ட நாட்கள்': '30 நாட்கள்', 'நிலை': '75% முடிந்தது' },
      { 'திட்ட குறியீடு': 'WK12346', 'தலைப்பு': 'கிராமப்புற சாலை பராமரிப்பு', 'பணி வகை': 'கட்டமைப்பு', 'செலவு (ரூ)': '₹1,80,000', 'ஒதுக்கப்பட்ட நாட்கள்': '20 நாட்கள்', 'நிலை': '60% முடிந்தது' },
      { 'திட்ட குறியீடு': 'WK12347', 'தலைப்பு': 'கால்வாய் வடிகால் தூர்வாருதல்', 'பணி வகை': 'பாசனம்', 'செலவு (ரூ)': '₹3,20,000', 'ஒதுக்கப்பட்ட நாட்கள்': '45 நாட்கள்', 'நிலை': '90% முடிந்தது' },
    ],
    'மாவட்ட அறிக்கை': [
      { 'மாவட்ட பெயர்': 'திருவள்ளூர்', 'மொத்த பஞ்சாயத்துகள்': '526', 'செயலில் உள்ள திட்டங்கள்': '1,240', 'மொத்த தொழிலாளர்கள்': `${3420 + registeredWorkers.length}`, 'ஒதுக்கப்பட்ட நிதி': '₹4.85 கோடி', 'செலவிடப்பட்ட தொகை': '₹3.92 கோடி' }
    ],
    'ஊராட்சி அறிக்கை': [
      { 'ஊராட்சி பெயர்': 'பூண்டி', 'பஞ்சாயத்து குறியீடு': 'TN-04-002', 'செயலில் உள்ள வேலைத்தளங்கள்': '12', 'பதிவு செய்த தொழிலாளர்கள்': `${registeredWorkers.length || 4}`, 'சமூக தணிக்கை நிலை': 'நிறைவடைந்தது' }
    ],
    'கிராம அறிக்கை': [
      { 'கிராம பெயர்': 'பூண்டி கிராமம்', 'வேலை கோரிக்கைகள்': '48', 'உருவாக்கப்பட்ட மனித நாட்கள்': '1,420', 'சொத்து உருவாக்கம்': '3 ஏரிகள் தூர்வாரப்பட்டன', 'நிலை': 'செயலில் உள்ளது' }
    ],
    'மோசடி அறிக்கை': [
      { 'எச்சரிக்கை குறியீடு': 'ALT-8801', 'முரண்பாடு வகை': 'முக பொருத்தம்', 'தீவிரம்': 'உயர்', 'விளக்கம்': 'முக அங்கீகாரம் 60% வரம்பிற்குக் கீழே', 'நம்பிக்கை': '88%', 'நிலை': 'பரிசீலனையில்' },
      { 'எச்சரிக்கை குறியீடு': 'ALT-8802', 'முரண்பாடு வகை': 'இருப்பிட முரண்பாடு', 'தீவிரம்': 'உயர்', 'விளக்கம்': 'GPS 820மீ எல்லைக்கு வெளியே', 'நம்பிக்கை': '94%', 'நிலை': 'பரிசீலனையில்' },
      { 'எச்சரிக்கை குறியீடு': 'ALT-8803', 'முரண்பாடு வகை': 'வருகைப்பதிவு முரண்பாடு', 'தீவிரம்': 'நடுத்தர', 'விளக்கம்': 'ஒரே நேரத்தில் இரண்டு இடங்கள்', 'நம்பிக்கை': '72%', 'நிலை': 'தீர்க்கப்பட்டது' },
    ],
    'ஊதிய அறிக்கை': wagesReportData,
    'புகார் அறிக்கை': [
      { 'புகார் எண்': 'CMP-901', 'மனுதாரர் பெயர்': 'செல்வம் K', 'புகார் வகை': 'ஊதிய தாமதம்', 'சமர்ப்பிக்கப்பட்ட தேதி': '2026-09-20', 'நிலை': 'தீர்க்கப்பட்டது' },
      { 'புகார் எண்': 'CMP-902', 'மனுதாரர் பெயர்': 'மாரிமுத்து R', 'புகார் வகை': 'வேலை அட்டை புதுப்பிப்பு', 'சமர்ப்பிக்கப்பட்ட தேதி': '2026-09-22', 'நிலை': 'செயலாக்கத்தில் உள்ளது' }
    ]
  };

  const rawReportData = mockDataMap[selectedReportType] || mockDataMap['பணியாளர் அறிக்கை'];

  const filteredReportData = rawReportData.filter((row) => {
    if (!searchFilter.trim()) return true;
    return Object.values(row).some((val) => 
      String(val).toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  const triggerExport = (format) => {
    setExportSuccess(`${selectedReportType} வெற்றிகரமாக ${format} கோப்பாக ஏற்றுமதி செய்யப்பட்டது!`);
    setTimeout(() => setExportSuccess(''), 3000);
  };

  return (
    <AppLayout title="அரசு தணிக்கை & பகுப்பாய்வு அறிக்கை" breadcrumb="அறிக்கைகள்">
      {/* Page Header with Export Controls */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">அரசு தணிக்கை & பகுப்பாய்வு அறிக்கை உருவாக்கி</h2>
          <p className="page-header-subtitle">சட்டப்பூர்வ திட்டங்களின் கீழ் அதிகாரப்பூர்வ PDF, Excel மற்றும் CSV தணிக்கை அறிக்கைகளை உருவாக்கவும்.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-outline" onClick={() => triggerExport('CSV')}>
            <FileSpreadsheet size={16} />
            <span>CSV ஏற்றுமதி</span>
          </button>
          <button className="btn-blue" onClick={() => triggerExport('PDF')}>
            <Download size={16} />
            <span>PDF பதிவிறக்கம்</span>
          </button>
        </div>
      </div>

      {/* Export Notification Toast */}
      {exportSuccess && (
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--status-success-bg)', border: '1px solid #ABEFC6', borderRadius: '8px', color: '#027A48', fontWeight: 700, fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* 9 Category Selection Grid */}
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' }}>
        அறிக்கை வகையைத் தேர்ந்தெடுக்கவும்
      </h3>

      <div className="grid-12" style={{ marginBottom: '24px' }}>
        {reportOptions.map((opt) => {
          const isSelected = selectedReportType === opt.title;
          return (
            <div key={opt.title} className="col-span-4">
              <div 
                onClick={() => setSelectedReportType(opt.title)}
                className="app-card"
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--primary-blue)' : '1px solid #EAECF0',
                  backgroundColor: isSelected ? 'var(--primary-blue-light)' : '#FFFFFF',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? 'var(--primary-blue)' : 'var(--text-dark)' }}>
                    {opt.title}
                  </span>
                  <FileText size={18} color={isSelected ? 'var(--primary-blue)' : 'var(--text-muted)'} />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {opt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Data Preview Table Card */}
      <div className="app-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>
              தரவு முன்னோட்டம்: {selectedReportType}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {filteredReportData.length} சட்டப்பூர்வ பதிவுகள் காட்டப்படுகின்றன {selectedReportType === 'பணியாளர் அறிக்கை' || selectedReportType === 'வருகைப்பதிவு அறிக்கை' ? `(${registeredWorkers.length} பதிவு செய்யப்பட்ட பணியாளர்கள்)` : ''}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input 
                type="text" 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="அட்டவணை வரிகளை வடிகட்டவும்..." 
                style={{ width: '100%', height: '36px', padding: '0 12px 0 34px', borderRadius: '6px', border: '1px solid #EAECF0', fontSize: '12px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {filteredReportData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #EAECF0' }}>
            <UserCheck size={36} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>பதிவு செய்யப்பட்ட பணியாளர்கள் எவரும் இல்லை</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              புதிய தொழிலாளர்களைப் பதிவுசெய்தால், அவர்களின் விவரங்கள் இந்த அறிக்கையில் நேரடியாக தோன்றும்.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EAECF0', backgroundColor: '#F9FAFB', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {Object.keys(filteredReportData[0] || {}).map((col) => (
                    <th key={col} style={{ padding: '12px 14px', fontWeight: 700 }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReportData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    style={{ 
                      borderBottom: '1px solid #F2F4F7',
                      backgroundColor: '#F0F9FF'
                    }}
                  >
                    {Object.values(row).map((val, i) => (
                      <td key={i} style={{ padding: '14px', fontWeight: i === 0 ? 700 : 500, color: 'var(--text-dark)' }}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
