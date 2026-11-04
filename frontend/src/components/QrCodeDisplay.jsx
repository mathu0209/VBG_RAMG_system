import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { UserCheck, ShieldCheck, ExternalLink } from 'lucide-react';

export const QrCodeDisplay = ({ worker, onClick }) => {
  const jcNumber = worker?.jobCardNumber || worker?.['Job Card Number'] || 'TN-04-002-004/105';
  const name = worker?.fullName || worker?.['Full Name'] || 'பணியாளர் பெயர்';
  const gender = worker?.gender || worker?.['Gender'] || 'ஆண்';
  const bank = worker?.bankAccount || worker?.['Bank Account'] || 'XXXX-XXXX-6821';
  const status = worker?.status || worker?.['Status'] || 'சரிபார்க்கப்பட்டது';

  // Unique structured JSON payload for camera QR scanners
  const uniqueQrData = JSON.stringify({
    system: 'VB-GRAM-G',
    jobCardNumber: jcNumber,
    workerName: name,
    gender: gender,
    bankAccount: bank,
    verificationStatus: status,
    timestamp: worker?.timestamp || new Date().toISOString()
  });

  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        color: 'var(--text-dark)',
        border: '2px solid #E2E8F0',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        maxWidth: '340px',
        margin: '0 auto',
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      className="hover:scale-[1.02] hover:shadow-2xl group"
      title="பணியாளர் விவரங்களைக் காண கிளிக் செய்யவும்"
    >
      <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--primary-blue)', marginBottom: '4px' }}>
        இந்திய அரசு • VB–G RAM G ஸ்மார்ட் அமைப்பு
      </div>

      <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-dark)', marginBottom: '4px' }}>
        {name}
      </div>

      <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 10px', borderRadius: '12px', marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <ShieldCheck size={12} />
        <span>தனித்துவ QR பதிவு • சரிபார்க்கப்பட்டது</span>
      </div>
      
      <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '12px', position: 'relative' }}>
        <QRCodeSVG value={uniqueQrData} size={190} level="H" includeMargin={true} />
      </div>

      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>தனித்துவ ஜாப் கார்டு எண்</div>
        <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary-blue)', fontFamily: 'monospace', marginTop: '2px', letterSpacing: '0.05em' }}>
          {jcNumber}
        </div>
      </div>

      {onClick && (
        <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>கிளிக் செய்து முழு சுயவிவரத்தைக் காண்க</span>
          <ExternalLink size={12} />
        </div>
      )}
    </div>
  );
};

export default QrCodeDisplay;
