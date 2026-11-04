import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Users, Leaf, Eye, EyeOff, User, Lock, ArrowRight, Globe } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('STAFF');
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [username, setUsername] = useState('admin_tn_govt');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'ADMIN') setUsername('admin_tn_govt');
    else if (role === 'SUPERVISOR') setUsername('supervisor_poondi');
    else if (role === 'BLOCK_OFFICER') setUsername('block_officer_thiruvallur');
    else setUsername('worker_basavaraj');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userRole = selectedRole || 'ADMIN';
    const routeMap = {
      ADMIN: '/',
      SUPERVISOR: '/worker-dashboard',
      BLOCK_OFFICER: '/block-officer-portal',
      WORKER: '/worker-portal',
    };

    login({
      id: Date.now(),
      username: username || 'user_official',
      fullName: userRole === 'WORKER' ? 'Rural Worker' : userRole === 'SUPERVISOR' ? 'Site Supervisor' : userRole === 'BLOCK_OFFICER' ? 'K. Sundaram (Block Officer)' : 'Dr. M. Ramanathan (State Admin)',
      email: `${username}@vbgramg.tn.gov.in`,
      role: userRole,
      district: 'Thiruvallur',
      village: 'Poondi'
    }, 'jwt-token-verified-' + Date.now());

    navigate(routeMap[userRole] || '/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* Top Government Header Stripe matching Screen 1 in Image */}
      <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-700 font-black text-xs">
            印
          </div>
          <div>
            <div className="font-extrabold text-slate-900 uppercase tracking-wide text-xs">
              GOVERNMENT OF TAMIL NADU
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">
              MINISTRY OF RURAL DEVELOPMENT
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-xs font-bold text-slate-700">
          <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>

          <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer text-xs"
            >
              <option value="en">English v</option>
              <option value="ta">தமிழ் (Tamil) v</option>
            </select>
          </div>
        </nav>
      </header>

      {/* Main Split Layout: Left Hero Landscape + Right Login Card */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200 min-h-[580px]">
          
          {/* Left Side (Cols 1-7): Rural Banner Image & High-Definition Graphic Overlay */}
          <div className="lg:col-span-7 relative p-8 lg:p-12 flex flex-col justify-between text-white overflow-hidden bg-slate-900">
            
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-overlay scale-105"
              style={{ backgroundImage: `url('/assets/hero.png')` }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-blue-950/40" />

            {/* Top Brand Info */}
            <div className="relative z-10 space-y-3">
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
                VB–G RAM G<br />SMART SYSTEM
              </h1>
              <p className="text-sm lg:text-base font-bold text-slate-200 max-w-lg leading-relaxed">
                Smart Rural Employment Management and Transparency Portal (MGNREGA)
              </p>

              <p className="text-xs font-semibold text-emerald-400">
                Empowering Rural Communities • Building a Better Tomorrow
              </p>
            </div>

            {/* Middle Feature Badges */}
            <div className="relative z-10 flex items-center gap-3 flex-wrap my-6">
              <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2 text-white">
                <Shield className="w-4 h-4 text-emerald-400" />
                Transparency
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2 text-white">
                <Users className="w-4 h-4 text-blue-400" />
                Employment
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2 text-white">
                <Leaf className="w-4 h-4 text-amber-400" />
                Development
              </div>
            </div>

            {/* Bottom Quote Box matching Screen 1 */}
            <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-md">
              <p className="text-xs font-bold italic text-slate-200">
                "Rural progress leads to a stronger Tamil Nadu"
              </p>
            </div>

          </div>

          {/* Right Side (Cols 8-12): White Login Card */}
          <div className="lg:col-span-5 p-8 lg:p-10 bg-white flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full space-y-6">
              
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="text-xs font-bold text-slate-500">Login to continue to VB-G RAM G Smart System</p>
              </div>

              {/* Toggle Tabs matching Screen 1 */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('STAFF')}
                  className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                    activeTab === 'STAFF'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Government Staff
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('OTHER')}
                  className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                    activeTab === 'OTHER'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Other Users
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Select Role */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none cursor-pointer"
                  >
                    <option value="ADMIN">State Admin (மாநில நிர்வாகி)</option>
                    <option value="SUPERVISOR">Supervisor / Mate (மேற்பார்வையாளர்)</option>
                    <option value="BLOCK_OFFICER">Block Officer (வட்டார அதிகாரி)</option>
                    <option value="WORKER">Rural Worker (பணியாளர்)</option>
                  </select>
                </div>

                {/* Username Input */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Username / Official ID
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs font-bold">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" className="text-blue-600 hover:underline">Forgot Password?</a>
                </div>

                {/* Login Button matching Screen 1 */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-extrabold text-xs shadow-lg shadow-blue-700/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Login to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Divider OR */}
              <div className="relative text-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-xs font-bold text-slate-400 uppercase">OR</span>
              </div>

              {/* Government SSO Button */}
              <button
                type="button"
                onClick={handleFormSubmit}
                className="w-full py-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 font-bold flex items-center justify-center text-[10px]">
                  印
                </div>
                <span>Login with Government SSO</span>
              </button>

              {/* Footer Register Link */}
              <div className="text-center text-xs text-slate-500 font-bold pt-2">
                <span>New to the portal? </span>
                <Link to="/register" className="text-blue-600 hover:underline">
                  Create Staff Account
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

    </div>
  );
};
