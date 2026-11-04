import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, ChevronDown, Landmark } from 'lucide-react';

export const Navbar = () => {
  const { user, switchRole, ROLES } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const currentRoleInfo = ROLES.find(r => r.id === user?.role) || ROLES[0];

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a1211] px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Govt Emblem & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center text-slate-300 bg-white/5 rounded-lg border border-white/10 flex-shrink-0">
          <Landmark style={{ width: '20px', height: '20px' }} className="text-emerald-400" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400 leading-tight">Government of India</div>
          <div className="text-sm font-extrabold text-slate-100 tracking-wide">
            Smart Rural Employment (MGNREGS)
          </div>
        </div>
      </div>

      {/* Right: User, Role Dropdown */}
      <div className="flex items-center gap-4">

        {/* User Profile */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <User style={{ width: '14px', height: '14px' }} className="text-slate-400" />
          <span>User / No Menu</span>
        </div>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#12201d] border border-[#00e699]/30 text-xs font-bold text-slate-100 hover:border-[#00e699] transition-all"
          >
            <span className="text-slate-400 font-normal">Role:</span>
            <span className="text-[#00e699] font-extrabold">{currentRoleInfo.label}</span>
            <ChevronDown style={{ width: '14px', height: '14px' }} className="text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#12201d] border border-white/10 shadow-2xl p-2 z-50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1">
                Switch Role Mode
              </div>
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    switchRole(r.id);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    user?.role === r.id ? 'bg-white/10 text-[#00e699]' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{r.label}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
