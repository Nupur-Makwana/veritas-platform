import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Camera, Upload, Send, Sparkles, AlertCircle, Loader2, X, AlertTriangle } from 'lucide-react';
import { useMockStore } from '../../lib/mockStore';
import { analyzeComplaint, validateContent } from '../../lib/ai';

export default function FileComplaint() {
  const { profile, addComplaint, t } = useMockStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [address, setAddress] = useState('');
  const [block, setBlock] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [validationPopup, setValidationPopup] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [bypassValidation, setBypassValidation] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles: any) => {
      const f = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    }
  } as any);

  const handleSubmit = async (e?: any, forced = false) => {
    if (e) e.preventDefault();
    if (!profile) return;
    
    if (mode === 'manual' && (!eventTitle || !description || !eventType || !address || !block)) {
      setError('Please fill all tactical input fields.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Content Validation Step
      if (!forced && !bypassValidation) {
        const vResult = await validateContent(description);
        if (vResult.isInappropriate) {
          setValidationResult(vResult);
          setValidationPopup(true);
          setLoading(false);
          return;
        }
      }

      let complaintData: any = {
        citizenId: profile.uid,
      };

      if (mode === 'ai') {
        if (!preview) throw new Error("Please upload an image for AI analysis.");
        const aiAnalysis = await analyzeComplaint(description || "Civic issue", preview);
        complaintData = {
          ...complaintData,
          ...aiAnalysis,
          imageUrl: preview 
        };
      } else {
        complaintData = {
          ...complaintData,
          title: eventTitle,
          summary: description,
          description: description,
          category: eventType,
          severity: 'medium',
          imageUrl: preview || null,
          address: address,
          block: block,
          assignmentType: 'manual'
        };
      }

      await addComplaint(complaintData);
      navigate('/citizen');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 z-50 sticky top-0">
        <button onClick={() => navigate('/citizen')} className="w-10 h-10 -ml-2 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="ml-2">
           <h1 className="text-xl font-bold tracking-tight text-secondary leading-none">{t('reportIncident')}</h1>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Satellite Link: {profile?.uid?.substring(0, 8)}</p>
        </div>
      </nav>

      <main className="flex-1 p-4 sm:p-6 flex flex-col gap-5 max-w-xl mx-auto w-full mb-8">
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col gap-5">
          {/* Mode Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              type="button"
              onClick={() => setMode('ai')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mode === 'ai' ? 'bg-white text-primary shadow-lg shadow-orange-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Sparkles className="w-4 h-4" /> {t('aiAssisted')}
            </button>
            <button 
              type="button"
              onClick={() => setMode('manual')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t('manualInput')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Visual Intelligence Input */}
            <div className="flex flex-col gap-3">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('photo')}</label>
               <div 
                 {...getRootProps()} 
                 className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all relative overflow-hidden group ${isDragActive ? 'border-primary bg-orange-50/50' : 'border-slate-200 hover:border-primary/40 bg-slate-50/30'}`}
               >
                  <input {...getInputProps()} />
                  {preview ? (
                    <div className="relative inline-block">
                      <img src={preview} alt="Preview" className="w-40 sm:w-48 h-40 sm:h-48 object-cover rounded-2xl shadow-2xl border-4 border-white" />
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-lg shadow-lg ring-2 ring-white">
                         <Camera className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white shadow-lg shadow-slate-200 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                         <Upload className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">{t('fileNew')}</p>
                        <p className="text-[10px] text-slate-400 font-medium max-w-[200px] mx-auto leading-relaxed">AI will automatically decode classification and severity.</p>
                      </div>
                    </div>
                  )}
               </div>
            </div>

            {mode === 'manual' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('event')}</label>
                  <input 
                    className="input-field" 
                    placeholder="e.g. Water Leakage" 
                    value={eventTitle}
                    onChange={e => setEventTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('type')}</label>
                  <select 
                    className="input-field px-4"
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="Road">Road/Infrastructure</option>
                    <option value="Electricity">Electricity/Power</option>
                    <option value="Water">Water/Sanitation</option>
                    <option value="Public">Public Nuisance</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('address')}</label>
                  <input 
                    className="input-field" 
                    placeholder="Exact Location" 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('block')}</label>
                  <input 
                    className="input-field" 
                    placeholder="Sector/Block" 
                    value={block}
                    onChange={e => setBlock(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* AI Insights Note */}
            <AnimatePresence mode="wait">
               {mode === 'ai' && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="p-5 rounded-3xl bg-orange-50 border border-orange-100 flex items-start gap-4"
                 >
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <Sparkles className="text-primary w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest">Processing Node</div>
                      <p className="text-xs text-orange-900 font-medium leading-relaxed">
                        Veritas Vision models will process pixels for rapid dispatch routing.
                      </p>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Description Form Field */}
            <div className="flex flex-col gap-3">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Signal Context</label>
               <textarea 
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 rows={3}
                 placeholder={mode === 'ai' ? "What else should the AI know?" : "Provide detailed evidence and location description..."}
                 className="input-field resize-none h-32 p-4 text-sm"
               />
            </div>

            {error && (
              <div className="p-5 rounded-3xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 <span className="text-xs font-bold">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-5 text-sm gap-3 mt-4"
            >
               {loading ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   AI Decoding...
                 </>
               ) : (
                 <>
                   <Send className="w-5 h-5" />
                   {t('submit')}
                 </>
               )}
            </button>
          </form>
        </div>

        {/* AI Validation Warning Popup */}
        <AnimatePresence>
          {validationPopup && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white w-full max-w-sm rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col gap-6 shadow-2xl"
               >
                  <div className="flex flex-col gap-3">
                     <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-1">
                        <AlertTriangle className="w-6 h-6" />
                     </div>
                     <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-slate-900">Irregularity Detected</h2>
                     <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
                        Veritas AI has detected a potential violation in your report context.
                     </p>
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col gap-2">
                     <div className="text-[9px] font-black uppercase tracking-widest text-red-600">AI Flag Reason:</div>
                     <p className="text-xs font-bold text-red-900">{validationResult?.reason}</p>
                     
                     <div className="mt-1 pt-3 border-t border-red-100">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Suggestion:</div>
                        <p className="text-[10px] text-slate-600 italic font-medium leading-relaxed">
                           {validationResult?.suggestion}
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <button 
                        onClick={() => setValidationPopup(false)}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-800 transition-all"
                     >
                        Refine Report
                     </button>
                     <button 
                        onClick={() => {
                          setValidationPopup(false);
                          setBypassValidation(true);
                          handleSubmit(null, true);
                        }}
                        className="w-full py-3 text-slate-400 font-bold uppercase tracking-widest text-[8px] hover:text-red-500 transition-all"
                     >
                        Submit Anyway (Flagged as Anomaly)
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
