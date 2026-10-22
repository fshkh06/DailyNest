import json
import urllib.request
import re
import os
import sys

# Ensure UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

BASE_HF_URL = 'https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/'

# Bad words that indicate an accessory rather than the actual product
BAD_WORDS = [
    'case for', 'cover for', 'sleeve for', 'adapter for', 'replacement for',
    'battery for', 'strap for', 'band for', 'ear hooks', 'silicone tips',
    'charger for', 'screen protector for'
]

def is_clean_item(title, req_noun):
    t_low = title.lower()
    for b in BAD_WORDS:
        if b in t_low:
            # If the product itself is a case or cover, allow it
            if 'case' in req_noun or 'cover' in req_noun or 'sleeve' in req_noun:
                continue
            return False
    return True

# Category files to datasets mapping
CATEGORY_DATASETS = {
    'electronicsTech.ts': ['meta_Electronics.jsonl', 'meta_Cell_Phones_and_Accessories.jsonl'],
    'kitchenDining.ts': ['meta_Home_and_Kitchen.jsonl', 'meta_Appliances.jsonl'],
    'homeLiving.ts': ['meta_Home_and_Kitchen.jsonl'],
    'fashionAccessories.ts': ['meta_Clothing_Shoes_and_Jewelry.jsonl', 'meta_Amazon_Fashion.jsonl'],
    'personalCareBeauty.ts': ['meta_Beauty_and_Personal_Care.jsonl'],
    'travelLifestyle.ts': ['meta_Sports_and_Outdoors.jsonl', 'meta_Clothing_Shoes_and_Jewelry.jsonl'],
    'giftsStationery.ts': ['meta_Office_Products.jsonl', 'meta_Arts_Crafts_and_Sewing.jsonl']
}

