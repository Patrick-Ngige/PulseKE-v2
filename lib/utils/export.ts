// CSV Export Utilities

export interface ExportOptions {
  filename?: string
  headers?: string[]
}

/**
 * Convert array of objects to CSV and download
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  const filename = options.filename || `export-${Date.now()}.csv`
  
  // Get headers from first object if not provided
  const headers = options.headers || Object.keys(data[0])
  
  // Build CSV header row
  const csvHeaders = headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',')
  
  // Build CSV data rows
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header]
      
      // Handle different types
      if (value === null || value === undefined) {
        return ''
      }
      
      const stringValue = String(value)
      
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      
      return stringValue
    }).join(',')
  )
  
  // Combine header and rows
  const csv = [csvHeaders, ...csvRows].join('\n')
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Export influencers data to CSV
 */
export function exportInfluencersToCSV(influencers: any[]): void {
  const headers = ['Name', 'Handle', 'Platform', 'Followers', 'Engagement Rate', 'Niche', 'AI Score', 'Status']
  
  const data = influencers.flatMap(inf =>
    inf.accounts.map((acc: any) => ({
      Name: inf.name,
      Handle: acc.handle,
      Platform: acc.platform.toUpperCase(),
      Followers: acc.followers,
      'Engagement Rate': `${acc.engRate}%`,
      Niche: inf.niche.join('; '),
      'AI Score': inf.aiScore,
      Status: inf.status,
    }))
  )
  
  exportToCSV(data, {
    filename: `influencers-${new Date().toISOString().split('T')[0]}.csv`,
    headers,
  })
}

/**
 * Export campaigns data to CSV
 */
export function exportCampaignsToCSV(campaigns: any[]): void {
  const headers = ['Campaign', 'Brand', 'Budget (KES)', 'Spent (KES)', 'Influencers', 'Status', 'Launch', 'Deadline']
  
  const data = campaigns.map(camp => ({
    Campaign: camp.name,
    Brand: camp.brand,
    'Budget (KES)': camp.budget,
    'Spent (KES)': camp.spent,
    Influencers: camp.influencers,
    Status: camp.status,
    Launch: camp.launch,
    Deadline: camp.deadline,
  }))
  
  exportToCSV(data, {
    filename: `campaigns-${new Date().toISOString().split('T')[0]}.csv`,
    headers,
  })
}
