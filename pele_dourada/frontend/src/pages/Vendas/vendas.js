// Estoque/index.js
import { useState, useEffect } from 'react';
import logo from '../../assets/icons/logo.svg';
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

  return (
    <div>
      <ControleVendasEncomendas/>
    </div>
  );
}

export default Vendas;
