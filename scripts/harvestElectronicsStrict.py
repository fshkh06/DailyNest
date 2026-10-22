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

RULES = [
    # Headphones & Audio
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

    # Power & Charging
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

    # Computer & Desk Gear
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

    # Wearables & Smart Tech
    (r'Smartwatch with Heart Rate Sensor', lambda t: ('smartwatch' in t or 'smart watch' in t or 'gps smartwatch' in t)),
    (r'Fitness Tracker Band', lambda t: ('fitness tracker' in t or 'fitness band' in t or 'smart band' in t or 'activity tracker' in t)),
    (r'Smart Glasses with Open-Ear Audio', lambda t: ('smart glasses' in t or 'audio glasses' in t or 'bluetooth sunglasses' in t or 'smart audio glasses' in t)),
    (r'Smart Health Ring', lambda t: ('smart ring' in t or 'health ring' in t or 'fitness ring' in t or 'sleep ring' in t)),
    (r'Smart Luggage Tracker GPS', lambda t: ('airtag' in t or 'bluetooth tracker' in t or 'smart tag' in t or 'key finder' in t or 'gps tracker' in t)),
    (r'Digital Voice Recorder Pen', lambda t: ('voice recorder' in t or 'voice activated recorder' in t or 'audio recorder' in t or 'digital recorder' in t)),
    (r'Smart Bike Helmet', lambda t: ('bike helmet' in t or 'bicycle helmet' in t or 'smart helmet' in t)),
    (r'Smart Thermos Bottle', lambda t: ('smart thermos' in t or 'smart water bottle' in t or 'temperature display bottle' in t or 'vacuum insulated bottle' in t)),

    # Camera & Streaming
    (r'Streaming Webcam', lambda t: ('4k webcam' in t or 'streaming webcam' in t or 'hd webcam' in t or 'webcam' in t)),
    (r'USB Condenser Podcast Microphone', lambda t: ('usb microphone' in t or 'condenser microphone' in t or 'podcast microphone' in t or 'streaming microphone' in t)),
    (r'LED Ring Light with Tripod', lambda t: ('ring light' in t or 'led ring light' in t or 'ring light with tripod' in t)),
    (r'Smartphone Gimbal Stabilizer', lambda t: ('smartphone gimbal' in t or '3-axis gimbal' in t or 'phone stabilizer' in t or 'handheld gimbal' in t)),
    (r'Wireless Lavalier Lapel Microphone', lambda t: ('lavalier microphone' in t or 'wireless lavalier' in t or 'lapel mic' in t or 'wireless microphone' in t)),
    (r'Desktop Camera Mount', lambda t: ('camera mount' in t or 'desk mount clamp' in t or 'articulating arm' in t or 'flex arm' in t)),
    (r'Studio Backdrop', lambda t: ('green screen' in t or 'collapsible backdrop' in t or 'chromakey' in t or 'photo backdrop' in t)),
    (r'SD Card High-Speed', lambda t: ('sd card' in t or 'sdxc' in t or 'memory card' in t or '128gb sd' in t)),

    # Smart Home Devices
    (r'Wi-Fi Smart Plug', lambda t: ('smart plug' in t or 'wifi smart plug' in t or 'smart outlet' in t)),
    (r'RGB Smart Bulb', lambda t: ('smart bulb' in t or 'rgb smart bulb' in t or 'smart led bulb' in t or 'wifi light bulb' in t)),
    (r'Security Camera with Night Vision', lambda t: ('security camera' in t or 'indoor security camera' in t or 'wifi camera' in t or 'pet camera' in t)),
    (r'Video Doorbell with Chime', lambda t: ('video doorbell' in t or 'doorbell camera' in t or 'wireless doorbell' in t)),
    (r'Door Lock Keyless Entry', lambda t: ('smart door lock' in t or 'fingerprint door lock' in t or 'keyless entry door lock' in t or 'smart lock' in t)),
    (r'LED Stair Light Strips', lambda t: ('motion sensor light' in t or 'stair lights' in t or 'under cabinet lights' in t or 'led light strip' in t)),
    (r'Smart Essential Oil Humidifier', lambda t: ('ultrasonic humidifier' in t or 'smart humidifier' in t or 'cool mist humidifier' in t or 'oil diffuser' in t)),
    (r'Air Quality Monitor', lambda t: ('air quality monitor' in t or 'humidity sensor' in t or 'co2 monitor' in t or 'temperature humidity' in t)),

    # Phone & Tablet Accessories
    (r'Phone Case', lambda t: ('phone case' in t or 'matte case' in t or 'slim phone case' in t or 'bumper case' in t)),
    (r'Tablet Stand Holder', lambda t: ('tablet stand' in t or 'ipad stand' in t or 'desktop tablet holder' in t)),
    (r'Screen Protector', lambda t: ('screen protector' in t or 'tempered glass' in t)),
    (r'Car Phone Mount', lambda t: ('car phone mount' in t or 'car vent mount' in t or 'air vent phone holder' in t)),
    (r'Ring Grip Phone Holder', lambda t: ('phone ring holder' in t or 'phone grip' in t or 'finger ring stand' in t or 'ring kickstand' in t)),
    (r'MagSafe Leather Wallet', lambda t: ('magsafe wallet' in t or 'magnetic wallet' in t or 'leather phone wallet' in t)),
    (r'Stylus Touch Pen', lambda t: ('stylus pen' in t or 'active stylus' in t or 'capacitive stylus' in t or 'apple pencil alternative' in t)),
    (r'Tablet Screen (Protector|Film)', lambda t: ('tablet screen protector' in t or 'ipad screen protector' in t or 'hydrogel screen protector' in t)),

    # Storage & Accessories
    (r'External SSD', lambda t: ('portable ssd' in t or 'external ssd' in t or 'solid state drive' in t)),
    (r'Flash Drive', lambda t: ('usb flash drive' in t or 'dual flash drive' in t or 'usb-c flash drive' in t or 'thumb drive' in t)),
    (r'MicroSDXC Card', lambda t: ('microsd' in t or 'microsdxc' in t or 'micro sd card' in t)),
    (r'Electronics Organizer Travel Case', lambda t: ('electronics organizer' in t or 'cable organizer bag' in t or 'travel cord organizer' in t or 'cable travel case' in t)),
    (r'Keyboard Cleaning', lambda t: ('keyboard cleaning kit' in t or 'cleaning gel' in t or 'keyboard brush' in t or 'electronics cleaner' in t)),
    (r'Wireless Presenter Pointer Clicker', lambda t: ('wireless presenter' in t or 'presentation clicker' in t or 'laser pointer clicker' in t)),
    (r'Bluetooth Anti-Lost Key Finder Tag', lambda t: ('key finder' in t or 'bluetooth tracker' in t or 'item finder' in t or 'anti-lost' in t)),
    (r'Turbo Desk Fan', lambda t: ('handheld fan' in t or 'portable desk fan' in t or 'mini turbo fan' in t or 'usb desk fan' in t))
]

