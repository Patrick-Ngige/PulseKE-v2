import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { intelligencePrompts } from '@/lib/auditPrompt';
import { IntelligenceContext } from '@/lib/auditTypes';

export const runtime     = 'nodejs';
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function search(prompt: string): Promise<string> {
  const res = await anthropic.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 800,
    tools:      [{ type: 'web_search_20250305' as any, name: 'web_search' }],
    messages:   [{ role: 'user', content: prompt }],
  });
  return res.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n').trim();
}

export async function POST(req: NextRequest) {
  try {
    const { url, brand } = await req.json();
    if (!url || !brand) return NextResponse.json({ error: 'url and brand required' }, { status: 400 });

    const results = await Promise.allSettled([
      search(intelligencePrompts.siteOverview(url)),
      search(intelligencePrompts.socialProfiles(url, brand)),
      search(intelligencePrompts.paidAds(brand)),
      search(intelligencePrompts.appStore(brand)),
      search(intelligencePrompts.reputation(brand)),
      search(intelligencePrompts.competitors(url, brand)),
    ]);

    const get = (r: PromiseSettledResult<string>, fallback: string) =>
      r.status === 'fulfilled' ? r.value : fallback;

    const context: IntelligenceContext = {
      siteOverview:   get(results[0], 'Site overview unavailable.'),
      socialProfiles: get(results[1], 'Social profiles unavailable.'),
      paidAds:        get(results[2], 'Ad intelligence unavailable.'),
      appStore:       get(results[3], 'App store data unavailable.'),
      reputation:     get(results[4], 'Reputation data unavailable.'),
      competitors:    get(results[5], 'Competitor data unavailable.'),
    };

    return NextResponse.json(context);
  } catch (e: any) {
    console.error('[intelligence]', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
