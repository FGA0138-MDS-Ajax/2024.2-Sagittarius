import React, {useEffect} from 'react';
import ViewDashboard from '../../components/dashboard/dashboard';
import logo from '../../assets/logo.svg'; 

function Dashboard() {
  useEffect(() => {
    document.title = "Frango Assado Pele Dourada";   
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = logo; 
    }
  }, []);

  return (
    <div>
      <ViewDashboard />
    </div>
  );
}

export default Dashboard;