import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

  const key = process.env.PAGESPEED_API_KEY;
  const endpoint = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES${key ? `&key=${key}` : ''}`;

  try {
    const res  = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`PageSpeed ${res.status}`);
    const data = await res.json();

    const cats   = data.categories ?? {};
    const items  = data.lighthouseResult?.audits?.metrics?.details?.items?.[0] ?? {};
    const audits = data.lighthouseResult?.audits ?? {};
    const crux   = data.loadingExperience;

    const opportunities: { title: string; savings: number }[] = [];
    for (const a of Object.values(audits) as any[]) {
      if (a?.details?.type === 'opportunity' && a.score != null && a.score < 0.9) {
        opportunities.push({ title: a.title, savings: a.details.overallSavingsMs ?? 0 });
      }
    }
    opportunities.sort((a, b) => b.savings - a.savings);

    return NextResponse.json({
      performance:   cats.performance?.score   != null ? Math.round(cats.performance.score   * 100) : null,
      seo:           cats.seo?.score            != null ? Math.round(cats.seo.score            * 100) : null,
      accessibility: cats.accessibility?.score  != null ? Math.round(cats.accessibility.score  * 100) : null,
      bestPractices: cats['best-practices']?.score != null ? Math.round(cats['best-practices'].score * 100) : null,
      lcp:  items['largest-contentful-paint']  ?? null,
      fcp:  items['first-contentful-paint']    ?? null,
      ttfb: items['time-to-first-byte']        ?? null,
      cls:  items['cumulative-layout-shift']   ?? null,
      fid:  items['total-blocking-time']       ?? null,
      opportunities: opportunities.slice(0, 4),
      assessment: crux?.overall_category === 'FAST' ? 'passed' : crux?.overall_category === 'SLOW' ? 'failed' : 'unknown',
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
