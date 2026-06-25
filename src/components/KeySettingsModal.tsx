import { useState } from 'react';
import { Key, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface KeySettingsModalProps {
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export default function KeySettingsModal({ onClose, onSave, currentKey }: KeySettingsModalProps) {
  const [tempKey, setTempKey] = useState(currentKey);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(tempKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-charcoal/40 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-warm-white p-8 rounded-3xl max-w-md w-full shadow-2xl relative border border-gold/20"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-soft text-gray-500 hover:text-charcoal transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3 pr-6">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl text-charcoal">
            Gemini API Key
          </h3>
        </div>
        
        <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
          LuxeLucknow's Beauty Concierge and Event Planner utilize Gemini models. Enter your Google AI Studio API Key to test dynamic suggestions. Your key is stored locally in your browser cache.
        </p>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Gemini API Key
            </label>
            <input 
              type="password" 
              placeholder="AIzaSy..." 
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="w-full p-4 bg-gray-soft border border-gray-soft rounded-xl focus:ring-1 focus:ring-gold focus:border-gold outline-none text-charcoal text-sm"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            type="button"
            className="flex-1 py-3.5 px-6 rounded-full border border-gray-soft hover:bg-gray-soft text-sm font-semibold text-gray-500 hover:text-charcoal transition-all cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          
          <button 
            type="button"
            className="flex-1 py-3.5 px-6 rounded-full bg-gold hover:bg-gold-dark text-white text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            onClick={handleSave}
            disabled={isSaved}
          >
            {isSaved ? (
              <>Saved <Check className="w-4 h-4" /></>
            ) : (
              'Save Key'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
