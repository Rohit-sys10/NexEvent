import { useEffect } from 'react';
import { initSocket } from '../lib/socket';
import { useAuth } from './useAuth';
import { useNotification } from './useNotification';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const sock = initSocket();

    // Join user notification room
    sock.emit('joinUserRoom', user.id);

    // Listen for real-time notification updates
    sock.on('notificationReceived', (notification) => {
      addNotification(notification);
    });

    return () => {
      sock.off('notificationReceived');
    };
  }, [isAuthenticated, user, addNotification]);
};
