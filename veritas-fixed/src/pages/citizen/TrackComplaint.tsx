import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Share2, Sparkles, MessageCircle, Info, Loader2, XCircle, Upload } from 'lucide-react';
import { useMockStore } from '../../lib/mockStore';
import { generateSocialBusterPost } from '../../lib/ai';

export default function TrackComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, t } = useMockStore();
  const [showShare, setShowShare] = useState(false);
  const [socialPost, setSocialPost] = useState('');
  const [generating, setGenerating] = useState(false);

  const complaint = complaints.find(c => c.id === id);

  const handleGenerateSocialPost = async () => {
    if (!complaint) return;
    setGenerating(true);
    try {
      const post = await generateSocialBusterPost(complaint.title, 5); // Simulating 5 day delay
      setSocialPost(post);
      setShowShare(true);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const reportData = `
      VERITAS CIVIC REPORT
      Track ID: ${complaint?.trackId}
      Status: ${complaint?.status}
      Priority: ${complaint?.severity}
      Location: ${complaint?.address}, ${complaint?.block}
      Summary: ${complaint?.summary}
      Date: ${new Date(complaint?.createdAt || 0).toLocaleString()}
    `;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_${complaint?.trackId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps = [
    { id: 'reported', label: 'Reported', desc: 'Complaint received and AI-analyzed' },
    { id: 'under_process', label: 'Processing', desc: 'Admin approved and worker dispatched' },
    { id: 'solved', label: 'Resolved', desc: 'Corrective action verified by worker' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === (complaint?.status === 'rejected' ? 'reported' : complaint?.status || 'reported'));

  if (!complaint) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 z-50 sticky top-0">
        <button onClick={() => navigate('/citizen')} className="w-10 h-10 -ml-2 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="ml-2">
           <h1 className="text-xl font-bold tracking-tight text-secondary leading-none">{t('trackIssue')}</h1>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Telemetry: {complaint.trackId}</p>
        </div>
        <button 
          onClick={handleDownload}
          className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-orange-50 px-3 py-2 rounded-xl transition-all"
        >
          <Upload className="w-4 h-4 rotate-180" />
          <span className="hidden sm:inline">{t('downloadReport')}</span>
        </button>
      </nav>

      <main className="flex-1 p-6 flex flex-col gap-8 max-w-xl mx-auto w-full mb-12">
        {/* Status Intelligence Card */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col gap-10 relative overflow-hidden">
           <div className={`absolute top-0 right-0 h-8 px-6 rounded-bl-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center shadow-sm ${
             complaint.status === 'solved' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-primary text-white shadow-orange-200'
           }`}>
             {complaint.status?.replace('_', ' ')}
           </div>

           <div className="mt-4">
              <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{complaint.title}</h2>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Active Resolution Active</p>
              </div>
           </div>

           {/* Precision Progress Line */}
           <div className="flex flex-col gap-10 relative ml-2">
              <div className="absolute left-[3.5px] top-6 bottom-6 w-0.5 bg-slate-100" />
              {steps.map((step, i) => {
                 const isDone = i <= currentStepIndex;
                 const isCurrent = i === currentStepIndex;
                 return (
                   <div key={step.id} className="relative pl-10 flex flex-col gap-1">
                      <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full ring-4 transition-all ${
                        isDone ? 'bg-primary ring-orange-100' : 'bg-slate-200 ring-transparent'
                      }`}>
                         {isDone && <div className="absolute inset-0 animate-ping bg-primary rounded-full opacity-40"></div>}
                      </div>
                      <div className={`transition-all ${isDone ? 'opacity-100' : 'opacity-40'}`}>
                         <h4 className={`text-xs font-black uppercase tracking-widest ${isCurrent ? 'text-primary' : 'text-slate-600'}`}>{step.label}</h4>
                         <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">{step.desc}</p>
                      </div>
                   </div>
                 );
              })}
           </div>

           {/* Meta Data Grid */}
           <div className="grid grid-cols-2 gap-4 pt-10 border-t border-slate-50">
              <div className="flex flex-col gap-1">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Detection</div>
                 <div className="text-sm font-bold text-slate-900">AI Verified</div>
              </div>
              <div className="flex flex-col gap-1 text-right">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Severity</div>
                 <div className="text-sm font-bold text-secondary capitalize">{complaint.severity || 'Medium'}</div>
              </div>
           </div>
        </div>

        {/* AI Insight Overlay */}
        {complaint.aiSummary && (
          <div className="p-6 rounded-3xl bg-slate-900 text-white flex gap-5 border border-slate-800 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl opacity-50" />
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                <Sparkles className="text-primary w-6 h-6" />
             </div>
             <div className="flex flex-col gap-2 relative z-10">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Intelligence Asset</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{complaint.aiSummary}</p>
             </div>
          </div>
        )}

        {/* Accountability Block */}
        {complaint.status !== 'solved' && (
           <div className="p-10 rounded-[2.5rem] bg-secondary text-white flex flex-col gap-8 shadow-2xl relative overflow-hidden group border border-red-950">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="flex items-center gap-5 relative z-10">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                    <Share2 className="w-7 h-7 text-primary" />
                 </div>
                 <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black tracking-tight leading-none uppercase">Social Buster AI</h3>
                    <p className="text-red-200/60 text-xs font-semibold leading-none">Delayed resolution accountability node</p>
                 </div>
              </div>
              
              <div className="bg-red-950/40 p-5 rounded-2xl border border-red-900/50 relative z-10">
                 <p className="text-[10px] text-red-200 font-bold uppercase tracking-widest leading-relaxed">
                    Uses AI to generate high-vis public X posts targeting local authority handles.
                 </p>
              </div>

              <button 
                onClick={handleGenerateSocialPost}
                disabled={generating}
                className="btn-primary w-full py-5 text-sm gap-3 shadow-lg shadow-red-950 relative z-10 group/btn overflow-hidden"
              >
                 <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                 {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5 transition-transform group-hover/btn:scale-110" />}
                 <span className="relative z-10">Initiate Public Escalation</span>
              </button>
           </div>
        )}

        {/* Social Modal Overlay */}
        <AnimatePresence>
           {showShare && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-xl p-6 flex items-center justify-center"
             >
                <motion.div 
                   initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }}
                   className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] flex flex-col gap-6"
                >
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-900 text-primary rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-4 h-4" />
                         </div>
                         <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Signal Draft</h3>
                      </div>
                      <button onClick={() => setShowShare(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                         <XCircle className="w-5 h-5" />
                      </button>
                   </div>
                   <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 relative overflow-hidden group">
                      <div className="absolute top-2 left-2 opacity-10"><MessageCircle className="w-8 h-8" /></div>
                      <p className="text-slate-800 text-xs leading-relaxed font-semibold italic relative z-10 whitespace-pre-line">
                         {socialPost}
                      </p>
                   </div>
                   <div className="flex flex-col gap-2">
                      <button className="btn-primary w-full py-3 text-[10px] tracking-[0.1em]">Copy Intelligence Draft</button>
                      <button className="w-full py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Broadcast to X</button>
                   </div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>
      </main>
    </div>
  );
}
