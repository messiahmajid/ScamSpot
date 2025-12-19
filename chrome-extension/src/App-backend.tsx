import React, { useState, useContext } from 'react';
import { GoogleLogin,CredentialResponse } from '@react-oauth/google';
import { ApiContext } from './context/ApiContext';
import './App.css';

function App() {
    const {
        capturing,
        toggleMonitoring,
        screenshots,
        alerts,
        searchKeywords,
        keywordResults,
        isLoggedIn,
        user,
        logout
    } = useContext(ApiContext);

    const [query, setQuery] = useState('');

    // Handle Google Login Success
    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        const idToken = credentialResponse.credential;

        try {
            const response = await fetch('http://localhost:3000/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                credentials: 'include', // Include cookies for session management
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Force a recheck of the auth status
                    window.location.reload(); // Or use a context method to update the state
                }
            }
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    // Handle Google Login Error
    const handleGoogleLoginError = () => {
        console.log('Google login failed');
    };

    // Handle search button click
    const handleSearch = () => {
        if (query.trim() !== '') {
            searchKeywords(query.trim());
        }
    };

    return (
        <div className="app-container">
            {/* Header Section */}
            <header className="header">
                <h1>PhishGuard</h1>
                <div className="auth-section">
                    {isLoggedIn ? (
                        <div className="user-info">
                            <span>Hello, {user?.firstName}!</span>
                            <button onClick={logout} className="logout-button">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={handleGoogleLoginError}
                            useOneTap // Enable Google One Tap
                            theme="filled_blue" // Customize the button theme
                            shape="pill" // Rounded button
                            text="signin_with" // Button text
                        />
                    )}
                </div>
                <button onClick={toggleMonitoring} className={`monitoring-button ${capturing ? 'active' : ''}`}>
                    {capturing ? '🛑 Stop Monitoring' : '▶ Start Monitoring'}
                </button>
            </header>

            {/* Search Section */}
            <div className="search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for keywords..."
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Keyword Results Section */}
            <div className="keywords-section">
                <h3>Keyword Occurrences</h3>
                {Object.entries(keywordResults).length === 0 && <p>No keywords searched yet.</p>}
                {Object.entries(keywordResults).map(([keyword, count]) => (
                    <div key={keyword} className="keyword-result">
                        <span className="keyword">{keyword}</span>: <span className="count">{count}</span>
                    </div>
                ))}
            </div>

            {/* Alerts Section */}
            <div className="alert-panel">
                <h3>Recent Alerts</h3>
                {alerts.length === 0 && <p>No alerts available.</p>}
                {alerts.map((alert, index) => (
                    <div key={index} className="alert-item">
                        <div className="alert-header">
                            <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            <span className="alert-risk">{alert.riskLevel}% Risk</span>
                        </div>
                        <p>{alert.message}</p>
                        <div className="alert-tags">
                            {alert.tags.map((tag) => (
                                <span key={tag} className="tag">
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Screenshot Gallery Section */}
            <div className="screenshot-gallery">
                <h3>Recent Captures</h3>
                <div className="screenshot-grid">
                    {screenshots.length === 0 && <p>No screenshots captured yet.</p>}
                    {screenshots.map((src, index) => (
                        <div key={index} className="screenshot-item">
                            <img src={src} alt={`Capture ${index}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;