import React, { useEffect } from 'react';
import Sidebar from '../../components/sidebar/sidebar'; 
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
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', flex: 1 }}> 
        <ViewDashboard />
      </div>
    </div>
  );
}

export default Dashboard;
