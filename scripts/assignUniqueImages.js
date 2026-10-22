import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data', 'products');

// 1. Load dataset
console.log('Loading Unsplash Lite photos.tsv...');
const photosTsv = fs.readFileSync(path.join(__dirname, 'photos.tsv'), 'utf-8');
const photoLines = photosTsv.split('\n');
const photos = [];

for (let i = 1; i < photoLines.length; i++) {
  const line = photoLines[i];
  if (!line) continue;
  const cols = line.split('\t');
  const id = cols[0];
  const url = cols[2];
  const desc = ((cols[8] || '') + ' ' + (cols[25] || '')).toLowerCase();
  if (id && url) {
    photos.push({
      id,
      url: `${url}?auto=format&fit=crop&w=800&q=80`,
      desc,
      keywords: new Set()
    });
  }
}

const photoMap = new Map(photos.map(p => [p.id, p]));
console.log(`Loaded ${photos.length} photos.`);

console.log('Loading keywords.tsv...');
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
  const p = photoMap.get(photoId);
  if (p && kw) p.keywords.add(kw);
}
console.log('Keywords mapped.');

// 2. Define Category & Subcategory Keyword Rules
const SUBCATEGORY_RULES = {
  // Home & Living
  'Chairs & Seating': {
    primary: ['chair', 'armchair', 'stool', 'seat', 'bench', 'recliner', 'seating'],
    secondary: ['furniture', 'living room', 'wood', 'velvet', 'interior']
  },
  'Tables & Desks': {
    primary: ['table', 'desk', 'nightstand', 'workstation', 'counter', 'credenza'],
    secondary: ['furniture', 'wood', 'workspace', 'home office', 'living room']
  },
  'Sofas & Beds': {
    primary: ['sofa', 'couch', 'bed', 'mattress', 'futon', 'daybed', 'headboard'],
    secondary: ['living room', 'bedroom', 'cushion', 'linen', 'interior']
  },
  'Lighting & Lamps': {
    primary: ['lamp', 'lighting', 'light', 'chandelier', 'sconce', 'lantern', 'bulb'],
    secondary: ['ceiling', 'ambient', 'desk lamp', 'interior', 'decor']
  },
  'Bedding & Linens': {
    primary: ['bedding', 'blanket', 'pillow', 'linen', 'sheet', 'duvet', 'quilt', 'comforter'],
    secondary: ['bedroom', 'cotton', 'cushion', 'cozy', 'fabric']
  },
  'Rugs & Carpets': {
    primary: ['rug', 'carpet', 'mat', 'runner', 'floor'],
    secondary: ['wool', 'jute', 'flooring', 'textile', 'living room']
  },
  'Storage & Organization': {
    primary: ['basket', 'shelf', 'shelving', 'drawer', 'closet', 'rack', 'organizer', 'storage'],
    secondary: ['wood', 'bamboo', 'home', 'bins', 'furniture']
  },
  'Home Decor & Accents': {
    primary: ['vase', 'mirror', 'clock', 'sculpture', 'frame', 'decor', 'ceramic', 'accent'],
    secondary: ['art', 'wall', 'interior', 'decoration', 'living room']
  },
  'Candles & Home Fragrance': {
    primary: ['candle', 'incense', 'diffuser', 'aroma', 'fragrance', 'wax', 'scented'],
    secondary: ['glass', 'amber', 'flame', 'aromatherapy', 'decor']
  },
  'Plants & Planters': {
    primary: ['plant', 'planter', 'pot', 'flowerpot', 'greenery', 'succulent', 'indoor plant', 'leaves'],
    secondary: ['nature', 'terracotta', 'botanical', 'ceramic pot', 'green']
  },
  'Bathroom & Cleaning': {
    primary: ['towel', 'soap', 'bath', 'bathroom', 'shower', 'dispenser', 'mat'],
    secondary: ['clean', 'water', 'hygiene', 'ceramic', 'spa']
  },

  // Kitchen & Dining
  'Cookware & Pans': {
    primary: ['cookware', 'pan', 'pot', 'skillet', 'casserole', 'wok', 'dutch oven', 'saucepan', 'cooking'],
    secondary: ['kitchen', 'cast iron', 'food', 'chef', 'meal']
  },
  'Knives & Cutlery': {
    primary: ['knife', 'cutlery', 'fork', 'spoon', 'blade', 'santoku', 'chef knife', 'silverware'],
    secondary: ['kitchen', 'steel', 'wood', 'cooking', 'tableware']
  },
  'Small Appliances': {
    primary: ['appliance', 'blender', 'toaster', 'kettle', 'mixer', 'coffee maker', 'espresso', 'air fryer'],
    secondary: ['kitchen', 'electric', 'machine', 'cooking', 'countertop']
  },
  'Coffee & Tea Essentials': {
    primary: ['coffee', 'tea', 'espresso', 'mug', 'cup', 'teapot', 'pour over', 'french press', 'cafetiere'],
    secondary: ['beans', 'roast', 'brew', 'drink', 'ceramic']
  },
  'Dinnerware & Tableware': {
    primary: ['plate', 'bowl', 'dish', 'dinnerware', 'tableware', 'porcelain', 'stoneware', 'platter'],
    secondary: ['dining', 'table', 'ceramic', 'food', 'meal']
  },
  'Drinkware & Hydration': {
    primary: ['bottle', 'glass', 'tumbler', 'flask', 'water bottle', 'goblet', 'wine glass'],
    secondary: ['drink', 'water', 'beverage', 'barware', 'hydration']
  },
  'Food Storage & Organization': {
    primary: ['container', 'jar', 'canister', 'box', 'pantry', 'dispenser', 'bento', 'storage'],
    secondary: ['kitchen', 'glass jar', 'food', 'meal prep', 'airtight']
  },
  'Bake & Prep Tools': {
    primary: ['baking', 'whisk', 'rolling pin', 'spatula', 'tin', 'muffin', 'measuring', 'mixing bowl'],
    secondary: ['kitchen', 'pastry', 'flour', 'dough', 'dessert']
  },

  // Electronics & Tech
  'Headphones & Audio': {
    primary: ['headphone', 'headphones', 'earphone', 'earphones', 'earbuds', 'speaker', 'audio', 'headset'],
    secondary: ['sound', 'music', 'bluetooth', 'wireless', 'device']
  },
  'Power & Charging': {
    primary: ['charger', 'battery', 'cable', 'power', 'cord', 'adapter', 'plug', 'usb', 'power bank'],
    secondary: ['device', 'electronics', 'phone', 'charging', 'tech']
  },
  'Computer & Desk Gear': {
    primary: ['keyboard', 'mouse', 'monitor', 'screen', 'laptop', 'computer', 'stand', 'keycaps'],
    secondary: ['desk', 'office', 'workspace', 'tech', 'hardware']
  },
  'Wearables & Smart Tech': {
    primary: ['smartwatch', 'watch', 'tracker', 'wearable', 'fitness band', 'fitness tracker'],
    secondary: ['wrist', 'health', 'digital', 'screen', 'device']
  },
  'Camera & Streaming': {
    primary: ['camera', 'lens', 'tripod', 'microphone', 'webcam', 'photography', 'ring light', 'dslr'],
    secondary: ['video', 'photo', 'studio', 'streaming', 'tech']
  },
  'Smart Home Devices': {
    primary: ['sensor', 'remote', 'device', 'smart home', 'camera', 'plug', 'doorbell', 'light bulb'],
    secondary: ['automation', 'electronics', 'gadget', 'home', 'technology']
  },
  'Phone & Tablet Accessories': {
    primary: ['phone', 'case', 'iphone', 'tablet', 'ipad', 'smartphone', 'mobile', 'screen protector'],
    secondary: ['device', 'accessory', 'protective', 'electronics', 'tech']
  },
  'Storage & Accessories': {
    primary: ['drive', 'usb', 'ssd', 'hard drive', 'electronics', 'memory card', 'sd card', 'adapter'],
    secondary: ['tech', 'storage', 'data', 'computer', 'hardware']
  },

  // Fashion & Accessories
  'Footwear & Shoes': {
    primary: ['shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots', 'loafer', 'footwear', 'sandal'],
    secondary: ['leather', 'laces', 'fashion', 'streetwear', 'athletic']
  },
  'Bags & Backpacks': {
    primary: ['backpack', 'bag', 'tote', 'duffel', 'duffle', 'briefcase', 'handbag', 'satchel', 'messenger'],
    secondary: ['leather', 'canvas', 'travel', 'fashion', 'shoulder']
  },
  'Wallets & Leather Accessories': {
    primary: ['wallet', 'cardholder', 'leather', 'belt', 'buckle', 'pouch', 'card case'],
    secondary: ['pocket', 'bifold', 'fashion', 'accessory', 'money']
  },
  'Watches & Jewelry': {
    primary: ['watch', 'jewelry', 'jewellery', 'ring', 'necklace', 'bracelet', 'earring', 'timepiece'],
    secondary: ['silver', 'gold', 'wrist', 'classic', 'fashion']
  },
  'Eyewear & Sunglasses': {
    primary: ['sunglasses', 'glasses', 'eyewear', 'spectacles', 'shades', 'frames'],
    secondary: ['fashion', 'face', 'summer', 'polarized', 'vision']
  },
  'Casual & Outerwear': {
    primary: ['t-shirt', 'shirt', 'hoodie', 'jacket', 'coat', 'sweater', 'sweatshirt', 'clothing', 'apparel'],
    secondary: ['cotton', 'fashion', 'wear', 'streetwear', 'casual']
  },
  'Hats, Scarves & Small Accessories': {
    primary: ['hat', 'cap', 'beanie', 'scarf', 'glove', 'gloves', 'headwear', 'fedora'],
    secondary: ['wool', 'knit', 'winter', 'fashion', 'warm']
  },

  // Personal Care & Beauty
  'Skincare Essentials': {
    primary: ['skincare', 'serum', 'lotion', 'cream', 'moisturizer', 'cleanser', 'cosmetic', 'cosmetics', 'sunscreen'],
    secondary: ['face', 'skin', 'beauty', 'bottle', 'dropper']
  },
  'Haircare & Styling': {
    primary: ['hair', 'shampoo', 'conditioner', 'comb', 'brush', 'dryer', 'styling', 'scalp'],
    secondary: ['beauty', 'oil', 'treatment', 'bottle', 'salon']
  },
  'Body & Bath Rituals': {
    primary: ['scrub', 'bath', 'soap', 'body wash', 'spa', 'lotion', 'salts', 'wash'],
    secondary: ['body', 'skincare', 'hygiene', 'relax', 'beauty']
  },
  "Men's Grooming": {
    primary: ['razor', 'shave', 'shaving', 'beard', 'trimmer', 'grooming', 'shaving cream'],
    secondary: ['men', 'barber', 'blade', 'metal', 'hygiene']
  },
  'Beauty Tools & Organizers': {
    primary: ['mirror', 'makeup', 'brush', 'roller', 'sponge', 'vanity', 'cosmetic', 'gua sha'],
    secondary: ['beauty', 'face', 'skincare', 'tools', 'table']
  },
  'Lip & Eye Care': {
    primary: ['lip', 'lipstick', 'balm', 'eye', 'mascara', 'eyeliner', 'lip balm', 'patches'],
    secondary: ['beauty', 'makeup', 'face', 'cosmetics', 'skincare']
  },
  'Nail Care & Wellness': {
    primary: ['nail', 'manicure', 'wellness', 'massage', 'pedicure', 'file', 'cuticle'],
    secondary: ['hands', 'beauty', 'care', 'spa', 'tools']
  },

  // Travel & Lifestyle
  'Luggage & Suitcases': {
    primary: ['luggage', 'suitcase', 'baggage', 'carry-on', 'spinner', 'trunk'],
    secondary: ['travel', 'trip', 'airport', 'wheels', 'packing']
  },
  'Travel Bags & Organizers': {
    primary: ['toiletry', 'pouch', 'packing', 'duffel', 'travel bag', 'organizer', 'bag', 'backpack'],
    secondary: ['travel', 'zipper', 'luggage', 'compartment', 'packing cubes']
  },
  'Travel Comfort & Accessories': {
    primary: ['pillow', 'neck pillow', 'mask', 'umbrella', 'adapter', 'travel', 'earplugs'],
    secondary: ['flight', 'airplane', 'sleep', 'comfort', 'trip']
  },
  'Outdoor & Camping': {
    primary: ['tent', 'camping', 'camp', 'sleeping bag', 'lantern', 'hiking', 'backpacking', 'stove'],
    secondary: ['outdoor', 'nature', 'adventure', 'mountain', 'wilderness']
  },
  'Fitness & Active Living': {
    primary: ['yoga', 'mat', 'dumbbell', 'fitness', 'exercise', 'workout', 'gym', 'bands', 'roller'],
    secondary: ['sport', 'health', 'athletic', 'training', 'stretching']
  },
  'Everyday Carry & Gadgets': {
    primary: ['knife', 'pocket', 'flashlight', 'torch', 'keychain', 'edc', 'tool', 'multitool', 'key'],
    secondary: ['metal', 'gear', 'tactical', 'compact', 'carry']
  },

  // Gifts & Stationery
  'Notebooks & Journals': {
    primary: ['notebook', 'journal', 'diary', 'notepad', 'planner', 'sketchbook', 'book', 'paper'],
    secondary: ['writing', 'pages', 'stationery', 'desk', 'leather']
  },
  'Fine Pens & Writing': {
    primary: ['pen', 'fountain pen', 'pencil', 'ink', 'calligraphy', 'writing', 'rollerball', 'nib'],
    secondary: ['stationery', 'paper', 'desk', 'metal', 'lettering']
  },
  'Desk Organizers & Stationery': {
    primary: ['organizer', 'tray', 'holder', 'stationery', 'desk', 'folder', 'tape dispenser', 'clips'],
    secondary: ['office', 'wood', 'workspace', 'document', 'pen holder']
  },
  'Art & Creative Supplies': {
    primary: ['paint', 'watercolor', 'palette', 'art', 'canvas', 'colored pencil', 'brush', 'drawing'],
    secondary: ['creative', 'colors', 'artist', 'pigment', 'craft']
  },
  'Gift Sets & Boxes': {
    primary: ['gift', 'box', 'package', 'ribbon', 'present', 'gift set', 'wrapping'],
    secondary: ['celebrate', 'keepsake', 'luxury', 'packaging', 'holiday']
  },
  'Cards & Wraps': {
    primary: ['card', 'cards', 'wrapping', 'paper', 'envelope', 'greeting card', 'tags', 'twine'],
    secondary: ['stationery', 'gift', 'letterpress', 'papercraft', 'holiday']
  }
};

