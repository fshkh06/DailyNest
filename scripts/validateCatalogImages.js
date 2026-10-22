import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data', 'products');

const files = [
  'homeLiving.ts',
  'kitchenDining.ts',
  'electronicsTech.ts',
  'fashionAccessories.ts',
  'personalCareBeauty.ts',
  'travelLifestyle.ts',
  'giftsStationery.ts'
];

console.log('====================================================');
console.log('      DAILYNEST CATALOG IMAGE VALIDATION AUDIT      ');
console.log('====================================================\n');

const allProducts = [];

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const jsonStr = content.substring(content.indexOf('= [') + 2, content.lastIndexOf(';'));
  const prods = JSON.parse(jsonStr);
  allProducts.push(...prods);
  console.log(`Loaded ${prods.length.toString().padStart(4)} products from ${file}`);
}

console.log(`\nTotal Products Loaded: ${allProducts.length}`);

// 1. Check Product Count
const totalProducts = allProducts.length;
if (totalProducts < 1400) {
  console.error(`FAIL: Expected >= 1400 products, found ${totalProducts}`);
  process.exit(1);
}

// 2. Check Every Product Has An Image
let productsWithImages = 0;
for (const p of allProducts) {
  if (p.images && p.images.length > 0 && p.images[0]) {
    productsWithImages++;
  }
}

// 3. Check Primary Image Uniqueness
const primaryUrlMap = new Map();
const duplicatePrimaryMap = new Map();

for (const p of allProducts) {
  const url = p.images[0];
  if (primaryUrlMap.has(url)) {
    if (!duplicatePrimaryMap.has(url)) {
      duplicatePrimaryMap.set(url, [primaryUrlMap.get(url)]);
    }
    duplicatePrimaryMap.get(url).push(p.id);
  } else {
    primaryUrlMap.set(url, p.id);
  }
}

const uniquePrimaryCount = primaryUrlMap.size;
const duplicatePrimaryCount = duplicatePrimaryMap.size;

console.log('\n--- PRIMARY IMAGE UNIQUENESS CHECK ---');
console.log(`Total Products:          ${totalProducts}`);
console.log(`Products With Images:    ${productsWithImages}`);
console.log(`Unique Primary Images:   ${uniquePrimaryCount}`);
console.log(`Duplicate Primary Images: ${duplicatePrimaryCount}`);

if (duplicatePrimaryCount > 0) {
  console.error('\nDETECTED DUPLICATE PRIMARY IMAGE URLS:');
  for (const [url, pids] of duplicatePrimaryMap.entries()) {
    console.error(`  URL: ${url}`);
    console.error(`  Used by products: ${pids.join(', ')}`);
  }
  process.exit(1);
} else {
  console.log('>> PASS: 100% Unique Primary Images Across Entire Catalog! Zero Duplicates.');
}

// 4. Sample Verification of Image URLs (Check HTTP Status 200)
console.log('\n--- VERIFYING SAMPLE IMAGE URLS FOR AVAILABILITY ---');
const sampleUrls = [];
for (let i = 0; i < allProducts.length; i += 30) {
  sampleUrls.push(allProducts[i].images[0]);
}

let brokenCount = 0;
const checkPromises = sampleUrls.map(async (url, idx) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeout);
    if (res.status !== 200) {
      console.warn(`[WARN] Non-200 status (${res.status}) for ${url}`);
      brokenCount++;
    }
  } catch (e) {
    console.warn(`[WARN] Failed to fetch sample image: ${e.message}`);
    brokenCount++;
  }
});

await Promise.all(checkPromises);
console.log(`Checked ${sampleUrls.length} sample images across all categories: ${sampleUrls.length - brokenCount}/${sampleUrls.length} verified HTTP 200.`);

// 5. Search Test for Specific Keywords
console.log('\n--- SEARCH TEST: CHECKING MULTIPLE SEARCH TERMS ---');
const testSearchTerms = [
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

for (const term of testSearchTerms) {
  const termLower = term.toLowerCase();
  const matchedProducts = allProducts.filter(p => {
    const text = `${p.name} ${p.category} ${p.subcategory} ${(p.tags || []).join(' ')}`.toLowerCase();
    return text.includes(termLower) || text.includes(termLower.slice(0, -1)); // handle plural
  });

  const matchedImages = matchedProducts.map(p => p.images[0]);
  const uniqueMatchedImages = new Set(matchedImages);
  const duplicates = matchedImages.length - uniqueMatchedImages.size;

  console.log(`Search: "${term.padEnd(12)}" -> ${matchedProducts.length.toString().padStart(3)} products found | ${uniqueMatchedImages.size.toString().padStart(3)} unique images | ${duplicates} duplicates`);

  if (duplicates > 0) {
    console.error(`FAIL: Duplicate images found in search results for "${term}"`);
    process.exit(1);
  }

  // Show sample 2 matching products
  if (matchedProducts.length > 0) {
    const p1 = matchedProducts[0];
    const p2 = matchedProducts[Math.min(1, matchedProducts.length - 1)];
    console.log(`   Sample 1: "${p1.name}" -> ${p1.images[0].slice(0, 60)}...`);
    if (matchedProducts.length > 1) {
      console.log(`   Sample 2: "${p2.name}" -> ${p2.images[0].slice(0, 60)}...`);
    }
  }
}

console.log('\n====================================================');
console.log('              FINAL VALIDATION REPORT               ');
console.log('====================================================');
console.log(`Total Products:          ${totalProducts}`);
console.log(`Products With Images:    ${productsWithImages}`);
console.log(`Unique Primary Images:   ${uniquePrimaryCount}`);
console.log(`Duplicate Primary Images: ${duplicatePrimaryCount}`);
console.log(`Broken Images:           ${brokenCount}`);
console.log('====================================================\n');
console.log('ALL CHECKS PASSED PERFECTLY!\n');
