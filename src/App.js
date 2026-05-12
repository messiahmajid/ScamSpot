import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function formatDate(value) {
  if (!value) return "No scans yet";
  return new Date(value).toLocaleString();
}

function riskClass(risk) {
  return `risk-pill risk-${String(risk || "unknown").toLowerCase()}`;
}

function ServiceStatus({ name, status }) {
  return (
    <span className={`service-chip service-${status}`}>
      <span>{name}</span>
      <strong>{status}</strong>
    </span>
  );
}

function App() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [badLinks, setBadLinks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  async function loadDashboard() {
    setStatus("loading");
    setError("");

    try {
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      const healthData = await healthResponse.json();
      setHealth(healthData);

      const [statsResponse, scansResponse, badLinksResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/stats`),
        fetch(`${API_BASE_URL}/scans?limit=10`),
        fetch(`${API_BASE_URL}/bad-links?limit=10`)
      ]);

      if (!statsResponse.ok || !scansResponse.ok || !badLinksResponse.ok) {
        setStats(null);
        setScans([]);
        setBadLinks([]);
        setStatus("stateless");
        return;
      }

      const [statsData, scansData, badLinksData] = await Promise.all([
        statsResponse.json(),
        scansResponse.json(),
        badLinksResponse.json()
      ]);

      setStats(statsData.stats);
      setScans(scansData.scans || []);
      setBadLinks(badLinksData.badLinks || []);
      setStatus("ready");
    } catch (loadError) {
      setError(loadError.message);
      setStatus("offline");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const serviceHealth = useMemo(() => {
    if (!stats?.serviceHealth) return [];
    return Object.entries(stats.serviceHealth).map(([name, item]) => ({
      name,
      status: item.fulfilled > 0 ? "fulfilled" : item.disabled > 0 ? "disabled" : item.timed_out > 0 ? "timed_out" : "failed",
      ...item
    }));
  }, [stats]);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Phishing Detection Platform</p>
          <h1>ScamSpot</h1>
          <p className="subtitle">
            Monitor URL scans, upstream detector health, platform coverage, and persisted high-risk links.
          </p>
        </div>
        <div className="header-actions">
          <button onClick={loadDashboard} type="button">Refresh</button>
          <span className={`connection connection-${status}`}>
            {status === "ready" ? "Backend + MongoDB" : status === "stateless" ? "Backend stateless" : status}
          </span>
        </div>
      </header>

      {status === "offline" && (
        <section className="notice notice-error">
          <strong>Backend unavailable.</strong>
          <span>{error || `Start the Express server at ${API_BASE_URL}.`}</span>
        </section>
      )}

      {status === "stateless" && (
        <section className="notice">
          <strong>MongoDB is not connected.</strong>
          <span>The backend can still detect links, but scan history, bad-link frequency, and dashboard analytics require MongoDB.</span>
        </section>
      )}

      <section className="metric-grid">
        <article>
          <span>Mode</span>
          <strong>{health?.mode || "Unknown"}</strong>
          <small>{health?.features?.mongodb ? "Persistent analytics enabled" : "Detection available without persistence"}</small>
        </article>
        <article>
          <span>Scans</span>
          <strong>{stats?.scans ?? 0}</strong>
          <small>Latest: {formatDate(stats?.latestScanAt)}</small>
        </article>
        <article>
          <span>URLs Analyzed</span>
          <strong>{stats?.urlsAnalyzed ?? 0}</strong>
          <small>{stats?.highRiskUrls ?? 0} high-risk results</small>
        </article>
        <article>
          <span>Tracked Bad Links</span>
          <strong>{stats?.trackedBadLinks ?? 0}</strong>
          <small>Frequency updated on repeat detections</small>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading">
            <h2>Detector Health</h2>
            <span>Concurrent services</span>
          </div>
          <div className="service-list">
            {serviceHealth.length === 0 && <p className="empty">Run a scan to see detector status.</p>}
            {serviceHealth.map(service => (
              <ServiceStatus key={service.name} name={service.name} status={service.status} />
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h2>Platform Coverage</h2>
            <span>Six supported surfaces</span>
          </div>
          <div className="platform-grid">
            {["gmail", "whatsapp", "telegram", "instagram", "snapchat", "messenger"].map(platform => (
              <div key={platform} className="platform-row">
                <span>{platform}</span>
                <strong>{stats?.byPlatform?.[platform] || 0}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Recent Scans</h2>
          <span>Persisted MongoDB history</span>
        </div>
        <div className="scan-list">
          {scans.length === 0 && <p className="empty">No scan history is available yet.</p>}
          {scans.map(scan => (
            <article key={scan._id} className="scan-row">
              <div>
                <strong>{formatDate(scan.createdAt)}</strong>
                <span>{scan.urls?.length || 0} URLs analyzed</span>
              </div>
              <div className="url-results">
                {(scan.urls || []).slice(0, 4).map(item => (
                  <span key={`${scan._id}-${item.url}`} className={riskClass(item.risk)}>
                    {item.risk}: {item.platform || "unknown"}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>High-Risk Link Cache</h2>
          <span>Repeat detections and reasons</span>
        </div>
        <div className="link-table">
          {badLinks.length === 0 && <p className="empty">No high-risk links have been persisted yet.</p>}
          {badLinks.map(link => (
            <article key={`${link.userId}-${link.url}`} className="link-row">
              <div>
                <span className={riskClass(link.risk)}>{link.risk}</span>
                <strong>{link.url}</strong>
                <small>{(link.reasons || []).slice(0, 2).join(" | ") || "No reason recorded"}</small>
              </div>
              <div className="frequency">
                <strong>{link.frequency || 1}</strong>
                <span>detections</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
