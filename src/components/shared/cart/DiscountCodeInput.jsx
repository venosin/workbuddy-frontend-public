import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function DiscountCodeInput({ onApplyCode, currentCode, discount }) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Ingresa un código de descuento');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await onApplyCode(code);
    } catch (err) {
      setError(err.message || 'Código inválido');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveCode = () => {
    onApplyCode(null);
    setCode('');
  };
  
  // Si ya hay un código aplicado, mostrar información del código
  if (currentCode) {
    return (
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <p className="text-sm font-medium">Código aplicado: <span className="font-bold">{currentCode}</span></p>
            <p className="text-sm text-green-600">Descuento: {discount}%</p>
          </div>
        </div>
        <button 
          onClick={handleRemoveCode}
          className="text-sm text-red-500 hover:text-red-700"
          type="button"
        >
          Eliminar
        </button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label htmlFor="discount-code" className="block text-sm font-medium text-gray-700 mb-1">
        ¿Tienes un código de descuento?
      </label>
      <div className="flex">
        <input
          type="text"
          id="discount-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ingresa tu código"
          className={`flex-1 p-2 border rounded-l-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-r-md font-medium text-white ${
            isLoading
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          } transition-colors`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Aplicar'
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </form>
  );
}
