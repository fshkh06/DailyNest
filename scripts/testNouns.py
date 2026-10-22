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
    # Remove trailing stuff like ' - Deal', ' - Sale'
    clean = re.sub(r'\s*-\s*(Deal|Sale|Special|Standard).*$', '', clean, flags=re.IGNORECASE)
    return clean.strip()

all_products = []
for f in sorted(glob.glob('src/data/products/*.ts')):
    if 'index.ts' in f: continue
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    prods = json.loads(c[c.index('= [') + 2 : c.rindex(';')])
    all_products.extend(prods)

print(f"Total products in catalog: {len(all_products)}")

clean_names = set()
for p in all_products:
    c = clean_name(p['name'])
    clean_names.add(c)

print(f"Unique base product clean names: {len(clean_names)}")
print("\nSample clean names:")
for c in sorted(list(clean_names))[:30]:
    print("  *", c)
