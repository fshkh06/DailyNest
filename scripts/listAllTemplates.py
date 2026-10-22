import json, glob, re

PREFIXES = [
    'Pro Series ', 'Signature ', 'Heritage ', 'Eco-Craft ', 'Nordic ',
    'Minimalist ', 'Modern ', 'Essential ', 'Classic ', 'Elite ',
    'Refined ', 'Terra ', 'Urban ', 'Artisan ', 'AuraSound ', 'Zenith Tech ',
    'Ultra ', 'Compact '
]

def get_base(name):
    c = name
    for p in PREFIXES:
        if c.startswith(p): c = c[len(p):]
    c = re.sub(r'\s*-\s*(Deal|Sale|Special|Standard|Plus|Lite|Reserve|Edition|Series|Original|Natural|Collection|Design|Studio|Master|Pure|Core|Daily).*$', '', c, flags=re.IGNORECASE)
    c = re.sub(r'\(.*?\)', '', c).strip()
    return c

for f in sorted(glob.glob('src/data/products/*.ts')):
    if 'index.ts' in f: continue
    with open(f, 'r', encoding='utf-8') as fp:
        s = fp.read()
    prods = json.loads(s[s.index('= [') + 2 : s.rindex(';')])
    by_subcat = {}
    for p in prods:
        sc = p['subcategory']
        b = get_base(p['name'])
        by_subcat.setdefault(sc, set()).add(b)
    
    print(f"\n=======================================================")
    print(f"FILE: {f} ({len(prods)} products)")
    print(f"=======================================================")
    for sc, bases in by_subcat.items():
        print(f"  [{sc}] ({len(bases)} base items):")
        for b in sorted(bases):
            print(f"     - {b}")
