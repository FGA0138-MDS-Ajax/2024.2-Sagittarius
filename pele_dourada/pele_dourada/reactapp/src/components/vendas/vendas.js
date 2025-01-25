import React, { useState, useEffect } from "react";
import axios from "axios";
import "./vendas.css";

const VendasPage = () => {
  const [vendas, setVendas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomeCliente: "",
    metodoPagamento: "",
    tipoVenda: "",
    produtos: [],
  });
  const [produtosEstoque, setProdutosEstoque] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const fetchVendas = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/"); // espernado api
      setVendas(response.data.vendas);
    } catch (error) {
      console.error("Erro ao buscar vendas", error);
    }
  };

  const fetchProdutosEstoque = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products");
      setProdutosEstoque(response.data.products);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    }
  };

  useEffect(() => {
    fetchVendas();
    fetchProdutosEstoque();
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

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    try {
      const response = await axios.post("http://localhost:8000/api/", formData); // esperando api
      if (response.status === 200) {
        for (const produto of formData.produtos) {
          const produtoEstoque = produtosEstoque.find(
            (p) => p.id === produto.id
          );

          if (produtoEstoque) {
            await axios.put(
              `http://localhost:8000/api/products/${produto.id}`,
              {
                qtd: produtoEstoque.qtd - produto.quantidade,
              }
            );
          }
        }
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

  return (
    <div className="vendas-page">
      <h1 className="vendas-title">Vendas e Encomendas</h1>
      <button onClick={openModal} className="vendas-button">
        Nova Venda/Encomenda
      </button>

      <table className="vendas-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("nomeCliente")}>
              Nome do Cliente {getSortIcon("nomeCliente")}
            </th>
            <th onClick={() => requestSort("tipoVenda")}>
              Tipo {getSortIcon("tipoVenda")}
            </th>
            <th onClick={() => requestSort("metodoPagamento")}>
              Método de Pagamento {getSortIcon("metodoPagamento")}
            </th>
            <th>Produtos</th>
            <th onClick={() => requestSort("valorVenda")}>
              Valor Total {getSortIcon("valorVenda")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedVendas.map((venda) => (
            <tr key={venda.id}>
              <td>{venda.nomeCliente}</td>
              <td>{venda.tipoVenda}</td>
              <td>{venda.metodoPagamento}</td>
              <td>
                {venda.produtos.map((produto) => (
                  <div key={produto.id}>{produto.name}</div>
                ))}
              </td>
              <td>R${venda.valorVenda.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="vendas-modal-overlay">
          <div className="vendas-modal-content">
            <button className="vendas-close-modal" onClick={closeModal}>
              &times;
            </button>
            <div className="vendas-modal-body">
              <div className="vendas-form-container">
                <form className="vendas-form" onSubmit={handleSubmit}>
                  <label>Nome do Cliente</label>
                  <input
                    type="text"
                    name="nomeCliente"
                    value={formData.nomeCliente}
                    onChange={handleChange}
                    className="vendas-input"
                  />
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
                    <option value="vale_refeicao">Vale Refeição</option>
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
                  <h3>Produtos</h3>
                  {produtosEstoque.map((produto) => (
                    <div key={produto.id}>
                      <span>{produto.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoverProduto(produto.id)}
                        className="vendas-button"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdicionarProduto(produto.id)}
                        className="vendas-button"
                      >
                        +
                      </button>
                    </div>
                  ))}
                  <button type="submit" className="vendas-button-finalizar">
                    Finalizar Venda
                  </button>
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
                        <td>{produto.name}</td>
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
  );
};

export default VendasPage;
