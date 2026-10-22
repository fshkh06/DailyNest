import { CategoryInfo } from '../types/product';

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'cat-1',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Transform your space with timeless furniture, ambient lighting, cozy bedding, and modern decor.',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    itemCount: 215,
    subcategories: [
      'Chairs & Seating',
      'Tables & Desks',
      'Sofas & Beds',
      'Lighting & Lamps',
      'Bedding & Linens',
      'Rugs & Carpets',
      'Storage & Organization',
      'Home Decor & Accents',
      'Candles & Home Fragrance',
      'Plants & Planters',
      'Bathroom & Cleaning'
    ]
  },
  {
    id: 'cat-2',
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    description: 'Elevate your culinary craft with chef-grade cookware, artisanal dinnerware, and smart appliances.',
    icon: 'UtensilsCrossed',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    itemCount: 215,
    subcategories: [
      'Cookware & Pans',
      'Knives & Cutlery',
      'Small Appliances',
      'Coffee & Tea Essentials',
      'Dinnerware & Tableware',
      'Drinkware & Hydration',
      'Food Storage & Organization',
      'Bake & Prep Tools'
    ]
  },
  {
    id: 'cat-3',
    name: 'Electronics & Tech Accessories',
    slug: 'electronics-tech',
    description: 'Smart productivity gear, high-fidelity audio, rapid GaN chargers, and sleek desk aesthetics.',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    itemCount: 215,
    subcategories: [
      'Headphones & Audio',
      'Power & Charging',
      'Computer & Desk Gear',
      'Wearables & Smart Tech',
      'Camera & Streaming',
      'Smart Home Devices',
      'Phone & Tablet Accessories',
      'Storage & Accessories'
    ]
  },
  {
    id: 'cat-4',
    name: 'Fashion & Accessories',
    slug: 'fashion-accessories',
    description: 'Contemporary daily apparel, heritage leather goods, premium footwear, and timeless accessories.',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    itemCount: 215,
    subcategories: [
      'Footwear & Shoes',
      'Bags & Backpacks',
      'Wallets & Leather Accessories',
      'Watches & Jewelry',
      'Eyewear & Sunglasses',
      'Casual & Outerwear',
      'Hats, Scarves & Small Accessories'
    ]
  },
  {
    id: 'cat-5',
    name: 'Personal Care & Beauty',
    slug: 'personal-care-beauty',
    description: 'Clean skincare formulas, nourishing haircare, daily grooming essentials, and calming bath rituals.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    itemCount: 215,
    subcategories: [
      'Skincare Essentials',
      'Haircare & Styling',
      'Body & Bath Rituals',
      'Men\'s Grooming',
      'Beauty Tools & Organizers',
      'Lip & Eye Care',
      'Nail Care & Wellness'
    ]
  },
  {
    id: 'cat-6',
    name: 'Travel & Lifestyle',
    slug: 'travel-lifestyle',
    description: 'Engineered luggage, ultralight packing essentials, outdoor gear, and active wellness tools.',
    icon: 'Compass',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80',
    itemCount: 215,
    subcategories: [
      'Luggage & Suitcases',
      'Travel Bags & Organizers',
      'Travel Comfort & Accessories',
      'Outdoor & Camping',
      'Fitness & Active Living',
      'Everyday Carry & Gadgets'
    ]
  },
  {
    id: 'cat-7',
    name: 'Gifts & Stationery',
    slug: 'gifts-stationery',
    description: 'Fine writing instruments, archival paper journals, handcrafted desk accessories, and gift sets.',
    icon: 'Gift',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    itemCount: 215,
    subcategories: [
      'Notebooks & Journals',
      'Fine Pens & Writing',
      'Desk Organizers & Stationery',
      'Art & Creative Supplies',
      'Gift Sets & Boxes',
      'Cards & Wraps'
    ]
  }
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES_DATA.find(c => c.slug === slug);
}
