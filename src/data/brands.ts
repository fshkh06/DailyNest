export interface BrandInfo {
  name: string;
  category: string;
  logoText: string;
  tagline: string;
}

export const POPULAR_BRANDS: BrandInfo[] = [
  { name: 'NestLiving', category: 'Home & Living', logoText: 'NEST', tagline: 'Everyday Scandinavian Comfort' },
  { name: 'AeroChef', category: 'Kitchen & Dining', logoText: 'AERO', tagline: 'Culinary Precision Cookware' },
  { name: 'PulseAudio', category: 'Electronics & Tech', logoText: 'PULSE', tagline: 'Hi-Fi Sound Acoustics' },
  { name: 'UrbanVibe', category: 'Fashion & Apparel', logoText: 'URBAN', tagline: 'Contemporary Daily Essentials' },
  { name: 'Botanica Lab', category: 'Personal Care', logoText: 'BOTANICA', tagline: 'Pure Plant-Powered Skincare' },
  { name: 'NomadGear', category: 'Travel & Outdoors', logoText: 'NOMAD', tagline: 'Engineered for the Explorer' },
  { name: 'ArtisanCraft', category: 'Gifts & Stationery', logoText: 'ARTISAN', tagline: 'Timeless Archival Stationery' },
  { name: 'Zenith Tech', category: 'Tech Accessories', logoText: 'ZENITH', tagline: 'Next-Gen Workspace Power' },
];

export interface CustomerTestimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  date: string;
  productName: string;
  comment: string;
}

export const HOMEPAGE_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: 'rev-1',
    name: 'Elena Rostova',
    role: 'Interior Designer',
    location: 'Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '3 days ago',
    productName: 'Scandinavian Oak Lounge Chair',
    comment: 'The craftsmanship on this chair exceeded all my expectations. The finish is immaculate and delivery was prompt. DailyNest has quickly become my go-to for home staples.'
  },
  {
    id: 'rev-2',
    name: 'Marcus Chen',
    role: 'Software Architect',
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '1 week ago',
    productName: 'Active Noise Cancelling Wireless Headphones',
    comment: 'Sound stage is crisp and the ANC cuts through coffee shop chatter effortlessly. Battery lasts 35 hours as advertised. Genuinely impressive quality.'
  },
  {
    id: 'rev-3',
    name: 'Sophia Patel',
    role: 'Culinary Enthusiast',
    location: 'Chicago, IL',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2 weeks ago',
    productName: 'Enameled Cast Iron Dutch Oven 5.5Qt',
    comment: 'Heats beautifully even on induction and cleans like a breeze. The forest green enamel looks stunning sitting on the stove top!'
  },
  {
    id: 'rev-4',
    name: 'Julian Vance',
    role: 'Creative Director',
    location: 'Brooklyn, NY',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: 'Last month',
    productName: 'Full-Grain Leather Bound Refillable Travel Journal',
    comment: 'The paper takes fountain pen ink with zero bleedthrough. The leather feels incredible in hands. An heirloom grade product for an honest price.'
  }
];
