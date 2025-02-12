import React, { useState, useEffect } from "react";
import axios from "axios";
import "./vendas.css";
import { MdOutlinePointOfSale } from "react-icons/md";
import { GiChickenOven } from "react-icons/gi";
import Sidebar from '../../components/sidebar/sidebar';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { BsFillBoxSeamFill } from "react-icons/bs";

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
  const [itemsPerPage] = useState(10); // Limite de 10 itens por página
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        setFormData((prevState) => ({
          ...prevState,
          produtos: prevState.produtos.map((p) =>
            p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p
          ),
        }));
      } else {
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
  
    if (!formData.nomeCliente || !formData.metodoPagamento || !formData.tipoVenda || formData.produtos.length === 0) {
      setErrorMessage("Preencha todos os campos antes de finalizar a venda.");
      return;
    }
  
    setErrorMessage(""); // Limpa erro ao tentar submeter corretamente
  
    try {
      const response = await axios.post("http://localhost:8000/api/order/register/", {
        name: formData.nomeCliente,
        type: formData.tipoVenda,
        payment: formData.metodoPagamento,
        products: formData.produtos.map((produto) => ({
          id: produto.id,
          name: produto.name,
          price: produto.price,
          quantidade: produto.quantidade,
        })),
      });
  
      if (response.status === 201) {
        fetchVendas();
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

  const capitalize = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
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
          <div className='div-header-widgets'>
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
              <button className="vendas-button" id="vendas-button" onClick={openModal}>
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
              </tr>
            </thead>
            <tbody>
              {filteredVendas.map((venda) => (
                <tr key={venda.id}>
                  <td>{capitalize(venda.name)}</td>
                  <td>{capitalize(venda.tipe)}</td>
                  <td>{capitalize(venda.payment)}</td>
                  <td>
                    {venda.products.length > 1 && !expandedVendas[venda.id] ? (
                      <>
                        <div>{capitalize(venda.products[0].name)} ({venda.products[0].quantidade})</div>
                        <div className="expand-products" onClick={() => toggleExpand(venda.id)}>...</div>
                      </>
                    ) : (
                      venda.products.map((produto) => (
                        <div key={produto.id}>{capitalize(produto.name)} ({produto.quantidade})</div>
                      ))
                    )}
                    {expandedVendas[venda.id] && (
                      <div className="expand-products" onClick={() => toggleExpand(venda.id)}>Mostrar menos</div>
                    )}
                  </td>
                  <td>R${calcularTotalVendaPorProdutos(venda.products)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {isModalOpen && (
            <div className="vendas-modal-overlay">
              <div className="vendas-modal-content">
                {errorMessage && <div className="error-message">{errorMessage}</div>}
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
                              R${(produto.price * produto.quantidade).toFixed(2)}
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
        </div>
      </main>
    </div>
  );
};

export default VendasPage;