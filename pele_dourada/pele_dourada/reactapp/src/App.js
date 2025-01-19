import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/home';
import Estoque from './pages/Estoque'; 
import Dashboard from './pages/Dashboard/dashboard';



function App() {
  return (
    <Router>
      <Routes> 
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/estoque/*" element={<Estoque />} />
        <Route exact path='/dashboard/' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;