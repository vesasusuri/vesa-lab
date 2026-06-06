import React, { useState, useEffect } from "react";
import "./navbar.scss";
import MobileNav from "../MobileNav/MobileNav";
import { usePlatformAdmin } from "../../../../../context/PlatformAdminContext";

const Navbar = (props) => {
  const [isSticky, setIsSticky] = useState(false);
  const { data } = usePlatformAdmin();
  const navPages = data.userViewPages
    .filter((page) => page.enabled && page.showInNav)
    .sort((a, b) => a.navOrder - b.navOrder);
  const settings = data.settings || {};

  useEffect(() => {
    const nav = document.querySelector(".nav");
    if (!nav) {
      return undefined;
    }

    const handleScroll = () => {
      const scrollHeight = window.pageYOffset;
      setIsSticky(scrollHeight > 25);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {(settings.maintenanceMode || (settings.announcementEnabled && settings.announcementText)) ? (
        <div className="nav-announcement">
          {settings.maintenanceMode ? 'Maintenance mode is active. Some features may be unavailable.' : settings.announcementText}
        </div>
      ) : null}
      <div
        id="navbar"
        className={`nav ${settings.maintenanceMode || settings.announcementEnabled ? "nav--with-announcement" : ""} ${props.styles ?? ""} ${isSticky ? "nav__sticky" : ""}`.trim()}
      >
        <div className="left-side">
          <a href="/" className="nav-logo">
            <div className="logo-container"></div>
          </a>
        </div>

        <div className="nav-links">
          {navPages.map((page) => (
            <div className="nav-link" key={page.id}>
              <a href={page.path} className="inner-nav-link">{page.title}</a>
              <div className="line"></div>
            </div>
          ))}
        </div>

        <div className="nav-auth">
          <a href="/login" className="contact-us">Login</a>
        </div>
        <MobileNav />
      </div>
    </>
  );
};

export default Navbar;
