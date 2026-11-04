import React from 'react';
import { X, Download, ShieldCheck, MapPin, Clock } from 'lucide-react';

export const ImageViewModal = ({ isOpen, onClose, imageUrl, title, metadata }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      style={{
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
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '850px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #EAECF0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC'
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {title || 'எடுக்கப்பட்ட புகைப்படத்தை காண்க'}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              உயர் தெளிவுத்திறன் கொண்ட புகைப்பட சரிபார்ப்பு
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              border: 'none',
              background: '#E2E8F0',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Image Display */}
        <div 
          style={{
            padding: '20px',
            backgroundColor: '#090D16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: '60vh',
            minHeight: '320px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <img 
            src={imageUrl} 
            alt="எடுக்கப்பட்ட புகைப்படம்" 
            style={{
              maxWidth: '100%',
              maxHeight: '55vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}
          />

          {metadata && (
            <div 
              style={{
                position: 'absolute',
                bottom: '28px',
                left: '28px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(6px)',
                padding: '8px 14px',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '12px',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              {metadata.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8' }}>
                  <MapPin size={13} />
                  <span>{metadata.location}</span>
                </div>
              )}
              {metadata.time && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', marginTop: '2px' }}>
                  <Clock size={13} />
                  <span>{metadata.time}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div 
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #EAECF0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#027A48', fontSize: '13px', fontWeight: 600 }}>
            <ShieldCheck size={18} />
            <span>பாதுகாக்கப்பட்ட ஹார்டுவேர் புகைப்படம்</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a 
              href={imageUrl} 
              download="captured-photo.jpg" 
              className="btn-outline"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px' }}
            >
              <Download size={15} />
              <span>படத்தை பதிவிறக்கு</span>
            </a>
            <button className="btn-blue" onClick={onClose} style={{ fontSize: '13px', padding: '8px 16px' }}>
              மூடு
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewModal;
