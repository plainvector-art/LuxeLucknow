import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check } from 'lucide-react';
import { moods } from '../data/salons';
import type { Mood } from '../types';

interface MoodBoardProps {
  onComplete: (tags: string[]) => void;
  onClose: () => void;
}

export default function MoodBoard({ onComplete, onClose }: MoodBoardProps) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Mood[]>([]);
  const [exitDir, setExitDir] = useState<number>(0);

  const current = moods[index];
  const isDone = index >= moods.length;
  const fillPercent = Math.min(100, (picks.length / 3) * 100);

  const handleSwipe = (liked: boolean) => {
    setExitDir(liked ? 1 : -1);
    if (liked) setPicks((p) => [...p, current]);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setExitDir(0);
    }, 220);
  };

  const handleSeeResults = () => {
    const tags = Array.from(new Set(picks.flatMap((p) => p.tags)));
    onComplete(tags);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-md p-4">
      <div className="bg-warm-white max-w-lg w-full rounded-3xl p-6 md:p-8 shadow-2xl relative border border-gold/20 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-soft text-gray-500 hover:text-charcoal transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Onboarding Header */}
        <div className="text-center mb-8 pr-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold mb-2 block">
            Aesthetic Matcher
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-charcoal">
            Find Your Signature Vibe
          </h2>
          
          {/* Progress Bar */}
          <div className="mt-6 flex items-center justify-between gap-4 max-w-xs mx-auto">
            <div className="h-1.5 flex-1 bg-beige-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold"
                animate={{ width: `${fillPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              {picks.length} Selected
            </span>
          </div>
        </div>

        {/* Onboarding Stage */}
        <div className="flex-1 flex items-center justify-center min-h-[300px] relative py-4">
          <AnimatePresence mode="wait">
            {!isDone ? (
              <motion.div
                key={current.id}
                className="w-full max-w-sm p-8 rounded-2xl glass-panel relative flex flex-col items-center justify-between min-h-[280px] shadow-xl text-center"
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  x: exitDir * 280,
                  rotate: exitDir * 15,
                  transition: { duration: 0.25 },
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="absolute top-4 left-4 text-gold">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                
                <div className="my-auto space-y-4">
                  <h3 className="text-xl md:text-2xl font-serif font-semibold text-charcoal">
                    {current.label}
                  </h3>
                  <p className="text-sm md:text-base text-charcoal-light font-light leading-relaxed max-w-xs">
                    {current.description}
                  </p>
                </div>

                <div className="flex gap-4 w-full mt-6">
                  <button
                    className="flex-1 py-3 px-6 rounded-full border border-gray-soft hover:bg-gray-soft text-sm font-medium text-gray-500 hover:text-charcoal transition-all cursor-pointer flex items-center justify-center gap-2"
                    onClick={() => handleSwipe(false)}
                    aria-label="Skip this vibe"
                  >
                    Not Me
                  </button>
                  <button
                    className="flex-1 py-3 px-6 rounded-full bg-gold hover:bg-gold-dark text-white text-sm font-medium transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    onClick={() => handleSwipe(true)}
                    aria-label="Like this vibe"
                  >
                    Love It <Check className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                className="w-full max-w-sm p-8 rounded-2xl glass-panel relative flex flex-col items-center justify-center text-center min-h-[280px] shadow-xl space-y-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-serif font-semibold text-charcoal">
                    Your Profile is Ready
                  </h3>
                  <p className="text-sm text-charcoal-light font-light leading-relaxed">
                    {picks.length > 0
                      ? `We've matched you with: ${picks.map((p) => p.label).join(', ')}.`
                      : 'Explore Lucknow\'s ultimate range of luxury salons and customized aesthetics.'}
                  </p>
                </div>
                <button 
                  className="w-full py-4 rounded-full bg-charcoal hover:bg-charcoal-light text-white text-sm font-semibold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl cursor-pointer" 
                  onClick={handleSeeResults}
                >
                  Reveal Matches
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
