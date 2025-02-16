import React from 'react';
import './alerts.css';

const Alert = ({ message, type, onClose }) => {
  return (
    <div className={`alert ${type}`}>
      <span className="alert-message">{message}</span>
      <button className="alert-close" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Alert;