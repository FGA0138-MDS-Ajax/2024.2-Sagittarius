// Estoque/index.js
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'; // Importando as rotas
import logo from '../../assets/logo.svg';
import ControleEstoque from '../../components/estoque/ControleEstoque/estoque';
import AdicionarProduto from '../../components/estoque/AdicionarProduto/adicionar_produto';

function Estoque() {
  useEffect(() => {
    document.title = "Pele Dourada - Estoque";
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = logo;
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route exact path="/" element={<ControleEstoque />} />
        <Route exact path="/adicionar" element={<AdicionarProduto />} />
      </Routes>
    </div>
  );
}

export default Estoque;
