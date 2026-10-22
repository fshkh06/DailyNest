import json

with open('src/data/products/electronicsTech.ts', 'r', encoding='utf-8') as f:
    c = f.read()
prods = json.loads(c[c.index('= [') + 2 : c.rindex(';')])

for i in range(min(50, len(prods))):
    p = prods[i]
    print(f"{i+1:2d}. {p['name']}  -->  [{p['subcategory']}]")
