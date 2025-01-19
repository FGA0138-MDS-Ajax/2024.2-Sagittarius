import React, { useState } from 'react';
import axios from 'axios'; // Importando axios para fazer requisições
import { Link } from 'react-router-dom';
import './adicionar_produto.css';

function AdicionarProduto() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagem, setImagem] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !preco || !categoria || !imagem || !descricao || !quantidade) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('categoria', categoria);
    formData.append('imagem', imagem);
    formData.append('descricao', descricao);
    formData.append('quantidade', quantidade);

    try {
       {/*alterar depois para a rota certa do django*/}
      const response = await axios.post('http://localhost:8000/adicionar-produto/', formData, {        
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Produto adicionado com sucesso!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar o produto.');
    }

    setNome('');
    setPreco('');
    setCategoria('');
    setImagem(null);
    setDescricao('');
    setQuantidade('');
  };

  const handleImageChange = (e) => {
    setImagem(e.target.files[0]);
  };

  return (
    <div className="adicionar-produto-page">
      <Link to="/estoque">
        <button className="voltar-btn">Voltar para o Estoque</button>
      </Link>

      <h2 className="adicionar-produto-title">Cadastro de Produto</h2>

      <form onSubmit={handleSubmit} className="adicionar-produto-form">
        <div className="adicionar-produto-field">
          <label htmlFor="nome" className="adicionar-produto-label">Nome do Produto</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do produto"
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
            placeholder="Digite o preço do produto"
            required
            className="adicionar-produto-input"
          />
        </div>

        <div className="adicionar-produto-select-container">
          <label htmlFor="categoria" className="adicionar-produto-label">Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="adicionar-produto-select"
          >
            <option value="">Selecione a categoria</option>
            <option value="principal">Principal</option>
            <option value="acompanhamento">Acompanhamento</option>
          </select>
        </div>

        <div className="adicionar-produto-field">
          <label htmlFor="imagem" className="adicionar-produto-label">Imagem</label>
          <input
            type="file"
            id="imagem"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="adicionar-produto-input"
          />
        </div>

        <div className="adicionar-produto-field">
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite uma descrição do produto"
            required
            className="adicionar-produto-textarea"
          />
        </div>

        <div className="adicionar-produto-field">
          <label htmlFor="quantidade" className="adicionar-produto-label">Quantidade</label>
          <input
            type="number"
            id="quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Digite a quantidade disponível"
            required
            className="adicionar-produto-input"
          />
        </div>

        <button type="submit" className="adicionar-produto-button">Adicionar Produto</button>
      </form>
    </div>
  );
}

export default AdicionarProduto;
