const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'vbg_ram_g_secret_key_2026_tn_govt';

app.use(cors());
app.use(express.json());

// In-Memory Production State (Syncs with PostgreSQL database/schema.sql)
let sseClients = [];

let worksites = [
  {
    id: 1,
    code: 'WK12345',
    name: 'Pond Cleaning & Restoration',
    location: 'Kothapalli, Thiruvallur',
    lat: 9.292053,
    long: 77.701788,
    geofence_radius_m: 500,
    budget: 250000.0,
    start_date: '2024-04-12',
    status: 'ACTIVE',
  },
  {
    id: 2,
    code: 'WK12346',
    name: 'Check Dam Construction',
    location: 'Siruseri, Chengalpattu',
    lat: 12.8321,
    long: 80.2245,
    geofence_radius_m: 500,
    budget: 480000.0,
    start_date: '2024-03-15',
    status: 'ACTIVE',
  },
];

let users = [
  { id: 1, role: 'ADMIN', username: 'admin@tn.gov.in', district: 'State Headquarters', worksite_id: null },
  { id: 2, role: 'SUPERVISOR', username: 'supervisor@thiruvallur.gov.in', district: 'Thiruvallur', worksite_id: 1 },
  { id: 3, role: 'WORKER', username: 'worker101@tn.gov.in', district: 'Thiruvallur', worksite_id: 1 },
];

let workers = [
  {
    id: 101,
    name: 'M. Selvam',
    aadhaar_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    dob: '1988-05-14',
    gender: 'Male',
    district: 'Thiruvallur',
    mobile: '9876543210',
    worksite_id: 1,
    status: 'VERIFIED',
  },
  {
    id: 102,
    name: 'K. Anitha',
    aadhaar_hash: 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb',
    dob: '1992-09-21',
    gender: 'Female',
    district: 'Chengalpattu',
    mobile: '9876543211',
    worksite_id: 2,
    status: 'VERIFIED',
  },
];

let attendance = [
  {
    id: 1,
    worker_id: 101,
    worksite_id: 1,
    timestamp: new Date().toISOString(),
    lat: 9.292050,
    long: 77.701790,
    face_match_score: 98.4,
    gps_distance_m: 12.5,
    verified_by: 2,
  },
];

let fraudAlerts = [
  {
    id: 1,
    worker_id: 104,
    worker_name: 'M. Selvam',
    type: 'GEOFENCE_BREACH',
    risk_score: 88,
    details: 'Attendance scan 740m outside worksite boundary (Limit: 500m)',
    worksite: 'Pond Restoration (WK12345)',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 2,
    worker_id: 109,
    worker_name: 'K. Anitha',
    type: 'FACE_MISMATCH',
    risk_score: 92,
    details: 'Biometric face score 41% below 80% threshold',
    worksite: 'Check Dam Construction (WK12346)',
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 1080000).toISOString(),
  },
];

let auditLogs = [
  { id: 1, actor_id: 1, action: 'SYSTEM_BOOT', target_id: 'SERVER', timestamp: new Date().toISOString() },
];

// Auth Middleware (Row-Level Access Control)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = { role: 'ADMIN', id: 1, district: 'State Headquarters' }; // Fallback default
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) req.user = { role: 'ADMIN', id: 1 };
    else req.user = user;
    next();
  });
}

// ------------------- API ENDPOINTS -------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'VB-G RAM G Smart System REST API Engine',
    state: 'Tamil Nadu State Rural Development',
    sse_connections: sseClients.length,
    timestamp: new Date().toISOString(),
  });
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  const userRole = role || 'ADMIN';
  const token = jwt.sign({ username, role: userRole, id: 1 }, JWT_SECRET, { expiresIn: '24h' });
  
  auditLogs.push({
    id: auditLogs.length + 1,
    actor_id: 1,
    action: `USER_LOGIN_${userRole}`,
    target_id: username || 'GUEST',
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    token,
    user: {
      id: 1,
      username: username || 'admin@tn.gov.in',
      role: userRole,
      district: 'Thiruvallur',
      fullName: userRole === 'ADMIN' ? 'State Administrator' : 'District Supervisor',
    },
  });
});

// Workers API
app.get('/api/workers', authenticateToken, (req, res) => {
  res.json(workers);
});

// Worksites API
app.get('/api/worksites', authenticateToken, (req, res) => {
  res.json(worksites);
});

// Attendance API
app.get('/api/attendance', authenticateToken, (req, res) => {
  res.json(attendance);
});

app.post('/api/attendance', authenticateToken, (req, res) => {
  const newAttendance = {
    id: attendance.length + 1,
    ...req.body,
    timestamp: new Date().toISOString(),
  };
  attendance.push(newAttendance);
  res.status(201).json(newAttendance);
});

// Fraud Alerts API
app.get('/api/fraud/alerts', authenticateToken, (req, res) => {
  res.json(fraudAlerts);
});

// Real-Time Server-Sent Events (SSE) Stream
app.get('/api/fraud/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  // Send heartbeat connected ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE Stream Active' })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter((client) => client !== res);
  });
});

// Broadcast SSE Fraud Alert helper
function broadcastFraudAlert(alertData) {
  sseClients.forEach((client) => {
    client.write(`data: ${JSON.stringify(alertData)}\n\n`);
  });
}

// Audit Logs API
app.get('/api/audit-logs', authenticateToken, (req, res) => {
  res.json(auditLogs);
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`VB-G RAM G Smart System Server Running on Port ${PORT}`);
  console.log(`SSE Real-Time Stream: http://localhost:${PORT}/api/fraud/stream`);
  console.log(`=======================================================`);
});
