// Estoque/index.js
import React, { useEffect } from 'react';
import logo from '../../assets/logo.svg';
import Sidebar from '../../components/sidebar/sidebar';
import ControleVendasEncomendas from '../../components/vendas/vendas';

function Vendas() {
  useEffect(() => {
    document.title = "Pele Dourada - Estoque";
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = logo;
    }
  }, []);

  return (
    <div>
      <Sidebar />
      <ControleVendasEncomendas/>
    </div>
  );
}

export default Vendas;
