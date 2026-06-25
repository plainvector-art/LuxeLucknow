import { useState } from 'react';
import { Sparkles, Settings, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onToggleKeySettings: () => void;
  user: any;
}

export default function Navbar({ activePage, onNavigate, onToggleKeySettings, user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'marketplace', label: 'Explore' },
    { id: 'concierge', label: 'AI Concierge' },
    { id: 'planner', label: 'Beauty Planner' }
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 rounded-full glass-panel px-6 py-3.5 flex justify-between items-center transition-all duration-300">
      {/* Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => { onNavigate('home'); setIsOpen(false); }}
      >
        <Sparkles className="w-5 h-5 text-gold group-hover:scale-110 transition-transform duration-300" />
        <span className="text-xl font-serif font-bold tracking-tight text-charcoal">
          LuxeLucknow
        </span>
      </div>
      
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 relative">
        {navLinks.map((link) => {
          const isActive = activePage === link.id;
          return (
            <button 
              key={link.id} 
              onClick={() => onNavigate(link.id)} 
              className={`relative font-sans text-sm font-medium tracking-wide transition-all cursor-pointer ${
                isActive ? 'text-gold' : 'text-gray-500 hover:text-charcoal'
              }`}
            >
              {link.label}
              {isActive && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gold"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleKeySettings} 
          title="Configure Gemini API Key"
          className="p-2 rounded-full cursor-pointer hover:bg-gray-soft text-gray-500 hover:text-gold transition-all"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold border border-gold/10">
              <User className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <button className="hidden sm:inline-flex py-1.5 px-4 rounded-full bg-charcoal hover:bg-charcoal-light text-white text-xs font-semibold tracking-wide transition-all cursor-pointer">
            Sign In
          </button>
        )}

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 rounded-full hover:bg-gray-soft text-gray-500 cursor-pointer"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 p-6 rounded-3xl glass-panel flex flex-col gap-4 md:hidden shadow-xl"
          >
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button 
                  key={link.id} 
                  onClick={() => { onNavigate(link.id); setIsOpen(false); }} 
                  className={`w-full text-left py-2 font-sans font-medium text-base transition-colors ${
                    isActive ? 'text-gold' : 'text-gray-500'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            {!user && (
              <button className="w-full py-3 rounded-full bg-charcoal text-white font-semibold text-sm transition-colors mt-2">
                Sign In
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
