import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, AlertTriangle, Cpu, Activity, Info, BarChart3, Droplets, MapPin, Wind } from 'lucide-react';

interface SurgeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SurgeDetailModal({ isOpen, onClose }: SurgeDetailModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-[#0f172a] w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-800 text-white"
        >
          {/* Header */}
          <div className="p-8 pb-0 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   Neural Prediction Ready
                </div>
                <h2 className="text-2xl font-black tracking-tighter">Sector 12: Drainage Failure Projection</h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center transition-all"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
            {/* Logic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700 flex flex-col gap-4">
                 <div className="p-2 w-fit bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <Droplets className="w-5 h-5 text-blue-400" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Moisture Index</h3>
                    <p className="text-sm text-slate-400 mt-1">Ground sensors are reporting 85% saturation levels in East Zone. Subscale drainage systems are at 92% capacity.</p>
                 </div>
              </div>

              <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700 flex flex-col gap-4">
                 <div className="p-2 w-fit bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <History className="w-5 h-5 text-amber-400" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Historical Patterns</h3>
                    <p className="text-sm text-slate-400 mt-1">Previous April cycles show a high correlation between current moisture rates and major failures within 48 hours.</p>
                 </div>
              </div>

              <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700 flex flex-col gap-4">
                 <div className="p-2 w-fit bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <Cpu className="w-5 h-5 text-purple-400" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">ML Confidence</h3>
                    <p className="text-sm text-slate-400 mt-1">Veritas Neural Engine has assigned a 94.2% confidence interval to this prediction based on 10,000+ simulated scenarios.</p>
                 </div>
              </div>

              <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 flex flex-col gap-4">
                 <div className="p-2 w-fit bg-primary/20 rounded-xl border border-primary/30">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary">Critical Action</h3>
                    <p className="text-sm text-slate-300 mt-1 font-bold">Immediate deployment of 2 tactical units to Sector 12 recommended for preventative desilting.</p>
                 </div>
              </div>
            </div>

            {/* Visual Aid Simulation */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Telemetry Correlation</h4>
               <div className="h-32 bg-slate-900 rounded-3xl border border-slate-800 flex items-end justify-between p-6 gap-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent)]" />
                  {[40, 60, 45, 80, 55, 90, 85].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex-1 rounded-t-lg ${i === 5 ? 'bg-primary' : 'bg-slate-700'}`}
                    />
                  ))}
               </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-5 bg-white rounded-3xl text-slate-900 font-black uppercase tracking-widest text-sm hover:bg-slate-100 transition-all shadow-xl"
            >
              Confirm Resource Optimization
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function History({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
