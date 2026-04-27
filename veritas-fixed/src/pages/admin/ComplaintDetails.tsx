import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldAlert, Sparkles, User, Briefcase, CheckCircle2, XCircle, Send, Loader2, Cpu, RefreshCw, Navigation } from 'lucide-react';
import { useMockStore } from '../../lib/mockStore';

import { toast } from 'sonner';

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, workers, updateComplaint, updateWorker, profile, t } = useMockStore();
  const [loading, setLoading] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState<'auto' | 'manual'>('auto');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);
  const [assigningLoading, setAssigningLoading] = useState(false);

  const complaint = complaints.find(c => c.id === id);
  const isAdmin = profile?.role === 'admin';

  const confirmAssignment = async () => {
    if (!id) return;
    setAssigningLoading(true);
    
    try {
      let workerId = complaint?.workerId || selectedWorkerId;
      
      // If admin auto assignment
      if (isAdmin && assignmentMode === 'auto' && !workerId) {
        const matchingWorker = workers.find(w => w.department.toLowerCase().includes(complaint?.category.toLowerCase() || '')) || workers.find(w => w.status === 'free');
        if (matchingWorker) workerId = matchingWorker.id;
      }

      if (workerId) {
        await updateWorker(workerId, { status: 'assigned' });
      }

      await updateComplaint(id, {
        status: 'under_process',
        workerId: workerId || profile?.uid,
        assignmentType: assignmentMode === 'auto' ? 'ai' : 'manual'
      });
      
      toast.success(assignmentMode === 'auto' ? 'AI DISPATCH CONFIRMED' : 'MANUAL DISPATCH CONFIRMED', {
        description: `Mission ${complaint?.trackId} is now live. Field units synchronized.`,
      });

      setShowAssignConfirm(false);
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setAssigningLoading(false);
    }
  };

  if (!complaint) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Detail Header */}
      <nav className="h-20 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 z-50 sticky top-0">
        <button onClick={() => navigate(isAdmin ? '/admin' : '/worker')} className="w-12 h-12 -ml-2 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-8 h-8" />
        </button>
        <div className="ml-4">
           <h1 className="text-2xl font-black tracking-tighter text-secondary leading-none mb-1 uppercase">{t('trackIssue')}</h1>
           <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] leading-none">{complaint.trackId}</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
           <span className={`text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-[0.2em] border shadow-sm ${
             complaint.status === 'solved' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-amber-100 border-amber-200 text-amber-700'
           }`}>
             {complaint.status?.replace('_', ' ')}
           </span>
        </div>
      </nav>

      <main className="flex-1 p-4 sm:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full mb-12">
         {/* Main Intelligence Block */}
         <div className="lg:col-span-8 flex flex-col gap-8">
            {/* AI Summary Block */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden relative group">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-orange-50/20">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-primary/10 text-primary rounded-3xl flex items-center justify-center shadow-inner">
                        <Sparkles className="w-8 h-8" />
                     </div>
                     <div className="flex flex-col">
                        <h2 className="font-black text-xl text-slate-900 tracking-tighter uppercase">{t('aiAnalysis')}</h2>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Neural Diagnostic v4.2</span>
                     </div>
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border ${
                    complaint.fakeScore > 0.6 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                  }`}>
                    {complaint.fakeScore > 0.6 ? 'AI ALERT: Potential Anomaly' : 'AI VERIFIED: Legitimate'}
                  </div>
               </div>
               <div className="p-10 flex flex-col gap-10">
                  <div>
                     <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Semantic Summary</h3>
                     <p className="text-slate-900 text-2xl leading-relaxed font-black tracking-tight">
                        {complaint.aiSummary || complaint.summary}
                     </p>
                     {complaint.fakeReason && (
                        <div className={`mt-6 p-5 rounded-2xl border flex flex-col gap-2 ${complaint.fakeScore > 0.6 ? 'bg-red-50 border-red-100 text-red-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
                           <div className="text-[10px] font-black uppercase tracking-widest opacity-60">AI Intelligence Note</div>
                           <p className="text-xs font-bold leading-relaxed italic">"{complaint.fakeReason}"</p>
                        </div>
                     )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 border-t border-slate-50">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span>Category Reliability</span>
                           <span className="text-primary">92% Precision</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex p-0.5">
                           <div className="h-full bg-primary rounded-full shadow-lg shadow-orange-200" style={{ width: '92%' }} />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span>Severity Metrics</span>
                           <span className="text-slate-900 capitalize font-black">{complaint.severity} Level</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex p-0.5">
                           <div className={`h-full rounded-full shadow-lg ${complaint.severity === 'critical' ? 'bg-red-500 shadow-red-200' : 'bg-orange-500 shadow-orange-200'}`} style={{ width: '85%' }} />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Evidence & Details Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col gap-6 shadow-xl shadow-slate-200/30">
                  <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                     <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center"><MapPin className="text-primary w-4 h-4" /></div> {t('photoVideo')}
                  </h3>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-inner group">
                    {complaint.imageUrl ? (
                      <>
                        <img src={complaint.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="field intelligence" />
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                           <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">Geotagged Evidence Block</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-300 gap-4">
                         <div className="w-16 h-16 rounded-3xl border-4 border-dashed border-slate-200 animate-pulse flex items-center justify-center">
                            <Cpu className="w-8 h-8" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Media Sync...</span>
                      </div>
                    )}
                  </div>
               </div>

               <div className="bg-white rounded-[3rem] border border-slate-200 p-8 flex flex-col gap-10 shadow-xl shadow-slate-200/30">
                  <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                     <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center"><User className="text-primary w-5 h-5" /></div> Citizen Profile
                  </h3>
                  <div className="flex flex-col gap-10">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center font-black text-3xl text-primary border border-white/10 shadow-2xl relative overflow-hidden group">
                           {complaint.citizenId?.charAt(0)}
                           <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 border-4 border-slate-900 rounded-full animate-pulse shadow-lg"></div>
                        </div>
                        <div className="flex flex-col gap-1">
                           <div className="font-black text-slate-900 text-lg uppercase tracking-tight truncate w-48">UID-{complaint.citizenId?.substring(0, 8)}</div>
                           <div className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl font-black tracking-widest uppercase border border-emerald-100 inline-block w-fit">Identity Verified</div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-5 pt-10 border-t border-slate-50 text-[10px] font-black uppercase tracking-[0.15em]">
                        <div className="flex justify-between items-center">
                           <span className="text-slate-400">{t('event')} Date</span>
                           <span className="text-slate-900 font-black">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-50 pt-5">
                           <span className="text-slate-400">Sector Node</span>
                           <span className="text-slate-900 font-extrabold uppercase tracking-widest text-right">{complaint.block || 'Regional Node 4'}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Sidebar - Control Node */}
         <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-slate-950 text-white rounded-[3.5rem] p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden border border-slate-800">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
               
               <div className="relative z-10 space-y-2">
                 <h2 className="text-3xl font-black tracking-tighter leading-none uppercase">Tactical Control</h2>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Operational Authorization</p>
               </div>

               <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex flex-col gap-4">
                     {complaint.status === 'reported' && (
                       <>
                         <button 
                           onClick={() => setShowAssignConfirm(true)}
                           disabled={loading}
                           className="btn-primary w-full py-6 text-sm font-black gap-3 shadow-2xl shadow-orange-500/20"
                         >
                           <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                           Initiate Deployment Flow
                         </button>
                         <button 
                           onClick={() => {
                             if (!id) return;
                             setLoading(true);
                             setTimeout(async () => {
                               if (complaint.workerId) await updateWorker(complaint.workerId, { status: 'free' });
                               updateComplaint(id, { status: 'rejected' });
                               toast.error('MISSION SCRUBBED');
                               navigate(isAdmin ? '/admin' : '/worker');
                             }, 1000);
                           }}
                           disabled={loading}
                           className="w-full bg-slate-900 hover:bg-slate-850 text-slate-500 py-5 rounded-[1.5rem] font-black text-[10px] uppercase transition-all tracking-[0.2em] border border-slate-800"
                         >
                           Scrub Anomalous Entry
                         </button>
                       </>
                     )}
                     {complaint.status === 'under_process' && (
                       <button 
                         onClick={() => {
                           if (!id) return;
                           setLoading(true);
                           setTimeout(async () => {
                              if (complaint.workerId) await updateWorker(complaint.workerId, { status: 'free' });
                              updateComplaint(id, { status: 'solved' });
                              toast.success('MISSION SANITIZED');
                              setLoading(false);
                           }, 1000);
                         }}
                         disabled={loading}
                         className="btn-primary w-full py-6 text-sm font-black gap-3"
                       >
                         {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />} 
                         Confirm Resolution
                       </button>
                     )}
                     {complaint.status === 'solved' && (
                       <div className="bg-emerald-950/30 text-emerald-400 p-8 rounded-[2rem] border border-emerald-900/50 text-center font-black uppercase text-[10px] tracking-[0.3em] flex flex-col gap-4">
                          <CheckCircle2 className="w-8 h-8 mx-auto" />
                          Mission Sanitized
                       </div>
                     )}
                  </div>
               </div>

               <div className="flex flex-col gap-8 pt-10 border-t border-slate-800/50 relative z-10">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Workforce Hub</label>
                     <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
                        <button onClick={() => setAssignmentMode('auto')} className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest transition-all ${assignmentMode === 'auto' ? 'bg-primary text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}>AI</button>
                        <button onClick={() => setAssignmentMode('manual')} className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest transition-all ${assignmentMode === 'manual' ? 'bg-primary text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}>HUMAN</button>
                     </div>
                  </div>

                  <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800/50 flex flex-col gap-6 group hover:border-primary transition-colors">
                     <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-primary/10 p-3 rounded-2xl text-primary flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                          <Briefcase className="w-6 h-6" />
                       </div>
                       <div className="flex flex-col gap-1">
                          <div className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Target Ministry</div>
                          <div className="font-black text-sm text-white tracking-tight uppercase">{complaint.category}</div>
                       </div>
                     </div>

                     {assignmentMode === 'manual' && !complaint.workerId && (
                        <div className="flex flex-col gap-3 pt-6 border-t border-slate-800/50">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Select Tactical Unit</label>
                           <select 
                              value={selectedWorkerId}
                              onChange={(e) => setSelectedWorkerId(e.target.value)}
                              className="bg-slate-800 text-white rounded-xl p-3 text-[10px] font-black uppercase tracking-widest border border-slate-700 outline-none focus:border-primary cursor-pointer hover:bg-slate-750 transition-colors"
                           >
                              <option value="">Awaiting Node Selection...</option>
                              {workers.map(w => (
                                 <option key={w.id} value={w.id}>{w.name} - {w.department} ({w.status})</option>
                              ))}
                           </select>
                        </div>
                     )}
                  </div>

                  {complaint.workerId ? (
                     <div className="flex items-center gap-5 p-4 rounded-[2rem] bg-slate-900/40 border border-slate-800/50">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-primary">
                          {workers.find(w => w.id === complaint.workerId)?.name.charAt(0) || 'OP'}
                        </div>
                        <div className="flex flex-col gap-1">
                           <div className="font-black text-sm text-white leading-none uppercase tracking-tight">
                              {workers.find(w => w.id === complaint.workerId)?.name || 'Operator Zero'}
                           </div>
                           <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                              {workers.find(w => w.id === complaint.workerId)?.department || 'Field Command #01'}
                           </div>
                        </div>
                     </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] bg-slate-900/20 rounded-[2rem] border border-dashed border-slate-800/50">
                       {assignmentMode === 'auto' ? (
                          <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> AI Analyzing Field Assets...</>
                       ) : (
                          <><User className="w-3.5 h-3.5" /> Manual Dispatch Pending</>
                       )}
                    </div>
                  )}
               </div>
            </div>

            {/* Tactical Map Block */}
            <div className="bg-white rounded-[3.5rem] border border-slate-200 h-[350px] overflow-hidden relative shadow-2xl group border-2">
                {/* Live Tactical Map Embed */}
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                   <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(1.1) contrast(1.2) grayscale(0.5)' }}
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=77.1,28.5,77.3,28.7&layer=mapnik`}
                   ></iframe>
                   <div className="absolute inset-0 pointer-events-none bg-slate-950/10 backdrop-blur-[0.5px]" />
                </div>
                
                <div className="absolute inset-x-8 top-8 pointer-events-none flex justify-between items-start">
                   <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white flex flex-col gap-1 shadow-2xl">
                      <div className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">Sector Node</div>
                      <div className="text-[10px] font-black uppercase tracking-tight">{complaint.block || 'Alpha-7'}</div>
                   </div>
                   <button className="w-12 h-12 bg-white rounded-2xl shadow-2xl border border-slate-200 flex items-center justify-center text-primary active:scale-90 transition-all pointer-events-auto">
                      <Navigation className="w-6 h-6" />
                   </button>
                </div>
                
                {/* Tactical Pulse Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                   <div className="w-48 h-48 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
                   <div className="absolute w-32 h-32 rounded-full border border-primary/40 animate-[spin_15s_linear_infinite_reverse]" />
                   <div className="absolute w-8 h-8 bg-primary rounded-full shadow-[0_0_30px_rgba(255,87,34,0.8)] border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                   </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                   Live Telemetry Link Active
                </div>
            </div>

            {/* Dynamic Location View */}
            <div className="bg-white rounded-[3.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/30 flex flex-col gap-4 mt-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Sector Topography</h3>
                  <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase text-emerald-500">Live Mission Feed</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200 shadow-inner group">
                     {complaint.imageUrl ? (
                       <img src={complaint.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" alt="Citizen Shot" />
                     ) : (
                       <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="loc 1" />
                     )}
                     <div className="absolute inset-0 bg-slate-900/10" />
                     <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-xl text-[8px] font-black uppercase shadow-sm border border-slate-100">Primary Evidence</div>
                  </div>
                  <div className="aspect-square bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200 shadow-inner group">
                     <img 
                       src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" 
                       className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 grayscale" 
                       alt="Loc Satellite" 
                     />
                     <div className="absolute inset-0 bg-slate-900/10" />
                     <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 rounded-xl text-[8px] font-black uppercase shadow-sm border border-slate-100">Satellite Topo</div>
                  </div>
               </div>
               <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-900 uppercase">Verified Address</span>
                    <span className="text-[9px] font-bold text-slate-400">{complaint.address}, {complaint.block || 'Delhi Base'}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Assignment Flow Confirmation Modal */}
         <AnimatePresence>
            {showAssignConfirm && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
               >
                  <motion.div 
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-white w-full max-w-md rounded-[3rem] p-10 relative overflow-hidden flex flex-col gap-8 shadow-2xl"
                  >
                     <div className="flex flex-col gap-4">
                       <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                          {assignmentMode === 'auto' ? <Cpu className="w-8 h-8" /> : <User className="w-8 h-8" />}
                       </div>
                       <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none text-slate-900">
                          {assignmentMode === 'auto' ? 'AI Workforce Sync' : 'Direct Field Dispatch'}
                       </h2>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed">
                          Veritas is about to authorize the deployment for Mission <b>{complaint.trackId}</b>.
                       </p>
                     </div>

                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span>Assigned Node</span>
                           <span className="text-slate-900">Veritas Delta Node</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-primary font-black text-lg">
                              {assignmentMode === 'auto' ? 'AI' : 'MN'}
                           </div>
                           <div>
                              <div className="text-xs font-black text-slate-900 uppercase">
                                 {assignmentMode === 'auto' ? 'Neural Match Protocol' : 'Manual Supervisor Link'}
                              </div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Authorized by {profile?.name}</div>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-3">
                        <button 
                           onClick={() => setShowAssignConfirm(false)}
                           className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                        >
                           Cancel
                        </button>
                        <button 
                           onClick={confirmAssignment}
                           disabled={assigningLoading}
                           className="flex-[2] py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-950 active:scale-95 transition-all flex items-center justify-center gap-3"
                         >
                            {assigningLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                            Okay, Deploy
                         </button>
                      </div>
                   </motion.div>
                </motion.div>
             )}
          </AnimatePresence>
      </main>
    </div>
  );
}
