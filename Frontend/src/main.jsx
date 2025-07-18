// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { OrderProvider } from './Context/OrderContext';
import { AuthProvider } from './Context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrderProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </OrderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
