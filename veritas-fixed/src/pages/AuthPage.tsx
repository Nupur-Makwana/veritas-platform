import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Briefcase, ShieldCheck, LogIn, ChevronRight, Globe, Loader2, Flame } from 'lucide-react';
import { useMockStore } from '../lib/mockStore';

type Role = 'citizen' | 'worker' | 'admin' | null;

export default function AuthPage() {
  const { login, language, setLanguage, t } = useMockStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(false);

  const [verifying, setVerifying] = useState(false);
  const [citizenId, setCitizenId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!role) return;
    if (!citizenId || !password) {
      setError('Please enter both ID and Password');
      return;
    }
    setError(null);
    setLoading(true);
    if (role === 'citizen') setVerifying(true);
    
    try {
      await login(citizenId, password, role);
      navigate(`/${role}`);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const getCredsForRole = () => {
    if (role === 'citizen') return { id: 'TEAM_AGNEYA_CITIZEN', pass: 'TEAM@4' };
    if (role === 'worker') return { id: 'TEAM_AGNEYA_FIELD WORKER', pass: 'FIELD@4' };
    if (role === 'admin') return { id: 'TEAM_AGNEYA_CONTROL', pass: 'CONTROL@4' };
    return null;
  };

  const creds = getCredsForRole();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
        
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-orange-500/40">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tighter uppercase">VERITAS</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-white text-6xl font-black leading-[1.05] tracking-tight mb-8 uppercase italic">
            Bringing <br/><span className="text-primary tracking-tighter">Truth To Data.</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed">
            Unifying citizen intelligence with municipal action through advanced humanitarian workforce automation.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Veritas Secure Terminal: v3.1.0
        </div>
      </div>

      <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-y-auto bg-slate-50">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-md mx-auto w-full bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{t('welcome')}</h1>
              <p className="text-slate-400 font-medium text-sm">{t('selectOperationalClearance')}</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] font-black uppercase text-slate-400 hover:text-primary tracking-widest border border-slate-100 px-3 py-2 rounded-xl transition-colors"
            >
              {t('back')}
            </button>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('selectLanguage')}</label>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'en', name: 'English' },
                { code: 'hi', name: 'Hindi' },
                { code: 'kn', name: 'Kannada' },
                { code: 'bn', name: 'Bengali' },
                { code: 'mr', name: 'Marathi' },
                { code: 'te', name: 'Telugu' },
                { code: 'ta', name: 'Tamil' }
              ].map(l => (
                <button
                   key={l.code}
                   onClick={() => setLanguage(l.code as any)}
                   className={`px-4 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest border transition-all flex items-center gap-2 ${language === l.code ? 'border-primary bg-orange-50 text-primary shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('selectRole')}</label>
             <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'citizen', icon: User, label: t('citizen'), desc: t('citizenDesc') },
                  { id: 'worker', icon: Briefcase, label: t('worker'), desc: t('workerDesc') },
                  { id: 'admin', icon: ShieldCheck, label: t('admin'), desc: t('adminDesc') }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id as Role);
                      setError(null);
                    }}
                    className={`flex items-center gap-5 p-5 rounded-2xl border transition-all text-left relative overflow-hidden group ${role === r.id ? 'border-primary bg-orange-50/50 ring-4 ring-orange-100' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200'}`}
                  >
                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-all ${role === r.id ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>
                      <r.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className={`font-black text-sm uppercase tracking-tight ${role === r.id ? 'text-primary' : 'text-slate-900'}`}>{r.label}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{r.desc}</div>
                    </div>
                    {role === r.id && <div className="ml-auto bg-primary text-white p-1 rounded-full"><ChevronRight className="w-4 h-4" /></div>}
                  </button>
                ))}
             </div>
          </div>

          {role && (
            <div className="flex flex-col gap-4 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">{t('idLabel')}</label>
                  <input 
                    type="text" 
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    placeholder={t('enterId')}
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:border-primary focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">{t('passwordLabel')}</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:border-primary focus:ring-4 focus:ring-orange-50 outline-none transition-all text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              {error && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{error}</p>
              )}

              {creds && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em] mb-1">{t('testCredentials')}</p>
                  <code className="text-[10px] font-mono font-bold text-slate-600 block">ID: {creds.id}</code>
                  <code className="text-[10px] font-mono font-bold text-slate-600 block">PASS: {creds.pass}</code>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!role || loading}
            className="w-full btn-primary py-5 text-sm font-black tracking-widest gap-3 shadow-xl shadow-orange-200"
          >
            {loading ? (
               <div className="flex items-center gap-3">
                 <Loader2 className="w-5 h-5 animate-spin" />
                 {verifying ? 'ENCRYPTED DIGILOCKER SYNC...' : 'INITIALIZING NODE...'}
               </div>
            ) : (
               <>
                 <LogIn className="w-5 h-5 opacity-50" />
                 {t('login')}
               </>
            )}
          </button>
          
          <div className="mt-10 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
              Access managed by Veritas SecureAuth Proto &copy; 2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
