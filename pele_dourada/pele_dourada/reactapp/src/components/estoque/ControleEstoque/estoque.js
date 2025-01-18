import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importando o Link para navegação
import './controle_estoque.css'; // Importando o CSS específico para a página de Controle de Estoque

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
    <div className="controle-estoque-page">
      <h1>Controle de Estoque</h1>
      <p>Aqui você pode gerenciar os itens do estoque.</p>

      {/* Barra de Busca */}
      <div>
        <input
          type="text"
          placeholder="Buscar produto"
          value={busca}
          onChange={handleBuscaChange}
        />
      </div>

      <div>
        <Link to="/estoque/adicionar">
          <button>Adicionar Produto</button>
        </Link>
      </div>

      {/* Lista de Produtos */}
      <div>
        <h2>Produtos no Estoque</h2>
        
      </div>
    </div>
  );
}

export default ControleEstoque;
