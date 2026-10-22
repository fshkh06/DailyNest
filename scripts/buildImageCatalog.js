import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data', 'products');

// Targeted search queries per category and subcategory
const SEARCH_QUERIES = {
  'Home & Living': {
    'Chairs & Seating': [
      'accent chair armchair velvet modern furniture',
      'ergonomic mesh office chair high back desk',
      'scandinavian oak dining chair modern minimalist',
      'leather swivel recliner lounge chair living room'
    ],
    'Tables & Desks': [
      'modern solid wood coffee table living room',
      'electric standing desk computer workstation home office',
      'scandinavian round dining table modern minimal',
      'minimalist glass console table bedside nightstand'
    ],
    'Sofas & Beds': [
      'modern linen fabric 3 seater sofa couch',
      'japanese platform bed frame wooden minimalist',
      'sectional modular sofa velvet couch living room',
      'upholstered queen bed frame headboard bedroom'
    ],
    'Lighting & Lamps': [
      'modern brass arc floor lamp living room',
      'ceramic textured table lamp bedside ambient',
      'pendant ceiling light fixture modern chandelier',
      'minimalist desk lamp led adjustable reading'
    ],
    'Bedding & Linens': [
      'french linen duvet cover set luxury bedding',
      'chunky knit wool throw blanket cozy',
      'egyptian cotton bed sheets pillowcase set',
      'hypoallergenic plush bed pillows luxury bedding'
    ],
    'Rugs & Carpets': [
      'moroccan wool area rug modern geometric living room',
      'natural jute woven runner rug hallway',
      'plush shag rug living room contemporary carpet',
      'vintage distressed printed runner rug floor'
    ],
    'Storage & Organization': [
      'woven seagrass storage basket handles home',
      'bamboo multi tier shoe rack organizer entryway',
      'modular storage cubes shelf organizer bins',
      'floating wooden wall shelves storage display'
    ],
    'Home Decor & Accents': [
      'modern ceramic donut vase minimalist dried flowers',
      'arched wall mirror brass frame entryway decor',
      'minimalist silent wooden wall clock modern',
      'sculptural ceramic decorative object coffee table'
    ],
    'Candles & Home Fragrance': [
      'amber glass soy wax scented candle luxury',
      'ultrasonic ceramic aroma essential oil diffuser',
      'botanical reed diffuser glass bottle fragrance',
      'luxury scented candle ceramic vessel wooden wick'
    ],
    'Plants & Planters': [
      'modern ceramic plant pot with wooden stand',
      'terracotta indoor plant pot saucer minimalist',
      'hanging macrame ceramic planter pot indoor green',
      'self watering herb planter window box modern'
    ],
    'Bathroom & Cleaning': [
      'matte black bathroom accessories soap dispenser set',
      'diatomite stone bath mat ultra absorbent rapid dry',
      'plush organic cotton bath towels set luxury',
      'motion sensor automatic touchless trash can stainless'
    ]
  },
  'Kitchen & Dining': {
    'Cookware & Pans': [
      'nonstick granite frying pan skillet cookware',
      'enameled cast iron dutch oven pot with lid',
      'tri ply stainless steel saucepan with glass lid',
      'carbon steel wok flat bottom wood handle cookware'
    ],
    'Knives & Cutlery': [
      'japanese damascus chef knife vg10 8 inch',
      'german stainless steel santoku knife kitchen',
      'wooden knife block set cutlery kitchen knives',
      'serrated bread slicing knife wood handle cutlery'
    ],
    'Small Appliances': [
      'digital touchscreen air fryer countertop appliance',
      'espresso machine milk frother stainless steel',
      'countertop high speed blender smoothie maker',
      'electric gooseneck temperature kettle stainless'
    ],
    'Coffee & Tea Essentials': [
      'glass pour over coffee maker carafe dripper',
      'stainless steel insulated french press coffee brewer',
      'electric conical burr coffee bean grinder',
      'cold brew coffee maker pitcher glass filter'
    ],
    'Dinnerware & Tableware': [
      'matte ceramic stoneware dinner plates set 4',
      'organic earthenware pasta bowls salad bowl set',
      'matte gold stainless steel flatware silverware set',
      'linen dinner napkins placemats modern tabletop'
    ],
    'Drinkware & Hydration': [
      'vacuum insulated stainless steel tumbler with straw',
      'double wall borosilicate glass coffee mugs set',
      'crystal clear wine glasses stemless modern',
      'reusable glass water bottle silicone sleeve bamboo'
    ],
    'Food Storage & Organization': [
      'airtight glass meal prep food storage containers',
      'acrylic dry food cereal dispenser containers pantry',
      'stainless steel bento lunch box leakproof compartments',
      'glass spice jars bamboo lids labels organizer'
    ],
    'Bake & Prep Tools': [
      'heavy duty nonstick muffin baking pan cupcake',
      'silicone baking mats non stick reusable pastry sheet',
      'stainless steel mixing bowls with silicone base set',
      'stainless steel measuring cups and spoons set'
    ]
  },
  'Electronics & Tech Accessories': {
    'Headphones & Audio': [
      'over ear wireless active noise cancelling headphones black',
      'true wireless bluetooth earbuds charging case in ear',
      'portable waterproof bluetooth speaker rugged audio',
      'desktop studio reference monitor speakers pair audio'
    ],
    'Power & Charging': [
      '65w gan fast wall charger 3 port usb c',
      '20000mah portable power bank 100w fast charging',
      '3 in 1 foldable magnetic wireless charging station',
      'braided usb c to usb c fast charging cable 100w'
    ],
    'Computer & Desk Gear': [
      'mechanical gaming keyboard custom keycaps rgb',
      'ergonomic bluetooth wireless mouse silent click',
      'aluminum adjustable laptop stand ergonomic desk riser',
      'curved monitor light bar desk lamp eye care led'
    ],
    'Wearables & Smart Tech': [
      'amoled display smart watch gps heart rate sensor',
      'fitness tracker wristband step counter sleep monitor',
      'bluetooth smart audio sunglasses open ear polarized',
      'smart ring health tracker titanium sleep monitor'
    ],
    'Camera & Streaming': [
      '4k ultra hd webcam autofocus privacy shutter streaming',
      'usb condenser podcast studio microphone boom arm',
      'led bi color ring light with tripod stand streaming',
      'camera backpack padded divider compartments photography'
    ],
    'Smart Home Devices': [
      'wifi smart plug outlet energy monitoring remote control',
      'color changing rgb smart led light bulb home',
      'indoor wifi security camera night vision motion detection',
      'video doorbell camera wireless two way audio chime'
    ],
    'Phone & Tablet Accessories': [
      'magsafe magnetic leather wallet stand for iphone',
      'shockproof matte translucent phone case slim protective',
      'aluminum adjustable tablet stand holder desk ipad',
      'magnetic car mount wireless charger vent dashboard'
    ],
    'Storage & Accessories': [
      'rugged portable external ssd 1tb usb c high speed',
      '7 in 1 aluminum usb c hub hdmi card reader adapter',
      'waterproof travel cable organizer bag electronics accessories',
      'high speed uhs ii micro sd card with adapter'
    ]
  },
  'Fashion & Accessories': {
    'Footwear & Shoes': [
      'white leather minimalist low top casual sneakers',
      'breathable knit athletic running shoes athletic sneakers',
      'suede leather chelsea ankle boots classic footwear',
      'classic leather penny loafers dress shoes slip on'
    ],
    'Bags & Backpacks': [
      'water resistant commuter laptop backpack modern minimalist',
      'full grain leather messenger briefcase shoulder bag',
      'heavyweight canvas tote bag everyday shoulder shopper',
      'waterproof travel duffle weekender gym overnight bag'
    ],
    'Wallets & Leather Accessories': [
      'slim bifold genuine leather rfid blocking wallet',
      'minimalist aluminum cardholder with money cash strap',
      'full grain leather zip around passport travel wallet',
      'leather keychain key fob brass hardware luxury'
    ],
    'Watches & Jewelry': [
      'minimalist bauhaus automatic watch sapphire crystal mesh',
      'stainless steel chronograph watch leather strap classic',
      'sterling silver cuff bracelet minimalist unisex',
      'solid silver signet ring jewelry minimalist band'
    ],
    'Eyewear & Sunglasses': [
      'classic polarized wayfarer acetate sunglasses black',
      'vintage round metal frame uv400 sunglasses gold',
      'blue light blocking glasses anti fatigue computer eyewear',
      'square aviator polarized sunglasses luxury frame'
    ],
    'Casual & Outerwear': [
      'heavyweight 100 percent cotton crewneck t shirt basic',
      'french terry heavyweight pullover hoodie sweatshirt',
      'classic denim trucker jacket washed vintage casual',
      'lightweight water resistant packable puffer jacket coat'
    ],
    'Hats, Scarves & Small Accessories': [
      '100 percent merino wool ribbed knit winter beanie hat',
      'unstructured washed cotton baseball cap dad hat strapback',
      'wide brim straw fedora sun hat summer beach',
      'cashmere wool winter scarf soft fringed solid'
    ]
  },
  'Personal Care & Beauty': {
    'Skincare Essentials': [
      'hyaluronic acid facial serum glass dropper bottle skincare',
      'gentle foaming facial cleanser pump bottle green tea',
      'barrier repair ceramide face moisturizer cream jar',
      'mineral spf 50 face sunscreen lotion tube dermatology'
    ],
    'Haircare & Styling': [
      'argan oil nourishing shampoo pump bottle salon',
      'deep conditioning hair mask tub hydration salon',
      'rosemary mint scalp treatment hair growth oil dropper',
      'ionic hair dryer professional salon fast drying'
    ],
    'Body & Bath Rituals': [
      'himalayan pink salt body scrub exfoliating jar',
      'shea butter ultra moisturizing body cream lotion jar',
      'eucalyptus essential oil body wash bottle aromatherapy',
      'natural exfoliating loofah bath brush wooden handle'
    ],
    "Men's Grooming": [
      'double edge safety razor chrome metal shaving classic',
      'organic sandalwood beard oil dropper bottle grooming',
      'cordless waterproof electric beard hair trimmer kit',
      'badger hair shaving brush wooden handle luxury shave'
    ],
    'Beauty Tools & Organizers': [
      'rose quartz facial roller and gua sha sculpting tool set',
      'led lighted tabletop vanity makeup mirror dimmable touch',
      'sonic silicone waterproof facial cleansing brush device',
      'acrylic rotating cosmetic makeup organizer carousel'
    ],
    'Lip & Eye Care': [
      'nourishing berry lip sleeping mask pot lip care',
      'caffeine peptide eye contour cream dark circles tube',
      'organic beeswax tinted moisturizing lip balm stick trio',
      'cooling hydrogel under eye patches jar skincare'
    ],
    'Nail Care & Wellness': [
      'stainless steel professional manicure pedicure kit case',
      'crystal glass nail file gentle shaping manicure',
      'jojoba nail cuticle nourishing oil pen applicator',
      'heated electric acupressure foot massage device'
    ]
  },
  'Travel & Lifestyle': {
    'Luggage & Suitcases': [
      'hardshell polycarbonate carry on spinner suitcase 20 inch',
      'expandable checked rolling suitcase 24 inch tsa lock',
      'aluminum frame durable cabin carry on luggage spinner',
      'underseat rolling carry on bag with laptop compartment'
    ],
    'Travel Bags & Organizers': [
      'hanging travel toiletry bag waterproof wash bag organizer',
      'compression packing cubes 6 piece travel organizer luggage',
      'water resistant canvas travel duffle gym bag weekender',
      'packable lightweight foldable travel backpack daypack'
    ],
    'Travel Comfort & Accessories': [
      'memory foam travel neck pillow airplane sleeping ergonomic',
      'pure mulberry silk 3d contoured sleep eye mask travel',
      'all in one international universal travel power adapter plug',
      'compact windproof travel umbrella teflon automatic open'
    ],
    'Outdoor & Camping': [
      'ultralight 2 person backpacking tent rainfly waterproof',
      'compact lightweight down sleeping bag camping hiking',
      'portable camping stove burner compact outdoor cooking',
      'rechargeable led camping lantern collapsible tent light'
    ],
    'Fitness & Active Living': [
      'eco friendly natural rubber non slip yoga mat workout',
      'resistance exercise loop bands set fitness home gym',
      'high density foam roller muscle recovery exercise',
      'adjustable speed jump rope ball bearings cardio fitness'
    ],
    'Everyday Carry & Gadgets': [
      'compact carbon fiber tactical key organizer compact',
      'titanium pocket edc ballpoint pen bolt action metal',
      'waterproof aluminum pill case canister container keychain',
      'compact edc mini led pocket flashlight rechargeable'
    ]
  },
  'Gifts & Stationery': {
    'Notebooks & Journals': [
      'hardcover dot grid bullet journal notebook 160gsm',
      'vintage leather bound refillable journal notebook diary',
      'classic linen fabric ruled hardcover notebook bookmark',
      'artist sketchbook heavy mixed media paper hardcover'
    ],
    'Fine Pens & Writing': [
      'brass heavyweight executive fountain pen gold nib',
      'matte black metal rollerball pen fine point gift box',
      'precision fineliner drawing pens set archival ink',
      'dual tip calligraphy watercolor brush pens lettering'
    ],
    'Desk Organizers & Stationery': [
      'solid walnut wooden desk organizer tray pen holder',
      'matte black metal wire mesh desktop file document sorter',
      'brass modern desktop tape dispenser heavy duty stationery',
      'leather desk pad mouse pad extended blotter protector'
    ],
    'Art & Creative Supplies': [
      'artist watercolor paint set half pans metal palette tin',
      'artist colored pencils tin box drawing sketching 48',
      'graphite sketching drawing pencils set artist sketch',
      'heavyweight cold press 100 percent cotton watercolor paper'
    ],
    'Gift Sets & Boxes': [
      'luxury leather journal and pen gift set keepsake box',
      'artisan loose leaf tea gift set infuser sampler tin',
      'aromatherapy scented candle and matches gift set box',
      'gourmet coffee beans and french press gift set box'
    ],
    'Cards & Wraps': [
      'botanical letterpress assorted greeting cards envelopes pack',
      'kraft wrapping paper rolls recycled ribbon gift packaging',
      'wax seal stamp kit sealing wax beads melting spoon',
      'embossed handmade gift tags jute twine set present'
    ]
  }
};

