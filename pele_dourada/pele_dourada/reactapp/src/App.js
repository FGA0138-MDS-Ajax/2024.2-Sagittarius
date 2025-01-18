import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/home';
import Estoque from './pages/Estoque'; 



function App() {
  return (
    <Router>
      <Routes> 
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/estoque/*" element={<Estoque />} />
      </Routes>
    </Router>
  );
}

export default App;