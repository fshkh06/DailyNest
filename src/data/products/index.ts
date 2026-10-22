import { Product } from '../../types/product';
import { homeLivingProducts } from './homeLiving';
import { kitchenDiningProducts } from './kitchenDining';
import { electronicsTechProducts } from './electronicsTech';
import { fashionAccessoriesProducts } from './fashionAccessories';
import { personalCareBeautyProducts } from './personalCareBeauty';
import { travelLifestyleProducts } from './travelLifestyle';
import { giftsStationeryProducts } from './giftsStationery';

export const ALL_PRODUCTS: Product[] = [
  ...homeLivingProducts,
  ...kitchenDiningProducts,
  ...electronicsTechProducts,
  ...fashionAccessoriesProducts,
  ...personalCareBeautyProducts,
  ...travelLifestyleProducts,
  ...giftsStationeryProducts,
];

export const PRODUCTS_BY_ID: Record<string, Product> = ALL_PRODUCTS.reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {} as Record<string, Product>);

export const PRODUCTS_BY_SLUG: Record<string, Product> = ALL_PRODUCTS.reduce((acc, product) => {
  acc[product.slug] = product;
  return acc;
}, {} as Record<string, Product>);

export function getProductById(id: string): Product | undefined {
  return PRODUCTS_BY_ID[id];
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS_BY_SLUG[slug];
}

export function getProductsByCategory(categoryName: string): Product[] {
  return ALL_PRODUCTS.filter(
    p => p.category.toLowerCase() === categoryName.toLowerCase() ||
         p.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') === categoryName.toLowerCase()
  );
}

export function getTrendingProducts(limit: number = 8): Product[] {
  return ALL_PRODUCTS.filter(p => p.isTrending).slice(0, limit);
}

export function getBestSellers(limit: number = 8): Product[] {
  return ALL_PRODUCTS.filter(p => p.isBestSeller).slice(0, limit);
}

export function getDealProducts(limit: number = 8): Product[] {
  return ALL_PRODUCTS.filter(p => p.isDeal).slice(0, limit);
}

export function getRecommendedProducts(category: string, currentId?: string, limit: number = 4): Product[] {
  return ALL_PRODUCTS
    .filter(p => p.category === category && p.id !== currentId)
    .slice(0, limit);
}
