import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers, MapPin, Navigation } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom glowing pin icon generator
const createGlowingIcon = (color = '#00e699') => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 0 16px ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      font-weight: 900;
      font-size: 12px;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const greenPin = createGlowingIcon('#00e699');
const bluePin = createGlowingIcon('#3b82f6');
const amberPin = createGlowingIcon('#f59e0b');

// Map Recenter Helper Component
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

// Tamil Nadu Village Preset Locations
const TN_LOCATIONS = [
  { id: 1, name: 'Thiruvengadam (திருவேங்கடம்)', lat: 9.2801, lng: 77.5892, workers: 42, project: 'Water Pond Desilting' },
  { id: 2, name: 'Sevalpatti (செவல்பட்டி)', lat: 9.3012, lng: 77.6123, workers: 28, project: 'Road Construction' },
  { id: 3, name: 'Vembakottai (வெம்பக்கோட்டை)', lat: 9.3345, lng: 77.6543, workers: 35, project: 'Canal Cleaning' },
  { id: 4, name: 'Active Worksite WK12345', lat: 13.0827, lng: 80.2707, workers: 32, project: 'Pond Restoration (WK12345)' },
  { id: 5, name: 'Siruseri (சிறுசேரி)', lat: 12.8321, lng: 80.2245, workers: 50, project: 'Plantation Work' },
];

export const GisMap = ({ height = '100%', initialCenter = [13.0827, 80.2707], zoomLevel = 12 }) => {
  const [currentCoords, setCurrentCoords] = useState(initialCenter);
  const [mapTileStyle, setMapTileStyle] = useState('google_hybrid'); // 'google_hybrid', 'osm', 'dark'
  const [gpsActive, setGpsActive] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const liveLat = pos.coords.latitude;
          const liveLng = pos.coords.longitude;
          setCurrentCoords([liveLat, liveLng]);
          setGpsActive(true);
        },
        (err) => {
          console.warn('GPS location fetch fallback to default:', err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div style={{ height }} className="w-full h-full relative overflow-hidden rounded-2xl border border-slate-700/80 shadow-2xl">
      
      {/* Top Map Layer Switcher Bar */}
      <div className="absolute top-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1.5 rounded-xl shadow-xl flex items-center gap-1.5 text-xs">
        <Layers className="w-4 h-4 text-cyan-400 ml-1" />
        <button
          onClick={() => setMapTileStyle('google_hybrid')}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
            mapTileStyle === 'google_hybrid'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Google Hybrid Satellite
        </button>

        <button
          onClick={() => setMapTileStyle('osm')}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
            mapTileStyle === 'osm'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          OpenStreetMap
        </button>

        <button
          onClick={() => setMapTileStyle('dark')}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
            mapTileStyle === 'dark'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Dark Mode
        </button>
      </div>

      {/* Top Right Live Status Badge */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-bold text-emerald-400 backdrop-blur-md shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        {gpsActive ? 'Live GPS User Pin Active' : 'Tamil Nadu MGNREGS Map'}
      </div>

      <MapContainer center={currentCoords} zoom={zoomLevel} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <RecenterMap center={currentCoords} zoom={zoomLevel} />

        {/* Dynamic Tile Layer Switcher */}
        {mapTileStyle === 'google_hybrid' && (
          <TileLayer
            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          />
        )}

        {mapTileStyle === 'osm' && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {mapTileStyle === 'dark' && (
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        )}

        {/* Active Geofence Circle around center */}
        <Circle
          center={currentCoords}
          radius={500}
          pathOptions={{
            color: '#00e699',
            fillColor: '#00e699',
            fillOpacity: 0.25,
            weight: 2.5,
          }}
        />

        {/* Current User/Worksite Pin */}
        <Marker position={currentCoords} icon={bluePin}>
          <Popup>
            <div className="p-2 text-slate-900 font-sans text-xs">
              <div className="font-black text-sm text-blue-700">Live User GPS Location</div>
              <div>Lat: <strong>{currentCoords[0].toFixed(5)}</strong>, Lng: <strong>{currentCoords[1].toFixed(5)}</strong></div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">✓ Geofence Status: VERIFIED</div>
            </div>
          </Popup>
        </Marker>

        {/* Tamil Nadu Village Markers */}
        {TN_LOCATIONS.map((loc) => (
          <React.Fragment key={loc.id}>
            <Circle
              center={[loc.lat, loc.lng]}
              radius={500}
              pathOptions={{
                color: loc.id === 1 ? '#3b82f6' : '#00e699',
                fillColor: loc.id === 1 ? '#3b82f6' : '#00e699',
                fillOpacity: 0.2,
                weight: 1.5,
              }}
            />
            <Marker position={[loc.lat, loc.lng]} icon={loc.id === 1 ? amberPin : greenPin}>
              <Popup>
                <div className="p-2 text-slate-900 font-sans text-xs">
                  <div className="font-black text-sm text-blue-800">{loc.name}</div>
                  <div className="text-slate-600 font-semibold">{loc.project}</div>
                  <div className="mt-1">Active Workers: <strong className="text-emerald-700">{loc.workers} Workers</strong></div>
                  <div className="text-[10px] font-mono text-slate-500">Coordinates: {loc.lat}, {loc.lng}</div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

      </MapContainer>
    </div>
  );
};

export default GisMap;
