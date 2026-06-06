import React from "react";
import { CgClose } from "react-icons/cg";
import { FaHome, FaUser, FaFileAlt, FaBriefcase } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import NotificationBell from '../../NotificationBell/NotificationBell';

const Sidebar = (props) => {
  return (
    <div className="mobile-sidebar">
      <div className="sidebar-logo-row">
        <a href="/user-dashboard/dashboard">
          <div className="mobile-logo-container"></div>
        </a>
        <button onClick={props.click}>
          <CgClose />
        </button>
      </div>

      <div className="mobile-sidebar-links">
        <div className="nav-sidebar-link">
          <a href="/user-dashboard/dashboard" className="nav-anchor">
            <FaHome />
            Dashboard
          </a>
        </div>

        <div className="nav-sidebar-link">
          <a href="/user-dashboard/resume" className="nav-anchor">
            <FaFileAlt />
            Resume
          </a>
        </div>

        <div className="nav-sidebar-link">
          <a href="/user-dashboard/profile" className="nav-anchor">
            <FaUser />
            Profile
          </a>
        </div>

        <div className="nav-sidebar-link">
          <a href="/user-dashboard/applied-jobs" className="nav-anchor">
            <MdWork />
            Applied Jobs
          </a>
        </div>

        <div className="nav-sidebar-link">
          <a href="/user-dashboard/unfinished-jobs" className="nav-anchor">
            <MdWork />
            Unfinished Jobs
          </a>
        </div>

        <div className="nav-sidebar-link">
          <a href="/user-dashboard/saved-jobs" className="nav-anchor">
            <MdWork />
            Saved Jobs
          </a>
        </div>

        <div className="nav-sidebar-link">
          <a href="/user-dashboard/interviews" className="nav-anchor">
            <FaBriefcase />
            Interviews
          </a>
        </div>

        <div className="nav-sidebar-link">
          <a href="/user-dashboard/messages" className="nav-anchor">
            <FaBriefcase />
            Messages
          </a>
        </div>
      </div>

      <div className="sidebar-auth">
        <NotificationBell />

        <a href="/" className="contact-us">
          Vesa Susuri
        </a>
      </div>

      <div className="space"></div>
    </div>
  );
};

export default Sidebar;
