// import React from "react";
// import axios from 'axios';
// import { Link, useNavigate } from "react-router-dom"; // Importando o Link do react-router-dom
// import "./sidebar.css";
// import Dashboard from "../../assets/icons/dashboard-icon.svg";
// import Vendas from "../../assets/icons/vendas-icon.svg";
// import Estoque from "../../assets/icons/estoque-icon.svg";
// import Clientes from "../../assets/icons/clientes-icon.svg";
// import Logout from "../../assets/icons/logout-icon.svg";

// function Sidebar() {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('Token não encontrado');
//         return;
//       }
//       await axios.post('http://127.0.0.1:8000/api/logout/', {}, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       localStorage.removeItem('token');
//       navigate('/');
//     } catch (err) {
//       console.error('Erro ao fazer logout:', err);
//     }
//   };

//   return (
//     <aside className="sidebar">
//       <nav className="sidebar-nav">
//         {/* Navegação Principal */}
//         <ul className="nav-list primary-nav">
//           <li className="nav-item">
//             <Link to="/dashboard" className="nav-link">
//               <img src={Dashboard} alt="Dashboard Icon" className="nav-icon" />
//               <span className="nav-label">Dashboard</span>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/vendas" className="nav-link">
//               <img src={Vendas} alt="Vendas Icon" className="nav-icon" />
//               <span className="nav-label">Vendas</span>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/estoque" className="nav-link">
//               <img src={Estoque} alt="Estoque Icon" className="nav-icon" />
//               <span className="nav-label">Estoque</span>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/clientes" className="nav-link">
//               <img src={Clientes} alt="Clientes Icon" className="nav-icon" />
//               <span className="nav-label">Clientes</span>
//             </Link>
//           </li>
//         </ul>
//         {/* Navegação Secundária */}
//         <ul className="nav-list secondary-nav">
//           <li className="nav-item">
//             <button onClick={handleLogout} className="nav-link logout-button">
//               <img src={Logout} alt="Logout Icon" className="nav-icon" />
//               <span className="nav-label">Logout</span>
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </aside>
//   );
// }

// export default Sidebar;

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";
import Dashboard from "../../assets/icons/dashboard-icon.svg";
import Vendas from "../../assets/icons/vendas-icon.svg";
import Estoque from "../../assets/icons/estoque-icon.svg";
import Clientes from "../../assets/icons/clientes-icon.svg";
import Logout from "../../assets/icons/logout-icon.svg";
import ChevronLeftSvg from "../../assets/icons/chevron_left.svg";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedState = localStorage.getItem("sidebarCollapsed");
    if (storedState !== null) {
      setIsCollapsed(JSON.parse(storedState));
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => {
      const newState = !prevState;
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
      return newState;
    });
  };

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
        <button 
          className="toggler sidebar-toggler" 
          onClick={toggleSidebar} 
          aria-expanded={!isCollapsed} 
          aria-label="Alternar menu lateral"
        >
          <span className="material-symbols-rounded">
            <img src={ChevronLeftSvg} alt="Chevron" className={isCollapsed ? "rotated" : ""} />
          </span>
        </button>
      </header>
      <nav className="sidebar-nav">
        <ul className="nav-list primary-nav">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <img src={Dashboard} alt="Dashboard Icon" className="nav-icon" />
              <span className="nav-label">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/vendas" className="nav-link">
              <img src={Vendas} alt="Vendas Icon" className="nav-icon" />
              <span className="nav-label">Vendas</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/estoque" className="nav-link">
              <img src={Estoque} alt="Estoque Icon" className="nav-icon" />
              <span className="nav-label">Estoque</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/clientes" className="nav-link">
              <img src={Clientes} alt="Clientes Icon" className="nav-icon" />
              <span className="nav-label">Clientes</span>
            </Link>
          </li>
        </ul>
        <ul className="nav-list secondary-nav">
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link logout-button">
              <img src={Logout} alt="Logout Icon" className="nav-icon" />
              <span className="nav-label">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
