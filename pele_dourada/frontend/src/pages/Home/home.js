import React, {useEffect} from 'react';
import Login from '../../components/login/login';
import logo from '../../assets/icons/logo.svg'; 

function Home() {
  useEffect(() => {
    document.title = "Frango Assado Pele Dourada";   
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = logo; 
    }
  }, []);

  return (
    <div>
      <Login />
    </div>
  );
}

export default Home;