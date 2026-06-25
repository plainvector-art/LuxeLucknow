export interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  duration: string;
  description?: string;
}

export interface Stylist {
  id: string;
  name: string;
  rating: number;
  yearsActive: number;
  specialty: string;
  verified: boolean;
  avatar?: string;
}

export interface Salon {
  id: string;
  name: string;
  area: string;
  rating: number;
  reviews: number;
  priceLevel: string; // $, $$, $$$, $$$$
  image: string;
  categories: string[];
  services: Service[];
  about: string;
  highlights: string[];
  verified: boolean;
  stylists: Stylist[];
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export interface Mood {
  id: string;
  label: string;
  description: string;
  tags: string[];
}

export interface RecommendationCard {
  salonId: string;
  confidence: number; // e.g. 98
  whyRecommended: string;
  budgetMatch: 'Perfect' | 'Good' | 'Stretch';
  distance: string; // e.g. "1.2 km"
  specialties: string[];
}
