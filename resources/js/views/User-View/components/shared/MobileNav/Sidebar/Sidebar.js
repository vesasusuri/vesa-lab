import React from "react";
import { CgClose } from "react-icons/cg";
import {BiSupport } from "react-icons/bi";
import { RiInformationFill } from "react-icons/ri";
import { FaHome, FaBuilding, FaMoneyBill } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { usePlatformAdmin } from "../../../../../../context/PlatformAdminContext";

const iconMap = {
  home: FaHome,
  about: RiInformationFill,
  jobs: MdWork,
  companies: FaBuilding,
  pricing: FaMoneyBill,
  contact: BiSupport,
};

const Sidebar = (props) => {
  const { data } = usePlatformAdmin();
  const navPages = data.userViewPages
    .filter((page) => page.enabled && page.showInNav)
    .sort((a, b) => a.navOrder - b.navOrder);
  const settings = data.settings || {};

  return (
    <div className="mobile-sidebar">
      <div className="sidebar-logo-row">
        <a href="/">
          <div className="mobile-logo-container"></div>
        </a>
        <button onClick={props.click}>
          <CgClose />{" "}
        </button>
      </div>

      <div className="mobile-sidebar-links">
        {navPages.map((page) => {
          const Icon = iconMap[page.id] || FaHome;
          return (
            <div className="nav-sidebar-link" key={page.id}>
              <a href={page.path} className="nav-anchor">
                <Icon />
                {page.title}
              </a>
            </div>
          );
        })}
      </div>

      <div className="sidebar-auth">
        <a href="/login" className="contact-us">
          Log In
        </a>
      </div>

      <div className="space"></div>
    </div>
  );
};

export default Sidebar;
