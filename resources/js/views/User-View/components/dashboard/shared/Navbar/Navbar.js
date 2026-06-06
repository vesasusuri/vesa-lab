import React from "react";
import "./navbar.scss";
import MobileNav from "../MobileNav/MobileNav";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { useAuth } from "../../../../../../context/AuthContext";
import NotificationBell from '../NotificationBell/NotificationBell';

const Navbar = (props) => {
  const { user } = useAuth();

  return (
    <div
      id="navbar"
      className={`nav nav__sticky ${props.styles ?? ""}`.trim()}
    >
      <div className="left-side">
        <a href="/" className="nav-logo">
          <div className="logo-container"></div>
        </a>
      </div>

      <div className="nav-links">
        <div className="nav-link home-link">
          <a href="/user-dashboard/dashboard" className="inner-nav-link">Dashboard</a>
          <div className="line"></div>
        </div>

        <div className="nav-link jobs-link">
          <a href="/user-dashboard/resume" className="inner-nav-link">Resume</a>
          <div className="line"></div>
        </div>

        <div className="nav-link jobs-link">
          <a href="/user-dashboard/profile" className="inner-nav-link">Profile</a>
          <div className="line"></div>
        </div>

        <div className="nav-link jobs-dropdown">
          <a href="/user-dashboard/applied-jobs" className="inner-nav-link">
            Jobs
            <TbTriangleInvertedFilled className="dropdown-caret2"/>
          </a>
          <div className="line"></div>
          <div className="jobs-dropdown-menu">
            <a href="/user-dashboard/applied-jobs" className="dropdown-item">Applied Jobs</a>
            <a href="/user-dashboard/saved-jobs" className="dropdown-item">Saved Jobs</a>
          </div>
        </div>

        <div className="nav-link pricing-link">
          <a href="/user-dashboard/interviews" className="inner-nav-link">Interviews</a>
          <div className="line"></div>
        </div>

        <div className="nav-link contact-us">
          <a href="/user-dashboard/messages" className="inner-nav-link">Messages</a>
          <div className="line"></div>
        </div>
      </div>

      <div className="nav-auth2">
        <NotificationBell />
        <a href="/" className="contact-us">{user?.name ?? ''}</a>
      </div> 
      <MobileNav />
    </div>
  );
};

export default Navbar;