// Compute photo score for a specific product
function scorePhoto(photo, product) {
  let score = 0;
  const nameWords = product.name.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
  const rules = SUBCATEGORY_RULES[product.subcategory] || { primary: [], secondary: [] };

  // 1. Check product title direct word matches
  for (const w of nameWords) {
    if (photo.keywords.has(w)) {
      score += 35;
    } else if (photo.desc.includes(w)) {
      score += 18;
    }
  }

  // 2. Check subcategory primary keywords
  for (const w of rules.primary) {
    if (photo.keywords.has(w)) {
      score += 20;
    } else if (photo.desc.includes(w)) {
      score += 10;
    }
  }

  // 3. Check subcategory secondary keywords
  for (const w of rules.secondary) {
    if (photo.keywords.has(w)) {
      score += 5;
    } else if (photo.desc.includes(w)) {
      score += 3;
    }
  }

  // 4. Boost if matching product tags
  if (product.tags) {
    for (const tag of product.tags) {
      const cleanTag = tag.toLowerCase().replace(/-/g, ' ');
      if (photo.keywords.has(cleanTag)) score += 10;
      else if (photo.desc.includes(cleanTag)) score += 5;
    }
  }

  return score;
}

const fileMap = {
  'homeLiving.ts': 'homeLivingProducts',
  'kitchenDining.ts': 'kitchenDiningProducts',
  'electronicsTech.ts': 'electronicsTechProducts',
  'fashionAccessories.ts': 'fashionAccessoriesProducts',
  'personalCareBeauty.ts': 'personalCareBeautyProducts',
  'travelLifestyle.ts': 'travelLifestyleProducts',
  'giftsStationery.ts': 'giftsStationeryProducts'
};

