import React, { useState } from "react";
import "./sidebar.css";
import Logo from '../../assets/icons/logo.svg';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Função para alternar o estado de colapso
  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Cabeçalho da Sidebar */}
      <header className="sidebar-header">
        <a href="#" className="header-logo">
          <img src={Logo} alt="Logo Frango" />
        </a>
        <button
          className="toggler sidebar-toggler"
          onClick={toggleSidebar}
        >
          <span className="material-symbols-rounded">
            {isCollapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>
      </header>

      {/* Navegação da Sidebar */}
      <nav className="sidebar-nav">
        {/* Navegação Principal */}
        <ul className="nav-list primary-nav">
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon material-symbols-rounded">dashboard</span>
              <span className="nav-label">Dashboard</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon material-symbols-rounded">vendas</span>
              <span className="nav-label">Vendas</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon material-symbols-rounded">estoque</span>
              <span className="nav-label">Estoque</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon material-symbols-rounded">clientes</span>
              <span className="nav-label">Clientes</span>
            </a>
          </li>
        </ul>

        {/* Navegação Secundária */}
        <ul className="nav-list secondary-nav">
          <li className="nav-item">
            <a href="#" className="nav-link">
              <span className="nav-icon material-symbols-rounded">account_circle</span>
              <span className="nav-label">Profile</span>
            </a>
          </li>
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
