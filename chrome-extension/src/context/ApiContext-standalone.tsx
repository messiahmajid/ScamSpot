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
    backendAvailable: boolean;
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
    logout: async () => {},
    backendAvailable: false
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
    const [backendAvailable, setBackendAvailable] = useState(false);

    // Check if backend is available
    const checkBackendAvailability = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3000/health", {
                method: "GET",
                signal: AbortSignal.timeout(2000) // 2 second timeout
            });
            const available = response.ok;
            setBackendAvailable(available);

            if (available) {
                console.log("✅ Backend available - advanced features enabled");
                checkAuthStatus();
            } else {
                console.log("⚠️ Backend not available - using standalone mode");
            }
        } catch (error) {
            setBackendAvailable(false);
            console.log("⚠️ Backend not available - using standalone mode");
        }
    }, []);

    // Check authentication status (only if backend available)
    const checkAuthStatus = useCallback(async () => {
        if (!backendAvailable) return;

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
    }, [backendAvailable]);

    // Check backend availability on mount
    useEffect(() => {
        checkBackendAvailability();
        // Check again every 30 seconds
        const interval = setInterval(checkBackendAvailability, 30000);
        return () => clearInterval(interval);
    }, [checkBackendAvailability]);

    // Logout function
    const logout = async () => {
        if (!backendAvailable) return;

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

    // Validate links - just trigger content script
    const validateLinks = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (!tab || tab.id === undefined) {
                console.error("❌ No active tab found or invalid tab ID.");
                return;
            }

            // Trigger validation in content script
            chrome.tabs.sendMessage(tab.id!, { action: "CHECK_LINKS" });
        });
    };

    // Load alerts and screenshots from storage
    useEffect(() => {
        chrome.storage.local.get(['alerts', 'screenshots'], (result) => {
            if (result.alerts) setAlerts(result.alerts);
            if (result.screenshots) setScreenshots(result.screenshots);
        });

        // Listen for storage changes
        const handleStorageChange = (changes: any) => {
            if (changes.alerts) setAlerts(changes.alerts.newValue || []);
            if (changes.screenshots) setScreenshots(changes.screenshots.newValue || []);
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    }, []);

    // Listen for alerts and update state
    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.action === "DISPLAY_ALERT" && message.alert) {
                setAlertMessage(message.alert);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
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
            logout,
            backendAvailable
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
