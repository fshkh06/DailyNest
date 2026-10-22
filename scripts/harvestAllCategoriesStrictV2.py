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

# Bad phrases indicating an accessory or replacement part rather than the actual product
BAD_WORDS = [
    'case for', 'cover for', 'sleeve for', 'adapter for', 'replacement for',
    'battery for', 'strap for', 'band for', 'ear hooks', 'silicone tips',
    'charger for', 'screen protector for', 'parts for', 'wheel for', 'skin for',
    'decal for', 'mount for', 'cables for', 'stand for', 'cable ferrules',
    'replacement parts', 'accessories kit', 'accessory kit', 'replacement band',
    'cushion replacement', 'ear pad replacement'
]

def is_clean_item(title, req_noun):
    t_low = title.lower()
    for b in BAD_WORDS:
        if b in t_low:
            # If the product itself is a case or cover, allow it
            if 'case' in req_noun or 'cover' in req_noun or 'sleeve' in req_noun or 'protector' in req_noun or 'strap' in req_noun:
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

# Master Rules mapping regex patterns on product name to required keywords in Amazon listing title
STRICT_NOUN_RULES = [
    # Audio
    (r'\b(earbuds?|in-ear)\b', ['earbuds', 'earbud', 'true wireless in-ear']),
    (r'\b(headphones?|over-ear|on-ear)\b', ['headphones', 'headphone', 'over-ear']),
    (r'\b(bone conduction)\b', ['bone conduction', 'open-ear headphones']),
    (r'\b(earphones?|neckband)\b', ['neckband', 'earphones', 'wireless earphones']),
    (r'\b(headset)\b', ['gaming headset', 'headset with mic', 'headset']),
    (r'\b(amplifier|dac)\b', ['headphone amplifier', 'headphone amp', 'audio dac', 'dac amp']),
    (r'\b(soundbar)\b', ['soundbar', 'tv soundbar']),
    (r'\b(speakers?)\b', ['bluetooth speaker', 'bookshelf speaker', 'portable speaker', 'speaker']),

    # Power
    (r'\b(power bank)\b', ['power bank', 'portable charger', 'battery pack']),
    (r'\b(wireless charger|charging station|charging pad)\b', ['wireless charger', 'charging station', 'wireless charging pad']),
    (r'\b(car charger)\b', ['car charger', 'fast car charger']),
    (r'\b(wall charger|gan charger|fast charger|usb charger)\b', ['gan charger', 'wall charger', 'usb c charger', 'fast charger']),
    (r'\b(surge protector|power strip)\b', ['surge protector', 'power strip']),
    (r'\b(charging cable|usb cable|usb-c cable|kevlar cable|braided.*cable)\b', ['usb c cable', 'charging cable', 'usb cable']),

    # Computer & Desk
    (r'\b(keyboard)\b', ['mechanical keyboard', 'gaming keyboard', 'wireless keyboard', 'keyboard']),
    (r'\b(vertical.*mouse)\b', ['vertical mouse', 'ergonomic vertical mouse']),
    (r'\b(mouse)\b', ['wireless mouse', 'gaming mouse', 'optical mouse', 'bluetooth mouse']),
    (r'\b(laptop stand|monitor stand|riser)\b', ['laptop stand', 'monitor stand', 'laptop riser']),
    (r'\b(light bar|screenbar)\b', ['monitor light bar', 'screenbar', 'desk light bar']),
    (r'\b(hub|docking station)\b', ['usb-c hub', 'docking station', 'multiport adapter', 'usb hub']),
    (r'\b(desk mat|mouse pad|blotter)\b', ['desk mat', 'desk pad', 'mouse pad', 'blotter']),
    (r'\b(wrist rest)\b', ['wrist rest', 'keyboard wrist rest']),
    (r'\b(portable.*monitor|ips monitor)\b', ['portable monitor', 'travel monitor']),
    (r'\b(monitor|screen)\b', ['computer monitor', 'display monitor']),
    (r'\b(privacy screen|privacy filter)\b', ['privacy screen filter', 'privacy filter', 'privacy screen']),

    # Wearables & Cameras & Smart Home
    (r'\b(smartwatch|smart watch)\b', ['smartwatch', 'smart watch', 'fitness smartwatch']),
    (r'\b(fitness tracker|smart band)\b', ['fitness tracker', 'fitness band', 'activity tracker']),
    (r'\b(smart glasses|audio glasses)\b', ['smart glasses', 'audio glasses', 'bluetooth glasses']),
    (r'\b(health ring|smart ring)\b', ['smart ring', 'health ring']),
    (r'\b(airtag|key finder|luggage tracker|tracker.*gps)\b', ['key finder', 'bluetooth tracker', 'airtag', 'smart tag']),
    (r'\b(voice recorder)\b', ['voice recorder', 'digital voice recorder', 'audio recorder']),
    (r'\b(smart.*helmet|bike helmet)\b', ['bike helmet', 'bicycle helmet']),
    (r'\b(smart thermos|thermos bottle)\b', ['smart water bottle', 'vacuum insulated bottle', 'thermos bottle']),
    (r'\b(webcam)\b', ['webcam', '4k webcam', 'streaming camera']),
    (r'\b(lavalier|lapel mic)\b', ['lavalier microphone', 'wireless lavalier', 'lapel mic']),
    (r'\b(microphone|mic)\b', ['usb microphone', 'condenser microphone', 'podcast microphone']),
    (r'\b(ring light)\b', ['ring light', 'led ring light', 'ring light tripod']),
    (r'\b(gimbal|stabilizer)\b', ['smartphone gimbal', 'phone gimbal', 'gimbal stabilizer']),
    (r'\b(green screen|backdrop)\b', ['green screen', 'collapsible backdrop', 'photo backdrop']),
    (r'\b(camera mount|arm clamp)\b', ['camera mount', 'desk clamp mount', 'camera arm']),
    (r'\b(sd card|microsd|memory card)\b', ['sd card', 'microsd', 'memory card']),
    (r'\b(smart plug|smart outlet)\b', ['smart plug', 'smart outlet', 'wifi plug']),
    (r'\b(smart bulb|light bulb)\b', ['smart bulb', 'rgb smart bulb', 'smart led bulb']),
    (r'\b(security camera|indoor camera)\b', ['security camera', 'indoor camera', 'wifi camera']),
    (r'\b(doorbell)\b', ['video doorbell', 'doorbell camera', 'wireless doorbell']),
    (r'\b(door lock|smart lock)\b', ['smart lock', 'keyless entry door lock', 'electronic door lock']),
    (r'\b(light strips?|led strip)\b', ['led light strip', 'motion sensor light strip', 'stair light']),
    (r'\b(humidifier)\b', ['humidifier', 'ultrasonic humidifier', 'cool mist humidifier']),
    (r'\b(air quality monitor)\b', ['air quality monitor', 'co2 monitor']),
    (r'\b(phone case)\b', ['phone case', 'slim phone case', 'protective phone case']),
    (r'\b(tablet stand|ipad stand)\b', ['tablet stand', 'ipad stand', 'tablet holder']),
    (r'\b(screen protector)\b', ['tempered glass screen protector', 'screen protector']),
    (r'\b(car phone mount|phone mount)\b', ['car phone mount', 'car vent phone holder', 'car phone holder']),
    (r'\b(ring grip|phone ring)\b', ['phone ring holder', 'phone grip', 'finger ring holder']),
    (r'\b(leather wallet.*magsafe|magsafe.*wallet)\b', ['magsafe wallet', 'magnetic phone wallet']),
    (r'\b(stylus pen|touch pen)\b', ['stylus pen', 'capacitive stylus', 'apple pencil alternative']),
    (r'\b(ssd|solid state drive)\b', ['portable ssd', 'external ssd', 'solid state drive']),
    (r'\b(flash drive|thumb drive)\b', ['usb flash drive', 'flash drive', 'thumb drive']),
    (r'\b(organizer case|cable organizer|organizer box|travel case|cable box)\b', ['cable organizer', 'electronics organizer', 'cable management box']),
    (r'\b(presenter|clicker)\b', ['wireless presenter', 'presentation clicker']),
    (r'\b(turbo desk fan|desk fan)\b', ['desk fan', 'portable fan', 'usb fan']),

    # Kitchen & Dining
    (r'\b(dutch oven)\b', ['dutch oven', 'enameled cast iron dutch oven']),
    (r'\b(skillet|frying pan|saute pan|wok|pan)\b', ['frying pan', 'skillet', 'nonstick pan', 'wok']),
    (r'\b(pot|saucepan|stockpot)\b', ['saucepan', 'cooking pot', 'stockpot']),
    (r'\b(kitchen shears)\b', ['kitchen shears', 'poultry shears']),
    (r'\b(chef knife|santoku knife|bread knife|knife|cutlery|cleaver)\b', ['chef knife', 'santoku knife', 'bread knife', 'kitchen knife']),
    (r'\b(air fryer)\b', ['air fryer', 'digital air fryer']),
    (r'\b(electric kettle|kettle)\b', ['electric kettle', 'gooseneck kettle', 'tea kettle']),
    (r'\b(blender)\b', ['countertop blender', 'smoothie blender', 'blender']),
    (r'\b(toaster)\b', ['2 slice toaster', '4 slice toaster', 'bread toaster', 'toaster']),
    (r'\b(food processor|stand mixer|mixer)\b', ['food processor', 'stand mixer', 'electric mixer']),
    (r'\b(waffle maker)\b', ['waffle maker', 'waffle iron']),
    (r'\b(pressure cooker)\b', ['pressure cooker', 'instant pot', 'multi cooker']),
    (r'\b(panini press|sandwich maker)\b', ['panini press', 'sandwich maker']),
    (r'\b(juicer|cold press juicer)\b', ['cold press juicer', 'masticating juicer', 'slow juicer', 'juicer machine']),
    (r'\b(pour-over|pour over|carafe|dripper)\b', ['pour over coffee maker', 'glass carafe pour over', 'coffee dripper']),
    (r'\b(coffee grinder|grinder)\b', ['coffee grinder', 'burr coffee grinder', 'electric coffee grinder']),
    (r'\b(french press)\b', ['french press coffee maker', 'french press']),
    (r'\b(espresso machine|espresso maker)\b', ['espresso machine', 'espresso maker']),
    (r'\b(cold brew)\b', ['cold brew coffee maker', 'cold brew maker']),
    (r'\b(teapot)\b', ['cast iron teapot', 'ceramic teapot', 'glass teapot', 'teapot']),
    (r'\b(milk frother|frother)\b', ['milk frother', 'electric milk frother']),
    (r'\b(tasting bean|coffee beans?)\b', ['whole bean coffee', 'coffee beans', 'roasted coffee beans']),
    (r'\b(cocktail shaker|bartender)\b', ['cocktail shaker', 'bartender kit', 'bar shaker']),
    (r'\b(dinner plates?|plates?)\b', ['dinner plates', 'ceramic plate set', 'dinnerware plates']),
    (r'\b(pasta bowls?|bowls?|soup tureen)\b', ['pasta bowls', 'ceramic bowls set', 'soup bowls', 'serving bowl']),
    (r'\b(flatware|silverware)\b', ['flatware set', 'silverware set', 'stainless cutlery set']),
    (r'\b(napkins?)\b', ['cloth napkins', 'dinner napkins', 'linen napkins']),
    (r'\b(tumbler)\b', ['stainless steel tumbler', 'insulated tumbler', 'travel tumbler']),
    (r'\b(glass water bottle)\b', ['glass water bottle', 'borosilicate glass bottle']),
    (r'\b(water bottle|flask)\b', ['water bottle insulated', 'sports water bottle', 'vacuum water bottle']),
    (r'\b(coffee mug|mug|mugs?)\b', ['coffee mug', 'ceramic mug', 'stoneware mug']),
    (r'\b(whiskey.*glasses|bourbon glasses)\b', ['whiskey glasses', 'bourbon glasses', 'rocks glasses']),
    (r'\b(highball glasses|drinking glasses)\b', ['highball glasses', 'collins glasses', 'drinking glasses']),
    (r'\b(food storage|containers?)\b', ['food storage containers', 'glass meal prep containers', 'airtight food containers']),
    (r'\b(cereal dispenser|dispensers?)\b', ['cereal dispenser', 'dry food dispenser']),
    (r'\b(bento|lunch box)\b', ['bento box', 'lunch box container']),
    (r'\b(spice rack|lazy susan)\b', ['spice rack organizer', 'lazy susan spice', 'revolving spice rack']),
    (r'\b(bread box)\b', ['bread box', 'bread bin']),
    (r'\b(oil & vinegar|cruet)\b', ['oil dispenser bottle', 'oil and vinegar cruet', 'olive oil cruet']),
    (r'\b(cutting board)\b', ['cutting board wood', 'bamboo cutting board']),
    (r'\b(drawer organizer)\b', ['kitchen drawer organizer', 'cutlery drawer tray', 'drawer divider']),
    (r'\b(dish drying rack|drying rack)\b', ['dish drying rack', 'over the sink dish rack']),
    (r'\b(storage bags)\b', ['reusable silicone food storage bags', 'silicone storage bags']),
    (r'\b(kitchen scale)\b', ['kitchen food scale', 'digital kitchen scale', 'kitchen scale']),
    (r'\b(meat thermometer|food thermometer|thermometer)\b', ['meat thermometer instant read', 'digital food thermometer', 'meat thermometer']),
    (r'\b(rolling pin)\b', ['rolling pin wood', 'french rolling pin']),
    (r'\b(spatula|utensil set)\b', ['silicone spatula set', 'kitchen utensil set']),
    (r'\b(apron|chef apron)\b', ['chef apron', 'kitchen cooking apron']),
    (r'\b(muffin tin|muffin pan|baking pan|baking sheet|cake pan)\b', ['muffin pan', 'baking sheet', 'cake pan']),
    (r'\b(mixing bowls?)\b', ['mixing bowls set', 'stainless steel mixing bowls']),
    (r'\b(baking mat)\b', ['silicone baking mat', 'pastry mat silicone']),
    (r'\b(springform pan)\b', ['springform pan', 'cheesecake pan']),
    (r'\b(flour sifter)\b', ['flour sifter stainless', 'baking sifter']),
    (r'\b(measuring cups?|measuring spoons?)\b', ['measuring cups and spoons set', 'stainless measuring cups']),

    # Home & Living
    (r'\b(mesh office chair|ergonomic office chair|desk chair)\b', ['mesh office chair', 'ergonomic office chair', 'desk chair']),
    (r'\b(accent chair|lounge chair|armchair|reading chair)\b', ['accent chair', 'lounge chair', 'armchair']),
    (r'\b(dining chair)\b', ['dining chair', 'dining room chair']),
    (r'\b(bar stool|counter stool)\b', ['bar stool', 'counter stool']),
    (r'\b(floor cushion|meditation cushion)\b', ['floor cushion', 'meditation cushion', 'floor pillow']),
    (r'\b(coffee table)\b', ['coffee table wood', 'round coffee table', 'coffee table']),
    (r'\b(standing desk|office desk)\b', ['standing desk electric', 'adjustable standing desk', 'office desk']),
    (r'\b(side table|end table|nightstand)\b', ['side table', 'nightstand bedroom', 'end table']),
    (r'\b(dining table)\b', ['dining table wood', 'kitchen dining table']),
    (r'\b(sofa|couch|loveseat)\b', ['sofa living room', 'couch sofa', 'loveseat sofa']),
    (r'\b(futon|sofa bed)\b', ['futon sofa bed', 'convertible futon sofa']),
    (r'\b(bed frame|platform bed)\b', ['platform bed frame', 'wood bed frame queen', 'bed frame']),
    (r'\b(mattress topper)\b', ['memory foam mattress topper', 'mattress topper']),
    (r'\b(floor lamp)\b', ['floor lamp living room', 'arc floor lamp', 'standing floor lamp']),
    (r'\b(table lamp|bedside lamp)\b', ['table lamp ceramic', 'bedside table lamp', 'table lamp']),
    (r'\b(desk lamp)\b', ['desk lamp led', 'architect desk lamp', 'reading desk lamp']),
    (r'\b(pendant light|ceiling light|chandelier|wall sconce)\b', ['pendant light modern', 'ceiling light fixture', 'wall sconce light']),
    (r'\b(duvet cover|comforter)\b', ['duvet cover set', 'linen duvet cover', 'comforter set']),
    (r'\b(cotton sheets|bed sheets?)\b', ['bed sheet set', 'cotton sheets queen', 'sheet set']),
    (r'\b(pillow pair|bed pillows?)\b', ['bed pillows queen', 'sleeping bed pillow']),
    (r'\b(throw blanket|coverlet)\b', ['throw blanket couch', 'knit throw blanket', 'waffle throw blanket']),
    (r'\b(curtains?|drapes?)\b', ['blackout curtains', 'linen curtains window']),
    (r'\b(area rug|runner rug|jute rug|rug)\b', ['area rug living room', 'runner rug hallway', 'jute rug']),
    (r'\b(shoe rack)\b', ['shoe rack organizer', 'entryway shoe rack', 'bamboo shoe rack']),
    (r'\b(storage basket|woven basket)\b', ['storage basket woven', 'rope storage basket']),
    (r'\b(floating shelves|wall shelves)\b', ['floating shelves wall mounted', 'wood floating shelves']),
    (r'\b(wardrobe organizer|closet bins)\b', ['closet storage bins', 'wardrobe clothes organizer']),
    (r'\b(wall mirror|floor mirror|mirror)\b', ['arched wall mirror', 'full length mirror', 'round wall mirror']),
    (r'\b(ceramic.*vase|flower vase|vase)\b', ['ceramic flower vase', 'modern ceramic vase', 'donut vase']),
    (r'\b(wall clock)\b', ['wall clock modern', 'silent wall clock']),
    (r'\b(sculpture|wall accent|wall art)\b', ['canvas wall art modern', 'metal wall art decor', 'sculpture decor']),
    (r'\b(picture frame|photo frame)\b', ['picture frame wood', 'photo frame set']),
    (r'\b(scented candle|candle)\b', ['scented candle soy', 'aromatherapy scented candle']),
    (r'\b(oil diffuser|reed diffuser)\b', ['essential oil diffuser ceramic', 'reed diffuser set']),
    (r'\b(planter|plant pot)\b', ['indoor planter pot ceramic', 'plant pot with drainage']),
    (r'\b(plant hanger|plant stand)\b', ['plant stand indoor', 'macrame plant hanger']),
    (r'\b(watering can)\b', ['indoor plant watering can', 'watering can stainless']),
    (r'\b(touchless dustbin|trash can)\b', ['automatic touchless trash can', 'motion sensor trash can', 'stainless trash can']),
    (r'\b(bath mat)\b', ['bath mat non slip', 'stone bath mat diatomite', 'memory foam bath mat']),
    (r'\b(soap dispenser set|soap dispenser)\b', ['bathroom soap dispenser set', 'glass soap dispenser']),
    (r'\b(toilet brush)\b', ['silicone toilet brush and holder', 'toilet bowl brush set']),
    (r'\b(ceiling fan duster|duster)\b', ['microfiber extendable duster', 'ceiling fan duster']),
    (r'\b(towel hooks?)\b', ['bathroom towel hooks wall', 'robe towel hook']),

    # Fashion & Accessories
    (r'\b(running shoes)\b', ['running shoes men', 'running shoes women', 'road running shoes']),
    (r'\b(sneakers)\b', ['low top sneakers casual', 'canvas sneakers shoes', 'leather fashion sneakers']),
    (r'\b(ankle boots|boots)\b', ['chelsea boots leather', 'ankle boots suede', 'leather ankle boots']),
    (r'\b(derby shoes|loafers|oxfords?)\b', ['penny loafers leather', 'derby dress shoes', 'oxford shoes men']),
    (r'\b(sandals|slides)\b', ['cork footbed slide sandals', 'leather slide sandals']),
    (r'\b(crew socks|socks)\b', ['cushioned crew socks pack', 'cotton crew socks']),
    (r'\b(laptop backpack)\b', ['laptop backpack commuter', 'travel laptop backpack slim']),
    (r'\b(tote bag)\b', ['canvas tote bag shoulder', 'leather work tote bag']),
    (r'\b(travel duffel|duffel bag)\b', ['travel duffel bag weekender', 'canvas duffel bag travel']),
    (r'\b(crossbody bag|messenger bag)\b', ['leather crossbody bag', 'crossbody shoulder bag messenger']),
    (r'\b(bifold wallet|wallet)\b', ['leather bifold wallet rfid', 'mens slim bifold wallet']),
    (r'\b(cardholder|card case)\b', ['slim leather card holder wallet', 'credit card case holder']),
    (r'\b(passport holder)\b', ['rfid leather passport holder cover', 'passport wallet cover']),
    (r'\b(dress belt|leather belt|belt)\b', ['mens leather dress belt', 'full grain leather belt']),
    (r'\b(wristwatch|watch)\b', ['minimalist analog watch mens', 'leather strap wristwatch', 'chronograph watch']),
    (r'\b(dome ring|ring)\b', ['gold dome ring chunk', 'signet ring band', 'stacking band ring']),
    (r'\b(necklace|pendant)\b', ['gold pendant necklace chain', 'layered chain necklace']),
    (r'\b(bracelet|bangle)\b', ['chain bracelet 14k gold', 'cuff bangle bracelet']),
    (r'\b(earrings|hoops)\b', ['gold hoop earrings chunky', 'huggie earrings stud']),
    (r'\b(sunglasses)\b', ['polarized sunglasses uv400', 'retro sunglasses classic']),
    (r'\b(reading glasses)\b', ['blue light blocking reading glasses', 'reading glasses set']),
    (r'\b(crewneck tee|t-shirt)\b', ['crewneck cotton t-shirt', 'heavyweight plain t-shirt']),
    (r'\b(pullover hoodie)\b', ['pullover fleece hoodie sweatshirt', 'hooded sweatshirt men']),
    (r'\b(cardigan sweater|sweater)\b', ['knit cardigan sweater button', 'ribbed pullover sweater']),
    (r'\b(bomber jacket|jacket)\b', ['classic bomber jacket outerwear', 'casual zip jacket outerwear']),
    (r'\b(casual trousers|chinos?)\b', ['slim fit chino pants casual', 'stretch trousers pants']),
    (r'\b(selvedge denim|jeans)\b', ['straight leg denim jeans', 'classic selvedge jeans']),
    (r'\b(winter beanie|beanie)\b', ['ribbed knit winter beanie hat', 'cuffed beanie warm']),
    (r'\b(baseball cap|cap)\b', ['washed cotton baseball cap', 'classic dad hat cap']),
    (r'\b(straw fedora|sun hat|fedora)\b', ['straw panama fedora hat', 'wide brim sun hat straw']),

    # Personal Care & Beauty
    (r'\b(hyaluronic acid serum)\b', ['hyaluronic acid serum hydrating', 'hyaluronic face serum']),
    (r'\b(vitamin c.*serum)\b', ['vitamin c facial serum brightening', 'vitamin c serum face']),
    (r'\b(botanical retinol|bakuchiol)\b', ['bakuchiol serum retinol alternative', 'plant retinol serum']),
    (r'\b(salicylic acid.*liquid|exfoliating liquid)\b', ['salicylic acid 2 bha liquid exfoliant', 'bha salicylic acid liquid']),
    (r'\b(green tea.*cleanser|face cleanser)\b', ['foaming facial cleanser wash', 'green tea face cleanser']),
    (r'\b(ceramide moisturizing cream|face cream)\b', ['ceramide moisturizing cream face', 'barrier repair face cream']),
    (r'\b(mineral sunscreen|sunscreen spf)\b', ['mineral sunscreen spf 50 face', 'zinc oxide sunscreen lotion']),
    (r'\b(clarifying toner|facial toner)\b', ['facial toner pore refining', 'niacinamide facial toner']),
    (r'\b(sleeping mask|overnight mask)\b', ['overnight sleeping mask face', 'hydrating sleep mask gel']),
    (r'\b(argan oil.*shampoo|shampoo)\b', ['argan oil shampoo sulfate free', 'moisturizing shampoo hair']),
    (r'\b(biotin.*conditioner|conditioner)\b', ['biotin volumizing hair conditioner', 'nourishing hair conditioner']),
    (r'\b(hair mask|macadamia hair mask)\b', ['deep conditioning hair mask treatment', 'hair repair mask']),
    (r'\b(rosemary.*scalp.*oil|scalp treatment oil)\b', ['rosemary scalp and hair strengthening oil', 'rosemary hair oil']),
    (r'\b(hair straightener|flat iron)\b', ['ceramic flat iron hair straightener', 'hair straightener']),
    (r'\b(hair dryer|blow dryer)\b', ['ionic blow dryer hair', 'professional ceramic hair dryer']),
    (r'\b(boar bristle.*brush|hair brush)\b', ['boar bristle hair brush detangling', 'wooden hair brush natural']),
    (r'\b(scalp massager)\b', ['silicone scalp massager shampoo brush', 'scalp massager brush']),
    (r'\b(sea salt spray)\b', ['sea salt spray texturizing hair', 'sea salt hair texturizer']),
    (r'\b(body scrub|pink salt body scrub)\b', ['himalayan pink salt body scrub exfoliating', 'exfoliating body scrub']),
    (r'\b(body cream|shea butter body cream|body lotion)\b', ['shea butter body cream moisturizing', 'hydrating body lotion cream']),
    (r'\b(body wash|shower gel)\b', ['aromatherapy body wash shower gel', 'refreshing body wash']),
    (r'\b(shower steamers)\b', ['aromatherapy shower steamers tablets', 'shower steamers 6 pack']),
    (r'\b(dry body brush)\b', ['dry body brush natural bristles', 'lymphatic drainage dry body brush']),
    (r'\b(bath flakes|bath salts)\b', ['magnesium bath flakes pure', 'dead sea bath salts relaxing']),
    (r'\b(beard trimmer)\b', ['cordless beard trimmer grooming kit', 'mens beard trimmer razor']),
    (r'\b(safety razor)\b', ['double edge safety razor metal', 'classic safety razor shaving']),
    (r'\b(beard oil)\b', ['organic sandalwood beard oil dropper', 'conditioning beard oil']),
    (r'\b(rotary.*shaver|electric.*shaver)\b', ['rotary electric shaver wet dry', 'electric razor for men']),
    (r'\b(shaving brush)\b', ['badger shaving brush synthetic', 'wet shaving brush barber']),
    (r'\b(facial roller|gua sha)\b', ['rose quartz facial roller and gua sha set', 'jade roller gua sha tool']),
    (r'\b(vanity mirror|makeup mirror)\b', ['lighted vanity makeup mirror led', 'rechargeable tabletop makeup mirror']),
    (r'\b(face cleansing brush)\b', ['sonic facial cleansing brush silicone', 'waterproof face cleansing device']),
    (r'\b(makeup brush set|makeup brushes)\b', ['professional makeup brush set 14', 'cosmetic makeup brushes set']),
    (r'\b(eyelash curler)\b', ['eyelash curler with refill pads', 'ergonomic eyelash curler']),
    (r'\b(lip sleeping mask)\b', ['lip sleeping mask hydrating berry', 'overnight lip mask tub']),
    (r'\b(lip balm)\b', ['natural beeswax lip balm sticks', 'moisturizing lip balm pack']),
    (r'\b(eye contour serum|eye patches|eye cream)\b', ['caffeine under eye serum puffiness', 'gold under eye patches hydrogel']),
    (r'\b(manicure.*set|pedicure set)\b', ['stainless steel manicure kit set', 'nail grooming clipper set']),
    (r'\b(nail file)\b', ['crystal glass nail file set', 'precision glass nail file']),
    (r'\b(cuticle.*oil)\b', ['cuticle revitalization oil dropper', 'nourishing cuticle oil pen']),
    (r'\b(electric nail buffer|nail drill)\b', ['electric nail file buffer polisher', 'cordless nail drill buffer']),

    # Travel & Lifestyle
    (r'\b(cabin suitcase|carry-on luggage|spinner cabin suitcase)\b', ['carry on luggage 20 inch spinner', 'hardside spinner luggage 20', 'cabin suitcase spinner']),
    (r'\b(checked.*luggage|medium luggage|medium suitcase)\b', ['checked luggage 24 inch spinner', 'hardside checked suitcase 24', 'expandable luggage spinner']),
    (r'\b(aluminum.*luggage|aluminum.*suitcase)\b', ['aluminum frame luggage carry on', 'all aluminum luggage spinner']),
    (r'\b(spinner trunk|large.*luggage|family trunk)\b', ['28 inch large spinner suitcase', 'hardside trunk luggage 28']),
    (r'\b(underseat.*luggage|flight bag)\b', ['underseat carry on rolling luggage', 'underseat flight bag wheels']),
    (r'\b(rolling duffel)\b', ['rolling duffel bag with wheels', 'wheeled travel duffel bag']),
    (r'\b(hanging toiletry bag|toiletry bag)\b', ['hanging toiletry bag travel organizer', 'toiletry organizer dopp kit']),
    (r'\b(compression packing cubes|packing cubes)\b', ['compression packing cubes travel', 'packing cubes set for luggage']),
    (r'\b(weekender.*duffel|travel duffel)\b', ['canvas travel duffel weekender bag', 'overnight carry on duffel bag']),
    (r'\b(packable backpack)\b', ['packable lightweight travel backpack', 'foldable hiking daypack']),
    (r'\b(passport holder & wallet|passport wallet)\b', ['rfid travel passport wallet holder', 'family passport holder organizer']),
    (r'\b(shoe travel bags|shoe bags)\b', ['shoe travel bags packing organizer', 'portable travel shoe bags']),
    (r'\b(tsa approved.*bottle set|travel bottle set)\b', ['tsa approved travel bottles silicone', 'travel toiletries containers leak proof']),
    (r'\b(travel neck pillow|neck pillow)\b', ['memory foam travel neck pillow airplane', 'ergonomic travel pillow']),
    (r'\b(sleep eye mask|silk sleep.*mask)\b', ['pure silk sleep eye mask contoured', '3d sleeping eye mask blackout']),
    (r'\b(worldwide travel power adapter|travel.*adapter)\b', ['universal travel power adapter all in one', 'worldwide travel plug adapter']),
    (r'\b(travel blanket)\b', ['travel blanket with bag airplane', 'compact travel blanket compact']),
    (r'\b(luggage weight scale|luggage scale)\b', ['digital luggage scale backlit', 'hanging baggage weight scale']),
    (r'\b(luggage locks?|tsa.*lock)\b', ['tsa approved luggage cable locks 2 pack', 'tsa luggage lock']),
    (r'\b(airplane foot rest)\b', ['airplane footrest travel pillow', 'inflatable travel foot rest']),
    (r'\b(backpacking tent|tent)\b', ['backpacking tent 2 person lightweight', 'camping dome tent rainfly']),
    (r'\b(down sleeping bag|sleeping bag)\b', ['camping sleeping bag compact lightweight', 'down sleeping bag 3 season']),
    (r'\b(camping cookware|mess kit)\b', ['camping cookware mess kit pot pan', 'backpacking cooking gear kit']),
    (r'\b(camping hammock|hammock)\b', ['portable camping hammock tree straps', 'double camping parachute hammock']),
    (r'\b(camping stove burner|camp stove)\b', ['portable backpacking gas camp stove', 'mini camping stove burner']),
    (r'\b(multi-tool pliers|pocket multi-tool)\b', ['multitool pliers 14-in-1', 'pocket multitool pliers knife']),
    (r'\b(led headlamp|headlamp)\b', ['rechargeable led headlamp sensor', 'camping headlamp waterproof']),
    (r'\b(picnic cooler tote|cooler bag)\b', ['insulated cooler tote bag 30 can', 'picnic cooler bag leakproof']),
    (r'\b(yoga mat)\b', ['non-slip exercise yoga mat thick', 'natural rubber fitness yoga mat']),
    (r'\b(jump speed rope|speed rope)\b', ['speed jump rope ball bearings', 'adjustable fitness jump rope']),
    (r'\b(foam roller)\b', ['high density muscle foam roller', 'deep tissue recovery foam roller']),
    (r'\b(massage gun)\b', ['deep tissue percussion massage gun', 'muscle therapy massage gun']),
    (r'\b(gym towels?)\b', ['microfiber fast dry gym towels 3 pack', 'sweat workout towel gym']),
    (r'\b(resistance loop bands|resistance bands?)\b', ['resistance loop bands exercise set', 'workout booty bands 5 pack']),
    (r'\b(shaker bottle)\b', ['stainless steel protein shaker bottle', 'blender shaker bottle 28oz']),
    (r'\b(waist pack belt|running belt)\b', ['running waist pack phone holder', 'slim fanny pack running belt']),
    (r'\b(tactical key organizer|key organizer)\b', ['carbon fiber compact key organizer holder', 'pocket key bar organizer']),
    (r'\b(jet flame lighter|torch lighter)\b', ['windproof torch jet flame lighter outdoor', 'refillable butane jet lighter']),
    (r'\b(pry bar|pocket pry bar)\b', ['titanium edc pocket pry bar tool', 'pocket pry bar multitool']),
    (r'\b(pocket edc.*pen|tactical pen)\b', ['bolt action titanium edc pen pocket', 'tactical edc metal ballpoint pen']),
    (r'\b(pill case|pill box)\b', ['waterproof aluminum pill case keychain', 'metal pocket pill box organizer']),
    (r'\b(pocket notebook|memo book)\b', ['weatherproof pocket notebook 3 pack', 'pocket memo book lined']),

    # Gifts & Stationery
    (r'\b(travel journal|leather.*journal)\b', ['refillable leather travel journal notebook', 'vintage leather bound journal']),
    (r'\b(bullet journal|dotted.*journal)\b', ['dotted grid bullet journal hardcover', '160gsm dot grid journal']),
    (r'\b(linen notebook|hardcover notebook)\b', ['linen hardcover notebook journal lined', 'ruled classic notebook']),
    (r'\b(gratitude journal)\b', ['five minute gratitude journal reflection', 'mindfulness daily prompt journal']),
    (r'\b(sketchbook|sketch pad)\b', ['artist hardcover sketchbook spiral', 'drawing sketch pad blank paper']),
    (r'\b(rollerball pen)\b', ['luxury executive rollerball pen brass', 'heavyweight metal rollerball pen']),
    (r'\b(fountain pen)\b', ['fine nib classic fountain pen converter', 'gold nib luxury fountain pen']),
    (r'\b(fineliner drawing pens|precision.*pens)\b', ['fineliner micro drawing pens black', 'precision drawing pens 8 pack']),
    (r'\b(retractable.*pens|gel ink.*pens)\b', ['retractable gel ink pens 0.5mm 6 pack', 'smooth black gel pens']),
    (r'\b(pastel.*highlighters|highlighters)\b', ['pastel aesthetic dual tip highlighters', 'mild color highlighters set']),
    (r'\b(drafting pencil|mechanical pencil)\b', ['metal mechanical drafting pencil 0.5mm', 'professional drafting pencil']),
    (r'\b(desk organizer tray|desktop organizer)\b', ['wooden desktop organizer tray walnut', 'bamboo desk caddy organizer']),
    (r'\b(file document sorter|document sorter)\b', ['metal wire mail file document sorter', 'mesh desk file organizer tray']),
    (r'\b(tape dispenser)\b', ['heavy duty weighted tape dispenser desktop', 'solid brass tape dispenser']),
    (r'\b(stationery.*caddy)\b', ['rotating desktop stationery organizer caddy', 'acrylic pen pencil caddy']),
    (r'\b(wax seal stamp kit|wax seal)\b', ['wax seal stamp kit with melting furnace', 'brass wax stamp set with beads']),
    (r'\b(watercolor paint palette|watercolor set)\b', ['artist watercolor paint pan set 36 colors', 'watercolor paint palette with brush']),
    (r'\b(watercolor paper block|watercolor pad)\b', ['100 cotton watercolor paper cold press', 'watercolor paper block 300gsm']),
    (r'\b(colored pencils)\b', ['soft core colored pencils set 48 tin', 'artist drawing colored pencils']),
    (r'\b(sketching pencils set|drawing pencils)\b', ['graphite drawing sketching pencils set 12', 'art sketch pencils metal tin']),
    (r'\b(art markers set|dual tip markers)\b', ['dual tip alcohol art markers set 48', 'artist brush markers drawing']),
    (r'\b(artist paintbrush set|paint brushes)\b', ['fine detail artist paint brushes 10 pack', 'watercolor oil paint brush set']),
    (r'\b(polymer clay sculpting kit)\b', ['polymer clay starter kit with tools', 'modeling clay sculpting set 50']),
    (r'\b(wall pegboard|craft board)\b', ['modular wall pegboard craft organizer kit', 'white pegboard wall panels']),
    (r'\b(journal & pen gift box|journal gift set)\b', ['leather journal and pen gift set box', 'executive notebook gift box']),
    (r'\b(tea & infuser keepsake set|tea gift set)\b', ['loose leaf organic tea sampler gift box', 'artisan loose tea gift set']),
    (r'\b(candle & matches gift set)\b', ['luxury scented soy candle and matches gift set', 'aromatherapy candle gift box']),
    (r'\b(keepsake memory box|memory box)\b', ['handcrafted wooden keepsake memory box', 'decorative wood storage box with latch']),
    (r'\b(botanical greeting cards|greeting cards)\b', ['botanical floral blank greeting cards 12 pack', 'assorted blank note cards with envelopes']),
    (r'\b(wrapping paper sheets|gift wrap)\b', ['luxury gift wrapping paper flat sheets', 'recycled kraft wrapping paper sheets']),
    (r'\b(velvet ribbon spool|ribbon)\b', ['vintage silk velvet ribbon spool 3 rolls', 'velvet gift wrapping ribbon']),
    (r'\b(gift tags with jute twine|gift tags)\b', ['kraft paper gift tags with natural jute twine', 'blank holiday gift tags 100 pack'])
]

