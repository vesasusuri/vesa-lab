import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import Aos from 'aos';
import "aos/dist/aos.css";

import { userRoutes }  from './routes/UserRoutes';
import { hrRoutes }    from './routes/HrRoutes';
import { adminRoutes } from './routes/AdminRoutes';
import FirstLoginPage  from './views/Auth/FirstLogin/FirstLoginPage';

import { PlatformAdminProvider } from './context/PlatformAdminContext';
import { AuthProvider } from './context/AuthContext';
import AdminActivityTracker from './views/Admin-View/components/shared/AdminActivityTracker';

function AppRoutes() {
    return useRoutes([
        { path: '/first-login', element: <FirstLoginPage /> },
        ...userRoutes,
        ...hrRoutes,
        ...adminRoutes,
    ]);
}

export default function App() {
    useEffect(() => {
        Aos.init({
            duration: 1250,
            once: true,
        });
    }, []);

    return (
        <IntlProvider locale="en" messages={{}}>
            <PlatformAdminProvider>
                <BrowserRouter>
                    <AuthProvider>
                        <AdminActivityTracker />
                        <AppRoutes />
                    </AuthProvider>
                </BrowserRouter>
            </PlatformAdminProvider>
        </IntlProvider>
    );
}
