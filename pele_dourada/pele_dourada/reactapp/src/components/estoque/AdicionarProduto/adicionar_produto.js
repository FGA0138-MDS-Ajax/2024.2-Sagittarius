import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importando o Link para navegação
import './adicionar_produto.css'; // Importando o arquivo CSS, se necessário

function AdicionarProduto() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagem, setImagem] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação simples
    if (!nome || !preco || !categoria || !imagem || !descricao || !quantidade) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Aqui você pode enviar os dados para o backend ou fazer o que for necessário
    const produto = {
      nome,
      preco,
      categoria,
      imagem,
      descricao,
      quantidade,
    };
    console.log(produto);

    // Limpar os campos após envio
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
    <div className="adicionar-produto">
      {/* Link para voltar para o estoque */}
      <Link to="/estoque">
        <button className="voltar-btn">Voltar para o Estoque</button>
      </Link>

      {/* Título da página */}
      <h2>Cadastro de Produto</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Produto</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do produto"
            required
          />
        </div>

        <div>
          <label>Preço do Produto</label>
          <input
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Digite o preço do produto"
            required
          />
        </div>

        <div className="select-container">
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Selecione a categoria</option>
            <option value="principal">Principal</option>
            <option value="acompanhamento">Acompanhamento</option>
          </select>
        </div>

        <div>
          <label>Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <div>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite uma descrição do produto"
            required
          />
        </div>

        <div>
          <label>Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Digite a quantidade disponível"
            required
          />
        </div>

        <button type="submit">Adicionar Produto</button>
      </form>
    </div>
  );
}

export default AdicionarProduto;
