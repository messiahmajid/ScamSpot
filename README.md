# ScamSpot - Phishing & Scam Detector Chrome Extension

> **Protect yourself from scams in emails and online chats with AI-powered real-time detection**

ScamSpot is a Chrome extension that automatically detects and flags potential scams, phishing attempts, and malicious links in your emails (Gmail) and chat platforms (WhatsApp, Telegram, Instagram, Messenger, Snapchat). It uses multi-layered AI analysis to identify suspicious content and highlights dangerous links in real-time.

## 🚀 Quick Start

**New users?** See [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide.

**Detailed setup?** See [EXTENSION_SETUP.md](EXTENSION_SETUP.md) for comprehensive installation and usage instructions.

## ✨ What's New - Extension is Now Working!

✅ **Fixed empty manifest.json** - Extension now loads properly
✅ **Built and ready to use** - Load from `./extension-dist` folder
✅ **Standardized API endpoints** - All services use port 3000
✅ **Complete documentation** - Setup guides and troubleshooting included

## 📦 Project Structure

This repository contains:
- **`extension-dist/`** - Ready-to-use Chrome extension (load this in Chrome)
- **`chrome-extension/`** - Extension source code (React + TypeScript)
- **`project_backend.zip`** - Backend service (needs to be unzipped)
- **Documentation** - QUICKSTART.md, EXTENSION_SETUP.md

## 🎯 Features

### Chrome Extension
- 🛡️ **Real-time Link Validation** - Scans all links on monitored pages
- 🚨 **Visual Warnings** - Highlights risky links in red with warning indicators
- 📸 **Screenshot Capture** - Documents suspicious content automatically
- 🔍 **Phishing Detection** - Identifies common scam patterns and keywords
- 💾 **Privacy-Focused** - All data stored locally on your machine

### Backend Service

A robust backend service for detecting and analyzing potential scams across different communication channels. The service implements multiple layers of analysis including URL risk assessment, sentiment analysis, image processing, and scam message detection.

## Features

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

