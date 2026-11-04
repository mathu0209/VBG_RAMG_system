import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    appTitle: 'Smart Rural Employment Management and Transparency System for VB–G RAM G',
    shortTitle: 'VB–G RAM G SMART SYSTEM',
    dashboard: 'Dashboard',
    workers: 'Worker Registration',
    attendance: 'Attendance',
    works: 'Works Progress',
    payments: 'Payments & Wages',
    aiFraud: 'AI Fraud Radar',
    reports: 'Statutory Reports',
    auditLogs: 'Audit Logs',
    notifications: 'Notifications',
    settings: 'System Settings',
    login: 'Supervisor / Official Login',
    markAttendance: 'Mark Site Attendance',
    faceCapture: 'Biometric Face Verification',
    worksitePhoto: 'Worksite Photo & Geotag',
    workProgress: 'Real-Time Work Progress',
    totalWorkers: 'Total Registered Workers',
    todayAttendance: "Today's Attendance Count",
    suspiciousRecords: 'Suspicious Fraud Records',
    totalPayments: 'Total Payments Disbursed',
    state: 'State',
    district: 'District',
    village: 'Village',
    tamilnadu: 'Tamil Nadu',
    selectRole: 'Select Portal Access Role',
    username: 'Username / Official ID',
    password: 'Password',
    loginBtn: 'Login to Portal',
    verifySuccess: 'Verified Successfully',
    withinWorksite: 'Within Approved Worksite Radius',
    capturePhoto: 'Capture Worksite Snapshot',
    aiEstimatedProgress: 'AI Estimated Work Completion',
    viewDetails: 'View Detailed Report',
    sendReview: 'Send for Senior Review',
    supervisorPortal: 'Supervisor Portal Access',
    presentToday: 'Present Today',
    attendanceRate: 'Attendance Rate',
    todaysWage: "Today's Wage",
    assignedWorksite: 'Assigned Worksite',
    overallProgress: 'Overall Work Completion',
    viewProgress: 'View Worksite Progress',
    liveRollCall: 'Live Roll Call',
    present: 'Present',
    absent: 'Absent',
    pending: 'Pending',
    recentActivity: 'Recent Audit Trail',
    workerRegistration: 'Worker Registration',
    personalInfo: 'Personal Information',
    aadhaarNumber: 'Aadhaar Number',
    fullName: 'Full Name',
    gender: 'Gender',
    dob: 'Date of Birth',
    mobileNumber: 'Mobile Number',
    address: 'Residential Address',
    saveContinue: 'Save & Continue',
    viewPhoto: 'View Photo',
    retakePhoto: 'Retake Photo',
    verifyIdentity: 'Verify Identity',
    proceedAttendance: 'Proceed to Attendance',
    geotaggedPhoto: 'Geotagged Worksite Photo',
    immutableMetadata: 'Immutable Metadata Embed',
    tamperEvident: 'SHA-256 Tamper Seal',
    exportCsv: 'Export CSV',
    downloadPdf: 'Download PDF',
    systemOnline: 'System Online'
  },
  ta: {
    appTitle: 'VB–G RAM G ஸ்மார்ட் கிராமப்புற வேலைவாய்ப்பு மேலாண்மை மற்றும் வெளிப்படைத்தன்மை அமைப்பு',
    shortTitle: 'VB–G RAM G ஸ்மார்ட் அமைப்பு',
    dashboard: 'முகப்பு / டாஷ்போர்டு',
    workers: 'பணியாளர் பதிவு',
    attendance: 'வருகைப்பதிவு',
    works: 'பணி முன்னேற்றம்',
    payments: 'ஊதிய கொடுப்பனவு',
    aiFraud: 'AI மோசடி ஆய்வு',
    reports: 'அரசு அறிக்கைகள்',
    auditLogs: 'தணிக்கை பதிவுகள்',
    notifications: 'அறிவிப்புகள்',
    settings: 'அமைப்பு அமைப்புகள்',
    login: 'மேற்பார்வையாளர் / அதிகாரி உள்நுழைவு',
    markAttendance: 'வருகைப்பதிவு செய்',
    faceCapture: 'முக உயிரியல் சரிபார்ப்பு',
    worksitePhoto: 'வேலைத்தள புகைப்படம்',
    workProgress: 'நிகழ்நேர பணி முன்னேற்றம்',
    totalWorkers: 'மொத்த பணியாளர்கள்',
    todayAttendance: 'இன்றைய வருகைப்பதிவு',
    suspiciousRecords: 'சந்தேகத்திற்குரிய பதிவுகள்',
    totalPayments: 'மொத்த கொடுப்பனவுகள்',
    state: 'மாநிலம்',
    district: 'மாவட்டம்',
    village: 'கிராமம்',
    tamilnadu: 'தமிழ்நாடு',
    selectRole: 'பங்கைத் தேர்ந்தெடுக்கவும்',
    username: 'பயனர்பெயர் / அதிகாரி எண்',
    password: 'கடவுச்சொல்',
    loginBtn: 'உள்நுழை',
    verifySuccess: 'வெற்றிகரமாக சரிபார்க்கப்பட்டது',
    withinWorksite: 'வேலைத்தள எல்லைக்குள்',
    capturePhoto: 'புகைப்படம் எடு',
    aiEstimatedProgress: 'AI மதிப்பிடப்பட்ட முன்னேற்றம்',
    viewDetails: 'விவரங்களை காண்க',
    sendReview: 'பரிசீலனைக்கு அனுப்பு',
    supervisorPortal: 'மேற்பார்வையாளர் நுழைவு',
    presentToday: 'இன்று வருகை தந்தோர்',
    attendanceRate: 'வருகை சதவீதம்',
    todaysWage: 'இன்றைய ஊதியம்',
    assignedWorksite: 'ஒதுக்கப்பட்ட வேலைத்தளம்',
    overallProgress: 'ஒட்டுமொத்த பணி முன்னேற்றம்',
    viewProgress: 'பணி முன்னேற்றத்தை காண்க',
    liveRollCall: 'நேரடி வருகைப்பட்டி',
    present: 'வருகை தந்தார்',
    absent: 'வரவில்லை',
    pending: 'நிலுவையில்',
    recentActivity: 'சமீபத்திய தணிக்கை நடவடிக்கைகள்',
    workerRegistration: 'பணியாளர் பதிவு',
    personalInfo: 'தனிப்பட்ட விவரங்கள்',
    aadhaarNumber: 'ஆதார் எண்',
    fullName: 'முழு பெயர்',
    gender: 'பாலினம்',
    dob: 'பிறந்த தேதி',
    mobileNumber: 'கைபேசி எண்',
    address: 'முகவரி',
    saveContinue: 'சேமித்து தொடரவும்',
    viewPhoto: 'புகைப்படத்தை காண்க',
    retakePhoto: 'மீண்டும் எடுக்கவும்',
    verifyIdentity: 'அடையாளம் சரிபார்',
    proceedAttendance: 'வருகைப்பதிவுக்கு செல்லவும்',
    geotaggedPhoto: 'புவிசார் குறியீட்டு படம்',
    immutableMetadata: 'மாற்ற முடியாத தரவு சான்று',
    tamperEvident: 'SHA-256 பாதுகாப்பு முத்திரை',
    exportCsv: 'CSV ஏற்றுமதி',
    downloadPdf: 'PDF பதிவிறக்கம்',
    systemOnline: 'அமைப்பு ஆன்லைன்'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('appLanguage') || 'ta';
  });

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('appLanguage', newLang);
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['ta']?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
