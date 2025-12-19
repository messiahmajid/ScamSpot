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
MONGODB_URI=mongodb://localhost:27017/scamspot
AZURE_TEXT_ANALYTICS_KEY=your_key_here
AZURE_TEXT_ANALYTICS_ENDPOINT=your_endpoint_here
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

1. Click the ScamSpot icon in Chrome toolbar
2. Click **"▶ Start Monitoring"**
3. Visit Gmail, WhatsApp Web, or any supported platform
4. ScamSpot will automatically scan and highlight risky links in **RED**

## ✅ You're Protected!

The extension now:
- ✅ Monitors your emails and chats
- ✅ Validates all links automatically
- ✅ Highlights scams and phishing attempts
- ✅ Captures screenshots of suspicious content
- ✅ Shows risk alerts in the popup

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
- Click "Start Monitoring" in the popup
- Refresh the page you're monitoring

**Need help?**
- See [EXTENSION_SETUP.md](EXTENSION_SETUP.md) for detailed instructions
