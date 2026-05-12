const test = require("node:test");
const assert = require("node:assert/strict");
const { runService, wait } = require("../services/resilience");
const { createFinding, mergeFindings, runUrlDetection } = require("../services/urlDetectionServices");

test("runService converts a slow upstream into timed_out status", async () => {
    const result = await runService({
        name: "slowService",
        timeoutMs: 20,
        retries: 0,
        execute: async ({ signal }) => {
            await wait(200, signal);
            return [];
        }
    });

    assert.equal(result.status, "timed_out");
    assert.equal(result.results.length, 0);
});

test("runService times out even when an upstream ignores AbortSignal", async () => {
    const result = await runService({
        name: "nonCooperativeService",
        timeoutMs: 20,
        retries: 0,
        execute: async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            return [{ ok: true }];
        }
    });

    assert.equal(result.status, "timed_out");
    assert.equal(result.results.length, 0);
});

test("runService retries transient failures and returns fulfilled output", async () => {
    let attempts = 0;
    const result = await runService({
        name: "flakyService",
        timeoutMs: 100,
        retries: 2,
        execute: async () => {
            attempts += 1;
            if (attempts < 2) throw new Error("temporary upstream failure");
            return [{ ok: true }];
        }
    });

    assert.equal(result.status, "fulfilled");
    assert.equal(attempts, 2);
    assert.deepEqual(result.results, [{ ok: true }]);
});

test("mergeFindings preserves response path when one detector fails", () => {
    const urls = [{ id: "0", url: "https://secure-paypal-login.xyz", platform: "gmail" }];
    const merged = mergeFindings(urls, [
        {
            name: "urlHeuristics",
            status: "fulfilled",
            results: [
                createFinding("urlHeuristics", urls[0], "High", 90, ["Suspicious TLD"])
            ]
        },
        {
            name: "openaiUrlAnalysis",
            status: "failed",
            results: [],
            error: { message: "upstream unavailable" }
        }
    ]);

    assert.equal(merged[0].risk, "High");
    assert.equal(merged[0].score, 90);
    assert.equal(merged[0].services.urlHeuristics.risk, "High");
});

test("runUrlDetection executes injected detectors concurrently", async () => {
    const startedAt = Date.now();
    const urls = [{ id: "0", url: "https://example.xyz/login", platform: "gmail" }];

    const detectors = [0, 1, 2].map(index => ({
        name: `detector${index}`,
        timeoutMs: 200,
        retries: 0,
        execute: async () => {
            await wait(80);
            return [createFinding(`detector${index}`, urls[0], index === 1 ? "High" : "Low", index === 1 ? 80 : 0, index === 1 ? ["hit"] : [])];
        }
    }));

    const result = await runUrlDetection(urls, { detectors });
    const elapsed = Date.now() - startedAt;

    assert.ok(elapsed < 170, `detectors should run concurrently, elapsed=${elapsed}`);
    assert.equal(result.highRiskUrls.length, 1);
    assert.equal(result.serviceStatuses.every(status => status.status === "fulfilled"), true);
});
