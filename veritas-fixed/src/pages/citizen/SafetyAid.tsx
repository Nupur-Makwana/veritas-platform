import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mic, Send, AlertTriangle, HeartPulse, 
  Wifi, ShieldAlert, Navigation, Loader2, Sparkles, MessageCircle, X, Youtube, Phone, Activity
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function SafetyAid() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [showHelplines, setShowHelplines] = useState(false);
  const [showNodes, setShowNodes] = useState(false);
  const [showFeed, setShowFeed] = useState(false);

  const indianHelplines = [
    { name: "National Emergency Number", number: "112" },
    { name: "Police", number: "100" },
    { name: "Fire", number: "101" },
    { name: "Ambulance", number: "102" },
    { name: "Women Helpline", number: "1091" },
    { name: "Child Help Line", number: "1098" },
    { name: "Senior Citizen Helpline", number: "14567" },
    { name: "Road Accident", number: "1073" }
  ];

  const handleAnalyze = async (text: string) => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '' });

      const prompt = `
        You are an Emergency AI Assistant for a civic safety platform.
        The user has provided this description of an emergency or safety situation: "${text}"
        
        Analyze this and provide:
        1. Emergency Category (e.g., Medical, Fire, Electrical, Infrastructure Failure)
        2. Immediate First Aid/Safety Instructions (short, bullet points)
        3. 2-3 Helpful YouTube Video Search Links (as strings like "How to treat a burn" or "CPR instructions")
        4. Urgent Action Needed by Authorities
        5. Estimated Risk Level (low, medium, high, critical)

        Format the response as clear JSON:
        {
          "category": "",
          "instructions": [""],
          "youtubeLinks": [{"title": "", "url": ""}],
          "urgentAction": "",
          "riskLevel": ""
        }
        
        For youtubeLinks urls, use https://www.youtube.com/results?search_query=[query] format.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });
      
      const responseText = response.text;
      
      // Basic JSON extraction
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const jsonData = JSON.parse(responseText.substring(jsonStart, jsonEnd));
      
      setReport(jsonData);
    } catch (err: any) {
      console.error(err);
      setError("AI Node connection failure. Using local backup protocol...");
      // Mock emergency response as fallback
      setReport({
        category: "General Emergency",
        instructions: ["Move to a safe distance", "Alert nearby people", "Wait for emergency units"],
        youtubeLinks: [
          { title: "General Emergency Safety", url: "https://www.youtube.com/results?search_query=emergency+safety+tips" }
        ],
        urgentAction: "Dispatching nearest tactical node",
        riskLevel: "high"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate voice detection
    setTimeout(() => {
      setIsRecording(false);
      setInputText("There's a gas leak near the main market square, people are coughing.");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
      {/* HUD Header */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 bg-slate-900/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Emergency Hub</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">AI Safety Aid Node • Alpha-1</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/40 border border-red-500/30 rounded-full">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-red-400">Tactical Direct Link</span>
           </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
         {/* Welcome Prompt */}
         <div className="flex flex-col items-center text-center gap-4 mb-12">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 shadow-2xl shadow-red-500/10 mb-2">
               <HeartPulse className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter max-w-md">Immediate Assistance AI. Speak or Write your Crisis.</h2>
            <p className="text-slate-400 text-sm font-medium">Verified first-aid protocols delivered via high-frequency neural links.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Side */}
            <div className="flex flex-col gap-6">
                <div className="bg-slate-800/50 rounded-[2.5rem] p-8 border border-white/5 flex flex-col gap-6 relative group border-2 hover:border-primary/20 transition-all">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Speaking Section</div>
                   <button 
                     onClick={startRecording}
                     disabled={isRecording || isAnalyzing}
                     className={`w-full aspect-square max-w-[200px] mx-auto rounded-full flex flex-col items-center justify-center gap-4 transition-all relative ${isRecording ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] border-4 border-white/20' : 'bg-slate-900 border border-white/10 hover:bg-slate-800'}`}
                   >
                      <Mic className={`w-12 h-12 ${isRecording ? 'text-white' : 'text-primary'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{isRecording ? 'Listening...' : 'Push to Talk'}</span>
                      {isRecording && (
                        <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-20" />
                      )}
                   </button>
                   <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-2">Simulated voice detection interface</p>
                </div>

                <div className="bg-slate-800/50 rounded-[2.5rem] p-8 border border-white/5 flex flex-col gap-6 border-2 hover:border-primary/20 transition-all">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Writing Section</div>
                   <textarea 
                     value={inputText}
                     onChange={(e) => setInputText(e.target.value)}
                     placeholder="Describe the situation in detail..."
                     className="bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-sm font-medium text-slate-200 min-h-[150px] outline-none focus:border-primary transition-all resize-none"
                   />
                   <button 
                     onClick={() => handleAnalyze(inputText)}
                     disabled={isAnalyzing || !inputText.trim()}
                     className="w-full h-16 bg-primary rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest shadow-xl shadow-orange-950 active:scale-95 transition-all text-white disabled:opacity-50"
                   >
                      {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Analyze Situation</>}
                   </button>
                </div>
            </div>

            {/* Output Side */}
            <div className="flex flex-col gap-6">
                <AnimatePresence mode="wait">
                   {report ? (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       className="bg-slate-800/50 rounded-[3rem] p-8 border border-white/5 flex flex-col gap-8 h-full shadow-2xl relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl rounded-full" />
                        
                        <div className="flex flex-col gap-2 relative z-10">
                           <div className="flex items-center justify-between">
                              <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${report.riskLevel === 'critical' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-orange-500/20 border-orange-500 text-orange-500'}`}>
                                 Risk: {report.riskLevel}
                              </span>
                              <div className="flex items-center gap-1">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Medical Protocol Active</span>
                              </div>
                           </div>
                           <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white mt-4">{report.category}</h3>
                        </div>

                        <div className="flex flex-col gap-4 relative z-10">
                           <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">First Aid Instructions:</div>
                           <div className="flex flex-col gap-3">
                              {report.instructions.map((inst: string, i: number) => (
                                 <div key={i} className="flex gap-4 items-start bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                                    <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-black text-xs shrink-0">{i+1}</div>
                                    <p className="text-sm font-medium text-slate-300 leading-relaxed">{inst}</p>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="flex flex-col gap-4 relative z-10">
                           <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Visual Demonstration:</div>
                           <div className="grid grid-cols-1 gap-2">
                              {report.youtubeLinks?.map((link: any, i: number) => (
                                 <a 
                                    key={i} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-3 bg-red-500/10 p-3 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all group"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                                       <Youtube className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                       <div className="text-[10px] font-black uppercase text-red-500 tracking-widest">Tutorial Link</div>
                                       <div className="text-xs font-bold text-white group-hover:text-primary transition-colors">{link.title}</div>
                                    </div>
                                 </a>
                              ))}
                           </div>
                        </div>

                        <div className="mt-auto bg-red-500/10 p-6 rounded-[2rem] border border-red-500/20 flex flex-col gap-2 relative z-10">
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500">
                              <ShieldAlert className="w-4 h-4" /> Tactical Alert
                           </div>
                           <p className="text-xs font-black italic text-slate-200">{report.urgentAction}</p>
                        </div>

                        <button 
                           onClick={() => setReport(null)}
                           className="w-full py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                           Scan New Incident
                        </button>
                     </motion.div>
                   ) : (
                     <div className="bg-slate-800/20 rounded-[3rem] p-10 border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-6 h-full min-h-[400px]">
                        <div className="w-16 h-16 rounded-full border-2 border-white/5 flex items-center justify-center text-slate-700">
                           <Loader2 className={`w-8 h-8 ${isAnalyzing ? 'animate-spin text-primary' : ''}`} />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 italic">Neural Link Offline</h4>
                           <p className="text-xs font-bold text-slate-600 max-w-[200px]">Awaiting incident telemetry for tactical analysis.</p>
                        </div>
                     </div>
                   )}
                </AnimatePresence>
            </div>
         </div>

         {/* Navigation Extras */}
         <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
               onClick={() => setShowNodes(true)}
               className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
            >
               <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Navigation className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Find Nearby</div>
                  <div className="text-xs font-black text-white uppercase group-hover:text-primary transition-colors">Safety Nodes</div>
               </div>
            </div>
            <div 
               onClick={() => setShowHelplines(true)}
               className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
            >
               <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                  <ShieldAlert className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official</div>
                  <div className="text-xs font-black text-white uppercase group-hover:text-primary transition-colors">Police Override</div>
               </div>
            </div>
            <div 
               onClick={() => setShowFeed(true)}
               className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
            >
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Sparkles className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public</div>
                  <div className="text-xs font-black text-white uppercase group-hover:text-primary transition-colors">Live Feed</div>
               </div>
            </div>
         </div>

         {/* Helplines Modal */}
         <AnimatePresence>
            {showHelplines && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
               >
                  <motion.div 
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-slate-900 w-full max-w-md rounded-[3rem] border border-white/10 p-10 relative overflow-hidden"
                  >
                     <button onClick={() => setShowHelplines(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                     </button>
                     <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                           <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-2">
                              <Phone className="w-6 h-6" />
                           </div>
                           <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Indian Helplines</h2>
                           <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Verified Official Sync Links</p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {indianHelplines.map((h, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                 <div className="text-sm font-bold text-slate-300">{h.name}</div>
                                 <div className="text-lg font-black text-primary italic tracking-tight">{h.number}</div>
                              </div>
                           ))}
                        </div>
                        <button className="w-full py-5 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-950 active:scale-95 transition-all">
                           Auto Call Primary Hub
                        </button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Nearby Nodes Modal */}
         <AnimatePresence>
            {showNodes && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
               >
                  <motion.div 
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-slate-900 w-full max-w-2xl rounded-[3.5rem] border border-white/10 overflow-hidden relative shadow-2xl"
                  >
                     <button onClick={() => setShowNodes(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors z-20">
                        <X className="w-6 h-6" />
                     </button>
                     <div className="h-[400px] bg-slate-800 relative">
                        {/* Mock Map View */}
                        <img 
                           src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
                           className="w-full h-full object-cover opacity-30 grayscale" 
                           alt="Mock Map"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                        
                        {/* Map Points */}
                        <div className="absolute top-1/2 left-1/3 w-8 h-8 flex items-center justify-center">
                           <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                           <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg border border-white" />
                        </div>
                        <div className="absolute top-1/3 right-1/4 w-8 h-8 flex items-center justify-center">
                           <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                           <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg border border-white" />
                        </div>
                        <div className="absolute bottom-1/4 right-1/2 w-8 h-8 flex items-center justify-center">
                           <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
                           <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg border border-white" />
                        </div>

                        <div className="absolute bottom-10 left-10 flex flex-col gap-1">
                           <h3 className="text-2xl font-black italic tracking-tighter uppercase">Nearby Support Centers</h3>
                           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">3 Tactical Units Detected</p>
                        </div>
                     </div>
                     <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div className="text-[9px] font-black uppercase text-emerald-500 mb-1">Police Station</div>
                           <div className="text-xs font-bold text-white">Central Sector 4</div>
                           <div className="text-[10px] font-bold text-slate-500 mt-1">0.8 KM • Open 24/7</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div className="text-[9px] font-black uppercase text-blue-500 mb-1">HOSPITAL</div>
                           <div className="text-xs font-bold text-white">Veritas City Care</div>
                           <div className="text-[10px] font-bold text-slate-500 mt-1">1.2 KM • Emergency Active</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div className="text-[9px] font-black uppercase text-red-500 mb-1">FIRE UNIT</div>
                           <div className="text-xs font-bold text-white">Tactical Fire Station</div>
                           <div className="text-[10px] font-bold text-slate-500 mt-1">2.4 KM • Responding</div>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Public Feed Modal */}
         <AnimatePresence>
            {showFeed && (
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
               >
                  <motion.div 
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-slate-900 w-full max-w-lg rounded-[3rem] border border-white/10 flex flex-col h-[600px] relative overflow-hidden"
                  >
                     <button onClick={() => setShowFeed(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors z-20">
                        <X className="w-6 h-6" />
                     </button>
                     
                     <div className="p-8 border-b border-white/5">
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                           Public Live Feed 
                           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Connect with the Community</p>
                     </div>

                     <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                        {[
                          { user: "Rahul S.", msg: "Is anyone near Sector 12? Large smoke detected.", time: "2m ago", type: "hazard" },
                          { user: "Priya K.", msg: "Water pressure back in Indiranagar. AI dispatch worked!", time: "5m ago", type: "update" },
                          { user: "System", msg: "Strategic units deployed to Main Market Square.", time: "10m ago", type: "system" }
                        ].map((m, i) => (
                           <div key={i} className={`p-4 rounded-2xl border flex flex-col gap-2 ${m.type === 'hazard' ? 'bg-red-500/10 border-red-500/20' : m.type === 'system' ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/5'}`}>
                              <div className="flex items-center justify-between">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{m.user}</span>
                                 <span className="text-[9px] font-bold text-slate-500 tracking-tighter">{m.time}</span>
                              </div>
                              <p className="text-sm font-medium text-slate-200">{m.msg}</p>
                           </div>
                        ))}
                     </div>

                     <div className="p-8 border-t border-white/5 bg-slate-950/50">
                        <div className="flex gap-4">
                           <input 
                              placeholder="Broadcast to community..."
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white"
                           />
                           <button className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-orange-950 active:scale-95 transition-all">
                              <Send className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </main>
    </div>
  );
}
