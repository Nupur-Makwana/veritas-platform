import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Flame, AlertTriangle, Share2, TrendingUp, Users } from 'lucide-react';

export default function SocialBuster() {
  const navigate = useNavigate();

  const trollPosts = [
    {
      id: 1,
      user: "AngryCitizen_99",
      handle: "@justice_now",
      content: "Another week, same pothole on MG Road. Is the Ministry of Infrastructure sleeping? @Veritas_System even flagged this and still zero movement. Shame! #GovernanceFail #VeritasAlert",
      time: "2h ago",
      impressions: "12.4K",
      severity: "high"
    },
    {
      id: 2,
      user: "WaterCrisis_Helper",
      handle: "@save_drops",
      content: "Water line burst in HSR sector 2. Households flooding. Ministry of Water Supply ignored the first 10 reports. Veritas identified this as CRITICAL, yet no one arrived. Pathetic. @Veritas_System #HSRWater #Failure",
      time: "5h ago",
      impressions: "8.1K",
      severity: "critical"
    },
    {
      id: 3,
      user: "TruthSeeker",
      handle: "@civic_watch",
      content: "Live wire hanging over public path for 2 days. This is how you treat citizen safety? @MinPower should be held accountable. @Veritas_System has tracked this for 48 hours. DO SOMETHING. #PublicSafety #Negligence",
      time: "1d ago",
      impressions: "25.0K",
      severity: "high"
    },
    {
      id: 4,
      user: "WasteWarrior",
      handle: "@clean_city",
      content: "Illegal dumping going on right under the nose of the Ministry of Environment. Veritas even caught the truck but reports remained 'Under Process'. Is someone getting paid off? 🧐 #WasteScam",
      time: "3h ago",
      impressions: "5.5K",
      severity: "medium"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* HUD Header */}
      <nav className="h-20 border-b border-primary/20 flex items-center justify-between px-6 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Social Buster</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Community Intelligence Escort • Team Veritas</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:flex flex-col items-end">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Sentiment</div>
              <div className="text-red-500 font-bold text-sm tracking-tight flex items-center gap-1">
                 <AlertTriangle className="w-3 h-3" /> VOLATILE - 78% CRITICAL
              </div>
           </div>
           <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-orange-950">
              <Flame className="w-6 h-6 text-white" />
           </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
         {/* Feed Statistics */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Troll Density', value: 'High', color: 'text-red-500' },
              { label: 'Viral Velocity', value: '2.4x', color: 'text-primary' },
              { label: 'Public Shame Meter', value: '88/100', color: 'text-primary' },
              { label: 'Escalation Node', value: 'Active', color: 'text-green-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</div>
                <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
         </div>

         <div className="flex flex-col gap-1">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-3">
               <TrendingUp className="w-4 h-4 text-primary" /> Active Dissatisfaction Stream
            </h2>
            
            <div className="flex flex-col gap-6">
               {trollPosts.map((post, i) => (
                 <motion.div 
                   key={post.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
                 >
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="flex items-start gap-5 relative z-10">
                       <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary/20 transition-colors">
                          <MessageSquare className="w-7 h-7 text-primary" />
                       </div>
                       <div className="flex-1 flex flex-col gap-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                             <div className="flex items-center gap-2">
                                <span className="font-black text-slate-200 uppercase tracking-tight">{post.user}</span>
                                <span className="text-xs font-bold text-slate-500">{post.handle}</span>
                                <span className="text-[10px] text-slate-600 font-bold ml-2 italic">• {post.time}</span>
                             </div>
                             <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border border-white/5 ${post.severity === 'critical' ? 'bg-red-950/40 text-red-400' : 'bg-orange-950/40 text-orange-400'}`}>
                                Escalated Node
                             </div>
                          </div>
                          
                          <p className="text-lg font-medium text-slate-300 leading-relaxed italic">
                             {post.content}
                          </p>
                          
                          <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                             <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                                <Users className="w-4 h-4 text-primary" /> {post.impressions} Views
                             </div>
                             <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                                <Share2 className="w-4 h-4" /> Boost Shame
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Call to Action for Admin */}
         <div className="mt-16 bg-primary/10 p-10 rounded-[3rem] border border-primary/20 text-center flex flex-col gap-6 items-center border-dashed">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary animate-pulse">
               <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl font-black uppercase tracking-tighter italic">Ministry Response Required</h3>
               <p className="text-slate-400 font-bold max-w-md mx-auto">These posts are gaining viral traction. Neutralize the underlying infrastructure failure before sentiment drops below critical levels.</p>
            </div>
            <button 
               onClick={() => navigate('/admin')}
               className="bg-primary text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-orange-950/40 active:scale-95"
            >
               Open Tactical Command
            </button>
         </div>
      </div>
    </div>
  );
}
