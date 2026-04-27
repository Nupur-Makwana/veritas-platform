import { useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Flame, Briefcase, MapPin, CheckCircle2, LogOut, Clock, Navigation, RefreshCw, Layers, History, Loader2, ExternalLink, X } from 'lucide-react';
import { useMockStore, Complaint } from '../../lib/mockStore';
import ProfileModal from '../../components/ProfileModal';

export default function WorkerDashboard() {
  const { profile, complaints, updateComplaint, logout, t } = useMockStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab ] = useState<'queue' | 'map' | 'history'>('queue');
  const [syncing, setSyncing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Complaint | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const tasks = complaints.filter(c => 
    (c.workerId === profile?.uid || c.workerId === 'worker_1') && 
    ['under_process', 'reported'].includes(c.status)
  );

  const resolvedTasks = complaints.filter(c => 
    (c.workerId === profile?.uid || c.workerId === 'worker_1') && 
    c.status === 'solved'
  );

  const handleResolve = async (id: string, e?: MouseEvent) => {
    e?.stopPropagation();
    await updateComplaint(id, { status: 'solved' });
    if (selectedTask?.id === id) setSelectedTask(null);
  };

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    setSyncing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-32">
      {/* Mobile-focused Nav */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-orange-100 font-black text-white">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-secondary leading-none block uppercase">VERITAS</span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t('worker')}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      <main className="flex-1 p-6 flex flex-col gap-8 max-w-[600px] mx-auto w-full">
         {/* Detail Modal */}
         <AnimatePresence>
            {selectedTask && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center"
               >
                  <motion.div 
                     initial={{ y: "100%" }}
                     animate={{ y: 0 }}
                     exit={{ y: "100%" }}
                     className="bg-white w-full max-w-xl rounded-t-[3rem] sm:rounded-[3.5rem] overflow-hidden flex flex-col max-h-[90vh]"
                  >
                     <div className="relative h-64 bg-slate-100 shrink-0">
                        <img 
                           src={selectedTask.imageUrl} 
                           className="w-full h-full object-cover" 
                           referrerPolicy="no-referrer"
                           alt="Incident Evidence" 
                        />
                        <button 
                           onClick={() => setSelectedTask(null)}
                           className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl"
                        >
                           <X className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-6 left-6 flex gap-2">
                           <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">Evidence Captured</span>
                        </div>
                     </div>

                     <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-8">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{selectedTask.category}</span>
                              <div className="flex items-center gap-1">
                                 <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">In Pursuit</span>
                              </div>
                           </div>
                           <h2 className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tight">{selectedTask.title}</h2>
                           <div className="flex gap-2">
                              <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">ID: {selectedTask.trackId}</span>
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${selectedTask.severity === 'critical' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                                 {selectedTask.severity} PRIORITY
                              </span>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-4">
                              <div className="flex items-start gap-4">
                                 <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">{selectedTask.address || 'Street Node Sector 4'}</span>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">{selectedTask.block || 'Zone Center'}</span>
                                 </div>
                              </div>
                              <div className="flex items-start gap-4 border-t border-slate-200/50 pt-4">
                                 <Clock className="w-6 h-6 text-slate-300 shrink-0 mt-1" />
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">Deployment Required ASAP</span>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Logged {new Date(selectedTask.createdAt).toLocaleString()}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">AI Briefing Memo</h4>
                              <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{selectedTask.aiSummary || selectedTask.summary}</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                           <button 
                              onClick={() => setSelectedTask(null)}
                              className="py-5 bg-slate-100 rounded-3xl text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors"
                           >
                              Return
                           </button>
                           <button 
                              onClick={() => handleResolve(selectedTask.id)}
                              className="py-5 bg-primary rounded-3xl text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-950/20 active:scale-95 transition-all"
                           >
                              Mark Solved
                           </button>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40">
              <div className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Queue Size</div>
              <div className="text-2xl font-black text-slate-900">{tasks.length}</div>
            </div>
            <div className={`p-4 rounded-2xl border shadow-xl transition-all ${tasks.length > 0 ? 'bg-orange-50 border-orange-100 shadow-orange-100' : 'bg-emerald-50 border-emerald-100 shadow-emerald-100'}`}>
              <div className={`${tasks.length > 0 ? 'text-orange-800' : 'text-emerald-800'} text-[9px] font-black uppercase tracking-widest mb-1`}>Protocol</div>
              <div className={`text-[10px] font-black flex items-center gap-1.5 uppercase ${tasks.length > 0 ? 'text-primary' : 'text-emerald-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${tasks.length > 0 ? 'bg-primary' : 'bg-emerald-500'}`}></span>
                {tasks.length > 0 ? t('tacticalOps') : t('standbyMode')}
              </div>
            </div>
         </div>

         {/* Navigation Tabs */}
         <div className="flex bg-white p-1.5 rounded-3xl border border-slate-200 shadow-sm">
            {[
              { id: 'queue', icon: Briefcase, label: 'Queue' },
              { id: 'map', icon: MapPin, label: 'Navigation' },
              { id: 'history', icon: History, label: 'Cleared' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
         </div>

         <AnimatePresence mode="wait">
            {activeTab === 'queue' && (
              <motion.div 
                key="queue"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('complaintBox')}</h2>
                </div>

                {tasks.length === 0 ? (
                  <div className="bg-white py-20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-6 text-center px-10">
                      <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-slate-200" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight text-xl">{t('queueSanitized')}</h3>
                        <p className="text-xs text-slate-400 font-medium">All local sector tactical units clear.</p>
                      </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 pb-12">
                      {tasks.map(task => (
                        <div 
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col gap-8 relative overflow-hidden cursor-pointer hover:border-primary/50 transition-all group"
                        >
                           {task.severity === 'critical' && (
                             <div className="absolute top-0 right-0 h-7 bg-red-600 text-[10px] font-black text-white uppercase tracking-widest px-6 flex items-center rounded-bl-3xl">{t('urgent')}</div>
                           )}

                           <div className="flex items-start justify-between gap-4">
                              <div className="space-y-2">
                                 <h3 className="font-black text-xl text-slate-900 leading-[1.1] tracking-tight group-hover:text-primary transition-colors">{task.title}</h3>
                                 <div className="flex gap-2">
                                   <span className="text-[10px] text-primary font-black uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">{task.trackId}</span>
                                   <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{task.category}</span>
                                 </div>
                              </div>
                              <div 
                                 onClick={(e) => { e.stopPropagation(); setActiveTab('map'); }} 
                                 className="w-14 h-14 bg-orange-50 text-primary rounded-2xl flex items-center justify-center border border-orange-100 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-100"
                              >
                                 <MapPin className="w-7 h-7" />
                              </div>
                           </div>

                           <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 space-y-4">
                              <div className="flex items-start gap-4">
                                 <Navigation className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                 <div className="flex flex-col gap-1">
                                    <span className="text-xs font-black text-slate-800 leading-tight uppercase tracking-tight">{task.address || 'Sector Node Beta 7'}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.block || 'Zone - 1'}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                                 <Clock className="w-4 h-4 text-slate-300" />
                                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Received {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                           </div>

                           <button 
                             onClick={(e) => handleResolve(task.id, e)}
                             className="btn-primary w-full py-5 text-sm font-black tracking-widest gap-3 shadow-xl shadow-orange-200"
                           >
                              <CheckCircle2 className="w-6 h-6" /> {t('confirmNeutralized')}
                           </button>
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>
            )}


            {activeTab === 'map' && (
              <motion.div 
                key="map"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('map')}</h2>
                  <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                    <Layers className="w-3.5 h-3.5" /> Satellite Layer Active
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-4 border border-slate-200 shadow-2xl overflow-hidden aspect-[4/5] sm:aspect-square relative">
                   {/* Map Implementation - Google Maps Embed Simulation */}
                   <div className="absolute inset-4 rounded-[2.5rem] bg-slate-100 overflow-hidden border border-slate-200">
                      <iframe 
                        className="w-full h-full grayscale-[0.5] contrast-[1.2] invert-[0.1]"
                        title="Tactical Map"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15551.488661642194!2d77.63294335!3d12.98004725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000"
                        style={{ border: 0 }}
                        loading="lazy"
                      />
                      <div className="absolute top-6 right-6 flex flex-col gap-2">
                        <button className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-900 active:scale-95 transition-all">
                          <RefreshCw className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 bg-primary rounded-2xl shadow-xl text-white flex items-center justify-center active:scale-95 transition-all">
                          <Navigation className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Active Incidents Overlay */}
                      <div className="absolute inset-0 pointer-events-none p-12">
                         {tasks.map((t, i) => (
                           <div 
                             key={t.id} 
                             className="absolute"
                             style={{ 
                               top: `${20 + (i * 15)}%`, 
                               left: `${30 + (i * 10)}%` 
                             }}
                           >
                             <div className="flex flex-col items-center">
                               <div className="bg-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 text-[9px] font-black uppercase tracking-tighter mb-1 whitespace-nowrap">
                                  {t.title.substring(0, 15)}...
                               </div>
                               <div className="w-8 h-8 bg-primary rounded-full shadow-2xl ring-4 ring-orange-100 flex items-center justify-center animate-bounce">
                                 <div className="w-2 h-2 bg-white rounded-full"></div>
                               </div>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                
                <a 
                   href="https://www.google.com/maps" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full bg-slate-900 py-5 rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all hover:bg-black active:scale-[0.98]"
                >
                  <ExternalLink className="w-4 h-4" /> Open Full Tactical Interface
                </a>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mission Logs</h2>
                </div>

                <div className="flex flex-col gap-4">
                   {resolvedTasks.length === 0 ? (
                     <p className="text-center py-12 text-slate-400 text-xs font-medium uppercase tracking-widest">No completed missions in current archive.</p>
                   ) : (
                     resolvedTasks.map(task => (
                       <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 grayscale opacity-60">
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                             <div className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">{task.title}</div>
                             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status: Sanitized</div>
                          </div>
                          <div className="text-[10px] text-slate-300 font-bold uppercase">ID: {task.trackId}</div>
                       </div>
                     ))
                   )}
                </div>
              </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* Bottom Nav Simulation */}
      <div className="fixed bottom-6 left-6 right-6 z-[60]">
        <div className="bg-slate-900 p-4 rounded-[2.5rem] border border-slate-700 shadow-2xl flex items-center justify-between max-w-[550px] mx-auto">
           <div className="flex items-center gap-3">
              <div 
                onClick={() => setIsProfileOpen(true)}
                className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-900/40 border border-white/20 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                {profile?.name?.charAt(0)}
              </div>
              <div className="hidden sm:block">
                 <div className="text-sm font-black text-white leading-none mb-1">{profile?.name}</div>
                 <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Node ID: {profile?.uid?.substring(0, 8)}</div>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={handleSync}
                disabled={syncing}
                className={`h-12 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase tracking-[0.15em] border border-white/5 ${syncing ? 'bg-slate-800 text-slate-500' : 'bg-primary text-white shadow-lg shadow-orange-900/40 hover:scale-105 active:scale-95'}`}
              >
                  {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                  {syncing ? 'Archiving' : t('sync')}
              </button>
           </div>
        </div>
      </div>
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        profile={profile} 
        onLogout={handleLogout} 
      />
    </div>
  );
}
