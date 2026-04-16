import { createContext, useState, useCallback } from 'react';
import { notificationService } from '../services/api';

export const NotificationContext = createContext();

const normalizeNotification = (notification) => ({
  ...notification,
  _id: notification._id || notification.id,
  read: notification.read ?? notification.isRead ?? false,
  isRead: notification.isRead ?? notification.read ?? false,
  relatedEvent: notification.relatedEvent || notification.eventId,
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async (page = 1, limit = 10, unreadOnly = false) => {
    try {
      setLoading(true);
      const response = await notificationService.getAll(page, limit, unreadOnly);
      setNotifications((response.notifications || []).map(normalizeNotification));
      setUnreadCount(response.unreadCount);
      return response;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
      setUnreadCount((prev) => {
        const notif = notifications.find((n) => n._id === notificationId);
        return notif && !notif.read ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    const next = normalizeNotification(notification);
    setNotifications((prev) => [next, ...prev.filter((item) => item._id !== next._id)]);
    if (!next.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const addNotifications = useCallback((notificationList) => {
    if (!Array.isArray(notificationList)) return;

    const normalized = notificationList.map(normalizeNotification);
    setNotifications((prev) => {
      const existing = new Map(prev.map((item) => [item._id, item]));
      normalized.forEach((item) => existing.set(item._id, item));
      return Array.from(existing.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    const unreadIncoming = normalized.filter((item) => !item.read).length;
    if (unreadIncoming > 0) {
      setUnreadCount((prev) => prev + unreadIncoming);
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    addNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
};
