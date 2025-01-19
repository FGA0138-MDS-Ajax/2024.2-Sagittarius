import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './sidebar.css';
import HomeIcon from  '../../assets/homeIcon.svg';
import VendasIcon from  '../../assets/vendasIcon.svg';
import EstoqueIcon from  '../../assets/estoqueIcon.svg';
import ClienteIcon from  '../../assets/clienteIcon.svg';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="btn toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '❮' : '❯'}
      </button>
      <nav className="menu">
        <ul>
          <li>        
            <Link to="/dashboard">
            <img src={HomeIcon} alt="Dashboard Icon" className="Icon" />
                 <a className="links-sidemenu" id="controle-estoque-button">Dashboard</a>
            </Link></li>
          <li>            
            <Link to="/vendas">
                <img src={VendasIcon} alt="Vendas Icon" className="Icon" />
                <a className="links-sidemenu" id="controle-estoque-button">Vendas</a>
            </Link>
            </li>
          <li>
            <Link to="/estoque">
                <img src={EstoqueIcon} alt="Estoque Icon" className="Icon" />
                <a className="links-sidemenu" id="controle-estoque-button">Estoque</a>
            </Link>
          </li>
          <li>
            <Link to="/clientes">
                <img src={ClienteIcon} alt="Cliente Icon" className="Icon" />
                <a className="links-sidemenu" id="controle-estoque-button">Clientes</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
