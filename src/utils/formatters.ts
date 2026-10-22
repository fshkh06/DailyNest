export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getEstimatedDeliveryDate(daysFromNow: number = 3): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(d);
}

export function getCategoryFallbackImage(category?: string, name?: string): string {
  const cat = (category || '').toLowerCase();
  let bg = '%23F4F7F5';
  let accent = '%2312B76A';
  let dark = '%230F3427';
  let label = 'Home & Living';
  let iconPath = 'M300 180 L420 280 L380 280 L380 400 L220 400 L220 280 L180 280 Z'; // House / Home

  if (cat.includes('kitchen') || cat.includes('dining')) {
    bg = '%23FDF8F5';
    accent = '%23EA580C';
    dark = '%237C2D12';
    label = 'Kitchen & Dining';
    iconPath = 'M240 220 C240 190 360 190 360 220 L360 360 C360 390 240 390 240 360 Z M380 260 L410 260 C420 260 420 320 410 320 L380 320'; // Cup / Pot
  } else if (cat.includes('tech') || cat.includes('electronic')) {
    bg = '%23F0F7FF';
    accent = '%230284C7';
    dark = '%230C4A6E';
    label = 'Electronics & Tech';
    iconPath = 'M230 260 C230 200 370 200 370 260 L370 340 C370 370 350 380 330 380 L330 310 L270 310 L270 380 C250 380 230 370 230 340 Z'; // Headphones
  } else if (cat.includes('fashion') || cat.includes('accessories')) {
    bg = '%23FDF4F6';
    accent = '%23C026D3';
    dark = '%23701A75';
    label = 'Fashion & Accessories';
    iconPath = 'M240 240 L300 280 L360 240 L400 400 L200 400 Z'; // Apparel
  } else if (cat.includes('beauty') || cat.includes('personal')) {
    bg = '%23FDF2F8';
    accent = '%23DB2777';
    dark = '%23831843';
    label = 'Personal Care & Beauty';
    iconPath = 'M280 200 L320 200 L320 240 L340 260 L340 390 C340 405 260 405 260 390 L260 260 L280 240 Z'; // Dropper / bottle
  } else if (cat.includes('travel') || cat.includes('lifestyle')) {
    bg = '%23F0FDF9';
    accent = '%230D9488';
    dark = '%23134E4A';
    label = 'Travel & Lifestyle';
    iconPath = 'M240 240 L240 200 C240 190 360 190 360 200 L360 240 L400 240 L400 390 L200 390 L200 240 Z'; // Luggage
  } else if (cat.includes('gift') || cat.includes('stationery')) {
    bg = '%23FEFCE8';
    accent = '%23D97706';
    dark = '%23713F12';
    label = 'Gifts & Stationery';
    iconPath = 'M230 220 L370 220 L370 380 L230 380 Z M230 290 L370 290 M300 220 L300 380'; // Gift / Book
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" fill="none"><rect width="600" height="600" fill="${bg}"/><rect x="60" y="60" width="480" height="480" rx="28" fill="white" stroke="${bg}" stroke-width="2"/><circle cx="300" cy="280" r="110" fill="${accent}" opacity="0.12"/><path d="${iconPath}" fill="${dark}" opacity="0.75"/><text x="300" y="445" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="700" fill="${dark}" text-anchor="middle">${label}</text><text x="300" y="475" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="600" fill="${accent}" text-anchor="middle" letter-spacing="1">DAILYNEST VERIFIED PRODUCT</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Fallback high-quality SVG data URL for any product image loading error
export const FALLBACK_PRODUCT_IMAGE = getCategoryFallbackImage();

