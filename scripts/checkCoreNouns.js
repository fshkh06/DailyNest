import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkNouns() {
  const photosTsv = fs.readFileSync(path.join(__dirname, 'photos.tsv'), 'utf-8');
  const photoLines = photosTsv.split('\n');
  const photosById = new Map();

  for (let i = 1; i < photoLines.length; i++) {
    const line = photoLines[i];
    if (!line) continue;
    const cols = line.split('\t');
    const id = cols[0];
    const url = cols[2];
    const desc = ((cols[8] || '') + ' ' + (cols[25] || '')).toLowerCase();
    if (id && url) {
      photosById.set(id, { id, url, desc, keywords: new Set() });
    }
  }

  const keywordsTsv = fs.readFileSync(path.join(__dirname, 'keywords.tsv'), 'utf-8');
  const kwLines = keywordsTsv.split('\n');
  for (let i = 1; i < kwLines.length; i++) {
    const line = kwLines[i];
    if (!line) continue;
    const tabIdx = line.indexOf('\t');
    if (tabIdx === -1) continue;
    const photoId = line.slice(0, tabIdx);
    const nextTab = line.indexOf('\t', tabIdx + 1);
    const kw = (nextTab === -1 ? line.slice(tabIdx + 1) : line.slice(tabIdx + 1, nextTab)).toLowerCase().trim();
    const p = photosById.get(photoId);
    if (p && kw) p.keywords.add(kw);
  }

  // Define core nouns for all 53 subcategories
  const subcatNouns = {
    // Home & Living (215 items)
    'Chairs & Seating': ['chair', 'armchair', 'stool', 'seat', 'bench'],
    'Tables & Desks': ['table', 'desk', 'nightstand'],
    'Sofas & Beds': ['couch', 'sofa', 'bed', 'mattress'],
    'Lighting & Lamps': ['lamp', 'lighting', 'light', 'chandelier', 'lantern'],
    'Bedding & Linens': ['bedding', 'blanket', 'pillow', 'linen', 'sheet'],
    'Rugs & Carpets': ['rug', 'carpet', 'mat'],
    'Storage & Organization': ['basket', 'shelf', 'shelving', 'drawer', 'closet', 'rack'],
    'Home Decor & Accents': ['vase', 'mirror', 'clock', 'sculpture', 'frame', 'decor'],
    'Candles & Home Fragrance': ['candle', 'incense', 'diffuser', 'aroma', 'fragrance', 'wax'],
    'Plants & Planters': ['plant', 'planter', 'pot', 'flowerpot', 'greenery', 'succulent'],
    'Bathroom & Cleaning': ['towel', 'soap', 'bath', 'bathroom', 'shower'],

    // Kitchen & Dining (215 items)
    'Cookware & Pans': ['cookware', 'pan', 'pot', 'skillet', 'casserole', 'wok', 'dutch oven'],
    'Knives & Cutlery': ['knife', 'cutlery', 'fork', 'spoon', 'blade'],
    'Small Appliances': ['appliance', 'blender', 'toaster', 'kettle', 'mixer', 'microwave'],
    'Coffee & Tea Essentials': ['coffee', 'tea', 'espresso', 'mug', 'cup', 'teapot', 'cafetiere'],
    'Dinnerware & Tableware': ['plate', 'bowl', 'dish', 'dinnerware', 'tableware', 'porcelain'],
    'Drinkware & Hydration': ['bottle', 'glass', 'tumbler', 'flask', 'goblet'],
    'Food Storage & Organization': ['container', 'jar', 'canister', 'box', 'pantry', 'dispenser'],
    'Bake & Prep Tools': ['baking', 'bowl', 'whisk', 'rolling pin', 'spatula', 'tin', 'muffin'],

    // Electronics & Tech (215 items)
    'Headphones & Audio': ['headphone', 'headphones', 'earphone', 'earphones', 'earbuds', 'speaker', 'audio', 'headset'],
    'Power & Charging': ['charger', 'battery', 'cable', 'power', 'cord', 'adapter', 'plug'],
    'Computer & Desk Gear': ['keyboard', 'mouse', 'monitor', 'screen', 'laptop', 'computer'],
    'Wearables & Smart Tech': ['smartwatch', 'watch', 'tracker', 'wearable', 'fitness band'],
    'Camera & Streaming': ['camera', 'lens', 'tripod', 'microphone', 'webcam', 'photography'],
    'Smart Home Devices': ['gadget', 'sensor', 'remote', 'device', 'smart home', 'camera'],
    'Phone & Tablet Accessories': ['phone', 'case', 'iphone', 'tablet', 'ipad', 'smartphone'],
    'Storage & Accessories': ['drive', 'usb', 'ssd', 'hard drive', 'electronics', 'tech'],

    // Fashion & Accessories (215 items)
    'Footwear & Shoes': ['shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots', 'loafer', 'footwear'],
    'Bags & Backpacks': ['backpack', 'bag', 'tote', 'duffel', 'duffle', 'briefcase', 'handbag', 'satchel'],
    'Wallets & Leather Accessories': ['wallet', 'cardholder', 'leather', 'belt', 'buckle', 'pouch'],
    'Watches & Jewelry': ['watch', 'jewelry', 'jewellery', 'ring', 'necklace', 'bracelet', 'earring'],
    'Eyewear & Sunglasses': ['sunglasses', 'glasses', 'eyewear', 'spectacles'],
    'Casual & Outerwear': ['t-shirt', 'shirt', 'hoodie', 'jacket', 'coat', 'sweater', 'sweatshirt', 'clothing', 'apparel'],
    'Hats, Scarves & Small Accessories': ['hat', 'cap', 'beanie', 'scarf', 'glove', 'gloves', 'accessory'],

    // Personal Care & Beauty (215 items)
    'Skincare Essentials': ['skincare', 'serum', 'lotion', 'cream', 'moisturizer', 'cleanser', 'cosmetic', 'cosmetics'],
    'Haircare & Styling': ['hair', 'shampoo', 'conditioner', 'comb', 'brush', 'dryer', 'styling'],
    'Body & Bath Rituals': ['scrub', 'bath', 'soap', 'body wash', 'spa', 'lotion'],
    "Men's Grooming": ['razor', 'shave', 'shaving', 'beard', 'trimmer', 'grooming'],
    'Beauty Tools & Organizers': ['mirror', 'makeup', 'brush', 'roller', 'sponge', 'vanity', 'cosmetic'],
    'Lip & Eye Care': ['lip', 'lipstick', 'balm', 'eye', 'mascara', 'eyeliner'],
    'Nail Care & Wellness': ['nail', 'manicure', 'wellness', 'massage', 'pedicure'],

    // Travel & Lifestyle (215 items)
    'Luggage & Suitcases': ['luggage', 'suitcase', 'baggage', 'carry-on'],
    'Travel Bags & Organizers': ['toiletry', 'pouch', 'packing', 'duffel', 'travel bag', 'organizer'],
    'Travel Comfort & Accessories': ['pillow', 'neck pillow', 'mask', 'umbrella', 'adapter', 'travel'],
    'Outdoor & Camping': ['tent', 'camping', 'camp', 'sleeping bag', 'lantern', 'hiking', 'backpacking'],
    'Fitness & Active Living': ['yoga', 'mat', 'dumbbell', 'fitness', 'exercise', 'workout', 'gym'],
    'Everyday Carry & Gadgets': ['knife', 'pocket', 'flashlight', 'torch', 'keychain', 'edc', 'tool'],

    // Gifts & Stationery (215 items)
    'Notebooks & Journals': ['notebook', 'journal', 'diary', 'notepad', 'planner', 'sketchbook'],
    'Fine Pens & Writing': ['pen', 'fountain pen', 'pencil', 'ink', 'calligraphy', 'writing'],
    'Desk Organizers & Stationery': ['organizer', 'tray', 'holder', 'stationery', 'desk', 'folder'],
    'Art & Creative Supplies': ['paint', 'watercolor', 'palette', 'art', 'canvas', 'colored pencil', 'brush'],
    'Gift Sets & Boxes': ['gift', 'box', 'package', 'ribbon', 'present'],
    'Cards & Wraps': ['card', 'cards', 'wrapping', 'paper', 'envelope', 'greeting card']
  };

  console.log('\n--- Checking Subcategory Coverage ---');
  let minPhotos = 999999;
  for (const [subcat, nouns] of Object.entries(subcatNouns)) {
    const matched = [];
    for (const p of photosById.values()) {
      const match = nouns.some(n => p.keywords.has(n) || p.desc.includes(n));
      if (match) matched.push(p);
    }
    if (matched.length < minPhotos) minPhotos = matched.length;
    console.log(`  ${subcat.padEnd(35)} : ${matched.length} photos (target ~35)`);
  }
  console.log(`\nMin photos for any subcategory: ${minPhotos}`);
}

checkNouns().catch(e => console.error(e));
