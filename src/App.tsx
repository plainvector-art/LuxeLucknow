import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore 
} from 'firebase/firestore';

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import IntroReveal from './components/IntroReveal';
import MoodBoard from './components/MoodBoard';
import KeySettingsModal from './components/KeySettingsModal';

// Page Imports
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import SalonProfile from './pages/SalonProfile';
import AiConcierge from './pages/AiConcierge';
import BeautyPlanner from './pages/BeautyPlanner';

// Types
import type { Salon } from './types';

// --- Firebase Configuration & Initialization ---
declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "mock-api-key-luxelucknow",
      authDomain: "luxelucknow.firebaseapp.com",
      projectId: "luxelucknow",
      storageBucket: "luxelucknow.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:123456789"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'luxelucknow-app-id';

export default function LuxeLucknowApp() {
  const [user, setUser] = useState<any>(null);
  const [activePage, setActivePage] = useState('home'); // home, marketplace, profile, concierge, planner
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  
  // Custom Vibe pre-filtering from onboarding MoodBoard
  const [vibeFilterTags, setVibeFilterTags] = useState<string[]>([]);
  const [showMoodBoard, setShowMoodBoard] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  // Gemini API key settings state
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [showKeySettings, setShowKeySettings] = useState(false);

  // Firebase Auth & Scroll Effect
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    
    return () => {
      unsubscribe();
    };
  }, []);

  const navigateTo = (page: string, data: Salon | null = null) => {
    if (data) setSelectedSalon(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePage(page);
  };

  const handleSaveKey = (key: string) => {
    localStorage.setItem('GEMINI_API_KEY', key);
    setGeminiKey(key);
    setShowKeySettings(false);
  };

  const handleMoodBoardComplete = (tags: string[]) => {
    setVibeFilterTags(tags);
    setShowMoodBoard(false);
    navigateTo('marketplace');
  };

  return (
    <div className="min-h-screen bg-warm-white text-charcoal font-sans selection:bg-gold selection:text-white flex flex-col">
      {/* Intro Entrance reveal */}
      <IntroReveal onDone={() => setIntroDone(true)} />

      {introDone && (
        <>
          {/* Header Navigation */}
          <Navbar 
            activePage={activePage}
            onNavigate={(page) => navigateTo(page)}
            onToggleKeySettings={() => setShowKeySettings(true)}
            user={user}
          />

          {/* Main Application Page Frame */}
          <main className="flex-grow">
            {activePage === 'home' && (
              <Home 
                onNavigate={(page, data) => navigateTo(page, data)}
                onOpenMoodBoard={() => setShowMoodBoard(true)}
              />
            )}
            {activePage === 'marketplace' && (
              <Marketplace 
                onNavigate={(page, data) => navigateTo(page, data)}
                vibeFilterTags={vibeFilterTags}
                onClearVibeTags={() => setVibeFilterTags([])}
              />
            )}
            {activePage === 'profile' && (
              <SalonProfile 
                salon={selectedSalon}
                onBack={() => navigateTo('marketplace')}
              />
            )}
            {activePage === 'concierge' && (
              <AiConcierge 
                onNavigate={(page, data) => navigateTo(page, data)}
                geminiKey={geminiKey}
                onOpenKeyModal={() => setShowKeySettings(true)}
              />
            )}
            {activePage === 'planner' && (
              <BeautyPlanner 
                onNavigate={(page, data) => navigateTo(page, data)}
                geminiKey={geminiKey}
                onOpenKeyModal={() => setShowKeySettings(true)}
              />
            )}
          </main>

          {/* Footer Component */}
          <Footer onNavigate={(page) => navigateTo(page)} />
          
          {/* Moodboard / Vibe swipe overlay */}
          {showMoodBoard && (
            <MoodBoard 
              onComplete={handleMoodBoardComplete}
              onClose={() => setShowMoodBoard(false)}
            />
          )}

          {/* Key settings configuration modal */}
          {showKeySettings && (
            <KeySettingsModal 
              currentKey={geminiKey}
              onSave={handleSaveKey}
              onClose={() => setShowKeySettings(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
