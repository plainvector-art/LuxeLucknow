import type { Salon, Stylist, Category, Mood } from '../types';

export const LUCKNOW_AREAS = ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar', 'Ashiyana'];

export const categories: Category[] = [
  { id: 'hair', label: 'Hair', emoji: '✂️' },
  { id: 'skin', label: 'Skin', emoji: '🌸' },
  { id: 'waxing', label: 'Waxing', emoji: '🌙' },
  { id: 'bridal', label: 'Bridal & Glam', emoji: '💍' },
  { id: 'grooming', label: 'Grooming', emoji: '🪒' },
];

export const moods: Mood[] = [
  {
    id: 'clean-girl',
    label: 'Clean Girl',
    description: 'Skin-first, barely-there makeup, slicked hair',
    tags: ['skin', 'hair'],
  },
  {
    id: 'soft-glam',
    label: 'Soft Glam',
    description: 'Dewy base, soft eyes, a little shimmer',
    tags: ['skin', 'bridal'],
  },
  {
    id: 'bold-bright',
    label: 'Bold & Bright',
    description: 'Colour, contrast, statement looks',
    tags: ['bridal', 'hair'],
  },
  {
    id: 'natural-glow',
    label: 'Natural Glow',
    description: 'Low-maintenance, skin treatments, gentle care',
    tags: ['skin', 'waxing'],
  },
  {
    id: 'sharp-clean',
    label: 'Sharp & Clean',
    description: 'Grooming, fades, beard care',
    tags: ['grooming', 'hair'],
  },
];

export const MOCK_STYLISTS: Stylist[] = [
  { id: 'st1', name: 'Meera Kapoor', rating: 4.95, yearsActive: 8, specialty: 'Bridal Makeup', verified: true },
  { id: 'st2', name: 'Rohan Verma', rating: 4.8, yearsActive: 6, specialty: 'Hair Coloring', verified: true },
  { id: 'st3', name: 'Neha Singh', rating: 4.9, yearsActive: 7, specialty: 'Advanced Facials', verified: true },
  { id: 'st4', name: 'Aarav Sharma', rating: 4.85, yearsActive: 5, specialty: 'Men\'s Grooming', verified: true },
  { id: 'st5', name: 'Priya Patel', rating: 5.0, yearsActive: 9, specialty: 'HD Bridal Makeup', verified: true },
  { id: 'st6', name: 'Kabir Sen', rating: 4.75, yearsActive: 4, specialty: 'Hair Styling', verified: false }
];

