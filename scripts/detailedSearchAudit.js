import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data', 'products');

const files = [
  'electronicsTech.ts',
  'kitchenDining.ts',
  'homeLiving.ts',
  'fashionAccessories.ts',
  'personalCareBeauty.ts',
  'travelLifestyle.ts',
  'giftsStationery.ts'
];

const allProducts = [];
for (const file of files) {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const jsonStr = content.substring(content.indexOf('= [') + 2, content.lastIndexOf(';'));
  allProducts.push(...JSON.parse(jsonStr));
}

const testSearches = [
  'headphones',
  'earbuds',
  'shoes',
  'backpacks',
  'chairs',
  'mugs',
  'kitchen',
  'keyboards',
  'power banks',
  'skincare',
  'notebooks'
];

console.log('================================================================================');
console.log('       DETAILED PRODUCT IMAGE-MATCHING AUDIT FOR ALL 11 SEARCH TERMS');
console.log('================================================================================\n');

for (const term of testSearches) {
  const t = term.toLowerCase();
  const root = t.endsWith('s') ? t.slice(0, -1) : t;
  const results = allProducts.filter(p => {
    const text = `${p.name} ${p.subcategory} ${p.category} ${(p.tags || []).join(' ')}`.toLowerCase();
    return text.includes(t) || text.includes(root);
  });

  const urls = results.map(p => p.images[0]);
  const uniqueUrls = new Set(urls);
  const dups = urls.length - uniqueUrls.size;

  console.log(`\n================================================================================`);
  console.log(`SEARCH: "${term.toUpperCase()}" -> ${results.length} Products Found | Uniqueness: ${uniqueUrls.size}/${urls.length} (Duplicates: ${dups})`);
  console.log(`================================================================================`);

  // Print first 5 items with product name and primary image
  for (let i = 0; i < Math.min(6, results.length); i++) {
    const p = results[i];
    console.log(`  [#${i+1}] ${p.name}`);
    console.log(`       Subcategory: ${p.subcategory}`);
    console.log(`       Image:       ${p.images[0]}`);
  }
}
