import { Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-charcoal text-white/90 py-16 border-t border-gold/10 font-sans mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="text-xl font-serif font-semibold tracking-tight">LuxeLucknow</span>
          </div>
          <p className="text-sm text-gray-400 font-light leading-relaxed max-w-sm">
            Elevating the beauty and grooming experience in Lucknow through tailored AI personalization, curated luxury salons, and professional stylists.
          </p>
        </div>
        
        <div>
          <h4 className="font-serif font-semibold text-gold mb-4 text-sm tracking-wide">Explore</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-light">
            <li>
              <button onClick={() => onNavigate('marketplace')} className="hover:text-gold transition-colors cursor-pointer text-left">
                Marketplace
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('concierge')} className="hover:text-gold transition-colors cursor-pointer text-left">
                AI Beauty Concierge
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('planner')} className="hover:text-gold transition-colors cursor-pointer text-left">
                AI Event Planner
              </button>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-serif font-semibold text-gold mb-4 text-sm tracking-wide">Studio Partners</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-light">
            <li className="hover:text-gold cursor-pointer transition-colors">Join as Partner</li>
            <li className="hover:text-gold cursor-pointer transition-colors">Partner Dashboard</li>
            <li className="hover:text-gold cursor-pointer transition-colors">Terms of Service</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light">
        <p>© 2026 LuxeLucknow. Designed for the future of personal aesthetics.</p>
        <p className="italic">Glow-up, personalized in Gomti Nagar & Hazratganj.</p>
      </div>
    </footer>
  );
}
