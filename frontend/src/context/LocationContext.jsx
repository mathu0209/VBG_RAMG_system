import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

// Haversine formula to compute exact distance in meters between two GPS coordinates
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Distance in meters
}

export const LocationProvider = ({ children }) => {
  // Approved Worksite Target GPS
  const [approvedWorksiteLocation] = useState({
    code: 'WK12345',
    name: 'Pond Cleaning & Restoration',
    latitude: 13.0827,
    longitude: 80.2707,
    radius: 500 // Geofence radius in meters
  });

  // Current Live User GPS State
  const [currentUserLocation, setCurrentUserLocation] = useState({
    latitude: 13.0831,
    longitude: 80.2711,
    accuracy: 8,
    isAvailable: true,
    isPermissionDenied: false,
    errorMsg: null
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setCurrentUserLocation(prev => ({
        ...prev,
        isAvailable: false,
        errorMsg: 'Geolocation is not supported by your browser.'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          isAvailable: true,
          isPermissionDenied: false,
          errorMsg: null
        });
      },
      (err) => {
        setCurrentUserLocation(prev => ({
          ...prev,
          isPermissionDenied: err.code === err.PERMISSION_DENIED,
          errorMsg: err.message || 'Unable to retrieve current GPS position.'
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  // Compute dynamic distance & geofence status
  const currentDistance = calculateDistance(
    currentUserLocation.latitude,
    currentUserLocation.longitude,
    approvedWorksiteLocation.latitude,
    approvedWorksiteLocation.longitude
  );

  const isWithinGeofence = currentDistance <= approvedWorksiteLocation.radius;

  const locationDisplayString = currentUserLocation.latitude && currentUserLocation.longitude
    ? `Lat: ${currentUserLocation.latitude.toFixed(4)}, Lng: ${currentUserLocation.longitude.toFixed(4)}`
    : 'GPS Acquisition Pending';

  return (
    <LocationContext.Provider
      value={{
        currentUserLocation,
        approvedWorksiteLocation,
        currentDistance,
        isWithinGeofence,
        locationDisplayString,
        requestLocation,
        calculateDistance
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;
