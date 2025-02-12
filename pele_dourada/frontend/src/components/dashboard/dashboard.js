import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './dashboard.css';
import { LuFileSpreadsheet } from "react-icons/lu";
import Sidebar from '../sidebar/sidebar';
import VendasIcon from '../../assets/icons/dashboard-vendas-icon.svg';
import ValorIcon from '../../assets/icons/dashboard-valor-icon.svg';
import EstoqueIcon from '../../assets/icons/dashboard-estoque-icon.svg';
import ClientesIcon from '../../assets/icons/dashboard-clientes-icon.svg';
import { CSVLink } from "react-csv";

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', 
  '#FF4560', '#00E396', '#775DD0', '#FEB019', '#FF4560',
  '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC300', 
  '#FF6600', '#33FF66', '#FF0066', '#00FFCC', '#FF3366'
];

// const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300"];

function ViewDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    fetchClients();
    fetchOrders();
    fetchProducts();
  }, [startDate, endDate]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/client/get/');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders/');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Erro ao buscar encomendas:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const parseOrderDate = (number) => {
    const datePart = number.split('-')[0];
    return new Date(`${datePart.slice(4, 8)}-${datePart.slice(2, 4)}-${datePart.slice(0, 2)}`);
  };

  const filterOrdersByDate = (orders, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return orders.filter(order => {
      const orderDate = parseOrderDate(order.number);
      return orderDate >= start && orderDate <= end;
    });
  };

  const calculateTotalSales = (filteredOrders) => {
    return filteredOrders.reduce((total, order) => total + order.products.reduce((sum, product) => sum + (product.price * product.quantidade), 0), 0).toFixed(2);
  };

  const calculateTotalOrders = (filteredOrders) => {
    return filteredOrders.length;
  };

  const calculateTotalStock = () => {
    return products.reduce((total, product) => total + product.qtd, 0);
  };

  const filteredOrders = filterOrdersByDate(orders, startDate, endDate);
  const totalSales = calculateTotalSales(filteredOrders);
  const totalOrders = calculateTotalOrders(filteredOrders);

  const sortedOrders = [...filteredOrders].sort((a, b) => (b.total || 0) - (a.total || 0));

  // const ordersData = sortedOrders.map(order => ({
  //   name: order.name,
  //   total: order.products.reduce((sum, product) => sum + (product.price * product.quantidade), 0)
  // }));

  const productsData = products.map((product, index) => ({ name: product.name, quantidade: product.qtd, color: COLORS[index % COLORS.length] }));

  const exportData = () => {
    const filteredOrders = filterOrdersByDate(orders, startDate, endDate);
    const totalSales = calculateTotalSales(filteredOrders);
    const totalOrders = calculateTotalOrders(filteredOrders);
    const totalStock = calculateTotalStock();

    const csvData = [
      ["Relatório de Vendas - Período:", `${startDate} até ${endDate}`],
      [],
      ["Clientes Cadastrados"],
      ["Nome", "Telefone", "Endereço"],
      ...clients.map(client => [client.name, client.phone, client.endereco]),
      [],
      ["Resumo de Vendas"],
      ["Faturamento Total", "Número de Pedidos", "Itens no Estoque"],
      [`R$ ${totalSales}`, totalOrders, totalStock],
      [],
      ["Detalhamento de Pedidos"],
      ["Nome do Cliente", "Data do Pedido", "Produto", "Quantidade", "Preço Unitário", "Total do Pedido"],
      ...filteredOrders.flatMap(order => 
        order.products.map(product => [
          order.name, 
          new Date(order.date).toLocaleDateString(), 
          product.name, 
          product.quantidade, 
          `R$ ${product.price.toFixed(2)}`,
          `R$ ${(product.price * product.quantidade).toFixed(2)}`
        ])
      ),
      [],
      ["Resumo de Produtos em Estoque"],
      ["Produto", "Quantidade Disponível"],
      ...products.map(product => [product.name, product.qtd])
    ];

    return csvData;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p><strong>Cliente:</strong> {payload[0].payload.name}</p>
          <p><strong>Total:</strong> R$ {payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <div className="dashboard-page" id="dashboard-page">
          <div className="dashboard-title" id="dashboard-title">
            <h1>Painel de Controle</h1>
          </div>
        </div>

        <div className="dashboard-div-counters">
          <div className="dashboard-card-counter vendas">
            <div className="card-content">
              <div>
                <h3 className="card-title">Vendas</h3>
                <p className="card-subtitle">R$ {totalSales}</p>
              </div>
              <div className="card-icon">
                <img src={VendasIcon} alt="Ícone de Vendas" />
              </div>
            </div>
          </div>

          <div className="dashboard-card-counter pedidos">
            <div className="card-content">
              <div>
                <h3 className="card-title">Pedidos</h3>
                <p className="card-subtitle">{totalOrders}</p>
              </div>
              <div className="card-icon">
                <img src={ValorIcon} alt="Ícone de Valor" />
              </div>
            </div>
          </div>

          <div className="dashboard-card-counter estoque">
            <div className="card-content">
              <div>
                <h3 className="card-title">Estoque</h3>
                <p className="card-subtitle">{calculateTotalStock()} Itens</p>
              </div>
              <div className="card-icon">
                <img src={EstoqueIcon} alt="Ícone de Estoque" />
              </div>
            </div>
          </div>

          <div className="dashboard-card-counter clientes">
            <div className="card-content">
              <div>
                <h3 className="card-title">Clientes</h3>
                <p className="card-subtitle">{clients.length}</p>
              </div>
              <div className="card-icon">
                <img src={ClientesIcon} alt="Ícone de Clientes" />
              </div>
            </div>
          </div>
        </div>
          
        <div className="dashboard-contents" id="dashboard-contents">
          <div className="dashboard-filters">
            
            <div className='dashboard-datepickers'>
                <label className="dashboard-label">
                  Data de Início:
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label className="dashboard-label">
                  Data de Término:
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </label>
            </div>

                <div className='dashboard-div-button-export'>
                  <CSVLink data={exportData()} filename={"dashboard-data.csv"} className="dashboard-button-export" id="exportar-csv">
                    
                    <LuFileSpreadsheet/>
                    <span className="dashboard-button-export" id="exportar-csv">Exportar CSV</span>
                  </CSVLink>
                </div>

          </div>

          <div className='dashboard-grid'>

          <div className="dashboard-card">
            <h2>Últimos Clientes Cadastrados</h2>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                </tr>
              </thead>
              <tbody className='tabelas-dashboard-uppercase'>
                {clients.slice(-5).reverse().map(client => (
                  <tr key={client.id || client.phone}>
                    <td>{client.name}</td>
                    <td>{client.phone}</td>
                    <td>{client.endereco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dashboard-card">
            <h2>Últimos Pedidos</h2>
            <table className="dashboard-table tabelas-dashboard-uppercase">
              <thead>
                <tr>
                  <th>Nome do Cliente</th>
                  <th>Valor da Venda</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.slice(-5).reverse().map(order => (
                  <tr key={order.number}>
                    <td>{order.name}</td>
                    <td>R$ {order.products.reduce((sum, product) => sum + (product.price * product.quantidade), 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          </div>
            <div className="dashboard-section">
              
              <div className="dashboard-card">
                <h2>Produtos</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={productsData} dataKey="quantidade" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {productsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
        </div>
      </main>
    </div>  
  );
}

export default ViewDashboard;