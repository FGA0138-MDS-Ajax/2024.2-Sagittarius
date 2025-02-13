import React, { useState, useEffect } from "react";
import axios from "axios";
import "./vendas.css";
import { MdOutlinePointOfSale } from "react-icons/md";
import { GiChickenOven } from "react-icons/gi";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import Sidebar from '../../components/sidebar/sidebar';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const VendasPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [vendas, setVendas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomeCliente: "",
    metodoPagamento: "",
    tipoVenda: "",
    produtos: [],
  });
  const [produtosEstoque, setProdutosEstoque] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [expandedVendas, setExpandedVendas] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Limite de 10 itens por página
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [vendaEditando, setVendaEditando] = useState(null);

  const openEditModal = (venda) => {
    setSelectedVenda(venda);
    setVendaEditando({ ...venda });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVenda(null);
    setVendaEditando(null);
  };

  const openRemoveModal = (venda) => {
    setSelectedVenda(venda);
    setIsRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setSelectedVenda(null);
  };

  const fetchVendas = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders/");
      setVendas(response.data.orders);
    } catch (error) {
      console.error("Erro ao buscar vendas", error);
    }
  };

  const fetchProdutosEstoque = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products/");
      setProdutosEstoque(response.data.products);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/client/get/");
      setClientes(response.data.clients);
    } catch (error) {
      console.error("Erro ao buscar clientes", error);
    }
  };

  useEffect(() => {
    fetchVendas();
    fetchProdutosEstoque();
    fetchClientes();
  }, []);

  const openModal = () => {
    setFormData({
      nomeCliente: "",
      metodoPagamento: "",
      tipoVenda: "",
      produtos: [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); // Fecha o modal
    setErrorMessage(""); // Reseta a mensagem de erro
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setVendaEditando((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8000/api/order/update/", {
        number: vendaEditando.id,
        new_name: formData.name,
        new_payment: formData.metodoPagamento,
        new_tipe: formData.tipoVenda,
        new_product: formData.produtos.map((produto) => produto.name),
        new_price: formData.produtos.map((produto) => produto.price),
        new_qtd: formData.produtos.map((produto) => produto.quantidade),
      });
      fetchVendas();
      closeModal();
    } catch (error) {
      console.error("Erro ao atualizar a venda", error);
    }
  };

  const handleRemoveVenda = async () => {
    try {
      await axios.delete("http://localhost:8000/api/order/delete/", {
        data: { number: selectedVenda.number }, // Enviando no corpo
      });

      fetchVendas();
      closeRemoveModal();
    } catch (error) {
      console.error("Erro ao remover venda", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "nomeCliente") {
      if (value) {
        const filtered = clientes.filter((cliente) =>
          cliente.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredClientes(filtered);
      } else {
        setFilteredClientes([]);
      }
    }
  };

  const handleSelectCliente = (cliente) => {
    setFormData((prevState) => ({
      ...prevState,
      nomeCliente: cliente.name,
    }));
    setFilteredClientes([]);
  };

  const handleAdicionarProduto = (produtoId) => {
    const produto = produtosEstoque.find((p) => p.id === produtoId);

    if (produto) {
      const produtoJaAdicionado = formData.produtos.find(
        (p) => p.id === produto.id
      );

      if (produtoJaAdicionado) {
        if (produtoJaAdicionado.quantidade + 1 > produto.qtd) {
          setErrorMessage(
            `Quantidade insuficiente de ${produto.name} no estoque.`
          );
          return;
        }
        setFormData((prevState) => ({
          ...prevState,
          produtos: prevState.produtos.map((p) =>
            p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p
          ),
        }));
      } else {
        if (produto.qtd < 1) {
          setErrorMessage(
            `Quantidade insuficiente de ${produto.name} no estoque.`
          );
          return;
        }
        setFormData((prevState) => ({
          ...prevState,
          produtos: [...prevState.produtos, { ...produto, quantidade: 1 }],
        }));
      }
    }
  };

  const handleRemoverProduto = (produtoId) => {
    setFormData((prevState) => ({
      ...prevState,
      produtos: prevState.produtos
        .map((produto) =>
          produto.id === produtoId
            ? produto.quantidade === 1
              ? null
              : { ...produto, quantidade: produto.quantidade - 1 }
            : produto
        )
        .filter((produto) => produto !== null && produto.quantidade > 0),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nomeCliente ||
      !formData.metodoPagamento ||
      !formData.tipoVenda ||
      formData.produtos.length === 0
    ) {
      setErrorMessage("Preencha todos os campos antes de finalizar a venda.");
      return;
    }

    setErrorMessage(""); // Limpa erro ao tentar submeter corretamente

    try {
      const response = await axios.post(
        "http://localhost:8000/api/order/register/",
        {
          name: formData.nomeCliente,
          type: formData.tipoVenda,
          payment: formData.metodoPagamento,
          products: formData.produtos.map((produto) => ({
            id: produto.id,
            name: produto.name,
            price: produto.price,
            quantidade: produto.quantidade,
          })),
        }
      );

      if (response.status === 201) {
        // Atualiza o estoque após a venda
        await Promise.all(
          formData.produtos.map(async (produto) => {
            await axios.put("http://localhost:8000/api/product/update/", {
              id: produto.id,
              name: produto.name,
              price: produto.price,
              qtd: produto.qtd - produto.quantidade,
            });
          })
        );
        fetchVendas();
        fetchProdutosEstoque();
        closeModal();
      }
    } catch (error) {
      console.error("Erro ao realizar venda/encomenda", error);
    }
  };

  const calcularTotalVenda = () => {
    return formData.produtos
      .reduce((total, produto) => {
        return total + produto.price * produto.quantidade;
      }, 0)
      .toFixed(2);
  };

  const calcularTotalVendaPorProdutos = (produtos) => {
    return produtos
      .reduce((total, produto) => {
        return total + produto.price * produto.quantidade;
      }, 0)
      .toFixed(2);
  };

  const capitalize = (text) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "▲▼";
  };

  const sortedVendas = [...vendas].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const itemsToDisplay = sortedVendas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedVendas.length / itemsPerPage);

  const toggleExpand = (vendaId) => {
    setExpandedVendas((prevState) => ({
      ...prevState,
      [vendaId]: !prevState[vendaId],
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVendas = itemsToDisplay.filter((venda) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      venda.name.toLowerCase().includes(searchTermLower) ||
      venda.tipe.toLowerCase().includes(searchTermLower) ||
      venda.payment.toLowerCase().includes(searchTermLower) ||
      venda.products.some((produto) =>
        produto.name.toLowerCase().includes(searchTermLower)
      )
    );
  });

  return (
    <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <div className="vendas-page" id="vendas-page">
          <div className="vendas-title" id="vendas-title">
            <h1>Vendas e Encomendas</h1>
          </div>
          <div className="div-header-widgets">
            <div className="controle-estoque-search">
              <input
                type="text"
                placeholder="Buscar vendas..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="vendas-search-input"
              />
            </div>
            <div className="vendas-add-button" id="vendas-add-button">
              <button
                className="vendas-button"
                id="vendas-button"
                onClick={openModal}
              >
                <GiChickenOven />
                Nova Venda / Encomenda
              </button>
            </div>
          </div>

          <table className="vendas-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("name")}>
                  Nome do Cliente {getSortIcon("name")}
                </th>
                <th onClick={() => requestSort("tipe")}>
                  Tipo {getSortIcon("tipe")}
                </th>
                <th onClick={() => requestSort("payment")}>
                  Método de Pagamento {getSortIcon("payment")}
                </th>
                <th>Produtos</th>
                <th onClick={() => requestSort("valorVenda")}>
                  Valor Total {getSortIcon("valorVenda")}
                </th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendas.map((venda) => (
                <tr key={venda.id}>
                  <td>{capitalize(venda.name)}</td>
                  <td>{capitalize(venda.tipe)}</td>
                  <td>{capitalize(venda.payment)}</td>
                  <td>
                  {venda.products.length > 1 ? (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id={`tooltip-${venda.id}`}>
                          <ul className="list-unstyled p-0">
                            {venda.products.map((produto) => (
                              <li key={produto.id}>
                                {capitalize(produto.name)} ({produto.quantidade})
                              </li>
                            ))}
                          </ul>
                        </Tooltip>
                      }
                    >
                      <span data-bs-toggle="tooltip" data-bs-placement="top">
                        {capitalize(venda.products[0].name)} ({venda.products[0].quantidade})
                      </span>
                    </OverlayTrigger>
                  ) : (
                    venda.products.map((produto) => (
                      <div key={produto.id}>{capitalize(produto.name)} ({produto.quantidade})</div>
                    ))
                  )}
                  </td>
                  <td>R${calcularTotalVendaPorProdutos(venda.products)}</td>
                  <td>
                    <div className="controle-vendas-acoes">
                      <button
                        className="controle-venda-edit-button"
                        onClick={() => openEditModal(venda)} // Passa a venda para a função
                      >
                        <FaPencilAlt className="icon-button" /> Editar
                      </button>
                      <button
                        className="controle-venda-remove-button"
                        onClick={() => openRemoveModal(venda)} // Passa a venda para a função
                      >
                        <FaTimes className="icon-button" /> Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => handlePageChange(value)}
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
            <div className="vendas-modal-overlay">
              <div className="vendas-modal-content">
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
                <button className="vendas-close-modal" onClick={closeModal}>
                  &times;
                </button>
                <div className="vendas-modal-body">
                  <div className="vendas-form-container">
                    <form className="vendas-form" onSubmit={handleSubmit}>
                      <label>Nome do Cliente</label>
                      <input
                        placeholder="Nome do cliente"
                        type="text"
                        name="nomeCliente"
                        value={formData.nomeCliente}
                        onChange={handleChange}
                        className="vendas-input"
                      />
                      {filteredClientes.length > 0 && formData.nomeCliente && (
                        <ul className="autocomplete-list">
                          {filteredClientes.map((cliente) => (
                            <li
                              key={cliente.id}
                              onClick={() => handleSelectCliente(cliente)}
                              className="autocomplete-item"
                            >
                              {cliente.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      <label>Método de Pagamento</label>
                      <select
                        name="metodoPagamento"
                        value={formData.metodoPagamento}
                        onChange={handleChange}
                        className="vendas-input"
                      >
                        <option value="">Selecione uma opção</option>
                        <option value="credito">Cartão de Crédito</option>
                        <option value="debito">Cartão de Débito</option>
                        <option value="pix">Dinheiro</option>
                        <option value="dinheiro">PIX</option>
                      </select>
                      <label>Tipo de Venda</label>
                      <select
                        name="tipoVenda"
                        value={formData.tipoVenda}
                        onChange={handleChange}
                        className="vendas-input"
                      >
                        <option value="">Selecione o tipo de venda</option>
                        <option value="venda">Venda</option>
                        <option value="encomenda">Encomenda</option>
                      </select>
                      <div className="vendas-div-titulo-botoes-mais-menos">
                        <h3>Produtos</h3>
                        {produtosEstoque.map((produto) => (
                          <div
                            className="vendas-div-botao-mais-menos"
                            key={produto.id}
                          >
                            <div className="vendas-div-espacamento-botao-mais-menos">
                              <button
                                type="button"
                                onClick={() => handleRemoverProduto(produto.id)}
                                className="vendas-botao-mais-menos"
                              >
                                -
                              </button>
                              <span>{capitalize(produto.name)}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAdicionarProduto(produto.id)
                                }
                                className="vendas-botao-mais-menos"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="vendas-total-finalizar">
                        <button
                          type="submit"
                          className="vendas-button-finalizar"
                        >
                          <MdOutlinePointOfSale />
                          Finalizar Venda
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="nota-fiscal-container">
                    <h3>Nota Fiscal</h3>
                    <table className="nota-fiscal-table">
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th>Quantidade</th>
                          <th>Preço</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.produtos.map((produto) => (
                          <tr key={produto.id}>
                            <td>{capitalize(produto.name)}</td>
                            <td>{produto.quantidade}</td>
                            <td>R${produto.price.toFixed(2)}</td>
                            <td>
                              R$
                              {(produto.price * produto.quantidade).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="total-container">
                      <h4>Total: R${calcularTotalVenda()}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

{isEditModalOpen && vendaEditando && (
  <div className="vendas-modal-overlay">
    <div className="vendas-modal-content">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button className="vendas-close-modal" onClick={closeEditModal}>
        &times;
      </button>
      <div className="vendas-modal-body">
        <div className="vendas-form-container">
          <form className="vendas-form" onSubmit={handleEditSubmit}>
            <label>Nome do Cliente</label>
            <input
              placeholder="Nome do cliente"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleEditChange}
              className="vendas-input"
            />
            {filteredClientes.length > 0 && formData.name && (
              <ul className="autocomplete-list">
                {filteredClientes.map((cliente) => (
                  <li
                    key={cliente.id}
                    onClick={() => handleSelectCliente(cliente)}
                    className="autocomplete-item"
                  >
                    {cliente.name}
                  </li>
                ))}
              </ul>
            )}
            <label>Método de Pagamento</label>
            <select
              name="metodoPagamento"
              value={formData.metodoPagamento}
              onChange={handleEditChange}
              className="vendas-input"
            >
              <option value="">Selecione uma opção</option>
              <option value="credito">Cartão de Crédito</option>
              <option value="debito">Cartão de Débito</option>
              <option value="pix">PIX</option>
              <option value="dinheiro">Dinheiro</option>
            </select>
            <label>Tipo de Venda</label>
            <select
              name="tipoVenda"
              value={formData.tipoVenda}
              onChange={handleEditChange}
              className="vendas-input"
            >
              <option value="">Selecione o tipo de venda</option>
              <option value="venda">Venda</option>
              <option value="encomenda">Encomenda</option>
            </select>
            <div className="vendas-div-titulo-botoes-mais-menos">
              <h3>Produtos</h3>
              {produtosEstoque.map((produto) => (
                <div className="vendas-div-botao-mais-menos" key={produto.id}>
                  <div className="vendas-div-espacamento-botao-mais-menos">
                    <button
                      type="button"
                      onClick={() => handleRemoverProduto(produto.id)}
                      className="vendas-botao-mais-menos"
                    >
                      -
                    </button>
                    <span>{capitalize(produto.name)}</span>
                    <button
                      type="button"
                      onClick={() => handleAdicionarProduto(produto.id)}
                      className="vendas-botao-mais-menos"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="vendas-total-finalizar">
              <button type="submit" className="vendas-button-finalizar">
                <MdOutlinePointOfSale />
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
        <div className="nota-fiscal-container">
          <h3>Nota Fiscal</h3>
          <table className="nota-fiscal-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{capitalize(produto.name)}</td>
                  <td>{produto.quantidade}</td>
                  <td>R${produto.price.toFixed(2)}</td>
                  <td>R${(produto.price * produto.quantidade).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-container">
            <h4>Total: R${calcularTotalVenda()}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

          {isRemoveModalOpen && (
            <div className="vendas-modal-overlay">
              <div className="vendas-modal-confirmacao-content">
                <button
                  className="vendas-close-modal"
                  onClick={closeRemoveModal}
                >
                  &times;
                </button>
                <div className="vendas-confirmacao-modal-body">
                  <h3>Tem certeza que deseja remover esta venda?</h3>
                  <div className="div-editar-produto-button">
                    <button
                      onClick={handleRemoveVenda}
                      className="editar-produto-button"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendasPage;
