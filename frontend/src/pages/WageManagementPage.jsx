import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  QrCode,
  Check,
  Building2,
  UserCheck
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/StatCard';
import { QrScannerModal } from '../components/QrScannerModal';

export const WageManagementPage = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Load dynamic registered workers and wage disbursal statuses from localStorage
  const [wages, setWages] = useState(() => {
    const storedWorkers = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
    const storedDisbursals = JSON.parse(localStorage.getItem('wageDisbursals') || '{}');

    return storedWorkers.map((worker, index) => {
      const id = worker.id || index + 1;
      const jcNum = worker['Job Card Number'] || `TN-04-002-004/${101 + index}`;
      const name = worker['Full Name'] || 'பதிவு செய்யப்பட்ட பணியாளர்';
      const statusData = storedDisbursals[jcNum] || {
        status: index % 2 === 0 ? 'PAID' : 'APPROVED',
        bankRef: index % 2 === 0 ? `DBT-20260924-${9981 + index}` : 'வங்கி செயலாக்கத்தில்'
      };

      return {
        id,
        workerName: name,
        jobCard: jcNum,
        daysWorked: worker.workDays !== undefined ? Number(worker.workDays) : (18 - (index * 4 > 14 ? (index % 3) * 4 : index * 4)),
        dailyRate: 310,
        totalAmount: (worker.workDays !== undefined ? Number(worker.workDays) : (18 - (index * 4 > 14 ? (index % 3) * 4 : index * 4))) * 310,
        status: statusData.status,
        bankRef: statusData.bankRef
      };
    });
  });

  // Sync state if localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      const storedWorkers = JSON.parse(localStorage.getItem('registeredWorkers') || '[]');
      const storedDisbursals = JSON.parse(localStorage.getItem('wageDisbursals') || '{}');

      const updatedWages = storedWorkers.map((worker, index) => {
        const id = worker.id || index + 1;
        const jcNum = worker['Job Card Number'] || `TN-04-002-004/${101 + index}`;
        const name = worker['Full Name'] || 'பதிவு செய்யப்பட்ட பணியாளர்';
        const statusData = storedDisbursals[jcNum] || {
          status: index % 2 === 0 ? 'PAID' : 'APPROVED',
          bankRef: index % 2 === 0 ? `DBT-20260924-${9981 + index}` : 'வங்கி செயலாக்கத்தில்'
        };

        const wDays = worker.workDays !== undefined ? Number(worker.workDays) : (18 - (index * 4 > 14 ? (index % 3) * 4 : index * 4));
        return {
          id,
          workerName: name,
          jobCard: jcNum,
          daysWorked: wDays,
          dailyRate: 310,
          totalAmount: wDays * 310,
          status: statusData.status,
          bankRef: statusData.bankRef
        };
      });

      setWages(updatedWages);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Update wage payment status
  const handleApproveWage = (jobCard) => {
    const newRef = `DBT-20260924-${Math.floor(1000 + Math.random() * 9000)}`;
    const storedDisbursals = JSON.parse(localStorage.getItem('wageDisbursals') || '{}');
    
    storedDisbursals[jobCard] = {
      status: 'PAID',
      bankRef: newRef
    };

    localStorage.setItem('wageDisbursals', JSON.stringify(storedDisbursals));

    setWages(prev => prev.map(w => w.jobCard === jobCard ? { ...w, status: 'PAID', bankRef: newRef } : w));
    setNotification(`ஜாப் கார்டு ${jobCard} க்கான ஊதியம் (₹4,340) DBT மூலம் நேரடியாக வங்கி கணக்கிற்கு அனுப்பப்பட்டது!`);
    setTimeout(() => setNotification(''), 4000);
  };

  // QR Scan callback action
  const handleQrScanComplete = (result) => {
    const targetWorker = wages.find(w => w.jobCard === result.jobCardNumber || w.workerName === result.workerName);
    if (targetWorker) {
      handleApproveWage(targetWorker.jobCard);
    } else if (wages.length > 0) {
      // Disburse to first available worker if scanned
      handleApproveWage(wages[0].jobCard);
    }
  };

  const totalPaid = wages.filter(w => w.status === 'PAID').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalApproved = wages.filter(w => w.status === 'APPROVED').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalSanctioned = wages.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPending = wages.filter(w => w.status === 'GENERATED').reduce((acc, curr) => acc + curr.totalAmount, 0);

  const filteredWages = wages.filter(w => {
    const matchesFilter = filterStatus === 'ALL' || w.status === filterStatus;
    const matchesSearch = w.workerName.toLowerCase().includes(searchTerm.toLowerCase()) || w.jobCard.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppLayout title="ஊதியக் கணக்கீடு & DBT வங்கி பரிமாற்றம்" breadcrumb="ஊதியக் கொடுப்பனவு">
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">ஊதியக் கணக்கீடு & நேரடி பயன்பாட்டுப் பரிமாற்றம் (DBT)</h2>
          <p className="page-header-subtitle">தானியங்கி வருகைப்பதிவு வழியான ஊதியக் கணக்கீடு மற்றும் DBT வங்கிப் பணப்பரிமாற்ற கண்காணிப்பு.</p>
        </div>

        <button 
          className="btn-blue"
          onClick={() => setIsScannerOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <QrCode size={18} />
          <span>QR குறியீடு ஸ்கேன் செய்து செலுத்து</span>
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--status-success-bg)', border: '1px solid #ABEFC6', borderRadius: '8px', color: '#027A48', fontWeight: 700, fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 Stat Cards Row */}
      <div className="grid-12" style={{ marginBottom: '24px' }}>
        <div className="col-span-3">
          <StatCard 
            icon={<CreditCard size={20} />} 
            label="மொத்த ஒதுக்கப்பட்ட நிதி" 
            value={`₹${totalSanctioned.toLocaleString('ta-IN')}`} 
            secondaryInfo="ஒதுக்கப்பட்ட மொத்த ஊதிய நிதி" 
          />
        </div>
        <div className="col-span-3">
          <StatCard 
            icon={<CheckCircle2 size={20} />} 
            label="செலுத்தப்பட்ட ஊதியம்" 
            value={`₹${totalPaid.toLocaleString('ta-IN')}`} 
            secondaryInfo="DBT மூலம் கணக்கிற்கு அனுப்பப்பட்டது" 
          />
        </div>
        <div className="col-span-3">
          <StatCard 
            icon={<Clock size={20} />} 
            label="வங்கி செயலாக்கத்தில் உள்ளது" 
            value={`₹${totalApproved.toLocaleString('ta-IN')}`} 
            secondaryInfo="வங்கி பரிவர்த்தனை நடைபெறுகிறது" 
          />
        </div>
        <div className="col-span-3">
          <StatCard 
            icon={<AlertTriangle size={20} />} 
            label="ஒப்புதலுக்கு காத்திருப்பது" 
            value={`₹${totalPending.toLocaleString('ta-IN')}`} 
            secondaryInfo="மேற்பார்வையாளர் ஒப்புதலுக்கு நிலுவையில்" 
          />
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="app-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '360px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="பணியாளர் பெயர் அல்லது ஜாப் கார்டு எண் தேடுக..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 16px 0 40px',
                borderRadius: '8px',
                border: '1px solid #EAECF0',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Filter Status Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[
              { id: 'ALL', label: 'அனைத்தும்' },
              { id: 'PAID', label: 'செலுத்தப்பட்டது' },
              { id: 'APPROVED', label: 'ஒப்புதலளிக்கப்பட்டது' },
              { id: 'GENERATED', label: 'நிலுவையில்' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: filterStatus === st.id ? '1px solid var(--primary-blue)' : '1px solid #EAECF0',
                  backgroundColor: filterStatus === st.id ? 'var(--primary-blue-light)' : '#FFFFFF',
                  color: filterStatus === st.id ? 'var(--primary-blue)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Enterprise Wage Table */}
      <div className="app-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>
            DBT ஊதியப் பட்டியல் ({filteredWages.length} பதிவுகள்)
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>தினசரி ஊதிய விகிதம்: ₹310.00 / நாள்</span>
        </div>

        {filteredWages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #EAECF0' }}>
            <UserCheck size={36} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>பதிவு செய்யப்பட்ட பணியாளர்கள் எவரும் இல்லை</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              'பணியாளர் பதிவு' பக்கத்தில் புதிய தொழிலாளர்களைப் பதிவுசெய்தால், அவர்களின் ஊதியக் கணக்கீடு இங்கே தோன்றும்.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EAECF0', backgroundColor: '#F9FAFB', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>பணியாளர் பெயர்</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>ஜாப் கார்டு எண்</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>வேலை செய்த நாட்கள்</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>தினசரி விகிதம்</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>மொத்த ஊதியம் (₹)</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>நிலை</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>DBT வங்கி சான்று</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>செயல்பாடு</th>
                </tr>
              </thead>
              <tbody>
                {filteredWages.map((w) => (
                  <tr key={w.id} style={{ borderBottom: '1px solid #F2F4F7' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>{w.workerName}</td>
                    <td style={{ padding: '14px', fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '12px' }}>{w.jobCard}</td>
                    <td style={{ padding: '14px', fontWeight: 600 }}>{w.daysWorked} நாட்கள்</td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)' }}>₹{w.dailyRate}.00</td>
                    <td style={{ padding: '14px', fontWeight: 800, color: 'var(--status-success)' }}>₹{w.totalAmount.toLocaleString('ta-IN')}.00</td>
                    <td style={{ padding: '14px' }}>
                      <span 
                        style={{ 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          padding: '3px 8px', 
                          borderRadius: '4px',
                          color: w.status === 'PAID' ? 'var(--status-success)' : w.status === 'APPROVED' ? 'var(--primary-blue)' : 'var(--status-warning)',
                          backgroundColor: w.status === 'PAID' ? 'var(--status-success-bg)' : w.status === 'APPROVED' ? 'var(--primary-blue-light)' : 'var(--status-warning-bg)'
                        }}
                      >
                        {w.status === 'PAID' ? 'செலுத்தப்பட்டது' : w.status === 'APPROVED' ? 'ஒப்புதலளிக்கப்பட்டது' : 'நிலுவையில்'}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>{w.bankRef}</td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      {w.status !== 'PAID' ? (
                        <button 
                          className="btn-blue" 
                          onClick={() => handleApproveWage(w.jobCard)}
                          style={{ height: '34px', padding: '0 12px', fontSize: '12px' }}
                        >
                          <span>ஒப்புதல் அளித்து வழங்கு</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--status-success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> வழங்கப்பட்டது
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Real-Time QR Scanner Modal */}
      <QrScannerModal 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleQrScanComplete}
      />
    </AppLayout>
  );
};

export default WageManagementPage;
