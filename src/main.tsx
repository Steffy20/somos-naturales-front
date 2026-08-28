import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartContext';

import './index.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
{/* 1. Proveedor de Auth: Maneja el estado global del usuario y el rol */}
      <AuthProvider>
        {/* 2. Router: Habilita el uso de rutas en toda la App */}
        <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
        </BrowserRouter>
      </AuthProvider>
  </StrictMode>,
)
