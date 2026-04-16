import { useEffect } from 'react';
import { useNotification } from './useNotification';

export const useNotifications = () => {
  const notificationState = useNotification();

  useEffect(() => {
    notificationState.fetchNotifications();
  }, [notificationState.fetchNotifications]);

  return notificationState;
};
