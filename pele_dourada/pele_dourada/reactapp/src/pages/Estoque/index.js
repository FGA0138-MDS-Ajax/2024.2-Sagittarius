import React, {useEffect} from 'react';
import logo from '../../assets/logo.svg'; 
import ControleEstoque from '../../components/estoque/estoque';

function Estoque() {
     useEffect(() => {
        document.title = "Pele Dourada - Estoque";   
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