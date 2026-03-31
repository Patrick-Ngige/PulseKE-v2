/** Instagram Graph API Service
 * Fetches real influencer data from Instagram
 * Falls back to static data if API is unavailable
 */

export async function getInstagramUser(handle: string) {
  try {
    // Check if API key is available
    const apiKey = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN
    if (!apiKey) {
      console.log('[v0] Instagram API key not configured, using static data')
      return null
    }

    const response = await fetch(
      `https://graph.instagram.com/v18.0/ig_hashtag_search?user_id=${process.env.NEXT_PUBLIC_INSTAGRAM_BUSINESS_ID}&hashtag_name=${handle}&fields=id,name&access_token=${apiKey}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) return null
    
    const data = await response.json()
    return data

  } catch (error) {
    console.error('[v0] Instagram API error:', error)
    return null
  }
}

// Batch fetch multiple users
export async function getInstagramUsers(handles: string[]) {
  const results = await Promise.all(
    handles.map(handle => getInstagramUser(handle))
  )
  return results.filter(Boolean)
}
