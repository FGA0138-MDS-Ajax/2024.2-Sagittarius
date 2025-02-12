import React, { useEffect, useState } from "react";
import axios from "axios";
import "./clientes.css";
import AdicionarCliente from "./add_cliente";
import Sidebar from "../sidebar/sidebar";
import { ImUserPlus } from "react-icons/im";
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { BsFillBoxSeamFill } from "react-icons/bs";
import InputMask from 'react-input-mask';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15); // Limite de 15 itens por página
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [clienteRemovendo, setClienteRemovendo] = useState(null);

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
      const response = await axios.put("http://localhost:8000/api/client/update/", {
        id: cliente.id,
        name: cliente.name,
        phone: cliente.phone,
        endereco: cliente.endereco
      });
      alert(response.data);
      setIsEditModalOpen(false);
      setClienteEditando(null);
      const updatedClientes = clientes.map((c) =>
        c.id === cliente.id ? { ...c, ...cliente } : c
      );
      setClientes(updatedClientes);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error.response ? error.response.data : error.message);
      alert("Erro ao atualizar o cliente");
    }
  };

  const handleRemoveCliente = async () => {
    try {
      await axios.delete("http://localhost:8000/api/client/delete/", {
        data: { id: clienteRemovendo.id },
      });
      setClientes(clientes.filter((c) => c.id !== clienteRemovendo.id));
      setIsConfirmModalOpen(false);
      setClienteRemovendo(null);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert("Erro ao deletar o cliente");
    }
  };

  const confirmarRemocao = async () => {
    if (clienteRemovendo) {
      await handleRemoveCliente(clienteRemovendo);
      setIsConfirmModalOpen(false);
      setClienteRemovendo(null);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const itemsToDisplay = clientesFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(clientesFiltrados.length / itemsPerPage);

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
            <>
              <table className="controle-clientes-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort("name")}>
                      Cliente {getSortIcon("name")}
                    </th>
                    <th onClick={() => requestSort("phone")}>
                      Telefone {getSortIcon("phone")}
                    </th>
                    <th onClick={() => requestSort("endereco")}>
                      Endereço {getSortIcon("endereco")}
                    </th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsToDisplay.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.name}</td>
                      <td>{cliente.phone}</td>
                      <td>{cliente.endereco}</td>
                      <td className="buttons-actions">
                        <button
                          className="controle-clientes-edit-button"
                          onClick={() => {
                            setClienteEditando(cliente);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <FaPencilAlt className="icon-button"/> 
                          Editar
                        </button>
                        <button
                          className="controle-clientes-remove-button"
                          onClick={() => {
                            setClienteRemovendo(cliente);
                            setIsConfirmModalOpen(true);
                          }}
                        >
                          <FaTimes className="icon-button" />
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                {Array.from({ length: totalPages }).map((_, index) => {
                  if (index < 3 || index === totalPages - 1) {
                    return (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? "active" : ""}
                      >
                        {index + 1}
                      </button>
                    );
                  } else if (index === 3) {
                    return <span key="ellipsis">...</span>;
                  }
                  return null;
                })}
            </div>
            </>
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
                    <InputMask 
                      id="edit-phone"
                      type="tel"
                      placeholder='(__) _____-____'
                      mask="(99) 99999-9999"
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
                      value={clienteEditando.endereco}
                      onChange={(e) =>
                        setClienteEditando({
                          ...clienteEditando,
                          endereco: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="div-editar-cliente-button">
                    <button type="submit" className="editar-cliente-button">
                      Salvar
                    </button>
                  </div>

                  <div className="div-editar-cliente-button">
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="editar-cliente-button"
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
                <p>Tem certeza que deseja remover o cliente "{clienteRemovendo?.name}"?</p>
                <div className="div-editar-cliente-button">
                  <button onClick={confirmarRemocao} className="editar-cliente-button">
                    Confirmar
                  </button>
                  <button onClick={() => setIsConfirmModalOpen(false)} className="editar-cliente-button">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {isConfirmModalOpen && (
            <div className="modal-overlay" onClick={() => setIsConfirmModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Confirmar Remoção</h2>
                <p>Tem certeza que deseja remover o cliente "{clienteRemovendo?.name}"?</p>
                <div className="div-editar-cliente-button">
                  <button onClick={handleRemoveCliente} className="editar-cliente-button">
                    Confirmar
                  </button>
                  <button onClick={() => setIsConfirmModalOpen(false)} className="editar-cliente-button">
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