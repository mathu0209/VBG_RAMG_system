import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to append Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mgnregs_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Fallback Mock Data Store for instant UI demonstration
export const MOCK_DATA = {
  stats: {
    totalWorkers: 1420,
    activeWorkers: 1280,
    activeProjects: 48,
    todaysAttendance: 915,
    openComplaints: 6,
    fraudAlerts: 3,
    totalWagesDisbursed: 4850000.00
  },
  workers: [
    {
      id: 1,
      jobCardNumber: 'KA-01-002-004-001/102',
      fullName: 'Basavaraj Gowda',
      gender: 'MALE',
      dob: '1985-04-12',
      aadhaarHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      bankAccountNumber: '384910294812',
      ifscCode: 'SBIN0001234',
      category: 'OBC',
      verificationStatus: 'VERIFIED',
      villageName: 'Muthsandra'
    },
    {
      id: 2,
      jobCardNumber: 'KA-01-002-004-001/103',
      fullName: 'Lakshmi Devi',
      gender: 'FEMALE',
      dob: '1990-08-22',
      aadhaarHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
      bankAccountNumber: '492019385012',
      ifscCode: 'CNRB0002345',
      category: 'SC',
      verificationStatus: 'VERIFIED',
      villageName: 'Muthsandra'
    },
    {
      id: 3,
      jobCardNumber: 'KA-01-002-004-001/104',
      fullName: 'Ramesh Naidu',
      gender: 'MALE',
      dob: '1982-11-05',
      aadhaarHash: '7c4a8d09ca3762af61e59520943dc26494f8941b',
      bankAccountNumber: '581902941029',
      ifscCode: 'HDFC0004921',
      category: 'GENERAL',
      verificationStatus: 'PENDING',
      villageName: 'Anugondanahalli'
    }
  ],
  projects: [
    {
      id: 1,
      projectCode: 'PRJ-KA-HOS-001',
      title: 'Muthsandra Lake Desilting & Bund Construction',
      workType: 'WATER_CONSERVATION',
      estimatedCost: 450000,
      sanctionedDays: 100,
      status: 'IN_PROGRESS',
      latitude: 12.9642,
      longitude: 77.7815,
      villageName: 'Muthsandra',
      completionProgress: 68
    },
    {
      id: 2,
      projectCode: 'PRJ-KA-HOS-002',
      title: 'Anugondanahalli Feeder Canal Drainage Clearing',
      workType: 'DREDGING',
      estimatedCost: 280000,
      sanctionedDays: 60,
      status: 'IN_PROGRESS',
      latitude: 12.9710,
      longitude: 77.7890,
      villageName: 'Muthsandra',
      completionProgress: 42
    },
    {
      id: 3,
      projectCode: 'PRJ-KA-HOS-003',
      title: 'Panchayat Plantation Drive & Soil Conservation',
      workType: 'PLANTATION',
      estimatedCost: 190000,
      sanctionedDays: 45,
      status: 'APPROVED',
      latitude: 12.9550,
      longitude: 77.7720,
      villageName: 'Muthsandra',
      completionProgress: 10
    }
  ],
  fraudAlerts: [
    {
      id: 1,
      alertCode: 'ALT-GPS-9912',
      anomalyType: 'FAKE_GPS',
      severity: 'HIGH',
      description: 'Worker QR scanned 3.8 km outside project radius boundary.',
      workerName: 'Lakshmi Devi',
      projectTitle: 'Muthsandra Lake Desilting',
      confidenceScore: 0.92,
      status: 'OPEN'
    },
    {
      id: 2,
      alertCode: 'ALT-DUP-4819',
      anomalyType: 'DUPLICATE_WORKER',
      severity: 'MEDIUM',
      description: 'Potential duplicate bank account hash match found across 2 job cards.',
      workerName: 'Ramesh Naidu',
      projectTitle: 'N/A',
      confidenceScore: 0.88,
      status: 'INVESTIGATING'
    }
  ]
};

export default api;
