import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/home';
import Estoque from './pages/Estoque'; 
import Dashboard from './pages/Dashboard/dashboard';
import Vendas from './pages/Vendas/vendas';
import Clientes from './pages/Clientes/clientes';


function App() {
  return (
    <Router>
      <Routes> 
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/estoque/*" element={<Estoque />} />
        <Route exact path='/dashboard/' element={<Dashboard />} />
        <Route exact path='/vendas/' element={<Vendas />} />
        <Route exact path='/clientes/' element={<Clientes/>} />
      </Routes>
    </Router>
  );
}

export default App;