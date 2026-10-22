async function testDDGWithCookies() {
  const query = 'wireless earbuds product';
  const url1 = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
  const res1 = await fetch(url1, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  console.log('Res1 status:', res1.status);
  const html = await res1.text();
  const vqdMatch = html.match(/vqd="([^"]+)"/) || html.match(/vqd=([0-9-]+)/);
  if (!vqdMatch) {
    console.log('No vqd match in html. HTML preview:', html.slice(0, 300));
    return;
  }
  const vqd = vqdMatch[1];
  console.log('VQD:', vqd);

  // Extract cookies
  const cookies = res1.headers.get('set-cookie') || '';
  console.log('Cookies present:', !!cookies);

  const url2 = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`;
  const res2 = await fetch(url2, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Referer': 'https://duckduckgo.com/',
      'Cookie': cookies,
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  console.log('Res2 status:', res2.status);
  if (res2.ok) {
    const data = await res2.json();
    console.log('DDG results count:', (data.results || []).length);
    if (data.results && data.results.length > 0) {
      console.log('Sample image 1:', data.results[0].title, '->', data.results[0].image);
      console.log('Sample image 2:', data.results[1].title, '->', data.results[1].image);
    }
  }
}

testDDGWithCookies();
