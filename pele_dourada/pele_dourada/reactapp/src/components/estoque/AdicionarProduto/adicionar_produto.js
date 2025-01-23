import React, { useState } from 'react';
import axios from 'axios';
import './adicionar_produto.css';

function AdicionarProduto() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!nome || !preco || !quantidade) {
      alert('Por favor, preencha todos os campos.');
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

      alert('Produto adicionado com sucesso!');
      console.log(response.data);

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar o produto.');
    }

    setNome('');
    setPreco('');
    setQuantidade('');
  };

  return (
    <div className="adicionar-produto-page">
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
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Preço do produto"
            required
            className="adicionar-produto-input"
          />
        </div>

        <div className="adicionar-produto-field">
          <label htmlFor="quantidade" className="adicionar-produto-label">Quantidade</label>
          <input
            type="number"
            id="quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Quantidade disponível"
            required
            className="adicionar-produto-input"
          />
        </div>

        <div className='div-adicionar-produto-button'>
          <button type="submit" className="adicionar-produto-button">Adicionar Produto</button>
        </div>
      </form>
    </div>
  );
}

export default AdicionarProduto;
