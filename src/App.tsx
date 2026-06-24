import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Star, Calendar, Clock, 
  ChevronRight, Heart, Sparkles, Filter, 
  User, Loader2, CheckCircle2, Shield, Settings, Key
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore 
} from 'firebase/firestore';

// --- Firebase Configuration & Initialization ---
// Fallback to a mock config so initialization does not throw if __firebase_config is missing
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


// --- Mock Data ---
const LUCKNOW_AREAS = ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar', 'Ashiyana'];

interface Salon {
  id: string;
  name: string;
  area: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  image: string;
  services: string[];
  about: string;
  highlights: string[];
}

const MOCK_SALONS: Salon[] = [
  {
    id: 's1',
    name: 'Aura Luxury Salon & Spa',
    area: 'Gomti Nagar',
    rating: 4.9,
    reviews: 342,
    priceLevel: '$$$',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80',
    services: ['Bridal Makeup', 'Advanced Hair Coloring', 'Luxury Spa'],
    about: 'Experience the pinnacle of luxury beauty in the heart of Gomti Nagar. Our internationally trained stylists use only premium products to deliver bespoke transformations.',
    highlights: ['Premium Products', 'Valet Parking', 'Private Bridal Suite']
  },
  {
    id: 's2',
    name: 'The Glamour Room',
    area: 'Hazratganj',
    rating: 4.7,
    reviews: 215,
    priceLevel: '$$',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    services: ['Haircut & Styling', 'Party Makeup', 'Nail Art'],
    about: 'A modern, chic space offering the latest trends in beauty. Perfect for a quick glow-up before a night out in Hazratganj.',
    highlights: ['Trendy Styles', 'Quick Service', 'Central Location']
  },
  {
    id: 's3',
    name: 'Serenity Wellness Lounge',
    area: 'Indira Nagar',
    rating: 4.8,
    reviews: 189,
    priceLevel: '$$$',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    services: ['Ayurvedic Spa', 'Facials', 'Deep Tissue Massage'],
    about: 'Escape the city noise. We specialize in holistic wellness and rejuvenating treatments using organic, cruelty-free ingredients.',
    highlights: ['Organic Products', 'Quiet Ambience', 'Expert Therapists']
  },
  {
    id: 's4',
    name: 'Gentleman\'s Grooming Co.',
    area: 'Mahanagar',
    rating: 4.6,
    reviews: 156,
    priceLevel: '$$',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    services: ['Classic Haircut', 'Beard Styling', 'Men\'s Facial'],
    about: 'The premier destination for the modern man. Classic barbering meets contemporary grooming services.',
    highlights: ['Whiskey Bar', 'Hot Towel Shave', 'Experienced Barbers']
  },
  {
    id: 's5',
    name: 'Bridal Studio by Mehak',
    area: 'Gomti Nagar',
    rating: 5.0,
    reviews: 89,
    priceLevel: '$$$$',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
    services: ['HD Bridal Makeup', 'Airbrush Makeup', 'Pre-Bridal Packages'],
    about: 'Exclusive bridal studio dedicated to making your special day flawless. Featured in top Indian wedding magazines.',
    highlights: ['Celebrity MUA', 'Trial Available', 'On-Location Service']
  }
];

// Inject Global Fonts
const injectFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
if (typeof document !== 'undefined') injectFonts();

// --- Gemini API Helper ---
const generateGeminiContent = async (prompt: string, systemInstruction: string, customKey?: string) => {
  const apiKey = customKey || import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || "";
  if (!apiKey) {
    return "API_KEY_MISSING";
  }
  
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.status === 400 || response.status === 403) {
      return "API_KEY_ERROR";
    }
    
    const result = await response.json();
    if (result.candidates && result.candidates.length > 0) {
      return result.candidates[0].content.parts[0].text;
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, our AI services are currently experiencing high demand. Please try again later.";
  }
};

