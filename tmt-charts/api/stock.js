// Vercel Serverless Function - Time Series Data
// This proxies requests to Twelve Data and keeps your API key secure

export default async function handler(req, res) {
  // Enable CORS for Notion embed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { symbol, interval, outputsize } = req.query;
  
  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  // Get API key from environment variable (set in Vercel dashboard)
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  
  if (!apiKey) {
    console.error('TWELVE_DATA_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Build Twelve Data URL
    const params = new URLSearchParams({
      symbol,
      interval: interval || '1day',
      apikey: apiKey,
      format: 'JSON'
    });

    // Handle outputsize (can be number or 'ytd' for year-to-date)
    if (outputsize === 'ytd') {
      // Calculate trading days since start of year
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const daysSinceStart = Math.ceil((now - startOfYear) / (1000 * 60 * 60 * 24));
      const tradingDays = Math.ceil(daysSinceStart * 5 / 7); // Rough estimate
      params.append('outputsize', Math.min(tradingDays, 252));
    } else if (outputsize) {
      params.append('outputsize', outputsize);
    }

    const url = `https://api.twelvedata.com/time_series?${params}`;
    
    const response = await fetch(url);
    const data = await response.json();

    // Check for API errors
    if (data.status === 'error') {
      console.error('Twelve Data error:', data.message);
      return res.status(400).json({ error: data.message });
    }

    // Cache for 1 minute during market hours, 5 minutes otherwise
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}
