import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data', 'products');

async function checkSubcatCoverage() {
  const fileNames = [
    'electronicsTech.ts',
    'kitchenDining.ts',
    'homeLiving.ts',
    'fashionAccessories.ts',
    'personalCareBeauty.ts',
    'travelLifestyle.ts',
    'giftsStationery.ts'
  ];

  for (const f of fileNames) {
    const content = fs.readFileSync(path.join(dataDir, f), 'utf-8');
    const jsonStr = content.substring(content.indexOf('= [') + 2, content.lastIndexOf(';'));
    const products = JSON.parse(jsonStr);
    const subcats = [...new Set(products.map(p => p.subcategory))];
    console.log(`\n=== ${f} (${products.length} products, ${subcats.length} subcats) ===`);
    for (const sc of subcats) {
      const count = products.filter(p => p.subcategory === sc).length;
      // Test search
      const q = sc.replace(/&/g, ' ').replace(/\s+/g, ' ').trim();
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url|mime&format=json`;
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'DailyNestApp/1.0' } });
        const data = await res.json();
        const pages = Object.values(data.query?.pages || {});
        const valid = pages.filter(p => {
          const info = p.imageinfo?.[0];
          return info && (info.mime === 'image/jpeg' || info.mime === 'image/png');
        });
        console.log(`  Subcat: "${sc}" (needs ${count}) -> Found ${valid.length} valid images`);
      } catch (e) {
        console.log(`  Subcat: "${sc}" -> Error: ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 150));
    }
  }
}

checkSubcatCoverage();
