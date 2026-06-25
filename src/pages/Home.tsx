import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, ChevronRight, Star } from 'lucide-react';
import { LUCKNOW_AREAS, MOCK_SALONS } from '../data/salons';
import type { Salon } from '../types';

interface HomeProps {
  onNavigate: (page: string, data?: Salon) => void;
  onOpenMoodBoard: () => void;
}

export default function Home({ onNavigate, onOpenMoodBoard }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const handleSearch = () => {
    onNavigate('marketplace');
  };

  return (
    <div className="w-full bg-warm-white font-sans min-h-screen flex flex-col">
      {/* Editorial Hero Section */}
      <section className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Parallax / Fluid Background */}
        <div className="absolute inset-0 z-0 scale-105">
          <img 
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80" 
            alt="Luxury Beauty Backdrop" 
            className="w-full h-full object-cover opacity-60 brightness-[0.45]"
          />
          {/* Subtle gradient overlay to match Ivory and Charcoal luxury look */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-charcoal/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12 flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block py-1 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-widest uppercase mb-6"
          >
            Curated Beauty & Wellness
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-7xl font-serif text-white mb-6 leading-tight max-w-3xl"
          >
            Aesthetics, <br />
            <span className="italic text-gold font-normal">Personalized by AI.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-white/80 mb-10 font-light max-w-xl"
          >
            Discover Lucknow's most premium salons, stylists, and bespoke treatments, custom tailored for your event or routine.
          </motion.p>
          
          {/* Editorial Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 w-full max-w-3xl border border-gold/15"
          >
            <div className="flex-1 flex items-center px-4 py-2.5 border-b md:border-b-0 md:border-r border-gray-100 w-full">
              <Search className="text-gold w-5 h-5 mr-3 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="What service are you looking for?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none text-charcoal bg-transparent text-sm font-sans"
              />
            </div>
            
            <div className="flex-1 flex items-center px-4 py-2.5 w-full">
              <MapPin className="text-gold w-5 h-5 mr-3 flex-shrink-0" />
              <select 
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full outline-none text-gray-500 bg-transparent text-sm appearance-none cursor-pointer"
              >
                <option value="">Any area in Lucknow</option>
                {LUCKNOW_AREAS.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleSearch} 
              className="w-full md:w-auto py-3.5 px-8 rounded-full bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              Find Salons
            </button>
          </motion.div>

          {/* Vibe matching CTA */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onOpenMoodBoard}
            className="mt-6 text-xs text-white/80 hover:text-gold flex items-center gap-1.5 underline underline-offset-4 cursor-pointer font-medium tracking-wide uppercase transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Swipe to find your signature vibe
          </motion.button>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 cursor-pointer text-white/40 hover:text-white transition-colors"
          onClick={() => {
            const featuredSection = document.getElementById('featured-section');
            featuredSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">Scroll Down</span>
          <div className="w-1.5 h-6 rounded-full border border-white/20 relative">
            <div className="w-1 h-1.5 bg-gold rounded-full absolute top-1 left-1/2 -translate-x-1/2" />
          </div>
        </motion.div>
      </section>

      {/* Featured AI Beauty Concierge Strip */}
      <section className="py-24 bg-white border-y border-gold/5" id="featured-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Next-Gen Consulting
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-charcoal leading-tight">
                Meet Your AI Beauty Concierge
              </h2>
              <p className="text-gray-500 font-light leading-relaxed text-base">
                Not sure which treatment or style matches your skin type, hair structure, or occasion? Chat with our premium Gemini-powered beauty concierge. Describe your preferences, occasion, and budget to receive a personalized aesthetic plan and recommended local partners.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  'Bespoke service packages',
                  'Local artist compatibility matching',
                  'Budget optimization calculators',
                  'Instant wedding & event scheduling'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-charcoal font-light">
                    <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      ✓
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => onNavigate('concierge')}
                  className="py-3.5 px-8 rounded-full bg-charcoal hover:bg-charcoal-light text-white font-semibold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  Consult AI Concierge <Sparkles className="w-4 h-4 text-gold" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gold/10 rounded-[2.5rem] rotate-3 scale-102" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] border border-gold/10">
                <img 
                  src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80" 
                  alt="Aesthetic Consultation" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl glass-panel text-charcoal border border-gold/20 shadow-xl max-w-sm">
                  <p className="text-xs italic leading-relaxed text-charcoal-light">
                    "Based on Lucknow's humid weather and your wedding details, I recommend arranging a hydra-facial spa 3 days prior, followed by an airbrush HD makeup consultation."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Salons Section */}
      <section className="py-24 bg-ivory">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Curated Collections
              </span>
              <h2 className="text-3xl font-serif text-charcoal">
                 Lucknow's Finest Establishments
              </h2>
            </div>
            <button 
              onClick={() => onNavigate('marketplace')}
              className="text-gold hover:text-gold-dark font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              View all partners 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_SALONS.slice(0, 3).map((salon) => (
              <div 
                key={salon.id}
                onClick={() => onNavigate('profile', salon)}
                className="bg-white rounded-3xl overflow-hidden border border-gold/10 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                {/* Salon Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={salon.image} 
                    alt={salon.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm text-xs font-semibold text-charcoal">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    {salon.rating}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-lg font-serif font-semibold text-charcoal leading-snug truncate group-hover:text-gold transition-colors">
                      {salon.name}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-soft px-2 py-0.5 rounded">
                      {salon.priceLevel}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    {salon.area}, Lucknow
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {salon.services.slice(0, 3).map((service) => (
                      <span 
                        key={service.id} 
                        className="text-[10px] bg-ivory text-gold-dark font-medium border border-gold/10 px-2 py-0.5 rounded-full"
                      >
                        {service.name}
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
}
