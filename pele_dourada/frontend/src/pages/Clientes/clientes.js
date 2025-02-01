import { useState, useEffect } from 'react';
import logo from '../../assets/icons/logo.svg';
import Sidebar from '../../components/sidebar/sidebar';
import ControleClientes from '../../components/clientes/clientes';

function Clientes() {
  useEffect(() => {
    document.title = "Pele Dourada - Estoque";
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = logo;
    }
  }, []);


  return (
    <div>
      <ControleClientes/>
    </div>
  );
}

export default Clientes;