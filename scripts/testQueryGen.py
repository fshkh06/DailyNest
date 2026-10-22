import json, glob, re

PREFIXES = [
    'Pro Series ', 'Signature ', 'Heritage ', 'Eco-Craft ', 'Nordic ',
    'Minimalist ', 'Modern ', 'Essential ', 'Classic ', 'Elite ',
    'Refined ', 'Terra ', 'Urban ', 'Artisan ', 'AuraSound ', 'Zenith Tech '
]

def clean_name(name):
    clean = name
    for p in PREFIXES:
        if clean.startswith(p):
            clean = clean[len(p):]
    clean = re.sub(r'\s*-\s*(Deal|Sale|Special|Standard|Plus|Lite|Reserve|Edition|Series|Original|Natural|Collection|Design).*$', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'\(.*?\)', '', clean)
    return clean.strip()

def extract_search_query(product_name, subcat):
    clean = clean_name(product_name)
    # Split on "with", "for", "&", "rated"
    main_part = re.split(r'\b(with|for|rated|featuring|including)\b', clean, flags=re.IGNORECASE)[0].strip()
    # Remove dimensions / numbers: e.g. "20-inch", "50ml", "4-Pack", "100W", "6Qt", "1000 Thread Count"
    cleaned_query = re.sub(r'\b\d+[-\s]?(inch|qt|ml|g|oz|pack|w|v|kw|ah|mah|k|gb|tb|thread count)\b', '', main_part, flags=re.IGNORECASE)
    cleaned_query = re.sub(r'\b\d+\+?\b', '', cleaned_query)
    cleaned_query = re.sub(r'[^\w\s-]', '', cleaned_query).strip()
    cleaned_query = re.sub(r'\s+', ' ', cleaned_query)
    return cleaned_query

all_products = []
for f in sorted(glob.glob('src/data/products/*.ts')):
    if 'index.ts' in f: continue
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    prods = json.loads(c[c.index('= [') + 2 : c.rindex(';')])
    all_products.extend(prods)

queries = {}
for p in all_products:
    q = extract_search_query(p['name'], p['subcategory'])
    queries[p['id']] = (p['name'], q, p['subcategory'])

print(f"Generated queries for all {len(queries)} products.")
print("\nSample queries:")
for pid in list(queries.keys())[::75]:
    pname, q, sc = queries[pid]
    print(f"[{pid}] {pname[:45].ljust(45)} --> \"{q}\"")