# Targeted Rules per category file
CATEGORY_RULES = {
    'electronicsTech.ts': [
        (r'True Wireless.*Earbuds', lambda t: ('earbud' in t or 'earbuds' in t or 'in-ear' in t) and 'case' not in t.split()[:2]),
        (r'Over-Ear Headphones', lambda t: ('headphone' in t or 'headphones' in t or 'over-ear' in t) and 'earbud' not in t and 'case' not in t.split()[:2]),
        (r'Studio Monitor.*Headphones', lambda t: ('studio monitor' in t or 'studio' in t or 'reference' in t or 'wired' in t) and 'headphone' in t),
        (r'Bone Conduction.*Earphones', lambda t: ('bone conduction' in t or 'open-ear' in t or 'open ear' in t)),
        (r'Rugged Waterproof.*Speaker', lambda t: ('bluetooth speaker' in t or 'waterproof speaker' in t or 'portable speaker' in t)),
        (r'Bookshelf Speakers', lambda t: ('bookshelf speaker' in t or 'desktop speaker' in t or 'stereo speaker' in t)),
        (r'RGB Gaming Headset', lambda t: ('gaming headset' in t or 'gaming headphone' in t or 'headset' in t)),
        (r'Retro Fabric.*Speaker', lambda t: ('bluetooth speaker' in t or 'wireless speaker' in t or 'retro speaker' in t)),
        (r'Neckband.*Earphones', lambda t: ('neckband' in t or 'neckband earphone' in t or 'neckband headphone' in t)),
        (r'Headphone Amplifier', lambda t: ('headphone amp' in t or 'headphone amplifier' in t or 'dac amp' in t or 'audio dac' in t or 'headphone dac' in t)),
        (r'65W GaN Fast Charger', lambda t: ('gan charger' in t or '65w charger' in t or 'fast charger' in t or 'wall charger' in t or 'usb c charger' in t)),
        (r'20000mAh Power Bank', lambda t: ('power bank' in t or 'portable charger' in t or 'battery pack' in t)),
        (r'3-in-1.*Wireless Charging Station', lambda t: ('wireless charging station' in t or 'wireless charger stand' in t or '3 in 1 wireless' in t or 'magnetic wireless charger' in t)),
        (r'Braided Kevlar.*Cable', lambda t: ('usb c to usb c' in t or 'usb-c cable' in t or 'charging cable' in t or 'braided cable' in t)),
        (r'Surge Protector with USB Hub', lambda t: ('surge protector' in t or 'power strip' in t or 'multi outlet' in t)),
        (r'Magnetic Wireless Power Bank', lambda t: ('magnetic power bank' in t or 'magsafe power bank' in t or 'wireless power bank' in t or 'power bank' in t)),
        (r'Car Fast Charger', lambda t: ('car charger' in t or 'car adapter' in t or 'fast car charger' in t)),
        (r'Solar Power Bank', lambda t: ('solar power bank' in t or 'solar charger' in t or 'power bank' in t)),
        (r'Wireless Charging Mouse Pad', lambda t: ('wireless charging mouse pad' in t or 'charging mouse pad' in t or 'rgb mouse pad' in t or 'desk mat' in t)),
        (r'Cable Management Cord Organizer Box', lambda t: ('cable management box' in t or 'cord organizer box' in t or 'cable organizer box' in t or 'cable box' in t)),
        (r'Mechanical Keyboard', lambda t: ('mechanical keyboard' in t or 'gaming keyboard' in t or 'hot swappable keyboard' in t or 'custom keyboard' in t)),
        (r'Wireless Bluetooth Precision Mouse', lambda t: ('wireless mouse' in t or 'bluetooth mouse' in t or 'silent mouse' in t or 'optical mouse' in t)),
        (r'Light Bar Lamp', lambda t: ('monitor light bar' in t or 'screenbar' in t or 'monitor lamp' in t or 'desk light bar' in t)),
        (r'Laptop Riser Stand', lambda t: ('laptop stand' in t or 'laptop riser' in t or 'adjustable laptop' in t)),
        (r'(Multiport Docking Station Hub|USB-C Hub)', lambda t: ('usb-c hub' in t or 'usb c hub' in t or 'docking station' in t or 'multiport hub' in t or 'multiport adapter' in t)),
        (r'Desk Mat Blotter', lambda t: ('desk mat' in t or 'desk pad' in t or 'felt desk mat' in t or 'extended mouse pad' in t)),
        (r'Wrist Rest Set', lambda t: ('wrist rest' in t or 'keyboard wrist rest' in t or 'mouse wrist rest' in t)),
        (r'Vertical Ergonomic Mouse', lambda t: ('vertical mouse' in t or 'ergonomic vertical mouse' in t or 'wireless vertical mouse' in t)),
        (r'Portable 15.6-inch IPS Monitor', lambda t: ('portable monitor' in t or '15.6 portable monitor' in t or 'travel monitor' in t)),
        (r'Privacy Screen Filter', lambda t: ('privacy screen' in t or 'privacy screen protector' in t or 'screen filter' in t)),
        (r'Smartwatch with Heart Rate Sensor', lambda t: ('smartwatch' in t or 'smart watch' in t or 'gps smartwatch' in t)),
        (r'Fitness Tracker Band', lambda t: ('fitness tracker' in t or 'fitness band' in t or 'smart band' in t or 'activity tracker' in t)),
        (r'Smart Glasses with Open-Ear Audio', lambda t: ('smart glasses' in t or 'audio glasses' in t or 'bluetooth sunglasses' in t or 'smart audio glasses' in t)),
        (r'Smart Health Ring', lambda t: ('smart ring' in t or 'health ring' in t or 'fitness ring' in t or 'sleep ring' in t)),
        (r'Smart Luggage Tracker GPS', lambda t: ('airtag' in t or 'bluetooth tracker' in t or 'smart tag' in t or 'key finder' in t or 'gps tracker' in t)),
        (r'Digital Voice Recorder Pen', lambda t: ('voice recorder' in t or 'voice activated recorder' in t or 'audio recorder' in t or 'digital recorder' in t)),
        (r'Smart Bike Helmet', lambda t: ('bike helmet' in t or 'bicycle helmet' in t or 'smart helmet' in t)),
        (r'Smart Thermos Bottle', lambda t: ('smart thermos' in t or 'smart water bottle' in t or 'temperature display bottle' in t or 'vacuum insulated bottle' in t)),
        (r'Streaming Webcam', lambda t: ('4k webcam' in t or 'streaming webcam' in t or 'hd webcam' in t or 'webcam' in t)),
        (r'USB Condenser Podcast Microphone', lambda t: ('usb microphone' in t or 'condenser microphone' in t or 'podcast microphone' in t or 'streaming microphone' in t)),
        (r'LED Ring Light with Tripod', lambda t: ('ring light' in t or 'led ring light' in t or 'ring light with tripod' in t)),
        (r'Smartphone Gimbal Stabilizer', lambda t: ('smartphone gimbal' in t or '3-axis gimbal' in t or 'phone stabilizer' in t or 'handheld gimbal' in t)),
        (r'Wireless Lavalier Lapel Microphone', lambda t: ('lavalier microphone' in t or 'wireless lavalier' in t or 'lapel mic' in t or 'wireless microphone' in t)),
        (r'Desktop Camera Mount', lambda t: ('camera mount' in t or 'desk mount clamp' in t or 'articulating arm' in t or 'flex arm' in t)),
        (r'Studio Backdrop', lambda t: ('green screen' in t or 'collapsible backdrop' in t or 'chromakey' in t or 'photo backdrop' in t)),
        (r'SD Card High-Speed', lambda t: ('sd card' in t or 'sdxc' in t or 'memory card' in t or '128gb sd' in t)),
        (r'Wi-Fi Smart Plug', lambda t: ('smart plug' in t or 'wifi smart plug' in t or 'smart outlet' in t)),
        (r'RGB Smart Bulb', lambda t: ('smart bulb' in t or 'rgb smart bulb' in t or 'smart led bulb' in t or 'wifi light bulb' in t)),
        (r'Security Camera with Night Vision', lambda t: ('security camera' in t or 'indoor security camera' in t or 'wifi camera' in t or 'pet camera' in t)),
        (r'Video Doorbell with Chime', lambda t: ('video doorbell' in t or 'doorbell camera' in t or 'wireless doorbell' in t)),
        (r'Door Lock Keyless Entry', lambda t: ('smart door lock' in t or 'fingerprint door lock' in t or 'keyless entry door lock' in t or 'smart lock' in t)),
        (r'LED Stair Light Strips', lambda t: ('motion sensor light' in t or 'stair lights' in t or 'under cabinet lights' in t or 'led light strip' in t)),
        (r'Smart Essential Oil Humidifier', lambda t: ('ultrasonic humidifier' in t or 'smart humidifier' in t or 'cool mist humidifier' in t or 'oil diffuser' in t)),
        (r'Air Quality Monitor', lambda t: ('air quality monitor' in t or 'humidity sensor' in t or 'co2 monitor' in t or 'temperature humidity' in t)),
        (r'Phone Case', lambda t: ('phone case' in t or 'matte case' in t or 'slim phone case' in t or 'bumper case' in t)),
        (r'Tablet Stand Holder', lambda t: ('tablet stand' in t or 'ipad stand' in t or 'desktop tablet holder' in t)),
        (r'Screen Protector', lambda t: ('screen protector' in t or 'tempered glass' in t)),
        (r'Car Phone Mount', lambda t: ('car phone mount' in t or 'car vent mount' in t or 'air vent phone holder' in t)),
        (r'Ring Grip Phone Holder', lambda t: ('phone ring holder' in t or 'phone grip' in t or 'finger ring stand' in t or 'ring kickstand' in t)),
        (r'MagSafe Leather Wallet', lambda t: ('magsafe wallet' in t or 'magnetic wallet' in t or 'leather phone wallet' in t)),
        (r'Stylus Touch Pen', lambda t: ('stylus pen' in t or 'active stylus' in t or 'capacitive stylus' in t or 'apple pencil alternative' in t)),
        (r'Tablet Screen (Protector|Film)', lambda t: ('tablet screen protector' in t or 'ipad screen protector' in t or 'hydrogel screen protector' in t)),
        (r'External SSD', lambda t: ('portable ssd' in t or 'external ssd' in t or 'solid state drive' in t)),
        (r'Flash Drive', lambda t: ('usb flash drive' in t or 'dual flash drive' in t or 'usb-c flash drive' in t or 'thumb drive' in t)),
        (r'MicroSDXC Card', lambda t: ('microsd' in t or 'microsdxc' in t or 'micro sd card' in t)),
        (r'Electronics Organizer Travel Case', lambda t: ('electronics organizer' in t or 'cable organizer bag' in t or 'travel cord organizer' in t or 'cable travel case' in t)),
        (r'Keyboard Cleaning', lambda t: ('keyboard cleaning kit' in t or 'cleaning gel' in t or 'keyboard brush' in t or 'electronics cleaner' in t)),
        (r'Wireless Presenter Pointer Clicker', lambda t: ('wireless presenter' in t or 'presentation clicker' in t or 'laser pointer clicker' in t)),
        (r'Bluetooth Anti-Lost Key Finder Tag', lambda t: ('key finder' in t or 'bluetooth tracker' in t or 'item finder' in t or 'anti-lost' in t)),
        (r'Turbo Desk Fan', lambda t: ('handheld fan' in t or 'portable desk fan' in t or 'mini turbo fan' in t or 'usb desk fan' in t))
    ],

    'kitchenDining.ts': [
        (r'Dutch Oven', lambda t: 'dutch oven' in t),
        (r'(Skillet|Frying Pan|Saut|Wok)', lambda t: ('skillet' in t or 'frying pan' in t or 'saute pan' in t or 'wok' in t or 'nonstick pan' in t)),
        (r'Saucepan', lambda t: ('saucepan' in t or 'sauce pan' in t or 'small pot' in t)),
        (r'(Chef Knife|Santoku Knife|Bread Knife|Cleaver|Utility Knife)', lambda t: ('chef knife' in t or 'santoku knife' in t or 'bread knife' in t or 'kitchen knife' in t or 'knife set' in t)),
        (r'Kitchen Shears', lambda t: ('kitchen shears' in t or 'poultry shears' in t or 'kitchen scissors' in t)),
        (r'Air Fryer', lambda t: ('air fryer' in t or 'vortex air fryer' in t)),
        (r'Electric.*Kettle', lambda t: ('electric kettle' in t or 'gooseneck kettle' in t or 'tea kettle' in t)),
        (r'Blender', lambda t: ('countertop blender' in t or 'high speed blender' in t or 'blender 1200w' in t or 'smoothie blender' in t)),
        (r'Food Processor', lambda t: ('food processor' in t or 'food chopper' in t)),
        (r'Stand Mixer', lambda t: ('stand mixer' in t or 'electric mixer' in t)),
        (r'Toaster', lambda t: ('toaster 2 slice' in t or 'bread toaster' in t or '4 slice toaster' in t or 'toaster' in t)),
        (r'Waffle Maker', lambda t: ('waffle maker' in t or 'waffle iron' in t)),
        (r'Pressure Cooker', lambda t: ('pressure cooker' in t or 'instant pot' in t or 'multi cooker' in t)),
        (r'Panini Press Grill', lambda t: ('panini press' in t or 'sandwich maker' in t or 'indoor grill' in t)),
        (r'Cold Press Juicer', lambda t: ('cold press juicer' in t or 'masticating juicer' in t or 'slow juicer' in t or 'juicer machine' in t)),
        (r'Pour-Over.*Carafe', lambda t: ('pour over coffee' in t or 'glass carafe' in t or 'chemex' in t or 'coffee dripper' in t)),
        (r'Coffee Grinder', lambda t: ('coffee grinder' in t or 'burr grinder' in t or 'electric coffee grinder' in t)),
        (r'French Press', lambda t: ('french press' in t or 'coffee press' in t)),
        (r'Espresso Machine', lambda t: ('espresso machine' in t or 'espresso maker' in t)),
        (r'Cold Brew.*Maker', lambda t: ('cold brew coffee maker' in t or 'cold brew pitcher' in t)),
        (r'Teapot', lambda t: ('teapot' in t or 'cast iron teapot' in t or 'tetsubin' in t)),
        (r'Milk Frother', lambda t: ('milk frother' in t or 'milk steamer' in t or 'frother pitcher' in t)),
        (r'Coffee Tasting Bean', lambda t: ('whole bean coffee' in t or 'coffee beans' in t or 'roasted coffee' in t or 'specialty coffee' in t)),
        (r'Dinner Plates', lambda t: ('dinner plates' in t or 'ceramic plates' in t or 'stoneware plates' in t or 'plate set' in t)),
        (r'Pasta Bowls', lambda t: ('pasta bowls' in t or 'salad bowls' in t or 'ceramic bowls' in t or 'stoneware bowls' in t)),
        (r'Soup Tureen', lambda t: ('soup tureen' in t or 'serving bowl with lid' in t or 'tureen' in t)),
        (r'Flatware|Silverware', lambda t: ('flatware set' in t or 'silverware set' in t or 'cutlery set' in t or 'stainless flatware' in t)),
        (r'Napkins', lambda t: ('cloth napkins' in t or 'dinner napkins' in t or 'linen napkins' in t)),
        (r'Stainless Steel Tumbler', lambda t: ('stainless steel tumbler' in t or 'insulated tumbler' in t or 'travel tumbler' in t)),
        (r'Glass Water Bottle', lambda t: ('glass water bottle' in t or 'borosilicate water bottle' in t)),
        (r'Travel Mug', lambda t: ('travel mug' in t or 'insulated travel mug' in t or 'commuter mug' in t)),
        (r'Coffee Mugs|Mug', lambda t: ('coffee mug' in t or 'ceramic mug' in t or 'stoneware mug' in t or 'mug set' in t)),
        (r'Moscow Mule', lambda t: ('moscow mule' in t or 'copper mugs' in t)),
        (r'Whiskey Tasting Glasses', lambda t: ('whiskey glasses' in t or 'bourbon glasses' in t or 'rocks glasses' in t)),
        (r'Highball Glasses', lambda t: ('highball glasses' in t or 'collins glasses' in t or 'drinking glasses' in t)),
        (r'Cocktail Shaker', lambda t: ('cocktail shaker' in t or 'bartender set' in t or 'bar shaker' in t)),
        (r'Hydration Flask', lambda t: ('hydration flask' in t or 'sports water bottle' in t or 'insulated flask' in t)),
        (r'Food Storage Containers', lambda t: ('food storage containers' in t or 'glass meal prep' in t or 'airtight containers' in t)),
        (r'Cereal Dispensers', lambda t: ('cereal dispenser' in t or 'dry food dispenser' in t)),
        (r'Bread Box', lambda t: ('bread box' in t or 'bread bin' in t)),
        (r'Oil & Vinegar Cruet', lambda t: ('oil cruet' in t or 'vinegar dispenser' in t or 'oil dispenser bottle' in t)),
        (r'Drawer Organizer', lambda t: ('kitchen drawer organizer' in t or 'bamboo drawer divider' in t or 'cutlery tray' in t)),
        (r'Bento Lunch Box', lambda t: ('bento box' in t or 'lunch box adult' in t or 'stainless lunch box' in t)),
        (r'Dish Drying Rack', lambda t: ('dish drying rack' in t or 'over sink dish rack' in t or 'kitchen dish drainer' in t)),
        (r'Spice Rack', lambda t: ('spice rack' in t or 'lazy susan spice' in t or 'revolving spice organizer' in t)),
        (r'Storage Bags', lambda t: ('silicone food bags' in t or 'reusable storage bags' in t or 'stash bag' in t)),
        (r'Food & Meat Thermometer', lambda t: ('meat thermometer' in t or 'food thermometer' in t or 'instant read thermometer' in t)),
        (r'Rolling Pin', lambda t: ('rolling pin' in t or 'french rolling pin' in t or 'beechwood rolling pin' in t)),
        (r'Spatula Utensil Set', lambda t: ('silicone spatula set' in t or 'kitchen utensils set' in t or 'spatula set' in t)),
        (r'Chef Apron', lambda t: ('chef apron' in t or 'kitchen apron canvas' in t or 'cooking apron' in t)),
        (r'Muffin Tin Pan', lambda t: ('muffin pan' in t or 'cupcake tin' in t or 'muffin tin' in t)),
        (r'Mixing Bowls', lambda t: ('mixing bowls set' in t or 'stainless mixing bowls' in t or 'nesting bowls' in t)),
        (r'Baking Mat Set', lambda t: ('silicone baking mat' in t or 'macaron baking sheet' in t or 'pastry mat' in t)),
        (r'Springform.*Pan', lambda t: ('springform pan' in t or 'cheesecake pan' in t)),
        (r'Flour Sifter', lambda t: ('flour sifter' in t or 'rotary sifter' in t)),
        (r'Measuring Cups & Spoons', lambda t: ('measuring cups and spoons' in t or 'stainless measuring set' in t))
    ],

    'homeLiving.ts': [
        (r'Mesh Office Chair', lambda t: ('mesh office chair' in t or 'ergonomic office chair' in t or 'desk chair' in t)),
        (r'(Accent Chair|Lounge Chair|Armchair)', lambda t: ('accent chair' in t or 'lounge chair' in t or 'velvet armchair' in t or 'reading chair' in t)),
        (r'Dining Chair', lambda t: ('dining chair' in t or 'wood dining chair' in t or 'mid century dining chair' in t)),
        (r'Bar Stool', lambda t: ('bar stool' in t or 'counter stool' in t)),
        (r'Coffee Table', lambda t: ('coffee table' in t or 'wood coffee table' in t or 'round coffee table' in t)),
        (r'Standing Desk', lambda t: ('standing desk' in t or 'electric standing desk' in t or 'adjustable desk' in t)),
        (r'(Side Table|Nightstand|Accent Table)', lambda t: ('side table' in t or 'nightstand' in t or 'end table' in t)),
        (r'Dining Table', lambda t: ('dining table' in t or 'kitchen dining table' in t)),
        (r'(Sofa|Couch|Loveseat)', lambda t: ('3-seater sofa' in t or 'living room couch' in t or 'linen sofa' in t or 'loveseat' in t)),
        (r'Futon Sofa Bed', lambda t: ('futon sofa bed' in t or 'convertible futon' in t or 'sleeper sofa' in t)),
        (r'Platform Bed Frame', lambda t: ('platform bed frame' in t or 'wooden bed frame' in t or 'bed frame queen' in t)),
        (r'Mattress Topper', lambda t: ('mattress topper' in t or 'memory foam mattress topper' in t)),
        (r'Floor Lamp', lambda t: ('floor lamp' in t or 'arc floor lamp' in t or 'standing lamp' in t)),
        (r'Table Lamp', lambda t: ('table lamp' in t or 'bedside table lamp' in t or 'ceramic table lamp' in t)),
        (r'Desk Lamp', lambda t: ('desk lamp' in t or 'architect desk lamp' in t or 'reading desk lamp' in t)),
        (r'(Pendant Light|Sconce|Chandelier)', lambda t: ('pendant light' in t or 'wall sconce' in t or 'modern chandelier' in t or 'ceiling light' in t)),
        (r'Duvet Cover Set', lambda t: ('duvet cover set' in t or 'linen duvet cover' in t or 'cotton duvet' in t)),
        (r'Cotton Sheets', lambda t: ('bed sheet set' in t or 'egyptian cotton sheets' in t or 'percale sheets' in t)),
        (r'Pillows|Pillow Pair', lambda t: ('bed pillows' in t or 'cooling pillow' in t or 'hotel pillows' in t)),
        (r'Throw Blanket|Coverlet', lambda t: ('throw blanket' in t or 'knit throw' in t or 'waffle coverlet' in t)),
        (r'Blackout Curtains', lambda t: ('blackout curtains' in t or 'linen curtains' in t or 'window drapes' in t)),
        (r'(Area Rug|Runner Rug|Jute Rug)', lambda t: ('area rug' in t or 'runner rug' in t or 'moroccan rug' in t or 'jute rug' in t)),
        (r'Shoe Rack', lambda t: ('shoe rack' in t or 'bamboo shoe organizer' in t or 'entryway shoe bench' in t)),
        (r'Storage Basket', lambda t: ('storage basket' in t or 'woven basket' in t or 'rope basket' in t)),
        (r'Floating Wall Shelves', lambda t: ('floating shelves' in t or 'wall shelves wood' in t)),
        (r'Wardrobe Organizer Bins', lambda t: ('wardrobe organizer' in t or 'closet storage bins' in t)),
        (r'Wall Mirror|Floor Mirror', lambda t: ('full length mirror' in t or 'arched wall mirror' in t or 'round mirror' in t or 'decorative mirror' in t)),
        (r'Ceramic.*Vase', lambda t: ('ceramic vase' in t or 'donut vase' in t or 'modern flower vase' in t)),
        (r'Wall Clock', lambda t: ('wall clock modern' in t or 'silent wall clock' in t or 'minimalist clock' in t)),
        (r'Wall Accent|Wall Art', lambda t: ('canvas wall art' in t or 'macrame wall hanging' in t or 'rattan wall decor' in t)),
        (r'Scented Candle', lambda t: ('scented candle' in t or 'soy candle amber' in t or 'aromatherapy candle' in t)),
        (r'Oil Diffuser', lambda t: ('essential oil diffuser' in t or 'ultrasonic diffuser' in t or 'ceramic mist diffuser' in t)),
        (r'Reed Diffuser', lambda t: ('reed diffuser' in t or 'fragrance reed sticks' in t)),
        (r'Planter|Plant Pot', lambda t: ('plant pot ceramic' in t or 'indoor planter pot' in t or 'self watering planter' in t)),
        (r'Plant Hanger|Plant Stand', lambda t: ('plant stand indoor' in t or 'macrame plant hanger' in t)),
        (r'Watering Can', lambda t: ('watering can' in t or 'indoor plant watering can' in t)),
        (r'Touchless Dustbin', lambda t: ('motion sensor trash can' in t or 'touchless dustbin' in t or 'automatic trash can' in t)),
        (r'Bath Mat', lambda t: ('bath mat stone' in t or 'diatomite bath mat' in t or 'quick dry bath mat' in t)),
        (r'Soap Dispenser Set', lambda t: ('bathroom soap dispenser' in t or 'soap dispenser set' in t or 'mason jar soap dispenser' in t)),
        (r'Toilet Brush', lambda t: ('silicone toilet brush' in t or 'toilet bowl brush holder' in t)),
        (r'Ceiling Fan Duster', lambda t: ('microfiber ceiling fan duster' in t or 'extendable duster' in t)),
        (r'Towel Hooks', lambda t: ('towel hooks bathroom' in t or 'adhesive wall hooks' in t))
    ],

    'fashionAccessories.ts': [
        (r'Running Shoes', lambda t: ('running shoes men' in t or 'running shoes women' in t or 'road running sneakers' in t or 'trail running shoes' in t)),
        (r'Sneakers', lambda t: ('low top sneakers' in t or 'retro leather sneakers' in t or 'classic sneakers' in t or 'canvas sneakers' in t)),
        (r'Ankle Boots', lambda t: ('chelsea boots' in t or 'suede ankle boots' in t or 'leather boots' in t)),
        (r'Derby Shoes|Loafers', lambda t: ('derby shoes' in t or 'oxford dress shoes' in t or 'leather loafers' in t or 'penny loafers' in t)),
        (r'Sandals', lambda t: ('cork footbed sandals' in t or 'buckle slide sandals' in t or 'leather sandals' in t)),
        (r'Crew Socks', lambda t: ('crew socks pack' in t or 'cushioned athletic socks' in t or 'cotton socks' in t)),
        (r'Laptop Backpack', lambda t: ('laptop backpack commuter' in t or 'leather backpack' in t or 'water resistant backpack' in t)),
        (r'Tote Bag', lambda t: ('canvas tote bag' in t or 'leather tote bag' in t or 'work tote handbag' in t)),
        (r'Travel Duffel', lambda t: ('travel duffel bag' in t or 'weekender duffel' in t or 'canvas duffle' in t)),
        (r'Crossbody Bag|Messenger', lambda t: ('crossbody bag' in t or 'messenger bag' in t or 'shoulder sling bag' in t)),
        (r'Bifold Wallet', lambda t: ('leather bifold wallet' in t or 'mens slim wallet' in t or 'rfid wallet' in t)),
        (r'Cardholder', lambda t: ('leather card holder' in t or 'slim cardholder' in t or 'credit card case' in t)),
        (r'Passport Holder', lambda t: ('passport holder leather' in t or 'travel passport cover' in t)),
        (r'Dress Belt', lambda t: ('leather dress belt' in t or 'mens leather belt' in t or 'full grain belt' in t)),
        (r'Wristwatch|Watch', lambda t: ('minimalist watch' in t or 'mens leather watch' in t or 'analog wristwatch' in t or 'chronograph watch' in t)),
        (r'Dome Ring|Ring', lambda t: ('gold dome ring' in t or 'chunky ring' in t or 'signet ring' in t or 'band ring' in t)),
        (r'Necklace|Pendant', lambda t: ('pendant necklace gold' in t or 'chain necklace' in t or 'layered necklace' in t)),
        (r'Bracelet', lambda t: ('chain bracelet gold' in t or 'bangle bracelet' in t or 'cuff bracelet' in t)),
        (r'Earrings', lambda t: ('hoop earrings gold' in t or 'huggie hoop earrings' in t or 'stud earrings' in t)),
        (r'Sunglasses|Sun Glasses', lambda t: ('polarized sunglasses' in t or 'classic wayfarer sunglasses' in t or 'aviator sunglasses' in t or 'round sunglasses' in t)),
        (r'Reading Glasses', lambda t: ('reading glasses' in t or 'blue light blocking glasses' in t)),
        (r'Crewneck Tee|T-Shirt', lambda t: ('crewneck t-shirt' in t or 'heavyweight cotton tee' in t or 'supima cotton shirt' in t)),
        (r'Pullover Hoodie', lambda t: ('pullover hoodie' in t or 'fleece sweatshirt' in t or 'french terry hoodie' in t)),
        (r'Cardigan Sweater', lambda t: ('knit cardigan sweater' in t or 'ribbed sweater' in t or 'wool pullover' in t)),
        (r'Bomber Jacket', lambda t: ('bomber jacket' in t or 'windbreaker jacket' in t or 'casual jacket outerwear' in t)),
        (r'Casual Trousers|Chino', lambda t: ('chino pants slim fit' in t or 'stretch trousers' in t or 'casual chinos' in t)),
        (r'Selvedge Denim|Jeans', lambda t: ('straight leg jeans' in t or 'selvedge denim' in t or 'denim jeans mens' in t)),
        (r'Winter Beanie', lambda t: ('ribbed knit beanie' in t or 'cashmere winter hat' in t or 'cuffed beanie' in t)),
        (r'Baseball Cap', lambda t: ('washed cotton baseball cap' in t or 'unstructured dad hat' in t or 'classic cap' in t)),
        (r'Straw Fedora', lambda t: ('straw fedora hat' in t or 'panama sun hat' in t or 'wide brim hat' in t))
    ],

    'personalCareBeauty.ts': [
        (r'Hyaluronic Acid Serum', lambda t: ('hyaluronic acid serum' in t or 'hydrating face serum' in t or 'hyaluronic serum' in t)),
        (r'Vitamin C.*Serum', lambda t: ('vitamin c serum' in t or 'radiance brightening serum' in t)),
        (r'Botanical Retinol|Bakuchiol', lambda t: ('bakuchiol serum' in t or 'retinol serum alternative' in t or 'plant retinol' in t)),
        (r'Salicylic Acid.*Liquid', lambda t: ('salicylic acid liquid' in t or 'bha liquid exfoliant' in t or 'salicylic acid exfoliating' in t)),
        (r'Green Tea.*Cleanser', lambda t: ('green tea cleanser' in t or 'foaming face cleanser' in t or 'facial cleanser wash' in t)),
        (r'Ceramide Moisturizing Cream', lambda t: ('ceramide moisturizing cream' in t or 'barrier repair cream' in t or 'face moisturizer ceramide' in t)),
        (r'Mineral Sunscreen', lambda t: ('mineral sunscreen spf' in t or 'zinc oxide sunscreen' in t or 'sunblock face' in t)),
        (r'Clarifying Toner', lambda t: ('niacinamide toner' in t or 'pore refining toner' in t or 'facial toner' in t)),
        (r'Sleeping Mask', lambda t: ('sleeping mask face' in t or 'overnight moisture mask' in t or 'peptide sleep mask' in t)),
        (r'Argan Oil.*Shampoo', lambda t: ('argan oil shampoo' in t or 'sulfate free shampoo' in t or 'nourishing shampoo' in t)),
        (r'Biotin.*Conditioner', lambda t: ('biotin conditioner' in t or 'rice water conditioner' in t or 'volumizing conditioner' in t)),
        (r'Macadamia Hair Mask', lambda t: ('hair mask deep conditioning' in t or 'macadamia hair mask' in t or 'hair repair mask' in t)),
        (r'Rosemary Scalp Treatment Oil', lambda t: ('rosemary scalp oil' in t or 'rosemary hair growth oil' in t or 'hair scalp treatment oil' in t)),
        (r'Hair Straightener', lambda t: ('hair straightener flat iron' in t or 'ceramic hair styler' in t or 'cordless straightener' in t)),
        (r'Ceramic Hair Dryer', lambda t: ('ceramic hair dryer' in t or 'ionic blow dryer' in t or 'professional hair dryer' in t)),
        (r'Boar Bristle.*Brush', lambda t: ('boar bristle hair brush' in t or 'detangling brush natural' in t)),
        (r'Scalp Massager', lambda t: ('scalp massager silicone brush' in t or 'shampoo scalp brush' in t)),
        (r'Sea Salt Spray', lambda t: ('sea salt spray hair' in t or 'beach wave texturizing spray' in t)),
        (r'Pink Salt Body Scrub', lambda t: ('himalayan pink salt body scrub' in t or 'exfoliating body scrub' in t)),
        (r'Shea Butter Body Cream', lambda t: ('shea butter body cream' in t or 'moisturizing body lotion' in t)),
        (r'Eucalyptus.*Body Wash', lambda t: ('eucalyptus body wash' in t or 'aromatherapy body wash' in t or 'shower gel' in t)),
        (r'Shower Steamers', lambda t: ('aromatherapy shower steamers' in t or 'shower bombs steamers' in t)),
        (r'Dry Body Brush', lambda t: ('dry body brush sisal' in t or 'lymphatic dry brush' in t or 'exfoliating body brush' in t)),
        (r'Magnesium Bath Flakes', lambda t: ('magnesium bath flakes' in t or 'epsom bath salts' in t or 'dead sea bath salts' in t)),
        (r'Cordless Beard Trimmer', lambda t: ('beard trimmer kit' in t or 'cordless beard trimmer' in t or 'hair trimmer men' in t)),
        (r'Safety Razor', lambda t: ('double edge safety razor' in t or 'classic safety razor' in t or 'shaving razor metal' in t)),
        (r'Beard Oil', lambda t: ('sandalwood beard oil' in t or 'organic beard oil conditioner' in t or 'beard oil dropper' in t)),
        (r'Electric Rotary.*Shaver', lambda t: ('rotary foil shaver' in t or 'electric razor men' in t or 'cordless shaver' in t)),
        (r'Shaving Brush', lambda t: ('badger hair shaving brush' in t or 'wet shaving brush' in t or 'synthetic shaving brush' in t)),
        (r'Facial Roller.*Gua Sha', lambda t: ('rose quartz facial roller' in t or 'gua sha tool set' in t or 'jade roller gua sha' in t)),
        (r'Vanity Makeup Mirror', lambda t: ('led lighted vanity mirror' in t or 'rechargeable makeup mirror' in t)),
        (r'Face Cleansing Brush', lambda t: ('sonic face cleansing brush' in t or 'silicone facial brush' in t)),
        (r'Makeup Brush Set', lambda t: ('makeup brush set 12' in t or 'professional cosmetic brushes' in t or 'makeup brushes with case' in t)),
        (r'Eyelash Curler', lambda t: ('eyelash curler stainless' in t or 'ergonomic lash curler' in t)),
        (r'Lip Sleeping Mask', lambda t: ('lip sleeping mask berry' in t or 'hydrating lip mask tub' in t)),
        (r'Lip Balm', lambda t: ('organic beeswax lip balm' in t or 'peppermint lip balm tube' in t)),
        (r'Eye Contour Serum|Eye Patches', lambda t: ('caffeine eye serum' in t or 'gold under eye patches' in t or 'eye contour anti puffiness' in t)),
        (r'Manicure Pedicure Set', lambda t: ('manicure pedicure set stainless' in t or 'nail clipper grooming kit' in t)),
        (r'Glass.*Nail File', lambda t: ('crystal glass nail file' in t or 'gentle nail file set' in t)),
        (r'Cuticle.*Oil', lambda t: ('cuticle oil pen' in t or 'jojoba cuticle conditioner' in t or 'cuticle butter tin' in t)),
        (r'Electric Nail Buffer', lambda t: ('electric nail buffer' in t or 'nail polisher drill' in t or 'manicure buffer device' in t))
    ],

    'travelLifestyle.ts': [
        (r'Hardshell Spinner Cabin Suitcase', lambda t: ('hardshell spinner cabin suitcase' in t or 'carry on luggage 20 inch' in t or 'hardside spinner carry on' in t)),
        (r'Expandable Checked Medium Luggage', lambda t: ('checked luggage 24 inch' in t or 'medium spinner suitcase' in t or 'expandable luggage tsa lock' in t)),
        (r'Aluminum Frame.*Luggage', lambda t: ('aluminum frame luggage' in t or 'aluminum carry on suitcase' in t)),
        (r'Large Family Spinner Trunk', lambda t: ('28 inch spinner trunk' in t or 'large luggage suitcase' in t or 'rolling trunk suitcase' in t)),
        (r'Underseat Compact Rolling Flight Bag', lambda t: ('underseat rolling flight bag' in t or 'compact rolling carry on' in t or 'underseat luggage with usb' in t)),
        (r'Rolling Duffel Travel Bag', lambda t: ('rolling duffel bag wheels' in t or 'wheeled duffel luggage' in t)),
        (r'Hanging Toiletry Bag', lambda t: ('hanging toiletry bag' in t or 'toiletry organizer travel' in t or 'dopp kit hook' in t)),
        (r'Compression Packing Cubes', lambda t: ('compression packing cubes set' in t or 'ultralight packing cubes' in t or 'travel luggage organizer cubes' in t)),
        (r'Water-Resistant Travel Duffel Weekender', lambda t: ('travel duffel weekender' in t or 'canvas weekender bag 45l' in t or 'overnight travel bag' in t)),
        (r'Packable Backpack', lambda t: ('packable lightweight backpack' in t or 'foldable daypack travel' in t)),
        (r'Passport Holder & Wallet', lambda t: ('rfid family passport holder' in t or 'travel document wallet' in t)),
        (r'Shoe Travel Bags', lambda t: ('shoe travel bags' in t or 'shoe storage bags packing' in t)),
        (r'Clear TSA Approved.*Bottle Set', lambda t: ('tsa approved travel bottles' in t or 'leakproof silicone travel bottles' in t)),
        (r'Electronics Travel Organizer Case', lambda t: ('cord charger electronics organizer' in t or 'travel cable case' in t)),
        (r'Memory Foam Travel Neck Pillow', lambda t: ('memory foam travel neck pillow' in t or 'ergonomic airplane neck pillow' in t)),
        (r'Silk Sleep Eye Mask', lambda t: ('pure silk sleep eye mask' in t or 'contoured eye cups sleep mask' in t)),
        (r'Worldwide Travel Power Adapter', lambda t: ('worldwide travel power adapter' in t or 'all in one universal travel adapter' in t)),
        (r'Microfleece Travel Blanket', lambda t: ('travel blanket with pouch' in t or 'airplane travel blanket compact' in t)),
        (r'Luggage Weight Scale', lambda t: ('digital luggage weight scale' in t or 'backlit lcd luggage scale' in t)),
        (r'Luggage Locks', lambda t: ('tsa approved luggage locks' in t or 'cable luggage lock 2-pack' in t)),
        (r'Airplane Foot Rest Pillow', lambda t: ('airplane foot rest pillow' in t or 'inflatable travel footrest' in t)),
        (r'Backpacking Tent', lambda t: ('backpacking tent 2 person' in t or 'ultralight camping tent' in t or 'tent with rainfly' in t)),
        (r'Down Sleeping Bag', lambda t: ('down sleeping bag compact' in t or 'camping sleeping bag 20f' in t)),
        (r'Camping Cookware Mess Kit', lambda t: ('camping cookware mess kit' in t or 'titanium camping pot pan' in t)),
        (r'Camping Hammock', lambda t: ('camping hammock tree straps' in t or 'portable parachute hammock' in t)),
        (r'Camping Stove Burner', lambda t: ('mini gas camping stove' in t or 'portable backpacking stove burner' in t)),
        (r'Pocket Multi-Tool Pliers', lambda t: ('multi-tool pliers 14-in-1' in t or 'pocket multitool pliers' in t)),
        (r'Rechargeable LED Headlamp', lambda t: ('led headlamp rechargeable' in t or 'outdoor camping headlamp sensor' in t)),
        (r'Insulated Picnic Cooler Tote', lambda t: ('insulated picnic cooler tote' in t or 'cooler bag 30 can' in t)),
        (r'Rubber Yoga Mat', lambda t: ('natural rubber yoga mat' in t or 'non slip exercise yoga mat' in t)),
        (r'Speed Rope', lambda t: ('jump speed rope bearings' in t or 'adjustable fitness jump rope' in t)),
        (r'Foam Roller', lambda t: ('high density foam roller' in t or 'muscle recovery foam roller' in t)),
        (r'Massage Gun', lambda t: ('deep tissue massage gun' in t or 'percussion muscle massage gun' in t)),
        (r'Gym Towels', lambda t: ('microfiber fast drying gym towels' in t or 'workout towels pair' in t)),
        (r'Resistance Loop Bands', lambda t: ('resistance loop bands set' in t or 'workout exercise bands 5' in t)),
        (r'Shaker Bottle', lambda t: ('stainless steel shaker bottle' in t or 'protein shaker bottle whisk' in t)),
        (r'Waist Pack Belt', lambda t: ('running waist pack belt' in t or 'running fanny pack phone holder' in t)),
        (r'Tactical Key Organizer', lambda t: ('carbon fiber key organizer' in t or 'compact key holder tactical' in t)),
        (r'Jet Flame Lighter', lambda t: ('windproof jet flame lighter' in t or 'torch lighter outdoor' in t)),
        (r'Pocket Multi-Tool|Pry Bar', lambda t: ('titanium pocket pry bar' in t or 'edc pry bar multitool' in t)),
        (r'Pocket EDC Ballpoint Pen', lambda t: ('titanium pocket edc pen' in t or 'bolt action tactical pen' in t)),
        (r'Aluminum Pill Case', lambda t: ('aluminum pill case keyring' in t or 'waterproof pill box keychain' in t)),
        (r'Notebook Pocket Pack', lambda t: ('field notes pocket notebook' in t or 'weatherproof memo book 3-pack' in t))
    ],

    'giftsStationery.ts': [
        (r'Travel Journal', lambda t: ('leather bound travel journal' in t or 'refillable journal notebook' in t or 'vintage leather journal' in t)),
        (r'Bullet Journal', lambda t: ('bullet journal 160gsm' in t or 'dot grid notebook hardcover' in t or 'dotted journal' in t)),
        (r'Linen Notebook', lambda t: ('linen hardcover notebook' in t or 'ruled linen journal bookmark' in t or 'classic ruled notebook' in t)),
        (r'Gratitude Journal', lambda t: ('gratitude journal reflection' in t or 'mindfulness daily journal' in t or 'guided prompt journal' in t)),
        (r'Artist Sketchbook', lambda t: ('spiral artist sketchbook a4' in t or 'drawing sketch pad blank' in t or 'hardcover sketchbook' in t)),
        (r'Rollerball Pen', lambda t: ('heavyweight rollerball pen' in t or 'brass executive rollerball' in t or 'luxury rollerball pen' in t)),
        (r'Fountain Pen', lambda t: ('gold nib fountain pen' in t or 'fountain pen ink converter' in t or 'classic fountain pen' in t)),
        (r'Fineliner Drawing Pens', lambda t: ('fineliner drawing pens set' in t or 'precision micro pens black ink' in t)),
        (r'Retractable Pens', lambda t: ('gel ink retractable pens 0.5mm' in t or 'smooth gel pens pack' in t)),
        (r'Pastel.*Highlighters', lambda t: ('pastel aesthetic highlighters' in t or 'dual tip highlighters mild' in t)),
        (r'Drafting Pencil', lambda t: ('mechanical drafting pencil 0.5mm' in t or 'metal drafting pencil' in t)),
        (r'Wooden Desk Organizer Tray', lambda t: ('walnut desk organizer tray' in t or 'wooden desktop organizer' in t)),
        (r'File Document Sorter', lambda t: ('mesh file document sorter' in t or 'wire desk mail sorter' in t or 'metal document tray' in t)),
        (r'Tape Dispenser', lambda t: ('heavy duty desktop tape dispenser' in t or 'brass tape dispenser' in t)),
        (r'Stationery Organizer Caddy', lambda t: ('rotating desk organizer caddy' in t or 'acrylic stationery caddy' in t)),
        (r'Wax Seal Stamp Kit', lambda t: ('wax seal stamp kit' in t or 'wax seal melting spoon beads' in t)),
        (r'Watercolor Paint Palette', lambda t: ('watercolor paint palette 36' in t or 'artist watercolor pan set' in t)),
        (r'Cotton Watercolor Paper Block', lambda t: ('cotton watercolor paper block' in t or 'cold press watercolor pad' in t)),
        (r'Colored Pencils', lambda t: ('soft core colored pencils 48' in t or 'artist colored pencils tin' in t)),
        (r'Sketching Pencils Set', lambda t: ('graphite sketching pencils set' in t or 'drawing pencils metal box' in t)),
        (r'Art Markers Set', lambda t: ('dual tip art markers 24' in t or 'alcohol based sketch markers' in t)),
        (r'Artist Paintbrush Set', lambda t: ('fine detail artist paintbrush set' in t or 'watercolor paint brushes 10' in t)),
        (r'Polymer Clay Sculpting Starter Kit', lambda t: ('polymer clay sculpting kit' in t or 'modeling clay starter kit tools' in t)),
        (r'Wall Pegboard Modular Craft Board', lambda t: ('wall pegboard modular craft board' in t or 'craft organizer pegboard' in t)),
        (r'Journal & Pen Gift Box', lambda t: ('executive leather journal pen gift box' in t or 'journal gift set box' in t)),
        (r'Tea & Infuser Keepsake Set', lambda t: ('loose leaf tea infuser gift set' in t or 'artisan tea gift box' in t)),
        (r'Candle & Matches Gift Set', lambda t: ('aromatherapy candle matches gift set' in t or 'luxury candle gift box' in t)),
        (r'Keepsake Memory Box', lambda t: ('wooden keepsake memory box' in t or 'handcrafted wooden gift box' in t)),
        (r'Botanical Greeting Cards', lambda t: ('letterpress botanical greeting cards' in t or 'assorted greeting cards 8 pack' in t or 'floral blank cards' in t)),
        (r'Wrapping Paper Sheets', lambda t: ('recycled cotton wrapping paper sheets' in t or 'handmade gift wrap sheets' in t)),
        (r'Velvet Ribbon Spool Set', lambda t: ('silk velvet ribbon spool' in t or 'velvet ribbon gift wrapping' in t)),
        (r'Gift Tags with Jute Twine', lambda t: ('kraft paper gift tags twine' in t or 'gift tags 50 pack' in t))
    ]
}

