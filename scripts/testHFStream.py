import urllib.request
import json

url = 'https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/meta_Electronics.jsonl'
req = urllib.request.Request(url, headers={'User-Agent': 'DailyNestApp/1.0'})
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        for i in range(5):
            line = resp.readline().decode('utf-8')
            if not line:
                break
            d = json.loads(line)
            title = d.get('title', '')[:60]
            images = d.get('images', [])
            print(f'Item {i+1}: title="{title}", images_count={len(images)}')
            if images:
                print('   First image:', images[0])
except Exception as e:
    print('Error:', e)
