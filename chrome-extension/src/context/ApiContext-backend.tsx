import React, { createContext, useState, useEffect, useCallback } from 'react';

export interface Alert {
    timestamp: number;
    message: string;
    riskLevel: number;
    tags: string[];
}

export interface ApiContextType {
    capturing: boolean;
    toggleMonitoring: () => void;
    screenshots: string[];
    alerts: Alert[];
    searchKeywords: (query: string) => void;
    keywordResults: Record<string, number>;
    tempImages: string[];
    triggerCapture: () => void;
    validateLinks: () => void;
    isLoggedIn: boolean;
    user: any;
    logout: () => Promise<void>;
}

export const ApiContext = createContext<ApiContextType>({
    capturing: false,
    toggleMonitoring: () => {},
    screenshots: [],
    alerts: [],
    searchKeywords: () => {},
    keywordResults: {},
    tempImages: [],
    triggerCapture: () => {},
    validateLinks: () => {},
    isLoggedIn: false,
    user: null,
    logout: async () => {}
});

interface ApiProviderProps {
    children: React.ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
    const [capturing, setCapturing] = useState(false);
    const [screenshots, setScreenshots] = useState<string[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [keywordResults, setKeywordResults] = useState<Record<string, number>>({});
    const [tempImages, setTempImages] = useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [alertMessage, setAlertMessage] = useState<string>("");

    // Check authentication status
    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3000/auth/profile", {
                method: "GET",
                credentials: "include",
                mode: "cors"
            });

            if (response.status === 401) {
                setIsLoggedIn(false);
                setUser(null);
                return;
            }

            const data = await response.json();
            if (data.success) {
                setIsLoggedIn(true);
                setUser(data.user);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    // Periodically check authentication status
    useEffect(() => {
        checkAuthStatus();
        const interval = setInterval(checkAuthStatus, 300000); // Check every 5 mins
        return () => clearInterval(interval);
    }, [checkAuthStatus]);

    // Logout function
    const logout = async () => {
        try {
            await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include",
                mode: "cors"
            });
            setIsLoggedIn(false);
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Toggle monitoring by sending a message to the background
    const toggleMonitoring = () => {
        chrome.runtime.sendMessage({ action: capturing ? "STOP_MONITORING" : "START_MONITORING" });
        setCapturing(!capturing);
    };

    // Check if the active tab's domain is allowed
    const isAllowedDomain = (tabUrlStr: string, enabledDomains: Record<string, boolean>): boolean => {
        try {
            const url = new URL(tabUrlStr);
            return Object.keys(enabledDomains).some(domain => enabledDomains[domain] && url.hostname.includes(domain));
        } catch (err) {
            return false;
        }
    };

    // Capture all links on the page and validate them via API
    const validateLinks = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (!tab || tab.id === undefined) {
                console.error("❌ No active tab found or invalid tab ID.");
                return;
            }

            console.log("🌍 Running `validateLinks()` on tab:", tab.url);

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    if (!document.querySelector("a")) {
                        console.warn("⚠️ No <a> tags found on the page.");
                        return [];
                    }

                    console.log("🛠️ Extracting Links...");
                    const links = Array.from(document.querySelectorAll("a"))
                        .map(link => link.href)
                        .filter(url => url.startsWith("http"));

                    console.log("🔗 Extracted URLs from page:", links);
                    return links;
                }
            }, (injectionResults) => {
                if (!injectionResults || injectionResults.length === 0) {
                    console.error("❌ No results returned from content script.");
                    return;
                }

                const extractedLinks = injectionResults[0]?.result;
                if (!extractedLinks || extractedLinks.length === 0) {
                    console.warn("⚠️ No links found on the page.");
                    return;
                }

                console.log("✅ Successfully scraped URLs:", extractedLinks);

                const urlData = extractedLinks.map(url => ({ url }));

                fetch("http://localhost:3000/validate-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ urls: urlData }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("🛡️ API Response:", data);
                        if (data.success && Array.isArray(data.highRiskUrls)) {
                            chrome.tabs.sendMessage(tab.id!, { action: "HIGHLIGHT_LINKS", links: data.highRiskUrls });
                        }
                    })
                    .catch(error => {
                        console.error("❌ Error validating URLs:", error);
                    });
            });
        });
    };




    // Listen for alerts and update state
    useEffect(() => {
        chrome.runtime.onMessage.addListener((message) => {
            if (message.action === "DISPLAY_ALERT" && message.alert) {
                setAlertMessage(message.alert);
            }
        });
    }, []);

    return (
        <ApiContext.Provider value={{
            capturing,
            toggleMonitoring,
            screenshots,
            alerts,
            searchKeywords: () => {},
            keywordResults,
            tempImages,
            triggerCapture: () => {},
            validateLinks,
            isLoggedIn,
            user,
            logout
        }}>
            {children}
            {alertMessage && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "red",
                    color: "white",
                    textAlign: "center",
                    padding: "10px",
                    fontWeight: "bold",
                    zIndex: 1000
                }}>
                    {alertMessage}
                </div>
            )}
        </ApiContext.Provider>
    );
};