// --- Reusable UI Components ---
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({ children, variant = 'primary', className = '', onClick, disabled, type = 'button' }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: `bg-[#D4AF37] text-white hover:bg-[#B5952F] shadow-lg hover:shadow-xl`,
    secondary: `bg-white text-[#111827] border border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37]`,
    dark: `bg-[#111827] text-white hover:bg-gray-800`,
    ghost: `bg-transparent text-[#111827] hover:bg-gray-100`
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Main Application Component ---
export default function LuxeLucknowApp() {
  const [user, setUser] = useState<any>(null);
  const [activePage, setActivePage] = useState('home'); // home, marketplace, profile, concierge, planner
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Gemini key config states
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [showKeySettings, setShowKeySettings] = useState(false);

  // Firebase Auth Effect
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
    
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
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
    alert('Gemini API Key saved successfully for your session!');
  };

  // --- Navigation Component ---
  const Navbar = () => (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || activePage !== 'home' ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigateTo('home')}
        >
          <Sparkles className={`w-6 h-6 ${isScrolled || activePage !== 'home' ? 'text-[#D4AF37]' : 'text-white group-hover:text-[#D4AF37] transition-colors'}`} />
          <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled || activePage !== 'home' ? 'text-[#111827]' : 'text-white'}`}>
            LuxeLucknow
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigateTo('marketplace')} className={`font-medium text-sm hover:text-[#D4AF37] transition-colors cursor-pointer ${isScrolled || activePage !== 'home' ? 'text-gray-600' : 'text-white/90'}`}>Explore</button>
          <button onClick={() => navigateTo('concierge')} className={`font-medium text-sm hover:text-[#D4AF37] transition-colors cursor-pointer ${isScrolled || activePage !== 'home' ? 'text-gray-600' : 'text-white/90'}`}>AI Concierge</button>
          <button onClick={() => navigateTo('planner')} className={`font-medium text-sm hover:text-[#D4AF37] transition-colors cursor-pointer ${isScrolled || activePage !== 'home' ? 'text-gray-600' : 'text-white/90'}`}>Beauty Planner</button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowKeySettings(!showKeySettings)} 
            title="Configure Gemini API Key"
            className={`p-2 rounded-full cursor-pointer hover:bg-gray-100/20 transition-all ${isScrolled || activePage !== 'home' ? 'text-gray-600 hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isScrolled || activePage !== 'home' ? 'bg-gray-100' : 'bg-white/20 backdrop-blur-sm'}`}>
                <User className={`w-4 h-4 ${isScrolled || activePage !== 'home' ? 'text-gray-600' : 'text-white'}`} />
              </div>
            </div>
          ) : (
            <Button variant={isScrolled || activePage !== 'home' ? 'dark' : 'secondary'} className="!py-2 !px-4 text-sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );

  // --- API Key Modal Settings ---
  const KeySettingsModal = () => {
    const [tempKey, setTempKey] = useState(geminiKey);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl relative">
          <h3 className="font-serif text-2xl text-gray-900 mb-2 flex items-center gap-2">
            <Key className="w-6 h-6 text-[#D4AF37]" />
            Configure Gemini AI Key
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            LuxeLucknow's Beauty Concierge utilizes Gemini 3.5. Enter your key here to test the dynamic AI suggestions locally. Your key is stored only in your browser's local storage.
          </p>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Gemini API Key</label>
              <input 
                type="password" 
                placeholder="Enter Gemini API Key (AIzaSy...)" 
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" className="flex-1 rounded-xl" onClick={() => setShowKeySettings(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1 rounded-xl" onClick={() => handleSaveKey(tempKey)}>Save Key</Button>
          </div>
        </div>
      </div>
    );
  };

  // --- Pages ---

  const LandingPage = () => (
    <div className="w-full bg-[#FAFAFA] font-sans">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80" 
            alt="Luxury Beauty" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Dark Overlay */}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm tracking-widest uppercase mb-6 animate-fade-in-up">
            Elevate Your Aesthetic
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Beauty, <br/><span className="italic text-[#D4AF37]">Personalized by AI.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 font-light max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover Lucknow's most exclusive salons and stylists, curated just for you through the power of advanced artificial intelligence.
          </p>
          
          {/* Main Search Bar */}
          <div className="bg-white p-2 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-auto">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input type="text" placeholder="Service (e.g., Bridal Makeup)" className="w-full outline-none text-gray-700 bg-transparent" />
            </div>
            <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-auto">
              <MapPin className="text-gray-400 w-5 h-5 mr-3" />
              <select className="w-full outline-none text-gray-700 bg-transparent appearance-none">
                <option value="">Any Area in Lucknow</option>
                {LUCKNOW_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
              </select>
            </div>
            <Button onClick={() => navigateTo('marketplace')} className="w-full md:w-auto py-3 px-8 rounded-full ml-auto">
              Find Salons
            </Button>
          </div>
        </div>
      </section>

      {/* Featured AI Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-serif text-[#111827] mb-6">Meet Your AI Beauty Concierge</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Not sure what you need? Describe your occasion, style preferences, and budget. Our Gemini-powered AI will curate a personalized beauty plan and match you with the perfect artists in Lucknow.
              </p>
              <ul className="space-y-4 mb-10">
                {['Personalized Service Recommendations', 'Budget Optimization', 'Style Trend Analysis', 'Smart Salon Matching'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mr-3" /> {item}
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigateTo('concierge')} variant="dark">
                Try AI Concierge <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-3xl transform translate-x-4 translate-y-4"></div>
              <img 
                src="https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&w=800&q=80" 
                alt="AI Concierge App" 
                className="relative z-10 rounded-3xl shadow-xl w-full object-cover aspect-[4/5]"
              />
              <div className="absolute top-8 -left-8 bg-white p-4 rounded-2xl shadow-lg z-20 max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                <p className="text-sm text-gray-800 font-medium">"Based on your skin type and budget, I recommend the HydraFacial at Serenity Lounge."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Salons */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif text-[#111827] mb-2">Curated for Excellence</h2>
              <p className="text-gray-600">Top-rated luxury salons across Lucknow</p>
            </div>
            <button onClick={() => navigateTo('marketplace')} className="text-[#D4AF37] font-medium hover:underline flex items-center cursor-pointer">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_SALONS.slice(0, 3).map(salon => (
              <div 
                key={salon.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigateTo('profile', salon)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-sm font-semibold">
                    <Star className="w-4 h-4 text-[#D4AF37] fill-current mr-1" /> {salon.rating}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-semibold text-[#111827]">{salon.name}</h3>
                    <span className="text-gray-500 text-sm font-medium">{salon.priceLevel}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" /> {salon.area}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {salon.services.slice(0, 2).map(service => (
                      <span key={service} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const MarketplacePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArea, setSelectedArea] = useState('All');
    const [isAiSearching, setIsAiSearching] = useState(false);

    // Filter logic
    const filteredSalons = MOCK_SALONS.filter(salon => {
      const matchesArea = selectedArea === 'All' || salon.area === selectedArea;
      const matchesSearch = salon.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            salon.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesArea && matchesSearch;
    });

    const handleAiSearch = async () => {
      if (!searchQuery) return;
      setIsAiSearching(true);
      setTimeout(() => setIsAiSearching(false), 1500);
    };

    return (
      <div className="pt-24 min-h-screen bg-[#FAFAFA] font-sans pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-serif text-[#111827] mb-4">Discover Luxury Beauty</h1>
            <p className="text-gray-600">Find and book the finest salons and independent stylists in Lucknow.</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-10 sticky top-20 z-40">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <input 
                type="text" 
                placeholder="AI Search: 'Affordable bridal makeup near Gomti Nagar'" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              />
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <select 
                className="px-4 py-3 bg-gray-50 rounded-xl outline-none border-none cursor-pointer whitespace-nowrap min-w-[150px]"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="All">All Areas</option>
                {LUCKNOW_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
              </select>
              
              <Button variant="secondary" className="whitespace-nowrap px-4 py-3 rounded-xl border-gray-100 flex items-center">
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>
            </div>
          </div>

          {isAiSearching ? (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mb-4" />
               <p className="text-gray-600 font-medium">AI is analyzing your request...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSalons.map(salon => (
                <div 
                  key={salon.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigateTo('profile', salon)}
                >
                  <div className="relative h-56 overflow-hidden">
                     <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                     <button 
                       className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white backdrop-blur-md rounded-full transition-colors z-10 cursor-pointer" 
                       onClick={(e) => { e.stopPropagation(); }}
                     >
                       <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
                     </button>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-serif font-semibold text-[#111827] truncate pr-2">{salon.name}</h3>
                      <div className="flex items-center bg-gray-50 px-2 py-1 rounded text-sm font-semibold">
                        <Star className="w-3 h-3 text-[#D4AF37] fill-current mr-1" /> {salon.rating}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> {salon.area}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {salon.services.slice(0, 3).map(service => (
                        <span key={service} className="text-xs bg-[#F5F5F5] text-gray-600 px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                      <span className="text-gray-900 font-medium">{salon.priceLevel}</span>
                      <span className="text-[#D4AF37] font-medium text-sm group-hover:underline">View Profile</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredSalons.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500">
                  No salons found matching your criteria. Try adjusting your search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const SalonProfilePage = () => {
    if (!selectedSalon) return null;

    return (
      <div className="pt-20 min-h-screen bg-[#FAFAFA] font-sans pb-24">
        {/* Gallery Hero */}
        <div className="w-full h-[40vh] md:h-[50vh] relative">
          <img src={selectedSalon.image} alt={selectedSalon.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider rounded mb-3">
              Premium Partner
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">{selectedSalon.name}</h1>
            <div className="flex items-center text-white/90 gap-4">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {selectedSalon.area}, Lucknow</span>
              <span className="flex items-center"><Star className="w-4 h-4 text-[#D4AF37] fill-current mr-1" /> {selectedSalon.rating} ({selectedSalon.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            
            {/* AI Review Summary Widget */}
            <div className="bg-gradient-to-r from-yellow-50/40 to-[#D4AF37]/10 p-6 rounded-2xl border border-[#D4AF37]/20 mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-semibold text-[#111827]">AI Review Summary</h3>
              </div>
              <p className="text-gray-700 italic text-sm leading-relaxed">
                "Customers frequently praise {selectedSalon.name} for its luxurious ambiance and highly skilled staff. The {selectedSalon.services[0]} is consistently mentioned as a standout service. A few reviews note that booking well in advance is required due to high demand."
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-[#111827] mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{selectedSalon.about}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-serif text-[#111827] mb-6">Services & Pricing</h2>
              <div className="space-y-4">
                {selectedSalon.services.map((service, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[#D4AF37]/50 transition-colors cursor-pointer">
                    <div>
                      <h4 className="font-medium text-[#111827]">{service}</h4>
                      <p className="text-sm text-gray-500">45 - 90 mins</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">From ₹{(idx + 1) * 1500}</span>
                      <button className="text-[#D4AF37] p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors cursor-pointer">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-[#111827] mb-6">Highlights</h2>
              <div className="flex flex-wrap gap-3">
                {selectedSalon.highlights.map((highlight, idx) => (
                  <span key={idx} className="px-4 py-2 bg-[#F5F5F5] rounded-full text-sm text-gray-700 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" /> {highlight}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Booking Widget */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-xl font-serif font-semibold text-[#111827] mb-6 border-b border-gray-100 pb-4">Request Appointment</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                  <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] cursor-pointer">
                    {selectedSalon.services.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <input type="date" className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                      <select className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] appearance-none cursor-pointer">
                        <option>10:00 AM</option>
                        <option>01:00 PM</option>
                        <option>04:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => alert("Booking request sent! (Mock implementation)")}>
                Confirm Request
              </Button>
              <p className="text-center text-xs text-gray-500 mt-4">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AiConciergePage = () => {
    const [formData, setFormData] = useState({ occasion: '', budget: '', area: '', preferences: '' });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMessage('');
      setResponse('');

      // Check key
      const activeKey = geminiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
      if (!activeKey) {
        setErrorMessage("API_KEY_MISSING");
        setLoading(false);
        return;
      }
      
      const prompt = `User wants beauty services in Lucknow. Occasion: ${formData.occasion || 'General pampering'}. Budget: ${formData.budget || 'Open'}. Preferred Area: ${formData.area || 'Anywhere'}. Preferences: ${formData.preferences || 'None'}. Provide a luxurious, personalized 2-paragraph recommendation plan and suggest 2 specific types of treatments they should book.`;
      
      const systemInstruction = "You are LuxeLucknow's elite AI Beauty Concierge. Speak with a sophisticated, reassuring, and highly knowledgeable tone. Format the output elegantly using markdown. Do not hallucinate specific salon names, just recommend treatment types and general areas in Lucknow.";

      const aiText = await generateGeminiContent(prompt, systemInstruction, activeKey);
      
      if (aiText === "API_KEY_MISSING") {
        setErrorMessage("API_KEY_MISSING");
      } else if (aiText === "API_KEY_ERROR") {
        setErrorMessage("API_KEY_ERROR");
      } else {
        setResponse(aiText);
      }
      setLoading(false);
    };

    return (
      <div className="pt-24 min-h-screen bg-gradient-to-br from-[#FAFAFA] to-white font-sans pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 mb-4">
              <Sparkles className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h1 className="text-4xl font-serif text-[#111827] mb-4">AI Beauty Concierge</h1>
            <p className="text-gray-600 text-lg">Your personal AI stylist. Tell us what you need, and we'll craft the perfect beauty itinerary in Lucknow.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Input Form */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-fit">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What is the occasion?</label>
                  <input 
                    type="text" 
                    placeholder="e.g., My Wedding, Corporate Gala, Date Night" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    value={formData.occasion} onChange={e => setFormData({...formData, occasion: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget (₹)</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none cursor-pointer"
                    value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}
                  >
                    <option value="">Select Range</option>
                    <option value="Luxury (₹10,000+)">Luxury (₹10,000+)</option>
                    <option value="Premium (₹5,000 - ₹10,000)">Premium (₹5,000 - ₹10,000)</option>
                    <option value="Standard (Under ₹5,000)">Standard (Under ₹5,000)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specific Preferences or Concerns?</label>
                  <textarea 
                    placeholder="e.g., Sensitive skin, prefer organic products, want a dramatic eye look..." 
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none"
                    value={formData.preferences} onChange={e => setFormData({...formData, preferences: e.target.value})}
                  ></textarea>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Consulting AI...</> : 'Generate Beauty Plan'}
                </Button>
              </form>
            </div>

            {/* AI Output Area */}
            <div className="bg-[#111827] p-8 rounded-3xl shadow-xl text-white relative overflow-hidden flex flex-col min-h-[300px]">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              
              <h3 className="font-serif text-2xl mb-6 relative z-10 text-[#D4AF37] flex items-center">
                <Sparkles className="w-5 h-5 mr-2" /> Your Bespoke Plan
              </h3>
              
              <div className="relative z-10 flex-1 flex flex-col justify-center">
                {loading ? (
                  <div className="flex flex-col items-center justify-center text-gray-400 space-y-4 py-12">
                    <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                    <p className="animate-pulse">Analyzing trends and matching services...</p>
                  </div>
                ) : errorMessage === "API_KEY_MISSING" ? (
                  <div className="text-center py-6">
                    <p className="text-yellow-400 font-medium mb-3">Gemini API Key Required</p>
                    <p className="text-sm text-gray-400 mb-6">You need to set a Gemini API Key to use the dynamic AI features.</p>
                    <Button variant="primary" onClick={() => setShowKeySettings(true)} className="w-full">
                      Configure API Key <Key className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : errorMessage === "API_KEY_ERROR" ? (
                  <div className="text-center py-6">
                    <p className="text-red-400 font-medium mb-3">Invalid API Key</p>
                    <p className="text-sm text-gray-400 mb-6">The Gemini API Key provided is invalid or unauthorized. Please check your credentials.</p>
                    <Button variant="primary" onClick={() => setShowKeySettings(true)} className="w-full">
                      Update API Key <Key className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : response ? (
                  <div className="prose prose-invert prose-p:leading-relaxed prose-strong:text-[#D4AF37] text-gray-300 text-sm">
                    {response.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                    
                    <div className="mt-8 pt-6 border-t border-gray-800">
                      <Button variant="primary" onClick={() => navigateTo('marketplace')} className="w-full">
                        View Recommended Salons
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <p>Fill out the details to receive your AI-curated beauty itinerary.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Footer = () => (
    <footer className="bg-[#111827] text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xl font-serif font-bold tracking-tight">LuxeLucknow</span>
          </div>
          <p className="text-gray-400 max-w-sm">
            Elevating the beauty experience in Lucknow through AI-driven personalization and curated luxury salons.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-[#D4AF37]">Explore</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('marketplace')}>Marketplace</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigateTo('concierge')}>AI Concierge</li>
            <li className="hover:text-white cursor-pointer">Trending Styles</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-[#D4AF37]">Legal</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
            <li className="hover:text-white cursor-pointer">For Salons</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        © 2026 LuxeLucknow. Designed for the Future of Beauty.
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans selection:bg-[#D4AF37] selection:text-white">
      <style>{`
        /* Custom Animations to simulate Framer Motion feel */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <Navbar />
      
      <main>
        {activePage === 'home' && <LandingPage />}
        {activePage === 'marketplace' && <MarketplacePage />}
        {activePage === 'profile' && <SalonProfilePage />}
        {activePage === 'concierge' && <AiConciergePage />}
        {activePage === 'planner' && (
          <div className="pt-32 pb-20 text-center min-h-screen">
             <h2 className="text-3xl font-serif mb-4">AI Beauty Planner</h2>
             <p className="text-gray-600 mb-8">Event timeline generation coming in the next update.</p>
             <Button onClick={() => navigateTo('concierge')}>Try AI Concierge Instead</Button>
          </div>
        )}
      </main>

      {showKeySettings && <KeySettingsModal />}

      <Footer />
    </div>
  );
}
