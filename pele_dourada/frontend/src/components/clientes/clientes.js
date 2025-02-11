import React, { useEffect, useState } from "react";
import axios from "axios";
import "./clientes.css";
import AdicionarCliente from "./add_cliente";
import Sidebar from "../sidebar/sidebar";
import { ImUserPlus } from "react-icons/im";

function ControleClientes() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/client/get/");
        setClientes(response.data.clients);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const handleBuscaChange = (e) => setBusca(e.target.value);

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

  const clientesFiltrados = clientes
    .filter((cliente) => {
      if (typeof cliente.name !== 'string') {
        return false;
      }
      return cliente.name.toLowerCase().includes(busca.toLowerCase());
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    const handleEditCliente = async (cliente) => {
      try {
        const response = await axios.post("http://localhost:8000/api/client/update/", {
          name: cliente.name,
          number: cliente.number,
          endereco: cliente.endereco
        });
        alert(response.data);
        setIsEditModalOpen(false);
        setClienteEditando(null);
        const updatedClientes = clientes.map((c) =>
          c.name === cliente.name ? { ...c, ...cliente } : c
        );
        setClientes(updatedClientes);
      } catch (error) {
        console.error("Erro ao atualizar cliente:", error.response ? error.response.data : error.message);
        alert("Erro ao atualizar o cliente");
      }
    };

  const handleRemoveCliente = async (cliente) => {
    try {
      const response = await axios.post("http://localhost:8000/api/client/delete/", { // esperando api
        name: cliente.name,
      }); 
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert("Erro ao deletar o cliente");
    }
  };

  return (
    <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <div className="controle-clientes-page" id="controle-clientes-page">
          <div className="controle-clientes-title" id="controle-clientes-title">
            <h1>Controle de Clientes</h1>
          </div>

          <div className="div-header-widgets">
            <div
              className="controle-clientes-search"
              id="controle-clientes-search"
            >
              <input
                className="controle-clientes-input"
                type="text"
                placeholder="Buscar cliente"
                value={busca}
                onChange={handleBuscaChange}
              />
            </div>
            <div
              className="controle-clientes-add-button"
              id="controle-clientes-add-button"
            >
              <button
                className="controle-clientes-button"
                id="controle-clientes-button"
                onClick={() => setIsModalOpen(true)}
              >
                <ImUserPlus />
                Adicionar Cliente
              </button>
            </div>
          </div>

          {isLoading ? (
            <div>Carregando...</div>
          ) : (
            <table className="controle-clientes-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort("name")}>
                    Cliente {getSortIcon("name")}
                  </th>
                  <th onClick={() => requestSort("phone")}>
                    Telefone {getSortIcon("phone")}
                  </th>
                  <th onClick={() => requestSort("address")}>
                    Endereço {getSortIcon("address")}
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.name}</td>
                    <td>{cliente.phone}</td>
                    <td>{cliente.address}</td>
                    <td className="buttons-actions">
                      <button
                        className="controle-clientes-edit-button"
                        onClick={() => {
                          setClienteEditando(cliente);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="controle-clientes-remove-button"
                        onClick={() => handleRemoveCliente(cliente)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isModalOpen && (
            <div
              className={`modal-overlay ${isModalOpen ? "open" : ""}`}
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className={`modal-content ${isModalOpen ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="close-modal"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
                <AdicionarCliente />
              </div>
            </div>
          )}

          {isEditModalOpen && (
            <div
              className="modal-overlay"
              onClick={() => setIsEditModalOpen(false)}
            >
              <div
                className="modal-content editar-cliente-page"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="editar-cliente-title">Editar Cliente</h2>
                <form
                  className="editar-cliente-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditCliente(clienteEditando);
                  }}
                >
                  <div className="editar-cliente-field">
                    <label className="editar-cliente-label" htmlFor="edit-name">
                      Nome
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      className="editar-cliente-input"
                      value={clienteEditando.name}
                      onChange={(e) =>
                        setClienteEditando({
                          ...clienteEditando,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="editar-cliente-field">
                    <label
                      className="editar-cliente-label"
                      htmlFor="edit-phone"
                    >
                      Telefone
                    </label>
                    <input
                      id="edit-phone"
                      type="tel"
                      className="editar-cliente-input"
                      value={clienteEditando.phone}
                      onChange={(e) =>
                        setClienteEditando({
                          ...clienteEditando,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="editar-cliente-field">
                    <label
                      className="editar-cliente-label"
                      htmlFor="edit-address"
                    >
                      Endereço
                    </label>
                    <input
                      id="edit-address"
                      type="text"
                      className="editar-cliente-input"
                      value={clienteEditando.address}
                      onChange={(e) =>
                        setClienteEditando({
                          ...clienteEditando,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="div-editar-cliente-button">
                    <button type="submit" className="editar-cliente-button">
                      Salvar
                    </button>
                  </div>
                </form>
                <div className="div-editar-cliente-button">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="editar-cliente-button"
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

export default ControleClientes;
