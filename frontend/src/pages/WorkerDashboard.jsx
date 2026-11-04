import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, UserCheck, Activity, Users, FileText, ShieldAlert, Bell, User, Settings, LogOut, MapPin, Calendar, Clock
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { NotificationBell } from '../components/shared/NotificationBell';

export const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const dayName = now.toLocaleDateString('en-GB', { weekday: 'long' });
      setTimeStr(`${datePart}, ${dayName}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Attendance Line Chart Data matching Screen 2
  const attendanceTrendData = [
    { date: '17 Sep', Present: 31, Absent: 14 },
    { date: '18 Sep', Present: 30, Absent: 18 },
    { date: '19 Sep', Present: 29, Absent: 12 },
    { date: '20 Sep', Present: 27, Absent: 14 },
    { date: '21 Sep', Present: 30, Absent: 21 },
    { date: '22 Sep', Present: 27, Absent: 16 },
    { date: '23 Sep', Present: 28, Absent: 15 },
  ];

  // Donut Chart Data matching Screen 2
  const workStatusData = [
    { name: 'In Progress', value: 3, color: '#2563eb' },
    { name: 'Completed', value: 1, color: '#10b981' },
    { name: 'Delayed', value: 1, color: '#f59e0b' },
    { name: 'Not Started', value: 0, color: '#64748b' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex font-sans">
      
      {/* Dark Navy Sidebar matching Screen 2 in Image */}
      <aside className="w-64 bg-[#0a192f] text-slate-300 flex flex-col justify-between p-4 flex-shrink-0 border-r border-slate-800">
        <div className="space-y-6">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              印
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-tight">VB–G RAM G</h1>
              <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">SMART SYSTEM</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 text-xs font-bold">
            <button className="w-full px-3.5 py-2.5 rounded-xl bg-blue-600 text-white flex items-center gap-3 shadow-md">
              <LayoutGrid className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button onClick={() => navigate('/mark-attendance')} className="w-full px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-3 transition-all">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Site Attendance</span>
            </button>

            <button onClick={() => navigate('/work-progress')} className="w-full px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-3 transition-all">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Work Progress</span>
            </button>

            <button onClick={() => navigate('/workers')} className="w-full px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-3 transition-all">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Workers</span>
            </button>

            <button onClick={() => navigate('/reports')} className="w-full px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-3 transition-all">
              <FileText className="w-4 h-4 text-slate-300" />
              <span>Reports</span>
            </button>

            <button onClick={() => navigate('/ai-fraud')} className="w-full px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-all">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>AI / Fraud Detection</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
                3
              </span>
            </button>

            <button className="w-full px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-3 transition-all">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notifications</span>
            </button>

            <button className="w-full px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-3 transition-all">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Profile</span>
            </button>

            <button className="w-full px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center gap-3 transition-all">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Red Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 text-xs font-bold transition-all border border-rose-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Web Body */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar matching Screen 2 */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Good Evening, {user?.fullName?.split(' ')[0] || 'Site Supervisor'}! 👋
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-0.5">Let's build a better rural tomorrow.</p>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Live Location Telemetry Badge */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{user?.village || 'Poondi'} Panchayat, {user?.district || 'Thiruvallur District'}</span>
            </div>

            {/* Live Date Badge */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{timeStr || '23 Sept 2026, Wednesday'}</span>
            </div>

            <NotificationBell />

            {/* User Profile Avatar matching Screen 2 */}
            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-md border-2 border-blue-500">
                {user?.fullName?.charAt(0) || 'S'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {user?.fullName || 'Site Supervisor'}
                </div>
                <div className="text-[10px] text-slate-500 font-bold">
                  Site Supervisor
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6 space-y-6">
          
          {/* 4 Top KPI Cards matching Screen 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Total Workers */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500">Total Workers</div>
                <div className="text-2xl font-black text-slate-900 mt-1">32</div>
                <div className="text-[11px] font-extrabold text-emerald-600 mt-0.5">12 Present Today</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Today's Attendance */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500">Today's Attendance</div>
                <div className="text-2xl font-black text-slate-900 mt-1">28</div>
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-extrabold text-[10px] mt-0.5">
                  87.5%
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Ongoing Works */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500">Ongoing Works</div>
                <div className="text-2xl font-black text-slate-900 mt-1">5</div>
                <div className="text-[11px] font-extrabold text-amber-600 mt-0.5">2 Nearing Completion</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Today's Wage Disbursed */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500">Today's Wage Disbursed</div>
                <div className="text-2xl font-black text-slate-900 mt-1">₹ 6,412</div>
                <div className="text-[11px] font-extrabold text-emerald-600 mt-0.5">+12% from yesterday</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Grid Row: Attendance Line Chart & Work Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Attendance Trend Line Chart (7 Cols) matching Screen 2 */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">Attendance Trend (Last 7 Days)</h3>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="text-emerald-600">• Present</span>
                  <span className="text-rose-500">• Absent</span>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceTrendData}>
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="Present" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Absent" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Work Status Overview Donut Chart (5 Cols) matching Screen 2 */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Work Status Overview</h3>

              <div className="relative h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {workStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute text-center">
                  <div className="text-2xl font-black text-slate-900">5</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Works</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-bold pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-blue-600">
                  <span>• In Progress</span>
                  <span>3 (60%)</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600">
                  <span>• Completed</span>
                  <span>1 (20%)</span>
                </div>
                <div className="flex justify-between items-center text-amber-600">
                  <span>• Delayed</span>
                  <span>1 (20%)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>• Not Started</span>
                  <span>0 (0%)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
