import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './controle_estoque.css';
import AdicionarProduto from '../AdicionarProduto/adicionar_produto';
import Sidebar from '../../../components/sidebar/sidebar';

function ControleEstoque() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
      const response = await axios.post('http://localhost:8000/api/product/update/', produto);
      alert(response.data);
      setIsEditModalOpen(false);
      setProdutoEditando(null);
      const updatedProdutos = produtos.map((p) =>
        p.name === produto.name ? { ...p, ...produto } : p
      );
      setProdutos(updatedProdutos);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert('Erro ao atualizar o produto');
    }
  };

  const handleRemoveProduct = async (produto) => {
    try {
      await axios.post('http://localhost:8000/api/product/delete/', {
        name: produto.name,
      });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert('Erro ao deletar o produto');
    }
  };


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
              <button className="controle-estoque-button" id="controle-estoque-button" onClick={() => setIsModalOpen(true)}>Adicionar Produto</button>
            </div>
          </div>

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
                      <button
                        className='controle-estoque-edit-button'
                        onClick={() => {
                          setProdutoEditando(produto);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className='controle-estoque-remove-button'
                        onClick={() => handleRemoveProduct(produto)}>
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

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

                  <div className="div-editar-produto-button">
                    <button type="submit" className="editar-produto-button">
                      Salvar
                    </button>
                  </div>
                </form>
                <div className="div-editar-produto-button">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="editar-produto-button"
                  >
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


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';  // Importe o Axios
// import './controle_estoque.css'; 
// import AdicionarProduto from '../AdicionarProduto/adicionar_produto';
// import Sidebar from '../../../components/sidebar/sidebar';

// function ControleEstoque() {
//   const [produtos, setProdutos] = useState([]);
//   const [busca, setBusca] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
//   const [isLoading, setIsLoading] = useState(true); // Para mostrar um carregando

//   useEffect(() => {
//     // Função para buscar os produtos da API
//     const fetchProdutos = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/products'); // Substitua pela URL correta da sua API
//         setProdutos(response.data.products);
//       } catch (error) {
//         console.error("Erro ao buscar produtos:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProdutos();
//   }, []);

//   const handleBuscaChange = (e) => {
//     setBusca(e.target.value);
//   };

//   const produtosFiltrados = produtos.filter((produto) =>
//     produto.name.toLowerCase().includes(busca.toLowerCase())
//   );

//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
//       <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//       <main className="main-content">
//         <div className="controle-estoque-page" id="controle-estoque-page">
//           <div className="controle-estoque-title" id="controle-estoque-title">
//             <h1>Controle de Estoque</h1>
//           </div>

//           <div className='div-header-widgets'>
//             <div className="controle-estoque-search" id="controle-estoque-search">
//               <input
//                 className="controle-estoque-input"
//                 type="text"
//                 placeholder="Buscar produto"
//                 value={busca}
//                 onChange={handleBuscaChange}
//               />
//             </div>

//             <div className="controle-estoque-add-button" id="controle-estoque-add-button">
//               <button 
//                 className="controle-estoque-button" 
//                 id="controle-estoque-button" 
//                 onClick={() => setIsModalOpen(true)} // Abre o modal
//               >
//                 <i className="fas fa-plus"></i> 
//                 Adicionar Produto
//               </button>
//             </div>
//           </div>

//           {isLoading ? (
//             <div>Carregando...</div> // Exibe um texto de carregamento enquanto os dados não chegam
//           ) : (
//             <div className="controle-estoque-list" id="controle-estoque-list">
//               <h2 className="controle-estoque-subtitle" id="controle-estoque-subtitle">Produtos no Estoque</h2>
//               <table className="controle-estoque-table">
//                 <thead>
//                   <tr>
//                     <th>Produto</th>
//                     <th>Preço</th>
//                     <th>Quantidade</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {produtosFiltrados.map((produto) => (
//                     <tr key={produto.id}>
//                       <td>{produto.name}</td>
//                       <td>R$ {produto.price.toFixed(2)}</td>
//                       <td>
//                         <div className="quantidade-container"
//                           style={{
//                             backgroundColor: produto.qtd <= 20 ? 'red' :
//                                               produto.qtd > 20 && produto.qtd <= 30 ? '#FFA600' : 
//                                               '#74B816',
//                             color: produto.qtd <= 20 ? 'white' :
//                                    produto.qtd > 20 && produto.qtd <= 30 ? 'black' : 
//                                    'white',
//                             padding: '10px', 
//                             borderRadius: '30px',
//                           }}
//                         >
//                           {produto.qtd}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Modal */}
//           {isModalOpen && (
//             <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
//               <div className={`modal-content ${isModalOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
//                 <button className="close-modal" onClick={() => setIsModalOpen(false)}>
//                   &times;
//                 </button>
//                 <AdicionarProduto />
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default ControleEstoque;