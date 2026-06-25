import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CalendarDays, Check, Plus, ArrowRight } from 'lucide-react';
import type { Salon } from '../types';

interface TimelineItem {
  timeframe: string;
  task: string;
  whyNeeded: string;
  status: 'pending' | 'completed';
}

interface BeautyPlannerProps {
  onNavigate: (page: string, data?: Salon) => void;
  geminiKey: string;
  onOpenKeyModal: () => void;
}

export default function BeautyPlanner({ onNavigate, geminiKey, onOpenKeyModal }: BeautyPlannerProps) {
  const [occasion, setOccasion] = useState('Wedding');
  const [eventDate, setEventDate] = useState('');
  const [budget, setBudget] = useState('Premium (₹5,000 - ₹10,000)');
  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fallback high-fidelity timeline data if Gemini API Key is missing or user wants a demo
  const generateMockupTimeline = (): TimelineItem[] => {
    return [
      { timeframe: "6 Weeks Before", task: "Hair Consultation & Cuticle Trim", whyNeeded: "Assess lengths, color matching, and trim damaged tips to allow healthy growth.", status: 'pending' },
      { timeframe: "4 Weeks Before", task: "Pre-Bridal Advanced Facial", whyNeeded: "Cleanse pores and activate skin cells to allow hydration levels to peak.", status: 'pending' },
      { timeframe: "2 Weeks Before", task: "Hair Spa & Deep Conditioning", whyNeeded: "Lock in shine, prevent frizz, and condition locks for heavy wedding styling.", status: 'pending' },
      { timeframe: "3 Days Before", task: "Full Arms Honey Waxing", whyNeeded: "Eliminate surface stubble with minimal irritation prior to ceremony days.", status: 'pending' },
      { timeframe: "1 Day Before", task: "Bridal Glow Facial & Draping Setup", whyNeeded: "Immediate dewy radiance boost and dress pre-pinning checks.", status: 'pending' }
    ];
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const apiKey = geminiKey || localStorage.getItem('GEMINI_API_KEY') || "";
    
    if (!apiKey) {
      // Fallback gracefully to the mockup timeline
      setTimeout(() => {
        setTimeline(generateMockupTimeline());
        setLoading(false);
      }, 1000);
      return;
    }

    const prompt = `Create a beauty prep checklist timeline for a "${occasion}" on date "${eventDate || 'soon'}" with budget "${budget}". Format as a JSON array of objects with keys "timeframe", "task", and "whyNeeded". Make 4-5 entries from 6 weeks before down to day-of. Only output valid raw JSON.`;
    const systemInstruction = "You are a professional luxury wedding coordinator. Generate a structured JSON list of checklist items. Do not include markdown formatting or commentary, only raw JSON array.";

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
        setErrorMessage("API_KEY_ERROR");
        setTimeline(generateMockupTimeline()); // fallback even on auth error
      } else {
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0) {
          const rawText = result.candidates[0].content.parts[0].text;
          // Extract JSON content in case AI returned markdown wrappers
          const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
          const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
          
          setTimeline(parsed.map((item: any) => ({
            ...item,
            status: 'pending'
          })));
        } else {
          throw new Error("Empty AI result");
        }
      }
    } catch (err) {
      setTimeline(generateMockupTimeline()); // fallback on parse or fetch error
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = (idx: number) => {
    setTimeline(prev => 
      prev.map((item, i) => i === idx ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' } : item)
    );
  };

  return (
    <div className="pt-28 min-h-screen bg-warm-white pb-24 font-sans">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold mb-2 block">
            Aesthetic Planner
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-charcoal mb-4">
            Bespoke Event Planner
          </h1>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Specify your occasion date and estimated budget. LuxeLucknow AI will map out a custom step-by-step beauty itinerary leading up to your big day.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Settings Panel */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gold/10 shadow-lg space-y-6">
            <h3 className="font-serif text-lg font-semibold text-charcoal flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gold" /> Event Parameters
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Occasion Type
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full p-3.5 bg-gray-soft border-none rounded-2xl outline-none text-xs text-charcoal font-semibold cursor-pointer"
                >
                  <option value="Wedding">Wedding Ceremony</option>
                  <option value="Sangeet / Mehendi">Sangeet / Mehendi</option>
                  <option value="Reception Party">Grand Reception</option>
                  <option value="Corporate Gala">Corporate Gala</option>
                  <option value="Anniversary">Private Anniversary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-3.5 bg-gray-soft border-none rounded-2xl outline-none text-xs text-charcoal font-sans cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Budget Level
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full p-3.5 bg-gray-soft border-none rounded-2xl outline-none text-xs text-charcoal font-semibold cursor-pointer"
                >
                  <option value="Standard (Under ₹5,000)">Standard (Under ₹5,000)</option>
                  <option value="Premium (₹5,000 - ₹10,000)">Premium (₹5,000 - ₹10,000)</option>
                  <option value="Luxury (₹10,000+)">Luxury (₹10,000+)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-gold hover:bg-gold-dark text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Constructing..." : "Generate Timeline"} <Sparkles className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Timeline Output Panel */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 space-y-4 bg-white rounded-3xl border border-gold/10 p-8 shadow-sm"
                >
                  <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 font-light animate-pulse">Consulting trends and mapping chronological sequences...</p>
                </motion.div>
              ) : timeline.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="space-y-6"
                >
                  {errorMessage === 'API_KEY_ERROR' && (
                    <div className="text-xs text-red-500 font-light bg-red-50 border border-red-200 p-3.5 rounded-2xl mb-4">
                      The API key provided is unauthorized or invalid. Showing a fallback luxury timeline instead.
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-ivory p-4 rounded-2xl border border-gold/10">
                    <span className="text-xs font-semibold text-gold-dark flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> {occasion} Aesthetics Map
                    </span>
                    {!geminiKey && (
                      <button
                        type="button"
                        onClick={onOpenKeyModal}
                        className="text-[10px] text-gold font-semibold bg-white hover:bg-gold/5 px-2 py-0.5 rounded border border-gold/25 cursor-pointer transition-colors"
                      >
                        Set API Key
                      </button>
                    )}
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative border-l border-gold/20 pl-6 ml-4 space-y-10 py-2">
                    {timeline.map((item, idx) => {
                      const isCompleted = item.status === 'completed';
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative"
                        >
                          {/* Circle dot on the left line */}
                          <button
                            onClick={() => toggleTaskStatus(idx)}
                            className={`absolute -left-[37px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm transition-all cursor-pointer ${
                              isCompleted 
                                ? 'bg-gold border-gold text-white' 
                                : 'bg-white border-gold/30 text-gold-dark hover:bg-gold/15'
                            }`}
                          >
                            {isCompleted ? <Check className="w-3 h-3" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>

                          {/* Detail block */}
                          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gold/5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-soft pb-2.5">
                              <span className="text-xs font-semibold text-gold">
                                {item.timeframe}
                              </span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                isCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {isCompleted ? 'Ready' : 'Pending'}
                              </span>
                            </div>
                            
                            <h4 className={`text-base font-semibold ${isCompleted ? 'line-through text-gray-400' : 'text-charcoal'}`}>
                              {item.task}
                            </h4>
                            <p className="text-xs text-gray-400 font-light leading-relaxed">
                              {item.whyNeeded}
                            </p>

                            {/* Recommended salon link */}
                            <div className="pt-3 flex justify-between items-center">
                              <span className="text-[10px] text-gray-400 font-light">Recommended Spot:</span>
                              <button 
                                onClick={() => onNavigate('marketplace')}
                                className="text-[10px] font-semibold text-gold-dark hover:underline flex items-center gap-1.5 cursor-pointer"
                              >
                                Find Salon <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-12 rounded-3xl border border-gold/10 text-center shadow-lg flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <CalendarDays className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-lg font-serif font-semibold text-charcoal">Timeline Awaiting Parameters</h3>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Complete the parameters form on the left to review your personalized pre-event beauty schedule.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
