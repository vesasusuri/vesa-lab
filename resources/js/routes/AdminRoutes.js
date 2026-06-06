import AdminViewLayout from "../views/Admin-View/AdminViewLayout";
import AdminDashboardOverviewPage from "../views/Admin-View/pages/AdminDashboardOverviewPage/AdminDashboardOverviewPage";
import AdminDashboardContentPage from "../views/Admin-View/pages/AdminDashboardContentPage/AdminDashboardContentPage";
import AdminDashboardUsersPage from "../views/Admin-View/pages/AdminDashboardUsersPage/AdminDashboardUsersPage";
import AdminDashboardLogsPage from "../views/Admin-View/pages/AdminDashboardLogsPage/AdminDashboardLogsPage";
import AdminDashboardSettingsPage from "../views/Admin-View/pages/AdminDashboardSettingsPage/AdminDashboardSettingsPage";
import AdminDashboardMessagesPage from "../views/Admin-View/pages/AdminDashboardMessagesPage/AdminDashboardMessagesPage";
import AdminTeam from "../views/Admin-View/pages/AdminTeam/AdminTeam";
import AdminPricing from "../views/Admin-View/pages/AdminPricing/AdminPricing";

export const adminRoutes = [{
    element: <AdminViewLayout />,
        children: [
        { path: "/admin-dashboard", element: <AdminDashboardOverviewPage /> },
        { path: "/admin-dashboard/content", element: <AdminDashboardContentPage /> },
        { path: "/admin-dashboard/users", element: <AdminDashboardUsersPage /> },
        { path: "/admin-dashboard/logs", element: <AdminDashboardLogsPage /> },
        { path: "/admin-dashboard/settings", element: <AdminDashboardSettingsPage /> },
        { path: "/admin-dashboard/messages", element: <AdminDashboardMessagesPage /> },
        { path: "/admin-dashboard/team", element: <AdminTeam /> },
        { path: "/admin-dashboard/pricing", element: <AdminPricing /> },
        ],
    },
];