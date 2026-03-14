import { MetadataRoute } from 'next';
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ngige-audit.vercel.app';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                        lastModified: new Date(), priority: 1.0 },
    { url: `${BASE}/portfolio`,         lastModified: new Date(), priority: 0.9 },
    { url: `${BASE}/services`,          lastModified: new Date(), priority: 0.85 },
    { url: `${BASE}/portfolio/safaricom`,            lastModified: new Date(), priority: 0.7 },
    { url: `${BASE}/portfolio/piggyvest`,            lastModified: new Date(), priority: 0.7 },
    { url: `${BASE}/portfolio/cowrywise`,            lastModified: new Date(), priority: 0.7 },
    { url: `${BASE}/portfolio/network-international`,lastModified: new Date(), priority: 0.7 },
    { url: `${BASE}/portfolio/paystack`,             lastModified: new Date(), priority: 0.7 },
  ];
}
