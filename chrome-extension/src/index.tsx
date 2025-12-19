// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApiProvider } from './context/ApiContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <ApiProvider>
            <GoogleOAuthProvider clientId="233153684342-icqu1cr7dlj8k6j9ea3ea7golbljh2cp.apps.googleusercontent.com"> {/* Wrap with provider */}
                <App />
            </GoogleOAuthProvider>
        </ApiProvider>
    </React.StrictMode>
);