export const MOCK_SALONS: Salon[] = [
  {
    id: 's1',
    name: 'Aura Luxury Salon & Spa',
    area: 'Gomti Nagar',
    rating: 4.9,
    reviews: 342,
    priceLevel: '$$$',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80',
    categories: ['hair', 'skin', 'bridal'],
    about: 'Experience the pinnacle of luxury beauty in the heart of Gomti Nagar. Our internationally trained stylists use only premium products to deliver bespoke transformations.',
    highlights: ['Premium Products', 'Valet Parking', 'Private Bridal Suite'],
    verified: true,
    stylists: [MOCK_STYLISTS[0], MOCK_STYLISTS[1], MOCK_STYLISTS[5]],
    services: [
      { id: 's1-sv1', category: 'hair', name: 'Advanced Hair Coloring', price: 4500, duration: '120 min', description: 'Bespoke Balayage or Ombre using premium L\'Oreal Professional products.' },
      { id: 's1-sv2', category: 'bridal', name: 'Bridal Makeup', price: 15000, duration: '180 min', description: 'Flawless HD makeup including draping and hair styling.' },
      { id: 's1-sv3', category: 'skin', name: 'Luxury Spa Facial', price: 3200, duration: '60 min', description: 'Rejuvenating glow facial infused with gold extracts.' }
    ]
  },
  {
    id: 's2',
    name: 'The Glamour Room',
    area: 'Hazratganj',
    rating: 4.7,
    reviews: 215,
    priceLevel: '$$',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    categories: ['hair', 'bridal', 'skin', 'waxing'],
    about: 'A modern, chic space offering the latest trends in beauty. Perfect for a quick glow-up before a night out in Hazratganj.',
    highlights: ['Trendy Styles', 'Quick Service', 'Central Location'],
    verified: true,
    stylists: [MOCK_STYLISTS[1], MOCK_STYLISTS[5]],
    services: [
      { id: 's2-sv1', category: 'hair', name: 'Haircut & Styling', price: 1200, duration: '45 min', description: 'Personalized haircut with consultation and blow-dry.' },
      { id: 's2-sv2', category: 'bridal', name: 'Party Makeup', price: 4500, duration: '90 min', description: 'Dewy base makeup with statement eyes.' },
      { id: 's2-sv3', category: 'waxing', name: 'Nail Art & Extensions', price: 1800, duration: '60 min', description: 'Creative gel extensions with custom handpainted nail art.' }
    ]
  },
  {
    id: 's3',
    name: 'Serenity Wellness Lounge',
    area: 'Indira Nagar',
    rating: 4.8,
    reviews: 189,
    priceLevel: '$$$',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    categories: ['skin', 'waxing'],
    about: 'Escape the city noise. We specialize in holistic wellness and rejuvenating treatments using organic, cruelty-free ingredients.',
    highlights: ['Organic Products', 'Quiet Ambience', 'Expert Therapists'],
    verified: true,
    stylists: [MOCK_STYLISTS[2]],
    services: [
      { id: 's3-sv1', category: 'skin', name: 'Ayurvedic Facial & Spa', price: 2800, duration: '75 min', description: 'Rebalancing treatment using forest essentials herbs.' },
      { id: 's3-sv2', category: 'skin', name: 'Deep Tissue Massage', price: 3500, duration: '90 min', description: 'Stress-relieving massage with organic essential oils.' },
      { id: 's3-sv3', category: 'waxing', name: 'Honey Waxing (Full Body)', price: 2000, duration: '60 min', description: 'Gentle hair removal suitable for sensitive skin.' }
    ]
  },
  {
    id: 's4',
    name: 'Gentleman\'s Grooming Co.',
    area: 'Mahanagar',
    rating: 4.6,
    reviews: 156,
    priceLevel: '$$',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    categories: ['grooming', 'hair'],
    about: 'The premier destination for the modern man. Classic barbering meets contemporary grooming services.',
    highlights: ['Whiskey Bar', 'Hot Towel Shave', 'Experienced Barbers'],
    verified: true,
    stylists: [MOCK_STYLISTS[3]],
    services: [
      { id: 's4-sv1', category: 'grooming', name: 'Classic Haircut & Wash', price: 600, duration: '30 min', description: 'Precision styling cut with energizing hair wash.' },
      { id: 's4-sv2', category: 'grooming', name: 'Beard Trimming & Styling', price: 400, duration: '20 min', description: 'Beard lining, trimming, and hot towel pampering.' },
      { id: 's4-sv3', category: 'grooming', name: 'Men\'s Rejuvenating Facial', price: 1500, duration: '45 min', description: 'Detoxifying charcoal facial treatment.' }
    ]
  },
  {
    id: 's5',
    name: 'Bridal Studio by Mehak',
    area: 'Gomti Nagar',
    rating: 5.0,
    reviews: 89,
    priceLevel: '$$$$',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
    categories: ['bridal', 'skin'],
    about: 'Exclusive bridal studio dedicated to making your special day flawless. Featured in top Indian wedding magazines.',
    highlights: ['Celebrity MUA', 'Trial Available', 'On-Location Service'],
    verified: true,
    stylists: [MOCK_STYLISTS[4]],
    services: [
      { id: 's5-sv1', category: 'bridal', name: 'HD Bridal Makeup (Airbrush)', price: 25000, duration: '210 min', description: 'High-definition bridal look with airbrush finish.' },
      { id: 's5-sv2', category: 'bridal', name: 'Pre-Bridal Luxury Package', price: 12000, duration: '240 min', description: 'Ultimate body scrub, polish, and bridal glow facial.' }
    ]
  }
];

export function getSalonById(id: string): Salon | undefined {
  return MOCK_SALONS.find((s) => s.id === id);
}

export function getStylistsBySalon(salon: Salon): Stylist[] {
  return salon.stylists;
}
