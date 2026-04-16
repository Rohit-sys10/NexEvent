import mongoose from 'mongoose';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { emitGlobal, emitToEventRoom, emitToUser } from '../socket/realtime.js';

const buildEventStatus = (event) => {
  const now = Date.now();
  const registrationDeadline = new Date(
    event.registrationDeadline || event.dateTime || event.date
  ).getTime();
  const isClosedByTime = Number.isFinite(registrationDeadline) && now > registrationDeadline;
  const isFull = Boolean(event.maxCapacity) && event.registrationCount >= event.maxCapacity;

  return {
    isClosedByTime,
    isFull,
    isRegistrationClosed: isClosedByTime || isFull,
  };
};

const createNotification = async ({ userId, type, message, eventId, relatedUser }) => {
  const notification = await Notification.create({
    user: userId,
    type,
    message,
    relatedEvent: eventId,
    relatedUser: relatedUser || null,
  });

  return notification.toJSON();
};

const registerFlow = async (eventId, userId) => {
  const now = new Date();

  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: eventId,
      registeredUsers: { $ne: userId },
      $or: [{ registrationDeadline: null }, { registrationDeadline: { $gt: now } }],
      $expr: {
        $or: [
          { $eq: ['$maxCapacity', null] },
          { $eq: ['$maxCapacity', 0] },
          { $lt: ['$registrationCount', '$maxCapacity'] },
        ],
      },
    },
    {
      $addToSet: { registeredUsers: userId },
      $inc: { registrationCount: 1 },
    },
    { new: true }
  );

  if (!updatedEvent) {
    const event = await Event.findById(eventId);
    if (!event) {
      return { error: { code: 404, message: 'Event not found' } };
    }

    const status = buildEventStatus(event);
    if (status.isClosedByTime) {
      return { error: { code: 400, message: 'Registration closed for this event' } };
    }
    if (status.isFull) {
      return { error: { code: 400, message: 'Event is at full capacity' } };
    }
    if (event.registeredUsers.some((id) => id.toString() === userId.toString())) {
      return { error: { code: 400, message: 'You are already registered for this event' } };
    }

    return { error: { code: 400, message: 'Unable to register for this event' } };
  }

  await Registration.updateOne(
    { user: userId, event: eventId },
    { $setOnInsert: { user: userId, event: eventId } },
    { upsert: true }
  );

  const organizerNotification = await createNotification({
    userId: updatedEvent.organizer,
    type: 'NEW_REGISTRATION',
    message: `A user registered for ${updatedEvent.title}`,
    eventId,
    relatedUser: userId,
  });

  const userNotification = await createNotification({
    userId,
    type: 'registration_confirmed',
    message: `You registered for ${updatedEvent.title}`,
    eventId,
    relatedUser: updatedEvent.organizer,
  });

  emitToEventRoom(eventId, 'new_registration', {
    eventId,
    registrationCount: updatedEvent.registrationCount,
    userId: userId.toString(),
  });
  emitGlobal('new_registration', {
    eventId,
    registrationCount: updatedEvent.registrationCount,
    userId: userId.toString(),
  });

  emitToEventRoom(eventId, 'registrationUpdate', {
    eventId,
    registrationCount: updatedEvent.registrationCount,
    timestamp: new Date(),
  });

  emitToUser(updatedEvent.organizer, 'notification_received', organizerNotification);
  emitToUser(updatedEvent.organizer, 'notificationReceived', organizerNotification);
  emitToUser(userId, 'notification_received', userNotification);
  emitToUser(userId, 'notificationReceived', userNotification);

  return { updatedEvent };
};

const unregisterFlow = async (eventId, userId) => {
  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      registeredUsers: userId,
      registrationCount: { $gt: 0 },
    },
    {
      $pull: { registeredUsers: userId },
      $inc: { registrationCount: -1 },
    },
    { new: true }
  );

  if (!event) {
    const exists = await Event.findById(eventId);
    if (!exists) {
      return { error: { code: 404, message: 'Event not found' } };
    }
    return { error: { code: 404, message: 'Registration not found' } };
  }

  await Registration.deleteOne({ user: userId, event: eventId });

  const organizerNotification = await createNotification({
    userId: event.organizer,
    type: 'UNREGISTER',
    message: `A user cancelled registration for ${event.title}`,
    eventId,
    relatedUser: userId,
  });

  emitToEventRoom(eventId, 'unregister', {
    eventId,
    registrationCount: event.registrationCount,
    userId: userId.toString(),
  });
  emitGlobal('unregister', {
    eventId,
    registrationCount: event.registrationCount,
    userId: userId.toString(),
  });

  emitToEventRoom(eventId, 'registrationUpdate', {
    eventId,
    registrationCount: event.registrationCount,
    timestamp: new Date(),
  });

  emitToUser(event.organizer, 'notification_received', organizerNotification);
  emitToUser(event.organizer, 'notificationReceived', organizerNotification);

  return { updatedEvent: event };
};

export const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const userId = new mongoose.Types.ObjectId(req.user.id);

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  const result = await registerFlow(new mongoose.Types.ObjectId(eventId), userId);
  if (result.error) {
    return res.status(result.error.code).json({ message: result.error.message });
  }

  const updatedEvent = result.updatedEvent;
  const registration = await Registration.findOne({
    user: userId,
    event: updatedEvent._id,
  });

  return res.status(201).json({
    message: 'Registered successfully',
    registration: {
      id: registration?._id,
      eventId: updatedEvent._id,
      registeredAt: registration?.registeredAt || new Date(),
    },
    updatedCount: updatedEvent.registrationCount,
    event: updatedEvent,
  });
});

export const unregisterFromEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const result = await unregisterFlow(new mongoose.Types.ObjectId(eventId), userId);
  if (result.error) {
    return res.status(result.error.code).json({ message: result.error.message });
  }

  return res.status(200).json({
    message: 'Unregistered successfully',
    updatedCount: result.updatedEvent.registrationCount,
    event: result.updatedEvent,
  });
});

export const registerForEventByParam = asyncHandler(async (req, res) => {
  req.body.eventId = req.params.id;
  return registerForEvent(req, res);
});

export const unregisterFromEventByParam = asyncHandler(async (req, res) => {
  req.params.eventId = req.params.id;
  return unregisterFromEvent(req, res);
});

export const getUserRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const registrations = await Registration.find({ user: userId })
    .populate({
      path: 'event',
      populate: { path: 'organizer', select: 'name email' },
    })
    .sort({ registeredAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Registration.countDocuments({ user: userId });

  res.status(200).json({
    registrations: registrations.map((reg) => reg.event).filter(Boolean),
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    },
  });
});

export const getEventRegistrations = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.organizer.toString() !== userId) {
    return res.status(403).json({ message: 'Only the organizer can view registrations' });
  }

  const registrations = await Registration.find({ event: eventId })
    .populate('user', 'name email')
    .sort({ registeredAt: -1 });

  res.status(200).json({
    registrations,
    count: registrations.length,
  });
});

export const setIO = () => {
  // Compatibility no-op. Realtime now uses socket/realtime singleton.
};