// Search DuckDuckGo for images
async function searchDDG(query) {
  try {
    const res1 = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res1.text();
    const vqdMatch = html.match(/vqd=([0-9-]+)/) || html.match(/vqd="([0-9-]+)"/);
    if (!vqdMatch) return [];
    const vqd = vqdMatch[1];

    const res2 = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query) + '&vqd=' + vqd + '&f=,,,&p=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/'
      }
    });
    if (!res2.ok) return [];
    const data = await res2.json();
    return (data.results || []).map(r => r.image).filter(url => {
      if (!url || typeof url !== 'string') return false;
      if (!url.startsWith('https://')) return false;
      // Filter out low quality / ad / trackers
      if (url.includes('facebook') || url.includes('gstatic') || url.includes('thumbnail') || url.includes('avatar') || url.includes('logo')) return false;
      return true;
    });
  } catch (err) {
    console.error('Failed to search:', query, err.message);
    return [];
  }
}

// Check if image URL responds with 200 within 2.5s
async function validateImageUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'http://localhost:5173/'
      }
    });
    clearTimeout(timeout);
    return res.status === 200;
  } catch {
    return false;
  }
}

// Concurrently validate a list of URLs
async function filterValidUrls(urls, concurrency = 15) {
  const valid = [];
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const checks = await Promise.all(batch.map(validateImageUrl));
    for (let j = 0; j < batch.length; j++) {
      if (checks[j]) valid.push(batch[j]);
    }
  }
  return valid;
}

