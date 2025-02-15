import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import './adicionar_produto.css';
import { FaBoxOpen } from "react-icons/fa";
import Alert from '../../alert/alert';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const handleInputChange = (e) => {
  let value = e.target.value;

  value = value.replace(/\D/g, ""); // Remove não-dígitos
  value = value.replace(/(\d)(\d{2})$/, "$1,$2"); // Centavos
  value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, ".$1"); // Milhares

  e.target.value = `R$ ${value}`;
};

function AdicionarProduto() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !preco || !quantidade) {
        toast.error('Por favor, preencha todos os campos.', { // Toast de erro para campos vazios
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
        });
        return;
    }

    const productData = {
        name: nome,
        price: Number(preco.replace(/\D/g, '')) / 100,
        qtd: parseInt(quantidade),
    };

    try {
        const response = await axios.post('http://localhost:8000/api/product/register/', productData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        toast.success(`${nome} adicionado com sucesso!`, {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
            transition: Bounce,
        });

        console.log(response.data);

        setTimeout(() => {
            window.location.reload();
        }, 3000);

    } catch (error) {
        console.error(error);

        toast.error('Erro ao adicionar o produto. Verifique os dados e tente novamente.', {
            position: 'top-right',
            autoClose: 5000,
            theme: 'colored',
        });
    }

    setNome('');
    setPreco('');
    setQuantidade('');
};

  const handlePrecoChange = (e) => {
    handleInputChange(e);
    setPreco(e.target.value);
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
            type="text"
            id="preco"
            value={preco}
            onChange={handlePrecoChange}
            placeholder="R$00,00"
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