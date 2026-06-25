import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}

function useSparkles(count: number): Sparkle[] {
  const ref = useRef<Sparkle[] | null>(null);
  if (!ref.current) {
    ref.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 14 + 10,
      delay: Math.random() * 1.0,
      color: '#D4AF37', // Gold
    }));
  }
  return ref.current;
}

interface IntroRevealProps {
  onDone?: () => void;
}

export default function IntroReveal({ onDone }: IntroRevealProps) {
  const [stage, setStage] = useState<'hold' | 'parting' | 'done'>('hold');
  const sparkles = useSparkles(16);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reducedMotion.current) {
      onDone?.();
      return;
    }
    const t1 = setTimeout(() => setStage('parting'), 1500);
    const t2 = setTimeout(() => {
      setStage('done');
      onDone?.();
    }, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  if (reducedMotion.current || stage === 'done') return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none" 
      aria-hidden={stage !== 'hold'}
    >
      {/* Left Panel */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-charcoal pointer-events-auto"
        initial={{ x: 0 }}
        animate={{ x: stage === 'parting' ? '-100%' : 0 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      />
      {/* Right Panel */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-charcoal pointer-events-auto"
        initial={{ x: 0 }}
        animate={{ x: stage === 'parting' ? '100%' : 0 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      />

      {/* Sparkles */}
      {stage === 'hold' && sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute z-50 pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0.6, 1, 0],
            scale: [0, 1.2, 0.8, 1.2, 0],
            rotate: 180,
          }}
          transition={{
            duration: 1.4,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 0.3,
          }}
        >
          <svg viewBox="0 0 40 40" width={s.size} height={s.size}>
            <path
              d="M20 2 Q22 16 38 20 Q22 24 20 38 Q18 24 2 20 Q18 16 20 2 Z"
              fill={s.color}
              opacity={0.8}
            />
          </svg>
        </motion.div>
      ))}

      {/* Center Wordmark */}
      <motion.div
        className="relative z-50 text-center flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: stage === 'parting' ? 0 : 1,
          y: 0,
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white mb-2 flex items-center gap-2">
          LuxeLucknow
        </h1>
        <p className="text-xs md:text-sm font-sans tracking-widest text-gold uppercase">
          Bespoke Beauty · Powered by Intelligence
        </p>
      </motion.div>
    </div>
  );
}
