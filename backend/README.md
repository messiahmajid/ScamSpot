# ScamSpot Backend

A flexible backend service for scam detection that works standalone or with optional AI services.

## Features

### Core Features (No API Keys Required)
- ✅ URL risk analysis with heuristics
- ✅ Basic phishing detection
- ✅ Message pattern matching
- ✅ Decision tree classification

### Optional Advanced Features
- 🤖 OpenAI GPT-4 scam analysis (requires OPENAI key)
- 💭 Azure sentiment analysis (requires AZURE keys)
- 🌍 Google Safe Browsing (requires GOOGLE_SAFE_BROWSING key)
- 👤 Google OAuth login (requires GOOGLE OAuth key)
- 📊 MongoDB storage (requires MONGO connection)

## Quick Start (Standalone Mode)

**No API keys needed for basic functionality!**

```bash
cd backend
npm install
npm start
```

The server starts on `http://localhost:3000` with basic scam detection enabled.

## Full Setup (With AI Features)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env and add your API keys** (optional - only for features you want)

4. **Start the server:**
   ```bash
   npm start
   ```

## Environment Variables

See `.env.example` for all available configuration options.

**Minimum required:**
- `PORT` - Server port (default: 3000)
- `SECRET` - Session secret

**Optional (for advanced features):**
- `MONGO` - MongoDB connection string
- `OPENAI` - OpenAI API key
- `AZUREURL` & `AZUREKEY` - Azure Cognitive Services
- `GOOGLE` - Google OAuth client ID
- `GOOGLE_SAFE_BROWSING_API_KEY` - Google Safe Browsing API

## API Endpoints

### Health Check
- `GET /health` - Check server status and enabled features

### URL Validation
- `POST /validate-url` - Validate URLs for scams
  ```json
  {
    "urls": [{"url": "https://example.com"}]
  }
  ```

### Image Analysis
- `POST /analyze` - Analyze images for scam content
  - Requires: OpenAI API key
  - Format: multipart/form-data with 'image' field

### Authentication
- `POST /auth/google-login` - Google OAuth login
  - Requires: Google OAuth configured
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - Logout

## How It Works

The backend gracefully degrades based on available API keys:

**With no API keys:**
- Heuristic URL analysis
- Pattern matching for phishing
- Decision tree classification

**With OpenAI key:**
- AI-powered scam message analysis
- Advanced URL classification

**With Azure keys:**
- Sentiment analysis for messages

**With Google Safe Browsing:**
- Real-time threat database checks

**With MongoDB:**
- Historical threat tracking
- User data persistence

## Development

```bash
npm start  # Start server
```

## Security Notes

- Never commit `.env` file
- Use strong SECRET value in production
- Keep API keys confidential
- Enable HTTPS in production

## Architecture

```
backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Auth and validation
├── models/          # MongoDB schemas
├── repos/           # Business logic
├── routes/          # API routes
├── uploads/         # Temporary file storage
└── server.js        # Main entry point
```

## License

See main project LICENSE
