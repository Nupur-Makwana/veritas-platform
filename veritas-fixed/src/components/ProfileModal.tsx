import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Shield, MapPin, Calendar, LogOut, Verified, Award, Globe } from 'lucide-react';
import { useMockStore } from '../lib/mockStore';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onLogout: () => void;
}

export default function ProfileModal({ isOpen, onClose, profile, onLogout }: ProfileModalProps) {
  const { t, language, setLanguage } = useMockStore();
  if (!isOpen) return null;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'bn', name: 'Bengali' },
    { code: 'mr', name: 'Marathi' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header/Cover */}
          <div className="h-20 bg-slate-100 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white shadow-lg rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Picture */}
          <div className="px-6 -mt-8 relative flex items-end justify-between">
            <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-xl border border-slate-100">
              <div className="w-full h-full bg-slate-900 rounded-[0.9rem] flex items-center justify-center text-white text-xl font-black italic border border-white/10">
                {profile?.name?.charAt(0)}
              </div>
            </div>
            <div className="pb-1">
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                profile?.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 
                profile?.role === 'worker' ? 'bg-emerald-100 text-emerald-700' : 
                'bg-orange-100 text-orange-700'
              }`}>
                {profile?.role === 'admin' ? t('admin') : profile?.role === 'worker' ? t('worker') : t('citizen')} Node
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-0.5">
              <h2 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{profile?.name}</h2>
              <p className="text-slate-400 font-bold text-[8px] uppercase tracking-widest">{t('authorizedVia')}</p>
            </div>

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block px-1">{t('selectLanguage')}</label>
              <div className="flex flex-wrap gap-1.5">
                 {languages.map(l => (
                   <button 
                    key={l.code}
                    onClick={() => setLanguage(l.code as any)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${language === l.code ? 'bg-primary border-primary text-white shadow-lg shadow-orange-100' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'}`}
                   >
                     {l.name}
                   </button>
                 ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('emailProtocol')}</span>
                  <span className="text-xs font-bold text-slate-900">{profile?.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('clearanceId')}</span>
                  <span className="text-xs font-bold text-slate-900 font-mono tracking-tighter uppercase">{profile?.uid?.substring(0, 12)}</span>
                </div>
              </div>
            </div>

            {/* Stats/Badges */}
            <div className="flex gap-3">
              <div className="flex-1 p-3 bg-primary/5 rounded-xl border border-primary/10 flex flex-col items-center text-center">
                 <Verified className="w-4 h-4 text-primary mb-1" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-primary">{t('trustScore')}</span>
                 <span className="text-lg font-black text-slate-900">9.8</span>
              </div>
              <div className="flex-1 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col items-center text-center">
                 <Award className="w-4 h-4 text-emerald-600 mb-1" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">{t('badges')}</span>
                 <span className="text-lg font-black text-slate-900">12</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                onClick={onLogout}
                className="flex-1 py-4 bg-slate-900 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/20 active:scale-95"
              >
                <LogOut className="w-4 h-4" /> {t('terminateSession')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
