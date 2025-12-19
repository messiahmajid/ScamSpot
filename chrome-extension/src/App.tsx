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
        logout,
        backendAvailable
    } = useContext(ApiContext);

    const [query, setQuery] = useState('');

    // Handle Google Login Success
    const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        if (!backendAvailable) {
            alert('Backend is not available. Login requires a running backend server.');
            return;
        }

        const idToken = credentialResponse.credential;

        try {
            const response = await fetch('http://localhost:3000/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    window.location.reload();
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
                <h1>ScamSpot</h1>

                {/* Backend Status Indicator */}
                <div style={{
                    fontSize: '12px',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    backgroundColor: backendAvailable ? '#d4edda' : '#fff3cd',
                    color: backendAvailable ? '#155724' : '#856404',
                    border: `1px solid ${backendAvailable ? '#c3e6cb' : '#ffeaa7'}`
                }}>
                    {backendAvailable ? '✅ Advanced mode (Backend connected)' : '⚡ Standalone mode (No backend needed)'}
                </div>

                <div className="auth-section">
                    {backendAvailable && (
                        <>
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
                                    useOneTap
                                    theme="filled_blue"
                                    shape="pill"
                                    text="signin_with"
                                />
                            )}
                        </>
                    )}
                </div>

                <button onClick={toggleMonitoring} className={`monitoring-button ${capturing ? 'active' : ''}`}>
                    {capturing ? '🛑 Stop Monitoring' : '▶ Start Monitoring'}
                </button>

                {!backendAvailable && (
                    <div style={{
                        fontSize: '11px',
                        color: '#666',
                        marginTop: '10px',
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '5px',
                        border: '1px solid #dee2e6'
                    }}>
                        <strong>Standalone Mode Features:</strong>
                        <ul style={{ margin: '5px 0', paddingLeft: '20px', textAlign: 'left' }}>
                            <li>✅ URL risk analysis</li>
                            <li>✅ Phishing keyword detection</li>
                            <li>✅ Visual warnings for risky links</li>
                            <li>✅ Click protection</li>
                        </ul>
                        <em>For AI-powered analysis, start the backend server</em>
                    </div>
                )}
            </header>

            {/* Alerts Section */}
            <div className="alert-panel">
                <h3>Recent Alerts</h3>
                {alerts.length === 0 && <p>No alerts yet. Start monitoring to detect threats!</p>}
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
            {backendAvailable && (
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
            )}

            {/* Help Section */}
            <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '5px',
                fontSize: '12px',
                color: '#666'
            }}>
                <strong>🛡️ How ScamSpot Protects You:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px', textAlign: 'left' }}>
                    <li>Automatically scans all links on Gmail, WhatsApp, Instagram, etc.</li>
                    <li>Highlights suspicious links in <span style={{color: 'red', fontWeight: 'bold'}}>RED</span></li>
                    <li>Shows warning before you click dangerous links</li>
                    <li>Detects phishing attempts in real-time</li>
                </ul>
            </div>
        </div>
    );
}

export default App;
