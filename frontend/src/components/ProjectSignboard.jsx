import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const ProjectSignboard = () => {
  const { lang } = useLanguage();

  if (lang === 'ta') {
    return (
      <div className="bg-[#4a2810] text-[#fef3c7] p-5 rounded-2xl border-4 border-amber-600/60 shadow-2xl space-y-3 font-sans relative overflow-hidden max-w-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 to-yellow-950/90 pointer-events-none" />
        
        {/* Header Emblem & Title in Tamil */}
        <div className="relative z-10 text-center border-b-2 border-amber-700/60 pb-3 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-black text-xs shadow-inner">
              印
            </div>
            <h3 className="text-sm font-black text-amber-300 tracking-tight leading-tight uppercase">
              விக்சித் பாரதம் - கிராமப்புற வேலைவாய்ப்புத் திட்டம்
            </h3>
          </div>
          <div className="text-[11px] font-bold text-amber-200 uppercase tracking-widest">
            (VB–G RAM G - தமிழ்நாடு அரசு)
          </div>
        </div>

        {/* Tamil Details */}
        <div className="relative z-10 space-y-2 text-xs font-semibold text-amber-100">
          <div className="flex items-start justify-between border-b border-amber-800/60 pb-1.5">
            <span className="text-amber-300/80">அமிர்த சரோவர் திட்டம்:</span>
            <span className="font-bold text-white text-right">கிராம பஞ்சாயத்து - பூண்டி</span>
          </div>

          <div className="flex items-start justify-between border-b border-amber-800/60 pb-1.5">
            <span className="text-amber-300/80">பணியின் பெயர்:</span>
            <span className="font-bold text-amber-200 text-right">குளம் சீரமைத்தல் மற்றும் தூர்வாருதல்</span>
          </div>

          <div className="flex items-start justify-between border-b border-amber-800/60 pb-1.5">
            <span className="text-amber-300/80">மொத்த திட்ட மதிப்பீடு:</span>
            <span className="font-extrabold text-emerald-400 text-sm">₹ 2,50,000/-</span>
          </div>

          <div className="flex items-start justify-between border-b border-amber-800/60 pb-1.5">
            <span className="text-amber-300/80">தொடக்க தேதி:</span>
            <span className="font-mono text-amber-200">12 ஏப்ரல் 2024</span>
          </div>
        </div>

        {/* Footer Authority */}
        <div className="relative z-10 pt-2 text-center text-[10px] font-bold text-amber-300 border-t-2 border-amber-700/60 uppercase tracking-wider">
          மாவட்ட நிர்வாகம் & ஊரக வளர்ச்சித் துறை, திருவள்ளூர் மாவட்டம்
        </div>
      </div>
    );
  }

  // Default English Signboard
  return (
    <div className="bg-[#4a2810] text-[#fef3c7] p-5 rounded-2xl border-4 border-amber-600/60 shadow-2xl space-y-3 font-sans relative overflow-hidden max-w-md mx-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 to-yellow-950/90 pointer-events-none" />
      
      {/* Header Emblem & Title in English */}
      <div className="relative z-10 text-center border-b-2 border-amber-700/60 pb-3 space-y-1">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-black text-xs shadow-inner">
            印
          </div>
          <h3 className="text-sm font-black text-amber-300 tracking-tight leading-tight uppercase">
            VIKSIT BHARAT - RURAL EMPLOYMENT SCHEME
          </h3>
        </div>
        <div className="text-[11px] font-bold text-amber-200 uppercase tracking-widest">
          (VB–G RAM G - GOVERNMENT OF TAMIL NADU)
        </div>
      </div>

      {/* English Details */}
      <div className="relative z-10 space-y-2 text-xs font-semibold text-amber-100">
        <div className="flex items-start justify-between border-b border-amber-800/60 pb-1.5">
          <span className="text-amber-300/80">Amrit Sarovar Project:</span>
          <span className="font-bold text-white text-right">Gram Panchayat - Poondi</span>
        </div>

        <div className="flex items-start justify-between border-b border-amber-800/60 pb-1.5">
          <span className="text-amber-300/80">Work Name:</span>
          <span className="font-bold text-amber-200 text-right">Pond Cleaning & Restoration Work</span>
        </div>

        <div className="flex items-start justify-between border-b border-amber-800/60 pb-1.5">
          <span className="text-amber-300/80">Sanctioned Budget:</span>
          <span className="font-extrabold text-emerald-400 text-sm">₹ 2,50,000/-</span>
        </div>

        <div className="flex items-start justify-between border-b border-amber-800/60 pb-1.5">
          <span className="text-amber-300/80">Start Date:</span>
          <span className="font-mono text-amber-200">12 April 2024</span>
        </div>
      </div>

      {/* Footer Authority */}
      <div className="relative z-10 pt-2 text-center text-[10px] font-bold text-amber-300 border-t-2 border-amber-700/60 uppercase tracking-wider">
        DISTRICT ADMINISTRATION & RURAL DEVELOPMENT, THIRUVALLUR DISTRICT
      </div>
    </div>
  );
};
