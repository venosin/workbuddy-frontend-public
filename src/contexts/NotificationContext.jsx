import React, { createContext, useContext, useState, useCallback } from 'react';

// Crear el contexto
const NotificationContext = createContext();

/**
 * Proveedor de notificaciones para la aplicación
 * Permite mostrar notificaciones globales y manejar su estado
 */
export const NotificationProvider = ({ children }) => {
  // Estado para almacenar las notificaciones activas
  const [notifications, setNotifications] = useState([]);

  // Añadir una nueva notificación
  const addNotification = useCallback((notification) => {
    // Generar un ID único para la notificación
    const id = Date.now().toString();
    
    // Crear la notificación con valores por defecto si no se proporcionan
    const newNotification = {
      id,
      type: notification.type || 'info', // 'success', 'error', 'info', 'warning'
      title: notification.title || '',
      message: notification.message || '',
      autoClose: notification.autoClose !== undefined ? notification.autoClose : true,
      duration: notification.duration || 5000, // Tiempo en ms que se muestra la notificación
      ...notification
    };
    
    // Añadir la notificación al estado
    setNotifications(prev => [...prev, newNotification]);
    
    // Si la notificación debe cerrarse automáticamente, configurar un temporizador
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    
    return id; // Devolver el ID para poder referenciar esta notificación más tarde
  }, []);
  
  // Eliminar una notificación por su ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Limpiar todas las notificaciones
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Notificaciones específicas por tipo
  const showSuccess = useCallback((message, title = 'Éxito') => {
    return addNotification({ type: 'success', message, title });
  }, [addNotification, removeNotification]);
  
  const showError = useCallback((message, title = 'Error') => {
    return addNotification({ 
      type: 'error', 
      message, 
      title,
      autoClose: false, // Los errores no se cierran automáticamente
    });
  }, [addNotification, removeNotification]);
  
  const showInfo = useCallback((message, title = 'Información') => {
    return addNotification({ type: 'info', message, title });
  }, [addNotification, removeNotification]);
  
  const showWarning = useCallback((message, title = 'Advertencia') => {
    return addNotification({ type: 'warning', message, title });
  }, [addNotification, removeNotification]);
  
  // Valor del contexto que se proporcionará
  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar el contexto de notificaciones
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de un NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;
