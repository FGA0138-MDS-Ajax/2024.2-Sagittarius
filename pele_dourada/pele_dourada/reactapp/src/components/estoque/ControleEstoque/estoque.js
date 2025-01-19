import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './controle_estoque.css'; 

function ControleEstoque() {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Produto 1', imagem: 'url_da_imagem_1', descricao: 'Descrição do produto 1' },
    { id: 2, nome: 'Produto 2', imagem: 'url_da_imagem_2', descricao: 'Descrição do produto 2' },
  ]);
  const [busca, setBusca] = useState('');

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
  };

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="controle-estoque-page" id="controle-estoque-page">
      <h1 className="controle-estoque-title" id="controle-estoque-title">Controle de Estoque</h1>
     
      {/* Barra de Busca */}
      <div className="controle-estoque-search" id="controle-estoque-search">
        <input
          className="controle-estoque-input"
          type="text"
          placeholder="Buscar produto"
          value={busca}
          onChange={handleBuscaChange}
        />
      </div>

      <div className="controle-estoque-add-button" id="controle-estoque-add-button">
        <Link to="/estoque/adicionar">
          <button className="controle-estoque-button" id="controle-estoque-button">Adicionar Produto</button>
        </Link>
      </div>

      {/* Lista de Produtos */}
      <div className="controle-estoque-list" id="controle-estoque-list">
        <h2 className="controle-estoque-subtitle" id="controle-estoque-subtitle">Produtos no Estoque</h2>
      </div>
    </div>
  );
}

export default ControleEstoque;
