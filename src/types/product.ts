export interface ProductSpecification {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  specifications: ProductSpecification;
  tags: string[];
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount: number;
  deliveryInfo: string;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isDeal?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export type CategorySlug = 
  | 'home-living'
  | 'kitchen-dining'
  | 'electronics-tech'
  | 'fashion-accessories'
  | 'personal-care-beauty'
  | 'travel-lifestyle'
  | 'gifts-stationery';

export interface CategoryInfo {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  icon: string;
  image: string;
  itemCount: number;
  subcategories: string[];
}

export interface FilterState {
  category?: string;
  subcategories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  minDiscount: number;
  inStockOnly: boolean;
  tags: string[];
}

export type SortOption =
  | 'recommended'
  | 'popularity'
  | 'newest'
  | 'price-low-high'
  | 'price-high-low'
  | 'rating'
  | 'discount'
  | 'reviews';
