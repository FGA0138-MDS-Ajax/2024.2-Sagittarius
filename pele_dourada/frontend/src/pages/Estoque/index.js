import React, { useEffect } from 'react';
import logo from '../../assets/icons/logo.svg';
import ControleEstoque from '../../components/estoque/ControleEstoque/estoque';
import Sidebar from '../../components/sidebar/sidebar';

function Estoque() {
  useEffect(() => {
    document.title = "Frango Assado Pele Dourada";
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = logo;
    }
  }, []);

  return (
    <div>
      <ControleEstoque/>
    </div>
  );
}

export default Estoque;