const globalUsedPrimary = new Set();
const globalUsedAll = new Set();

let totalProductsProcessed = 0;

for (const [fileName, varName] of Object.entries(fileMap)) {
  const filePath = path.join(dataDir, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  const jsonStr = content.substring(content.indexOf('= [') + 2, content.lastIndexOf(';'));
  const products = JSON.parse(jsonStr);

  console.log(`\nProcessing ${fileName} (${products.length} products)...`);

  for (const product of products) {
    totalProductsProcessed++;
    const rules = SUBCATEGORY_RULES[product.subcategory] || { primary: [], secondary: [] };

    // Filter candidate photos that match subcategory primary or secondary rules
    const candidates = [];
    for (const photo of photos) {
      if (globalUsedPrimary.has(photo.url)) continue;

      const score = scorePhoto(photo, product);
      if (score > 0) {
        candidates.push({ photo, score });
      }
    }

    candidates.sort((a, b) => b.score - a.score);

    let primaryPhoto = null;
    if (candidates.length > 0) {
      primaryPhoto = candidates[0].photo;
    } else {
      // Emergency fallback: find any unused photo
      for (const photo of photos) {
        if (!globalUsedPrimary.has(photo.url)) {
          primaryPhoto = photo;
          break;
        }
      }
    }

    if (!primaryPhoto) {
      console.error(`ERROR: No primary image could be assigned for ${product.id}`);
      process.exit(1);
    }

    globalUsedPrimary.add(primaryPhoto.url);
    globalUsedAll.add(primaryPhoto.url);

    // Pick secondary gallery image
    let secondaryPhoto = null;
    for (let c = 1; c < candidates.length; c++) {
      const cand = candidates[c].photo;
      if (cand.url !== primaryPhoto.url && !globalUsedAll.has(cand.url)) {
        secondaryPhoto = cand;
        break;
      }
    }

    if (!secondaryPhoto) {
      for (let c = 1; c < candidates.length; c++) {
        const cand = candidates[c].photo;
        if (cand.url !== primaryPhoto.url) {
          secondaryPhoto = cand;
          break;
        }
      }
    }

    if (!secondaryPhoto) {
      secondaryPhoto = primaryPhoto;
    } else {
      globalUsedAll.add(secondaryPhoto.url);
    }

    product.images = [primaryPhoto.url, secondaryPhoto.url];
  }

  // Write updated products back to file
  const newContent = `import { Product } from '../../types/product';\n\nexport const ${varName}: Product[] = ${JSON.stringify(products, null, 2)};\n`;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Updated ${fileName} successfully!`);
}

console.log('\n=============================================');
console.log(`TOTAL PRODUCTS PROCESSED: ${totalProductsProcessed}`);
console.log(`UNIQUE PRIMARY IMAGES:    ${globalUsedPrimary.size}`);
console.log(`DUPLICATE PRIMARY IMAGES: ${totalProductsProcessed - globalUsedPrimary.size}`);
console.log(`TOTAL UNIQUE ALL IMAGES:  ${globalUsedAll.size}`);
console.log('=============================================');
