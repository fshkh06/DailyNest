import json, glob

for f in sorted(glob.glob('src/data/products/*.ts')):
    if 'index.ts' in f: continue
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    prods = json.loads(c[c.index('= [') + 2 : c.rindex(';')])
    print(f"\n==========================================")
    print(f"FILE: {f} ({len(prods)} products)")
    print(f"==========================================")
    by_subcat = {}
    for p in prods:
        sc = p['subcategory']
        by_subcat.setdefault(sc, []).append(p['name'])
    for sc, names in by_subcat.items():
        print(f"  [{sc}] ({len(names)} items):")
        for n in names[:3]:
            print(f"     - {n}")
