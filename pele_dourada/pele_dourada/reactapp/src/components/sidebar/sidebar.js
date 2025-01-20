import React, { useState } from "react";
import "./sidebar.css";
import Logo from '../../assets/icons/logo.svg';
import Dashboard from "../../assets/icons/dashboard-icon.svg";
import Vendas from "../../assets/icons/vendas-icon.svg";
import Estoque from "../../assets/icons/estoque-icon.svg";
import Clientes from "../../assets/icons/clientes-icon.svg";
import Profile from "../../assets/icons/personIcon.svg";
import Logout from "../../assets/icons/logout-icon.svg";
import ChevronLeftSvg from "../../assets/icons/chevron_left.svg";


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
            <img src={ChevronLeftSvg} alt="Chevron Right" />
          </span>
        </button>
      </header>
      {/* Navegação */}
      <nav className="sidebar-nav">
        {/* Navegação Principal */}
        <ul className="nav-list primary-nav">
          <li className="nav-item">
            <a href="#" className="nav-link">
              <img
                src={Dashboard}
                alt="Dashboard Icon"
                className="nav-icon"
              />
              <span className="nav-label">Dashboard</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
            <img
                src={Vendas}
                alt="Vendas Icon"
                className="nav-icon"
              />
              <span className="nav-label">Vendas</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
            <img
                src={Estoque}
                alt="Estoque Icon"
                className="nav-icon"
              />
              <span className="nav-label">Estoque</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
            <img
                src={Clientes}
                alt="Clientes Icon"
                className="nav-icon"
              />
              <span className="nav-label">Clientes</span>
            </a>
          </li>
        </ul>
        {/* Navegação Secundária */}
        <ul className="nav-list secondary-nav">
          <li className="nav-item">
            <a href="#" className="nav-link">
            <img
                src={Profile}
                alt="Profile Icon"
                className="nav-icon"
              />
              <span className="nav-label">Perfil</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
            <img
                src={Logout}
                alt="Logout Icon"
                className="nav-icon"
              />
              <span className="nav-label">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