def find_keywords_for_prod(p):
    name_clean = p['name'].lower()
    for pat, kws in STRICT_NOUN_RULES:
        if re.search(pat, name_clean):
            return kws, pat
    # Fallback to subcategory
    return [p['subcategory'].lower()], p['subcategory']

def run_master_harvest():
    print("===================================================================")
    print("DAILYNEST MASTER PRODUCT-IMAGE HARVESTER (STRICT TARGETED MATCHING)")
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

        print(f"\n>>> Processing Category File: {filename} ({len(products)} products)...", flush=True)

        unmatched = []
        for p in products:
            kws, pat = find_keywords_for_prod(p)
            unmatched.append({
                'prod': p,
                'kws': kws,
                'pat': pat
            })

        matched_dict = {}

        for source in sources:
            url = BASE_HF_URL + source
            print(f"  Streaming {source} from Hugging Face...", flush=True)
            req = urllib.request.Request(url, headers={'User-Agent': 'DailyNest/1.0'})

            try:
                with urllib.request.urlopen(req, timeout=45) as resp:
                    lines_scanned = 0
                    while unmatched and lines_scanned < 95000:
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
                            kws = cand['kws']
                            if any(kw in item_title_lower for kw in kws):
                                if not is_clean_item(item_title, kws[0]):
                                    continue

                                p = cand['prod']
                                unmatched.pop(idx)
                                global_used_primary.add(primary_img)
                                matched_dict[p['id']] = [primary_img, secondary_img]

                                if len(matched_dict) % 25 == 0 or len(matched_dict) == len(products):
                                    print(f"    [{len(matched_dict)}/{len(products)}] \"{p['name'][:35]}\" -> \"{item_title[:35]}\"", flush=True)
                                break

                        if not unmatched:
                            print(f"  All {len(products)} products matched in {filename}!", flush=True)
                            break
            except Exception as e:
                print(f"  Warning streaming {source}: {e}", flush=True)

            if not unmatched:
                break

        # If any remain, match from the exact product type pool (borrowing unique extra images of same type)
        if unmatched:
            print(f"  Resolving {len(unmatched)} remaining items in {filename} via exact product type image pool...", flush=True)
            for cand in list(unmatched):
                p = cand['prod']
                kws = cand['kws']
                # Search other products with the same exact keywords
                for other_p in products:
                    other_kws, _ = find_keywords_for_prod(other_p)
                    if other_p['id'] in matched_dict and other_kws == kws:
                        other_imgs = matched_dict[other_p['id']]
                        for cand_img in other_imgs[1:]:
                            if cand_img not in global_used_primary:
                                global_used_primary.add(cand_img)
                                matched_dict[p['id']] = [cand_img, other_imgs[0]]
                                unmatched.remove(cand)
                                break
                    if cand not in unmatched:
                        break

        print(f"  Final matched for {filename}: {len(matched_dict)} / {len(products)}", flush=True)
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
