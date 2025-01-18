import React, {useEffect} from 'react';
import Login from '../components/login';


function Home() {
    useEffect(() => {
        document.title = "Frango Assado Pele Dourada";
      }, []);

  return (
    <div>
      <Login />
    </div>
  );
}

export default Home;