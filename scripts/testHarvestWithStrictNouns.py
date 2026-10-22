import json, re, urllib.request, os, sys

if sys.stdout.encoding != 'utf-8':
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

from testStrictNouns100 import STRICT_NOUN_RULES, get_required_keywords

BAD_WORDS = [
    'case for', 'cover for', 'sleeve for', 'adapter for', 'replacement for',
    'battery for', 'strap for', 'band for', 'ear hooks', 'silicone tips',
    'charger for', 'screen protector for', 'parts for', 'wheel for', 'skin for'
]

def is_clean_item(title, req_noun):
    t_low = title.lower()
    for b in BAD_WORDS:
        if b in t_low:
            if 'case' in req_noun or 'cover' in req_noun or 'sleeve' in req_noun:
                continue
            return False
    return True

# Test on travelLifestyle.ts
with open('src/data/products/travelLifestyle.ts', 'r', encoding='utf-8') as f:
    c = f.read()
products = json.loads(c[c.index('= [') + 2 : c.rindex(';')])

print(f"Loaded {len(products)} products from travelLifestyle.ts")

# Map each product to its required keywords
unmatched = []
for p in products:
    kws = get_required_keywords(p['name'])
    unmatched.append({'prod': p, 'kws': kws or [p['subcategory'].lower()]})

print(f"All products mapped to keywords: {len(unmatched)}")

# Stream from meta_Sports_and_Outdoors.jsonl
url = 'https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/meta_Sports_and_Outdoors.jsonl'
req = urllib.request.Request(url, headers={'User-Agent': 'DailyNest/1.0'})

matched_dict = {}
used_primary = set()

print("Streaming meta_Sports_and_Outdoors.jsonl...")
lines_scanned = 0
with urllib.request.urlopen(req, timeout=30) as resp:
    while unmatched and lines_scanned < 50000:
        lines_scanned += 1
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
            # Match if any keyword is present
            if any(kw in title_lower for kw in kws):
                if not is_clean_item(title, kws[0]):
                    continue
                
                p = cand['prod']
                unmatched.pop(idx)
                used_primary.add(primary)
                matched_dict[p['id']] = (primary, secondary, title)
                if len(matched_dict) % 20 == 0:
                    print(f"  [{len(matched_dict)}/{len(products)}] \"{p['name'][:35]}\" -> \"{title[:35]}\"")
                break

print(f"\nResults after {lines_scanned} lines:")
print(f"Matched: {len(matched_dict)} / {len(products)}")
print(f"Remaining unmatched: {len(unmatched)}")
if unmatched:
    print("Sample unmatched:")
    for u in unmatched[:10]:
        print(f"  - {u['prod']['name']} (kws: {u['kws']})")
