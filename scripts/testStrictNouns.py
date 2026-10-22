import json, glob, re

# Ordered list of (pattern, required_word_in_amazon_title)
STRICT_NOUN_RULES = [
    # Audio
    (r'\b(earbuds|in-ear)\b', ['earbud']),
    (r'\b(headphones?|over-ear|on-ear)\b', ['headphone']),
    (r'\b(earphones?|neckband|bone conduction)\b', ['earphone', 'headphone']),
    (r'\b(headset)\b', ['headset', 'headphone']),
    (r'\b(amplifier|dac)\b', ['amplifier', 'dac', 'amp']),
    (r'\b(speaker|soundbar)\b', ['speaker']),

    # Power
    (r'\b(power bank)\b', ['power bank', 'portable charger', 'battery pack']),
    (r'\b(wireless charger|charging station|charging pad)\b', ['wireless charger', 'charging station', 'charging pad']),
    (r'\b(car charger)\b', ['car charger']),
    (r'\b(wall charger|gan charger|fast charger|usb charger)\b', ['wall charger', 'fast charger', 'charger', 'power adapter']),
    (r'\b(cable|cord)\b', ['cable', 'cord']),
    (r'\b(surge protector|power strip)\b', ['surge protector', 'power strip']),

    # Computer & Desk
    (r'\b(keyboard)\b', ['keyboard']),
    (r'\b(mouse)\b', ['mouse']),
    (r'\b(laptop stand|monitor stand|riser)\b', ['laptop stand', 'monitor stand', 'stand']),
    (r'\b(light bar|screenbar)\b', ['light bar', 'screenbar', 'desk lamp']),
    (r'\b(hub|docking station)\b', ['hub', 'dock']),
    (r'\b(desk mat|mouse pad|blotter)\b', ['desk mat', 'mouse pad', 'desk pad']),
    (r'\b(wrist rest)\b', ['wrist rest']),
    (r'\b(monitor|screen)\b', ['monitor', 'screen']),
    (r'\b(privacy screen|privacy filter)\b', ['privacy screen', 'privacy filter']),

    # Wearables & Cameras & Smart Home
    (r'\b(smartwatch|smart watch|fitness tracker|smart band)\b', ['smartwatch', 'smart watch', 'fitness tracker']),
    (r'\b(smart glasses|audio glasses)\b', ['smart glasses', 'audio glasses', 'bluetooth sunglasses']),
    (r'\b(health ring|smart ring)\b', ['smart ring', 'health ring']),
    (r'\b(tracker|airtag|tag)\b', ['airtag', 'tracker', 'key finder']),
    (r'\b(voice recorder)\b', ['voice recorder', 'audio recorder']),
    (r'\b(helmet)\b', ['helmet']),
    (r'\b(thermos bottle)\b', ['thermos', 'water bottle']),
    (r'\b(webcam)\b', ['webcam', 'camera']),
    (r'\b(microphone|mic)\b', ['microphone', 'mic']),
    (r'\b(ring light)\b', ['ring light']),
    (r'\b(gimbal|stabilizer)\b', ['gimbal', 'stabilizer']),
    (r'\b(green screen|backdrop)\b', ['backdrop', 'green screen']),
    (r'\b(camera mount|arm clamp|tripod)\b', ['tripod', 'mount', 'clamp']),
    (r'\b(sd card|memory card|microsd)\b', ['sd card', 'memory card', 'microsd']),
    (r'\b(smart plug|smart outlet)\b', ['smart plug', 'smart outlet']),
    (r'\b(smart bulb|light bulb)\b', ['smart bulb', 'light bulb', 'led bulb']),
    (r'\b(security camera|indoor camera)\b', ['security camera', 'camera']),
    (r'\b(doorbell)\b', ['doorbell']),
    (r'\b(door lock|smart lock)\b', ['door lock', 'smart lock']),
    (r'\b(light strips?|led strip)\b', ['light strip', 'led strip']),
    (r'\b(humidifier)\b', ['humidifier']),
    (r'\b(phone case)\b', ['phone case', 'case']),
    (r'\b(tablet stand|ipad stand|phone stand)\b', ['tablet stand', 'phone stand', 'stand']),
    (r'\b(screen protector)\b', ['screen protector']),
    (r'\b(car phone mount|phone mount)\b', ['car mount', 'phone mount', 'car phone holder']),
    (r'\b(ring grip|phone ring)\b', ['ring holder', 'phone grip', 'ring grip']),
    (r'\b(ssd|hard drive)\b', ['ssd', 'solid state drive', 'hard drive']),
    (r'\b(flash drive|thumb drive)\b', ['flash drive', 'thumb drive']),
    (r'\b(organizer case|cable organizer|organizer box)\b', ['cable organizer', 'organizer case', 'electronics organizer', 'cable management box']),
    (r'\b(presenter|clicker)\b', ['wireless presenter', 'presentation clicker']),

    # Kitchen & Dining
    (r'\b(dutch oven)\b', ['dutch oven']),
    (r'\b(skillet|frying pan|saute pan|wok|pan)\b', ['pan', 'skillet', 'wok']),
    (r'\b(pot|saucepan|stockpot)\b', ['pot', 'saucepan', 'stockpot']),
    (r'\b(chef knife|santoku knife|bread knife|knife|cutlery|cleaver)\b', ['knife', 'cutlery']),
    (r'\b(air fryer)\b', ['air fryer']),
    (r'\b(kettle)\b', ['kettle']),
    (r'\b(blender)\b', ['blender']),
    (r'\b(toaster)\b', ['toaster']),
    (r'\b(food processor|stand mixer|mixer)\b', ['food processor', 'mixer']),
    (r'\b(waffle maker)\b', ['waffle maker']),
    (r'\b(pour-over|pour over|carafe|coffee maker|espresso|cold brew)\b', ['coffee maker', 'pour over', 'espresso', 'carafe', 'cold brew']),
    (r'\b(coffee grinder|grinder)\b', ['coffee grinder', 'grinder']),
    (r'\b(french press)\b', ['french press']),
    (r'\b(teapot)\b', ['teapot']),
    (r'\b(dinner plates?|plates?)\b', ['plate', 'dinnerware']),
    (r'\b(pasta bowls?|bowls?)\b', ['bowl']),
    (r'\b(flatware|silverware)\b', ['flatware', 'silverware', 'cutlery set']),
    (r'\b(tumbler)\b', ['tumbler']),
    (r'\b(water bottle|bottle|flask)\b', ['water bottle', 'bottle']),
    (r'\b(coffee mug|mug|cup)\b', ['mug', 'cup']),
    (r'\b(food storage|containers?)\b', ['food storage', 'container']),
    (r'\b(cereal dispenser|dispensers?)\b', ['dispenser']),
    (r'\b(lunch box|bento)\b', ['lunch box', 'bento']),
    (r'\b(jars?)\b', ['jar', 'canister']),
    (r'\b(muffin tin|muffin pan|baking pan|baking sheet|cake pan)\b', ['baking pan', 'muffin tin', 'baking sheet', 'cake pan']),
    (r'\b(baking mat)\b', ['baking mat']),
    (r'\b(measuring cups?|measuring spoons?)\b', ['measuring cup', 'measuring spoon']),
    (r'\b(mixing bowls?)\b', ['mixing bowl']),
    (r'\b(rolling pin)\b', ['rolling pin']),

    # Home & Living
    (r'\b(office chair|desk chair)\b', ['office chair', 'desk chair']),
    (r'\b(accent chair|lounge chair|armchair|reading chair)\b', ['accent chair', 'lounge chair', 'armchair']),
    (r'\b(dining chair)\b', ['dining chair', 'chair']),
    (r'\b(chair|stool|bench)\b', ['chair', 'stool', 'bench']),
    (r'\b(coffee table)\b', ['coffee table']),
    (r'\b(standing desk|desk)\b', ['desk', 'standing desk']),
    (r'\b(side table|end table|nightstand)\b', ['side table', 'end table', 'nightstand']),
    (r'\b(dining table|table)\b', ['table', 'dining table']),
    (r'\b(sofa|couch|loveseat|sectional)\b', ['sofa', 'couch', 'loveseat']),
    (r'\b(futon|sofa bed)\b', ['futon', 'sofa bed']),
    (r'\b(bed frame|platform bed|bed)\b', ['bed frame', 'platform bed', 'bed']),
    (r'\b(floor lamp)\b', ['floor lamp']),
    (r'\b(table lamp|bedside lamp)\b', ['table lamp', 'bedside lamp', 'lamp']),
    (r'\b(desk lamp)\b', ['desk lamp']),
    (r'\b(pendant light|ceiling light|chandelier)\b', ['pendant light', 'ceiling light', 'chandelier']),
    (r'\b(lamp|lighting)\b', ['lamp', 'lighting']),
    (r'\b(duvet|comforter|quilt|bedding)\b', ['duvet', 'comforter', 'bedding']),
    (r'\b(pillow)\b', ['pillow']),
    (r'\b(sheets?|bed sheets?)\b', ['bed sheet', 'sheet set', 'sheets']),
    (r'\b(blanket|throw)\b', ['blanket', 'throw']),
    (r'\b(rug|carpet|runner|mat)\b', ['rug', 'carpet', 'runner']),
    (r'\b(shoe rack)\b', ['shoe rack', 'shoe organizer']),
    (r'\b(basket|storage basket)\b', ['basket', 'storage basket']),
    (r'\b(shelf|shelves|shelving)\b', ['shelf', 'shelving', 'rack']),
    (r'\b(bins?|wardrobe organizer)\b', ['organizer bin', 'storage box', 'bins']),
    (r'\b(mirror)\b', ['mirror']),
    (r'\b(vase)\b', ['vase']),
    (r'\b(wall clock|clock)\b', ['clock', 'wall clock']),
    (r'\b(sculpture|figurine)\b', ['sculpture', 'decor', 'statue']),
    (r'\b(frame|picture frame)\b', ['frame', 'picture frame']),
    (r'\b(candle)\b', ['candle', 'scented candle']),
    (r'\b(diffuser)\b', ['diffuser', 'oil diffuser']),
    (r'\b(incense)\b', ['incense']),
    (r'\b(planter|plant pot|flower pot|pot)\b', ['planter', 'plant pot', 'flower pot']),
    (r'\b(plant hanger|plant stand)\b', ['plant stand', 'plant hanger']),
    (r'\b(dustbin|trash can)\b', ['trash can', 'garbage can', 'dustbin']),
    (r'\b(bath mat)\b', ['bath mat']),
    (r'\b(soap dispenser)\b', ['soap dispenser']),
    (r'\b(towel|towel hooks?)\b', ['towel', 'towel hook']),

    # Fashion & Accessories
    (r'\b(running shoes?|sneakers?)\b', ['sneakers', 'running shoes', 'shoes']),
    (r'\b(boots?|ankle boots)\b', ['boots', 'ankle boots']),
    (r'\b(sandals?|slides?)\b', ['sandals', 'slides']),
    (r'\b(shoes?|derby shoes?|loafers?|oxfords?)\b', ['shoes', 'loafers', 'derby shoes']),
    (r'\b(backpack)\b', ['backpack']),
    (r'\b(tote bag|tote)\b', ['tote bag', 'tote']),
    (r'\b(duffel bag|duffle|weekender)\b', ['duffel bag', 'weekender bag']),
    (r'\b(crossbody|messenger bag|shoulder bag|bag)\b', ['crossbody bag', 'messenger bag', 'shoulder bag', 'bag']),
    (r'\b(wallet|bifold)\b', ['wallet']),
    (r'\b(cardholder|card case)\b', ['card holder', 'cardholder', 'wallet']),
    (r'\b(belt)\b', ['belt']),
    (r'\b(watch|wristwatch)\b', ['watch', 'wristwatch']),
    (r'\b(ring)\b', ['ring']),
    (r'\b(necklace|pendant)\b', ['necklace', 'pendant']),
    (r'\b(bracelet|bangle)\b', ['bracelet', 'bangle']),
    (r'\b(earrings?)\b', ['earrings', 'earring']),
    (r'\b(sunglasses|shades)\b', ['sunglasses', 'shades']),
    (r'\b(t-shirt|tee|shirt)\b', ['t-shirt', 'shirt', 'tee']),
    (r'\b(hoodie|sweatshirt|pullover)\b', ['hoodie', 'sweatshirt']),
    (r'\b(jacket|coat|bomber)\b', ['jacket', 'coat']),
    (r'\b(beanie)\b', ['beanie']),
    (r'\b(baseball cap|cap|hat|fedora)\b', ['cap', 'hat', 'baseball cap']),
    (r'\b(scarf)\b', ['scarf']),
    (r'\b(gloves)\b', ['gloves']),

    # Personal Care & Beauty
    (r'\b(serum)\b', ['serum']),
    (r'\b(cleanser|face wash)\b', ['cleanser', 'face wash']),
    (r'\b(face cream|moisturizing cream|moisturizer|cream)\b', ['cream', 'moisturizer']),
    (r'\b(sunscreen|spf)\b', ['sunscreen', 'sunblock']),
    (r'\b(toner)\b', ['toner']),
    (r'\b(shampoo)\b', ['shampoo']),
    (r'\b(conditioner|hair mask)\b', ['conditioner', 'hair mask']),
    (r'\b(scalp oil|hair oil)\b', ['hair oil', 'scalp oil']),
    (r'\b(hair dryer|blow dryer)\b', ['hair dryer', 'blow dryer']),
    (r'\b(body scrub|scrub)\b', ['body scrub', 'scrub']),
    (r'\b(body cream|body lotion|lotion)\b', ['body lotion', 'body cream', 'lotion']),
    (r'\b(body wash|shower gel)\b', ['body wash', 'shower gel']),
    (r'\b(bath salts|soap)\b', ['bath salts', 'soap']),
    (r'\b(beard trimmer|hair trimmer|trimmer|clipper)\b', ['beard trimmer', 'hair trimmer', 'trimmer']),
    (r'\b(safety razor|razor)\b', ['safety razor', 'razor', 'shaving razor']),
    (r'\b(beard oil)\b', ['beard oil']),
    (r'\b(shaving brush)\b', ['shaving brush']),
    (r'\b(facial roller|gua sha)\b', ['facial roller', 'gua sha', 'jade roller']),
    (r'\b(vanity mirror|makeup mirror)\b', ['makeup mirror', 'vanity mirror']),
    (r'\b(cleansing brush)\b', ['facial cleansing brush', 'cleansing brush']),
    (r'\b(makeup organizer)\b', ['makeup organizer']),
    (r'\b(lip sleeping mask|lip mask|lip balm)\b', ['lip balm', 'lip mask']),
    (r'\b(eye serum|eye cream)\b', ['eye cream', 'eye serum']),
    (r'\b(manicure|pedicure)\b', ['manicure set', 'pedicure set']),
    (r'\b(nail file)\b', ['nail file']),
    (r'\b(cuticle oil)\b', ['cuticle oil']),

    # Travel & Lifestyle
    (r'\b(suitcase|luggage|carry-on|trunk)\b', ['suitcase', 'luggage', 'carry-on']),
    (r'\b(toiletry bag|wash bag)\b', ['toiletry bag', 'dopp kit']),
    (r'\b(packing cubes)\b', ['packing cubes']),
    (r'\b(neck pillow|travel pillow)\b', ['travel pillow', 'neck pillow']),
    (r'\b(eye mask|sleep mask)\b', ['sleep mask', 'eye mask']),
    (r'\b(travel adapter|plug adapter)\b', ['travel adapter', 'plug adapter']),
    (r'\b(tent)\b', ['tent']),
    (r'\b(sleeping bag)\b', ['sleeping bag']),
    (r'\b(camping cookware|mess kit|camping stove)\b', ['camping cookware', 'mess kit', 'camp stove']),
    (r'\b(yoga mat)\b', ['yoga mat']),
    (r'\b(jump rope|speed rope)\b', ['jump rope', 'speed rope']),
    (r'\b(foam roller)\b', ['foam roller']),
    (r'\b(resistance bands?)\b', ['resistance band', 'exercise band']),
    (r'\b(key organizer)\b', ['key organizer', 'key holder']),
    (r'\b(pocket knife|multitool)\b', ['pocket knife', 'multi tool', 'multitool']),
    (r'\b(edc pen|pocket pen)\b', ['edc pen', 'tactical pen', 'pocket pen']),
    (r'\b(pill case)\b', ['pill case', 'pill box']),
    (r'\b(flashlight|torch)\b', ['flashlight', 'torch']),

    # Gifts & Stationery
    (r'\b(journal|bullet journal|diary)\b', ['journal', 'bullet journal']),
    (r'\b(notebook|notepad)\b', ['notebook', 'notepad']),
    (r'\b(planner)\b', ['planner']),
    (r'\b(sketchbook)\b', ['sketchbook', 'sketch pad']),
    (r'\b(rollerball pen|fountain pen|ballpoint pen|pen)\b', ['pen', 'fountain pen', 'rollerball pen']),
    (r'\b(drawing pens?|fineliner)\b', ['drawing pen', 'fineliner']),
    (r'\b(desk organizer|caddy)\b', ['desk organizer', 'desktop organizer']),
    (r'\b(document sorter|file sorter)\b', ['file sorter', 'document sorter', 'letter tray']),
    (r'\b(tape dispenser)\b', ['tape dispenser']),
    (r'\b(watercolor paint|paint palette|paint)\b', ['watercolor paint', 'paint set', 'palette']),
    (r'\b(watercolor paper)\b', ['watercolor paper', 'paper pad']),
    (r'\b(colored pencils?)\b', ['colored pencils', 'colored pencil']),
    (r'\bgift box\b|\bgift set\b', ['gift box', 'gift set', 'gift basket']),
    (r'\b(greeting cards?|cards?)\b', ['greeting card', 'card set']),
    (r'\b(wrapping paper)\b', ['wrapping paper', 'gift wrap']),
    (r'\b(gift tags?)\b', ['gift tags', 'gift tag'])
]

def get_required_keywords(name):
    clean = name.lower()
    for pat, req_kws in STRICT_NOUN_RULES:
        if re.search(pat, clean):
            return req_kws
    return None

all_products = []
for f in sorted(glob.glob('src/data/products/*.ts')):
    if 'index.ts' in f: continue
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    prods = json.loads(c[c.index('= [') + 2 : c.rindex(';')])
    all_products.extend(prods)

matched = 0
unmatched = []
for p in all_products:
    req = get_required_keywords(p['name'])
    if req:
        matched += 1
    else:
        unmatched.append(p)

print(f"Total Products: {len(all_products)}")
print(f"Strict Noun Rules Matched: {matched} ({matched / len(all_products) * 100:.1f}%)")
print(f"Unmatched: {len(unmatched)}")
if unmatched:
    print("\nSample unmatched:")
    for u in unmatched[:10]:
        print(f"  - {u['name']} [{u['subcategory']}]")
