import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './dashboard.css';
import Sidebar from '../sidebar/sidebar';

function ViewDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
      const response = await axios.get('http://localhost:8000/api/order/list/');
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

  const ordersData = orders.map(order => ({ name: order.name, total: order.payment }));
  const productsData = products.map(product => ({ name: product.name, quantidade: product.qtd }));

  return (
    <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="main-content">
        <div className="dashboard-page" id="dashboard-page">
          <div className="dashboard-title" id="dashboard-title">
            <h1>Painel de Controle</h1>
          </div>
        </div>  
        <div className="dashboard-contents" id="dashboard-contents">
          <div className="dashboard-filters">
            <label>
              Data de Início:
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
              Data de Término:
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-card">
              <h2>Clientes</h2>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Endereço</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.name}>
                      <td>{client.name}</td>
                      <td>{client.phone}</td>
                      <td>{client.endereco}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="dashboard-card">
              <h2>Encomendas</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#F3821B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="dashboard-card">
              <h2>Produtos</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={productsData} dataKey="quantidade" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#F3821B" label>
                    {productsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#F3821B" />
                    ))}
                  </Pie>
                  <Tooltip />
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
