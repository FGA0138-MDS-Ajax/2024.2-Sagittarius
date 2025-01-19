import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'; 
import logo from '../../assets/logo.svg';
import ControleEstoque from '../../components/estoque/ControleEstoque/estoque';
import AdicionarProduto from '../../components/estoque/AdicionarProduto/adicionar_produto';
import Sidebar from '../../components/sidebar/sidebar';

function Estoque() {
  useEffect(() => {
    document.title = "Frango Assado Pele Dourada";
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = logo;
    }
  }, []);

  return (
    <div>
      <Sidebar />
      <Routes>
        <Route exact path="/" element={<ControleEstoque />} />
        <Route exact path="/adicionar" element={<AdicionarProduto />} />
      </Routes>
    </div>
  );
}

export default Estoque;
