import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const poolFilePath = path.join(__dirname, 'verifiedProductImagePool.json');

const CATEGORY_QUERIES = {
  'Home & Living': {
    'Chairs & Seating': [
      'ergonomic office chair high back product',
      'modern velvet accent chair armchair furniture product',
      'scandinavian dining chair wood product',
      'leather lounge chair recliner furniture product'
    ],
    'Tables & Desks': [
      'modern wooden coffee table living room product',
      'electric standing desk home office computer product',
      'dining table wood modern scandinavian product',
      'bedside table nightstand bedroom furniture product'
    ],
    'Sofas & Beds': [
      '3 seater sofa couch living room linen product',
      'modern platform bed frame wooden bedroom product',
      'sectional sofa couch living room product'
    ],
    'Lighting & Lamps': [
      'modern arc floor lamp living room product',
      'ceramic bedside table lamp ambient light product',
      'pendant ceiling light fixture modern product',
      'minimalist led desk lamp reading light product'
    ],
    'Bedding & Linens': [
      'linen duvet cover set luxury bedding product',
      'chunky knit throw blanket cozy bedroom product',
      'egyptian cotton bed sheets set pillowcases product'
    ],
    'Rugs & Carpets': [
      'moroccan wool area rug modern living room product',
      'woven jute runner rug hallway floor product',
      'geometric modern living room area rug carpet product'
    ],
    'Storage & Organization': [
      'woven storage basket handles organization product',
      'bamboo shoe rack organizer entryway product',
      'floating wooden wall shelves storage product'
    ],
    'Home Decor & Accents': [
      'ceramic donut vase minimalist home decor product',
      'arched wall mirror decorative brass product',
      'modern wall clock minimalist quartz product'
    ],
    'Candles & Home Fragrance': [
      'amber glass soy wax scented candle product',
      'ceramic ultrasonic essential oil diffuser product',
      'reed diffuser bottle room fragrance product'
    ],
    'Plants & Planters': [
      'ceramic indoor plant pot with saucer product',
      'terracotta plant pot planter modern product',
      'self watering indoor planter pot product'
    ],
    'Bathroom & Cleaning': [
      'matte black bathroom soap dispenser set product',
      'diatomite stone bath mat quick dry product',
      'organic cotton bath towel set luxury product'
    ]
  },
  'Kitchen & Dining': {
    'Cookware & Pans': [
      'nonstick frying pan skillet cookware product',
      'enameled cast iron dutch oven pot with lid product',
      'stainless steel saucepan chef cookware product',
      'carbon steel wok wood handle cookware product'
    ],
    'Knives & Cutlery': [
      'japanese damascus chef knife 8 inch kitchen product',
      'santoku knife stainless steel kitchen cutlery product',
      'wooden knife block set cutlery kitchen knives product',
      'serrated bread slicing knife kitchen cutlery product'
    ],
    'Small Appliances': [
      'digital air fryer countertop kitchen appliance product',
      'espresso machine coffee maker milk frother product',
      'high speed countertop blender kitchen appliance product',
      'electric gooseneck kettle temperature control product'
    ],
    'Coffee & Tea Essentials': [
      'pour over glass coffee maker carafe dripper product',
      'stainless steel french press coffee maker product',
      'conical burr electric coffee grinder product',
      'cold brew coffee maker glass pitcher product'
    ],
    'Dinnerware & Tableware': [
      'ceramic stoneware dinner plates set product',
      'matte ceramic pasta bowls dinnerware set product',
      'stainless steel flatware silverware cutlery set product'
    ],
    'Drinkware & Hydration': [
      'insulated stainless steel water bottle product',
      'ceramic coffee mug with handle drinkware product',
      'double wall glass coffee cups set product',
      'stainless steel insulated travel tumbler with straw product'
    ],
    'Food Storage & Organization': [
      'airtight glass meal prep food storage containers product',
      'glass spice jars bamboo lids pantry organizer product',
      'stainless steel bento lunch box leakproof product'
    ],
    'Bake & Prep Tools': [
      'nonstick muffin pan cupcake baking tin product',
      'silicone baking mat reusable pastry sheet product',
      'stainless steel mixing bowls with lids set product',
      'stainless steel measuring cups and spoons set product'
    ]
  },
  'Electronics & Tech Accessories': {
    'Headphones & Audio': [
      'over ear wireless noise cancelling headphones product',
      'true wireless earbuds charging case in ear product',
      'portable waterproof bluetooth speaker audio product',
      'headphone amplifier dac audio product',
      'studio monitor reference speakers audio product'
    ],
    'Power & Charging': [
      '65w gan fast wall charger usb c power adapter product',
      'portable power bank 20000mah fast charging battery product',
      '3 in 1 wireless charging station stand product',
      'braided usb c fast charging cable product'
    ],
    'Computer & Desk Gear': [
      'mechanical gaming keyboard custom rgb product',
      'ergonomic wireless bluetooth mouse silent product',
      'aluminum laptop stand desk riser ergonomic product',
      'screen monitor light bar desk lamp eye care product'
    ],
    'Wearables & Smart Tech': [
      'smart watch amoled fitness tracker heart rate product',
      'fitness tracker smart band wristband product',
      'smart audio glasses open ear polarized product'
    ],
    'Camera & Streaming': [
      '4k streaming webcam autofocus privacy cover product',
      'usb podcast microphone condenser with boom arm product',
      'led ring light with tripod stand photography product',
      'camera backpack padded compartments photography product'
    ],
    'Smart Home Devices': [
      'wifi smart plug outlet energy monitoring product',
      'smart rgb led light bulb color changing product',
      'indoor wifi security camera 1080p night vision product',
      'video doorbell wireless smart camera chime product'
    ],
    'Phone & Tablet Accessories': [
      'magsafe phone case protective cover clear matte product',
      'magnetic phone car mount vent dashboard product',
      'aluminum adjustable tablet stand holder desk product',
      'magsafe magnetic wallet stand card holder product'
    ],
    'Storage & Accessories': [
      'portable external ssd 1tb usb c high speed product',
      '7 in 1 usb c hub adapter hdmi sd card reader product',
      'electronics travel organizer cable bag case product',
      'micro sd card memory card with adapter product'
    ]
  },
  'Fashion & Accessories': {
    'Footwear & Shoes': [
      'white minimalist leather sneakers low top casual product',
      'mens athletic running shoes sneakers sports product',
      'leather chelsea boots ankle boots classic product',
      'leather penny loafers dress shoes slip on product'
    ],
    'Bags & Backpacks': [
      'water resistant commuter laptop backpack modern product',
      'full grain leather messenger bag shoulder briefcase product',
      'canvas tote bag heavy duty shoulder bag product',
      'travel duffel gym bag weekender overnight product'
    ],
    'Wallets & Leather Accessories': [
      'slim bifold leather wallet rfid blocking mens product',
      'minimalist leather card holder wallet pocket product',
      'full grain leather dress belt brass buckle product'
    ],
    'Watches & Jewelry': [
      'minimalist automatic watch stainless steel sapphire product',
      'chronograph watch leather strap classic timepiece product',
      'sterling silver cuff bracelet minimalist jewelry product',
      'sterling silver signet ring minimalist jewelry product'
    ],
    'Eyewear & Sunglasses': [
      'polarized wayfarer sunglasses acetate frame product',
      'vintage round metal sunglasses uv400 fashion product',
      'blue light blocking glasses computer eyeglasses product'
    ],
    'Casual & Outerwear': [
      'heavyweight cotton t shirt crewneck apparel product',
      'pullover fleece hoodie sweatshirt casual streetwear product',
      'classic denim jacket trucker jacket mens product',
      'lightweight packable puffer jacket coat product'
    ],
    'Hats, Scarves & Small Accessories': [
      'merino wool knit beanie winter hat ribbed product',
      'cotton baseball cap dad hat adjustable product',
      'wide brim straw fedora sun hat summer product',
      'wool winter scarf soft fringed solid product'
    ]
  },
  'Personal Care & Beauty': {
    'Skincare Essentials': [
      'hyaluronic acid face serum dropper bottle skincare product',
      'gentle foaming facial cleanser pump bottle skincare product',
      'ceramide facial moisturizer moisturizing cream jar product',
      'mineral face sunscreen spf 50 lotion tube product'
    ],
    'Haircare & Styling': [
      'argan oil shampoo pump bottle salon haircare product',
      'deep conditioning hair mask tub treatment product',
      'scalp treatment rosemary hair oil dropper bottle product',
      'ionic hair dryer salon fast drying styling product'
    ],
    'Body & Bath Rituals': [
      'himalayan pink salt body scrub jar exfoliating product',
      'shea butter body cream lotion jar moisturizing product',
      'aromatherapy body wash pump bottle eucalyptus product'
    ],
    "Men's Grooming": [
      'double edge safety razor metal chrome shaving product',
      'organic sandalwood beard oil dropper bottle grooming product',
      'cordless electric beard trimmer kit waterproof product'
    ],
    'Beauty Tools & Organizers': [
      'rose quartz face roller and gua sha sculpting tool product',
      'led lighted makeup vanity mirror touch screen product',
      'sonic silicone facial cleansing brush device product'
    ],
    'Lip & Eye Care': [
      'lip sleeping mask berry pot lip care product',
      'caffeine peptide eye cream tube anti puffiness product',
      'tinted lip balm stick trio moisturizing product'
    ],
    'Nail Care & Wellness': [
      'professional manicure set stainless steel case tools product',
      'glass nail file crystal manicure grooming product',
      'cuticle oil pen applicator nourishing nails product'
    ]
  },
  'Travel & Lifestyle': {
    'Luggage & Suitcases': [
      'hardshell spinner cabin suitcase carry on 20 inch product',
      'expandable checked rolling suitcase 24 inch luggage product',
      'aluminum frame carry on cabin suitcase spinner product'
    ],
    'Travel Bags & Organizers': [
      'hanging travel toiletry bag cosmetic wash organizer product',
      'compression packing cubes set luggage organizer product',
      'canvas travel duffle bag weekender luggage product'
    ],
    'Travel Comfort & Accessories': [
      'memory foam travel neck pillow airplane ergonomic product',
      'silk 3d sleep eye mask contoured travel comfort product',
      'universal all in one international travel power adapter product'
    ],
    'Outdoor & Camping': [
      'lightweight 2 person camping tent backpacking waterproof product',
      'compact down sleeping bag camping hiking outdoor product',
      'portable camping stove burner outdoor cooking product',
      'rechargeable led camping lantern collapsible product'
    ],
    'Fitness & Active Living': [
      'non slip natural rubber yoga mat workout fitness product',
      'resistance exercise bands set fitness workout home gym product',
      'high density foam roller muscle recovery fitness product',
      'adjustable speed jump rope ball bearings fitness product'
    ],
    'Everyday Carry & Gadgets': [
      'titanium compact edc pocket knife multitool product',
      'tactical compact led flashlight rechargeable pocket product',
      'carbon fiber key organizer compact pocket keychain product'
    ]
  },
  'Gifts & Stationery': {
    'Notebooks & Journals': [
      'hardcover dotted grid bullet journal notebook 160gsm product',
      'vintage leather bound refillable journal notebook diary product',
      'ruled linen notebook with bookmark hardcover journal product',
      'spiral artist sketchbook mixed media paper drawing product'
    ],
    'Fine Pens & Writing': [
      'brass executive fountain pen fine nib luxury product',
      'metal rollerball gel ink pen executive gift box product',
      'fineliner drawing pens set archival ink sketching product',
      'calligraphy brush pen set lettering drawing artist product'
    ],
    'Desk Organizers & Stationery': [
      'solid walnut wood desk organizer tray pen holder product',
      'matte black wire mesh file document desk sorter product',
      'heavy duty brass modern desktop tape dispenser product'
    ],
    'Art & Creative Supplies': [
      'watercolor paint set metal palette tin half pans product',
      'artist colored pencils tin box sketching drawing product',
      'artist graphite sketching drawing pencils tin set product'
    ],
    'Gift Sets & Boxes': [
      'luxury executive leather journal and pen gift set box product',
      'artisan loose leaf tea gift box infuser sampler product',
      'luxury scented candle and matches gift set box packaging product'
    ],
    'Cards & Wraps': [
      'botanical letterpress assorted greeting cards envelopes product',
      'kraft wrapping paper rolls twine gift packaging product',
      'wax seal stamp kit beads spoon envelope packaging product'
    ]
  }
};

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

