import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { t, lang } = useLanguage();

  const [role, setRole] = useState('WORKER'); // WORKER, SUPERVISOR, BLOCK_OFFICER, ADMIN
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Thiruvallur (திருவள்ளூர்)');
  const [village, setVillage] = useState('Poondi');
  const [roleIdNumber, setRoleIdNumber] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    const registered = registerUser({
      fullName,
      username: username || fullName.toLowerCase().replace(/\s+/g, '_'),
      role,
      district,
      village,
      roleIdNumber: roleIdNumber || 'TN-REG-9910'
    });

    // Role-based route redirection
    if (role === 'WORKER') navigate('/worker-portal');
    else if (role === 'SUPERVISOR') navigate('/worker-dashboard');
    else if (role === 'BLOCK_OFFICER') navigate('/block-officer-portal');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Widescreen Desktop Account Registration Suite */}
      <div className="w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 p-6 md:p-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Create New Role Account</h1>
              <p className="text-xs text-slate-400">VB–G RAM G Smart Rural Employment Management System</p>
            </div>
          </div>

          <Link to="/login" className="text-xs font-bold text-blue-400 hover:underline">
            Already have an account? Login →
          </Link>
        </div>

        {/* Role Tab Selector (Worker, Supervisor, Block Officer, Admin) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
            Select Account Role (பங்கைத் தேர்ந்தெடுக்கவும்):
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            
            <button
              type="button"
              onClick={() => setRole('WORKER')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                role === 'WORKER'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>Rural Worker</span>
              <span className="text-[10px] font-normal opacity-90">(பணியாளர்)</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('SUPERVISOR')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                role === 'SUPERVISOR'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>Supervisor / Mate</span>
              <span className="text-[10px] font-normal opacity-90">(மேற்பார்வையாளர்)</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('BLOCK_OFFICER')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                role === 'BLOCK_OFFICER'
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>Block Officer</span>
              <span className="text-[10px] font-normal opacity-90">(வட்டார அதிகாரி)</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                role === 'ADMIN'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>State Admin</span>
              <span className="text-[10px] font-normal opacity-90">(மாநில நிர்வாகி)</span>
            </button>

          </div>
        </div>

        {/* Dynamic Registration Form */}
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. S. Murugan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Username / Official ID</label>
            <input
              type="text"
              required
              placeholder="e.g. supervisor_poondi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Role-Specific ID Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {role === 'WORKER' ? 'Job Card Number / Aadhaar' : role === 'SUPERVISOR' ? 'Supervisor ID Code' : role === 'BLOCK_OFFICER' ? 'Block Officer ID' : 'Admin Security Key'}
            </label>
            <input
              type="text"
              required
              placeholder={role === 'WORKER' ? 'TN-01-002-004-001/102' : 'SUP-TN-10245'}
              value={roleIdNumber}
              onChange={(e) => setRoleIdNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* District Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">District (Tamil Nadu)</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
            >
              <option value="Thiruvallur (திருவள்ளூர்)">Thiruvallur (திருவள்ளூர்)</option>
              <option value="Kanchipuram (காஞ்சிபுரம்)">Kanchipuram (காஞ்சிபுரம்)</option>
              <option value="Chengalpattu (செங்கல்பட்டு)">Chengalpattu (செங்கல்பட்டு)</option>
              <option value="Madurai (மதுரை)">Madurai (மதுரை)</option>
              <option value="Thanjavur (தஞ்சாவூர்)">Thanjavur (தஞ்சாவூர்)</option>
            </select>
          </div>

          {/* Village Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Panchayat / Village</label>
            <input
              type="text"
              required
              placeholder="e.g. Poondi"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              Create Account & Access Portal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
