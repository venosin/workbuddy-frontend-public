import { useContext } from 'react';
import { CartContext } from '../contexts/CartProvider';

export function useCart() {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  
  return context;
}
