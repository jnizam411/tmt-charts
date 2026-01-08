# TMT Market Overview Charts

A clean, modern stock chart widget for embedding in Notion. Features interactive time range selection, real-time quotes, and a ticker tape display for TMT sector ETFs.

## Features

- **Ticker Tape**: Quick overview of 6 major tech ETFs (QQQ, XLK, VGT, SOXX, IGV, ARKK)
- **Interactive Charts**: Clean area charts powered by Lightweight Charts
- **Time Ranges**: 1D, 5D, 1M, 6M, YTD, 1Y, 5Y
- **Auto-Refresh**: Updates every 5 minutes
- **Secure**: API key stored server-side, never exposed to users
- **Responsive**: Works on desktop and mobile

## ETFs Included

| Ticker | Name | Focus |
|--------|------|-------|
| QQQ | Invesco QQQ Trust | Nasdaq-100 |
| XLK | Technology Select SPDR | S&P 500 Tech Sector |
| VGT | Vanguard Info Tech ETF | Broad Tech |
| SOXX | iShares Semiconductor | Semiconductors |
| IGV | iShares Expanded Tech-Software | Software |
| ARKK | ARK Innovation ETF | Disruptive Innovation |

---

## Deployment Instructions

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create an account)
2. Click the **+** icon in the top right → **New repository**
3. Name it `tmt-charts` (or whatever you prefer)
4. Keep it **Public** (required for free Vercel hosting)
5. Click **Create repository**
6. Upload all the files from this project:
   - `index.html`
   - `vercel.json`
   - `package.json`
   - `api/stock.js`
   - `api/quote.js`

**Quick upload method:**
- On the repository page, click **"uploading an existing file"** link
- Drag and drop all files (maintain the `api/` folder structure)
- Click **Commit changes**

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **Project**
3. Find and select your `tmt-charts` repository
4. Vercel will auto-detect the configuration
5. **Before deploying**, expand **Environment Variables** and add:
   - **Name**: `TWELVE_DATA_API_KEY`
   - **Value**: Your Twelve Data API key
6. Click **Deploy**
7. Wait ~1 minute for deployment to complete
8. You'll get a URL like `https://tmt-charts.vercel.app`

### Step 3: Embed in Notion

1. Open your TMT Dashboard page in Notion
2. Click where you want the chart (top of the page)
3. Type `/embed` and select **Embed**
4. Paste your Vercel URL (e.g., `https://tmt-charts.vercel.app`)
5. Press Enter
6. Resize the embed block:
   - Drag the corners to adjust width
   - **Recommended height**: ~550px (drag the bottom edge)

---

## Customization

### Changing ETFs

Edit `index.html` and modify the `ETF_CONFIG` object:

```javascript
const ETF_CONFIG = {
  QQQ: { name: 'Invesco QQQ Trust', description: 'Nasdaq-100' },
  // Add or remove ETFs here
  AAPL: { name: 'Apple Inc.', description: 'Individual Stock' },
};
```

### Changing Colors

Edit the CSS variables in `index.html`:

```css
:root {
  --bg-primary: #0a0a0b;        /* Main background */
  --accent-blue: #3b82f6;       /* Chart line color */
  --accent-green: #22c55e;      /* Positive change */
  --accent-red: #ef4444;        /* Negative change */
}
```

### Light Theme

Replace the color scheme in `:root` with light colors, for example:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --border-color: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
}
```

---

## Uptime & Maintenance

### What Runs Automatically

- **Vercel hosting**: 100% managed, no server maintenance
- **SSL certificate**: Auto-renewed by Vercel
- **Deployments**: Auto-deploy when you push changes to GitHub

### What Might Need Attention

| Item | Frequency | Action |
|------|-----------|--------|
| API rate limits | Rare | If you see errors, check Twelve Data dashboard |
| API key expiration | Check Twelve Data | Rotate key in Vercel if needed |
| Library updates | Optional | Update Lightweight Charts CDN version |
| ETF changes | As needed | Update config if ETFs change/delist |

### Monitoring

- **Vercel Dashboard**: Shows deployment status, errors, and analytics
- **Twelve Data Dashboard**: Shows API usage against your 55/min limit

### Estimated API Usage

With 6 ETFs and default refresh rate:
- **Page load**: ~13 API calls (6 quotes + 1 chart + potential retries)
- **Auto-refresh**: ~7 calls every 5 minutes
- **User interactions**: 1 call per ticker/timeframe change

Your 55/min limit is plenty for normal use. Even with multiple users, Vercel's caching reduces redundant calls.

---

## Troubleshooting

### Chart Not Loading

1. Check browser console (F12 → Console) for errors
2. Verify API key is set correctly in Vercel:
   - Go to your project → Settings → Environment Variables
   - Confirm `TWELVE_DATA_API_KEY` exists and is correct
3. Redeploy after adding/changing environment variables

### "API key not configured" Error

- Environment variable not set in Vercel
- Fix: Add `TWELVE_DATA_API_KEY` in Vercel project settings, then redeploy

### Rate Limit Errors

- Too many requests in 1 minute
- The caching should prevent this, but if it happens:
  - Reduce number of ETFs
  - Increase auto-refresh interval (change `5 * 60 * 1000` in index.html)

### Notion Embed Shows Blank

- Vercel URL might be wrong
- Try opening the URL directly in a browser first
- Make sure to use the full URL with `https://`

---

## File Structure

```
tmt-charts/
├── index.html      # Main frontend (HTML + CSS + JavaScript)
├── vercel.json     # Vercel deployment configuration
├── package.json    # Project metadata
├── api/
│   ├── stock.js    # Serverless function for time series data
│   └── quote.js    # Serverless function for real-time quotes
└── README.md       # This file
```

---

## Costs

- **Vercel**: Free tier (100GB bandwidth/month, plenty for this use case)
- **Twelve Data**: Your existing plan (55 requests/min)
- **GitHub**: Free for public repos

**Total ongoing cost: $0** (assuming you stay within free tier limits)
