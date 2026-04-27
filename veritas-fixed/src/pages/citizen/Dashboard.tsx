import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Flame, Plus, FileText, CheckCircle2, Clock, AlertTriangle, ChevronRight, LogOut, User } from 'lucide-react';
import { useMockStore } from '../../lib/mockStore';
import ProfileModal from '../../components/ProfileModal';

export default function CitizenDashboard() {
  const { profile, complaints, logout } = useMockStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const citizenComplaints = complaints.filter(c => c.citizenId === profile?.uid);
  
  const stats = {
    total: citizenComplaints.length,
    pending: citizenComplaints.filter(d => d.status !== 'solved').length,
    solved: citizenComplaints.filter(d => d.status === 'solved').length
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const { t } = useMockStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-orange-100">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-secondary uppercase">VERITAS</span>
          <span className="ml-4 text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded uppercase tracking-wider">Citizen Node</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Verified: DigiLocker
          </div>
          <button onClick={handleLogout} title={t('logout')} className="text-slate-400 hover:text-primary transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-10 h-10 bg-slate-100 border-2 border-white ring-1 ring-slate-200 rounded-full flex items-center justify-center font-bold text-primary hover:scale-105 active:scale-95 transition-all"
          >
            {profile?.name?.charAt(0)}
          </button>
        </div>
      </header>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        profile={profile} 
        onLogout={handleLogout} 
      />

      <main className="max-w-6xl mx-auto w-full p-6 flex flex-col gap-10">
        {/* Welcome Section */}
        <section className="mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Authenticated User Session</div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">{t('welcome')}, {profile?.name?.split(' ')[0]}.</h1>
              <p className="text-slate-500 font-medium mt-1 text-sm">{t('citizenDesc')}</p>
            </div>
            <button 
              onClick={() => navigate('/citizen/file')}
              className="btn-primary px-6 py-3 shadow-xl shadow-orange-200 text-base flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> {t('reportIncident')}
            </button>
          </div>
        </section>

        {/* Intelligence Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('submissions'), val: stats.total, icon: FileText, color: 'text-slate-400', bg: 'bg-white' },
            { label: t('inProgress'), val: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-white' },
            { label: t('solved'), val: stats.solved, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-white' },
            { label: t('verifiedStatus'), val: 'Active', icon: User, color: 'text-primary', bg: 'bg-orange-50' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 group hover:border-primary transition-colors`}>
              <div className={`p-2 w-fit rounded-lg bg-slate-50 ${s.color} border border-slate-100`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{s.val}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Recent Submissions Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                 {t('recentReports')}
                 <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{citizenComplaints.length}</span>
              </h2>
              <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">{t('downloadReport')}</button>
            </div>

            <div className="space-y-4">
              {citizenComplaints.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <FileText className="w-8 h-8" />
                   </div>
                   <p className="text-slate-400 font-bold">No complaints reported yet.</p>
                   <button onClick={() => navigate('/citizen/file')} className="mt-4 text-primary font-bold hover:underline">{t('reportIssueNow')}</button>
                </div>
              ) : (
                citizenComplaints.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => navigate(`/citizen/track/${c.id}`)}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:border-primary transition-all group relative overflow-hidden"
                  >
                     <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.status === 'solved' ? 'bg-emerald-500' : 'bg-primary'}`} />
                     <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center border border-slate-100 ${c.status === 'solved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                           <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                           <div className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors text-sm uppercase tracking-tight">{c.title}</div>
                           <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1 font-medium">
                              <span className="flex items-center gap-1 font-bold text-slate-600 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded">ID: {c.trackId}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(c.createdAt).toLocaleDateString()}</span>
                              <span className={`capitalize font-bold ${c.status === 'solved' ? 'text-emerald-600' : 'text-primary'}`}>{c.status?.replace('_', ' ')}</span>
                           </div>
                        </div>
                     </div>
                     <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Side Panels */}
          <div className="flex flex-col gap-6">
             {/* Info Tip */}
             <div className="p-6 bg-secondary text-white rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                   <Flame className="w-32 h-32 -mb-8 -mr-8" />
                </div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em]">{t('platformAwareness')}</div>
                <h3 className="text-xl font-bold leading-tight">AI Classification works with real evidence.</h3>
                <p className="text-slate-300 text-sm font-medium leading-relaxed">
                  Uploading clear photos or videos increases the probability of immediate worker dispatch by 40%.
                </p>
             </div>

             {/* Social Buster Entry Point */}
             <div 
                onClick={() => navigate('/social-buster')}
                className="p-6 bg-slate-900 border border-primary/20 rounded-2xl space-y-4 shadow-2xl relative overflow-hidden group cursor-pointer"
             >
                 <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Flame className="w-8 h-8 text-primary" />
                 </div>
                 <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Community Accountability</h4>
                    <h3 className="text-lg font-black text-white tracking-tight">{t('socialBuster')} Feed</h3>
                 </div>
                 <p className="text-slate-400 text-xs font-medium leading-tight">Monitor real-time community pressure and public failure reports tracking against the ministry.</p>
                 <button className="text-[9px] font-black uppercase text-primary tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform text-white">
                    Access Monitor Hub <ChevronRight className="w-3 h-3" />
                 </button>
             </div>

             {/* Transparency Panel */}
             <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">{t('systemLogs')}</h4>
                   <span className="text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded">Operational</span>
                </div>

                <div className="space-y-3">
                   {[
                     { msg: 'Report #AG-102 assigned to Field Worker', time: '12m ago' },
                     { msg: 'AI Confidence check passed for Bangalore North', time: '1h ago' },
                     { msg: 'Social Buster triggered for Sewer Leakage', time: '3h ago' },
                   ].map((log, i) => (
                     <div key={i} className="text-[11px] font-medium text-slate-500 border-l border-slate-100 pl-3">
                        <div className="text-slate-800">{log.msg}</div>
                        <div className="text-[9px] mt-0.5">{log.time}</div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="h-8 bg-slate-900 text-white flex items-center px-6 text-[10px] justify-between shrink-0 mt-auto">
        <div className="flex gap-4">
          <span>AI Engine: v4.2.0-Fire</span>
          <span className="text-slate-500">|</span>
          <span>Verified Node: {profile?.uid}</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Public Resolution: Efficient</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Security: DigiLocker Encrypted</span>
        </div>
      </footer>
    </div>
  );
}
