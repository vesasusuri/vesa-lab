import React from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import './bootstrap';
import App from './app.js';

const container = document.getElementById('app');

if (container) {
    createRoot(container).render(
        <React.StrictMode>
            <IntlProvider locale="en" defaultLocale="en" messages={{}}>
                <App />
            </IntlProvider>
        </React.StrictMode>,
    );
}
