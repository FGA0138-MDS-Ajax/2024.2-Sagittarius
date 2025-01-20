import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar'; 
import ViewDashboard from '../../components/dashboard/dashboard';
import logo from '../../assets/logo.svg'; 

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <h1>Conteúdo Principal</h1>
        <p>O conteúdo será empurrado para a direita quando a sidebar abrir.</p>
      </main>
    </div>
  );
}

export default Dashboard;
