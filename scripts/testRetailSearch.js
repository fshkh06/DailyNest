async function testRetailSearch(query) {
  try {
    const res1 = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await res1.text();
    const m = html.match(/vqd=([0-9-]+)/);
    if (!m) {
      console.log('Failed to get vqd for:', query);
      return [];
    }
    const res2 = await fetch('https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query) + '&vqd=' + m[1] + '&f=,,,&p=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/'
      }
    });
    if (!res2.ok) {
      console.log('i.js failed with status:', res2.status);
      return [];
    }
    const d = await res2.json();
    const results = (d.results || []).map(r => ({
      title: r.title,
      image: r.image
    })).filter(r => r.image && r.image.startsWith('https://'));

    return results;
  } catch (e) {
    console.error('Error:', e.message);
    return [];
  }
}

async function run() {
  const testQueries = [
    'wireless earbuds product white background',
    'headphone amplifier dac audio product',
    'mechanical gaming keyboard product',
    '7 in 1 usb c hub adapter product',
    'nonstick frying pan cookware product',
    'running shoes sneakers product'
  ];

  for (const q of testQueries) {
    const results = await testRetailSearch(q);
    console.log(`\nQuery: "${q}" -> Found ${results.length} images`);
    for (let i = 0; i < Math.min(3, results.length); i++) {
      console.log(`  [${i + 1}] "${results[i].title.slice(0, 50)}" -> ${results[i].image}`);
    }
    // polite delay between queries
    await new Promise(r => setTimeout(r, 1500));
  }
}

run();
