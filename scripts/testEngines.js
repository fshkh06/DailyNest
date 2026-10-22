async function testUnsplashHtml() {
  try {
    const url = 'https://unsplash.com/s/photos/wireless-earbuds';
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    console.log('Unsplash HTML status:', res.status);
    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (match) {
      const data = JSON.parse(match[1]);
      console.log('Found __NEXT_DATA__!');
      const results = data.props?.pageProps?.initialSearch?.photos?.results || [];
      console.log('Unsplash search results count:', results.length);
      for (let i = 0; i < Math.min(3, results.length); i++) {
        console.log(`[${i}] ID: ${results[i].id}, Alt: ${results[i].alt_description}, URL: ${results[i].urls?.regular}`);
      }
    } else {
      console.log('No __NEXT_DATA__ found. Testing regex for images.unsplash.com...');
      const urls = [...html.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g)].map(m => m[0]);
      console.log('Found unsplash photo URLs:', urls.length);
      if (urls.length > 0) console.log('Sample:', urls[0]);
    }
  } catch (e) {
    console.error('Unsplash test error:', e.message);
  }
}

testUnsplashHtml();
