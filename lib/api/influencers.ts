/** Influencer Data Fetching Service
 * Attempts to fetch real data from platforms
 * Falls back to static Kenya data when APIs unavailable
 */

import { INFLUENCERS } from '@/data/kenya'

export interface PlatformAccount {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter'
  handle: string
  followers: number
  engRate: number
}

export interface InfluencerData {
  id: string
  name: string
  niche: string
  bio: string
  avatar: string
  accounts: PlatformAccount[]
  verified: boolean
  riskScore: number
}

/** Fetch influencer list from configured APIs or return static data */
export async function fetchInfluencers(limit?: number): Promise<InfluencerData[]> {
  try {
    // Try to fetch from custom backend if configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL
    if (backendUrl) {
      console.log('[v0] Attempting to fetch from backend API...')
      const response = await fetch(`${backendUrl}/api/influencers?limit=${limit || 50}`, {
        next: { revalidate: 300 } // Cache for 5 minutes
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Successfully fetched from backend:', data.length, 'influencers')
        return data
      }
    }

    // Try to fetch from Instagram Business API if configured
    if (process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN) {
      console.log('[v0] Attempting to fetch from Instagram API...')
      // This would need proper implementation with Instagram's actual API
      // For now, we just fall through to static data
    }

    // Fallback to static data
    console.log('[v0] Using static Kenya influencer data')
    return (INFLUENCERS as any[])
      .map((inf, idx) => ({
        id: `inf-${idx + 1}`,
        name: inf.name,
        niche: inf.niche,
        bio: inf.bio,
        avatar: inf.avatar,
        accounts: inf.accounts,
        verified: inf.verified,
        riskScore: inf.riskScore
      }))
      .slice(0, limit)
      
  } catch (error) {
    console.error('[v0] Error fetching influencers:', error)
    // Final fallback to static data
    return INFLUENCERS as any[]
  }
}

/** Search influencers by name, niche, or handle */
export async function searchInfluencers(query: string): Promise<InfluencerData[]> {
  const all = await fetchInfluencers()
  const lowercaseQuery = query.toLowerCase()
  
  return all.filter(inf =>
    inf.name.toLowerCase().includes(lowercaseQuery) ||
    inf.niche.toLowerCase().includes(lowercaseQuery) ||
    inf.bio.toLowerCase().includes(lowercaseQuery) ||
    inf.accounts.some(acc => acc.handle.toLowerCase().includes(lowercaseQuery))
  )
}

/** Get single influencer by ID */
export async function getInfluencer(id: string): Promise<InfluencerData | null> {
  const all = await fetchInfluencers()
  return all.find(inf => inf.id === id) || null
}

/** Filter influencers by criteria */
export async function filterInfluencers(
  niche?: string,
  minFollowers?: number,
  maxRiskScore?: number
): Promise<InfluencerData[]> {
  const all = await fetchInfluencers()
  
  return all.filter(inf => {
    if (niche && !inf.niche.toLowerCase().includes(niche.toLowerCase())) return false
    if (minFollowers && Math.min(...inf.accounts.map(a => a.followers)) < minFollowers) return false
    if (maxRiskScore && inf.riskScore > maxRiskScore) return false
    return true
  })
}

/** Get trending influencers by engagement rate */
export async function getTrendingInfluencers(limit = 10): Promise<InfluencerData[]> {
  const all = await fetchInfluencers()
  const avgEngRates = all.map(inf => ({
    ...inf,
    avgEngRate: inf.accounts.reduce((sum, acc) => sum + acc.engRate, 0) / inf.accounts.length
  }))
  
  return avgEngRates
    .sort((a, b) => b.avgEngRate - a.avgEngRate)
    .slice(0, limit)
}
