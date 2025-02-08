import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar'; 
import ViewDashboard from '../../components/dashboard/dashboard';
import logo from '../../assets/icons/logo.svg'; 

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
      <ViewDashboard/>
    </div>
  );
}

export default Dashboard;
