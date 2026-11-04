import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FolderKanban, CreditCard, ShieldAlert, 
  TrendingUp, AlertTriangle, ArrowRight, UserX, MapPin, Wallet, AlertCircle, Filter, Building2
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';

import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { TAMIL_NADU_DISTRICTS, TAMIL_NADU_VILLAGES } from '../constants/districts';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // District & Village Filter State - Defaults to SSO logged-in user's district/village if set
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    return user?.district || 'அனைத்து மாவட்டங்கள்';
  });

  const [selectedVillage, setSelectedVillage] = useState(() => {
    return user?.village || 'அனைத்து கிராமங்கள்';
  });

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

  // Update selected district when SSO user context changes
  useEffect(() => {
    if (user?.district) {
      setSelectedDistrict(user.district);
    }
    if (user?.village) {
      setSelectedVillage(user.village);
    }
  }, [user]);

  // District-specific metrics calculator function generating 100% UNIQUE numbers per district
  const getDistrictData = (districtName) => {
    const isAll = districtName === 'அனைத்து மாவட்டங்கள்';
    
    if (isAll) {
      return {
        workers: 12645 + registeredWorkers.length,
        activeWorks: 1278,
        payments: '₹2,45,760',
        fraudAlerts: 245,
        attendance: [
          { day: 'திங்கள்', 'வருகை பதிவு': 11850, 'வருகை இல்லை': 795 },
          { day: 'செவ்வாய்', 'வருகை பதிவு': 12100, 'வருகை இல்லை': 545 },
          { day: 'புதன்', 'வருகை பதிவு': 12350, 'வருகை இல்லை': 295 },
          { day: 'வியாழன்', 'வருகை பதிவு': 11900, 'வருகை இல்லை': 745 },
          { day: 'வெள்ளி', 'வருகை பதிவு': 12450, 'வருகை இல்லை': 195 },
          { day: 'சனி', 'வருகை பதிவு': 12645, 'வருகை இல்லை': 120 },
        ],
        workStatus: [
          { name: 'நடைபெறுகிறது', value: 830, color: '#1456D9' },
          { name: 'நிறைவடைந்தது', value: 320, color: '#12B981' },
          { name: 'தாமதமானது', value: 128, color: '#F59E0B' },
        ],
        districtChart: [
          { district: 'திருவள்ளூர்', workers: 3420 },
          { district: 'காஞ்சிபுரம்', workers: 2850 },
          { district: 'செங்கல்பட்டு', workers: 2410 },
          { district: 'மதுரை', workers: 2150 },
          { district: 'தஞ்சாவூர்', workers: 1815 },
        ],
        alerts: [
          { id: 1, title: 'முகப் பொருத்தம் முரண்பாடு', worker: 'பணியாளர் #W10235', detail: 'உண்மையான பொருத்த மதிப்பெண் 42% (வரம்பு: 85%)', icon: UserX, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
          { id: 2, title: 'புவிசார் எல்லை (Geofence) முரண்பாடு', worker: 'வேலைத்தளம் WK12345', detail: 'GPS தொலைவு 500மீ எல்லைக்கு வெளியே 625மீ உள்ளது', icon: MapPin, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
          { id: 3, title: 'போலி/ஒரே வங்கி கணக்கு', worker: 'பணியாளர் #W10982', detail: 'கணக்கு மற்றொரு செயலில் உள்ள ஜாப் கார்டுடன் இணைக்கப்பட்டுள்ளது', icon: Wallet, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
          { id: 4, title: 'வழக்கத்திற்கு மாறான ஸ்கேன் அதிர்வெண்', worker: 'வேலைத்தளம் WK8821', detail: '4 நிமிடங்களுக்குள் 3 வருகை ஸ்கேன்கள்', icon: AlertCircle, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
        ],
        works: [
          { id: 'WK12345', name: 'குளம் தூர்வாருதல் & சீரமைத்தல்', district: 'திருவள்ளூர் மாவட்டம்', budget: '₹2,50,000', progress: 75, status: 'நடைபெறுகிறது' },
          { id: 'WK12346', name: 'கால்வாய் வடிகால் தூர்வாருதல்', district: 'காஞ்சிபுரம் மாவட்டம்', budget: '₹1,80,000', progress: 100, status: 'நிறைவடைந்தது' },
          { id: 'WK12347', name: 'தடுப்பணை பழுதுபார்க்கும் பணி', district: 'செங்கல்பட்டு மாவட்டம்', budget: '₹3,20,000', progress: 45, status: 'தாமதமானது' },
          { id: 'WK12348', name: 'கிராமப்புற மரக்கன்று நடும் திட்டம்', district: 'மதுரை மாவட்டம்', budget: '₹1,50,000', progress: 90, status: 'நடைபெறுகிறது' },
        ]
      };
    }

    // Deterministic hash value for unique per-district numbers
    let hash = 0;
    for (let i = 0; i < districtName.length; i++) {
      hash = (hash << 5) - hash + districtName.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    const cleanName = districtName.replace(' மாவட்டம்', '');

    const workerCount = 1800 + (seed % 3200) + registeredWorkers.length * 5;
    const activeWorksCount = 45 + (seed % 170);
    const payVal = (workerCount * 310 * 12);
    const paymentsStr = `₹${(payVal / 100000).toFixed(2)} லட்சம்`;
    const alertCount = 6 + (seed % 34);

    const presentBase = Math.floor(workerCount * 0.89);
    const absentBase = workerCount - presentBase;

    const inProg = Math.floor(activeWorksCount * 0.62);
    const comp = Math.floor(activeWorksCount * 0.28);
    const del = activeWorksCount - (inProg + comp);

    return {
      workers: workerCount,
      activeWorks: activeWorksCount,
      payments: paymentsStr,
      fraudAlerts: alertCount,
      attendance: [
        { day: 'திங்கள்', 'வருகை பதிவு': presentBase - 120, 'வருகை இல்லை': absentBase + 120 },
        { day: 'செவ்வாய்', 'வருகை பதிவு': presentBase - 40, 'வருகை இல்லை': absentBase + 40 },
        { day: 'புதன்', 'வருகை பதிவு': presentBase + 80, 'வருகை இல்லை': absentBase - 80 },
        { day: 'வியாழன்', 'வருகை பதிவு': presentBase + 10, 'வருகை இல்லை': absentBase - 10 },
        { day: 'வெள்ளி', 'வருகை பதிவு': presentBase + 140, 'வருகை இல்லை': absentBase - 140 },
        { day: 'சனி', 'வருகை பதிவு': workerCount, 'வருகை இல்லை': 15 },
      ],
      workStatus: [
        { name: 'நடைபெறுகிறது', value: inProg, color: '#1456D9' },
        { name: 'நிறைவடைந்தது', value: comp, color: '#12B981' },
        { name: 'தாமதமானது', value: del, color: '#F59E0B' },
      ],
      districtChart: [
        { district: `${cleanName} வடக்கு`, workers: Math.floor(workerCount * 0.35) },
        { district: `${cleanName} தெற்கு`, workers: Math.floor(workerCount * 0.28) },
        { district: `${cleanName} கிழக்கு`, workers: Math.floor(workerCount * 0.22) },
        { district: `${cleanName} மேற்கு`, workers: Math.floor(workerCount * 0.15) },
      ],
      alerts: [
        { id: seed + 1, title: `${cleanName} - முகப் பொருத்தம் சரிபார்ப்பு`, worker: `பணியாளர் #W${(seed % 8000) + 1000}`, detail: 'உண்மையான பொருத்த மதிப்பெண் 48% (வரம்பு: 85%)', icon: UserX, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
        { id: seed + 2, title: `${cleanName} - புவிசார் GPS சரிபார்ப்பு`, worker: `வேலைத்தளம் WK${(seed % 500) + 100}`, detail: 'GPS தொலைவு 500மீ எல்லைக்கு வெளியே 580மீ உள்ளது', icon: MapPin, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
        { id: seed + 3, title: `${cleanName} - வங்கி கணக்கு தணிக்கை`, worker: `பணியாளர் #W${(seed % 9000) + 2000}`, detail: 'கணக்கு மற்றொரு ஜாப் கார்டுடன் இணைக்கப்பட்டுள்ளது', icon: Wallet, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
      ],
      works: [
        { id: `WK-${cleanName.slice(0, 3).toUpperCase()}01`, name: `${cleanName} கிராமப்புற நீர்வள சீரமைப்பு திட்டம்`, district: districtName, budget: `₹${(2 + (seed % 3)).toFixed(1)},00,000`, progress: 75, status: 'நடைபெறுகிறது' },
        { id: `WK-${cleanName.slice(0, 3).toUpperCase()}02`, name: `${cleanName} கால்வாய் மற்றும் ஊரணிகள் தூர்வாருதல்`, district: districtName, budget: `₹${(1 + (seed % 2)).toFixed(1)},80,000`, progress: 100, status: 'நிறைவடைந்தது' },
        { id: `WK-${cleanName.slice(0, 3).toUpperCase()}03`, name: `${cleanName} தடுப்பணை பழுதுபார்க்கும் உள்கட்டமைப்பு பணி`, district: districtName, budget: `₹${(3 + (seed % 2)).toFixed(1)},20,000`, progress: 40, status: 'தாமதமானது' },
        { id: `WK-${cleanName.slice(0, 3).toUpperCase()}04`, name: `${cleanName} கிராமப்புற மரக்கன்று நடும் பசுமை திட்டம்`, district: districtName, budget: `₹${(1 + (seed % 3)).toFixed(1)},50,000`, progress: 90, status: 'நடைபெறுகிறது' },
      ]
    };
  };

  const currentData = getDistrictData(selectedDistrict);
  const cleanDistrictName = selectedDistrict.replace(' மாவட்டம்', '');

  return (
    <MainLayout title="மாநில நிர்வாகி முகப்பு" breadcrumb="மாநில கண்ணோட்டம்">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E4E7EC] rounded-[14px] p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-black text-[#172033] tracking-tight">
              வணக்கம், {user?.fullName || 'மாநில நிர்வாகி'}
            </h2>
            <StatusBadge status="info" text={user?.isSso ? `அரசு SSO: ${selectedDistrict}` : 'தமிழ்நாடு மேலோட்டம்'} />
          </div>
          <p className="text-xs font-semibold text-[#667085]">
            ஊரக வளர்ச்சி அமைச்சகம் • நேரடி கண்காணிப்பு போர்டல்
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="md"
            onClick={() => navigate('/reports')}
          >
            மாநில அறிக்கையை பதிவிறக்கு
          </Button>

          <Button 
            variant="primary" 
            size="md" 
            icon={ArrowRight}
            onClick={() => navigate('/ai-fraud')}
          >
            AI மோசடி ரேடாரைத் திற
          </Button>
        </div>
      </div>

      {/* District & Village Live Dynamic Filter Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-[14px] p-5 text-white shadow-lg flex flex-wrap items-center justify-between gap-4 border border-blue-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl backdrop-blur-md shrink-0">
            <Filter size={22} className="text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-blue-200 uppercase tracking-widest">மாவட்ட நேரலை தரவு வடிக்கட்டி (District Data Switcher)</div>
            <div className="text-base font-black flex items-center gap-2 text-white mt-0.5">
              <Building2 size={18} className="text-amber-400 shrink-0" />
              <span>தேர்ந்தெடுக்கப்பட்ட மாவட்டம்: <span className="text-amber-300 font-mono underline decoration-amber-400 decoration-2 underline-offset-4">{selectedDistrict}</span></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-blue-200">மாவட்டத்தைத் தேர்ந்தெடுக்கும் போது தரவுகள் உடனுக்குடன் மாறும்:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-black border-2 border-amber-400 focus:outline-none shadow-md cursor-pointer hover:bg-slate-50 transition-all"
            >
              <option value="அனைத்து மாவட்டங்கள்">அனைத்து மாவட்டங்கள் (All TN Districts)</option>
              {TAMIL_NADU_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-blue-200">கிராமம் (Village):</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold border border-slate-300 focus:outline-none shadow-sm cursor-pointer"
            >
              <option value="அனைத்து கிராமங்கள்">அனைத்து கிராமங்கள் (All Villages)</option>
              {TAMIL_NADU_VILLAGES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="மொத்த பணியாளர்கள்" 
          value={currentData.workers.toLocaleString('ta-IN')} 
          icon={Users}
          trend={selectedDistrict === 'அனைத்து மாவட்டங்கள்' ? "+540 இந்த மாதம்" : `${cleanDistrictName} மாவட்ட தொழிலாளர்கள்`}
          trendType="up"
        />

        <StatCard 
          title="நடப்பு பணிகள்" 
          value={currentData.activeWorks.toLocaleString('ta-IN')} 
          icon={FolderKanban}
          iconBg="bg-[#1456D9]/10"
          iconColor="text-[#1456D9]"
          subtext={selectedDistrict === 'அனைத்து மாவட்டங்கள்' ? "38 மாவட்டங்களில்" : `${cleanDistrictName} செயலில் உள்ள பணிகள்`}
        />

        <StatCard 
          title="மொத்த ஊதியப் பணம்" 
          value={currentData.payments} 
          icon={CreditCard}
          iconBg="bg-[#12B981]/10"
          iconColor="text-[#12B981]"
          trend="99.4% DBT வெற்றி"
          trendType="up"
        />

        <StatCard 
          title="மோசடி எச்சரிக்கைகள்" 
          value={currentData.fraudAlerts.toString()} 
          icon={ShieldAlert}
          iconBg="bg-[#EF4444]/10"
          iconColor="text-[#EF4444]"
          trend="AI கண்டறிந்தது"
          trendType="down"
        />
      </div>

      {/* Charts Section 1: Left 65% Line Chart, Right 35% Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 65%: Attendance Overview Line Chart */}
        <Card className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
            <div>
              <h3 className="text-base font-black text-[#172033]">
                வருகைப்பதிவு கண்ணோட்டம் ({selectedDistrict})
              </h3>
              <p className="text-xs text-[#667085] font-medium mt-0.5">தினசரி தொழிலாளர் வருகை போக்கு - {selectedDistrict}</p>
            </div>
            <span className="text-xs font-bold text-[#1456D9] bg-[#1456D9]/10 px-2.5 py-1 rounded-lg">கடந்த 6 நாட்கள்</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.attendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
                <XAxis dataKey="day" stroke="#667085" fontSize={11} fontWeight={600} />
                <YAxis stroke="#667085" fontSize={11} fontWeight={600} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1B33', color: '#fff', borderRadius: '10px', fontSize: '12px', border: 'none' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                <Line type="monotone" dataKey="வருகை பதிவு" stroke="#12B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="வருகை இல்லை" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* RIGHT 35%: Work Status Donut Chart */}
        <Card className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="border-b border-[#E4E7EC] pb-3">
            <h3 className="text-base font-black text-[#172033]">பணிகளின் நிலை</h3>
            <p className="text-xs text-[#667085] font-medium mt-0.5">செயலில் உள்ள திட்டங்களின் நிறைவு விநியோகம் ({cleanDistrictName})</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData.workStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {currentData.workStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0B1B33', color: '#fff', borderRadius: '10px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#E4E7EC] text-xs">
            {currentData.workStatus.map((item) => (
              <div key={item.name} className="space-y-0.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="text-[#667085] text-[10px] font-bold uppercase truncate">{item.name}</div>
                <div className="text-[#172033] font-black">{item.value}</div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Charts Section 2: Left 50% Bar Chart, Right 50% Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 50%: District-wise / Block-wise Worker Count */}
        <Card className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="border-b border-[#E4E7EC] pb-3">
            <h3 className="text-base font-black text-[#172033]">
              {selectedDistrict === 'அனைத்து மாவட்டங்கள்' ? 'மாவட்ட வாரியாக பணியாளர்கள் எண்ணிக்கை' : `${cleanDistrictName} வட்டார வாரியாக பணியாளர்கள்`}
            </h3>
            <p className="text-xs text-[#667085] font-medium mt-0.5">பதிவு செய்யப்பட்ட ஜாப் கார்டு பயனாளிகள் எண்ணிக்கை</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.districtChart} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
                <XAxis dataKey="district" stroke="#667085" fontSize={11} fontWeight={600} />
                <YAxis stroke="#667085" fontSize={11} fontWeight={600} />
                <Tooltip contentStyle={{ backgroundColor: '#0B1B33', color: '#fff', borderRadius: '10px', fontSize: '12px' }} />
                <Bar dataKey="workers" fill="#1456D9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* RIGHT 50%: Recent Alerts */}
        <Card className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
            <div>
              <h3 className="text-base font-black text-[#172033] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                சமீபத்திய ஆபத்து எச்சரிக்கைகள் ({selectedDistrict})
              </h3>
              <p className="text-xs text-[#667085] font-medium mt-0.5">AI இயந்திர முரண்பாடு தணிக்கை வரிசை</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/ai-fraud')}
            >
              அனைத்தையும் காண்க →
            </Button>
          </div>

          <div className="space-y-2.5">
            {currentData.alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} className="p-3 rounded-xl bg-[#F5F7FB] border border-[#E4E7EC] flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${alert.bg} ${alert.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#172033]">{alert.title}</span>
                      <span className="text-[10px] font-mono font-bold text-[#667085]">{alert.worker}</span>
                    </div>
                    <p className="text-[11px] text-[#667085] font-medium mt-0.5 truncate">{alert.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>

      {/* Bottom Section: Top Works Table */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
          <div>
            <h3 className="text-base font-black text-[#172033]">
              முக்கிய செயலில் உள்ள வேலைத்தளங்கள் ({selectedDistrict})
            </h3>
            <p className="text-xs text-[#667085] font-medium mt-0.5">முன்னுரிமை கிராமப்புற உள்கட்டமைப்பு திட்டங்கள்</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/projects')}
          >
            அனைத்து திட்டங்களையும் நிர்வகி
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] text-[#667085] uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5 rounded-l-xl">வேலை எண்</th>
                <th className="p-3.5">வேலை பெயர்</th>
                <th className="p-3.5">மாவட்டம்</th>
                <th className="p-3.5">நிதி ஒதுக்கீடு</th>
                <th className="p-3.5">முன்னேற்றம்</th>
                <th className="p-3.5 rounded-r-xl text-right">நிலை</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC] text-[#172033] font-semibold">
              {currentData.works.map((work) => (
                <tr key={work.id} className="hover:bg-[#F5F7FB]/60 transition-colors">
                  <td className="p-3.5 font-mono text-[#1456D9] font-bold">{work.id}</td>
                  <td className="p-3.5 font-black text-[#172033]">{work.name}</td>
                  <td className="p-3.5 text-[#667085]">{work.district}</td>
                  <td className="p-3.5 font-bold text-[#12B981]">{work.budget}</td>
                  <td className="p-3.5 w-48">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1456D9] rounded-full" 
                          style={{ width: `${work.progress}%` }} 
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#172033]">{work.progress}%</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-right">
                    <StatusBadge status={work.status} text={work.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </MainLayout>
  );
};

export default AdminDashboard;
