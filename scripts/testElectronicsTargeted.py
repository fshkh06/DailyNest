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

# Targeted matching rules for electronics
# Each entry: (product_name_regex, amazon_title_matcher)
RULES = [
    # Headphones & Audio
    (r'True Wireless Hi-Fi Earbuds', lambda t: ('earbud' in t or 'earbuds' in t or 'in-ear' in t) and 'case' not in t.split()[:2]),
    (r'Over-Ear Headphones', lambda t: ('headphone' in t or 'headphones' in t or 'over-ear' in t) and 'earbud' not in t and 'case' not in t.split()[:2]),
    (r'Studio Monitor Reference Wired Headphones', lambda t: ('studio monitor' in t or 'studio' in t or 'reference' in t or 'wired' in t) and 'headphone' in t),
    (r'Bone Conduction Open-Ear Sport Earphones', lambda t: ('bone conduction' in t or 'open-ear' in t or 'open ear' in t)),
    (r'Rugged Waterproof IPX7 Bluetooth Speaker', lambda t: ('bluetooth speaker' in t or 'waterproof speaker' in t or 'portable speaker' in t)),
    (r'Bookshelf Speakers', lambda t: ('bookshelf speaker' in t or 'desktop speaker' in t or 'stereo speaker' in t)),
    (r'RGB Gaming Headset', lambda t: ('gaming headset' in t or 'gaming headphone' in t or 'headset' in t)),
    (r'Retro Fabric Bluetooth Tabletop Speaker', lambda t: ('bluetooth speaker' in t or 'wireless speaker' in t or 'retro speaker' in t)),
    (r'Magnetic Wireless Neckband Sport Earphones', lambda t: ('neckband' in t or 'neckband earphone' in t or 'neckband headphone' in t)),
    (r'USB-C DAC Portable Headphone Amplifier', lambda t: ('headphone amp' in t or 'headphone amplifier' in t or 'dac amp' in t or 'audio dac' in t or 'headphone dac' in t)),

    # Power & Charging
    (r'65W GaN Fast Charger Ultra-Compact 3-Port', lambda t: ('gan charger' in t or '65w charger' in t or 'fast charger' in t or 'wall charger' in t or 'usb c charger' in t)),
    (r'20000mAh Power Bank with 100W PD Output', lambda t: ('power bank' in t or 'portable charger' in t or 'battery pack' in t)),
    (r'3-in-1 Foldable Magnetic Wireless Charging Station', lambda t: ('wireless charging station' in t or 'wireless charger stand' in t or '3 in 1 wireless' in t or 'magnetic wireless charger' in t)),
    (r'Braided Kevlar USB-C to USB-C 240W Cable', lambda t: ('usb c to usb c' in t or 'usb-c cable' in t or 'charging cable' in t or 'braided cable' in t)),
    (r'Desktop Multi-Outlet Surge Protector with USB Hub', lambda t: ('surge protector' in t or 'power strip' in t or 'multi outlet' in t)),
    (r'Magnetic Wireless Power Bank 10000mAh', lambda t: ('magnetic power bank' in t or 'magsafe power bank' in t or 'wireless power bank' in t or 'power bank' in t)),
    (r'Car Fast Charger Dual USB-C 45W Adapter', lambda t: ('car charger' in t or 'car adapter' in t or 'fast car charger' in t)),
    (r'Heavy Duty Solar Power Bank with Flashlight', lambda t: ('solar power bank' in t or 'solar charger' in t or 'power bank' in t)),
    (r'Smart Wireless Charging Mouse Pad Qi', lambda t: ('wireless charging mouse pad' in t or 'charging mouse pad' in t or 'rgb mouse pad' in t or 'desk mat' in t)),
    (r'Cable Management Cord Organizer Box', lambda t: ('cable management box' in t or 'cord organizer box' in t or 'cable organizer box' in t or 'cable box' in t)),

    # Computer & Desk Gear
    (r'Ergonomic Mechanical Keyboard Hot-Swappable', lambda t: ('mechanical keyboard' in t or 'gaming keyboard' in t or 'hot swappable keyboard' in t or 'custom keyboard' in t)),
    (r'Silent Wireless Bluetooth Precision Mouse', lambda t: ('wireless mouse' in t or 'bluetooth mouse' in t or 'silent mouse' in t or 'optical mouse' in t)),
    (r'Curved Monitor LED Screen Light Bar Lamp', lambda t: ('monitor light bar' in t or 'screenbar' in t or 'monitor lamp' in t or 'desk light bar' in t)),
    (r'Aluminum Adjustable Laptop Riser Stand', lambda t: ('laptop stand' in t or 'laptop riser' in t or 'adjustable laptop' in t)),
    (r'Dual 4K USB-C Multiport Docking Station Hub', lambda t: ('usb-c hub' in t or 'usb c hub' in t or 'docking station' in t or 'multiport hub' in t or 'multiport adapter' in t)),
    (r'Felt Wool Extra Large Desk Mat Blotter', lambda t: ('desk mat' in t or 'desk pad' in t or 'felt desk mat' in t or 'extended mouse pad' in t)),
    (r'Ergonomic Memory Foam Wrist Rest Set', lambda t: ('wrist rest' in t or 'keyboard wrist rest' in t or 'mouse wrist rest' in t)),
    (r'Vertical Ergonomic Mouse Optical 4000 DPI', lambda t: ('vertical mouse' in t or 'ergonomic vertical mouse' in t or 'wireless vertical mouse' in t)),
    (r'Ultra-Slim Portable 15.6-inch IPS Monitor', lambda t: ('portable monitor' in t or '15.6 portable monitor' in t or 'travel monitor' in t)),
    (r'Magnetic Privacy Screen Filter for Laptop', lambda t: ('privacy screen' in t or 'privacy screen protector' in t or 'screen filter' in t)),

    # Wearables & Smart Tech
    (r'AMOLED GPS Smartwatch with Heart Rate Sensor', lambda t: ('smartwatch' in t or 'smart watch' in t or 'gps smartwatch' in t)),
    (r'Slim Fitness Tracker Band with Sleep Monitor', lambda t: ('fitness tracker' in t or 'fitness band' in t or 'smart band' in t or 'activity tracker' in t)),
    (r'Bluetooth Smart Glasses with Open-Ear Audio', lambda t: ('smart glasses' in t or 'audio glasses' in t or 'bluetooth sunglasses' in t or 'smart audio glasses' in t)),
    (r'Titanium Smart Health Ring Bio-Tracker', lambda t: ('smart ring' in t or 'health ring' in t or 'fitness ring' in t or 'sleep ring' in t)),
    (r'Smart Luggage Tracker GPS Bluetooth Tag 4-Pack', lambda t: ('airtag' in t or 'bluetooth tracker' in t or 'smart tag' in t or 'key finder' in t or 'gps tracker' in t)),
    (r'Digital Voice Recorder Pen with AI Noise Reduction', lambda t: ('voice recorder' in t or 'voice activated recorder' in t or 'audio recorder' in t or 'digital recorder' in t)),
    (r'Smart Bike Helmet with LED Signals & Audio', lambda t: ('bike helmet' in t or 'bicycle helmet' in t or 'smart helmet' in t)),
    (r'Smart Thermos Bottle with Temperature Display', lambda t: ('smart thermos' in t or 'smart water bottle' in t or 'temperature display bottle' in t or 'vacuum insulated bottle' in t)),

    # Camera & Streaming
    (r'4K Ultra HD Streaming Webcam with Auto-Focus', lambda t: ('4k webcam' in t or 'streaming webcam' in t or 'hd webcam' in t or 'webcam' in t)),
    (r'USB Condenser Podcast Microphone with Arm Stand', lambda t: ('usb microphone' in t or 'condenser microphone' in t or 'podcast microphone' in t or 'streaming microphone' in t)),
    (r'Bi-Color LED Ring Light with Tripod Stand', lambda t: ('ring light' in t or 'led ring light' in t or 'ring light with tripod' in t)),
    (r'3-Axis Handheld Smartphone Gimbal Stabilizer', lambda t: ('smartphone gimbal' in t or '3-axis gimbal' in t or 'phone stabilizer' in t or 'handheld gimbal' in t)),
    (r'Wireless Lavalier Lapel Microphone Dual Channel', lambda t: ('lavalier microphone' in t or 'wireless lavalier' in t or 'lapel mic' in t or 'wireless microphone' in t)),
    (r'Desktop Camera Mount Flex Arm Clamp', lambda t: ('camera mount' in t or 'desk mount clamp' in t or 'articulating arm' in t or 'flex arm' in t)),
    (r'Green Screen Collapsible Studio Backdrop', lambda t: ('green screen' in t or 'collapsible backdrop' in t or 'chromakey' in t or 'photo backdrop' in t)),
    (r'SD Card High-Speed UHS-II 128GB V60', lambda t: ('sd card' in t or 'sdxc' in t or 'memory card' in t or '128gb sd' in t)),

    # Smart Home Devices
    (r'Wi-Fi Smart Plug Energy Monitoring 4-Pack', lambda t: ('smart plug' in t or 'wifi smart plug' in t or 'smart outlet' in t)),
    (r'Color Changing RGB Smart Bulb Set of 4', lambda t: ('smart bulb' in t or 'rgb smart bulb' in t or 'smart led bulb' in t or 'wifi light bulb' in t)),
    (r'Indoor 1080p Security Camera with Night Vision', lambda t: ('security camera' in t or 'indoor security camera' in t or 'wifi camera' in t or 'pet camera' in t)),
    (r'Smart Wireless Video Doorbell with Chime', lambda t: ('video doorbell' in t or 'doorbell camera' in t or 'wireless doorbell' in t)),
    (r'Smart Fingerprint Door Lock Keyless Entry', lambda t: ('smart door lock' in t or 'fingerprint door lock' in t or 'keyless entry door lock' in t or 'smart lock' in t)),
    (r'Motion Sensor LED Stair Light Strips', lambda t: ('motion sensor light' in t or 'stair lights' in t or 'under cabinet lights' in t or 'led light strip' in t)),
    (r'Ultrasonic Smart Essential Oil Humidifier', lambda t: ('ultrasonic humidifier' in t or 'smart humidifier' in t or 'cool mist humidifier' in t or 'oil diffuser' in t)),

    # Phone & Tablet Accessories
    (r'Shockproof Matte Frosted Phone Case', lambda t: ('phone case' in t or 'matte case' in t or 'slim phone case' in t or 'bumper case' in t)),
    (r'Foldable Aluminum Desktop Tablet Stand Holder', lambda t: ('tablet stand' in t or 'ipad stand' in t or 'desktop tablet holder' in t)),
    (r'Tempered Glass Screen Protector 9H 3-Pack', lambda t: ('screen protector' in t or 'tempered glass' in t)),
    (r'Universal Car Phone Mount Vent Clip', lambda t: ('car phone mount' in t or 'car vent mount' in t or 'air vent phone holder' in t)),
    (r'Retractable Ring Grip Phone Holder Kickstand', lambda t: ('phone ring holder' in t or 'phone grip' in t or 'finger ring stand' in t or 'ring kickstand' in t)),
    (r'MagSafe Leather Wallet with Built-in Stand', lambda t: ('magsafe wallet' in t or 'magnetic wallet' in t or 'leather phone wallet' in t)),
    (r'Stylus Touch Pen for iPad & Tablets', lambda t: ('stylus pen' in t or 'active stylus' in t or 'capacitive stylus' in t or 'apple pencil alternative' in t)),
    (r'Anti-Fingerprint Hydrogel Tablet Screen Protector', lambda t: ('tablet screen protector' in t or 'ipad screen protector' in t or 'hydrogel screen protector' in t)),

    # Storage & Accessories
    (r'Rugged Portable External SSD 1TB USB 3.2', lambda t: ('portable ssd' in t or 'external ssd' in t or 'solid state drive' in t)),
    (r'Dual-Connector USB-C & USB-A Flash Drive 256GB', lambda t: ('usb flash drive' in t or 'dual flash drive' in t or 'usb-c flash drive' in t or 'thumb drive' in t)),
    (r'High-Speed MicroSDXC Card 256GB A2', lambda t: ('microsd' in t or 'microsdxc' in t or 'micro sd card' in t)),
    (r'Waterproof Electronics Organizer Travel Case', lambda t: ('electronics organizer' in t or 'cable organizer bag' in t or 'travel cord organizer' in t or 'cable travel case' in t)),
    (r'Anti-Static Keyboard Cleaning Brush & Gel Putty Kit', lambda t: ('keyboard cleaning kit' in t or 'cleaning gel' in t or 'keyboard brush' in t or 'electronics cleaner' in t)),
    (r'Compact Wireless Presenter Pointer Clicker', lambda t: ('wireless presenter' in t or 'presentation clicker' in t or 'laser pointer clicker' in t)),
    (r'Bluetooth Anti-Lost Key Finder Tag', lambda t: ('key finder' in t or 'bluetooth tracker' in t or 'item finder' in t or 'anti-lost' in t)),
    (r'Rechargeable Portable Handheld Turbo Desk Fan', lambda t: ('handheld fan' in t or 'portable desk fan' in t or 'mini turbo fan' in t or 'usb desk fan' in t))
]

def find_rule(product_name):
    for pat, matcher in RULES:
        if re.search(pat, product_name, re.IGNORECASE):
            return matcher, pat
    return None, None

def test_electronics_mapping():
    with open('src/data/products/electronicsTech.ts', 'r', encoding='utf-8') as f:
        c = f.read()
    prods = json.loads(c[c.index('= [') + 2 : c.rindex(';')])
    print(f"Loaded {len(prods)} products from electronicsTech.ts")
    
    unmatched_prods = []
    rule_counts = {}
    for p in prods:
        m, pat = find_rule(p['name'])
        if m:
            rule_counts[pat] = rule_counts.get(pat, 0) + 1
        else:
            unmatched_prods.append(p)
            
    print(f"Matched to specific rules: {len(prods) - len(unmatched_prods)} / {len(prods)}")
    print(f"Unmatched products: {len(unmatched_prods)}")
    if unmatched_prods:
        for u in unmatched_prods:
            print("  -", u['name'])

test_electronics_mapping()
