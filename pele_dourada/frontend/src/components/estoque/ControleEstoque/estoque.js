import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './controle_estoque.css';
import AdicionarProduto from '../AdicionarProduto/adicionar_produto';
import Sidebar from '../../../components/sidebar/sidebar';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { BsFillBoxSeamFill } from "react-icons/bs";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


function ControleEstoque() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [produtoRemovendo, setProdutoRemovendo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProdutos(response.data.products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const handleBuscaChange = (e) => setBusca(e.target.value);

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Agora o valor correto da página será passado
  };

  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(produtos.length / 12); // Ajuste o total de páginas com base na quantidade de produtos

  const sortedProdutos = [...produtos].sort((a, b) => {
    if (sortConfig.key) {
      const aKey = a[sortConfig.key];
      const bKey = b[sortConfig.key];

      if (aKey < bKey) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aKey > bKey) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const produtosFiltrados = sortedProdutos.filter((produto) =>
    produto.name.toLowerCase().includes(busca.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '▲▼';
  };

  const handleEditProduct = async (produto) => {
    try {
      await axios.put('http://localhost:8000/api/product/update/', {
        id: produtoEditando.id,
        name: produtoEditando.name,
        price: produtoEditando.price,
        qtd: produtoEditando.qtd
      });

      setIsEditModalOpen(false);
      setProdutoEditando(null);
      const updatedProdutos = produtos.map((p) =>
        p.name === produtoEditando.oldName ? { ...p, ...produtoEditando } : p
      );
      setProdutos(updatedProdutos);
      setSuccessMessage('Produto editado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000); // Limpa a mensagem após 3 segundos
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert('Erro ao atualizar o produto');
    }
  };

  const handleRemoveProduct = async () => {
    try {
      await axios.delete('http://localhost:8000/api/product/delete/', {
        data: { id: produtoRemovendo.id }
      });

      setProdutos(produtos.filter((produto) => produto.id !== produtoRemovendo.id));
      setIsConfirmModalOpen(false);
      setProdutoRemovendo(null);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert('Erro ao deletar o produto');
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  const handlePriceChange = (e, setProdutoEditando) => {
    let rawValue = e.target.value.replace(/[^\d,]/g, "").replace(",", ".");
    let numericValue = parseFloat(rawValue) || 0;
  
    setProdutoEditando((prev) => ({
      ...prev,
      price: numericValue,
    }));
  };

  function EditarProduto({ produtoEditando, setProdutoEditando }) {
    return (
      <div className="editar-produto-field">
        <label className="editar-produto-label" htmlFor="edit-price">
          Preço
        </label>
        <input
          id="edit-price"
          type="text"
          className="editar-produto-input"
          value={formatCurrency(produtoEditando?.price)}
          onChange={(e) => handlePriceChange(e, setProdutoEditando)}
        />
      </div>
    );
  }

  const handleAddProduct = (novoProduto) => {
    setProdutos([...produtos, novoProduto]);
    setIsModalOpen(false);
  };
  
  <AdicionarProduto onAddProduct={handleAddProduct} />
  

  return (
    <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <div className="controle-estoque-page" id="controle-estoque-page">
          <div className="controle-estoque-title" id="controle-estoque-title">
            <h1>Controle de Estoque</h1>
          </div>

          <div className='div-header-widgets'>
            <div className="controle-estoque-search" id='controle-estoque-search'>
              <input
                className='controle-estoque-input'
                type="text"
                placeholder="Buscar produto"
                value={busca}
                onChange={handleBuscaChange}
              />
            </div>
            <div className="controle-estoque-add-button" id="controle-estoque-add-button">
              <button className="controle-estoque-button" id="controle-estoque-button" onClick={() => setIsModalOpen(true)}>
              <BsFillBoxSeamFill />
              Adicionar Produto</button>
            </div>
          </div>

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {isLoading ? (
            <div>Carregando...</div>
          ) : (
            <table className="controle-estoque-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')}>
                    Produto {getSortIcon('name')}
                  </th>
                  <th onClick={() => requestSort('price')}>
                    Preço {getSortIcon('price')}
                  </th>
                  <th onClick={() => requestSort('qtd')}>
                    Quantidade {getSortIcon('qtd')}
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.name}</td>
                    <td>R$ {produto.price.toFixed(2)}</td>
                    <td>
                      <div
                        className={`quantidade-container ${
                          produto.qtd > 20
                            ? "alta"
                            : produto.qtd > 10
                              ? "media"
                              : "baixa"
                        }`}
                      >
                        {produto.qtd}
                      </div>
                    </td>
                    <td>
                      <div className='controle-estoque-acoes'>
                        <button
                          className='controle-estoque-edit-button'
                          onClick={() => {
                            setProdutoEditando({ ...produto, oldName: produto.name });
                            setIsEditModalOpen(true);
                          }}
                        >
                          <FaPencilAlt className="icon-button" /> Editar
                        </button>
                        <button
                          className='controle-estoque-remove-button'
                          onClick={() => {
                            setProdutoRemovendo(produto);
                            setIsConfirmModalOpen(true);
                          }}>
                          <FaTimes className="icon-button" /> Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="pagination">
            <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage} // A página ativa será gerenciada por este valor
              onChange={handlePageChange} // Passando a função corretamente
              shape="rounded"
              color="black"
              sx={{
                '& .MuiPaginationItem-root': {
                  backgroundColor: 'transparent', // Cor de fundo dos itens de paginação
                  color: '#f15b1b', // Cor do texto
                  '&:hover': {
                    backgroundColor: '#d1d1d1', // Cor ao passar o mouse
                  },
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                  backgroundColor: '#f15b1b', // Cor de fundo da página selecionada
                  color: '#fff', // Cor do texto da página selecionada
                  '&:hover': {
                    backgroundColor: '#f15b1b', // Cor ao passar o mouse na página selecionada
                  },
                },
              }}
            />
            </Stack>
          </div>

          {isModalOpen && (
            <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
              <div className={`modal-content ${isModalOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
                <AdicionarProduto onAddProduct={handleAddProduct} />
              </div>
            </div>
          )}

          {isEditModalOpen && (
            <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
              <div
                className="modal-content editar-produto-page"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="editar-produto-title">Editar Produto</h2>
                <form
                  className="editar-produto-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditProduct(produtoEditando);
                  }}
                >
                  <div className="editar-produto-field">
                    <label className="editar-produto-label" htmlFor="edit-name">
                      Nome
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      className="editar-produto-input"
                      value={produtoEditando.name}
                      onChange={(e) =>
                        setProdutoEditando({
                          ...produtoEditando,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="editar-produto-field">
                    <label className="editar-produto-label" htmlFor="edit-price">
                      Preço
                    </label>
                    <input
                      id="edit-price"
                      type="number"
                      className="editar-produto-input"
                      value={produtoEditando.price}
                      onChange={(e) =>
                        setProdutoEditando({
                          ...produtoEditando,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="editar-produto-field">
                    <label className="editar-produto-label" htmlFor="edit-qtd">
                      Quantidade
                    </label>
                    <input
                      id="edit-qtd"
                      type="number"
                      className="editar-produto-input"
                      value={produtoEditando.qtd}
                      onChange={(e) =>
                        setProdutoEditando({
                          ...produtoEditando,
                          qtd: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>

                  <div className="div-editar-produto-button">
                    <button type="submit" className="editar-produto-button">
                      Salvar
                    </button>
                  </div>

                  <div className="div-editar-produto-button">
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="editar-produto-button"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isConfirmModalOpen && (
            <div className="modal-overlay" onClick={() => setIsConfirmModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Confirmar Remoção</h2>
                <p>Tem certeza que deseja remover o produto "{produtoRemovendo?.name}"?</p>
                <div className="div-editar-produto-button">
                  <button onClick={handleRemoveProduct} className="editar-produto-button">
                    Confirmar
                  </button>
                  <button onClick={() => setIsConfirmModalOpen(false)} className="editar-produto-button">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default ControleEstoque;