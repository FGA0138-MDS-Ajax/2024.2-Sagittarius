import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './vendas.css';

function ControleVendasEncomendas() {
  const [vendas, setVendas] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    // simulando api 
    const vendasDoBanco = [
      {
        tipoVenda: 'local',
        numeroVenda: '001',
        nomeCliente: 'João Silva',
        valorVenda: 100,
        horaVenda: '12:30',
        formaPagamento: 'Cartão',
        produtosVendidos: 'frango',
      },
      {
        tipoVenda: 'encomenda',
        numeroVenda: '002',
        nomeCliente: 'Maria Oliveira',
        valorVenda: 200,
        horaVenda: '14:00',
        formaPagamento: 'Dinheiro',
        produtosVendidos: 'frango'
      },
    ];

    setVendas(vendasDoBanco);
  }, []);

  const filteredVendas = vendas.filter((venda) =>
    venda.nomeCliente.toLowerCase().includes(filtro.toLowerCase()) ||
    venda.numeroVenda.includes(filtro)
  );

  return (
    <div className="vendas-container">
      <h1 className="vendas-title">Gestão de Vendas e Encomendas</h1>
      
      <div className="vendas-filter-section">
        <label className="vendas-label">Filtro de Busca:</label>
        <input
          className="vendas-input"
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar por nome ou número de venda"
        />
      </div>

      {/* botão nova venda*/}
      <div className="vendas-button-container">
        <Link to="/" className="vendas-button">
          Registrar Nova Venda/Encomenda
        </Link>
      </div>

      {/* tabela */}
      <table className="vendas-table">
        <thead>
          <tr>
            <th className="vendas-th">Tipo de Venda</th>
            <th className="vendas-th">Número da Venda</th>
            <th className="vendas-th">Nome do Cliente</th>
            <th className="vendas-th">Valor</th>
            <th className="vendas-th">Horário</th>
            <th className="vendas-th">Forma de Pagamento</th>
            <th className="vendas-th">Produtos</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendas.map((venda, index) => (
            <tr key={index} className="vendas-tr">
              <td className="vendas-td">{venda.tipoVenda}</td>
              <td className="vendas-td">{venda.numeroVenda}</td>
              <td className="vendas-td">{venda.nomeCliente}</td>
              <td className="vendas-td">{venda.valorVenda}</td>
              <td className="vendas-td">{venda.horaVenda}</td>
              <td className="vendas-td">{venda.formaPagamento}</td>
              <td className="vendas-td">{venda.produtosVendidos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ControleVendasEncomendas;
