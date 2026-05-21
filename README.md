# ScamSpot

ScamSpot is a phishing-detection Chrome extension and optional Node/Express backend for flagging risky links in email and chat workflows. It works immediately in the browser with client-side heuristics, and it can connect to a backend for OpenAI, Azure Text Analytics, Google Safe Browsing, and MongoDB-backed scan history.

## Overview

ScamSpot helps people spot suspicious links before they click them. The extension scans supported web apps, highlights risky URLs, shows a warning overlay with reasons and risk score, and tracks scan stats in a compact popup.

The project is designed as a portfolio-grade full-stack security tool: a real Chrome extension, a React/TypeScript popup, a Node/Express backend, MongoDB persistence, concurrent detector orchestration, and automated adversarial tests.

## Problem

Phishing links often appear inside trusted workflows: email inboxes, messaging apps, social DMs, and shared documents. Users rarely have enough context to judge a URL quickly, especially when attackers use urgency, brand impersonation, URL shorteners, suspicious TLDs, or lookalike domains.

## Why It Matters

Phishing is one of the most common paths to account takeover, credential theft, payment fraud, and malware delivery. A useful tool needs to be fast, explainable, and resilient when external security APIs are slow or unavailable. ScamSpot focuses on those constraints: local fallback detection, visible warnings, service-level isolation, and clear risk reasons.

## Tech Stack

- **Frontend:** React, TypeScript, Chrome Extension Manifest V3
- **Backend:** Node.js, Express
- **Database:** MongoDB/Mongoose for scan history and high-risk URL persistence
- **ML/AI:** OpenAI URL analysis, Azure Text Analytics context signals, heuristic URL scoring
- **APIs:** Google Safe Browsing, OpenAI REST API, Azure Text Analytics REST API
- **Testing:** Node test runner, React Testing Library, content-script VM tests, 500+ adversarial URL fixtures
- **Deployment/Demo:** Loadable Chrome extension in `extension-dist/`, local backend on `localhost:3000`, local demo page in `demo/`

## Architecture

```mermaid
flowchart LR
  User["User on Gmail / Chat / Demo Page"] --> Extension["Chrome Content Script"]
  Extension --> Local["Local URL Heuristics + Cache"]
  Extension --> Popup["React Popup Stats"]
  Extension --> Backend["Express /validate-url"]
  Backend --> H["Heuristic Detector"]
  Backend --> G["Google Safe Browsing"]
  Backend --> O["OpenAI URL Analysis"]
  Backend --> A["Azure Text Signals"]
  Backend --> M["MongoDB Scan History"]
  H --> Merge["Merged Risk Result"]
  G --> Merge
  O --> Merge
  A --> Merge
  Merge --> Extension
```

Backend detectors run independently with per-service timeout and retry handling. A slow or failed upstream returns a service status instead of blocking the response path.

## Key Features

- **Standalone extension mode:** works without backend, API keys, or setup.
- **Six supported platforms:** Gmail, WhatsApp Web, Telegram Web, Instagram, Snapchat Web, and Messenger.
- **Local risk scoring:** suspicious TLDs, IP URLs, excessive subdomains, phishing keywords, brand impersonation, URL shorteners, homographs, long URLs, and insecure HTTP login links.
- **Advanced backend mode:** optional OpenAI, Azure, Google Safe Browsing, and MongoDB integration.
- **Concurrent detector orchestration:** independent services run in parallel with timeouts and retries.
- **Warning UX:** risky links get an outline/badge; clicks open a modal with score, URL, reasons, continue/block actions, and false-positive reporting.
- **Demo surface:** `demo/index.html` provides deterministic suspicious and benign links for live walkthroughs.

## Setup

### Prerequisites

- **Node.js 18+** and npm
- **Google Chrome** or another Chromium browser that supports Manifest V3 extensions
- **Python 3** for the local demo page server
- **MongoDB** only if you want backend persistence locally
- Optional API keys for advanced analysis: OpenAI, Azure Text Analytics, and Google Safe Browsing

ScamSpot has two useful run modes:

- **Standalone extension mode:** fastest path, no backend or API keys required.
- **Advanced backend mode:** optional Express backend with external detectors and MongoDB persistence.

### 1. Build The Loadable Extension

```bash
cd chrome-extension
npm install
npm run build:dist
```

This compiles the React popup and syncs the Chrome extension bundle into `extension-dist/`. That folder is the one Chrome loads.

### 2. Load The Extension In Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `extension-dist/` folder
5. Confirm the ScamSpot extension icon appears in Chrome

If you change extension source files later, run `npm run build:dist` again and click the reload icon on the ScamSpot card in `chrome://extensions/`.

### 3. Run The Fast Local Demo

```bash
cd demo
python3 -m http.server 8080
```

Open `http://localhost:8080`.

Expected result:

