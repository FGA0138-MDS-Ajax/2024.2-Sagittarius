import React, { useState } from 'react';
import './controle_estoque.css'; 
import AdicionarProduto from '../AdicionarProduto/adicionar_produto';


function ControleEstoque() {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Frango Assado', preco: 39.99, categoria: 'Principal', quantidade: 50 },
    { id: 2, nome: 'Arroz Branco', preco: 9.99, categoria: 'Acompanhamento', quantidade: 30 },
    { id: 3, nome: 'Farofa', preco: 4.99, categoria: 'Acompanhamento', quantidade: 20 },
  ]);

  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
  };

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="controle-estoque-page" id="controle-estoque-page">
      <h1 className="controle-estoque-title" id="controle-estoque-title">Controle de Estoque</h1>
      
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
        <button 
          className="controle-estoque-button" 
          id="controle-estoque-button" 
          onClick={() => setIsModalOpen(true)} // Abre o modal
        >
          Adicionar Produto
        </button>
      </div>

      <div className="controle-estoque-list" id="controle-estoque-list">
        <h2 className="controle-estoque-subtitle" id="controle-estoque-subtitle">Produtos no Estoque</h2>
        <table className="controle-estoque-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço</th>
              <th>Categoria</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>R$ {produto.preco.toFixed(2)}</td>
                <td>{produto.categoria}</td>
                <td>{produto.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
          <button className="close-modal" onClick={() => setIsModalOpen(false)}>
            &times; 
          </button>
            <AdicionarProduto />
          </div>
        </div>
      )}
    </div>
  );
}

export default ControleEstoque;
