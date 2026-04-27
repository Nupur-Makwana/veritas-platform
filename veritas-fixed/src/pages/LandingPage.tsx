import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Flame, Shield, Users, BarChart3, ArrowRight, X, CheckCircle2, Globe, FileText, Smartphone } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  const featuresData = [
    "Multi-language login interface (English + all major Indian languages)",
    "Citizen login with DigiLocker / govt ID verification",
    "Complaint filing portal with AI mode and manual mode",
    "AI-generated complaint report from image/video uploads",
    "Auto category detection (water, safety, roads, etc.)",
    "AI severity & priority detection (normal / urgent / critical)",
    "Fake / scam complaint detection with confidence score",
    "Unique complaint Track ID generation",
    "Complaint tracking page",
    "My submissions history",
    "Citizen profile management",
    "Auto popup confirmation & warning messages",
    "AI-generated social escalation posts after delay",
    "Auto posting through social_buster accountability account",
    "Worker login portal",
    "Worker dashboard with assigned tasks, priority, and map",
    "Google Maps integration for complaint location and navigation",
    "Task details with citizen name, address, and severity",
    "Worker profile & department view",
    "Admin / control office login",
    "AI-powered admin dashboard analytics"
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-[1600px] mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-orange-200">
            <Flame className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-secondary uppercase">VERITAS</span>
          <span className="hidden sm:inline-block ml-4 text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded uppercase tracking-widest">
            Bringing truth to civic data
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
             <button onClick={() => setShowFeatures(true)} className="hover:text-primary transition-colors">Features</button>
             <button 
                onClick={() => document.getElementById('evidence-section')?.scrollIntoView({ behavior: 'smooth' })} 
                className="hover:text-primary transition-colors"
             >
                Transparency
             </button>
             <button 
                onClick={() => document.getElementById('social-buster')?.scrollIntoView({ behavior: 'smooth' })} 
                className="hover:text-primary transition-colors"
             >
                Social Buster
             </button>
             <button onClick={() => navigate('/citizen/safety')} className="hover:text-primary transition-colors">Safety</button>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Features Modal */}
      <AnimatePresence>
        {showFeatures && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
               <button 
                 onClick={() => setShowFeatures(false)}
                 className="absolute top-8 right-8 w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-all z-10"
               >
                 <X className="w-6 h-6" />
               </button>

               <div className="md:w-1/3 bg-slate-900 p-12 text-white flex flex-col justify-end gap-6 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Shield className="w-32 h-32 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
                     <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-black italic tracking-tighter leading-none relative z-10">THE TECH OVERLAY.</h2>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10">Full technical stack used by Team Veritas to neutralize civic infrastructure failure.</p>
               </div>

               <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {featuresData.map((feature, i) => (
                        <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors">
                           <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                           <span className="text-xs font-bold text-slate-700 leading-tight">{feature}</span>
                        </div>
                     ))}
                  </div>
                  
                  <div className="mt-12 flex flex-col md:flex-row gap-4">
                     <div className="flex-1 p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-center gap-4">
                        <Globe className="w-8 h-8 text-primary" />
                        <div>
                           <div className="text-[10px] font-black uppercase text-primary tracking-widest">Multi-Language</div>
                           <div className="text-xs font-bold text-slate-900">Translation Core Ops</div>
                        </div>
                     </div>
                     <div className="flex-1 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                        <Smartphone className="w-8 h-8 text-slate-900" />
                        <div>
                           <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Cross-Platform</div>
                           <div className="text-xs font-bold text-slate-900">Native Logic Nodes</div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="max-w-[1600px] mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center relative">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#FF5722 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative z-10"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Next-Gen Civic Governance</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black leading-[1] mb-8 max-w-5xl tracking-tighter text-slate-900">
            Transforming <span className="text-primary italic">Civic Voice</span> <br className="hidden md:block" /> Into Public Action.
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-medium">
            Veritas uses frontier AI to bridge the intelligence gap between citizens and administration. Real-time detection, automated accountability.
          </p>
          
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button onClick={() => navigate('/login')} className="btn-primary flex items-center gap-2 group text-lg px-10 py-5 shadow-2xl shadow-orange-200">
              Launch Veritas <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
               onClick={() => document.getElementById('evidence-section')?.scrollIntoView({ behavior: 'smooth' })}
               className="btn-secondary text-lg px-10 py-5 bg-white shadow-sm border border-slate-100"
            >
              View Evidence
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust Evidence Section */}
      <div id="evidence-section" className="bg-white py-32 relative overflow-hidden border-y border-slate-100">
         <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-20">
               <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-4">Pulse Reviews</h2>
               <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Trusted By Active Citizens.</h3>
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-4">Verified response metrics from actual city nodes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {[
                 { 
                   text: "Veritas solved my water leak in 4 hours. No corruption, just efficiency. I actually trust the system now.",
                   user: "Anjali K., Indiranagar",
                   rating: 5,
                   tag: "Verified Resident",
                   score: "99% Trust Score"
                 },
                 { 
                   text: "The AI scam filter is insane. Finally, fake complaints aren't clogging the system. The transparency is real.",
                   user: "Rahul S., HSR Layout",
                   rating: 5,
                   tag: "Community Lead",
                   score: "100% Reliable"
                 },
                 { 
                   text: "Seeing my tracking node move in real-time is so satisfying. The accountability is what we needed for years.",
                   user: "Vikram P., Whitefield",
                   rating: 5,
                   tag: "Tech Professional",
                   score: "Highly Secure"
                 }
               ].map((review, i) => (
                 <div key={i} className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 flex flex-col gap-6 group hover:bg-white transition-all hover:border-primary/20">
                   <div className="flex gap-1">
                     {[...Array(review.rating)].map((_, j) => (
                       <Flame key={j} className="w-5 h-5 text-primary fill-primary" />
                     ))}
                   </div>
                   <p className="text-slate-800 text-xl font-black leading-tight tracking-tight">"{review.text}"</p>
                   <div className="flex flex-col gap-4 mt-auto pt-8 border-t border-slate-100">
                     <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-black text-slate-900 uppercase">{review.user}</div>
                          <div className="text-[9px] text-primary font-black uppercase tracking-widest">{review.tag}</div>
                        </div>
                        <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-[8px] font-black uppercase text-slate-400">
                           {review.score}
                        </div>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Social Buster Section */}
      <div id="social-buster" className="bg-slate-950 py-32 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/2" />
         
         <div className="max-w-[1600px] mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-start">
               <div className="md:w-1/3 flex flex-col gap-8">
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/40">
                     <Flame className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-4 text-white">
                     <h2 className="text-5xl font-black italic tracking-tighter leading-none">SOCIAL BUSTER.</h2>
                     <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Public accountability in real-time. When administration delays, our automated social buster node triggers visibility to ensure action.
                     </p>
                  </div>
                  <button onClick={() => navigate('/social-buster')} className="btn-primary w-fit px-8">Visit Social Hub</button>
               </div>

               <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { 
                      handle: "@social_buster_veritas", 
                      content: "Sector 4 Water Dept is sleeping! 48 hours since the leak was reported. AI confirmed. Why no action? #CivicShame", 
                      time: "2h ago",
                      type: "Troll/Escalation"
                    },
                    { 
                      handle: "@social_buster_veritas", 
                      content: "HSR Layout roads looking like craters. Ministry of Infra, are you seeing this Veritas report #TRACK-8921? #GetToWork", 
                      time: "5h ago",
                      type: "Troll/Escalation"
                    },
                    { 
                      handle: "@social_buster_veritas", 
                      content: "The Ministry of Power needs a battery change. Indiranagar dark for 12 hours. Veritas verified. #AccountabilityNow", 
                      time: "12h ago",
                      type: "Troll/Escalation"
                    },
                    { 
                      handle: "@social_buster_veritas", 
                      content: "Waste piling up in Block A like a monument of inefficiency. Verify on Veritas. Shame on you Dept of Waste! #DirtyCity", 
                      time: "1d ago",
                      type: "Troll/Escalation"
                    }
                  ].map((post, i) => (
                    <motion.div 
                       key={i}
                       whileHover={{ y: -10 }}
                       className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col gap-4 shadow-2xl"
                    >
                       <div className="flex items-center justify-between">
                          <div className="text-[10px] font-black text-primary uppercase tracking-widest">{post.handle}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase">{post.time}</div>
                       </div>
                       <p className="text-white text-sm font-bold leading-relaxed italic">"{post.content}"</p>
                       <div className="mt-auto px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest w-fit">
                          {post.type}
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      
      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-200 bg-white">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
             <div className="flex flex-col gap-4 max-w-sm text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                   <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Flame className="text-white w-5 h-5" />
                   </div>
                   <span className="text-xl font-bold tracking-tight text-slate-900">VERITAS</span>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  The first AI-native platform for civic governance. Built for India, powered by collective intelligence.
                </p>
             </div>
             
             <div className="flex gap-12">
                <div className="flex flex-col gap-3">
                   <span className="text-xs font-black uppercase tracking-widest text-slate-900">Platform</span>
                   <a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Citizen App</a>
                   <a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Admin Hub</a>
                   <a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">AI Engine</a>
                </div>
                <div className="flex flex-col gap-3">
                   <span className="text-xs font-black uppercase tracking-widest text-slate-900">Safety</span>
                   <a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Verification</a>
                   <a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Integrity</a>
                   <a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Compliance</a>
                </div>
             </div>
          </div>
          <div className="max-w-[1600px] mx-auto mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             <span>© 2026 Veritas Systems</span>
             <div className="flex gap-6">
                <a href="#">Privacy</a>
                <a href="#">Security</a>
                <a href="#">API</a>
             </div>
          </div>
      </footer>
    </div>
  );
}
