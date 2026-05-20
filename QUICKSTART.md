# ScamSpot - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Backend (2 minutes)

```bash
# Navigate to backend (already included, no unzipping needed!)
cd backend

# Run setup script (creates .env and installs dependencies)
./setup.sh

# OR manually:
npm install

# Add your API keys to .env (create this file)
echo "OPENAI=your_key_here
MONGO=mongodb://localhost:27017/scamspot
AZUREKEY=your_key_here
AZUREURL=your_endpoint_here
GOOGLE_SAFE_BROWSING_API_KEY=your_key_here
PORT=3000" > .env

# Start backend
npm start
```

### Step 2: Install Chrome Extension (1 minute)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (top right toggle)
3. Click **"Load unpacked"**
4. Select the `extension-dist` folder from this repository
5. Done! The extension icon should appear in your toolbar

### Step 3: Use It (30 seconds)

1. Navigate to Gmail, WhatsApp Web, or any supported platform
2. ScamSpot automatically scans all links on the page
3. Click the ScamSpot icon to see scan stats and flagged URLs
4. Click **"Scan Now"** in the popup to trigger a manual rescan

## ✅ You're Protected!

The extension now:
- ✅ Monitors your emails and chats automatically
- ✅ Validates all links with cached verdicts for speed
- ✅ Flags scams with warning badges and risk overlays
- ✅ Shows scan stats and flagged URLs in the popup

## 🎯 Supported Platforms

- Gmail
- WhatsApp Web
- Telegram Web
- Instagram
- Snapchat Web
- Facebook Messenger

## ❗ Troubleshooting

**Extension won't load?**
- Enable Developer Mode in `chrome://extensions/`

**Links not highlighting?**
- Make sure backend is running on port 3000
- Click "Scan Now" in the popup
- Refresh the page you're monitoring

**Need help?**
- See [EXTENSION_SETUP.md](EXTENSION_SETUP.md) for detailed instructions
