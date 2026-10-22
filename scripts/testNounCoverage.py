import json, glob, re

# Comprehensive noun dictionary mapping regex patterns to clean search phrases
NOUN_PATTERNS = [
    # Electronics & Audio
    (r'\bearbuds\b', 'earbuds'),
    (r'\bheadphones?\b', 'headphones'),
    (r'\bearphones?\b', 'earphones'),
    (r'\bheadset\b', 'headset'),
    (r'\bspeakers?\b', 'speaker'),
    (r'\bamplifier\b|\bdac\b', 'headphone amplifier'),
    (r'\bpower bank\b', 'power bank'),
    (r'\bcharger\b|\bcharging\b', 'charger'),
    (r'\bcable\b', 'cable'),
    (r'\bkeyboard\b', 'keyboard'),
    (r'\bmouse\b', 'computer mouse'),
    (r'\blaptop stand\b|\briser\b', 'laptop stand'),
    (r'\blight bar\b|\bscreenbar\b', 'monitor light bar'),
    (r'\bhub\b|\bdocking station\b', 'usb hub'),
    (r'\bdesk mat\b|\bmouse pad\b', 'desk mat mouse pad'),
    (r'\bwrist rest\b', 'wrist rest keyboard'),
    (r'\bmonitor\b|\bscreen\b', 'portable monitor'),
    (r'\bsmartwatch\b|\bfitness tracker\b|\bsmart band\b', 'smartwatch'),
    (r'\bsmart glasses\b|\baudio glasses\b', 'smart glasses audio'),
    (r'\bhealth ring\b', 'smart ring tracker'),
    (r'\bluggage tracker\b|\bbluetooth tag\b|\bairtag\b', 'bluetooth tracker tag'),
    (r'\bvoice recorder\b', 'digital voice recorder'),
    (r'\bbike helmet\b', 'smart bike helmet'),
    (r'\bwebcam\b', 'webcam'),
    (r'\bmicrophone\b|\bmic\b', 'microphone'),
    (r'\bring light\b', 'ring light tripod'),
    (r'\bgimbal\b|\bstabilizer\b', 'smartphone gimbal stabilizer'),
    (r'\bbackdrop\b|\bgreen screen\b', 'green screen studio backdrop'),
    (r'\bsd card\b|\bmemory card\b', 'sd card memory'),
    (r'\bsmart plug\b|\bsmart outlet\b', 'smart plug outlet'),
    (r'\bsmart bulb\b|\blight bulb\b', 'smart led light bulb'),
    (r'\bsecurity camera\b|\bindoor camera\b', 'security camera'),
    (r'\bdoorbell\b', 'video doorbell'),
    (r'\bphone case\b', 'phone case'),
    (r'\btablet stand\b|\bipad stand\b|\bphone stand\b', 'tablet stand holder'),
    (r'\bscreen protector\b', 'screen protector'),
    (r'\bssd\b|\bhard drive\b|\bflash drive\b', 'external ssd drive'),

    # Kitchen & Dining
    (r'\bdutch oven\b', 'dutch oven pot'),
    (r'\bskillet\b|\bfrying pan\b|\bpan\b', 'frying pan skillet'),
    (r'\bchef knife\b|\bsantoku knife\b|\bbread knife\b|\bknife\b|\bcutlery\b', 'kitchen chef knife'),
    (r'\bair fryer\b', 'air fryer countertop'),
    (r'\bkettle\b', 'electric gooseneck kettle'),
    (r'\bblender\b', 'countertop blender kitchen'),
    (r'\bcarafe\b|\bpour-over\b|\bcoffee maker\b', 'pour over coffee maker glass carafe'),
    (r'\bcoffee grinder\b|\bgrinder\b', 'electric coffee grinder burr'),
    (r'\bfrench press\b', 'french press coffee maker'),
    (r'\bdinner plates?\b|\bplates?\b', 'dinner plates ceramic set'),
    (r'\bpasta bowls?\b|\bbowls?\b', 'pasta bowls ceramic set'),
    (r'\bflatware\b|\bsilverware\b', 'flatware silverware cutlery set'),
    (r'\btumbler\b|\bwater bottle\b|\bflask\b', 'insulated water bottle tumbler'),
    (r'\bcoffee mug\b|\bmug\b|\bcup\b', 'ceramic coffee mug'),
    (r'\bfood storage\b|\bcontainers?\b', 'glass food storage containers'),
    (r'\bdispensers?\b', 'food dispenser cereal'),
    (r'\blunch box\b|\bbento\b', 'bento lunch box stainless steel'),
    (r'\bmuffin tin\b|\bmuffin pan\b|\bbaking tin\b', 'muffin tin baking pan'),
    (r'\bbaking mat\b', 'silicone baking mat pastry'),
    (r'\bmeasuring cups?\b|\bmeasuring spoons?\b', 'stainless steel measuring cups spoons'),

    # Home & Living
    (r'\boffice chair\b|\baccent chair\b|\blounge chair\b|\bdining chair\b|\bchair\b|\barmchair\b', 'chair'),
    (r'\bcoffee table\b|\bstanding desk\b|\bside table\b|\btable\b|\bdesk\b|\bnightstand\b', 'table desk'),
    (r'\bsofa\b|\bcouch\b|\bfuton\b', 'living room sofa couch'),
    (r'\bbed frame\b|\bplatform bed\b|\bbed\b', 'bed frame wooden platform'),
    (r'\bfloor lamp\b|\btable lamp\b|\bdesk lamp\b|\blamp\b', 'lamp lighting'),
    (r'\bduvet\b|\bbedding\b|\bcomforter\b|\bquilt\b', 'linen duvet cover bedding set'),
    (r'\bpillow\b', 'bed pillow pair'),
    (r'\bsheets?\b|\bbed sheets?\b', 'cotton bed sheets set'),
    (r'\brug\b|\bcarpet\b|\brunner\b|\bmat\b', 'area rug carpet'),
    (r'\bshoe rack\b', 'bamboo shoe rack organizer'),
    (r'\bbaskets?\b|\borganizer bins?\b', 'woven storage basket organizer'),
    (r'\bmirror\b', 'wall mirror decorative'),
    (r'\bvase\b', 'ceramic vase modern decor'),
    (r'\bwall clock\b|\bclock\b', 'modern minimalist wall clock'),
    (r'\bcandle\b', 'scented soy candle amber jar'),
    (r'\bdiffuser\b', 'ultrasonic essential oil diffuser'),
    (r'\bplanter\b|\bpot\b|\bplant pot\b', 'ceramic indoor plant pot planter'),
    (r'\bdustbin\b|\btrash can\b', 'motion sensor touchless dustbin trash can'),
    (r'\bbath mat\b', 'stone diatomite bath mat'),
    (r'\bsoap dispenser\b', 'bathroom soap dispenser set'),

    # Fashion & Accessories
    (r'\brunning shoes?\b|\bsneakers?\b|\bshoes?\b|\bfootwear\b', 'sneakers running shoes'),
    (r'\bboots?\b', 'ankle boots leather suede'),
    (r'\bsandals?\b', 'cork footbed buckle sandals'),
    (r'\bbackpack\b', 'leather laptop backpack'),
    (r'\btote bag\b|\bbag\b|\bhandbag\b', 'tote bag canvas leather'),
    (r'\bduffel bag\b|\bweekender\b', 'travel duffel bag weekender'),
    (r'\bwallet\b|\bcardholder\b', 'leather bifold wallet cardholder'),
    (r'\bbelt\b', 'leather dress belt buckle'),
    (r'\bwatch\b', 'minimalist analog wristwatch'),
    (r'\bring\b', 'gold dome ring jewelry'),
    (r'\bnecklace\b|\bpendant\b', 'pendant necklace gold jewelry'),
    (r'\bbracelet\b|\bbangle\b', 'chain bracelet gold jewelry'),
    (r'\bearrings?\b', 'hoop earrings gold jewelry'),
    (r'\bsunglasses\b|\bshades\b', 'polarized sunglasses eyewear'),
    (r'\bt-shirt\b|\btee\b|\bshirt\b', 'crewneck t-shirt cotton'),
    (r'\bhoodie\b|\bsweatshirt\b', 'pullover hoodie sweatshirt fleece'),
    (r'\bjacket\b|\bcoat\b', 'bomber jacket outerwear coat'),
    (r'\bbeanie\b', 'ribbed knit beanie winter hat'),
    (r'\bbaseball cap\b|\bcap\b|\bhat\b', 'baseball cap cotton hat'),

    # Personal Care & Beauty
    (r'\bserum\b', 'facial serum dropper skincare'),
    (r'\bcleanser\b|\bface wash\b', 'foaming face cleanser wash skincare'),
    (r'\bmoisturizing cream\b|\bcream\b|\bmoisturizer\b', 'facial moisturizing cream jar'),
    (r'\bsunscreen\b|\bspf\b', 'mineral sunscreen spf lotion'),
    (r'\bshampoo\b', 'nourishing shampoo bottle haircare'),
    (r'\bhair mask\b|\bconditioner\b', 'hair mask deep conditioning tub'),
    (r'\bscalp oil\b|\bhair oil\b', 'hair scalp treatment oil dropper'),
    (r'\bbody scrub\b|\bscrub\b', 'exfoliating body scrub pink salt'),
    (r'\bbody cream\b|\bbody lotion\b|\blotion\b', 'body lotion cream pump bottle'),
    (r'\bbody wash\b|\bshower gel\b', 'aromatherapy body wash gel bottle'),
    (r'\bbeard trimmer\b|\btrimmer\b|\bgroomer\b', 'cordless beard trimmer hair clipper'),
    (r'\bsafety razor\b|\brazor\b', 'double edge safety razor shaving'),
    (r'\bbeard oil\b', 'nourishing beard oil dropper bottle'),
    (r'\bfacial roller\b|\bgua sha\b', 'rose quartz facial roller gua sha set'),
    (r'\bvanity mirror\b|\bmakeup mirror\b', 'led vanity mirror lighted makeup'),
    (r'\bface cleansing brush\b|\bcleansing brush\b', 'silicone facial cleansing brush vibrating'),
    (r'\blip sleeping mask\b|\blip mask\b|\blip balm\b', 'lip balm sleeping mask tub'),
    (r'\beye serum\b|\beye cream\b', 'eye contour serum anti puffiness'),
    (r'\bmanicure\b|\bpedicure\b', 'stainless steel manicure pedicure kit set'),
    (r'\bnail file\b', 'glass nail file manicure'),
    (r'\bcuticle oil\b', 'cuticle conditioning oil pen nourishing'),

    # Travel & Lifestyle
    (r'\bsuitcase\b|\bluggage\b|\bcarry-on\b', 'hardshell spinner cabin suitcase luggage'),
    (r'\btoiletry bag\b|\bwash bag\b', 'hanging toiletry bag travel organizer'),
    (r'\bpacking cubes\b', 'compression packing cubes travel organizer'),
    (r'\btravel pillow\b|\bneck pillow\b', 'memory foam travel neck pillow'),
    (r'\beye mask\b|\bsleep mask\b', 'silk sleep eye mask contoured'),
    (r'\btravel adapter\b|\bpower adapter\b', 'universal travel power adapter worldwide'),
    (r'\btent\b', 'backpacking camping tent 2 person'),
    (r'\bsleeping bag\b', 'compact camping sleeping bag outdoor'),
    (r'\bmess kit\b|\bcamping cookware\b', 'titanium camping cookware mess kit pot'),
    (r'\byoga mat\b', 'natural rubber yoga mat exercise'),
    (r'\bspeed rope\b|\bjump rope\b', 'jump speed rope fitness workout'),
    (r'\bfoam roller\b', 'high density foam roller muscle recovery'),
    (r'\bkey organizer\b', 'tactical compact key organizer carbon fiber'),
    (r'\bedc pen\b|\bpocket pen\b', 'titanium pocket edc ballpoint pen'),
    (r'\bpill case\b', 'waterproof aluminum pill case keychain container'),

    # Gifts & Stationery
    (r'\bjournal\b|\bnotebook\b|\bplanner\b|\bdated\b', 'leather notebook journal ruled paper'),
    (r'\bsketchbook\b', 'spiral bound artist sketchbook blank paper'),
    (r'\brollerball pen\b|\bpen\b|\bfountain pen\b', 'metal rollerball fountain pen executive'),
    (r'\bdrawing pens\b|\bfineliner\b', 'fineliner drawing pens set black ink'),
    (r'\bdesk organizer\b|\borganizer tray\b|\bcaddy\b', 'desk organizer tray wooden office'),
    (r'\bdocument sorter\b|\bfile sorter\b', 'mesh wire file document sorter desk'),
    (r'\btape dispenser\b', 'heavy duty desktop tape dispenser brass'),
    (r'\bwatercolor\b|\bpaint palette\b', 'watercolor paint palette pan set 36 colors'),
    (r'\bwatercolor paper\b', 'cotton watercolor paper block pad cold press'),
    (r'\bcolored pencils\b', 'colored pencils artist tin set 48 colors'),
    (r'\bgift box\b|\bgift set\b', 'curated executive gift box set luxury'),
    (r'\bgreeting cards\b|\bcards\b', 'botanical letterpress greeting cards pack'),
    (r'\bwrapping paper\b', 'recycled cotton wrapping paper sheets kraft'),
    (r'\bgift tags\b', 'kraft paper gift tags with twine')
]

def find_target_noun(product_name):
    p_lower = product_name.lower()
    for pattern, phrase in NOUN_PATTERNS:
        if re.search(pattern, p_lower):
            return phrase
    return None

all_products = []
for f in sorted(glob.glob('src/data/products/*.ts')):
    if 'index.ts' in f: continue
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    prods = json.loads(c[c.index('= [') + 2 : c.rindex(';')])
    all_products.extend(prods)

matched_count = 0
unmatched = []
for p in all_products:
    n = find_target_noun(p['name'])
    if n:
        matched_count += 1
    else:
        unmatched.append(p)

print(f"Total Products: {len(all_products)}")
print(f"Matched Nouns: {matched_count} ({matched_count / len(all_products) * 100:.1f}%)")
print(f"Unmatched: {len(unmatched)}")
if unmatched:
    print("\nSample unmatched:")
    for u in unmatched[:10]:
        print(f"  - {u['name']} [{u['subcategory']}] ({u['category']})")
