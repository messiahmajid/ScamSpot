// ✅ Prevent duplicate execution
if (!window.__SCAMSTOP_CONTENT_LOADED__) {
    window.__SCAMSTOP_CONTENT_LOADED__ = true;

    console.log("📌 ScamStop Content Script Loaded.");

    // Create a MutationObserver to detect DOM changes.
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
            // Notify the background script that the DOM has changed.
            chrome.runtime.sendMessage({ type: 'DOM_CHANGE' });
        }
    });

    // Begin observing the document body.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    async function validateLinks() {
        console.log("🔍 Running validateLinks()...");

        // Step 1: Extract all <a> tags and collect their hrefs
        const links = Array.from(document.querySelectorAll("a"))
            .map(a => a.href)
            .filter(url => url.startsWith("http")); // Ensure only valid URLs

        if (links.length === 0) {
            console.warn("⚠️ No links found on this page.");
            return;
        }

        console.log("🔗 Extracted Links:", links);

        // Step 2: Format links as an array of objects
        const urlData = links.map(url => ({ url }));

        try {
            // Step 3: Send links to the validation API
            const response = await fetch("http://localhost:3000/validate-url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ urls: urlData }),
            });

            const data = await response.json();
            console.log("🛡️ API Response:", data);

            if (data.success && Array.isArray(data.highRiskUrls)) {
                // Step 4: Highlight risky links
                highlightMaliciousLinks(data.highRiskUrls);
            }
        } catch (error) {
            console.error("❌ Error validating URLs:", error);
        }
    }

    function highlightMaliciousLinks(riskyUrls) {
        const allLinks = document.querySelectorAll("a");

        riskyUrls.forEach(({ url }) => {
            allLinks.forEach(link => {
                if (link.href === url) {
                    link.style.border = "2px solid red";
                    link.style.color = "red";
                    link.style.fontWeight = "bold";

                    // Optional: Show a tooltip
                    link.setAttribute("title", "⚠️ High Risk: This link may be unsafe!");

                    // Optional: Add an alert banner
                    const alertBanner = document.createElement("span");
                    alertBanner.innerText = "⚠️ High-Risk Link";
                    alertBanner.style.color = "red";
                    alertBanner.style.marginLeft = "10px";
                    link.appendChild(alertBanner);
                }
            });
        });

        console.log("🚨 Malicious links highlighted.");
    }

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "CHECK_LINKS") {
            validateLinks();
        }
    });

    console.log("✅ Content script successfully initialized.");
}
