import React, { useState } from 'react';
import axios from 'axios';
import './adicionar_produto.css';
import { FaBoxOpen } from "react-icons/fa";
import Alert from '../../alert/alert';

function AdicionarProduto() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !preco || !quantidade) {
      setAlertMessage('Por favor, preencha todos os campos.');
      setAlertType('alert-error');
      return;
    }

    const productData = {
      name: nome,
      price: Number(preco),
      qtd: parseInt(quantidade),
    };

    try {
      const response = await axios.post('http://localhost:8000/api/product/register/', productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setAlertMessage('Produto adicionado com sucesso!');
      setAlertType('alert-success');
      console.log(response.data);

      // Atualizar a lista de produtos e fechar o modal
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      setAlertMessage('Erro ao adicionar o produto.');
      setAlertType('alert-error');
    }

    setNome('');
    setPreco('');
    setQuantidade('');
  };

  const handlePrecoChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setPreco(value);
    }
  };

  const handleQuantidadeChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setQuantidade(value);
    }
  };

  return (
    <div className="adicionar-produto-page">
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage('')}
        />
      )}
      <form onSubmit={handleSubmit} className="adicionar-produto-form">
        <div className="adicionar-produto-field">
          <label htmlFor="nome" className="adicionar-produto-label">Nome do Produto</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do produto"
            required
            className="adicionar-produto-input"
          />
        </div>

        <div className="adicionar-produto-field">
          <label htmlFor="preco" className="adicionar-produto-label">Preço do Produto</label>
          <input
            type="number"
            id="preco"
            value={preco}
            onChange={handlePrecoChange}
            placeholder="Preço do produto"
            required
            className="adicionar-produto-input"
            min="0"
            step="0.01"
          />
        </div>

        <div className="adicionar-produto-field">
          <label htmlFor="quantidade" className="adicionar-produto-label">Quantidade</label>
          <input
            type="number"
            id="quantidade"
            value={quantidade}
            onChange={handleQuantidadeChange}
            placeholder="Quantidade disponível"
            required
            className="adicionar-produto-input"
            min="0"
          />
        </div>

        <div className='div-adicionar-produto-button'>
          <button type="submit" className="adicionar-produto-button">
            <FaBoxOpen />
            Adicionar Produto
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdicionarProduto;
