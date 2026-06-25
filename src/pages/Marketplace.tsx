import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Filter, Heart, Sparkles } from 'lucide-react';
import { MOCK_SALONS, LUCKNOW_AREAS, categories } from '../data/salons';
import type { Salon } from '../types';

interface MarketplaceProps {
  onNavigate: (page: string, data?: Salon) => void;
  vibeFilterTags?: string[];
  onClearVibeTags?: () => void;
}

export default function Marketplace({ onNavigate, vibeFilterTags = [], onClearVibeTags }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Apply default category filtering based on incoming vibe tags from the MoodBoard swipe
  useEffect(() => {
    if (vibeFilterTags.length > 0) {
      // Pick the first vibe's mapped tag as the active category to initialize the grid
      setActiveCategory(vibeFilterTags[0]);
    }
  }, [vibeFilterTags]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredSalons = useMemo(() => {
    return MOCK_SALONS.filter(salon => {
      // Area match
      const matchesArea = selectedArea === 'All' || salon.area === selectedArea;
      
      // Category match (if specific filter is selected, check if salon supports it)
      const matchesCategory = activeCategory === 'all' || salon.categories.includes(activeCategory);
      
      // Text search query matching salon name, location or services
      const matchesSearch = 
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        salon.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        salon.about.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesArea && matchesCategory && matchesSearch;
    });
  }, [selectedArea, activeCategory, searchQuery]);

  const handleAiSearch = () => {
    if (!searchQuery) return;
    setIsAiSearching(true);
    // Simulate AI search parsing
    setTimeout(() => {
      setIsAiSearching(false);
    }, 1200);
  };

  return (
    <div className="pt-28 min-h-screen bg-warm-white pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold mb-2 block">
            Premium Salons
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-charcoal mb-4">
            Discover Luxury Aesthetics
          </h1>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Browse the highest-rated salons and wellness bars in Lucknow. Reserve certified hair, skin, and makeup experiences without chair upselling.
          </p>
        </div>

        {/* Dynamic Vibe Filter Overlay */}
        <AnimatePresence>
          {vibeFilterTags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-2xl bg-gold/10 border border-gold/25 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-xs font-medium text-gold-dark">
                  Filtered by Vibe Match: <strong>{vibeFilterTags.map(t => t.toUpperCase()).join(', ')}</strong>
                </span>
              </div>
              <button 
                onClick={onClearVibeTags}
                className="text-xs text-charcoal font-semibold underline underline-offset-2 cursor-pointer hover:text-gold"
              >
                Clear Vibe Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Selection Controls Panel */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gold/10 flex flex-col md:flex-row gap-4 mb-10 sticky top-24 z-40">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <input 
              type="text" 
              placeholder="AI Search: 'Bridal makeup under ₹10,000 near Gomti Nagar'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-soft border-none rounded-2xl focus:ring-1 focus:ring-gold outline-none text-sm text-charcoal"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-4 py-3.5 bg-gray-soft rounded-2xl outline-none border-none text-xs font-semibold text-charcoal cursor-pointer min-w-[150px]"
            >
              <option value="All">All Lucknow Areas</option>
              {LUCKNOW_AREAS.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            
            <button 
              onClick={handleAiSearch}
              className="whitespace-nowrap px-6 py-3.5 rounded-2xl bg-charcoal hover:bg-charcoal-light text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Filter className="w-4 h-4" /> Search
            </button>
          </div>
        </div>

        {/* Category Pills (Soleil inspired selection slider) */}
        <div className="category-pills flex gap-2.5 overflow-x-auto pb-4 mb-10 justify-start sm:justify-center hide-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`pill flex items-center gap-1.5 px-5 py-2.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'all' 
                ? 'bg-gold border-gold text-white shadow-md' 
                : 'bg-white border-gold/15 text-gray-500 hover:border-gold hover:text-charcoal'
            }`}
          >
            ✨ All Aesthetics
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`pill flex items-center gap-1.5 px-5 py-2.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === c.id 
                  ? 'bg-gold border-gold text-white shadow-md' 
                  : 'bg-white border-gold/15 text-gray-500 hover:border-gold hover:text-charcoal'
              }`}
            >
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <AnimatePresence mode="wait">
          {isAiSearching ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-24 space-y-4"
             >
               <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
               <p className="text-sm font-medium text-gray-500 animate-pulse">AI is parsing and optimizing recommendation metrics...</p>
             </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredSalons.map((salon) => {
                const isFavorite = favorites.includes(salon.id);
                return (
                  <motion.div 
                    key={salon.id} 
                    onClick={() => onNavigate('profile', salon)}
                    className="bg-white rounded-3xl overflow-hidden border border-gold/10 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col relative"
                  >
                    {/* Media Block */}
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={salon.image} 
                        alt={salon.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      
                      {/* Heart (Favorite) button */}
                      <button 
                        onClick={(e) => toggleFavorite(salon.id, e)}
                        className="absolute top-4 right-4 p-2.5 bg-white/70 hover:bg-white backdrop-blur-md rounded-full transition-all border border-white/40 shadow-sm cursor-pointer z-10"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-charcoal'}`} />
                      </button>
                      
                      {/* Verified Badge */}
                      {salon.verified && (
                        <div className="absolute bottom-4 left-4 py-1 px-3 bg-charcoal/95 backdrop-blur-md rounded-lg flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-gold uppercase border border-gold/15">
                          <Sparkles className="w-3 h-3" /> Partner
                        </div>
                      )}
                    </div>

                    {/* Details Block */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="text-lg font-serif font-semibold text-charcoal leading-snug group-hover:text-gold transition-colors truncate">
                            {salon.name}
                          </h3>
                          <div className="flex items-center gap-1 bg-gold/10 px-2 py-0.5 rounded text-xs font-semibold text-gold-dark flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-gold text-gold" /> {salon.rating}
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold" /> {salon.area}, Lucknow
                        </p>

                        <p className="text-xs text-gray-400 font-light line-clamp-2 leading-relaxed">
                          {salon.about}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-soft flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-semibold text-gray-400 block uppercase tracking-wider">Prices</span>
                          <span className="text-sm font-semibold text-charcoal">
                            {salon.priceLevel === '$$$$' ? 'Premium Luxury' : salon.priceLevel === '$$$' ? 'Upscale' : 'Standard'}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gold group-hover:underline flex items-center gap-1">
                          Reserve Menu <span>→</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredSalons.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-4">
                  <p className="text-base text-gray-400 font-light">No premium salons found matching your criteria.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedArea('All'); setActiveCategory('all'); }} 
                    className="py-2.5 px-6 rounded-full border border-gold/20 text-xs font-semibold text-gold cursor-pointer hover:bg-gold/15"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
