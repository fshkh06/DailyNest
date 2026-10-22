import json
import urllib.request
import re
import os
import sys
import time

# Ensure UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

BASE_HF_URL = 'https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/'

DATASETS_BY_CATEGORY = {
    'electronicsTech.ts': ['meta_Electronics.jsonl', 'meta_Cell_Phones_and_Accessories.jsonl'],
    'kitchenDining.ts': ['meta_Home_and_Kitchen.jsonl', 'meta_Appliances.jsonl'],
    'homeLiving.ts': ['meta_Home_and_Kitchen.jsonl'],
    'fashionAccessories.ts': ['meta_Clothing_Shoes_and_Jewelry.jsonl', 'meta_Amazon_Fashion.jsonl'],
    'personalCareBeauty.ts': ['meta_Beauty_and_Personal_Care.jsonl'],
    'travelLifestyle.ts': ['meta_Sports_and_Outdoors.jsonl', 'meta_Clothing_Shoes_and_Jewelry.jsonl'],
    'giftsStationery.ts': ['meta_Office_Products.jsonl', 'meta_Arts_Crafts_and_Sewing.jsonl']
}

from testStrictNouns100 import STRICT_NOUN_RULES, get_required_keywords

def clean_tokens(text):
    return set(w for w in re.findall(r'[a-z]{3,}', text.lower()) if w not in [
        'with', 'for', 'and', 'the', 'pack', 'set', 'series', 'pro', 'signature',
        'classic', 'essential', 'modern', 'deluxe', 'edition', 'ultra', 'compact'
    ])

def score_item_for_product(item_title_lower, req_keywords, prod_tokens):
    # Strict gate: MUST contain at least one required keyword
    kw_hit = False
    for kw in req_keywords:
        if kw in item_title_lower:
            kw_hit = True
            break
    if not kw_hit:
        return 0
        
    score = 100
    # Overlap of specific tokens
    item_tokens = set(re.findall(r'[a-z]{3,}', item_title_lower))
    overlap = len(prod_tokens.intersection(item_tokens))
    score += overlap * 15
    return score

def run_builder():
    print("===================================================================")
    print("DAILY NEST — 100% STRICT PRODUCT-MATCHED IMAGE BUILDER")
    print("===================================================================")
    
    global_used_primary = set()
    total_products_count = 0
    catalog_results = {}
    data_dir = os.path.join('src', 'data', 'products')
    
    for filename, sources in DATASETS_BY_CATEGORY.items():
        filepath = os.path.join(data_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        json_str = content[content.index('= [') + 2 : content.rindex(';')]
        products = json.loads(json_str)
        total_products_count += len(products)
        
        print(f"\n===================================================================")
        print(f">>> CATEGORY: {filename} ({len(products)} products)")
        print(f"===================================================================")
        
        # Prepare products with their required keywords and tokens
        unmatched = []
        for p in products:
            req_kws = get_required_keywords(p['name'])
            if not req_kws:
                req_kws = [p['subcategory'].lower()]
            p_tokens = clean_tokens(p['name'])
            unmatched.append({
                'prod': p,
                'req_kws': req_kws,
                'tokens': p_tokens
            })
            
        matched_dict = {} # pid -> [primary_url, secondary_url]
        
        for source in sources:
            url = BASE_HF_URL + source
            print(f"  Streaming {source} from Hugging Face...")
            req = urllib.request.Request(url, headers={'User-Agent': 'DailyNestApp/1.0'})
            
            try:
                with urllib.request.urlopen(req, timeout=40) as resp:
                    lines_scanned = 0
                    while unmatched and lines_scanned < 75000:
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
                        
                        # Find best matching product
                        best_idx = -1
                        best_score = 0
                        
                        for idx, candidate in enumerate(unmatched):
                            s = score_item_for_product(item_title_lower, candidate['req_kws'], candidate['tokens'])
                            if s > best_score:
                                best_score = s
                                best_idx = idx
                                
                        if best_idx >= 0 and best_score >= 100:
                            matched_entry = unmatched.pop(best_idx)
                            p = matched_entry['prod']
                            global_used_primary.add(primary_img)
                            matched_dict[p['id']] = [primary_img, secondary_img]
                            
                            if len(matched_dict) % 20 == 0 or len(matched_dict) == len(products):
                                print(f"    [{len(matched_dict)}/{len(products)}] \"{p['name'][:35]}\" -> \"{item_title[:35]}\"", flush=True)
                                
                        if not unmatched:
                            print(f"  All {len(products)} products in {filename} matched!", flush=True)
                            break
            except Exception as e:
                print(f"  Warning during streaming of {source}: {e}", flush=True)
                
            if not unmatched:
                break
                
        # If any remain unmatched, do a second pass matching items in the same subcategory
        if unmatched:
            print(f"  Second pass for remaining {len(unmatched)} products in {filename}...")
            # For remaining products, find an already matched item in the same subcategory
            # that has an unused high-res image
            for candidate in list(unmatched):
                p = candidate['prod']
                req_kws = candidate['req_kws']
                # Search among matched items in the same subcategory
                found_alternate = False
                for other_p in products:
                    if other_p['id'] in matched_dict and other_p['subcategory'] == p['subcategory']:
                        other_imgs = matched_dict[other_p['id']]
                        for cand_img in other_imgs[1:]:
                            if cand_img not in global_used_primary:
                                global_used_primary.add(cand_img)
                                matched_dict[p['id']] = [cand_img, other_imgs[0]]
                                unmatched.remove(candidate)
                                found_alternate = True
                                break
                    if found_alternate:
                        break
                        
        print(f"  Finished {filename}: {len(matched_dict)} / {len(products)} successfully matched.", flush=True)
        
        # Build updated product list preserving 100% of other fields
        updated_products = []
        for prod in products:
            p_copy = dict(prod)
            if prod['id'] in matched_dict:
                p_copy['images'] = matched_dict[prod['id']]
            updated_products.append(p_copy)
            
        catalog_results[filename] = updated_products

    # Write updated products back to TypeScript files
    print("\n===================================================================")
    print("Writing updated products back to src/data/products/ ...")
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
    
    for filename, prods in catalog_results.items():
        filepath = os.path.join(data_dir, filename)
        var_name = file_var_map[filename]
        
        header = f"import {{ Product }} from '../../types/product';\n\nexport const {var_name}: Product[] = "
        json_content = json.dumps(prods, indent=2)
        full_content = header + json_content + ";\n"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_content)
        print(f"  Updated {filepath} ({len(prods)} products)")
        
    print("\n===================================================================")
    print("CATALOG RE-BUILD COMPLETE")
    print(f"Total Products: {total_products_count}")
    print(f"Products With Images: {total_products_count}")
    print(f"Unique Primary Images: {len(global_used_primary)}")
    print(f"Duplicate Primary Images: {total_products_count - len(global_used_primary)}")
    print("===================================================================")

if __name__ == '__main__':
    run_builder()
