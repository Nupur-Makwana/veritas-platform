import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Filter, AlertCircle, CheckCircle2, 
  MapPin, Clock, Shield, SearchIcon, Sparkles, Send
} from 'lucide-react';
import { useMockStore } from '../../lib/mockStore';

export default function AssignmentFlow() {
  const { id } = useParams(); // Worker ID
  const navigate = useNavigate();
  const { workers, complaints, updateComplaint, updateWorker } = useMockStore();
  
  const worker = workers.find(w => w.id === id);
  const [search, setSearch] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter complaints that are reported and NOT assigned yet
  const availableTasks = complaints.filter(c => 
    c.status === 'reported' && 
    !c.workerId &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAssign = async () => {
    if (!selectedTaskId || !id) return;
    
    setIsAssigning(true);
    
    try {
      if (id) {
        await updateWorker(id, { status: 'assigned' });
      }
      
      await updateComplaint(selectedTaskId, {
        workerId: id,
        status: 'under_process',
        assignmentType: 'manual',
        updatedAt: Date.now()
      });
      
      setIsAssigning(false);
      setShowSuccess(true);
      
      // Auto redirect after success
      setTimeout(() => {
        navigate('/admin');
      }, 2500);
    } catch (error) {
      console.error('Assignment failed:', error);
      setIsAssigning(false);
    }
  };

  if (!worker) return <div className="p-20 text-center font-black">Worker Node Dead.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="h-20 bg-white border-b border-slate-200 flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center">
            <button onClick={() => navigate('/admin')} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-primary transition-all">
            <ArrowLeft className="w-8 h-8" />
            </button>
            <div className="ml-4">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tactical Dispatch Engine</div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Re-route: {worker.name}</h1>
            </div>
        </div>
        <div className="flex items-center gap-4">
           <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${worker.status === 'free' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-orange-50 border-orange-100 text-primary'}`}>
              Unit Status: {worker.status}
           </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto w-full p-6 md:p-12 flex flex-col gap-10">
         {/* Search & Filter Header */}
         <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="relative w-full md:max-w-md group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
               <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reported intelligence reports..."
                  className="w-full h-12 bg-white border border-slate-200 rounded-2xl pl-14 pr-6 text-sm font-medium outline-none focus:border-primary shadow-xl shadow-slate-100 transition-all"
               />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <button className="flex-1 md:flex-none h-12 px-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                  <Filter className="w-4 h-4" /> Category Filter
               </button>
               <button className="flex-1 md:flex-none h-12 px-6 bg-slate-900 text-white rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                  <Shield className="w-4 h-4" /> Priority Sort
               </button>
            </div>
         </div>

         {/* Task Selection Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTasks.map(task => (
               <div 
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`bg-white p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col gap-4 shadow-xl shadow-slate-200/40 ${selectedTaskId === task.id ? 'border-primary shadow-orange-200' : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200'}`}
               >
                  {selectedTaskId === task.id && (
                     <div className="absolute top-5 right-5">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                     </div>
                  )}
                  
                  <div className="flex flex-col gap-1">
                     <div className="text-[10px] font-black text-primary uppercase tracking-widest">{task.category}</div>
                     <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{task.title}</h3>
                  </div>

                  <div className="space-y-2">
                     <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> {task.address?.substring(0, 30)}
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-primary" /> {new Date(task.createdAt).toLocaleTimeString()}
                     </div>
                  </div>

                  <div className={`mt-auto px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-center border ${task.severity === 'critical' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                     Priority: {task.severity}
                  </div>
               </div>
            ))}
         </div>

         {/* Footer Action Bar */}
         <AnimatePresence>
            {selectedTaskId && (
               <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl bg-slate-950 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 flex items-center justify-between z-50 backdrop-blur-xl"
               >
                  <div className="flex items-center gap-6 pl-4">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/10">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Mission</div>
                        <div className="text-white font-black uppercase tracking-tight">{complaints.find(c => c.id === selectedTaskId)?.title.substring(0, 25)}...</div>
                     </div>
                  </div>
                  <button 
                     onClick={handleAssign}
                     disabled={isAssigning}
                     className="bg-primary text-white h-16 px-10 rounded-full font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-950"
                  >
                     {isAssigning ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-5 h-5" /> Confirm Dispatch</>}
                  </button>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Success Overlay */}
         <AnimatePresence>
            {showSuccess && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-primary z-[100] flex items-center justify-center p-6 text-center"
               >
                  <motion.div 
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="flex flex-col items-center gap-8 text-white"
                  >
                     <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center text-primary shadow-2xl">
                        <CheckCircle2 className="w-16 h-16" />
                     </div>
                     <div className="space-y-4">
                        <h2 className="text-5xl font-black italic tracking-tighter uppercase">Mission Relayed.</h2>
                        <p className="text-orange-100 font-bold max-w-md mx-auto text-xl italic uppercase tracking-widest">
                           Tactical objective sent to {worker.name}. Unit is moving to intercept point.
                        </p>
                     </div>
                     <div className="flex items-center gap-3 px-6 py-3 bg-black/20 rounded-full border border-white/20 mt-8">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest">Command Syncing...</span>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </main>
    </div>
  );
}
