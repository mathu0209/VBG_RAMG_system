import React, { createContext, useContext, useState, useEffect } from 'react';

const RealtimeFraudContext = createContext();

const MOCK_INITIAL_ALERTS = [
  {
    id: 1,
    worker_id: 104,
    worker_name: 'M. Selvam',
    type: 'GEOFENCE_BREACH',
    risk_score: 88,
    details: 'Attendance scan 740m outside worksite boundary (Limit: 500m)',
    worksite: 'Pond Restoration (WK12345)',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
  },
  {
    id: 2,
    worker_id: 109,
    worker_name: 'K. Anitha',
    type: 'FACE_MISMATCH',
    risk_score: 92,
    details: 'Biometric face score 41% below 80% threshold',
    worksite: 'Check Dam Construction (WK12346)',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
  },
  {
    id: 3,
    worker_id: 115,
    worker_name: 'R. Kaliappan',
    type: 'DUPLICATE_DEVICE_SCAN',
    risk_score: 76,
    details: 'Device IMEI scanned 3 worker IDs within 45 seconds',
    worksite: 'Canal Bund Strengthening',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
  }
];

export function RealtimeFraudProvider({ children }) {
  const [alerts, setAlerts] = useState(MOCK_INITIAL_ALERTS);
  const [soundEnabled, setSoundEnabled] = useState(false); // Notifications Sound OFF by default
  const [unreadCount, setUnreadCount] = useState(0); // Unread badge count off by default

  const triggerAudioAlert = () => {
    // Sound permanently disabled as requested
    return;
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <RealtimeFraudContext.Provider
      value={{
        alerts,
        unreadCount,
        soundEnabled,
        setSoundEnabled,
        markAllAsRead,
        dismissAlert,
        triggerAudioAlert,
      }}
    >
      {children}
    </RealtimeFraudContext.Provider>
  );
}

export function useRealtimeFraud() {
  return useContext(RealtimeFraudContext);
}
