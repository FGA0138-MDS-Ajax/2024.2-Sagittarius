import React, { useState } from "react";
import "./sidebar.css";
import Logo from '../../assets/icons/logo.svg';

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <header className="sidebar-header">
        <a href="#" className="header-logo">
          <img src={Logo} alt="Logo Frango" />
        </a>
        <button className="toggler sidebar-toggler" onClick={toggleSidebar}>
          <span className="material-symbols-rounded">
            {isCollapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>
      </header>
      {/* Navegação */}
      <nav className="sidebar-nav">
        {/* Navegação Principal */}
        <ul className="nav-list primary-nav">
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon material-symbols-rounded">dashboard</span>
              <span className="nav-label">Dashboard</span>
            </a>
          </li>
          {/* Outras opções */}
        </ul>
        {/* Navegação Secundária */}
        <ul className="nav-list secondary-nav">
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon material-symbols-rounded">logout</span>
              <span className="nav-label">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
