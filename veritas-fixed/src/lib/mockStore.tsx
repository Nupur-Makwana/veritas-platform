import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  signInAnonymously,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

export interface Complaint {
  id: string;
  citizenId: string;
  title: string;
  description?: string;
  summary: string;
  aiSummary?: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'under_process' | 'solved' | 'rejected';
  trackId: string;
  imageUrl?: string;
  fakeScore: number;
  fakeReason?: string;
  workerId?: string;
  assignmentSuggestion?: string;
  assignmentType?: 'ai' | 'manual';
  createdAt: number;
  updatedAt: number;
  address?: string;
  block?: string;
  eventType?: string;
}

export interface Worker {
  id: string;
  name: string;
  department: string;
  status: 'assigned' | 'free';
  tasksCount: number;
}

interface MockStore {
  user: FirebaseUser | null;
  profile: any;
  complaints: Complaint[];
  workers: Worker[];
  language: Language;
  loading: boolean;
  t: (key: keyof typeof translations['en']) => string;
  setLanguage: (lang: Language) => void;
  login: (id: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  addComplaint: (complaint: Partial<Complaint>) => Promise<void>;
  updateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
  updateWorker: (id: string, updates: Partial<Worker>) => Promise<void>;
}

const StoreContext = createContext<MockStore | null>(null);

export const MockStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('agneya_lang') as Language) || 'en';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        
        // Try to recover mock session from storage
        const saved = localStorage.getItem('agneya_session');
        if (saved) {
          try {
            const { profile: savedProfile } = JSON.parse(saved);
            // If the saved profile matches our current Firebase UID, we're good
            if (savedProfile.uid === fbUser.uid) {
              setProfile(savedProfile);
              setLoading(false);
              return;
            }
          } catch (e) {
            localStorage.removeItem('agneya_session');
          }
        }

        // Otherwise fetch from Firestore
        const profileDoc = await getDoc(doc(db, 'profiles', fbUser.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        } else {
          // Default guest profile for anonymous users
          const guestProfile = { 
            uid: fbUser.uid, 
            role: 'citizen', 
            name: 'Guest Citizen',
            language
          };
          setProfile(guestProfile);
        }
      } else {
        // Automatically sign in anonymously to ensure we have an identity for Firestore
        signInAnonymously(auth).catch(err => {
          console.error("Firebase Anonymous Auth failed:", err);
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Only start listeners if we are authenticated AND have a profile loaded
    if (!auth.currentUser || !profile) {
      setComplaints([]);
      return;
    }

    let q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));

    // Secure list queries are enforced by rules
    if (profile.role === 'citizen') {
      q = query(collection(db, 'complaints'), where('citizenId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
      setComplaints(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'complaints');
    });

    return () => unsubscribe();
  }, [user, profile]);

  useEffect(() => {
    if (!auth.currentUser || profile?.role !== 'admin') return;

    // Seed workers if none exist (for demo purposes)
    const seedWorkers = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'system', 'seeded'));
        if (!snapshot.exists()) {
          const demoWorkers = [
            { id: 'worker_1', name: 'R. Shinde', department: 'Response', status: 'free', tasksCount: 0 },
            { id: 'worker_2', name: 'John Doe', department: 'Roadways', status: 'free', tasksCount: 0 },
            { id: 'worker_3', name: 'Anita Kumar', department: 'Sanitation', status: 'free', tasksCount: 0 },
            { id: 'worker_4', name: 'K. Rahul', department: 'Electricity', status: 'free', tasksCount: 0 }
          ];

          for (const w of demoWorkers) {
            await setDoc(doc(db, 'workers', w.id), w);
          }
          await setDoc(doc(db, 'system', 'seeded'), { date: Date.now() });
        }
      } catch (error) {
        console.error('Seeding failed:', error);
      }
    };

    seedWorkers();
  }, [user, profile]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, 'workers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Worker));
      setWorkers(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'workers');
    });

    return () => unsubscribe();
  }, [user, profile]); // Added profile to trigger on role change

  useEffect(() => {
    localStorage.setItem('agneya_lang', language);
  }, [language]);

  const t = (key: keyof typeof translations['en']) => {
    return (translations[language] as any)[key] || translations['en'][key];
  };

  const login = async (id: string, password: string, role: string) => {
    const trimmedId = id.trim();
    const trimmedPass = password.trim();

    const validCreds: Record<string, { pass: string, role: string, name: string }> = {
      'TEAM_AGNEYA_CITIZEN': { pass: 'TEAM@4', role: 'citizen', name: 'Citizen Agent' },
      'TEAM_AGNEYA_FIELD WORKER': { pass: 'FIELD@4', role: 'worker', name: 'Field Division Officer' },
      'TEAM_AGNEYA_CONTROL': { pass: 'CONTROL@4', role: 'admin', name: 'Command Center' }
    };

    if (!validCreds[trimmedId] || validCreds[trimmedId].pass !== trimmedPass || validCreds[trimmedId].role !== role) {
      throw new Error('Invalid ID or Password for the selected role.');
    }

    // Use actual Firebase identity
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
    
    const fbUser = auth.currentUser!;
    const now = Date.now();
    const newProfile = {
      uid: fbUser.uid,
      name: validCreds[trimmedId].name,
      role: validCreds[trimmedId].role,
      language,
      createdAt: now,
      updatedAt: now
    };

    // Write to Firestore with server timestamps for rules compliance
    await setDoc(doc(db, 'profiles', fbUser.uid), {
      ...newProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    setUser(fbUser);
    setProfile(newProfile);
    localStorage.setItem('agneya_session', JSON.stringify({ user: fbUser, profile: newProfile }));
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('agneya_session');
    signOut(auth).catch(() => {}); // Try to sign out from firebase just in case
  };

  const addComplaint = async (data: Partial<Complaint>) => {
    if (!user) return;

    try {
      const complaintsRef = collection(db, 'complaints');
      const newDocRef = doc(complaintsRef);
      const id = newDocRef.id;

      const complaintData = {
        id: id,
        citizenId: user.uid,
        title: data.title || 'Untitled Issue',
        summary: data.summary || '',
        category: data.category || 'Ministry of Infrastructure',
        severity: data.severity || 'medium',
        status: 'reported',
        trackId: 'AG-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        fakeScore: data.fakeScore || 0.1,
        fakeReason: data.fakeReason || 'Verified via citizen network.',
        imageUrl: data.imageUrl || `https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=1000&auto=format&fit=crop`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...data
      };

      await setDoc(newDocRef, complaintData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'complaints');
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      const ref = doc(db, 'complaints', id);
      await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `complaints/${id}`);
    }
  };

  const updateWorker = async (id: string, updates: Partial<Worker>) => {
    try {
      const ref = doc(db, 'workers', id);
      await updateDoc(ref, {
        ...updates
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `workers/${id}`);
    }
  };

  return (
    <StoreContext.Provider value={{ 
      user, profile, complaints, workers, language, loading, t, setLanguage, login, logout, addComplaint, updateComplaint, updateWorker 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useMockStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useMockStore must be used within MockStoreProvider');
  return context;
};
