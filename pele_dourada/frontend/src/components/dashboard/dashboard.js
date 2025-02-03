import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importando o Link para navegação
import './dashboard.css'; // Importando o arquivo CSS, se necessário

function ViewDashboard() {

    return (
        <div>
          <div className="content" style={{ marginLeft: '250px', padding: '20px' }}>
            <h1>Bem-vindo ao Dashboard</h1>
            <p>Teste</p>
          </div>
        </div>
      );
    }

export default ViewDashboard;
