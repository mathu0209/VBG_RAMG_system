import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Users, MapPin, Activity, CreditCard, Sparkles, CheckCircle2, ArrowRight, Eye, UserPlus, Phone, Award, Building, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const PanchayatSetuHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Live Scrolling Government Announcement Ticker Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center gap-3 overflow-hidden text-xs font-bold">
        <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px] font-black uppercase shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          {lang === 'ta' ? 'நேரலை அறிவிப்பு' : 'Live Update'}
        </div>
        <div className="truncate text-slate-300 font-mono">
          {lang === 'ta' 
            ? 'திருவள்ளூர் மாவட்ட பஞ்சாயத்துகளில் 100% புவிஎல்லை வருகைப்பதிவு இயக்கத்தில் உள்ளது • நேரடி பணப் பரிமாற்றம் (DBT) ₹ 4,122 வரவு வைக்கப்பட்டது • அமிர்த சரோவர் குளம் சீரமைப்பு பணி WK12345 75% நிறைவுற்றது...'
            : 'Geofenced attendance active across 12 Gram Panchayats in Thiruvallur District • Direct Benefit Transfer (DBT) wage payout ₹ 4,122 processed • Amrit Sarovar Pond Work WK12345 reached 75% completion...'}
        </div>
      </div>

      {/* Hero Section: Portal Banner & Real-Time Analytics Counters */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-12 px-6 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Content (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-black text-amber-400 uppercase tracking-widest">
              <span>★ OFFICIAL RURAL DEVELOPMENT PORTAL</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {lang === 'ta' 
                ? 'பஞ்சாயத்து சேது - ஸ்மார்ட் கிராமப்புற வேலைவாய்ப்பு போர்ட்டல்' 
                : 'Panchayat Setu — Smart Rural Employment Portal'}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-semibold">
              {lang === 'ta'
                ? 'விக்சித் பாரதம் (VB–G RAM G) திட்டத்தின்கீழ் கிராமப்புற வேலைவாய்ப்பு, உயிரியல் வருகைப்பதிவு, புவிஎல்லைக் கண்காணிப்பு மற்றும் AI மோசடி கண்டறிதல் அமைப்பு.'
                : 'Viksit Bharat (VB–G RAM G) Smart Rural Employment, Biometric Attendance, Geofenced Inspection, and AI Computer Vision Anti-Corruption Transparency System.'}
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                {lang === 'ta' ? 'புதிய கணக்கு பதிவு செய்' : 'Create Role Account'}
              </Link>

              <Link
                to="/work-progress"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-black text-sm shadow-xl transition-all flex items-center gap-2"
              >
                <Eye className="w-5 h-5 text-emerald-400" />
                {lang === 'ta' ? 'நிகழ்நேர பணி ஆய்வு' : 'Live Work Inspection'}
              </Link>
            </div>
          </div>

          {/* Hero Right Banner Image (Cols 8-12) */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900">
            <ImageWithFallback 
              src="/assets/rural_work_banner.jpg" 
              alt="Panchayat Setu Rural Work Banner" 
              className="w-full h-72 object-cover"
              fallbackType="banner"
            />
          </div>

        </div>

        {/* Real-Time Live Analytics Statistics Counters */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center font-black">
              <Building className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-white">12</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Gram Panchayats Covered</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-emerald-400">1,248</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Active Registered Workers</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-black">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-amber-400">45</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Ongoing Rural Worksites</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-purple-400">₹ 2.50 Cr</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Sanctioned Budget (DBT)</div>
          </div>

        </div>
      </section>

      {/* Panchayat Setu 4-Role Access Portal Cards Suite */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/30">
            ROLE-BASED PORTAL ACCESS MODULES
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white">
            {lang === 'ta' ? 'பஞ்சாயத்து சேது பொறுப்பு போர்ட்டல்கள்' : 'Panchayat Setu Role Access Portals'}
          </h2>
          <p className="text-sm text-slate-400 font-semibold max-w-xl mx-auto">
            Access dedicated individual portals for Workers, Supervisors, Block Officers, and State Admins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Worker Portal */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xl hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                Rural Worker Portal
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                View personal Job Card, digital QR code, wage earnings calculator (₹4,122), and attendance history.
              </p>
            </div>

            <Link
              to="/worker-portal"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              Open Worker Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Supervisor Portal */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xl hover:border-amber-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                Supervisor / GRS Portal
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Field attendance scanner, biometric face capture studio, and geotagged worksite photo workstation.
              </p>
            </div>

            <Link
              to="/worker-dashboard"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all"
            >
              Open Supervisor Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Block Officer Portal */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xl hover:border-cyan-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-black text-xl">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                Block Officer Portal
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Review pending attendance approvals, progress inspection overrides, budget sanctions, and grievances.
              </p>
            </div>

            <Link
              to="/block-officer-portal"
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
            >
              Open Block Officer Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4: State Admin Portal */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xl hover:border-purple-500/50 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black text-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors">
                State Admin Portal
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                System-wide AI Fraud Radar, Master GIS map, district analytics, reports exporter, and user registry.
              </p>
            </div>

            <Link
              to="/"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              Open Admin Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Official Government Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-lg">
                印
              </div>
              <div>
                <div className="font-black text-white text-sm">PANCHAYAT SETU PORTAL</div>
                <div className="text-[10px] text-emerald-400 font-bold">Government of Tamil Nadu</div>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Designed & developed for Viksit Bharat - Gramin Rozgar Scheme (VB–G RAM G). Smart Rural Employment Management & Transparency Portal.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-sm">Official Quick Links</div>
            <ul className="space-y-1 text-slate-300">
              <li>• <Link to="/worker-portal" className="hover:text-emerald-400">Worker Job Card Portal</Link></li>
              <li>• <Link to="/work-progress" className="hover:text-emerald-400">Real-Time Worksite Inspection</Link></li>
              <li>• <Link to="/ai-fraud" className="hover:text-emerald-400">AI Computer Vision Fraud Radar</Link></li>
              <li>• <Link to="/register" className="hover:text-emerald-400">Create Role Account</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-sm">Helpline & Support</div>
            <div className="text-slate-300 space-y-1">
              <div>Toll Free Helpline: <strong>1800-111-222</strong></div>
              <div>Support Email: <strong>helpdesk@panchayatsetu.in</strong></div>
              <div className="text-[10px] text-slate-500 pt-2">
                © 2026 Ministry of Panchayati Raj & Rural Development. All Rights Reserved.
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
