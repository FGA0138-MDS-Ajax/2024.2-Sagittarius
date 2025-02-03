import React, { useState } from 'react';
import axios from 'axios';
import './add_cliente.css';

function AdicionarCliente() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome || !telefone || !endereco) {
      setErro('Todos os campos são obrigatórios!');
      return;
    }

    try {
      const clienteData = { name: nome, phone: telefone, address: endereco };
      const response = await axios.post('http://localhost:8000/api/', clienteData); // esperando o endereço da api
      alert('Cliente adicionado com sucesso!');
      
      setNome('');
      setTelefone('');
      setEndereco('');
      setErro('');
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      setErro('Erro ao adicionar o cliente.');
    }
  };

  return (
    <div className="adicionar-cliente-container">
      <h2>Adicionar Cliente</h2>
      <form onSubmit={handleSubmit} className="adicionar-cliente-form">
        <div className="adicionar-cliente-field">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="adicionar-cliente-field">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="tel"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>
        <div className="adicionar-cliente-field">
          <label htmlFor="endereco">Endereço</label>
          <input
            type="text"
            id="endereco"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </div>
        {erro && <div className="erro-message">{erro}</div>}
        <button type="submit" className="adicionar-cliente-button">Adicionar Cliente</button>
      </form>
    </div>
  );
}

export default AdicionarCliente;
