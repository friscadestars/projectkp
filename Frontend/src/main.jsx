// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { OrderProvider } from './Context/OrderContext';
import { AuthProvider } from './Context/AuthContext';
import 'aos/dist/aos.css';
import AOS from 'aos';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider harus di luar, baru OrderProvider, baru App */}
      <AuthProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


AOS.init({
  duration: 800, // durasi animasi (ms)
  easing: 'ease-in-out',
  once: false,    // animasi berkali kali
  offset: 200,    // jarak scroll sebelum animasi jalan
});
