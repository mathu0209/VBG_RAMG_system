import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const ROLES = [
  { id: 'ADMIN', label: 'State Admin (மாநில நிர்வாகி)', color: '#8b5cf6', route: '/' },
  { id: 'BLOCK_OFFICER', label: 'Block Officer (வட்டார அதிகாரி)', color: '#06b6d4', route: '/block-officer-portal' },
  { id: 'SUPERVISOR', label: 'Supervisor / Mate (மேற்பார்வையாளர்)', color: '#f59e0b', route: '/worker-dashboard' },
  { id: 'WORKER', label: 'Rural Worker (பணியாளர்)', color: '#10b981', route: '/worker-portal' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mgnregs_user');
    return saved ? JSON.parse(saved) : null; // Defaults to null to enforce login portal access first
  });

  const [token, setToken] = useState(() => localStorage.getItem('mgnregs_jwt_token') || null);

  // Registered Users Registry
  const [usersRegistry, setUsersRegistry] = useState(() => {
    const savedReg = localStorage.getItem('mgnregs_user_registry');
    return savedReg ? JSON.parse(savedReg) : [
      { id: 1, username: 'admin', fullName: 'State Admin Officer', role: 'ADMIN', district: 'State Headquarters' },
      { id: 2, username: 'block_officer', fullName: 'Block Development Officer', role: 'BLOCK_OFFICER', district: 'Thiruvallur' },
      { id: 3, username: 'supervisor_poondi', fullName: 'Site Supervisor', role: 'SUPERVISOR', district: 'Thiruvallur' },
      { id: 4, username: 'worker_basavaraj', fullName: 'Basavaraj Gowda (Worker)', role: 'WORKER', district: 'Thiruvallur' },
    ];
  });

  const registerUser = (newUserData) => {
    const newUserObj = {
      id: Date.now(),
      ...newUserData
    };
    const updatedRegistry = [...usersRegistry, newUserObj];
    setUsersRegistry(updatedRegistry);
    localStorage.setItem('mgnregs_user_registry', JSON.stringify(updatedRegistry));

    // Auto login
    login(newUserObj, 'jwt-token-registered-' + Date.now());
    return newUserObj;
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('mgnregs_user', JSON.stringify(userData));
    localStorage.setItem('mgnregs_jwt_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mgnregs_user');
    localStorage.removeItem('mgnregs_jwt_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, registerUser, usersRegistry, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
