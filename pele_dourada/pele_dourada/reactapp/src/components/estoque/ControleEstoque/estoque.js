import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Importe o Axios
import './controle_estoque.css'; 
import AdicionarProduto from '../AdicionarProduto/adicionar_produto';
import Sidebar from '../../../components/sidebar/sidebar';

function ControleEstoque() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
  const [isLoading, setIsLoading] = useState(true); // Para mostrar um carregando

  useEffect(() => {
    // Função para buscar os produtos da API
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products'); // Substitua pela URL correta da sua API
        setProdutos(response.data.products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
  };

  const produtosFiltrados = produtos.filter((produto) =>
    produto.name.toLowerCase().includes(busca.toLowerCase())
  );

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <div className="controle-estoque-page" id="controle-estoque-page">
          <div className="controle-estoque-title" id="controle-estoque-title">
            <h1>Controle de Estoque</h1>
          </div>

          <div className='div-header-widgets'>
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
                <i className="fas fa-plus"></i> 
                Adicionar Produto
              </button>
            </div>
          </div>

          {isLoading ? (
            <div>Carregando...</div> // Exibe um texto de carregamento enquanto os dados não chegam
          ) : (
            <div className="controle-estoque-list" id="controle-estoque-list">
              <h2 className="controle-estoque-subtitle" id="controle-estoque-subtitle">Produtos no Estoque</h2>
              <table className="controle-estoque-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((produto) => (
                    <tr key={produto.id}>
                      <td>{produto.name}</td>
                      <td>R$ {produto.price.toFixed(2)}</td>
                      <td>
                        <div className="quantidade-container"
                          style={{
                            backgroundColor: produto.qtd <= 20 ? 'red' :
                                              produto.qtd > 20 && produto.qtd <= 30 ? '#FFA600' : 
                                              '#74B816',
                            color: produto.qtd <= 20 ? 'white' :
                                   produto.qtd > 20 && produto.qtd <= 30 ? 'black' : 
                                   'white',
                            padding: '10px', 
                            borderRadius: '30px',
                          }}
                        >
                          {produto.qtd}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
              <div className={`modal-content ${isModalOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
                <AdicionarProduto />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ControleEstoque;
