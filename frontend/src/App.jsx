import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LocationProvider } from './context/LocationContext';
import { RealtimeFraudProvider } from './context/RealtimeFraudContext';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <LocationProvider>
          <RealtimeFraudProvider>
            <Router>
              <div className="app-production-root" style={{ minHeight: '100vh', backgroundColor: '#F7F9FC' }}>
                <AppRoutes />
              </div>
            </Router>
          </RealtimeFraudProvider>
        </LocationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
