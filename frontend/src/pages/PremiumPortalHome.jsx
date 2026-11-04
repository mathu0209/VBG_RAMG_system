import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Users, MapPin, Activity, CreditCard, Sparkles, CheckCircle2, ArrowRight, Eye, UserPlus, Phone, Award, Building, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const PremiumPortalHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Live Announcement Ticker Bar */}
      <div className="bg-blue-900 text-white px-6 py-2.5 flex items-center gap-3 overflow-hidden text-xs font-bold shadow-inner">
        <div className="flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black uppercase shrink-0">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          {lang === 'ta' ? 'நேரலை அறிவிப்பு' : 'Live Update'}
        </div>
        <div className="truncate text-blue-100 font-semibold text-xs">
          {lang === 'ta' 
            ? 'திருவள்ளூர் மாவட்ட கிராம பஞ்சாயத்துகளில் 100% புவிஎல்லை வருகைப்பதிவு இயக்கத்தில் உள்ளது • நேரடி பணப் பரிமாற்றம் (DBT) ₹ 4,122 வரவு வைக்கப்பட்டது • அமிர்த சரோவர் குளம் சீரமைப்பு பணி WK12345 75% நிறைவுற்றது...'
            : 'Geofenced attendance active across 12 Gram Panchayats in Thiruvallur District • Direct Benefit Transfer (DBT) wage payout ₹ 4,122 processed • Amrit Sarovar Pond Work WK12345 reached 75% completion...'}
        </div>
      </div>

      {/* Hero Section: Portal Banner & Real-Time Analytics Counters */}
      <section className="relative py-14 px-6 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-8 lg:p-12 border border-slate-200/80 shadow-xl">
          
          {/* Hero Left Content (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-blue-800 uppercase tracking-widest">
              <span>★ OFFICIAL GOVERNMENT WEB PORTAL</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              {lang === 'ta' 
                ? 'விக்சித் பாரதம் - ஸ்மார்ட் கிராமப்புற வேலைவாய்ப்பு போர்ட்டல்' 
                : 'Viksit Bharat — Smart Rural Employment Portal'}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed font-semibold max-w-2xl">
              {lang === 'ta'
                ? 'விக்சித் பாரதம் (VB–G RAM G) திட்டத்தின்கீழ் கிராமப்புற வேலைவாய்ப்பு, உயிரியல் வருகைப்பதிவு, புவிஎல்லைக் கண்காணிப்பு மற்றும் AI மோசடி கண்டறிதல் அமைப்பு.'
                : 'Viksit Bharat (VB–G RAM G) Smart Rural Employment, Biometric Attendance, Geofenced Inspection, and AI Computer Vision Anti-Corruption Transparency System.'}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-7 py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm shadow-xl shadow-blue-700/20 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                {lang === 'ta' ? 'புதிய கணக்கு பதிவு செய்' : 'Create Role Account'}
              </Link>

              <Link
                to="/work-progress"
                className="px-7 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-black text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <Eye className="w-5 h-5 text-emerald-600" />
                {lang === 'ta' ? 'நிகழ்நேர பணி ஆய்வு' : 'Live Work Inspection'}
              </Link>
            </div>
          </div>

          {/* Hero Right Banner Image (Cols 8-12) */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
            <ImageWithFallback 
              src="/assets/rural_work_banner.jpg" 
              alt="Rural Work Banner" 
              className="w-full h-80 object-cover"
              fallbackType="banner"
            />
          </div>

        </div>

        {/* Real-Time Analytics Statistics Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-2 shadow-lg text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 mx-auto flex items-center justify-center font-black">
              <Building className="w-6 h-6" />
            </div>
            <div className="text-4xl font-black text-slate-900">12</div>
            <div className="text-xs font-black text-slate-500 uppercase">Gram Panchayats Covered</div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-2 shadow-lg text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center font-black">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-4xl font-black text-emerald-600">1,248</div>
            <div className="text-xs font-black text-slate-500 uppercase">Active Registered Workers</div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-2 shadow-lg text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center font-black">
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-4xl font-black text-amber-600">45</div>
            <div className="text-xs font-black text-slate-500 uppercase">Ongoing Rural Worksites</div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-2 shadow-lg text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 mx-auto flex items-center justify-center font-black">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="text-4xl font-black text-purple-600">₹ 2.50 Cr</div>
            <div className="text-xs font-black text-slate-500 uppercase">Sanctioned Budget (DBT)</div>
          </div>

        </div>
      </section>

      {/* 4-Role Access Portal Cards Suite */}
      <section className="py-12 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
            ROLE-BASED PORTAL ACCESS MODULES
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            {lang === 'ta' ? 'பொறுப்பு அடிப்படையிலான போர்ட்டல்கள்' : 'Role-Based Access Portals'}
          </h2>
          <p className="text-base text-slate-600 font-bold max-w-xl mx-auto">
            Access dedicated individual portals for Workers, Supervisors, Block Officers, and State Admins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Worker Portal */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-2xl">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                Rural Worker Portal
              </h3>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed">
                View personal Job Card, digital QR code, wage earnings calculator (₹4,122), and attendance history.
              </p>
            </div>

            <Link
              to="/worker-portal"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              Open Worker Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Supervisor Portal */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-black text-2xl">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                Supervisor / GRS Portal
              </h3>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed">
                Field attendance scanner, biometric face capture studio, and geotagged worksite photo workstation.
              </p>
            </div>

            <Link
              to="/worker-dashboard"
              className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all"
            >
              Open Supervisor Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Block Officer Portal */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black text-2xl">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                Block Officer Portal
              </h3>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed">
                Review pending attendance approvals, progress inspection overrides, budget sanctions, and grievances.
              </p>
            </div>

            <Link
              to="/block-officer-portal"
              className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-blue-700/20 transition-all"
            >
              Open Block Officer Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4: State Admin Portal */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-black text-2xl">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                State Admin Portal
              </h3>
              <p className="text-sm text-slate-600 font-semibold leading-relaxed">
                System-wide AI Fraud Radar, Master GIS map, district analytics, reports exporter, and user registry.
              </p>
            </div>

            <Link
              to="/admin-portal"
              className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-purple-700/20 transition-all"
            >
              Open Admin Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-lg">
                印
              </div>
              <div>
                <div className="font-black text-white text-base">VB–G RAM G SMART PORTAL</div>
                <div className="text-xs text-emerald-400 font-bold">Government of Tamil Nadu</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-semibold">
              Designed & developed for Viksit Bharat - Gramin Rozgar Scheme (VB–G RAM G). Smart Rural Employment Management & Transparency Portal.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-black text-white text-base">Official Quick Links</div>
            <ul className="space-y-1 text-slate-300 text-xs font-semibold">
              <li>• <Link to="/worker-portal" className="hover:text-emerald-400">Worker Job Card Portal</Link></li>
              <li>• <Link to="/work-progress" className="hover:text-emerald-400">Real-Time Worksite Inspection</Link></li>
              <li>• <Link to="/ai-fraud" className="hover:text-emerald-400">AI Computer Vision Fraud Radar</Link></li>
              <li>• <Link to="/register" className="hover:text-emerald-400">Create Role Account</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-black text-white text-base">Helpline & Support</div>
            <div className="text-slate-300 text-xs font-semibold space-y-1">
              <div>Toll Free Helpline: <strong>1800-111-222</strong></div>
              <div>Support Email: <strong>helpdesk@vbgramg.gov.in</strong></div>
              <div className="text-slate-400 pt-2 text-[11px]">
                © 2026 Ministry of Panchayati Raj & Rural Development. All Rights Reserved.
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