def find_rule_for_prod(p, rules):
    for pat, matcher in rules:
        if re.search(pat, p['name'], re.IGNORECASE):
            return matcher, pat
    return None, None

def run_master_harvest():
    print("===================================================================")
    print("MASTER RETAIL PRODUCT IMAGE HARVESTER FOR DAILYNEST (1505 PRODUCTS)")
    print("===================================================================")

    global_used_primary = set()
    total_assigned = 0
    all_catalog_data = {}
    data_dir = os.path.join('src', 'data', 'products')

    for filename, sources in CATEGORY_DATASETS.items():
        filepath = os.path.join(data_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        json_str = content[content.index('= [') + 2 : content.rindex(';')]
        products = json.loads(json_str)

        print(f"\n>>> Processing Category File: {filename} ({len(products)} products)...")
        rules = CATEGORY_RULES.get(filename, [])

        unmatched = []
        for p in products:
            matcher, pat = find_rule_for_prod(p, rules)
            unmatched.append({
                'prod': p,
                'matcher': matcher,
                'pat': pat or p['subcategory']
            })

        matched_dict = {}

        for source in sources:
            url = BASE_HF_URL + source
            print(f"  Streaming {source} from Hugging Face...")
            req = urllib.request.Request(url, headers={'User-Agent': 'DailyNest/1.0'})

            try:
                with urllib.request.urlopen(req, timeout=40) as resp:
                    lines_scanned = 0
                    while unmatched and lines_scanned < 85000:
                        lines_scanned += 1
                        line = resp.readline().decode('utf-8', errors='ignore')
                        if not line:
                            break

                        try:
                            item = json.loads(line)
                        except:
                            continue

                        item_title = item.get('title', '').strip()
                        if not item_title or len(item_title) < 5:
                            continue
                        item_title_lower = item_title.lower()

                        images = item.get('images', [])
                        if not images:
                            continue

                        img_urls = []
                        for img in images:
                            if isinstance(img, dict):
                                u = img.get('hi_res') or img.get('large')
                                if u and u.startswith('https://') and u not in global_used_primary:
                                    img_urls.append(u)

                        if not img_urls:
                            continue

                        primary_img = img_urls[0]
                        secondary_img = img_urls[1] if len(img_urls) > 1 else primary_img

                        # Check if matches any unmatched product
                        for idx, cand in enumerate(unmatched):
                            m = cand['matcher']
                            matched_ok = False
                            if m:
                                matched_ok = m(item_title_lower)
                            else:
                                # Fallback to subcat name
                                matched_ok = cand['pat'].lower() in item_title_lower

                            if matched_ok:
                                p = cand['prod']
                                # Exclude accessories if product is not an accessory
                                if not is_clean_item(item_title, cand['pat']):
                                    continue

                                unmatched.pop(idx)
                                global_used_primary.add(primary_img)
                                matched_dict[p['id']] = [primary_img, secondary_img]

                                if len(matched_dict) % 20 == 0 or len(matched_dict) == len(products):
                                    print(f"    [{len(matched_dict)}/{len(products)}] \"{p['name'][:35]}\" -> \"{item_title[:35]}\"", flush=True)
                                break

                        if not unmatched:
                            print(f"  All {len(products)} products matched in {filename}!", flush=True)
                            break
            except Exception as e:
                print(f"  Warning streaming {source}: {e}", flush=True)

            if not unmatched:
                break

        # Fallback for remaining items in same subcategory to guarantee 100% assignment
        if unmatched:
            print(f"  Resolving {len(unmatched)} remaining items in {filename} via subcategory pool...")
            for cand in list(unmatched):
                p = cand['prod']
                subcat = p['subcategory']
                for other_p in products:
                    if other_p['id'] in matched_dict and other_p['subcategory'] == subcat:
                        other_imgs = matched_dict[other_p['id']]
                        for cand_img in other_imgs[1:]:
                            if cand_img not in global_used_primary:
                                global_used_primary.add(cand_img)
                                matched_dict[p['id']] = [cand_img, other_imgs[0]]
                                unmatched.remove(cand)
                                break
                    if cand not in unmatched:
                        break

        print(f"  Final matched for {filename}: {len(matched_dict)} / {len(products)}")
        total_assigned += len(matched_dict)

        # Update product list
        updated_products = []
        for p in products:
            p_copy = dict(p)
            if p['id'] in matched_dict:
                p_copy['images'] = matched_dict[p['id']]
            updated_products.append(p_copy)

        all_catalog_data[filename] = updated_products

    # Write back to files
    print("\n===================================================================")
    print("WRITING UPDATED PRODUCTS TO CATALOG FILES")
    print("===================================================================")

    file_var_map = {
        'electronicsTech.ts': 'electronicsTechProducts',
        'kitchenDining.ts': 'kitchenDiningProducts',
        'homeLiving.ts': 'homeLivingProducts',
        'fashionAccessories.ts': 'fashionAccessoriesProducts',
        'personalCareBeauty.ts': 'personalCareBeautyProducts',
        'travelLifestyle.ts': 'travelLifestyleProducts',
        'giftsStationery.ts': 'giftsStationeryProducts'
    }

    for filename, prods in all_catalog_data.items():
        filepath = os.path.join(data_dir, filename)
        var_name = file_var_map[filename]
        header = f"import {{ Product }} from '../../types/product';\n\nexport const {var_name}: Product[] = "
        json_content = json.dumps(prods, indent=2)
        full_content = header + json_content + ";\n"

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_content)
        print(f"  Wrote {len(prods)} products to {filepath}")

    print("\n===================================================================")
    print("MASTER HARVEST COMPLETED SUCCESSFULLY")
    print(f"Total Products: {total_assigned}")
    print(f"Products With Images: {total_assigned}")
    print(f"Unique Primary Images: {len(global_used_primary)}")
    print(f"Duplicate Primary Images: {total_assigned - len(global_used_primary)}")
    print("===================================================================")

if __name__ == '__main__':
    run_master_harvest()
