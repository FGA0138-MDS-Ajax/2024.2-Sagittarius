import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // links
import './controle_estoque.css'; 

function ControleEstoque() {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Frango Assado', preco: 39.99, categoria: 'Principal', quantidade: 50 },
    { id: 2, nome: 'Arroz Branco', preco: 9.99, categoria: 'Acompanhamento', quantidade: 30 },
    { id: 3, nome: 'Farofa', preco: 4.99, categoria: 'Acompanhamento', quantidade: 20 },
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
      <div className="controle-estoque-title" id='controle-estoque-title'>
        <h1>Controle de Estoque</h1>
      </div>

      <div className="div-title-button">
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
            <button className="controle-estoque-button" id="controle-estoque-button">
              <i className="fas fa-plus"></i> 
              Adicionar Produto
            </button>
          </Link>
        </div>
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
                <td>
                  <div className="quantidade-container"
                    style={{
                      backgroundColor: produto.quantidade <= 20 ? 'red' :
                                        produto.quantidade > 20 && produto.quantidade <=30 ? '#FFA600' : 
                                        '#74B816',
                      color: produto.quantidade <= 20 ? 'white' :
                      produto.quantidade > 20 && produto.quantidade <=30 ? 'black' : 
                      'white',
                      padding: '10px',  // Adiciona algum espaçamento para a div
                      borderRadius: '30px'  // Opcional: adiciona borda arredondada
                    }}
                  >
                    {produto.quantidade}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ControleEstoque;
