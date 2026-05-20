const BASE = process.env.BACKEND_URL || "http://localhost:3000";

const TEST_URLS = [
    { url: "http://paypa1-secure-login.xyz/verify-account", platform: "gmail", context: "Your account has been limited" },
    { url: "http://192.168.1.100/free-prize-claim", platform: "whatsapp", context: "You won a $500 gift card!" },
    { url: "http://secure-bankofamerica-login.top/urgent", platform: "gmail", context: "Unusual activity detected" },
    { url: "http://amaz0n-order-tracking.click/shipment", platform: "telegram", context: "Track your package" },
    { url: "https://docs.google.com/document/d/example", platform: "gmail", context: "Here is the doc" },
    { url: "https://github.com/example/repo/pull/42", platform: "telegram", context: "PR ready for review" },
];

function colorRisk(risk) {
    if (risk === "High") return "\x1b[31mHigh\x1b[0m";
    if (risk === "Medium") return "\x1b[33mMedium\x1b[0m";
    return "\x1b[32mLow\x1b[0m";
}

async function main() {
    console.log(`\nScamSpot Backend Demo`);
    console.log(`Sending ${TEST_URLS.length} URLs to ${BASE}/validate-url\n`);

    const healthRes = await fetch(`${BASE}/health`);
    if (!healthRes.ok) {
        console.error("Backend not reachable. Start it with: cd backend && npm start");
        process.exit(1);
    }
    const health = await healthRes.json();
    console.log(`Mode: ${health.mode}`);
    console.log(`Services: ${Object.entries(health.features).map(([k, v]) => `${k}=${v ? "on" : "off"}`).join(", ")}\n`);

    const res = await fetch(`${BASE}/validate-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: TEST_URLS }),
    });
    const data = await res.json();

    console.log("--- Results ---\n");
    for (const r of data.results) {
        console.log(`  ${colorRisk(r.risk)}  score=${r.score}  ${r.url}`);
        for (const reason of r.reasons) {
            console.log(`       - ${reason}`);
        }
        console.log();
    }

    console.log("--- Service Statuses ---\n");
    for (const s of data.serviceStatuses) {
        const icon = s.status === "fulfilled" ? "\x1b[32mok\x1b[0m" : `\x1b[31m${s.status}\x1b[0m`;
        const time = s.durationMs ? `${s.durationMs}ms` : "-";
        const err = s.error ? ` (${s.error})` : "";
        console.log(`  ${s.name}: ${icon}  ${time}${err}`);
    }

    console.log(`\n--- Persistence ---\n`);
    console.log(`  MongoDB: ${data.persistence?.mongodb ? "connected" : "not connected"}`);
    console.log(`  High-risk URLs found: ${data.highRiskUrls?.length || 0}`);
    console.log();
}

main().catch(err => {
    console.error("Demo failed:", err.message);
    process.exit(1);
});