def find_rule(product_name):
    for pat, matcher in RULES:
        if re.search(pat, product_name, re.IGNORECASE):
            return matcher, pat
    return None, None

def harvest_electronics():
    with open('src/data/products/electronicsTech.ts', 'r', encoding='utf-8') as f:
        c = f.read()
    prods = json.loads(c[c.index('= [') + 2 : c.rindex(';')])
    print(f"Loaded {len(prods)} products from electronicsTech.ts")

    # Map each product to its rule
    unmatched_prods = []
    for p in prods:
        m, pat = find_rule(p['name'])
        if not m:
            print("ERROR: Unmatched product:", p['name'])
            sys.exit(1)
        unmatched_prods.append({
            'prod': p,
            'matcher': m,
            'pat': pat
        })

    matched_dict = {}
    used_primary = set()

    sources = ['meta_Electronics.jsonl', 'meta_Cell_Phones_and_Accessories.jsonl']
    for source in sources:
        url = BASE_HF_URL + source
        print(f"\nStreaming {source} from Hugging Face...")
        req = urllib.request.Request(url, headers={'User-Agent': 'DailyNestApp/1.0'})
        
        try:
            with urllib.request.urlopen(req, timeout=40) as resp:
                line_count = 0
                while unmatched_prods and line_count < 80000:
                    line_count += 1
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
                            if u and u.startswith('https://') and u not in used_primary:
                                img_urls.append(u)
                                
                    if not img_urls:
                        continue
                        
                    primary_img = img_urls[0]
                    secondary_img = img_urls[1] if len(img_urls) > 1 else primary_img

                    # Check which unmatched product matches this item
                    for idx, candidate in enumerate(unmatched_prods):
                        if candidate['matcher'](item_title_lower):
                            p = candidate['prod']
                            unmatched_prods.pop(idx)
                            used_primary.add(primary_img)
                            matched_dict[p['id']] = {
                                'prod_name': p['name'],
                                'matched_title': item_title,
                                'images': [primary_img, secondary_img]
                            }
                            print(f"[{len(matched_dict)}/215] \"{p['name'][:35]}\" --> \"{item_title[:35]}\"", flush=True)
                            break
                            
                    if not unmatched_prods:
                        print("ALL 215 PRODUCTS MATCHED PERFECTLY!")
                        break
        except Exception as e:
            print(f"Warning during {source}: {e}")

        if not unmatched_prods:
            break

    print(f"\nTotal matched: {len(matched_dict)} / 215")
    print(f"Total unique primary: {len(used_primary)}")
    if unmatched_prods:
        print(f"Remaining unmatched: {len(unmatched_prods)}")
        for u in unmatched_prods:
            print("  *", u['prod']['name'], f"[{u['pat']}]")
            
    # Save results to json
    with open('scripts/electronics_matched.json', 'w', encoding='utf-8') as f:
        json.dump(matched_dict, f, indent=2)
    print("Saved to scripts/electronics_matched.json")

if __name__ == '__main__':
    harvest_electronics()
