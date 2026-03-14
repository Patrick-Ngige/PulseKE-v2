import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildAuditPrompt } from '@/lib/auditPrompt';
import { extractJSON, slugify } from '@/lib/utils';
import { AuditResult, IntelligenceContext, PageSpeedData } from '@/lib/auditTypes';

export const runtime     = 'nodejs';
export const maxDuration = 120;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BASE = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

export async function POST(req: NextRequest) {
  try {
    const { url, focus = 'Full audit' } = await req.json();
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

    const hostname = new URL(url).hostname.replace(/^www\./, '');
    const brand    = hostname.split('.')[0];

    // ── Step 1: PageSpeed + Intelligence in parallel ──────────────────────────
    const [psSettled, intSettled] = await Promise.allSettled([
      fetch(`${BASE()}/api/pagespeed?url=${encodeURIComponent(url)}`).then(r => r.json()),
      fetch(`${BASE()}/api/intelligence`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url, brand }),
      }).then(r => r.json()),
    ]);

    const pageSpeed: PageSpeedData | null =
      psSettled.status === 'fulfilled' && !psSettled.value.error ? psSettled.value : null;

    const intelligence: IntelligenceContext =
      intSettled.status === 'fulfilled' && !intSettled.value.error
        ? intSettled.value
        : { siteOverview: '', socialProfiles: '', paidAds: '', appStore: '', reputation: '', competitors: '' };

    // ── Step 2: Build and run the audit ───────────────────────────────────────
    const prompt = buildAuditPrompt({ url, focus, intelligence, pageSpeed });

    const auditRes = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages:   [{ role: 'user', content: prompt }],
    });

    const rawText = auditRes.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n');
    const data    = extractJSON(rawText);
    if (!data) return NextResponse.json({ error: 'Could not parse audit', raw: rawText.slice(0, 400) }, { status: 500 });

    const result: AuditResult = {
      id:        `audit_${Date.now()}`,
      url,
      siteName:  data.siteName   ?? brand,
      slug:      slugify(data.siteName ?? brand),
      createdAt: new Date().toISOString(),
      focus,

      overallScore: data.overallScore ?? 0,
      overallLabel: data.overallLabel ?? '',
      tagline:      data.tagline      ?? '',

      intelligenceBanner: data.intelligenceBanner ?? '',
      execSummary:        data.execSummary        ?? '',
      patricksPOV:        data.patricksPOV        ?? '',

      dimensions:   data.dimensions   ?? {},
      growthLoops:  data.growthLoops  ?? [],
      magicMoments: data.magicMoments ?? [],

      roadmap: {
        week1:    data.roadmap?.week1    ?? [],
        month1:   data.roadmap?.month1   ?? [],
        quarter1: data.roadmap?.quarter1 ?? [],
      },

      furtherReading: data.furtherReading ?? [],
      stitchPrompts:  data.stitchPrompts  ?? [],
      pageSpeed:      pageSpeed ?? undefined,
      published:      false,
    };

    // ── Step 3: Persist to Vercel KV if available ─────────────────────────────
    if (process.env.KV_REST_API_URL) {
      try {
        const { kv } = await import('@vercel/kv');
        await kv.set(`audit:${result.id}`, JSON.stringify(result), { ex: 60 * 60 * 24 * 90 }); // 90 days
        await kv.lpush('audit:list', result.id);
      } catch (kvErr) {
        console.warn('[audit] KV unavailable (non-fatal)');
      }
    }

    return NextResponse.json(result);
  } catch (e: any) {
    console.error('[audit]', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
