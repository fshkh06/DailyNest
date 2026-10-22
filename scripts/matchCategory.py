import json
import urllib.request
import re
import os

BASE_URL = 'https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/'

# Core product noun mapping for each subcategory
SUBCAT_NOUNS = {
    'Headphones & Audio': [
        ('earbuds', ['earbuds', 'true wireless', 'in-ear headphones', 'earbud']),
        ('amplifier', ['headphone amplifier', 'headphone amp', 'audio dac', 'headphone dac']),
        ('speaker', ['bluetooth speaker', 'portable speaker', 'bookshelf speaker', 'studio monitor']),
        ('headphones', ['over-ear headphones', 'wireless headphones', 'noise cancelling headphones', 'headset', 'headphones'])
    ],
    'Power & Charging': [
        ('power bank', ['power bank', 'portable charger', 'battery pack']),
        ('wireless charger', ['wireless charging', 'wireless charger', 'magsafe charger', 'charging station']),
        ('wall charger', ['wall charger', 'gan charger', 'usb c charger', 'fast charger']),
        ('cable', ['usb-c cable', 'charging cable', 'lightning cable', 'braided cable'])
    ],
    'Computer & Desk Gear': [
        ('keyboard', ['mechanical keyboard', 'gaming keyboard', 'wireless keyboard']),
        ('mouse', ['wireless mouse', 'gaming mouse', 'ergonomic mouse', 'bluetooth mouse']),
        ('laptop stand', ['laptop stand', 'monitor stand', 'desk riser']),
        ('light bar', ['monitor light bar', 'desk lamp', 'screenbar', 'desk light']),
        ('usb hub', ['usb c hub', 'docking station', 'multiport adapter', 'usb hub'])
    ],
    'Wearables & Smart Tech': [
        ('smartwatch', ['smart watch', 'smartwatch', 'fitness tracker', 'smart band']),
        ('audio glasses', ['smart glasses', 'audio glasses', 'bluetooth glasses'])
    ],
    'Camera & Streaming': [
        ('webcam', ['webcam', '4k streaming webcam', 'hd webcam']),
        ('microphone', ['usb microphone', 'condenser microphone', 'podcast microphone']),
        ('ring light', ['ring light', 'video light', 'studio light']),
        ('tripod', ['camera tripod', 'tripod stand', 'phone tripod']),
        ('camera bag', ['camera bag', 'camera backpack', 'camera case'])
    ],
    'Smart Home Devices': [
        ('smart plug', ['smart plug', 'wifi plug', 'smart outlet']),
        ('smart bulb', ['smart bulb', 'smart led light', 'rgb light bulb']),
        ('security camera', ['security camera', 'wifi camera', 'indoor camera']),
        ('smart sensor', ['smart sensor', 'motion sensor', 'temperature sensor'])
    ],
    'Phone & Tablet Accessories': [
        ('phone case', ['phone case', 'iphone case', 'protective case']),
        ('tablet stand', ['tablet stand', 'ipad stand', 'phone stand']),
        ('screen protector', ['screen protector', 'tempered glass'])
    ],
    'Storage & Accessories': [
        ('portable ssd', ['portable ssd', 'external ssd', 'external solid state drive']),
        ('flash drive', ['usb flash drive', 'thumb drive', 'jump drive']),
        ('hard drive', ['external hard drive', 'portable hard drive'])
    ]
}

def get_product_target(product_name, subcat):
    p_lower = product_name.lower()
    rules = SUBCAT_NOUNS.get(subcat, [])
    # Check specific noun rules first
    for target_name, keywords in rules:
        for kw in keywords:
            if kw in p_lower:
                return target_name, keywords
    # Fallback to single word search
    words = [w for w in re.findall(r'[a-z]+', p_lower) if len(w) > 3]
    return words[0] if words else subcat.lower(), [p_lower]

def match_electronics():
    with open('src/data/products/electronicsTech.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    json_str = content[content.index('= [') + 2 : content.rindex(';')]
    products = json.loads(json_str)
    print(f"Loaded {len(products)} products from electronicsTech.ts")
    
    # Analyze targets needed
    unmatched_products = list(products)
    matched_images = {} # product_id -> [img1, img2]
    used_images = set()

    sources = ['meta_Electronics.jsonl', 'meta_Cell_Phones_and_Accessories.jsonl']
    
    for source in sources:
        url = BASE_URL + source
        print(f"\nStreaming {source} from Hugging Face...")
        req = urllib.request.Request(url, headers={'User-Agent': 'DailyNest/1.0'})
        
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                line_count = 0
                while unmatched_products and line_count < 35000:
                    line_count += 1
                    line = resp.readline().decode('utf-8', errors='ignore')
                    if not line:
                        break
                    
                    try:
                        item = json.loads(line)
                    except:
                        continue
                    
                    item_title = item.get('title', '').lower()
                    images = item.get('images', [])
                    if not images or not item_title or len(item_title) < 5:
                        continue
                    
                    img_urls = []
                    for img in images:
                        if isinstance(img, dict):
                            u = img.get('hi_res') or img.get('large')
                            if u and u.startswith('https://') and u not in used_images:
                                img_urls.append(u)
                    
                    if not img_urls:
                        continue
                    
                    primary_img = img_urls[0]
                    secondary_img = img_urls[1] if len(img_urls) > 1 else primary_img

                    # Find best matching product
                    best_match_idx = -1
                    best_score = 0
                    
                    for idx, prod in enumerate(unmatched_products):
                        target_name, keywords = get_product_target(prod['name'], prod['subcategory'])
                        p_name_lower = prod['name'].lower()
                        score = 0
                        
                        # Direct keyword match in title
                        for kw in keywords:
                            if kw in item_title:
                                score += 50
                                break
                                
                        # Specific title token overlap
                        prod_tokens = set(re.findall(r'[a-z]{3,}', p_name_lower))
                        item_tokens = set(re.findall(r'[a-z]{3,}', item_title))
                        overlap = len(prod_tokens.intersection(item_tokens))
                        score += overlap * 10
                        
                        if score > best_score and score >= 50:
                            best_score = score
                            best_match_idx = idx

                    if best_match_idx >= 0:
                        matched_prod = unmatched_products.pop(best_match_idx)
                        used_images.add(primary_img)
                        matched_images[matched_prod['id']] = [primary_img, secondary_img]
                        print(f"[{len(matched_images)}/{len(products)}] Matched: \"{matched_prod['name'][:40]}\" -> \"{item.get('title')[:40]}\"")
                        
                    if len(matched_images) == len(products):
                        print("All products successfully matched!")
                        break
        except Exception as e:
            print(f"Error during stream of {source}: {e}")

    print(f"\nFinal Matched Count: {len(matched_images)} / {len(products)}")
    print(f"Remaining unmatched: {len(unmatched_products)}")
    if unmatched_products:
        print("Unmatched products sample:")
        for p in unmatched_products[:5]:
            print(f"  - {p['name']} ({p['subcategory']})")

if __name__ == '__main__':
    match_electronics()
