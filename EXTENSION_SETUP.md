# ScamSpot Chrome Extension - Setup Guide

## Overview
ScamSpot is a Chrome extension that detects and flags potential scams in emails (Gmail), and chat platforms (WhatsApp, Telegram, Instagram, Snapchat, Facebook Messenger). It uses AI-powered analysis to identify suspicious links and phishing content.

## Prerequisites

Before installing the extension, you need to set up the backend service:

### Backend Setup

1. **Install Node.js** (v14 or higher)
2. **Install MongoDB** and ensure it's running
3. **Get API Keys** for:
   - OpenAI API
   - Azure Cognitive Services (Text Analytics)
   - Google Safe Browsing API

4. **Extract and setup the backend**:
   ```bash
   # Unzip the backend service
   unzip project_backend.zip -d backend
   cd backend

   # Install dependencies
   npm install

   # Create .env file with your API keys
   cat > .env << EOF
   OPENAI=your_openai_api_key
   MONGODB_URI=your_mongodb_connection_string
   AZURE_TEXT_ANALYTICS_KEY=your_azure_key
   AZURE_TEXT_ANALYTICS_ENDPOINT=your_azure_endpoint
   GOOGLE_SAFE_BROWSING_API_KEY=your_google_api_key
   PORT=3000
   EOF

   # Start the backend server
   npm start
   ```

The backend should now be running on `http://localhost:3000`

## Chrome Extension Installation

### Method 1: Load Unpacked Extension (Recommended for Development)

1. **Build is ready** at `./extension-dist` directory in the project root

2. **Open Chrome** and navigate to:
   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode** (toggle in the top-right corner)

4. **Click "Load unpacked"**

5. **Select the `extension-dist` folder** from this project:
   ```
   /path/to/ScamSpot/extension-dist
   ```

6. The extension should now appear in your Chrome toolbar!

### Method 2: Rebuild from Source

If you want to modify the extension:

```bash
cd chrome-extension
npm install
npm run build
```

Then load the `build` folder as described in Method 1.

## How to Use ScamSpot

### 1. **Start Monitoring**

- Click the ScamSpot icon in your Chrome toolbar
- The popup will open showing the monitoring dashboard
- Click **"▶ Start Monitoring"** to begin scanning

### 2. **Automatic Scanning**

The extension automatically monitors these platforms:
- ✅ Gmail (`mail.google.com`)
- ✅ WhatsApp Web (`web.whatsapp.com`)
- ✅ Telegram Web (`web.telegram.org`)
- ✅ Instagram (`www.instagram.com`)
- ✅ Snapchat Web (`web.snapchat.com`)
- ✅ Facebook Messenger (`messenger.com`)

### 3. **What It Does**

When you visit any of the supported platforms:

- **Scans all links** on the page automatically
- **Highlights risky links** with red borders and warning indicators
- **Captures screenshots** of suspicious content (last 5 stored)
- **Detects phishing keywords** like "verify", "urgent", "password", "suspended"
- **Shows alerts** in the popup dashboard

### 4. **View Results**

In the popup dashboard, you'll see:

- **Recent Alerts**: Phishing detection warnings with risk levels
- **Recent Captures**: Screenshots of monitored pages
- **Keyword Occurrences**: Search for specific scam-related terms

### 5. **Authentication (Optional)**

For advanced features:
- Click **"Sign in with Google"** in the popup
- This enables additional backend analysis features

## Features

### 🛡️ Real-time Link Validation
- Every link on monitored pages is checked against multiple databases
- Uses Google Safe Browsing API, machine learning, and heuristic analysis

### 🚨 Visual Warnings
- Risky links are highlighted in **red** with warning tooltips
- "⚠️ High-Risk Link" banners appear next to suspicious URLs

### 📸 Screenshot Capture
- Automatic screenshots every 12 seconds while monitoring
- Helps document suspicious content

### 🔍 Phishing Detection
- Scans page content for common phishing keywords
- Provides risk assessment (0-100%)

### 💾 Local Storage
- Settings, screenshots, and alerts stored locally
- Privacy-focused: your data stays on your machine

## Troubleshooting

### Extension not loading
- Make sure Developer Mode is enabled in `chrome://extensions/`
- Verify all files are present in the `build` folder
- Check browser console (F12) for errors

### Backend connection errors
- Ensure the backend is running on `http://localhost:3000`
- Check that your `.env` file has all required API keys
- Verify MongoDB is running

### Links not being highlighted
- Make sure monitoring is **started** (click the start button)
- Check that you're on a supported platform (Gmail, WhatsApp, etc.)
- Open the browser console (F12) and look for errors

### "Failed to fetch" errors
- The backend server must be running
- Check CORS settings if using a different port
- Verify network connectivity

## API Endpoints Used

The extension communicates with these backend endpoints:

- `POST /validate-url` - Validates URLs for scam/phishing indicators
- `POST /auth/google-login` - Google OAuth authentication
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - Logout user

## Privacy & Security

- ✅ All analysis happens on your local machine and backend
- ✅ No data is sent to third parties (except API providers for analysis)
- ✅ Screenshots and alerts are stored locally in Chrome storage
- ✅ Only works on specified domains (Gmail, WhatsApp, etc.)

## Development

### Project Structure

```
ScamSpot/
├── extension-dist/             # Built extension (load this in Chrome)
│   ├── manifest.json          # Extension configuration
│   ├── background.js          # Service worker
│   ├── contentScript.js       # Content script injected into pages
│   ├── index.html             # Popup UI
│   └── static/                # Compiled React app
├── chrome-extension/          # Source code
│   ├── src/
│   │   ├── App.tsx           # Main popup component
│   │   └── context/
│   │       └── ApiContext.tsx # State management
│   └── public/
│       ├── manifest.json      # Manifest source
│       ├── background.js      # Background script
│       └── contentScript.js   # Content script
└── backend/                   # Backend service (from zip)
```

### Making Changes

1. Edit files in `chrome-extension/src/` or `chrome-extension/public/`
2. Rebuild: `cd chrome-extension && npm run build`
3. In Chrome, go to `chrome://extensions/` and click reload icon on ScamSpot

## Supported Platforms

| Platform | URL Pattern | Status |
|----------|-------------|--------|
| Gmail | `mail.google.com` | ✅ Supported |
| WhatsApp Web | `web.whatsapp.com` | ✅ Supported |
| Telegram Web | `web.telegram.org` | ✅ Supported |
| Instagram | `www.instagram.com` | ✅ Supported |
| Snapchat Web | `web.snapchat.com` | ✅ Supported |
| Messenger | `messenger.com` | ✅ Supported |

## Known Limitations

- Maximum 5 screenshots stored at a time (oldest deleted)
- Maximum 5 alerts stored at a time
- Requires backend server to be running locally
- Only works on specified domains
- Screenshot capture interval is 12 seconds

## Contributing

To contribute to ScamSpot:

1. Fork the repository
2. Make your changes in the `chrome-extension/` folder
3. Test thoroughly on all supported platforms
4. Submit a pull request

## License

See LICENSE file in the repository.

## Support

For issues or questions:
- Check the browser console (F12) for error messages
- Verify backend is running and accessible
- Ensure all API keys are correctly configured
- Review the troubleshooting section above
