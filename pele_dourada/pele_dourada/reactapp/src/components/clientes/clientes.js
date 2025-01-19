import React, { useState } from 'react';
import './clientes.css';

function ControleClientes() {
  const [clientes, setClientes] = useState([
    { id: 1, nome: 'João Silva', endereco: 'Rua A, 123', telefone: '1234567890' },
    { id: 2, nome: 'Maria Oliveira', endereco: 'Rua B, 456', telefone: '0987654321' },
    { id: 3, nome: 'Pedro Costa', endereco: 'Rua C, 789', telefone: '1122334455' },
  ]);

  const [busca, setBusca] = useState('');
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null);
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
  };

  const handleEdit = (cliente) => {
    setClienteEmEdicao(cliente.id);
    setNome(cliente.nome);
    setEndereco(cliente.endereco);
    setTelefone(cliente.telefone);
  };

  const handleSave = () => {
    if (window.confirm('Você tem certeza que deseja salvar as alterações?')) {
      const updatedClientes = clientes.map((cliente) =>
        cliente.id === clienteEmEdicao
          ? { ...cliente, nome, endereco, telefone }
          : cliente
      );
      setClientes(updatedClientes);
      setClienteEmEdicao(null);
      setNome('');
      setEndereco('');
      setTelefone('');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Você tem certeza que deseja excluir este cliente?')) {
      setClientes(clientes.filter(cliente => cliente.id !== id));
    }
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.telefone.includes(busca) ||
    cliente.endereco.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="controle-clientes">
      <h1>Controle de Clientes</h1>

      {/* Barra de busca */}
      <div className="controle-clientes-search">
        <input
          type="text"
          placeholder="Buscar cliente por nome, telefone ou endereço"
          value={busca}
          onChange={handleBuscaChange}
          className="controle-clientes-input"
        />
      </div>

      {/* Tabela de clientes */}
      <table className="controle-clientes-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente) => (
            <tr key={cliente.id}>
              <td>{clienteEmEdicao === cliente.id ? (
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              ) : cliente.nome}</td>
              <td>{clienteEmEdicao === cliente.id ? (
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              ) : cliente.endereco}</td>
              <td>{clienteEmEdicao === cliente.id ? (
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              ) : cliente.telefone}</td>
              <td>
                {clienteEmEdicao === cliente.id ? (
                  <button className="controle-clientes-action-button salvar" onClick={handleSave}>
                    Salvar
                  </button>
                ) : (
                  <>
                    <button
                      className="controle-clientes-action-button editar"
                      onClick={() => handleEdit(cliente)}
                    >
                      Editar
                    </button>
                    <button
                      className="controle-clientes-action-button excluir"
                      onClick={() => handleDelete(cliente.id)}
                    >
                      Excluir
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ControleClientes;
