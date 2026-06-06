import { Navigate } from "react-router-dom";
import UserViewLayout from "../views/User-View/UserViewLayout";

import Home from "../views/User-View/pages/Home/Home";
import About from "../views/User-View/pages/About/About";
import Companies from "../views/User-View/pages/Companies/Companies";
import CompaniesDetail from "../views/User-View/pages/CompaniesDetails/CompaniesDetail";
import Jobs from "../views/User-View/pages/Jobs/Jobs";
import JobDetailPage from "../views/User-View/pages/JobDetailPage/JobDetailPage";
import Contact from "../views/User-View/pages/Contact/Contact";
import Pricing from "../views/User-View/pages/Pricing/Pricing";
import Login from "../views/User-View/pages/Login/Login";
import Signup from "../views/User-View/pages/Signup/Signup";

import DashboardPage from "../views/User-View/pages/User-Dashboard/Dashboard/Dashboard.js";
import AppliedJob from "../views/User-View/pages/User-Dashboard/AppliedJobs/AppliedJobs";
import SavedJob from "../views/User-View/pages/User-Dashboard/SavedJobs/SavedJob";
import Interview from "../views/User-View/pages/User-Dashboard/Interview/Interview";
import ProfilePage from "../views/User-View/pages/User-Dashboard/ProfilePage/ProfilePage";
import MessagesPage from "../views/User-View/pages/User-Dashboard/Messages/Messagespage";
import ResumePage from "../views/User-View/pages/User-Dashboard/Resume/ResumePage";

export const userRoutes = [{
    element: <UserViewLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/about-us", element: <About /> },
            { path: "/companies", element: <Companies /> },
            { path: "/companies/:id", element: <CompaniesDetail /> },
            { path: "/jobs", element: <Jobs /> },
            { path: "/jobs/:id", element: <JobDetailPage /> },
            { path: "/contact-us", element: <Contact /> },
            { path: "/pricing", element: <Pricing /> },
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },

            { path: "/user-dashboard", element: <DashboardPage /> },
            { path: "/user-dashboard/dashboard", element: <DashboardPage /> },
            { path: "/user-dashboard/applied-jobs", element: <AppliedJob /> },
            { path: "/user-dashboard/saved-jobs", element: <SavedJob /> },
            { path: "/user-dashboard/interviews", element: <Interview /> },
            { path: "/user-dashboard/interviews/join/:token", element: <Interview /> },
            { path: "/user-dashboard/interviews/:roomName", element: <Interview /> },
            { path: "/interviews", element: <Navigate to="/user-dashboard/interviews" replace /> },
            { path: "/interviews/join/:token", element: <Interview /> },
            { path: "/user-dashboard/profile", element: <ProfilePage /> },
            { path: "/user-dashboard/messages", element: <MessagesPage /> },
            { path: "/user-dashboard/resume", element: <ResumePage /> },
        ],
    },
];