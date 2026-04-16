import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const normalizeNotification = (notification) => {
  const data = notification.toJSON ? notification.toJSON() : notification;
  return {
    ...data,
    userId: data.userId || data.user,
    eventId: data.eventId || data.relatedEvent,
    isRead: data.isRead ?? data.read,
  };
};

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, unreadOnly = false } = req.query;
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (unreadOnly === 'true') filter.read = false;

  const notifications = await Notification.find(filter)
    .populate('relatedEvent', 'title date')
    .populate('relatedUser', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({
    user: userId,
    read: false,
  });

  res.status(200).json({
    notifications: notifications.map(normalizeNotification),
    unreadCount,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    },
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.id;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  if (notification.user.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    message: 'Notification marked as read',
    notification: normalizeNotification(notification),
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await Notification.updateMany({ user: userId, read: false }, { read: true });

  res.status(200).json({
    message: 'All notifications marked as read',
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user.id;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  if (notification.user.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await Notification.findByIdAndDelete(notificationId);

  res.status(200).json({
    message: 'Notification deleted',
  });
});
