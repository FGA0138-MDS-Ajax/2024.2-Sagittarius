import React, {useEffect} from 'react';
import Login from '../components/login';
import logo from '../assets/logo.svg'; 


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