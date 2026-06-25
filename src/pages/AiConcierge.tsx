import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Key, Star, MapPin, ArrowRight } from 'lucide-react';
import { MOCK_SALONS } from '../data/salons';
import type { Salon } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  salons?: Salon[];
}

interface AiConciergeProps {
  onNavigate: (page: string, data?: Salon) => void;
  geminiKey: string;
  onOpenKeyModal: () => void;
}

const STARTER_PROMPTS = [
  "Suggest a luxury bridal makeup package in Gomti Nagar.",
  "Recommend a calming facial spa for highly sensitive skin.",
  "Where can I get a precision haircut and beard styling for men?",
  "Recommend root hair color treatments under ₹5,000."
];

export default function AiConcierge({ onNavigate, geminiKey, onOpenKeyModal }: AiConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Welcome to LuxeLucknow's AI Beauty Concierge. I am your elite beauty advisor. Describe your style preferences, budget constraints, or any upcoming occasions in Lucknow, and I'll tailor a custom routine for you."
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const matchSalonsFromText = (text: string): Salon[] => {
    // Check if the text references any of our mock salon keywords
    const matches: Salon[] = [];
    const lowerText = text.toLowerCase();
    
    MOCK_SALONS.forEach(salon => {
      const nameParts = salon.name.toLowerCase().split(' ');
      const matchedName = nameParts.some(part => part.length > 3 && lowerText.includes(part));
      const matchedArea = lowerText.includes(salon.area.toLowerCase());
      
      if (matchedName || (matchedArea && Math.random() > 0.5)) {
        matches.push(salon);
      }
    });

    // Default fallback to show options if none matched
    if (matches.length === 0 && (lowerText.includes('salon') || lowerText.includes('makeup') || lowerText.includes('hair') || lowerText.includes('facial'))) {
      return MOCK_SALONS.slice(0, 2);
    }
    
    return matches;
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsgId = Date.now().toString();
    const userMessage: Message = { id: userMsgId, sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputVal('');
    setLoading(true);

    const apiKey = geminiKey || localStorage.getItem('GEMINI_API_KEY') || "";
    
    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: "API_KEY_MISSING"
        }]);
        setLoading(false);
      }, 1000);
      return;
    }

    const prompt = `User query: "${textToSend}". Recommend beauty/wellness routines in Lucknow. Reference nearby areas if possible. Keep the response elegant, premium, and within 2 short paragraphs. Focus on treatment categories rather than specific salon titles unless you suggest general locations.`;
    const systemInstruction = "You are LuxeLucknow's elite AI Beauty Concierge. Speak in a sophisticated, reassuring, and highly knowledgeable tone. Format using clean paragraphs. If the user mentions weddings or major events, suggest scheduling pre-bridal plans.";
    
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
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: "API_KEY_ERROR"
        }]);
      } else {
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0) {
          const aiResponseText = result.candidates[0].content.parts[0].text;
          const matched = matchSalonsFromText(aiResponseText + ' ' + textToSend);
          
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'ai',
            text: aiResponseText,
            salons: matched
          }]);
        } else {
          throw new Error("Empty candidate list");
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: "I apologize, but I am currently experiencing connection difficulties. Please verify your internet connection or try again shortly."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-warm-white pb-12 font-sans flex flex-col items-center">
      <div className="max-w-4xl w-full px-6 flex flex-col flex-1 h-[78vh] max-h-[800px] bg-white rounded-3xl border border-gold/10 shadow-xl overflow-hidden relative">
        {/* Portal Header */}
        <div className="p-5 border-b border-gray-soft flex justify-between items-center bg-ivory">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center text-gold">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-charcoal">Beauty Concierge</h2>
              <p className="text-[10px] text-gold-dark font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" /> Gemini 3.5 Active
              </p>
            </div>
          </div>
          
          {!geminiKey && (
            <button 
              onClick={onOpenKeyModal}
              className="py-1.5 px-3 rounded-full bg-gold/10 hover:bg-gold/25 border border-gold/20 text-[10px] font-semibold text-gold-dark flex items-center gap-1 transition-all cursor-pointer"
            >
              <Key className="w-3 h-3" /> Set Key
            </button>
          )}
        </div>

        {/* Chat History View */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-warm-white/20">
          <AnimatePresence>
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              
              if (msg.text === "API_KEY_MISSING") {
                return (
                  <motion.div 
                    key={msg.id} 
                    className="flex flex-col items-center justify-center p-8 bg-charcoal text-white rounded-2xl border border-gold/20 max-w-sm mx-auto shadow-md space-y-4"
                  >
                    <p className="text-xs text-center font-light leading-relaxed text-gray-300">
                      To activate dynamic AI recommendations, you need to input a Gemini API Key.
                    </p>
                    <button 
                      onClick={onOpenKeyModal}
                      className="py-2.5 px-6 rounded-full bg-gold text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" /> Configure Key
                    </button>
                  </motion.div>
                );
              }

              if (msg.text === "API_KEY_ERROR") {
                return (
                  <motion.div 
                    key={msg.id}
                    className="flex flex-col items-center justify-center p-8 bg-red-950 text-white rounded-2xl border border-red-500/25 max-w-sm mx-auto shadow-md space-y-4"
                  >
                    <p className="text-xs text-center font-light leading-relaxed text-red-200">
                      The provided API Key is invalid or unauthorized. Please verify your Google AI Studio credentials.
                    </p>
                    <button 
                      onClick={onOpenKeyModal}
                      className="py-2.5 px-6 rounded-full bg-red-650 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" /> Update Key
                    </button>
                  </motion.div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-2`}>
                  <div className={`p-4 md:p-5 rounded-2xl max-w-[85%] text-sm leading-relaxed font-sans shadow-sm border ${
                    isAi 
                      ? 'bg-white border-gold/10 text-charcoal' 
                      : 'bg-charcoal text-white border-charcoal'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {/* Dynamic Action Cards (Premium recommendation reveal) */}
                  {isAi && msg.salons && msg.salons.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                    >
                      {msg.salons.map((salon) => (
                        <div 
                          key={salon.id}
                          onClick={() => onNavigate('profile', salon)}
                          className="bg-white p-4 rounded-2xl border border-gold/15 shadow-md flex flex-col justify-between hover:shadow-lg hover:border-gold transition-all duration-300 cursor-pointer group"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-semibold text-charcoal leading-snug group-hover:text-gold transition-colors">
                                {salon.name}
                              </h4>
                              <div className="flex items-center gap-0.5 text-[10px] font-semibold text-gold-dark bg-gold/15 px-1.5 py-0.5 rounded">
                                <Star className="w-3 h-3 fill-gold text-gold" /> {salon.rating}
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gold" /> {salon.area}
                            </p>
                          </div>
                          
                          <div className="pt-3 mt-3 border-t border-gray-soft flex items-center justify-between text-[10px] font-semibold text-gold group-hover:underline">
                            View details <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-start"
              >
                <div className="p-4 rounded-2xl bg-white border border-gold/10 flex items-center gap-2">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        {/* Dynamic Prompts List (Clickable suggestions) */}
        {messages.length === 1 && !loading && (
          <div className="px-6 py-4 bg-ivory border-t border-gray-soft overflow-x-auto flex gap-3 hide-scrollbar">
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="prompt-btn whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-soft bg-white flex gap-2">
          <input 
            type="text"
            placeholder="Type your style preferences or queries..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputVal)}
            disabled={loading}
            className="flex-1 p-3.5 bg-gray-soft border-none rounded-2xl outline-none text-sm text-charcoal focus:ring-1 focus:ring-gold"
          />
          <button
            onClick={() => handleSend(inputVal)}
            disabled={loading || !inputVal.trim()}
            className="p-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
