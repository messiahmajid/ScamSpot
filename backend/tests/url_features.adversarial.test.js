const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { analyzeUrlHeuristics } = require("../repos/url_features");

function buildAttackCases() {
    const cases = [];

    for (let i = 0; i < 150; i += 1) {
        cases.push(`http://verify-paypal-account-${i}.xyz/login?token=session-${i}`);
    }

    for (let i = 0; i < 100; i += 1) {
        cases.push(`http://192.168.${i % 255}.${(i * 7) % 255}/secure-login/update-password`);
    }

    for (let i = 0; i < 100; i += 1) {
        cases.push(`https://paypal.secure.account.billing.${i}.work/confirm?redirect=https%3A%2F%2Fpaypal.com`);
    }

    for (let i = 0; i < 75; i += 1) {
        cases.push(`https://xn--paypl-3ve${i}.com/security-alert`);
    }

    for (let i = 0; i < 75; i += 1) {
        cases.push(`https://amazon-login-secure-update-billing-${i}.top/account/confirm`);
    }

    for (let i = 0; i < 75; i += 1) {
        cases.push(`https://bit.ly/verify-bank-account-${i}`);
    }

    for (let i = 0; i < 50; i += 1) {
        const encoded = "%63%72%65%64%65%6E%74%69%61%6C".repeat(2);
        cases.push(`https://secure-update-${i}.click/login?redirect=${encoded}&auth=reset`);
    }

    return cases;
}

function buildBenignCases() {
    const safeDomains = [
        "google.com",
        "paypal.com",
        "amazon.com",
        "microsoft.com",
        "apple.com",
        "instagram.com",
        "linkedin.com",
        "usps.com",
        "fedex.com",
        "ups.com"
    ];

    const cases = [];
    for (let i = 0; i < 120; i += 1) {
        const domain = safeDomains[i % safeDomains.length];
        cases.push(`https://www.${domain}/help/article-${i}`);
    }
    return cases;
}

test("classifies 500+ generated adversarial phishing URL scenarios as high risk", () => {
    const attackCases = buildAttackCases();
    assert.ok(attackCases.length >= 500, "test must cover at least 500 adversarial URLs");

    const misses = attackCases
        .map(url => ({ url, result: analyzeUrlHeuristics(url) }))
        .filter(({ result }) => result.risk !== "High");

    assert.deepEqual(misses, []);
});

test("keeps common official-domain URLs low risk", () => {
    const benignCases = buildBenignCases();

    const falsePositives = benignCases
        .map(url => ({ url, result: analyzeUrlHeuristics(url) }))
        .filter(({ result }) => result.risk !== "Low");

    assert.deepEqual(falsePositives, []);
});

test("returns a high-risk finding for malformed or missing URLs", () => {
    for (const value of ["not a url", "", null, undefined]) {
        const result = analyzeUrlHeuristics(value);
        assert.equal(result.risk, "High");
        assert.equal(result.score, 100);
    }
});

test("classifies curated real-world phishing and benign URL patterns", () => {
    const fixturePath = path.join(__dirname, "fixtures", "curated_url_cases.json");
    const cases = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

    const mismatches = cases
        .map(item => ({
            ...item,
            actualRisk: analyzeUrlHeuristics(item.url).risk
        }))
        .filter(item => item.actualRisk !== item.expectedRisk);

    assert.deepEqual(mismatches, []);
});
