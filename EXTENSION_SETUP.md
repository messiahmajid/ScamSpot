# ScamSpot Chrome Extension - Setup Guide

## Overview
ScamSpot is a Chrome extension that detects and flags potential scams in emails (Gmail) and chat platforms (WhatsApp, Telegram, Instagram, Snapchat, Facebook Messenger). It works standalone with client-side heuristics, and optionally connects to a backend for AI-powered analysis.

## Quick Start (No Backend Needed)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. Select the `extension-dist` folder from this project
5. Navigate to Gmail, WhatsApp, or any supported platform — scanning starts automatically

## Optional: Backend Setup

The extension works fully standalone. For AI-powered analysis via OpenAI, Azure, and Google Safe Browsing, set up the backend:

1. **Install Node.js** (v14 or higher)
2. **Set up the backend**:
   ```bash
   cd backend
   npm install

   # Create .env file with your API keys
   cat > .env << EOF
   OPENAI=your_openai_api_key
   MONGO=your_mongodb_connection_string
   AZUREKEY=your_azure_key
   AZUREURL=your_azure_endpoint
   GOOGLE_SAFE_BROWSING_API_KEY=your_google_api_key
   PORT=3000
   EOF

   npm start
   ```

The extension auto-detects the backend. When connected, the popup shows "Backend Connected" and links are analyzed with both local heuristics and server-side AI.

## How It Works

### Automatic Scanning
The extension automatically scans all links when you visit a supported platform. No need to click anything.

### Supported Platforms

| Platform | URL Pattern | Status |
|----------|-------------|--------|
| Gmail | `mail.google.com` | Supported |
| WhatsApp Web | `web.whatsapp.com` | Supported |
| Telegram Web | `web.telegram.org` | Supported |
| Instagram | `www.instagram.com` | Supported |
| Snapchat Web | `web.snapchat.com` | Supported |
| Messenger | `messenger.com` | Supported |

### What It Does

- **Scans all links** on the page, caching results to avoid redundant work
- **Flags risky links** with a red outline and warning badge (no layout-breaking inline styles)
- **Shows a warning overlay** when you click a flagged link, with risk score, reasons, and options to block, continue, or report a false positive
- **Detects phishing phrases** like "verify your account", "urgent action required", etc.
- **Tracks scan stats** visible in the popup dashboard

### Popup Dashboard

Click the ScamSpot icon in your toolbar to see:

- **Protection status** — Active/Inactive based on current tab
- **Platform** — Which platform is being monitored
- **Scan stats** — Total links scanned and flagged
- **Last scan time**
- **Scan Now** button for manual rescans
- **Flagged URLs** — Recent risky links with risk scores
- **Backend status** — Whether the backend server is connected

### Warning Overlay

When you click a flagged link, a modal overlay appears with:

- **Risk score** (color-coded: red for high, yellow for medium, green for low)
- **The URL** being visited
- **Reasons** the link was flagged
- **Go Back to Safety** — close the overlay
- **Continue Anyway** — open the link in a new tab
- **Report False Positive** — whitelist the URL so it won't be flagged again

## Development

### Project Structure

```
ScamSpot/
├── extension-dist/             # Built extension (load this in Chrome)
│   ├── manifest.json           # Extension configuration
│   ├── background.js           # Service worker
│   ├── contentScript.js        # Content script injected into pages
│   ├── index.html              # Popup UI
│   └── static/                 # Compiled React app
├── chrome-extension/           # Source code
│   ├── src/
│   │   ├── App.tsx             # Popup dashboard component
│   │   ├── App.css             # Popup styles
│   │   └── setupTests.ts       # Test setup with chrome API mocks
│   └── public/
│       ├── manifest.json       # Manifest source
│       ├── background.js       # Background service worker
│       └── contentScript.js    # Content script (scanning, cache, overlay)
└── backend/                    # Optional backend service
```

### Making Changes

1. Edit files in `chrome-extension/src/` or `chrome-extension/public/`
2. Rebuild and sync to `extension-dist/`:
   ```bash
   cd chrome-extension
   npm run build:dist
   ```
3. In Chrome, go to `chrome://extensions/` and click the reload icon on ScamSpot

### Running Tests

```bash
cd chrome-extension
npm test
```

## Troubleshooting

### Extension not loading
- Make sure Developer Mode is enabled in `chrome://extensions/`
- Check browser console (F12) for errors

### Links not being flagged
- Make sure you're on a supported platform
- Try clicking "Scan Now" in the popup
- Open the browser console (F12) and look for ScamSpot log messages

### Backend connection issues
- Ensure the backend is running on `http://localhost:3000`
- Check that your `.env` file has all required API keys
- The extension works without the backend — standalone mode uses local heuristics

## Privacy

- All local analysis happens entirely in your browser
- No data is sent to third parties unless the backend is configured with external APIs
- Scan results and settings are stored locally in Chrome storage
- The extension only activates on specified domains
