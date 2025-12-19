# ScamSpot - Quick Start Guide (No Setup Required!)

## 🚀 Get Started in 1 Minute - No API Keys, No Backend Needed!

### Step 1: Install Chrome Extension (1 minute)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (top right toggle)
3. Click **"Load unpacked"**
4. Select the `extension-dist` folder from this repository
5. Done! The extension icon should appear in your toolbar

### Step 2: Start Protecting Yourself (10 seconds)

1. Click the ScamSpot icon in Chrome toolbar
2. Click **"▶ Start Monitoring"**
3. Visit Gmail, WhatsApp Web, Instagram, or any supported platform
4. ScamSpot will automatically scan and highlight risky links in **RED**

## ✅ You're Protected!

The extension now works **completely standalone** with:
- ✅ Real-time URL risk analysis (10+ security checks per link)
- ✅ Phishing keyword detection
- ✅ Visual warnings for dangerous links (red borders + tooltips)
- ✅ Click protection (warns before opening suspicious links)
- ✅ Brand impersonation detection
- ✅ Works offline - no internet connection needed for basic features!

## 🎯 Supported Platforms

- Gmail
- WhatsApp Web
- Telegram Web
- Instagram
- Snapchat Web
- Facebook Messenger

## 🔧 How It Works (Without Backend)

ScamSpot uses **client-side analysis** to protect you:

**URL Analysis:**
- Suspicious domain extensions (.xyz, .top, .click, etc.)
- IP addresses instead of domain names
- Too many subdomains
- Phishing keywords in URLs
- Brand impersonation attempts
- URL shorteners (hiding destination)
- Homograph attacks (lookalike characters)
- Excessive hyphens
- Unusually long URLs
- Insecure HTTP for login pages

**Content Analysis:**
- Detects phishing phrases like "verify your account", "account suspended"
- Flags urgent action requests
- Identifies reward scams
- Recognizes payment update requests

## 🎁 Optional: Advanced Features (Requires Backend)

Want AI-powered deep analysis? Optionally set up the backend for:
- ✨ OpenAI GPT-4 scam message analysis
- ✨ Azure sentiment analysis
- ✨ Google Safe Browsing API integration
- ✨ Image analysis for scam detection
- ✨ Historical threat tracking with MongoDB

**To enable advanced features:**
```bash
unzip project_backend.zip -d backend
cd backend
npm install
# Create .env with your API keys (see EXTENSION_SETUP.md)
npm start
```

The extension will **automatically detect** when the backend is running and enable advanced features!

## ❗ Troubleshooting

**Extension won't load?**
- Enable Developer Mode in `chrome://extensions/`

**Links not highlighting?**
- Click "Start Monitoring" in the popup
- Refresh the page you're monitoring
- Make sure you're on a supported platform (Gmail, WhatsApp, etc.)

**Need more help?**
- See [EXTENSION_SETUP.md](EXTENSION_SETUP.md) for detailed instructions
- Check browser console (F12) for error messages

## 🛡️ Privacy

- ✅ All analysis happens in your browser
- ✅ No data sent to third parties
- ✅ No tracking, no analytics
- ✅ Works completely offline
- ✅ Open source - review the code yourself!

**Note:** If you enable the optional backend, API calls will be made to OpenAI, Azure, and Google Safe Browsing for enhanced analysis. This is completely optional!

## 🚀 Start Now!

You're literally 1 minute away from protecting yourself from scams. Just install the extension and you're done!

No configuration. No API keys. No hassle. Just protection.
