// Vercel Serverless Function - Real-time Quote
// This proxies requests to Twelve Data and keeps your API key secure

export default async function handler(req, res) {
  // Enable CORS for Notion embed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { symbol } = req.query;
  
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
    const params = new URLSearchParams({
      symbol,
      apikey: apiKey,
      format: 'JSON'
    });

    const url = `https://api.twelvedata.com/quote?${params}`;
    
    const response = await fetch(url);
    const data = await response.json();

    // Check for API errors
    if (data.status === 'error') {
      console.error('Twelve Data error:', data.message);
      return res.status(400).json({ error: data.message });
    }

    // Transform to simpler format
    const quote = {
      symbol: data.symbol,
      name: data.name,
      price: data.close,
      change: data.change,
      change_percent: data.percent_change,
      volume: data.volume,
      timestamp: data.timestamp
    };

    // Cache for 30 seconds
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    
    return res.status(200).json(quote);
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to fetch quote' });
  }
}
