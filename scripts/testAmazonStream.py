import urllib.request
import json
import re

def test_match():
    url = 'https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/meta_Electronics.jsonl'
    req = urllib.request.Request(url, headers={'User-Agent': 'DailyNestApp/1.0'})
    
    targets = {
        'earbuds': ['earbuds', 'in-ear headphones', 'wireless earbuds'],
        'headphone amplifier': ['headphone amplifier', 'headphone amp', 'dac amp'],
        'keyboard': ['mechanical keyboard', 'gaming keyboard'],
        'power bank': ['power bank', 'portable charger']
    }
    
    found = {k: [] for k in targets}
    
    print("Streaming Electronics jsonl...")
    with urllib.request.urlopen(req, timeout=30) as resp:
        for idx in range(10000):
            line = resp.readline().decode('utf-8', errors='ignore')
            if not line:
                break
            try:
                item = json.loads(line)
            except:
                continue
                
            title = item.get('title', '').lower()
            images = item.get('images', [])
            if not images or not title:
                continue
                
            img_url = None
            for img in images:
                if isinstance(img, dict):
                    img_url = img.get('hi_res') or img.get('large')
                    if img_url: break
            if not img_url:
                continue
                
            for category_key, patterns in targets.items():
                if len(found[category_key]) < 3:
                    if any(p in title for p in patterns):
                        found[category_key].append({
                            'matched_title': item.get('title'),
                            'image': img_url
                        })
                        
            if all(len(v) >= 3 for v in found.values()):
                print(f"Found all targets after {idx} items!")
                break
                
    for k, items in found.items():
        print(f"\nTarget: {k} ({len(items)} found)")
        for it in items:
            print(f"  Title: {it['matched_title'][:60]}")
            print(f"  Image: {it['image']}")

test_match()
