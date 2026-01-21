// src/styles/twClasses.js

export const tw = {
  pageWrapper: "min-h-screen bg-white p-6 md:p-12 font-sans antialiased text-slate-900",
  container: "max-w-4xl mx-auto",

  headerTitle: "text-3xl font-extrabold text-slate-900 tracking-tight",
  headerSubtitle: "text-slate-500 mt-2 text-lg",

  errorBox: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700",
  loadingBox: "flex justify-center items-center py-12 text-slate-500",
  noDataBox: "text-center py-12 text-slate-500 text-lg",

  card: "bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group",
  cardFlex: "flex flex-col md:flex-row gap-6",

  profileWrapper: "flex-shrink-0 relative mx-auto md:mx-0",
  profileImg: "w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover ring-2 ring-slate-50 group-hover:ring-indigo-50 transition-all",

  details: "flex-grow text-center md:text-left",
  titleRow: "flex flex-col md:flex-row md:items-center gap-2 mb-2 text-xl font-bold text-slate-900",

  tagsWrapper: "flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 mb-4",
  skillTag: "flex items-center gap-1.5 text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-xl",
  cityTag: "flex items-center gap-1.5 font-medium",

  bioText: "text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl",

  actions: "flex flex-row md:flex-col justify-end gap-3 min-w-[140px]",
  btnMessage: "flex-1 md:flex-none bg-slate-900 text-gray-700 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-600 active:scale-95 transition-all",
  btnProfile: "flex-1 md:flex-none border border-slate-200 text-slate-600 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all",
//   /* ============ Global / Shared ============ */
//   pageWrapper: "min-h-screen bg-gray-50 p-6 md:p-12 font-sans antialiased text-slate-900",
//   container: "max-w-5xl mx-auto",

  /* ============ Investors ============ */
  invHeaderTitle: "text-3xl font-bold text-slate-900",
  invHeaderSubtitle: "text-slate-500 mt-2",

  invCard: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100",
  invCardFlex: "flex flex-col md:flex-row gap-6",

  invProfileWrapper: "flex-shrink-0 relative",
  invProfileImg: "w-20 h-20 md:w-24 md:h-24 rounded-full object-cover",
  invVerifiedIcon: "absolute top-0 right-0",

  invMainDetails: "flex-grow",
  invNameRow: "flex items-center gap-2 mb-1 text-xl font-bold text-slate-900",

  invInfoRow: "flex items-center gap-4 text-sm text-slate-500 mb-3",
  invBadgeType: "font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded",
  invLocationRow: "flex items-center gap-1",

  invBioText: "text-slate-600 text-sm mb-4",
  invSectorBadge: "bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full",

  invActionsWrapper:
    "flex flex-row md:flex-col justify-end gap-3 mt-4 md:mt-0 min-w-[140px]",
  invBtnMessage:
    "flex-1 md:flex-none bg-black text-gray-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors",
  invBtnPending:
    "flex-1 md:flex-none bg-gray-700 text-gray-100 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed transition-colors",
  invBtnView:
    "flex-1 md:flex-none border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors",

  /* ============ Account Page ============ */
  accPageWrapper:
    "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8",
  accContainer: "max-w-4xl mx-auto space-y-8",

  accCard: "bg-white rounded-2xl shadow-xl overflow-hidden",
  accHeader:
    "bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white",
  accHeaderTitle: "text-3xl font-bold",
  accHeaderSubtitle: "text-blue-100 mt-2 text-sm",
  accHeaderRole: "text-blue-200 text-sm mt-3 capitalize",

  accAlertError:
    "mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3",
  accAlertSuccess:
    "mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3",

  accForm: "px-8 py-8 space-y-6",
  accInput:
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition",
  accTextarea:
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition",

  accSectionTitle: "text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2",

  accSubmitBtn:
    "flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed",

  /* Entrepreneur & Investor Profile */
  accProfileCard: "bg-white rounded-2xl shadow-xl overflow-hidden",
  accProfileHeaderGreen:
    "bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white",
  accProfileHeaderPurple:
    "bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white",

  accProfileSection: "px-8 py-8",
  accProfileSubTitle: "text-2xl font-bold",
  accProfileSubDesc: "text-green-100 mt-1",

  accItemBox:
    "p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4",

  accItemTitle: "font-semibold text-gray-800 mb-1",
  accItemText: "text-sm text-gray-600",
  //Ai review page
    aiReviewWrapper: "w-screen min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 md:p-12 animate-in fade-in duration-700",
  aiContentContainer: "w-full max-w-4xl flex flex-col items-center",
  
  backButton: "group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all",
  iconContainer: "bg-indigo-600 p-5 rounded-3xl shadow-2xl shadow-indigo-200 mb-6",
  titleMain: "text-4xl md:text-5xl font-black text-slate-800 tracking-tighter text-center",
  
  cardMain: "w-full bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-indigo-100/30 overflow-hidden mt-12",
  statusBar: "bg-slate-900 px-10 py-5 flex items-center justify-center gap-3",
  statusText: "text-indigo-400 font-mono text-xs uppercase tracking-[0.3em] font-bold",
  
  bodyContainer: "p-10 md:p-20 flex flex-col items-center justify-center text-center",
  reviewText: "text-slate-700 text-lg md:text-2xl leading-relaxed font-medium whitespace-pre-wrap italic text-center mx-auto max-w-3xl",
  
  loadingContainer: "flex flex-col items-center py-20",
  spinner: "animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-6",
  
  footer: "bg-slate-50 p-8 border-t border-slate-100 flex justify-center gap-8",
  footerItem: "flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest",
  //dashboard page
   // Layout
  pageWrapper: "flex flex-col w-screen min-h-screen bg-slate-50 font-sans selection:bg-indigo-100",
  mainContent: "flex-1 px-8 py-8 max-w-7xl mx-auto w-full",
  cardWrapper: "bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 min-h-[60vh]",
  
  // Header
  header: "bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-50",
  logoContainer: "flex items-center gap-3 mr-8",
  logoIcon: "bg-indigo-600 p-1.5 rounded-lg shadow-md shadow-indigo-100",
  logoText: "font-black text-slate-800 tracking-tighter text-lg hidden md:block",
  
  // Search
  searchWrapper: "relative flex-1 max-w-md",
  searchIcon: "absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400",
  searchInput: "w-full bg-slate-100 border-none rounded-2xl py-2.5 px-12 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium",
  
  // Actions
  actionContainer: "flex items-center gap-6 ml-8",
  accountLink: "text-sm font-bold text-slate-600 hover:text-indigo-600 transition flex items-center gap-2",
  notificationBadge: "absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white",
  
  // Navigation
  navSection: "bg-white border-b border-slate-100 px-8 py-3 overflow-x-auto no-scrollbar",
  navContainer: "flex gap-3 max-w-7xl mx-auto",
  navPillBase: "flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all",
  navPillActive: "bg-indigo-600 text-white shadow-lg shadow-indigo-100",
  navPillInactive: "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600",
  
  // Quick Actions
  actionGrid: "flex flex-wrap gap-4 mb-8",
  actionBtn: "flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 text-xs font-black text-slate-700 uppercase tracking-widest hover:border-indigo-300 hover:shadow-sm transition-all shadow-sm",
  actionIcon: "text-indigo-600"

};
