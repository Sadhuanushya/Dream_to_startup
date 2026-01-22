// Dashboard Page Styles
export const dashboardStyles = {
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
  actionIcon: "text-indigo-600",
};
