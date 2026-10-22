import json, re, urllib.request, os, sys

if sys.stdout.encoding != 'utf-8':
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

from testStrictNouns100 import STRICT_NOUN_RULES

BAD_WORDS = [
    'case for', 'cover for', 'sleeve for', 'adapter for', 'replacement for',
    'battery for', 'strap for', 'band for', 'ear hooks', 'silicone tips',
    'charger for', 'screen protector for', 'parts for', 'wheel for', 'skin for',
    'decal for', 'cable ferrules', 'replacement parts', 'accessory kit',
    'replacement band', 'cushion replacement', 'ear pad replacement'
]

def is_clean_item(title, req_noun):
    t_low = title.lower()
    for b in BAD_WORDS:
        if b in t_low:
            if 'case' in req_noun or 'cover' in req_noun or 'sleeve' in req_noun or 'protector' in req_noun:
                continue
            return False
    return True

# Map product name to keywords using STRICT_NOUN_RULES
def get_keywords(name):
    clean = name.lower()
    for pat, req_kws in STRICT_NOUN_RULES:
        if re.search(pat, clean):
            return req_kws
    return None

def test_category(cat_file, datasets, max_lines=60000):
    with open(f'src/data/products/{cat_file}', 'r', encoding='utf-8') as f:
        c = f.read()
    products = json.loads(c[c.index('= [') + 2 : c.rindex(';')])
    print(f"\n=======================================================")
    print(f"Testing {cat_file} ({len(products)} products)")
    print(f"=======================================================")

    unmatched = []
    for p in products:
        kws = get_keywords(p['name'])
        unmatched.append({'prod': p, 'kws': kws or [p['subcategory'].lower()]})

    used_primary = set()
    matched = {}

    for ds in datasets:
        url = f'https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/{ds}'
        print(f"Streaming {ds} (max {max_lines} lines)...")
        req = urllib.request.Request(url, headers={'User-Agent': 'DailyNest/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                lines = 0
                while unmatched and lines < max_lines:
                    lines += 1
                    line = resp.readline().decode('utf-8', errors='ignore')
                    if not line: break
                    try: item = json.loads(line)
                    except: continue

                    title = item.get('title', '').strip()
                    if not title or len(title) < 5: continue
                    title_lower = title.lower()

                    images = item.get('images', [])
                    if not images: continue

                    img_urls = []
                    for img in images:
                        if isinstance(img, dict):
                            u = img.get('hi_res') or img.get('large')
                            if u and u.startswith('https://') and u not in used_primary:
                                img_urls.append(u)
                    if not img_urls: continue

                    primary = img_urls[0]
                    secondary = img_urls[1] if len(img_urls) > 1 else primary

                    for idx, cand in enumerate(unmatched):
                        kws = cand['kws']
                        if any(kw in title_lower for kw in kws):
                            if not is_clean_item(title, kws[0]):
                                continue
                            p = cand['prod']
                            unmatched.pop(idx)
                            used_primary.add(primary)
                            matched[p['id']] = (primary, secondary, title)
                            break
                    if not unmatched: break
        except Exception as e:
            print(f"  Error: {e}")
        print(f"  After {ds}: Matched {len(matched)} / {len(products)}, Remaining: {len(unmatched)}")
        if not unmatched: break

    if unmatched:
        print(f"Remaining unmatched ({len(unmatched)}):")
        for u in unmatched[:5]:
            print(f"  - {u['prod']['name']} (kws: {u['kws']})")

if __name__ == '__main__':
    cat = sys.argv[1] if len(sys.argv) > 1 else 'personalCareBeauty.ts'
    ds_map = {
        'electronicsTech.ts': ['meta_Electronics.jsonl', 'meta_Cell_Phones_and_Accessories.jsonl'],
        'kitchenDining.ts': ['meta_Home_and_Kitchen.jsonl', 'meta_Appliances.jsonl'],
        'homeLiving.ts': ['meta_Home_and_Kitchen.jsonl'],
        'fashionAccessories.ts': ['meta_Clothing_Shoes_and_Jewelry.jsonl', 'meta_Amazon_Fashion.jsonl'],
        'personalCareBeauty.ts': ['meta_Beauty_and_Personal_Care.jsonl'],
        'travelLifestyle.ts': ['meta_Sports_and_Outdoors.jsonl', 'meta_Clothing_Shoes_and_Jewelry.jsonl'],
        'giftsStationery.ts': ['meta_Office_Products.jsonl', 'meta_Arts_Crafts_and_Sewing.jsonl']
    }
    test_category(cat, ds_map[cat])
