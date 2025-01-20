// Estoque/index.js
import { useState, useEffect } from 'react';
import logo from '../../assets/logo.svg';
import Sidebar from '../../components/sidebar/sidebar';
import ControleVendasEncomendas from '../../components/vendas/vendas';

function Vendas() {
  useEffect(() => {
    document.title = "Frango Assado Pele Dourada";
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = logo;
    }
  }, []);

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
    <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <div>
          <ControleVendasEncomendas/>
        </div>
      </main>
    </div>
  );
}

export default Vendas;
