import React, { useState, useEffect } from "react";
import axios from "axios";
import "./vendas.css";
import { MdOutlinePointOfSale } from "react-icons/md";
import { GiChickenOven } from "react-icons/gi";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import Sidebar from "../../components/sidebar/sidebar";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const VendasPage = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [vendas, setVendas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomeCliente: "",
    metodoPagamento: "",
    tipoVenda: "",
    produtos: [],
    valorVenda: "",
  });

  const [produtosEstoque, setProdutosEstoque] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); 
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [vendaEditando, setVendaEditando] = useState(null);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState(produtosEstoque);

  // -------------------------------------------------------------------------------------------------

  // Formatação de dados:

  const formatDateFromNumber = (number) => {
    const datePart = number.substring(0, 8);
    const day = datePart.substring(0, 2);
    const month = datePart.substring(2, 4);
    const year = datePart.substring(4, 8);
    return `${day}/${month}/${year}`;
  };

  const capitalize = (text) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // ----------------------------------------------------------------------------------------

  // Funções de abrir/fechar modais:

  const openEditModal = (venda) => {
    setSelectedVenda(venda);
    setVendaEditando({ ...venda });
    setFormData({
      nomeCliente: venda.name,
      metodoPagamento: venda.payment,
      tipoVenda: venda.tipe,
      produtos: venda.products.map((produto) => ({
        id: produto.id,
        name: produto.name,
        price: produto.price,
        quantidade: produto.quantidade,
      })),
    });
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

  const closeModal = () => {
    setIsModalOpen(false); // Fecha o modal
    setErrorMessage(""); // Reseta a mensagem de erro
  };

  const openModal = () => {
    setFormData({
      nomeCliente: "",
      metodoPagamento: "",
      tipoVenda: "",
      produtos: [],
    });
    setIsModalOpen(true);
  };
  // ----------------------------------------------------------------------------------------------

  // Funções de Ordenação e Filtragem dos dados: 

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
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "dataVenda") {
        aValue = new Date(
          a.number.substring(4, 8),
          a.number.substring(2, 4) - 1,
          a.number.substring(0, 2)
        );
        bValue = new Date(
          b.number.substring(4, 8),
          b.number.substring(2, 4) - 1,
          b.number.substring(0, 2)
        );
      } else if (sortConfig.key === "valorVenda") {
        aValue = parseFloat(a[sortConfig.key]);
        bValue = parseFloat(b[sortConfig.key]);
      }
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  let filteredVendas = sortedVendas.filter((venda) => {
    if (!searchTerm.trim()) return true;
    const searchTermLower = searchTerm.toLowerCase();
    const dataVenda = formatDateFromNumber(venda.number).toLowerCase();
    return (
      venda.name.toLowerCase().includes(searchTermLower) ||
      venda.tipe.toLowerCase().includes(searchTermLower) ||
      venda.payment.toLowerCase().includes(searchTermLower) ||
      dataVenda.includes(searchTermLower) ||
      venda.products.some((produto) =>
        produto.name.toLowerCase().includes(searchTermLower)
      )
    );
  });

  const itemsToDisplay = filteredVendas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVendas.length / itemsPerPage);

  // -----------------------------------------------------------------------------

  // Funções de cálculo:

  const calcularTotalVenda = () => {
    return formData.produtos
      .reduce((total, produto) => {
        return total + produto.price * produto.quantidade;
      }, 0)
      .toFixed(2);
  };

  // ----------------------------------------------------------------------------------------------

  // Funções para gerenciamento de dados:

  const fetchVendas = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/orders/");
      const vendasComValor = response.data.orders.map((venda) => ({
        ...venda,
        valorVenda: venda.total,
      }));
      setVendas(vendasComValor);
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

  // -----------------------------------------------------------------------------------------------

  // Funções para atualização e envio de dados:

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    const produtosOriginais = selectedVenda.products;
    const produtosEditados = formData.produtos;
  
    try {
      // Atualizar a venda
      await axios.put("http://localhost:8000/api/order/update/", {
        number: vendaEditando.number,
        index: vendaEditando.id, // Enviar o id do pedido como index
        new_name: formData.nomeCliente,
        new_payment: formData.metodoPagamento,
        new_tipe: formData.tipoVenda,
        new_product: produtosEditados.map((produto) => ({
          id: produto.id,
          name: produto.name,
          price: produto.price,
          quantidade: produto.quantidade,
        })),
        new_price: parseFloat(calcularTotalVenda()), // Enviar o valor total da venda como número
        new_confirm: vendaEditando.confirm,
      });
  
      // Atualizar o estoque
      await Promise.all(
        produtosOriginais.map(async (produtoOriginal) => {
          const produtoEditado = produtosEditados.find(
            (produto) => produto.id === produtoOriginal.id
          );
  
          if (!produtoEditado) {
            // Produto removido da venda, adicionar de volta ao estoque
            const produtoEstoque = produtosEstoque.find(
              (produto) => produto.id === produtoOriginal.id
            );
            await axios.put("http://localhost:8000/api/product/update/", {
              id: produtoOriginal.id,
              name: produtoOriginal.name,
              price: produtoOriginal.price,
              qtd: produtoEstoque.qtd + produtoOriginal.quantidade,
            });
          } else if (produtoEditado.quantidade !== produtoOriginal.quantidade) {
            // Produto com quantidade alterada
            const quantidadeDiferenca =
              produtoOriginal.quantidade - produtoEditado.quantidade;
            const produtoEstoque = produtosEstoque.find(
              (produto) => produto.id === produtoOriginal.id
            );
            await axios.put("http://localhost:8000/api/product/update/", {
              id: produtoOriginal.id,
              name: produtoOriginal.name,
              price: produtoOriginal.price,
              qtd: produtoEstoque.qtd + quantidadeDiferenca,
            });
          }
        })
      );
  
      await Promise.all(
        produtosEditados.map(async (produtoEditado) => {
          const produtoOriginal = produtosOriginais.find(
            (produto) => produto.id === produtoEditado.id
          );
  
          if (!produtoOriginal) {
            // Produto adicionado à venda, subtrair do estoque
            const produtoEstoque = produtosEstoque.find(
              (produto) => produto.id === produtoEditado.id
            );
            await axios.put("http://localhost:8000/api/product/update/", {
              id: produtoEditado.id,
              name: produtoEditado.name,
              price: produtoEditado.price,
              qtd: produtoEstoque.qtd - produtoEditado.quantidade,
            });
          }
        })
      );
  
      fetchVendas();
      fetchProdutosEstoque();
      closeEditModal();
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setVendaEditando((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      setFormData((prevState) => {
        const produtoJaAdicionado = prevState.produtos.find(
          (p) => p.id === produto.id
        );

        let novosProdutos;
        if (produtoJaAdicionado) {
          if (produtoJaAdicionado.quantidade + 1 > produto.qtd) {
            setErrorMessage(
              `Quantidade insuficiente de ${produto.name} no estoque.`
            );
            setTimeout(() => setErrorMessage(""), 2000);
            return prevState;
          }

          novosProdutos = prevState.produtos.map((p) =>
            p.id === produto.id ? { ...p, quantidade: p.quantidade + 1 } : p
          );
        } else {
          if (produto.qtd < 1) {
            setErrorMessage(
              `Quantidade insuficiente de ${produto.name} no estoque.`
            );
            return prevState;
          }

          novosProdutos = [
            ...prevState.produtos,
            { ...produto, quantidade: 1 },
          ];
        }

        // Atualiza produtosDisponiveis
        setProdutosDisponiveis(
          produtosEstoque.filter(
            (produtoEstoque) =>
              !novosProdutos.some(
                (produtoSelecionado) =>
                  produtoSelecionado.id === produtoEstoque.id
              )
          )
        );

        return { ...prevState, produtos: novosProdutos };
      });
    }
  };

  const handleRemoverProduto = (produtoId) => {
    setFormData((prevState) => {
      let novosProdutos = prevState.produtos
        .map((produto) =>
          produto.id === produtoId
            ? produto.quantidade === 1
              ? null
              : { ...produto, quantidade: produto.quantidade - 1 }
            : produto
        )
        .filter((produto) => produto !== null && produto.quantidade > 0);

      // Atualiza produtosDisponiveis
      setProdutosDisponiveis(
        produtosEstoque.filter(
          (produtoEstoque) =>
            !novosProdutos.some(
              (produtoSelecionado) =>
                produtoSelecionado.id === produtoEstoque.id
            )
        )
      );

      return { ...prevState, produtos: novosProdutos };
    });
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
    setErrorMessage("");

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

  useEffect(() => {
    setProdutosDisponiveis(
      produtosEstoque.filter(
        (produtoEstoque) =>
          !formData.produtos.some(
            (produtoSelecionado) => produtoSelecionado.id === produtoEstoque.id
          )
      )
    );
  }, [formData.produtos, produtosEstoque]);


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
                placeholder="Buscar venda"
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
                Nova Venda | Encomenda
              </button>
            </div>
          </div>

          <table className="vendas-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("dataVenda")}>
                  Data da Venda {getSortIcon("dataVenda")}
                </th>
                <th onClick={() => requestSort("name")}>
                  Nome do Cliente {getSortIcon("name")}
                </th>
                <th onClick={() => requestSort("tipe")}>
                  Tipo {getSortIcon("tipe")}
                </th>
                <th onClick={() => requestSort("payment")}>
                  Pagamento {getSortIcon("payment")}
                </th>
                <th>Produtos</th>
                <th onClick={() => requestSort("valorVenda")}>
                  Valor Total {getSortIcon("valorVenda")}
                </th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itemsToDisplay.map((venda) => (
                <tr key={venda.id}>
                  <td>{formatDateFromNumber(venda.number)}</td>
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
                                  {capitalize(produto.name)} (
                                  {produto.quantidade})
                                </li>
                              ))}
                            </ul>
                          </Tooltip>
                        }
                      >
                        <span data-bs-toggle="tooltip" data-bs-placement="top">
                          {capitalize(venda.products[0].name)} (
                          {venda.products[0].quantidade})
                        </span>
                      </OverlayTrigger>
                    ) : (
                      venda.products.map((produto) => (
                        <div key={produto.id}>
                          {capitalize(produto.name)} ({produto.quantidade})
                        </div>
                      ))
                    )}
                  </td>
                  <td>R${parseFloat(venda.valorVenda).toFixed(2)}</td>
                  <td>
                    <div className="controle-vendas-acoes">
                      <button
                        className="controle-venda-edit-button"
                        onClick={() => openEditModal(venda)}
                      >
                        <FaPencilAlt className="icon-button" /> Editar
                      </button>
                      <button
                        className="controle-venda-remove-button"
                        onClick={() => openRemoveModal(venda)}
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
                  "& .MuiPaginationItem-root": {
                    backgroundColor: "transparent",
                    color: "#f15b1b",
                    "&:hover": {
                      backgroundColor: "#d1d1d1",
                    },
                  },
                  "& .MuiPaginationItem-page.Mui-selected": {
                    backgroundColor: "#f15b1b",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#f15b1b",
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
                        <option value="pix">Pix</option>
                        <option value="dinheiro">Dinheiro</option>
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
                        <div className="vendas-produtos-grid">
                          {produtosEstoque.map((produto) => (
                            <div
                              className="vendas-div-botao-mais-menos"
                              key={produto.id}
                            >
                              <div className="vendas-div-espacamento-botao-mais-menos">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoverProduto(produto.id)
                                  }
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

          {isEditModalOpen && (
            <div className="vendas-modal-overlay">
              <div className="vendas-modal-content">
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
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
                        <option value="pix">Pix</option>
                        <option value="dinheiro">Dinheiro</option>
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
                        
                        <div className="vendas-produtos-grid">
                          {produtosEstoque.map((produto) => (
                            <div
                              className="vendas-div-botao-mais-menos"
                              key={produto.id}
                            >
                              <div className="vendas-div-espacamento-botao-mais-menos">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoverProduto(produto.id)
                                  }
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
                      </div>
                      <div className="vendas-total-finalizar">
                        <button
                          type="submit"
                          className="vendas-button-finalizar"
                        >
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
