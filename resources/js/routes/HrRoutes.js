import HRViewLayout from "../views/HR-View/HRViewLayout";

import HireDashboardPage from "../views/HR-View/pages/HireDashboard/HireDashboard";
import HireDashboardInterviewsPage from "../views/HR-View/pages/HireDashboardInterviewsPage/HireDashboardInterviewsPage";
import HireDashboardHiresPage from "../views/HR-View/pages/HireDashboardHiresPage/HireDashboardHiresPage";
import HireDashboardAnalyticsPage from "../views/HR-View/pages/HireDashboardAnalyticsPage/HireDashboardAnalyticsPage";
import HireDashboardSettingsPage from "../views/HR-View/pages/HireDashboardSettingsPage/HireDashboardSettingsPage";
import HireDashboardApplicationsPage from "../views/HR-View/pages/HireDashboardApplicationsPage/HireDashboardApplicationsPage";
import HireDashboardListingsPage from "../views/HR-View/pages/HireDashboardListingsPage/HireDashboardListingsPage";
import HireDashboardMessagesPage from "../views/HR-View/pages/HireDashboardMessagesPage/HireDashboardMessagesPage";
import HireDashboardTeamPage from "../views/HR-View/pages/HireDashboardTeamPage/HireDashboardTeamPage";

export const hrRoutes = [{
    element: <HRViewLayout />,
        children: [
        { path: "/hire-dashboard", element: <HireDashboardPage /> },
        { path: "/hire-dashboard/interviews", element: <HireDashboardInterviewsPage /> },
        { path: "/hire-dashboard/hires", element: <HireDashboardHiresPage /> },
        { path: "/hire-dashboard/analytics", element: <HireDashboardAnalyticsPage /> },
        { path: "/hire-dashboard/settings", element: <HireDashboardSettingsPage /> },
        { path: "/hire-dashboard/applications", element: <HireDashboardApplicationsPage /> },
        { path: "/hire-dashboard/listings", element: <HireDashboardListingsPage /> },
        { path: "/hire-dashboard/messages", element: <HireDashboardMessagesPage /> },
        { path: "/hire-dashboard/team", element: <HireDashboardTeamPage /> },
        ],
    },
];