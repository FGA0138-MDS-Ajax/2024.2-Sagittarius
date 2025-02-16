import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importando useLocation
import axios from 'axios';
import "./sidebar.css";
import Dashboard from "../../assets/icons/dashboard-icon.svg";
import Vendas from "../../assets/icons/vendas-icon.svg";
import Estoque from "../../assets/icons/estoque-icon.svg";
import Clientes from "../../assets/icons/clientes-icon.svg";
import Logout from "../../assets/icons/logout-icon.svg";
import Logo from "../../assets/icons/logo.svg";
import ChevronLeftSvg from "../../assets/icons/chevron_left.svg";

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation(); // Obtendo a localização atual
  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }
      await axios.post('http://127.0.0.1:8000/api/logout/', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <header className="sidebar-header">
        <Link to="/" className="header-logo">
          <img src={Logo} alt="Logo Frango" />
        </Link>
        <button className="toggler sidebar-toggler" onClick={toggleSidebar}>
          <span className="material-symbols-rounded">
            <img src={ChevronLeftSvg} alt="Chevron Right" />
          </span>
        </button>
      </header>
      <nav className="sidebar-nav">
        {/* Navegação Principal */}
        <ul className="nav-list primary-nav">
          <li className="nav-item">
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              <img src={Dashboard} alt="Dashboard Icon" className="nav-icon" />
              <span className="nav-label">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/vendas" 
              className={`nav-link ${location.pathname === "/vendas" ? "active" : ""}`}
            >
              <img src={Vendas} alt="Vendas Icon" className="nav-icon" />
              <span className="nav-label">Vendas</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/estoque" 
              className={`nav-link ${location.pathname === "/estoque" ? "active" : ""}`}
            >
              <img src={Estoque} alt="Estoque Icon" className="nav-icon" />
              <span className="nav-label">Estoque</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/clientes" 
              className={`nav-link ${location.pathname === "/clientes" ? "active" : ""}`}
            >
              <img src={Clientes} alt="Clientes Icon" className="nav-icon" />
              <span className="nav-label">Clientes</span>
            </Link>
          </li>
        </ul>
        {/* Navegação Secundária */}
        <ul className="nav-list secondary-nav">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              <img src={Logout} alt="Logout Icon" className="nav-icon" />
              <span className="nav-label">Logout</span>
            </Link>
            {/* 
            <button onClick={handleLogout} className="nav-link logout-button">
              <img src={Logout} alt="Logout Icon" className="nav-icon" />
              <span className="nav-label">Logout</span>
            </button> 
            */}
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
