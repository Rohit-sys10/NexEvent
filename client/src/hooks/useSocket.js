import { useEffect } from 'react';
import { initSocket, joinGlobalRoom } from '../lib/socket';
import { useAuth } from './useAuth';
import { useNotification } from './useNotification';
import { useEventState } from './useEventState';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification, addNotifications } = useNotification();
  const { upsertEvent, updateRegistrationCount } = useEventState();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const sock = initSocket();
    joinGlobalRoom();

    sock.emit('joinUserRoom', user.id);

    const onNotification = (notification) => {
      addNotification(notification);
    };

    const onNotificationBatch = (notifications) => {
      addNotifications(notifications);
    };

    const onNewEvent = (payload) => {
      if (payload?.actorId === user.id) return;
      if (payload?.event) {
        upsertEvent(payload.event);
      }
    };

    const onRegistration = (payload) => {
      if (payload?.eventId) {
        updateRegistrationCount(payload.eventId, payload.registrationCount);
      }
    };

    const onEventUpdated = (payload) => {
      if (payload?.event) {
        upsertEvent(payload.event);
      }
    };

    sock.on('notification_received', onNotification);
    sock.on('notificationReceived', onNotification);
    sock.on('notification_batch', onNotificationBatch);
    sock.on('new_event', onNewEvent);
    sock.on('new_registration', onRegistration);
    sock.on('unregister', onRegistration);
    sock.on('event_updated', onEventUpdated);
    sock.on('registrationUpdate', onRegistration);

    return () => {
      sock.off('notification_received', onNotification);
      sock.off('notificationReceived', onNotification);
      sock.off('notification_batch', onNotificationBatch);
      sock.off('new_event', onNewEvent);
      sock.off('new_registration', onRegistration);
      sock.off('unregister', onRegistration);
      sock.off('event_updated', onEventUpdated);
      sock.off('registrationUpdate', onRegistration);
    };
  }, [
    isAuthenticated,
    user,
    addNotification,
    addNotifications,
    upsertEvent,
    updateRegistrationCount,
  ]);
};
