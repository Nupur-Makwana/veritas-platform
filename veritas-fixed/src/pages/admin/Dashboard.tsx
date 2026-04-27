import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, BarChart3, Users, AlertCircle, Search, Filter, ShieldAlert, 
  CheckCircle2, ChevronRight, LogOut, Map as MapIcon, Menu, X, 
  TrendingUp, Activity, Inbox, Info, Cpu, MousePointer2, Landmark, 
  Navigation, Sparkles, TrendingUp as TrendingUpIcon, ChevronRight as ChevronRightIcon,
  Loader2, Globe, MapPin, Inbox as InboxIcon, ListChecks
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { toast } from 'sonner';
import { useMockStore } from '../../lib/mockStore';
import ProfileModal from '../../components/ProfileModal';
import SurgeDetailModal from '../../components/SurgeDetailModal';

type View = 'dashboard' | 'complaints' | 'urgent' | 'scam' | 'map' | 'workforce';

export default function AdminDashboard() {
  const { complaints, workers, profile, logout, t } = useMockStore();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSurgeOpen, setIsSurgeOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = {
    total: complaints.length,
    urgent: complaints.filter(c => c.severity === 'high' || c.severity === 'critical').length,
    fake: complaints.filter(c => c.fakeScore > 0.6).length,
    solved: complaints.filter(c => c.status === 'solved').length,
    scamArchived: 42, // mock
    activeWorkers: workers.filter(w => w.status === 'assigned').length,
    freeWorkers: workers.filter(w => w.status === 'free').length
  };

  const getFilteredComplaints = () => {
    if (activeView === 'urgent') return complaints.filter(c => c.severity === 'high' || c.severity === 'critical');
    if (activeView === 'scam') return complaints.filter(c => c.fakeScore > 0.6);
    return complaints;
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <AnalyticsView stats={stats} complaints={complaints} workers={workers} navigate={navigate} setActiveView={setActiveView} onOpenSurge={() => setIsSurgeOpen(true)} />;
      case 'complaints':
      case 'urgent':
      case 'scam':
        return <ComplaintsTableView complaints={getFilteredComplaints()} title={t(activeView as any) || activeView} navigate={navigate} />;
      case 'map':
        return <TacticalMapView complaints={complaints} />;
      case 'workforce':
        return <WorkforceView workers={workers} complaints={complaints} navigate={navigate} />;
      case 'social':
        return <div className="flex items-center justify-center h-[60vh]"><button onClick={() => navigate('/social-buster')} className="btn-primary px-12 py-6 text-xl">Open Social Buster Monitor</button></div>;
      default:
        return null;
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: t('analytics') },
    { id: 'complaints', icon: Inbox, label: t('complaintBox') },
    { id: 'urgent', icon: AlertCircle, label: t('urgent'), count: stats.urgent },
    { id: 'scam', icon: ShieldAlert, label: t('scam'), count: stats.fake },
    { id: 'social', icon: Flame, label: t('socialBuster') },
    { id: 'map', icon: MapIcon, label: t('map') },
    { id: 'workforce', icon: Users, label: t('workforceHub') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Mobile Top Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-[100] sticky top-0 text-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/40">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">VERITAS</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             Central Node Active
           </div>
           <button 
             onClick={() => setIsProfileOpen(true)}
             className="w-10 h-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center font-black text-primary shadow-sm hover:border-primary/50 transition-all active:scale-95"
           >
             {profile?.name?.charAt(0) || 'AC'}
           </button>
        </div>
      </header>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        profile={profile} 
        onLogout={handleLogout} 
      />

      <SurgeDetailModal 
        isOpen={isSurgeOpen} 
        onClose={() => setIsSurgeOpen(false)} 
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar / Drawer */}
        <aside className={`
          fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-2 z-[90] transition-transform duration-300 lg:sticky lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Command Structure</div>
          <div className="flex flex-col gap-2">
            {menuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as View);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group ${activeView === item.id ? 'bg-primary text-white shadow-xl shadow-orange-200' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} /> 
                {item.label}
                {item.count !== undefined && item.count > 0 && (
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-lg font-black ${activeView === item.id ? 'bg-white/20 text-white' : 'bg-orange-50 text-primary border border-orange-100'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4">
             <div className="p-5 bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Cpu className="w-16 h-16 text-white" />
                </div>
                <div className="text-[10px] font-black text-primary mb-1 uppercase tracking-widest">AI Controller</div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-bold">Autopilot managing 82% of dispatch load.</p>
             </div>
             <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3.5 w-full text-slate-500 hover:text-primary rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                <LogOut className="w-5 h-5 text-slate-400" /> {t('logout')}
             </button>
          </div>
        </aside>


        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-[80] lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto w-full">
           <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
           </div>
        </main>
      </div>
    </div>
  );
}

// Sub-components for better organization

function AnalyticsView({ stats, complaints, workers, navigate, setActiveView, onOpenSurge }: { stats: any, complaints: any[], workers: any[], navigate: any, setActiveView: (view: View) => void, onOpenSurge: () => void }) {
  const { t } = useMockStore();
  const chartData = useMemo(() => {
    // Group incidents by day for the last 7 days
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return days.map(day => ({
      name: day,
      infra: Math.floor(Math.random() * 20) + 5,
      water: Math.floor(Math.random() * 15) + 3,
      power: Math.floor(Math.random() * 10) + 2,
    }));
  }, []);

  const alerts = useMemo(() => {
    return complaints.slice(0, 3).map((c, i) => ({
      msg: `${c.title.substring(0, 30)}${c.title.length > 30 ? '...' : ''} in ${c.block || 'Local Node'}`,
      time: i === 0 ? 'Just now' : i === 1 ? '12m ago' : '45m ago',
      priority: c.severity === 'critical' ? 'critical' : 'high'
    }));
  }, [complaints]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
         <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{t('strategicIntelligence')}</h1>
         <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">{t('realTimeAnalytics')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('incidentVolume'), value: stats.total, sub: '+12% Trend', icon: Activity, color: 'text-primary' },
          { label: t('securityClearance'), value: '99.1%', sub: 'DigiLocker Auth', icon: Cpu, color: 'text-emerald-500' },
          { label: t('fieldCapacity'), value: `${Math.round((stats.activeWorkers / (workers.length || 1)) * 100)}%`, sub: `${stats.activeWorkers} Units Deployed`, icon: Users, color: 'text-orange-500' },
          { label: t('resolutionTTL'), value: '4.2h', sub: 'Optimal Range', icon: TrendingUp, color: 'text-indigo-500' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col gap-4">
             <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <item.icon className={`w-5 h-5 ${item.color}`} />
             </div>
             <div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                <div className="text-2xl font-black text-slate-900 tracking-tighter">{item.value}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase mt-1 flex items-center gap-1.5">
                   <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                   {item.sub}
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Real Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/30 min-h-[400px] flex flex-col gap-5">
            <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Incident Frequency Map (Past 7 Days)</h3>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase text-primary font-bold"><span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span> Infra</div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase text-[#3b82f6] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span> Water</div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase text-[#10b981] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> Power</div>
               </div>
            </div>
            
            <div className="flex-1 w-full h-[280px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="infra" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorInfra)" />
                    <Area type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={4} fill="transparent" />
                    <Area type="monotone" dataKey="power" stroke="#10b981" strokeWidth={4} fill="transparent" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl flex flex-col gap-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('intelligenceAlerts')}</h3>
            <div className="flex flex-col gap-5">
               {alerts.map((alert, i) => (
                 <div key={i} className="flex gap-3 cursor-pointer group" onClick={() => setActiveView('complaints')}>
                    <div className={`w-0.5 h-8 rounded-full shrink-0 group-hover:h-10 transition-all ${alert.priority === 'critical' ? 'bg-red-500' : 'bg-primary'}`}></div>
                    <div className="flex flex-col">
                       <p className="text-[11px] font-bold leading-tight group-hover:text-primary transition-colors">{alert.msg}</p>
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-1">{alert.time}</span>
                    </div>
                 </div>
               ))}
            </div>
            <button 
              onClick={() => setActiveView('complaints')}
              className="mt-auto w-full py-3 bg-slate-800 rounded-xl font-black text-[9px] uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all text-slate-400"
            >
              {t('viewEventLogs')}
            </button>
         </div>
      </div>

      {/* Heatmap & Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
         <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/30 flex flex-col gap-6 font-sans">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">{t('localHeatmap')}</h3>
                  <p className="text-xl font-black text-slate-900 tracking-tighter mt-1">Intelligence Concentrates</p>
               </div>
               <button 
                  onClick={() => setActiveView('map')}
                  className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900 hover:bg-primary hover:text-white transition-all active:scale-95"
               >
                  <Navigation className="w-5 h-5" />
               </button>
            </div>

            <div className="space-y-4">
               {[
                 { zone: 'HSR Layout Sector 4', intensity: 85, color: 'bg-red-500', label: 'CRITICAL: Water Infrastructure' },
                 { zone: 'Indiranagar Block A', intensity: 62, color: 'bg-orange-500', label: 'HIGH: Illegal Waste' },
                 { zone: 'Whitefield Zone 2', intensity: 45, color: 'bg-amber-500', label: 'MODERATE: Power Grid' },
                 { zone: 'Koramangala 8th Block', intensity: 30, color: 'bg-emerald-500', label: 'STABLE: Road Works' },
               ].map((zone, i) => (
                 <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-500">{zone.zone}</span>
                       <span className="text-slate-900 font-bold">{zone.intensity}% Concentrated</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full ${zone.color}`} style={{ width: `${zone.intensity}%` }} />
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 italic">{zone.label}</div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/30 flex flex-col gap-6 font-sans">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">{t('aiTrendInsights')}</h3>
                  <p className="text-xl font-black text-slate-900 tracking-tighter mt-1">{t('problemEvolutionHub')}</p>
               </div>
               <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
               </div>
            </div>

            <div className="p-6 bg-slate-950 rounded-[2rem] text-white space-y-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp className="w-16 h-16" />
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Neural Prediction Ready</span>
               </div>
               <h4 className="text-lg font-black leading-tight">Predicted Surge: Drainage Failure (East Zone)</h4>
               <p className="text-slate-400 text-xs font-medium leading-relaxed">
                  Based on historical data and current moisture sensors, Team Veritas predicts a 25% increase in reports for Sector 12 over the next 48 hours.
               </p>
               <div className="flex items-center justify-between mt-4">
                  <button 
                    onClick={onOpenSurge}
                    className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                  >
                     View Logic Briefing <ChevronRight className="w-3 h-3" />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Community Pulse</div>
                  <div className="text-lg font-black text-slate-900">Highly Optimistic</div>
               </div>
               <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Worker Matching</div>
                  <div className="text-lg font-black text-slate-900">Neural Dispatch</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function ComplaintsTableView({ complaints, title, navigate }: { complaints: any[], title: string, navigate: any }) {
  const { t } = useMockStore();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const ministries = ['All', 'Ministry of Infrastructure', 'Ministry of Power', 'Ministry of Water', 'Ministry of Environment', 'Ministry of Urban Development'];

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const matchesFilter = filter === 'All' || c.category === filter;
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.trackId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.address?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [complaints, filter, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter capitalize">{title}</h1>
        <div className="flex-1 max-w-xl relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
           <input 
              className="input-field pl-14 h-16 shadow-2xl shadow-slate-200/50" 
              placeholder={t('scanRecords')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
         {ministries.map(m => (
           <button 
             key={m}
             onClick={() => setFilter(m)}
             className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-2 ${filter === m ? 'bg-primary border-primary text-white shadow-xl shadow-orange-100' : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200 hover:text-primary'}`}
           >
              {m}
           </button>
         ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
         <div className="overflow-x-auto">
            <table className="w-full border-collapse">
               <thead>
                  <tr className="border-b border-slate-100 text-left text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                     <th className="px-6 py-4">{t('incidentData')}</th>
                     <th className="px-6 py-4">{t('ministryDept')}</th>
                     <th className="px-6 py-4">{t('tacticalLocation')}</th>
                     <th className="px-6 py-4">{t('aiAudit')}</th>
                     <th className="px-6 py-4">{t('status')}</th>
                     <th className="px-6 py-4"></th>
                  </tr>
               </thead>
               <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="py-24 text-center font-black text-slate-300 uppercase tracking-widest italic">No matching reports in sector files.</td></tr>
                  ) : (
                    filtered.map(c => (
                      <tr key={c.id} onClick={() => navigate(`/admin/complaint/${c.id}`)} className="border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group last:border-0">
                        <td className="px-8 py-6">
                           <div className="font-black text-slate-900 group-hover:text-primary transition-colors text-sm uppercase tracking-tight">{c.title}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">ID: {c.trackId}</div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit uppercase tracking-tighter">
                              <Landmark className="w-3 h-3 text-primary" />
                              {c.category}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="text-xs font-bold text-slate-700">{c.address || 'Location Hidden'}</div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.block || 'Zone - 1'}</div>
                        </td>
                        <td className="px-8 py-6">
                           <div className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border flex items-center gap-2 w-fit ${c.fakeScore > 0.6 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                              {c.fakeScore > 0.6 ? <AlertCircle className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                              Valid: {Math.round((1 - c.fakeScore) * 100)}%
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest border shadow-sm ${
                              c.status === 'solved' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 
                              (c.status === 'under_process' ? 'bg-orange-100 border-orange-200 text-primary' : 'bg-slate-100 border-slate-200 text-slate-500')
                           }`}>
                              {c.status.replace('_', ' ')}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all inline-block" />
                        </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function TacticalMapView({ complaints }: { complaints: any[] }) {
  const { workers } = useMockStore();
  const [mapFilter, setMapFilter] = useState<'all' | 'complaints' | 'workers'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate data aggregation
    setTimeout(() => {
      setIsExporting(false);
      const blob = new Blob([JSON.stringify({ complaints, workers, timestamp: new Date().toISOString() })], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VERITAS_MATRIX_${Date.now()}.json`;
      a.click();
      
      toast.success('MATRIX EXPORTED', {
        description: 'Intelligence ledger synchronized and downloaded.',
      });
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-8 h-full min-h-[700px]">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Tactical Intelligence</h1>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">India • Delhi NCR Sector Mapping</p>
         </div>
         <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm relative z-30">
            {[
              { id: 'all', label: 'Global View' },
              { id: 'complaints', label: 'Issues' },
              { id: 'workers', label: 'Units' }
            ].map(f => (
              <button 
                key={f.id}
                onClick={() => setMapFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mapFilter === f.id ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-primary'}`}
              >
                {f.label}
              </button>
            ))}
         </div>
      </div>

      <div className="flex-1 bg-white rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden group border-2">
         {/* Focus on Detailed Sector Map of India/Delhi */}
         <div className="absolute inset-0 bg-[#0f172a] flex items-center justify-center">
            <div className="absolute inset-0">
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(1.1) contrast(1.2) grayscale(0.2)' }}
                    loading="lazy"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=77.0,28.4,77.5,28.8&layer=mapnik"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none bg-slate-950/20" />
            </div>

            {/* Realistic Topography Layers Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1000 1000">
               {/* Disticts / Sectors */}
               <path d="M0,300 Q250,280 500,300 T1000,280" fill="transparent" stroke="rgba(249,115,22,0.15)" strokeWidth="2" />
               <path d="M300,0 Q320,500 300,1000" fill="transparent" stroke="rgba(249,115,22,0.15)" strokeWidth="2" />
               
               {/* Buildings / High Density Zones (White Rects) */}
               {[...Array(60)].map((_, i) => (
                  <rect 
                    key={`b-${i}`} 
                    x={(i * 157) % 950 + 20} 
                    y={(i * 223) % 950 + 20} 
                    width={5 + (i%5)} 
                    height={5 + (i%8)} 
                    fill="rgba(255,255,255,0.1)" 
                  />
               ))}

               {/* Parks / Greenery Zones (Green blobs) */}
               {[...Array(12)].map((_, i) => (
                  <circle 
                    key={`p-${i}`} 
                    cx={(i * 311) % 900 + 50} 
                    cy={(i * 419) % 900 + 50} 
                    r={20 + (i%30)} 
                    fill="rgba(16,185,129,0.08)" 
                  />
               ))}

               {/* Scanning Overlay */}
               <defs>
                  <linearGradient id="scanLines" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor="transparent" />
                     <stop offset="50%" stopColor="rgba(249,115,22,0.05)" />
                     <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
               </defs>
               <rect x="0" y="0" width="1000" height="1000" fill="url(#scanLines)">
                  <animate attributeName="y" from="-1000" to="1000" dur="4s" repeatCount="indefinite" />
               </rect>
               
               {/* Sector Labels */}
               <text x="100" y="250" fill="rgba(255,255,255,0.2)" className="text-[10px] font-black uppercase tracking-widest">Sector Alpha (N-Delhi)</text>
               <text x="600" y="450" fill="rgba(255,255,255,0.2)" className="text-[10px] font-black uppercase tracking-widest">Sector Beta (Central)</text>
               <text x="300" y="850" fill="rgba(255,255,255,0.2)" className="text-[10px] font-black uppercase tracking-widest">Logistics Hub (South)</text>
            </svg>
         </div>
         
         {/* Interactive HUD Elements */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Dynamic Event Pins - Complaints */}
            {(mapFilter === 'all' || mapFilter === 'complaints') && complaints.filter(c => c.status !== 'solved').map((c, i) => (
               <div 
                  key={`comp-${c.id}`} 
                  className="absolute animate-bounce pointer-events-auto transform transition-all hover:scale-150 z-20"
                  style={{ 
                     top: `${20 + (i * 157)%60}%`, 
                     left: `${15 + (i * 223)%70}%` 
                  }}
               >
                  <div className={`w-10 h-10 ${c.severity === 'critical' ? 'bg-red-500 shadow-red-500/50' : 'bg-orange-500 shadow-orange-500/50'} rounded-2xl flex items-center justify-center text-white shadow-2xl border-2 border-white cursor-pointer group/pin`}>
                     <AlertCircle className="w-5 h-5" />
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-950 text-white p-4 rounded-2xl opacity-0 group-hover/pin:opacity-100 transition-all whitespace-nowrap min-w-[180px] border border-white/20 shadow-2xl scale-75 group-hover/pin:scale-100 origin-bottom pointer-events-none">
                        <div className="text-[10px] font-black text-primary uppercase mb-1 tracking-widest">LOGGED: {c.trackId}</div>
                        <div className="text-sm font-black uppercase mb-1 tracking-tight">{c.title}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">{c.address}</div>
                        <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
                           <span className="text-[8px] font-black uppercase text-emerald-400">Verified</span>
                           <span className="text-[8px] font-black uppercase text-primary">Critical Priority</span>
                        </div>
                     </div>
                  </div>
                  <div className={`w-10 h-10 absolute inset-0 ${c.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'} rounded-2xl animate-ping opacity-40 -z-10`} />
               </div>
            ))}

            {/* Dynamic Worker Pins */}
            {(mapFilter === 'all' || mapFilter === 'workers') && workers.map((w, i) => (
               <div 
                  key={`worker-${w.id}`} 
                  className="absolute pointer-events-auto z-10"
                  style={{ 
                     top: `${35 + (i * 89)%50}%`, 
                     left: `${25 + (i * 311)%60}%` 
                  }}
               >
                  <div className={`w-12 h-12 ${w.status === 'assigned' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-slate-700 shadow-slate-900/50'} rounded-[1.5rem] flex flex-col items-center justify-center text-white shadow-2xl border-2 border-white cursor-pointer transition-all hover:scale-110 group/work relative`}>
                     <Users className="w-6 h-6" />
                     {w.status === 'assigned' && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-2 py-0.5 rounded shadow text-[8px] font-black uppercase whitespace-nowrap">
                           {w.name}
                        </div>
                     )}
                     <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-slate-950 text-white p-4 rounded-2xl opacity-0 group-hover/work:opacity-100 transition-all whitespace-nowrap min-w-[160px] border border-white/20 shadow-2xl scale-75 group-hover/work:scale-100 origin-top pointer-events-none">
                        <div className="text-[10px] font-black text-emerald-400 uppercase mb-1 tracking-widest">{w.department}</div>
                        <div className="text-sm font-black uppercase mb-1 tracking-tight">{w.name}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${w.status === 'assigned' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                           Status: {w.status}
                        </div>
                     </div>
                  </div>
                  {w.status === 'assigned' && <div className="w-12 h-12 absolute inset-0 bg-emerald-500 rounded-[1.5rem] animate-ping opacity-20 -z-10" />}
               </div>
            ))}
         </div>
         
         {/* Export Overlay */}
         <AnimatePresence>
            {isExporting && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center"
               >
                  <div className="flex flex-col items-center gap-6">
                     <div className="relative">
                        <Loader2 className="w-20 h-20 text-primary animate-spin" />
                        <Activity className="w-8 h-8 text-white absolute inset-0 m-auto animate-pulse" />
                     </div>
                     <div className="text-center">
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Exporting Matrix</h3>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-3">Synthesizing Tactical Data...</p>
                     </div>
                     <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ x: "-100%" }}
                           animate={{ x: "0%" }}
                           transition={{ duration: 2.5, ease: "linear" }}
                           className="h-full bg-primary"
                        />
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Map Widgets */}
         <div className="absolute inset-x-8 top-8 pointer-events-none flex justify-between h-fit">
            <div className="bg-slate-950/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 text-white shadow-2xl pointer-events-auto flex flex-col gap-4 max-w-[240px]">
               <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Regional Dashboard</h4>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center group cursor-pointer">
                     <span className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-white transition-colors">Old Delhi</span> 
                     <span className="text-[10px] font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-lg">94% OPTIMAL</span>
                  </div>
                  <div className="flex justify-between items-center group cursor-pointer">
                     <span className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-white transition-colors">Connaught Place</span> 
                     <span className="text-[10px] font-black text-orange-400 px-2 py-0.5 bg-orange-500/10 rounded-lg">82% CAPACITY</span>
                  </div>
                  <div className="flex justify-between items-center group cursor-pointer">
                     <span className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-white transition-colors">Dwarka Hub</span> 
                     <span className="text-[10px] font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-lg">100% ONLINE</span>
                  </div>
               </div>
               <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                  <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Active Units</div>
                  <div className="flex items-center gap-1">
                     {[...Array(8)].map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 6 ? 'bg-primary' : 'bg-slate-800'}`} />
                     ))}
                  </div>
               </div>
            </div>
            
            <div className="pointer-events-auto flex flex-col gap-3 relative">
               <button title="Drone Sync" className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"><Cpu className="w-6 h-6" /></button>
               
               <div className="relative">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    title="Region Filter" 
                    className={`w-14 h-14 backdrop-blur-md rounded-2xl shadow-xl border flex items-center justify-center transition-all ${showFilters ? 'bg-primary border-primary text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-slate-900'}`}
                  >
                    <Filter className="w-6 h-6" />
                  </button>

                  <AnimatePresence>
                    {showFilters && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: -40, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        className="absolute right-full top-0 mr-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-2xl flex flex-col gap-1 min-w-[180px] z-[60]"
                      >
                         <button 
                           onClick={() => { setMapFilter('all'); setShowFilters(false); }}
                           className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${mapFilter === 'all' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                         >
                            <span className="text-[10px] font-black uppercase tracking-widest">Show All</span>
                            <Globe className="w-3 h-3" />
                         </button>
                         <button 
                           onClick={() => { setMapFilter('workers'); setShowFilters(false); }}
                           className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${mapFilter === 'workers' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                         >
                            <span className="text-[10px] font-black uppercase tracking-widest">Filter by Team</span>
                            <Users className="w-3 h-3" />
                         </button>
                         <button 
                           onClick={() => { setMapFilter('complaints'); setShowFilters(false); }}
                           className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${mapFilter === 'complaints' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                         >
                            <span className="text-[10px] font-black uppercase tracking-widest">Filter by Complaint</span>
                            <AlertCircle className="w-3 h-3" />
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               <button title="Pointer Link" className="w-14 h-14 bg-primary rounded-2xl shadow-xl text-white flex items-center justify-center active:scale-95 hover:shadow-orange-500/50 transition-all"><MousePointer2 className="w-6 h-6" /></button>
            </div>
         </div>          <div className="absolute bottom-6 inset-x-6 pointer-events-none flex justify-center">
            <div className="bg-slate-950/90 backdrop-blur-xl p-5 rounded-3xl border border-white/20 text-white shadow-2xl pointer-events-auto flex items-center gap-8 min-w-[500px]">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                     <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Delhi Telemetry</span>
                     <span className="text-xs font-black text-white uppercase tracking-[0.1em]">NCR - Tactical Corridor</span>
                  </div>
               </div>
               
               <div className="h-8 w-px bg-slate-800" />
               
               <div className="flex-1 flex justify-around items-center">
                  <div className="flex flex-col items-center">
                     <span className="text-[9px] font-black text-emerald-500">{workers.length} Units</span>
                     <span className="text-[7px] font-bold text-slate-500 uppercase">Synchronized</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-[9px] font-black text-orange-500">{complaints.filter(c => c.severity === 'critical').length} Active</span>
                     <span className="text-[7px] font-bold text-slate-500 uppercase">High Priority</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-[9px] font-black text-slate-300">12.5k Nodes</span>
                     <span className="text-[7px] font-bold text-slate-500 uppercase">IOT Verified</span>
                  </div>
               </div>

               <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAudit(true)}
                    className="px-4 py-2 bg-slate-800 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    Audit Flow
                  </button>
                  <button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="px-4 py-2 bg-primary rounded-xl text-[8px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center gap-2"
                  >
                    {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    Export Matrix
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Audit Flow Modal */}
      <AnimatePresence>
        {showAudit && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-xl rounded-3xl p-8 relative overflow-hidden flex flex-col gap-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-slate-900">System Audit Flow</h2>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest tracking-[0.2em]">Verified Event Logs</p>
                </div>
                <button onClick={() => setShowAudit(false)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {complaints.slice(0, 10).map((c, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/30 transition-all">
                    <div className="text-[10px] font-black text-slate-400 font-mono mt-1 w-10">
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center justify-between">
                         <div className="text-xs font-black uppercase text-slate-900">{c.category} ESCALATION</div>
                         <div className={`text-[8px] font-black px-2 py-0.5 rounded-lg border ${c.status === 'solved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-primary border-orange-100'}`}>
                            {c.status.toUpperCase()}
                         </div>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium leading-relaxed">
                         Complaint <span className="font-bold text-slate-700">#{c.trackId}</span> registered by citizen in {c.block || 'Central Zone'}. Telemetry suggests {c.severity} priority.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkforceView({ workers, complaints, navigate }: { workers: any[], complaints: any[], navigate: any }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
         <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Field Workforce Hub</h1>
         <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Unit Readiness & Mission Sync</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map(w => {
           const currentTask = complaints.find(c => c.workerId === w.id && ['under_process', 'reported'].includes(c.status));
           return (
             <div key={w.id} className="bg-white rounded-3xl p-6 mt-4 border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col gap-6 relative overflow-hidden transition-all hover:border-primary/30">
                <div className="flex items-start justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-lg shadow-lg border border-white/10">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                         <div className="font-black text-xs uppercase tracking-tight text-slate-900">{w.name}</div>
                         <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{w.department}</div>
                      </div>
                   </div>
                   <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${w.status === 'free' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-orange-50 border-orange-100 text-primary animate-pulse'}`}>
                      {w.status}
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 border-b border-slate-50 pb-1">Active Assignment</div>
                   {w.status === 'assigned' && currentTask ? (
                     <div className="flex flex-col gap-2">
                        <div className="flex items-start gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0"></div>
                           <div>
                              <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-tight">{currentTask.title}</div>
                              <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Assignment: <span className="text-primary font-black">{currentTask.assignmentType || 'MANUAL'}</span></div>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 ml-5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                           <MapIcon className="w-3 h-3" /> {currentTask.address?.substring(0, 20)}...
                        </div>
                     </div>
                   ) : (
                     <p className="text-[10px] text-slate-300 font-bold italic uppercase">Awaiting tactical mission profile.</p>
                   )}
                </div>

                <div className="mt-auto pt-2 flex gap-2">
                   <button 
                      onClick={() => navigate(`/admin/workforce/profile/${w.id}`)}
                      className="flex-1 py-2.5 bg-slate-50 border border-slate-100 rounded-lg font-black text-[9px] text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all"
                   >
                      Profile
                   </button>
                   <button 
                      onClick={() => navigate(`/admin/workforce/reroute/${w.id}`)}
                      className="flex-1 py-2.5 bg-primary/5 border border-primary/10 rounded-lg font-black text-[9px] text-primary uppercase tracking-widest hover:bg-primary/10 transition-all font-sans"
                   >
                      Re-route
                   </button>
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}