- Suspicious sample links are outlined and badged by ScamSpot.
- Benign sample links are left alone.
- Clicking a flagged link opens the warning overlay with the risk score, reasons, and block/continue/report actions.
- Opening the extension popup shows the current page as active, with scan totals and recent flagged URLs.

This is the best demo path because it does not depend on Gmail content, login state, external APIs, or a live backend.

### 4. Try Supported Real Platforms

After the local demo works, open any supported site:

- Gmail: `mail.google.com`
- WhatsApp Web: `web.whatsapp.com`
- Telegram Web: `web.telegram.org`
- Instagram: `www.instagram.com`
- Snapchat Web: `web.snapchat.com`
- Messenger: `messenger.com`

ScamSpot scans links automatically as the page loads and as new content appears. Use **Scan Now** in the popup to force a rescan after dynamic content loads.

### 5. Run Advanced Backend Mode

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Edit `backend/.env` to enable whichever services you want to test:

```env
PORT=3000
MONGO=mongodb://localhost:27017/scamspot
OPENAI=
AZUREURL=
AZUREKEY=
GOOGLE_SAFE_BROWSING_API_KEY=
DETECTION_SERVICE_TIMEOUT_MS=3500
DETECTION_SERVICE_RETRIES=1
```

The backend still runs without every optional key. Missing services return an unavailable/skipped status while the available detectors continue. This is intentional: one missing or slow upstream should not block the response path.

Health check:

```bash
curl http://localhost:3000/health
```

When the extension detects the backend, the popup shows **Backend Connected** and content-script scans call `/validate-url`.

### 6. Demo The Backend Directly

In a second terminal, with the backend still running:

```bash
cd backend
npm run demo
```

The demo posts phishing and benign URLs to `/validate-url` and prints risk scores, reasons, detector statuses, timings, and MongoDB persistence status.

### Troubleshooting

- **Extension does not appear:** reload `extension-dist/` from `chrome://extensions/`, not `chrome-extension/`.
- **Popup says inactive:** open a supported platform or `http://localhost:8080`, then reopen the popup.
- **Links are not highlighted:** click **Scan Now**, refresh the page, and confirm the page URL is one of the supported domains.
- **Backend is disconnected:** confirm `npm start` is running in `backend/` and `http://localhost:3000/health` responds.
- **MongoDB errors appear:** start MongoDB locally or leave `MONGO` empty if you only want detector output without persistence.
- **API-key services are skipped:** add the relevant key to `backend/.env` and restart the backend.

## Verification

Run the main verification command from the repository root:

```bash
npm run verify
```

This runs extension tests, rebuilds and syncs `extension-dist/`, and runs backend tests.

Expected verification result:

- `src/contentScript.test.ts` and `src/App.test.tsx` pass.
- The production extension build completes and updates `extension-dist/`.
- Backend tests pass, including detector resilience and 500+ adversarial URL scenarios.

Evidence for the main claims:

- **6 platform coverage:** `chrome-extension/public/manifest.json`
- **Content-script behavior:** `chrome-extension/src/contentScript.test.ts`
- **Concurrent backend detectors:** `backend/services/urlDetectionServices.js`
- **Timeout/retry isolation:** `backend/services/resilience.js`
- **500+ adversarial URL scenarios:** `backend/tests/url_features.adversarial.test.js`
- **MongoDB persistence:** `backend/controllers/bad_linksController.js`, `backend/models/url_scan.js`

## Results / Metrics

- 500+ generated adversarial phishing URL scenarios tested.
- Curated phishing and benign URL fixture coverage.
- Backend resilience tests for concurrency, timeouts, retries, and failure-tolerant result merging.
- Four URL detector paths: local heuristics, Google Safe Browsing, OpenAI URL analysis, and Azure text/context signals.
- Six supported web platforms plus a local demo page.

## Technical Challenges

- Keeping the extension useful without any backend or paid API keys.
- Running independent backend detectors concurrently without letting one upstream failure block the response path.
- Making a content script safe for dynamic web apps where DOM nodes are constantly inserted and removed.
- Avoiding stale extension bundles by adding `npm run build:dist`.
- Testing browser content-script behavior in a CI-friendly Node environment.

## What I Learned

- A security tool needs graceful degradation, not only strong external integrations.
- Browser extensions need durable state because popups are short-lived.
- Risk scoring is more useful when paired with human-readable reasons.
- Demo reliability matters: a controlled local page is better than depending only on Gmail or chat apps during a walkthrough.

## Limitations

ScamSpot is a portfolio project, not commercial anti-phishing infrastructure. It can catch common phishing patterns and demonstrate resilient detector orchestration, but real-world production use would need stronger abuse controls, broader URL intelligence, deployment hardening, rate limiting, monitoring, and a reviewed privacy/security model.


## Project Layout

```text
ScamSpot/
  backend/              Optional advanced backend
  chrome-extension/     Extension source
  extension-dist/       Loadable built Chrome extension
  demo/                 Local sample page for demos
  package.json          Root verify command
```
