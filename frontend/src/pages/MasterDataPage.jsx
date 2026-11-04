import React, { useState, useEffect } from 'react';
import { Layers, Plus, MapPin, ChevronRight, Building } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

import { TAMIL_NADU_DISTRICTS } from '../constants/districts';

export const MasterDataPage = () => {
  const [activeTab, setActiveTab] = useState('state');
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

  const states = [{ id: 1, code: 'TN', name: 'தமிழ்நாடு (Tamil Nadu)', districtsCount: 38 }];
  
  const districts = TAMIL_NADU_DISTRICTS.map((dName, idx) => ({
    id: idx + 1,
    code: `TN-DIST-${idx + 101}`,
    name: dName,
    blocksCount: 10 + (idx % 8)
  }));

  const blocks = [{ id: 1, code: 'PND', name: 'பூண்டி வட்டாரம்', panchayatsCount: 28 }];
  const panchayats = [{ id: 1, code: 'PND-P', name: 'பூண்டி ஊராட்சி', villagesCount: 12 }];
  const villages = [{ id: 1, code: 'PND-V', name: 'பூண்டி கிராமம்', workersCount: registeredWorkers.length }];

  return (
    <AppLayout title="அரசு நிர்வாக படிநிலை மேலாண்மை" breadcrumb="முதன்மை தரவு">
      <div className="space-y-6">
        {/* Header */}
        <div className="page-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 className="page-header-title">முதன்மை நிர்வாக படிநிலை கட்டமைப்பு</h2>
            <p className="page-header-subtitle">மாநிலம் → மாவட்டம் → வட்டாரம் → ஊராட்சி → கிராம நிலைகளை நிர்வகிக்கவும்</p>
          </div>
          <button className="btn-blue" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus className="w-4 h-4" /> 
            <span>நிர்வாகப் பிரிவைச் சேர்</span>
          </button>
        </div>

        {/* Level Selector Tabs */}
        <div className="app-card">
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #EAECF0', paddingBottom: '12px', marginBottom: '16px' }}>
            {[
              { id: 'state', label: 'மாநில நிலை' },
              { id: 'district', label: 'மாவட்ட நிலை' },
              { id: 'block', label: 'வட்டார நிலை' },
              { id: 'panchayat', label: 'ஊராட்சி நிலை' },
              { id: 'village', label: 'கிராம நிலை' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: activeTab === tab.id ? '1px solid var(--primary-blue)' : '1px solid #EAECF0',
                  backgroundColor: activeTab === tab.id ? 'var(--primary-blue-light)' : '#FFFFFF',
                  color: activeTab === tab.id ? 'var(--primary-blue)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 600 }}>
            இந்தியா &gt; தமிழ்நாடு &gt; திருவள்ளூர் மாவட்டம் &gt; பூண்டி வட்டாரம் &gt; பூண்டி ஊராட்சி &gt; பூண்டி கிராமம்
          </div>

          <div className="grid-12">
            {activeTab === 'state' && states.map(s => (
              <div key={s.id} className="col-span-4">
                <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F9FAFB', border: '1px solid #EAECF0' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-blue)' }}>{s.code}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', margin: '4px 0' }}>{s.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.districtsCount} மாவட்டங்கள் பதிவு செய்யப்பட்டுள்ளன</div>
                </div>
              </div>
            ))}

            {activeTab === 'district' && districts.map(d => (
              <div key={d.id} className="col-span-4">
                <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F9FAFB', border: '1px solid #EAECF0' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-blue)' }}>{d.code}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', margin: '4px 0' }}>{d.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.blocksCount} வட்டாரங்கள்</div>
                </div>
              </div>
            ))}

            {activeTab === 'block' && blocks.map(b => (
              <div key={b.id} className="col-span-4">
                <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F9FAFB', border: '1px solid #EAECF0' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-blue)' }}>{b.code}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', margin: '4px 0' }}>{b.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.panchayatsCount} கிராம ஊராட்சிகள்</div>
                </div>
              </div>
            ))}

            {activeTab === 'panchayat' && panchayats.map(p => (
              <div key={p.id} className="col-span-4">
                <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F9FAFB', border: '1px solid #EAECF0' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-blue)' }}>{p.code}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', margin: '4px 0' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.villagesCount} வருவாய் கிராமங்கள்</div>
                </div>
              </div>
            ))}

            {activeTab === 'village' && villages.map(v => (
              <div key={v.id} className="col-span-4">
                <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#F9FAFB', border: '1px solid #EAECF0' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-blue)' }}>{v.code}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', margin: '4px 0' }}>{v.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.workersCount} பதிவு செய்யப்பட்ட ஜாப் கார்டு தொழிலாளர்கள்</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MasterDataPage;