export async function main() {
  console.log('--- Starting Image Catalog Build ---');
  const cachePath = path.join(__dirname, 'imageCache.json');
  let cache = {};

  if (fs.existsSync(cachePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      console.log('Loaded existing cache with', Object.keys(cache).length, 'subcategories.');
    } catch {
      cache = {};
    }
  }

  // Iterate over each category and subcategory
  for (const [category, subcats] of Object.entries(SEARCH_QUERIES)) {
    console.log(`\nProcessing Category: ${category}`);
    if (!cache[category]) cache[category] = {};

    for (const [subcategory, queries] of Object.entries(subcats)) {
      if (cache[category][subcategory] && cache[category][subcategory].length >= 50) {
        console.log(`  [CACHED] ${subcategory}: ${cache[category][subcategory].length} verified images`);
        continue;
      }

      console.log(`  [FETCHING] ${subcategory} (${queries.length} queries)...`);
      const allFound = [];

      for (const q of queries) {
        const results = await searchDDG(q);
        allFound.push(...results);
        await new Promise(r => setTimeout(r, 300));
      }

      const uniqueCandidates = Array.from(new Set(allFound));
      console.log(`    Found ${uniqueCandidates.length} raw candidates. Validating...`);
      const verified = await filterValidUrls(uniqueCandidates, 20);
      console.log(`    -> ${verified.length} verified HTTP 200 images for ${subcategory}`);

      cache[category][subcategory] = verified;
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
    }
  }

  console.log('\n--- Image Cache Complete! Now Assigning to Products ---');

  const fileMap = {
    'Home & Living': 'homeLiving.ts',
    'Kitchen & Dining': 'kitchenDining.ts',
    'Electronics & Tech Accessories': 'electronicsTech.ts',
    'Fashion & Accessories': 'fashionAccessories.ts',
    'Personal Care & Beauty': 'personalCareBeauty.ts',
    'Travel & Lifestyle': 'travelLifestyle.ts',
    'Gifts & Stationery': 'giftsStationery.ts'
  };

  const globalUsedPrimary = new Set();
  const globalUsedAll = new Set();
  let totalAssigned = 0;

  for (const [catName, fileName] of Object.entries(fileMap)) {
    const filePath = path.join(dataDir, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const jsonStr = content.substring(content.indexOf('= [') + 2, content.lastIndexOf(';'));
    const products = JSON.parse(jsonStr);

    console.log(`\nAssigning images for ${catName} (${products.length} products)...`);
    const varName = fileName.replace('.ts', 'Products');

    for (const product of products) {
      const subcat = product.subcategory;
      const pool = cache[catName]?.[subcat] || [];

      // Find an unused primary image from the pool
      let primaryImg = null;
      for (const imgUrl of pool) {
        if (!globalUsedPrimary.has(imgUrl) && !globalUsedAll.has(imgUrl)) {
          primaryImg = imgUrl;
          break;
        }
      }

      // If pool exhausted (rare), check other pools in same category
      if (!primaryImg) {
        for (const otherSubcat of Object.keys(cache[catName] || {})) {
          for (const imgUrl of cache[catName][otherSubcat] || []) {
            if (!globalUsedPrimary.has(imgUrl) && !globalUsedAll.has(imgUrl)) {
              primaryImg = imgUrl;
              break;
            }
          }
          if (primaryImg) break;
        }
      }

      if (!primaryImg) {
        console.error(`FATAL: No unique image found for product ${product.id} (${product.name})`);
        process.exit(1);
      }

      globalUsedPrimary.add(primaryImg);
      globalUsedAll.add(primaryImg);

      // Find secondary image
      let secondaryImg = null;
      for (const imgUrl of pool) {
        if (imgUrl !== primaryImg && !globalUsedAll.has(imgUrl)) {
          secondaryImg = imgUrl;
          break;
        }
      }

      if (!secondaryImg) {
        // Fallback secondary: any unused image from category pool
        for (const otherSubcat of Object.keys(cache[catName] || {})) {
          for (const imgUrl of cache[catName][otherSubcat] || []) {
            if (imgUrl !== primaryImg && !globalUsedAll.has(imgUrl)) {
              secondaryImg = imgUrl;
              break;
            }
          }
          if (secondaryImg) break;
        }
      }

      if (!secondaryImg) {
        secondaryImg = primaryImg; // Fallback to primary if exhausted for gallery
      } else {
        globalUsedAll.add(secondaryImg);
      }

      product.images = [primaryImg, secondaryImg];
      totalAssigned++;
    }

    // Write updated products back to file
    const newContent = `import { Product } from '../../types/product';\n\nexport const ${varName}: Product[] = ${JSON.stringify(products, null, 2)};\n`;
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Saved ${products.length} products to ${fileName}`);
  }

  console.log('\n=======================================');
  console.log(`Successfully assigned unique images to ${totalAssigned} products!`);
  console.log(`Unique Primary Images: ${globalUsedPrimary.size}`);
  console.log(`Duplicate Primary Images: ${totalAssigned - globalUsedPrimary.size}`);
  console.log('=======================================');
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
