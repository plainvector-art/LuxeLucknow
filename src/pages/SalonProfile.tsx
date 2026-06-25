import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Sparkles, Check, Clock, Calendar, Shield, ChevronLeft, CalendarDays } from 'lucide-react';
import { getStylistsBySalon } from '../data/salons';
import type { Salon, Service, Stylist } from '../types';

interface SalonProfileProps {
  salon: Salon | null;
  onBack: () => void;
}

export default function SalonProfile({ salon, onBack }: SalonProfileProps) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [isBooked, setIsBooked] = useState(false);

  const stylists = useMemo(() => {
    return salon ? getStylistsBySalon(salon) : [];
  }, [salon]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const toggleService = (service: Service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  };

  const handleBooking = () => {
    if (selectedServices.length === 0) {
      alert("Please select at least one service.");
      return;
    }
    setIsBooked(true);
  };

  if (!salon) {
    return (
      <div className="pt-32 text-center min-h-screen font-sans">
        <p className="text-gray-500 mb-6 font-light">Salon not found.</p>
        <button 
          onClick={onBack}
          className="py-2.5 px-6 rounded-full bg-gold text-white font-semibold text-xs cursor-pointer"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-warm-white pb-32 font-sans relative">
      
      {/* Full Bleed Hero */}
      <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden">
        <img 
          src={salon.image} 
          alt={salon.name} 
          className="w-full h-full object-cover brightness-[0.55]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-transparent" />
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-8 left-6 md:left-12 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full border border-white/25 text-white transition-all cursor-pointer z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Text Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-gold/90 text-white text-[10px] font-semibold tracking-wider uppercase rounded">
                Verified Salon Partner
              </span>
              <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
                {salon.name}
              </h1>
              
              <div className="flex flex-wrap items-center text-white/95 text-xs gap-4 font-light">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gold" /> {salon.area}, Lucknow
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gold fill-gold" /> {salon.rating} ({salon.reviews} reviews)
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
                  {salon.priceLevel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-12">
        {/* Left main content col */}
        <div className="flex-1 space-y-12">
          
          {/* AI Review Summary Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-gold/5 via-gold/10 to-transparent border border-gold/15 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold" />
              <h3 className="font-serif text-lg text-charcoal font-semibold">
                AI Review Insights
              </h3>
            </div>
            
            <p className="text-charcoal-light font-light text-sm italic leading-relaxed">
              "Clients consistently review {salon.name} as Lucknow's premier spot for styling. Standout mentions highlight the customized {salon.services[0]?.name || 'Bridal packages'}, pristine hygiene standards, and highly attentive stylists. Note: Booking in advance is highly recommended due to high seasonal wedding demand."
            </p>
          </div>

          {/* About Section */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-charcoal">About</h2>
            <p className="text-gray-500 font-light leading-relaxed text-sm">
              {salon.about}
            </p>
          </section>

          {/* Stylists Selection Area */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-serif text-charcoal">Select Stylist</h2>
              <p className="text-xs text-gray-400 font-light">Choose your artist, rather than whoever is free on the hour.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stylists.map((pro) => {
                const isSelected = selectedStylist?.id === pro.id;
                return (
                  <div 
                    key={pro.id}
                    onClick={() => setSelectedStylist(isSelected ? null : pro)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-gold/10 border-gold shadow-md' 
                        : 'bg-white border-gold/10 hover:border-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center font-semibold text-gold-dark text-sm">
                        {pro.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-charcoal">{pro.name}</h4>
                        <p className="text-xs text-gray-400">{pro.specialty}</p>
                        <p className="text-[10px] text-gold-dark font-medium mt-0.5">★ {pro.rating} · {pro.yearsActive} yrs exp</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Services Menu Section */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-serif text-charcoal">Services & Pricing</h2>
            <div className="space-y-4">
              {salon.services.map((service) => {
                const isChecked = selectedServices.some(s => s.id === service.id);
                return (
                  <div 
                    key={service.id}
                    onClick={() => toggleService(service)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex justify-between items-start gap-4 ${
                      isChecked 
                        ? 'bg-white border-gold shadow-md' 
                        : 'bg-white border-gold/10 hover:border-gold/30'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        isChecked ? 'bg-gold border-gold text-white' : 'border-gold/20'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-charcoal">{service.name}</h4>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">{service.description}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="w-3.5 h-3.5" /> {service.duration}
                        </span>
                      </div>
                    </div>
                    
                    <span className="text-sm font-semibold text-charcoal whitespace-nowrap">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Highlights */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif text-charcoal">Highlights</h2>
            <div className="flex flex-wrap gap-3">
              {salon.highlights.map((highlight, idx) => (
                <span 
                  key={idx} 
                  className="px-4 py-2 bg-white rounded-full text-xs text-gray-600 border border-gold/10 flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-gold" /> {highlight}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Right booking column */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-white p-6 rounded-3xl border border-gold/10 shadow-lg sticky top-28 space-y-6">
            <h3 className="text-lg font-serif font-semibold text-charcoal border-b border-gray-soft pb-4">
              Schedule Appointment
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3.5 text-gold" />
                  <input 
                    type="date" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 p-3 bg-gray-soft border-none rounded-xl outline-none focus:ring-1 focus:ring-gold text-xs text-charcoal cursor-pointer font-sans" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Select Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-3.5 text-gold" />
                  <select 
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full pl-10 p-3 bg-gray-soft border-none rounded-xl outline-none focus:ring-1 focus:ring-gold text-xs text-charcoal appearance-none cursor-pointer font-sans"
                  >
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                    <option>06:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-soft">
              <button 
                onClick={handleBooking}
                disabled={selectedServices.length === 0}
                className="w-full py-4 rounded-full bg-gold hover:bg-gold-dark text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Booking
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-3 font-light">
                Appointment undergoes instant AI confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Booking Bar (Soleil inspired selection notification) */}
      <AnimatePresence>
        {selectedServices.length > 0 && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-50 rounded-full glass-panel-dark px-6 py-4 flex justify-between items-center shadow-2xl border border-gold/30"
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <div className="flex flex-col text-white">
              <span className="text-xs font-light text-white/70">
                {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} Selected
              </span>
              <span className="text-base font-semibold text-gold">
                ₹{totalPrice.toLocaleString('en-IN')} 
                {selectedStylist && <span className="text-xs text-white/50 font-normal"> with {selectedStylist.name}</span>}
              </span>
            </div>
            
            <button 
              onClick={handleBooking}
              className="py-2.5 px-6 rounded-full bg-gold hover:bg-gold-dark text-white text-xs font-semibold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              Book Now <Sparkles className="w-3.5 h-3.5 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Booking Modal */}
      <AnimatePresence>
        {isBooked && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-charcoal/50 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-3xl max-w-sm w-full text-center border border-gold/20 shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto animate-bounce">
                <CalendarDays className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-charcoal">Request Received</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  We've sent your request to <strong>{salon.name}</strong> for {bookingDate || 'today'} at {bookingTime}.
                  {selectedStylist && <> Your stylist is <strong>{selectedStylist.name}</strong>.</>}
                </p>
              </div>
              <button 
                onClick={() => { setIsBooked(false); setSelectedServices([]); }}
                className="w-full py-3.5 rounded-full bg-charcoal text-white text-xs font-semibold cursor-pointer"
              >
                Great, Thank You
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
