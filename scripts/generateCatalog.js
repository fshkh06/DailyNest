import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Home & Living',
    slug: 'home-living',
    prefix: 'hl',
    brands: ['NestLiving', 'Nordic Haven', 'Loom & Timber', 'AuraSpace', 'Kanso Studio', 'HavenCraft', 'TerraHome', 'Solace & Co', 'Vanguard Living', 'Elysian Home'],
    subcategories: [
      {
        name: 'Chairs & Seating',
        items: [
          'Ergonomic Velvet Accent Chair', 'Scandinavian Oak Lounge Chair', 'Adjustable Lumbar Mesh Office Chair',
          'Mid-Century Modern Dining Chair', 'Tufted Bouclé Reading Armchair', 'Minimalist Birch Stacking Chair',
          'High-Back Executive Leather Chair', 'Foldable Rattan Balcony Chair', 'Velvet Gold-Legged Vanity Stool',
          'Reclining Swivel Lounge Chair', 'Boho Woven Cane Rocking Chair', 'Modern Geometric Counter Stool'
        ],
        images: [
          'https://images.unsplash.com/photo-1580481077190-7361356a15fa?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['furniture', 'chair', 'seating', 'ergonomic', 'living-room']
      },
      {
        name: 'Tables & Desks',
        items: [
          'Solid Oak Fluted Coffee Table', 'Dual-Motor Electric Standing Desk', 'Round Carrara Marble Side Table',
          'Extendable Scandinavian Dining Table', 'Tempered Glass Minimalist Desk', 'Nesting Brass Accent Tables',
          'Rustic Reclaimed Wood Console Table', 'Wall-Mounted Floating Laptop Desk', 'Compact Bedside Nightstand Table',
          'Geometric Terrazzo Cocktail Table', 'Modular Birch Workstation Table', 'Live Edge Walnut End Table'
        ],
        images: [
          'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['table', 'desk', 'workspace', 'home-office', 'dining']
      },
      {
        name: 'Sofas & Beds',
        items: [
          'Deep-Seated Linen 3-Seater Sofa', 'Convertible Velvet Futon Sofa Bed', 'Low-Profile Japanese Platform Bed Frame',
          'Upholstered Bouclé Queen Bed Frame', 'L-Shaped Modular Cloud Sectional', 'Solid Walnut Slatted Headboard Bed',
          'Compact Studio Loveseat Sofa', 'Storage Hydraulic King Ottoman Bed', 'Leather Cognac Mid-Century Couch',
          'Bohemian Floor Cushion Daybed'
        ],
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['sofa', 'bed', 'living-room', 'bedroom', 'comfort']
      },
      {
        name: 'Lighting & Lamps',
        items: [
          'Brushed Brass Arc Floor Lamp', 'Ceramic Textured Table Lamp', 'Smart RGB Ambient Light Bar',
          'Pleated Paper Pendant Ceiling Light', 'Dimmable Cordless Touch Bedside Lamp', 'Modern Matte Black Swing Arm Sconce',
          'Sculptural Mushroom Glass Desk Lamp', 'Industrial Edison Bulb Chandelier', 'Minimalist LED Halo Wall Light',
          'Japanese Rice Paper Lantern Floor Lamp'
        ],
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['lamp', 'lighting', 'decor', 'ambient', 'home']
      },
      {
        name: 'Bedding & Linens',
        items: [
          'Washed French Linen Duvet Cover Set', 'Cooling Bamboo Charcoal Pillow Pair', '1000 Thread Count Egyptian Cotton Sheets',
          'Chunky Hand-Knit Wool Throw Blanket', 'Weighted Hypoallergenic Anxiety Blanket', 'Silk Mulberry Anti-Frizz Pillowcase',
          'All-Season Microfiber Comforter Quilt', 'Waffle Weave Organic Cotton Coverlet', 'Quilted Ergonomic Mattress Topper',
          'Linen Blend Thermal Blackout Curtains'
        ],
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['bedding', 'linens', 'pillow', 'blanket', 'bedroom']
      },
      {
        name: 'Rugs & Carpets',
        items: [
          'Hand-Knotted Moroccan Wool Area Rug', 'Low-Pile Vintage Distressed Runner', 'Natural Hand-Woven Jute Braided Rug',
          'Plush Geometric Shag Living Room Rug', 'Washable Pet-Friendly Kitchen Mat', 'Circular Bohemian Fringe Accent Rug',
          'Abstract Earth-Tone Hallway Runner', 'High-Density Memory Foam Bath Mat'
        ],
        images: [
          'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['rug', 'carpet', 'decor', 'floor', 'moroccan']
      },
      {
        name: 'Storage & Organization',
        items: [
          'Bamboo 4-Tier Stackable Shoe Rack', 'Modular Acrylic Wardrobe Organizer Bins', 'Woven Seagrass Storage Basket Set',
          'Floating Solid Pine Wall Display Shelf', 'Under-Bed Rolling Fabric Storage Bags', 'Heavy-Duty Industrial Metal Garment Rack',
          'Divided Bamboo Drawer Organizer Trays', 'Aesthetic Rope Toy & Laundry Hamper', 'Over-The-Door Pantry Hanging Rack',
          'Wall Pegboard Modular Craft Board'
        ],
        images: [
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['storage', 'organizer', 'closet', 'shelf', 'cleaning']
      },
      {
        name: 'Home Decor & Accents',
        items: [
          'Arch Irregular Full-Length Floor Mirror', 'Hand-Crafted Ceramic Donut Vase', 'Minimalist Silent Quartz Wall Clock',
          'Set of 3 Abstract Canvas Wall Art Prints', 'Brass Geometric Photo Frame', 'Marble Decorative Pedestal Display Bowl',
          'Sculptural Wood Knot Shelf Object', 'Wabi-Sabi Terracotta Decorative Urn', 'Sunburst Rattan Boho Wall Accent',
          'Modern Stainless Steel Taper Candle Holders'
        ],
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['decor', 'mirror', 'vase', 'clock', 'aesthetic']
      },
      {
        name: 'Candles & Home Fragrance',
        items: [
          'Soy Wax Amber Glass Scented Candle - Santal', 'Ultrasonic Ceramic Mist Oil Diffuser', 'Botanical Reed Diffuser - White Tea & Fig',
          'Palo Santo & Sage Ceramic Smudge Pot', 'Natural Beeswax Ribbed Pillar Candles', 'Linen & Room Spray - Fresh Lavender',
          'Electric Wax Melt Warmer with Ambient Glow', 'Match Striker Ceramic Cloche Set'
        ],
        images: [
          'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572726729437-3732efedfa0e?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['candle', 'fragrance', 'aromatherapy', 'diffuser', 'wellness']
      },
      {
        name: 'Plants & Planters',
        items: [
          'Self-Watering Ceramic Herb Planter', 'Mid-Century Ceramic Pot with Walnut Stand', 'Hanging Macrame Cotton Plant Hanger',
          'Fluted Matte Concrete Indoor Planter', 'Glass Water Propagation Station Trio', 'Indoor Fiddle Leaf Fig Ceramic Set',
          'Vintage Brass Watering Can with Long Spout', 'Tiered Corner Metal Plant Stand'
        ],
        images: [
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['plants', 'planter', 'indoor-garden', 'nature', 'pot']
      },
      {
        name: 'Bathroom & Cleaning',
        items: [
          'Automated Motion Sensor Touchless Dustbin', 'Ultra-Absorbent Stone Diatomite Bath Mat', 'Matte Black Stainless Steel Soap Dispenser Set',
          'Bamboo Ergonomic Bath Caddy Tray', 'Waffle Quick-Dry Turkish Cotton Bath Towel Set', 'Silicone Toilet Brush with Quick-Dry Base',
          'Extendable Microfiber Ceiling Fan Duster', 'Wall-Mounted Adhesive Towel Hooks Pack'
        ],
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['bathroom', 'towel', 'cleaning', 'accessories', 'bath']
      }
    ]
  },
  {
    id: 'cat-2',
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    prefix: 'kd',
    brands: ['AeroChef', 'CulinaryCraft', 'TerraCook', 'Maison Gourmet', 'CastIron Co', 'BrewNest', 'PureSip', 'ArtisanForge', 'Simmer & Savor', 'Zestware'],
    subcategories: [
      {
        name: 'Cookware & Pans',
        items: [
          'Enameled Cast Iron Dutch Oven 5.5Qt', 'Multi-Clad Stainless Steel Tri-Ply Skillet', 'Non-Stick Ceramic Granite Frying Pan 10-inch',
          'Hard-Anodized Sauté Pan with Glass Lid', 'Pre-Seasoned Heavy Duty Cast Iron Skillet', 'Heavy Gauge Aluminum Stockpot with Strainer',
          'Tri-Ply Stainless Steel Saucepan 3Qt', 'Induction-Ready Carbon Steel Wok 12-inch', 'Copper Core Professional Chef Pan',
          'Non-Stick Square Griddle Grill Pan'
        ],
        images: [
          'https://images.unsplash.com/photo-1584990347449-3990472e3895?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['cookware', 'pan', 'pot', 'kitchen', 'cooking']
      },
      {
        name: 'Knives & Cutlery',
        items: [
          'Japanese VG-10 Damascus 8-inch Chef Knife', 'German High-Carbon Steel Santoku Knife', 'Serrated Bread Slicing Knife with Olivewood Handle',
          'Full-Tang Precision Paring Knife 3.5-inch', 'Magnetic Walnut Wooden Knife Block Holder', 'Handcrafted 6-Piece Steak Knife Set',
          'Heavy Duty Japanese Kitchen Shears', 'Whetsone 1000/6000 Grit Knife Sharpening Kit', 'Forged Cleaver Knife for Meat & Vegetables',
          'End-Grain Organic Acacia Cutting Board'
        ],
        images: [
          'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['knife', 'cutlery', 'cutting-board', 'chef', 'sharpening']
      },
      {
        name: 'Small Appliances',
        items: [
          'Digital Touchscreen Vortex Air Fryer 6Qt', 'Precision Gooseneck Electric Temperature Kettle', '1200W High-Speed Countertop Blender',
          'Stainless Steel 4-Slice Artisan Toaster', 'Multi-Function Programmable Pressure Cooker', 'Cast Aluminum Belgian Waffle Maker',
          'Compact Precision Kitchen Digital Scale', 'Automatic 2-in-1 Panini Press Grill', 'Immersion Hand Blender 5-in-1 Set',
          'Slow Masticating Cold Press Juicer'
        ],
        images: [
          'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['appliances', 'air-fryer', 'kettle', 'blender', 'toaster']
      },
      {
        name: 'Coffee & Tea Essentials',
        items: [
          'Pour-Over Glass Carafe with Stainless Filter', 'Conical Burr Electric Coffee Grinder', 'Classic French Press Insulated Brewer',
          'Manual Stainless Hand Coffee Grinder', 'Cold Brew Iced Coffee Maker Pitcher 1L', 'Ceramic Matcha Whisk and Bowl Ceremonial Set',
          'Double-Walled Glass Espresso Cup Duo', 'Cast Iron Japanese Tetsubin Teapot', 'Barista Milk Frother and Steamer Pitcher',
          'Silicone Coffee Tamper Mat with Portafilter Stand'
        ],
        images: [
          'https://images.unsplash.com/photo-1517668808822-9eaa02f2a8e4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['coffee', 'tea', 'espresso', 'brewing', 'barista']
      },
      {
        name: 'Dinnerware & Tableware',
        items: [
          'Hand-Molded Stoneware Dinner Plates 4-Pack', 'Organic Matte Ceramic Pasta Bowls Set', 'Hammered Matte Gold Flatware 20-Piece Set',
          'Ribbed Crystal Highball Glasses Set of 6', 'Hand-Blown Wine Glasses Stemmed Set', 'Ceramic Soup Tureen with Matching Ladle',
          'Bamboo Fiber Salad Bowl with Wooden Servers', 'Modern Black Stainless Flatware Service', 'Handmade Speckled Espresso Mug Set',
          'Linen Hemstitch Cloth Dinner Napkins 4-Pack'
        ],
        images: [
          'https://images.unsplash.com/photo-1614735241165-6756e1df61ab?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['dinnerware', 'plates', 'glasses', 'tableware', 'dining']
      },
      {
        name: 'Drinkware & Hydration',
        items: [
          'Vacuum Insulated Stainless Steel Tumbler 30oz', 'Borosilicate Glass Water Bottle with Silicone Sleeve', 'Double-Wall Insulated Travel Mug with Handle',
          'Copper Moscow Mule Hammered Mugs Pair', 'Whiskey Tasting Glasses Heavy Base Set of 4', 'Stackable Stoneware Coffee Mugs Set of 4',
          'Infuser Sports Hydration Flask 32oz', 'Cocktail Shaker Bartender Mixology Set'
        ],
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['drinkware', 'mug', 'tumbler', 'water-bottle', 'hydration']
      },
      {
        name: 'Food Storage & Organization',
        items: [
          'Airtight Glass Food Storage Containers 10-Pack', 'BPA-Free Acrylic Dry Food Cereal Dispensers', 'Leak-Proof Stainless Steel Bento Lunch Box',
          'Tiered Revolving Lazy Susan Spice Rack Organizer', 'Ceramic Oil & Vinegar Cruet Dispenser Bottle', 'Expandable Bamboo Kitchen Drawer Organizer',
          'Silicone Reusable Food Saver Storage Bags', 'Bread Box with Bamboo Cutting Board Lid', 'Magnetic Kitchen Paper Towel Roll Holder',
          'Over-Sink Stainless Steel Dish Drying Rack'
        ],
        images: [
          'https://images.unsplash.com/photo-1584990347449-3990472e3895?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['storage', 'container', 'bento', 'spice-rack', 'organization']
      },
      {
        name: 'Bake & Prep Tools',
        items: [
          'Heavy-Gauge Non-Stick Muffin Tin Pan', 'Silicone Baking Mat Set Non-Slip Reusable', 'Stainless Steel Measuring Cups & Spoons Set',
          'French Tapered Beechwood Rolling Pin', 'Nesting Stainless Mixing Bowls with Lids', 'Heat-Resistant Silicone Spatula Utensil Set',
          'Springform Cheesecake Pan 9-inch', 'Stainless Rotary Flour Sifter with Crank', 'Digital Instant Read Food & Meat Thermometer',
          'Heavy Duty Linen Canvas Chef Apron with Pockets'
        ],
        images: [
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['baking', 'prep', 'measuring', 'apron', 'utensils']
      }
    ]
  },
  {
    id: 'cat-3',
    name: 'Electronics & Tech Accessories',
    slug: 'electronics-tech',
    prefix: 'et',
    brands: ['PulseAudio', 'Zenith Tech', 'HyperCharge', 'AeroNode', 'VortexGear', 'NomadTech', 'LuminaSmart', 'KronoSound', 'EchoWave', 'CoreSync'],
    subcategories: [
      {
        name: 'Headphones & Audio',
        items: [
          'Active Noise Cancelling Wireless Over-Ear Headphones', 'True Wireless Hi-Fi Earbuds with ANC Case', 'Studio Monitor Reference Wired Headphones',
          'Bone Conduction Open-Ear Sport Earphones', 'Rugged Waterproof IPX7 Bluetooth Speaker', 'Desktop Wooden Hi-Fi Stereo Bookshelf Speakers',
          'RGB Gaming Headset with Detachable Mic', 'Retro Fabric Bluetooth Tabletop Speaker', 'Magnetic Wireless Neckband Sport Earphones',
          'USB-C DAC Portable Headphone Amplifier'
        ],
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['audio', 'headphones', 'earbuds', 'speaker', 'wireless']
      },
      {
        name: 'Power & Charging',
        items: [
          '65W GaN Fast Charger Ultra-Compact 3-Port', '20000mAh Power Bank with 100W PD Output', '3-in-1 Foldable Magnetic Wireless Charging Station',
          'Braided Kevlar USB-C to USB-C 240W Cable', 'Desktop Multi-Outlet Surge Protector with USB Hub', 'Magnetic Wireless Power Bank 10000mAh',
          'Car Fast Charger Dual USB-C 45W Adapter', 'Heavy Duty Solar Power Bank with Flashlight', 'Smart Wireless Charging Mouse Pad Qi',
          'Cable Management Cord Organizer Box'
        ],
        images: [
          'https://images.unsplash.com/photo-1622445262464-84b14e3245b3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['charger', 'powerbank', 'wireless-charging', 'cables', 'fast-charge']
      },
      {
        name: 'Computer & Desk Gear',
        items: [
          'Ergonomic Mechanical Keyboard Hot-Swappable', 'Silent Wireless Bluetooth Precision Mouse', 'Curved Monitor LED Screen Light Bar Lamp',
          'Aluminum Adjustable Laptop Riser Stand', 'Dual 4K USB-C Multiport Docking Station Hub', 'Felt Wool Extra Large Desk Mat Blotter',
          'Ergonomic Memory Foam Wrist Rest Set', 'Vertical Ergonomic Mouse Optical 4000 DPI', 'Ultra-Slim Portable 15.6-inch IPS Monitor',
          'Magnetic Privacy Screen Filter for Laptop'
        ],
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['keyboard', 'mouse', 'desk-setup', 'laptop-stand', 'workspace']
      },
      {
        name: 'Wearables & Smart Tech',
        items: [
          'AMOLED GPS Smartwatch with Heart Rate Sensor', 'Slim Fitness Tracker Band with Sleep Monitor', 'Bluetooth Smart Glasses with Open-Ear Audio',
          'Titanium Smart Health Ring Bio-Tracker', 'Smart Luggage Tracker GPS Bluetooth Tag 4-Pack', 'Digital Voice Recorder Pen with AI Noise Reduction',
          'Smart Bike Helmet with LED Signals & Audio', 'Smart Thermos Bottle with Temperature Display'
        ],
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['smartwatch', 'fitness-tracker', 'wearables', 'health', 'gadgets']
      },
      {
        name: 'Camera & Streaming',
        items: [
          '4K Ultra HD Streaming Webcam with Auto-Focus', 'USB Condenser Podcast Microphone with Arm Stand', 'Bi-Color LED Ring Light with Tripod Stand',
          '3-Axis Handheld Smartphone Gimbal Stabilizer', 'Wireless Lavalier Lapel Microphone Dual Channel', 'Desktop Camera Mount Flex Arm Clamp',
          'Green Screen Collapsible Studio Backdrop', 'SD Card High-Speed UHS-II 128GB V60'
        ],
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['webcam', 'microphone', 'streaming', 'camera', 'creator']
      },
      {
        name: 'Smart Home Devices',
        items: [
          'Wi-Fi Smart Plug Energy Monitoring 4-Pack', 'Color Changing RGB Smart Bulb Set of 4', 'Indoor 1080p Security Camera with Night Vision',
          'Smart Wireless Video Doorbell with Chime', 'Smart Air Quality Monitor & Humidity Sensor', 'Smart Fingerprint Door Lock Keyless Entry',
          'Motion Sensor LED Stair Light Strips', 'Ultrasonic Smart Essential Oil Humidifier'
        ],
        images: [
          'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['smarthome', 'smartbulb', 'iot', 'security', 'home-tech']
      },
      {
        name: 'Phone & Tablet Accessories',
        items: [
          'MagSafe Leather Wallet with Built-in Stand', 'Shockproof Matte Frosted Phone Case', 'Tempered Glass Screen Protector 9H 2-Pack',
          'Foldable Aluminum Desktop Tablet Stand Holder', 'Universal Car Phone Mount Vent Clip', 'Retractable Ring Grip Phone Holder Kickstand',
          'Anti-Fingerprint Hydrogel Tablet Screen Film', 'Stylus Touch Pen for iPad & Tablets'
        ],
        images: [
          'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['phone-case', 'magsafe', 'screen-protector', 'tablet', 'stand']
      },
      {
        name: 'Storage & Accessories',
        items: [
          'Rugged Portable External SSD 1TB USB 3.2', '7-in-1 Aluminum USB-C Hub with HDMI & SD', 'Waterproof Electronics Organizer Travel Case',
          'High-Speed MicroSDXC Card 256GB A2', 'Rechargeable Portable Handheld Turbo Desk Fan', 'Anti-Static Keyboard Cleaning Brush & Gel Kit',
          'Compact Wireless Presenter Pointer Clicker', 'Bluetooth Anti-Lost Key Finder Tag'
        ],
        images: [
          'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['ssd', 'storage', 'usb-hub', 'gadgets', 'tech-essentials']
      }
    ]
  },
  {
    id: 'cat-4',
    name: 'Fashion & Accessories',
    slug: 'fashion-accessories',
    prefix: 'fa',
    brands: ['UrbanVibe', 'AuraWear', 'Verona Craft', 'Kanso Apparel', 'Solstice Leather', 'Stride & Co', 'Vanguard Studio', 'Atlas Atelier', 'Maison Forme', 'TerraThread'],
    subcategories: [
      {
        name: 'Footwear & Shoes',
        items: [
          'Breathable Knit Lightweight Running Shoes', 'Retro Leather Low-Top Street Sneakers', 'Classic Chelsea Suede Ankle Boots',
          'Handcrafted Full-Grain Leather Derby Shoes', 'Ergonomic Cork Footbed Buckle Sandals', 'Waterproof Trail Hiking Trekking Boots',
          'Slip-On Memory Foam Casual Loafers', 'Cloud Foam Platform Slides Slippers', 'Minimalist White Court Tennis Sneakers',
          'Goodyear Welted Wingtip Oxford Shoes'
        ],
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['footwear', 'sneakers', 'boots', 'shoes', 'running']
      },
      {
        name: 'Bags & Backpacks',
        items: [
          'Water-Resistant Commuter Laptop Backpack 20L', 'Full-Grain Vegetable Tanned Leather Messenger Bag', 'Structured Vegan Leather Crossbody Saddle Bag',
          'Heavyweight Organic Canvas Everyday Tote Bag', 'Minimalist Anti-Theft Travel Daypack', 'Slouchy Soft Leather Shoulder Hobo Bag',
          'Convertible Duffel Backpack Gym Bag', 'Compact Nylon Belt Sling Bag', 'Vintage Waxed Canvas Weekender Duffle',
          'Designer Quilted Chain Shoulder Bag'
        ],
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['backpack', 'bag', 'tote', 'crossbody', 'leather-bag']
      },
      {
        name: 'Wallets & Leather Accessories',
        items: [
          'Slim RFID Blocking Bifold Leather Wallet', 'Minimalist Aluminum Card Holder with Cash Strap', 'Full-Grain Leather Zipper Continental Wallet',
          'Handmade Leather Key Organizer Keychain', 'Classic Full Grain Leather Dress Belt', 'Braided Casual Stretch Canvas Belt',
          'Leather Passport Holder Travel Cover', 'Coin Pouch Minimalist Snap Wallet'
        ],
        images: [
          'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['wallet', 'belt', 'leather', 'rfid', 'accessories']
      },
      {
        name: 'Watches & Jewelry',
        items: [
          'Minimalist Sapphire Glass Automatic Watch', 'Chronograph Stainless Steel Mesh Watch', 'Vintage Square Dial Leather Dress Watch',
          'Sterling Silver Box Chain Minimalist Necklace', '18K Gold Plated Chunky Dome Ring', 'Brushed Titanium Cuff Bangle Bracelet',
          'Freshwater Pearl Huggie Hoop Earrings', 'Sleek Ceramic Bezel Quartz Watch'
        ],
        images: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['watch', 'jewelry', 'necklace', 'earrings', 'bracelet']
      },
      {
        name: 'Eyewear & Sunglasses',
        items: [
          'Polarized Acetate Classic Wayfarer Sunglasses', 'Vintage Round Metal Frame Sunglasses UV400', 'Square Aviator Polarized Sun Glasses',
          'Cat-Eye Designer Sunglasses Tortoise Shell', 'Blue Light Blocking Computer Reading Glasses', 'Ultra-Light Titanium Rimless Glasses',
          'Sport Wrap-Around Cycling Polarized Shades', 'Foldable Compact Pocket Sunglasses'
        ],
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['sunglasses', 'eyewear', 'glasses', 'shades', 'uv400']
      },
      {
        name: 'Casual & Outerwear',
        items: [
          'Heavyweight Heavy Cotton Oversized Crewneck Tee', 'Premium Supima Cotton Crewneck T-Shirt 3-Pack', 'French Terry Heavy Relaxed Fit Pullover Hoodie',
          'Waterproof Windbreaker Packable Trail Jacket', 'Classic Sherpa-Lined Denim Trucker Jacket', 'Merino Wool Ribbed Knit Cardigan Sweater',
          'Relaxed Fit Selvedge Denim Straight Jeans', 'Stretch Chino Slim Fit Casual Trousers', 'Linen Blend Relaxed Resort Collar Shirt',
          'Lightweight Down Packable Puffer Jacket'
        ],
        images: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['clothing', 'jacket', 'hoodie', 't-shirt', 'apparel']
      },
      {
        name: 'Hats, Scarves & Small Accessories',
        items: [
          'Ribbed Cashmere Blend Winter Beanie', 'Unstructured Washed Cotton Baseball Cap', 'Wide-Brim Sun Straw Fedora Hat',
          'Soft Merino Wool Plaid Winter Scarf', 'Combed Cotton Crew Socks Cushioned 5-Pack', 'Silk Mulberry Floral Hair Scrunchie Set',
          'Thermal Touchscreen Winter Knit Gloves', 'Handwoven Linen Neck Scarf Bandana'
        ],
        images: [
          'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['cap', 'hat', 'scarf', 'socks', 'beanie']
      }
    ]
  },
  {
    id: 'cat-5',
    name: 'Personal Care & Beauty',
    slug: 'personal-care-beauty',
    prefix: 'pc',
    brands: ['Botanica Lab', 'AuraGlow', 'LuxeDerma', 'PureEssence', 'VelvetSkin', 'Serene Rituals', 'Nectar & Herb', 'GroomCraft', 'Oasis Botanicals', 'Solis Care'],
    subcategories: [
      {
        name: 'Skincare Essentials',
        items: [
          'Hydrating Hyaluronic Acid Serum 50ml', 'Gentle Botanical Green Tea Foaming Cleanser', 'Barrier Repair Ceramide Moisturizing Cream',
          'Vitamin C Radiance Brightening Booster Serum', 'Invisible Zinc Mineral Sunscreen SPF 50+', 'Niacinamide Pore Refining Clarifying Toner',
          'Overnight Peptide Replenishing Sleeping Mask', 'Gentle Salicylic Acid BHA Exfoliating Liquid', 'Centella Asiatica Calming Relief Gel',
          'Bakuchiol Natural Botanical Retinol Alternative'
        ],
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1608248597359-0a672e88a03?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['skincare', 'serum', 'moisturizer', 'cleanser', 'sunscreen']
      },
      {
        name: 'Haircare & Styling',
        items: [
          'Sulfate-Free Argan Oil Nourishing Shampoo', 'Deep Conditioning Macadamia Hair Mask', 'Cold-Pressed Rosemary Scalp Treatment Oil',
          'Ionic Professional Ceramic Hair Dryer', 'Cordless Ceramic Hair Straightener Styler', 'Natural Boar Bristle Detangling Hair Brush',
          'Volumizing Biotin & Rice Water Conditioner', 'Heat Protectant Keratin Leave-In Mist', 'Sea Salt Spray for Beachy Hair Texture',
          'Scalp Massager Exfoliating Silicone Brush'
        ],
        images: [
          'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['haircare', 'shampoo', 'hair-oil', 'hair-dryer', 'conditioner']
      },
      {
        name: 'Body & Bath Rituals',
        items: [
          'Exfoliating Himalayan Pink Salt Body Scrub', 'Moisturizing Shea Butter Body Cream 250g', 'Gentle Eucalyptus Aromatherapy Body Wash',
          'Natural Cold-Processed Artisan Soap Bar Trio', 'Nourishing Cuticle & Hand Cream with Almond Oil', 'Therapeutic Magnesium Bath Flakes 1kg',
          'Dry Body Brush with Natural Sisal Bristles', 'Botanical Shower Steamers Aromatherapy 6-Pack'
        ],
        images: [
          'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['bodycare', 'body-wash', 'scrub', 'lotion', 'bath']
      },
      {
        name: 'Men\'s Grooming',
        items: [
          'Waterproof Cordless Beard Trimmer Kit', 'Double Edge Safety Razor with 10 Blades', 'Sandalwood Nourishing Beard Oil 30ml',
          'Pre-Shave Soothing Cedarwood Face Balm', 'Natural Badger Hair Wet Shaving Brush', 'Matte Finish Texture Hair Clay Pomade',
          'Electric Rotary Foil Shaver with Trimmer', 'Charcoal Clarifying Facial Cleanser for Men'
        ],
        images: [
          'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1503925804368-6d54366606d2?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['grooming', 'shaver', 'trimmer', 'beard-oil', 'mens']
      },
      {
        name: 'Beauty Tools & Organizers',
        items: [
          'Rose Quartz Facial Roller and Gua Sha Set', 'Rechargeable LED Lighted Vanity Makeup Mirror', 'Silicone Sonic Vibrating Face Cleansing Brush',
          'Tiered Clear Acrylic Makeup & Cosmetic Organizer', 'Ergonomic Japanese Stainless Eyelash Curler', 'Waterproof Travel Cosmetic Bag with Dividers',
          'Microcurrent Facial Toning Contour Device', 'Professional 12-Piece Makeup Brush Set with Case'
        ],
        images: [
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['beauty-tools', 'gua-sha', 'vanity-mirror', 'makeup-bag', 'brushes']
      },
      {
        name: 'Lip & Eye Care',
        items: [
          'Nourishing Berry Tinted Lip Sleeping Mask', 'Caffeine Anti-Puffiness Eye Contour Serum', 'Organic Beeswax Peppermint Lip Balm Trio',
          'Hydrogel Gold Snail Firming Under-Eye Patches', 'Soothing Chamomile Micellar Eye Makeup Remover', 'Sugar Scrub Gentle Lip Exfoliator Pot'
        ],
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['lip-care', 'eye-cream', 'lip-balm', 'eye-patches', 'skincare']
      },
      {
        name: 'Nail Care & Wellness',
        items: [
          'Professional Stainless Steel Manicure Pedicure Set', 'Glass Crystal Gentle Nail File Set', 'Nourishing Jojoba Cuticle Conditioning Oil Pen',
          'Fast-Drying Strengthener Base & Top Coat Set', 'Electric Nail Buffer and Polisher Device', 'Organic Lavender Cuticle Butter Tin'
        ],
        images: [
          'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['nail-care', 'manicure', 'cuticle-oil', 'wellness', 'pedicure']
      }
    ]
  },
  {
    id: 'cat-6',
    name: 'Travel & Lifestyle',
    slug: 'travel-lifestyle',
    prefix: 'tl',
    brands: ['NomadGear', 'VoyagerCraft', 'ApexTrek', 'Horizon & Co', 'TerraRoam', 'AeroTravel', 'SummitTrail', 'Kanso Journey', 'RoamLife', 'AtlasVoyage'],
    subcategories: [
      {
        name: 'Luggage & Suitcases',
        items: [
          'Polycarbonate Hardshell Spinner Cabin Suitcase 20-inch', 'Expandable Checked Medium Luggage 24-inch with TSA Lock',
          'Aluminum Frame Durable Carry-On Luggage', 'Ultra-Lightweight 28-inch Large Family Spinner Trunk',
          'Rolling Duffel Travel Bag with Heavy Duty Wheels', 'Underseat Compact Rolling Flight Bag with USB Port',
          'Vintage Leather Trimmed Trunk Suitcase', 'Modular Carry-On with Front Laptop Pocket'
        ],
        images: [
          'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['luggage', 'suitcase', 'carry-on', 'spinner', 'travel']
      },
      {
        name: 'Travel Bags & Organizers',
        items: [
          'Waterproof Hanging Toiletry Bag with Swivel Hook', 'Compression Packing Cubes Ultralight 6-Piece Set', 'Water-Resistant Travel Duffel Weekender 45L',
          'RFID Blocking Family Passport Holder & Wallet', 'Foldable Ultra-Lightweight Packable Backpack', 'Shoe Travel Bags with Mesh Window 4-Pack',
          'Cord & Charger Electronics Travel Organizer Case', 'Clear TSA Approved Liquids Travel Bottle Set'
        ],
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['packing-cubes', 'toiletry-bag', 'passport-holder', 'travel-bag', 'duffel']
      },
      {
        name: 'Travel Comfort & Accessories',
        items: [
          'Ergonomic Memory Foam Travel Neck Pillow', 'Pure Silk Sleep Eye Mask with Contoured Eye Cups', 'Universal All-in-One Worldwide Travel Power Adapter',
          'Compact Soft Microfleece Travel Blanket with Pouch', 'Digital Luggage Weight Scale with Backlit LCD', 'TSA Approved Heavy Duty Cable Luggage Locks 2-Pack',
          'Silicone Collapsible Reusable Water Travel Cup', 'Inflatable Compact Airplane Foot Rest Pillow'
        ],
        images: [
          'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['neck-pillow', 'eye-mask', 'travel-adapter', 'luggage-lock', 'comfort']
      },
      {
        name: 'Outdoor & Camping',
        items: [
          'Ultralight 2-Person Backpacking Tent with Rainfly', 'Compact Down Sleeping Bag Rated 20°F', 'Titanium Ultralight Camping Cookware Mess Kit',
          'High-Lumen Rechargeable LED Headlamp with Sensor', 'Portable Camping Hammock with Tree Straps', 'Collapsible Insulated Picnic Cooler Tote 30-Can',
          'Stainless Steel Pocket Multi-Tool Pliers 14-in-1', 'Portable Mini Gas Camping Stove Burner'
        ],
        images: [
          'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['camping', 'outdoor', 'tent', 'headlamp', 'hiking']
      },
      {
        name: 'Fitness & Active Living',
        items: [
          'Non-Slip Eco-Friendly Natural Rubber Yoga Mat', 'Adjustable Quick-Jump Speed Rope with Bearings', 'High-Density Foam Roller for Muscle Recovery',
          'Resistance Loop Bands Workout Set of 5', 'Deep Tissue Percussion Muscle Massage Gun', 'Insulated Stainless Steel Shaker Bottle with Whisk Ball',
          'Microfiber Fast-Drying Workout Gym Towels Pair', 'Waterproof Running Waist Pack Belt Phone Holder'
        ],
        images: [
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['fitness', 'yoga', 'workout', 'massage-gun', 'active']
      },
      {
        name: 'Everyday Carry & Gadgets',
        items: [
          'Carbon Fiber Tactical Key Organizer', 'Titanium Precision Pocket EDC Ballpoint Pen', 'Waterproof Aluminum Pill Case Keyring Container',
          'Weatherproof Field Notes Notebook Pocket Pack', 'Heavy Duty Windproof Outdoor Jet Flame Lighter', 'Mini Titanium Pocket Pry Bar Multi-Tool'
        ],
        images: [
          'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['edc', 'everyday-carry', 'pocket-knife', 'tactical', 'tools']
      }
    ]
  },
  {
    id: 'cat-7',
    name: 'Gifts & Stationery',
    slug: 'gifts-stationery',
    prefix: 'gs',
    brands: ['ArtisanCraft', 'Kanso Paper', 'Paper & Quill', 'NobleCraft', 'Loom & Letter', 'Zenith Studio', 'AuraGifts', 'Botanica Press', 'Atelier Scribe', 'Heritage Ink'],
    subcategories: [
      {
        name: 'Notebooks & Journals',
        items: [
          'Full-Grain Leather Bound Refillable Travel Journal', 'Hardcover Dot Grid Bullet Journal 160gsm Paper', 'Classic Ruled Linen Notebook with Bookmark',
          'Daily Mindfulness Guided Reflection Gratitude Journal', 'Spiral Bound Top-Opening Artist Sketchbook A4', 'Handmade Deckle Edge Vintage Cotton Paper Journal',
          'Waterproof Stone Paper Tactical Notebook', 'Undated Weekly Productivity Goal Planner'
        ],
        images: [
          'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['notebook', 'journal', 'planner', 'stationery', 'paper']
      },
      {
        name: 'Fine Pens & Writing',
        items: [
          'Brass Heavyweight Refillable Rollerball Pen', 'Classic Gold-Nib Fountain Pen with Ink Converter', 'Precision Fineliner Drawing Pens Set of 8',
          'Smooth Gel Ink Retractable Pens 0.5mm 10-Pack', 'Dual-Tip Pastel Aesthetic Highlighters 6-Pack', 'Handcrafted Olivewood Fountain Pen Gift Box',
          'Calligraphy Dip Pen Set with 5 Steel Nibs', 'Mechanical Drafting Pencil 0.5mm All-Metal'
        ],
        images: [
          'https://images.unsplash.com/photo-1585336261026-778848b8c2df?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['pen', 'fountain-pen', 'highlighter', 'writing', 'calligraphy']
      },
      {
        name: 'Desk Organizers & Stationery',
        items: [
          'Solid Walnut Wooden Desk Organizer Tray', 'Matte Metal Wire Mesh File Document Sorter', 'Brass Modern Heavy Duty Desktop Tape Dispenser',
          'Concrete Minimalist Pen Holder & Card Stand', 'Acrylic Rotating Desktop Stationery Organizer Caddy', 'Leather Desk Blotter Pad with Pen Rest',
          'Gold Geometric Paper Clips in Glass Bottle', 'Vintage Wooden Date Perpetual Desk Calendar'
        ],
        images: [
          'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['desk-organizer', 'pen-holder', 'stationery', 'office', 'desk']
      },
      {
        name: 'Art & Creative Supplies',
        items: [
          'Professional Watercolor Paint Palette 36 Colors', 'Cold-Press 100% Cotton Watercolor Paper Block', 'Soft Core Colored Pencils Artist Tin of 48',
          'Fine Detail Artist Paintbrush Set of 10', 'Polymer Clay Sculpting Starter Kit with Tools', 'Alcohol Based Dual Tip Art Markers Set of 24',
          'Graphite Drawing Sketching Pencils Set in Metal Box', 'Calligraphy Ink Bottle 50ml Deep Carbon Black'
        ],
        images: [
          'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['art-supplies', 'watercolor', 'markers', 'sketching', 'drawing']
      },
      {
        name: 'Gift Sets & Boxes',
        items: [
          'Curated Executive Leather Journal & Pen Gift Box', 'Artisan Loose Leaf Tea & Infuser Keepsake Set', 'Luxury Aromatherapy Candle & Matches Gift Set',
          'Gourmet Coffee Tasting Bean Set with Ceramic Dripper', 'Handcrafted Wooden Keepsake Memory Box', 'Botanical Self-Care Bath & Body Gift Hamper',
          'Wax Seal Stamp Kit with Melting Spoon and Wax Beads', 'Modern Metallic Photo Frame Set with Matting'
        ],
        images: [
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['gift-set', 'gift-box', 'presents', 'luxury-gift', 'celebration']
      },
      {
        name: 'Cards & Wraps',
        items: [
          'Letterpress Botanical Greeting Cards Assorted 8-Pack', 'Handmade Recycled Cotton Wrapping Paper Sheets', 'Kraft Paper Gift Tags with Jute Twine 50-Pack',
          'Silk Velvet Ribbon Spool Set for Gift Wrapping', 'Foil Stamped Birthday & Celebration Cards Box', 'Customizable Calligraphy Place Cards Set of 24'
        ],
        images: [
          'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
        ],
        tags: ['cards', 'wrapping-paper', 'gift-wrap', 'greeting-card', 'tags']
      }
    ]
  }
];

// Variation modifiers to create 215 genuine, realistic, unique products per category
const MODIFIERS = [
  { prefix: 'Signature', suffix: 'Edition', priceMult: 1.15, descAdj: 'meticulously crafted for everyday longevity' },
  { prefix: 'Artisan', suffix: 'Collection', priceMult: 1.1, descAdj: 'individually finished by master craftspeople' },
  { prefix: 'Pro Series', suffix: 'Plus', priceMult: 1.25, descAdj: 'engineered with enhanced durability and premium materials' },
  { prefix: 'Minimalist', suffix: 'Studio', priceMult: 0.95, descAdj: 'designed with clean aesthetics and functional simplicity' },
  { prefix: 'Heritage', suffix: 'Series', priceMult: 1.2, descAdj: 'inspired by timeless design and crafted from sustainable components' },
  { prefix: 'Compact', suffix: 'Lite', priceMult: 0.85, descAdj: 'streamlined for space efficiency without sacrificing performance' },
  { prefix: 'Nordic', suffix: 'Design', priceMult: 1.05, descAdj: 'blending Scandinavian warmth with everyday utility' },
  { prefix: 'Classic', suffix: 'Original', priceMult: 1.0, descAdj: 'a trusted daily staple built to withstand continuous use' },
  { prefix: 'Ultra', suffix: 'Deluxe', priceMult: 1.3, descAdj: 'delivering an elevated sensory and ergonomic experience' },
  { prefix: 'Eco-Craft', suffix: 'Natural', priceMult: 0.98, descAdj: 'responsibly sourced with organic, recyclable materials' },
  { prefix: 'Modern', suffix: 'Core', priceMult: 1.02, descAdj: 'contemporary silhouette tailored for modern living spaces' },
  { prefix: 'Elite', suffix: 'Master', priceMult: 1.35, descAdj: 'top-tier craftsmanship meeting rigorous performance standards' },
  { prefix: 'Essential', suffix: 'Daily', priceMult: 0.9, descAdj: 'straightforward, reliable everyday performance you can count on' },
  { prefix: 'Refined', suffix: 'Reserve', priceMult: 1.18, descAdj: 'distinguished by subtle texture and premium tactile finishes' },
  { prefix: 'Terra', suffix: 'Pure', priceMult: 1.08, descAdj: 'grounded in organic textures, earth tones, and ergonomic harmony' },
];

function generateSlug(name) {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

const TARGET_PER_CATEGORY = 215; // 215 * 7 = 1,505 products!

const dataDir = path.join(__dirname, '..', 'src', 'data', 'products');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const fileExports = [];

for (const cat of CATEGORIES) {
  const products = [];
  let count = 0;
  let modIndex = 0;
  
  // Flatten items with their subcategory context
  const flatItems = [];
  for (const sub of cat.subcategories) {
    for (const item of sub.items) {
      flatItems.push({
        baseName: item,
        subcategory: sub.name,
        images: sub.images,
        tags: sub.tags,
      });
    }
  }

  const usedNames = new Set();

  while (products.length < TARGET_PER_CATEGORY) {
    for (let i = 0; i < flatItems.length && products.length < TARGET_PER_CATEGORY; i++) {
      const item = flatItems[i];
      const mod = MODIFIERS[modIndex % MODIFIERS.length];
      modIndex++;

      let productName = '';
      if (products.length < flatItems.length) {
        productName = item.baseName;
      } else {
        const cycle = Math.floor(products.length / flatItems.length);
        if (cycle === 1) {
          productName = `${mod.prefix} ${item.baseName}`;
        } else if (cycle === 2) {
          productName = `${item.baseName} - ${mod.suffix}`;
        } else {
          productName = `${mod.prefix} ${item.baseName} (${mod.suffix})`;
        }
      }

      if (usedNames.has(productName)) {
        productName = `${productName} v${products.length + 1}`;
      }
      usedNames.add(productName);

      count++;
      const id = `${cat.prefix}-${String(count).padStart(3, '0')}`;
      const slug = `${generateSlug(productName)}-${id}`;
      const brand = cat.brands[count % cat.brands.length];

      // Realistic prices
      const basePrice = (24 + (count * 7) % 180 + (modIndex * 13) % 120) * (mod.priceMult || 1);
      const price = Math.round(basePrice) - 0.01;
      const discountPercent = [10, 15, 20, 25, 30, 35, 40][count % 7];
      const originalPrice = roundToTwo(price / (1 - discountPercent / 100));

      const rating = roundToTwo(4.1 + ((count * 17) % 9) * 0.1);
      const reviewCount = 20 + ((count * 37) % 650);

      // Contextual images
      const img1 = item.images[count % item.images.length];
      const img2 = item.images[(count + 1) % item.images.length];
      const images = [img1, img2];

      const description = `Experience effortless quality with the ${productName}. Designed by ${brand}, this piece is ${mod.descAdj}. Built to integrate seamlessly into your lifestyle, offering unmatched convenience, aesthetic elegance, and lasting value.`;

      const features = [
        `Premium quality build from ${brand}`,
        `Engineered for daily resilience and effortless maintenance`,
        `Modern, minimalist aesthetic that complements any contemporary setting`,
        `Hypoallergenic, non-toxic, and sustainably tested materials`,
        `Includes standard manufacturer warranty and customer support`
      ];

      const specifications = {
        'Brand': brand,
        'Category': cat.name,
        'Subcategory': item.subcategory,
        'Material': ['Solid Natural Wood', 'Brushed Aluminum', 'Eco Cotton', 'High-Grade Composite', 'Stainless Steel', 'Ceramic Matte'][count % 6],
        'Dimensions': `${10 + (count % 40)} x ${8 + (count % 30)} x ${5 + (count % 20)} cm`,
        'Weight': `${(0.4 + ((count % 50) * 0.1)).toFixed(1)} kg`,
        'Warranty': count % 2 === 0 ? '2-Year Limited Manufacturer Warranty' : '1-Year Full Warranty',
        'Origin': count % 3 === 0 ? 'Designed in Denmark' : (count % 3 === 1 ? 'Designed in Japan' : 'Designed in California'),
        'Care Instructions': 'Wipe clean with a soft dry cloth. Keep away from harsh chemicals.'
      };

      const tags = Array.from(new Set([...item.tags, cat.slug, brand.toLowerCase().replace(/\s+/g, '-')]));

      const isDeal = count % 5 === 0;
      const isTrending = count % 6 === 0;
      const isBestSeller = count % 7 === 0;
      const isFeatured = count % 8 === 0;

      const stockStatus = count % 15 === 0 ? 'low_stock' : 'in_stock';
      const stockCount = stockStatus === 'low_stock' ? getRandomInt(3, 7) : getRandomInt(25, 180);

      products.push({
        id,
        name: productName,
        slug,
        category: cat.name,
        subcategory: item.subcategory,
        brand,
        price,
        originalPrice,
        discount: discountPercent,
        rating,
        reviewCount,
        images,
        description,
        features,
        specifications,
        tags,
        stock: stockStatus,
        stockCount,
        deliveryInfo: count % 3 === 0 ? 'Free 2-Day Delivery' : 'Standard Delivery (3-4 Days)',
        isTrending,
        isBestSeller,
        isDeal,
        isFeatured,
        createdAt: '2026-03-15T00:00:00.000Z'
      });
    }
  }

  const varName = cat.slug.replace(/-([a-z])/g, g => g[1].toUpperCase()) + 'Products';
  const fileName = cat.slug.replace(/-([a-z])/g, g => g[1].toUpperCase()) + '.ts';
  const filePath = path.join(dataDir, fileName);

  const fileContent = `import { Product } from '../../types/product';

export const ${varName}: Product[] = ${JSON.stringify(products, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`Generated ${products.length} products for ${cat.name} -> ${fileName}`);

  fileExports.push({
    varName,
    fileName: fileName.replace('.ts', ''),
    catSlug: cat.slug,
    catName: cat.name
  });
}

// Generate index.ts
const imports = fileExports.map(e => `import { ${e.varName} } from './${e.fileName}';`).join('\n');
const arrayItems = fileExports.map(e => `  ...${e.varName},`).join('\n');

const indexContent = `import { Product } from '../../types/product';
${imports}

export const ALL_PRODUCTS: Product[] = [
${arrayItems}
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
         p.category.toLowerCase().replace(/ & /g, '-').replace(/\\s+/g, '-') === categoryName.toLowerCase()
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
`;

fs.writeFileSync(path.join(dataDir, 'index.ts'), indexContent, 'utf-8');
console.log('Catalog index generated with total products:', fileExports.length * TARGET_PER_CATEGORY);
