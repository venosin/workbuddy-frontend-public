import React from 'react';
import { useNotifications } from '../../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';

/**
 * Contenedor para mostrar todas las notificaciones activas
 * Se posiciona en la parte superior derecha de la pantalla
 */
const NotificationContainer = () => {
  const { notifications } = useNotifications();

  if (!notifications.length) return null;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm space-y-2 flex flex-col items-end">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