async function searchDDGImages(query) {
  try {
    const res1 = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query), {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await res1.text();
    const m = html.match(/vqd=([0-9-]+)/);
    if (!m) return [];

    const res2 = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query) + '&vqd=' + m[1] + '&f=,,,&p=1', {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Referer': 'https://duckduckgo.com/'
      }
    });
    if (!res2.ok) return [];

    const d = await res2.json();
    return (d.results || [])
      .map(r => ({ title: r.title || '', image: r.image }))
      .filter(r => r.image && r.image.startsWith('https://') && !r.image.includes('lookaside') && !r.image.includes('fbcdn'));
  } catch (e) {
    console.error(`Search error for "${query}":`, e.message);
    return [];
  }
}

async function checkUrlAlive(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Referer': 'http://localhost:5173/'
      }
    });
    clearTimeout(timer);
    return res.status === 200;
  } catch {
    return false;
  }
}

async function validateUrlsBatch(items, concurrency = 15) {
  const verified = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const checks = await Promise.all(batch.map(it => checkUrlAlive(it.image)));
    for (let j = 0; j < batch.length; j++) {
      if (checks[j]) verified.push(batch[j]);
    }
  }
  return verified;
}

export async function main() {
  console.log('--- Starting Harvest of Real Product Images ---');
  let pool = {};
  if (fs.existsSync(poolFilePath)) {
    try {
      pool = JSON.parse(fs.readFileSync(poolFilePath, 'utf-8'));
      console.log('Loaded existing pool with categories:', Object.keys(pool));
    } catch {
      pool = {};
    }
  }

  for (const [category, subcats] of Object.entries(CATEGORY_QUERIES)) {
    console.log(`\n========================================`);
    console.log(`Category: ${category}`);
    console.log(`========================================`);
    if (!pool[category]) pool[category] = {};

    for (const [subcategory, queries] of Object.entries(subcats)) {
      if (pool[category][subcategory] && pool[category][subcategory].length >= 45) {
        console.log(`  [CACHED] ${subcategory}: ${pool[category][subcategory].length} verified images`);
        continue;
      }

      console.log(`  [HARVESTING] ${subcategory} (${queries.length} queries)...`);
      const rawResults = [];

      for (const query of queries) {
        console.log(`    -> Searching: "${query}"...`);
        const results = await searchDDGImages(query);
        console.log(`       Found ${results.length} raw images.`);
        rawResults.push(...results);
        await new Promise(r => setTimeout(r, 1200));
      }

      // Deduplicate by URL
      const uniqueMap = new Map();
      for (const it of rawResults) {
        if (!uniqueMap.has(it.image)) {
          uniqueMap.set(it.image, it);
        }
      }

      const uniqueList = Array.from(uniqueMap.values());
      console.log(`    Validating ${uniqueList.length} unique candidates...`);
      const verified = await validateUrlsBatch(uniqueList, 15);
      console.log(`    -> Verified ${verified.length} HTTP 200 images for ${subcategory}!`);

      pool[category][subcategory] = verified;
      fs.writeFileSync(poolFilePath, JSON.stringify(pool, null, 2), 'utf-8');
    }
  }

  console.log('\n========================================');
  console.log('Product Image Harvesting Complete!');
  console.log('Pool saved to:', poolFilePath);
  console.log('========================================');
}

main().catch(err => {
  console.error('Harvester failed:', err);
  process.exit(1);
});
