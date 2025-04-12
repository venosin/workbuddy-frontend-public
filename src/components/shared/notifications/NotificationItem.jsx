import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X
} from 'lucide-react';
import { useNotifications } from '../../../contexts/NotificationContext';

/**
 * Componente para mostrar una notificación individual
 */
const NotificationItem = ({ notification }) => {
  const { removeNotification } = useNotifications();
  
  // Configurar icono y color según el tipo de notificación
  const getTypeConfig = () => {
    switch (notification.type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-400'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-400'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-400'
        };
      case 'info':
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-400'
        };
    }
  };

  const { icon, bgColor, borderColor } = getTypeConfig();

  return (
    <div 
      className={`flex items-start p-4 mb-3 rounded-md shadow-md border-l-4 ${bgColor} ${borderColor} transition-all duration-300 transform animate-slide-in`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        {icon}
      </div>
      <div className="flex-1">
        {notification.title && (
          <h3 className="text-sm font-medium text-gray-900">
            {notification.title}
          </h3>
        )}
        <div className="text-sm text-gray-700 mt-1">
          {notification.message}
        </div>
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default NotificationItem;
