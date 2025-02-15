import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import './controle_estoque.css';
import AdicionarProduto from '../AdicionarProduto/adicionar_produto';
import Sidebar from '../../../components/sidebar/sidebar';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { BsFillBoxSeamFill } from "react-icons/bs";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const handleInputChange = (e) => {
  let value = e.target.value;

  value = value.replace(/\D/g, ""); 
  value = value.replace(/(\d)(\d{2})$/, "$1.$2"); 
  value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, ","); 

  e.target.value = value;
};

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

  const handleQtdChange = (e, setProdutoEditando) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) {
      setProdutoEditando((prev) => ({
        ...prev,
        qtd: value,
      }));
    }
  };

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
    setCurrentPage(value); 
  };

  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(produtos.length / 12); // Ajuste o total de páginas com base na quantidade de produtos

  const sortedProdutos = [...produtos].sort((a, b) => {
    if (sortConfig.key) {
      let aKey = a[sortConfig.key];
      let bKey = b[sortConfig.key];
  
      if (typeof aKey === 'string' && typeof bKey === 'string') {
        aKey = aKey.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        bKey = bKey.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      }
  
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

        toast.success(`${produtoEditando.name} editado com sucesso!`, { // Toast de sucesso
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
            transition: Bounce,
            style: { width: '100%' }
        });

    } catch (error) {
        console.error("Erro ao atualizar produto:", error);

        toast.error('Erro ao editar o produto. Verifique os dados e tente novamente.', { // Toast de erro
            position: 'top-right',
            autoClose: 5000,
            theme: 'colored',
        });
    }
};

const handleRemoveProduct = async () => {
  try {
      const productName = produtoRemovendo.name; // Armazena o nome *antes* de remover

      await axios.delete('http://localhost:8000/api/product/delete/', {
          data: { id: produtoRemovendo.id }
      });

      setProdutos(produtos.filter((produto) => produto.id !== produtoRemovendo.id));
      setIsConfirmModalOpen(false);
      setProdutoRemovendo(null);

      toast.success(`${productName} removido com sucesso!`, { // Toast com nome
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
          transition: Bounce,
      });

  } catch (error) {
      console.error("Erro ao deletar produto:", error);

      toast.error('Erro ao deletar o produto. Tente novamente.', {
          position: 'top-right',
          autoClose: 5000,
          theme: 'colored',
      });
  }
};

  const produtosPorPagina = 12;
  const produtosNaPaginaAtual = produtosFiltrados.slice(
    (currentPage - 1) * produtosPorPagina, // Índice inicial
    currentPage * produtosPorPagina        // Índice final
  );
  
  const handlePriceChange = (e) => {
    handleInputChange(e);
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    const numericValue = parseFloat(rawValue) / 100; // Converte centavos para reais
  
    setProdutoEditando((prev) => ({
      ...prev,
      price: numericValue,
    }));
  };

  const handleAddProduct = (novoProduto) => {
    setProdutos([...produtos, novoProduto]);
    setIsModalOpen(false);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <ToastContainer />
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
            <div className="success-message-estoque-edit">
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
              {produtosNaPaginaAtual.map((produto) => (
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
              siblingCount={1} 
              boundaryCount={1} 
              showFirstButton 
              showLastButton 
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
            type="text"
            className="editar-produto-input"
            value={formatCurrency(produtoEditando.price)}
            onChange={(e) => handlePriceChange(e, setProdutoEditando)}
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
            onChange={(e) => handleQtdChange(e, setProdutoEditando)}
            min="0"
            step="1"
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
            className="button-secondary"
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
                  <button onClick={() => setIsConfirmModalOpen(false)} className="button-secondary">
                    Cancelar
                  </button>
                  <button onClick={handleRemoveProduct} className="editar-produto-button">
                    Confirmar
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