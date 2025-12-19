# ScamSpot - Phishing & Scam Detector Chrome Extension

> **Protect yourself from scams in emails and online chats - Works out-of-the-box, no setup required!**

ScamSpot is a Chrome extension that automatically detects and flags potential scams, phishing attempts, and malicious links in your emails (Gmail) and chat platforms (WhatsApp, Telegram, Instagram, Messenger, Snapchat). **Works standalone with client-side analysis - no API keys or backend server needed!**

## 🚀 Quick Start

**Just want it to work?** See [QUICKSTART-STANDALONE.md](QUICKSTART-STANDALONE.md) for 1-minute installation (NO setup required!)

**Want advanced AI features?** See [QUICKSTART.md](QUICKSTART.md) for full setup with backend.

**Detailed documentation?** See [EXTENSION_SETUP.md](EXTENSION_SETUP.md) for comprehensive instructions.

## ✨ What's New - Now Works Without Any Setup!

✅ **Standalone mode** - Works out-of-the-box, no backend or API keys needed!
✅ **Client-side URL analysis** - 10+ security checks per link
✅ **Phishing keyword detection** - Identifies common scam phrases
✅ **Visual warnings** - Highlights risky links in red
✅ **Click protection** - Warns before opening dangerous links
✅ **Optional backend** - Connect for AI-powered advanced features
✅ **Auto-detection** - Seamlessly switches between standalone and advanced mode

## 📦 Project Structure

This repository contains:
- **`extension-dist/`** - Ready-to-use Chrome extension (load this in Chrome)
- **`chrome-extension/`** - Extension source code (React + TypeScript)
- **`backend/`** - Optional backend service for advanced features (ready to use!)
- **Documentation** - QUICKSTART-STANDALONE.md, QUICKSTART.md, EXTENSION_SETUP.md

**Note:** The backend is now included directly - no need to unzip anything!

## 🎯 Features

### Standalone Mode (No Setup Required!)
- 🛡️ **Real-time URL Analysis** - 10+ heuristic checks for suspicious links
- 🚨 **Visual Warnings** - Highlights risky links in red with tooltips
- ⚠️ **Click Protection** - Confirms before opening dangerous links
- 🔍 **Phishing Detection** - Identifies scam keywords and patterns
- 🎭 **Brand Impersonation** - Detects fake login pages
- 🌐 **Works Offline** - No internet connection needed
- 💾 **Privacy-Focused** - All analysis in your browser

### Advanced Mode (Optional Backend)
- 🤖 **AI-Powered Analysis** - OpenAI GPT-4 scam detection
- 💭 **Sentiment Analysis** - Azure Text Analytics integration
- 🌍 **Google Safe Browsing** - Real-time threat database
- 📸 **Image Analysis** - Extract and analyze text from images
- 📊 **Historical Tracking** - MongoDB threat database
- 👤 **User Authentication** - Google OAuth integration

## 📥 Installation

### Option 1: Standalone (No Setup - Recommended!)

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer Mode" (top-right toggle)
3. Click "Load unpacked" → Select `extension-dist/` folder
4. **Done!** Click the ScamSpot icon and start monitoring

**That's it! No API keys, no backend, no configuration needed.**

### Option 2: With Advanced Features

Follow [QUICKSTART.md](QUICKSTART.md) to set up the backend for AI-powered analysis.

## 🎯 How It Works

### Standalone Mode Detection

ScamSpot analyzes URLs using 10+ security checks:

1. **Suspicious TLDs** - Flags .xyz, .top, .click, etc.
2. **IP Addresses** - Warns about direct IP links
3. **Excessive Subdomains** - Detects obfuscation attempts
4. **Phishing Keywords** - Identifies "verify", "urgent", "suspended", etc.
5. **Brand Impersonation** - Catches fake brand domains
6. **URL Shorteners** - Warns about hidden destinations
7. **Homograph Attacks** - Detects lookalike characters
8. **Excessive Hyphens** - Common in spam domains
9. **Long URLs** - Often hide malicious content
10. **Insecure HTTP** - Flags HTTP on login pages

### Advanced Features (Optional Backend)

- **URL Risk Analysis**
  - Multi-layered URL validation
  - Integration with Google Safe Browsing API
  - Machine learning-based URL classification
  - Historical tracking of malicious URLs

- **Message Analysis**
  - Sentiment analysis using Azure Text Analytics
  - Scam pattern detection using OpenAI GPT-4
  - Decision tree-based message classification
  - Conversation context analysis

- **Image Processing**
  - Support for JPEG, PNG, and GIF formats
  - Message extraction from images
  - Automated cleanup of processed files

- **Authentication**
  - Google OAuth integration
  - Session management
  - User profile handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Azure Cognitive Services account
- OpenAI API key
- Google Cloud Platform account (for Safe Browsing API)

## Environment Variables

```env
OPENAI=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
AZURE_TEXT_ANALYTICS_KEY=your_azure_key
AZURE_TEXT_ANALYTICS_ENDPOINT=your_azure_endpoint
GOOGLE_SAFE_BROWSING_API_KEY=your_google_api_key
```

## Installation

### Chrome Extension

The extension is already built and ready to use:

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `extension-dist/` folder from this repository
5. Start monitoring!

See [EXTENSION_SETUP.md](EXTENSION_SETUP.md) for detailed instructions.

### Backend Service

1. Extract the backend:
```bash
unzip project_backend.zip -d backend
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env` file):
```bash
OPENAI=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
AZURE_TEXT_ANALYTICS_KEY=your_azure_key
AZURE_TEXT_ANALYTICS_ENDPOINT=your_azure_endpoint
GOOGLE_SAFE_BROWSING_API_KEY=your_google_api_key
PORT=3000
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /auth/google-login` - Google OAuth login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### URL Analysis
- `POST /validate-url` - Analyze URLs for potential risks
  ```json
  {
    "urls": [
      {"url": "https://example.com"}
    ]
  }
  ```

### Image Analysis
- `POST /analyze` - Process and analyze images for scam detection
  - Accepts multipart/form-data with 'image' field
  - Supports JPEG, PNG, GIF (max 5MB)

## Security Features

- CORS protection with whitelisted origins
- Session management with secure cookies
- File upload restrictions and validation
- Automated cleanup of processed files
- Rate limiting (implementation required)

## Architecture

The service implements a multi-layered analysis approach:

1. **URL Analysis Pipeline**
   - Local heuristic analysis
   - Google Safe Browsing API check
   - Machine learning classification
   - Historical risk database

2. **Message Analysis Pipeline**
   - Sentiment analysis
   - Scam pattern detection
   - Context-aware classification
   - Final risk assessment

## Error Handling

The service implements comprehensive error handling with:
- Input validation
- API error management
- File processing safeguards
- Database operation error handling

## Database Schema

The service uses MongoDB with the following main collections:
- Users (authentication and profiles)
- BadLinks (tracked malicious URLs)
- Additional collections as needed

## Limitations

- Maximum file size: 5MB for images
- Supported image formats: JPEG, PNG, GIF
- API rate limits may apply
- Requires active internet connection for external API calls

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

