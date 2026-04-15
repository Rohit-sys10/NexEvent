import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Socket.io instance will be injected
let io = null;
export const setIO = (socketInstance) => {
  io = socketInstance;
};

export const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Check if user is already registered
  const existingRegistration = await Registration.findOne({
    user: userId,
    event: eventId,
  });

  if (existingRegistration) {
    return res.status(400).json({ message: 'You are already registered for this event' });
  }

  // Check capacity
  if (event.maxCapacity && event.registrationCount >= event.maxCapacity) {
    return res.status(400).json({ message: 'Event is at full capacity' });
  }

  // Create registration
  const registration = await Registration.create({
    user: userId,
    event: eventId,
  });

  // Update event registration count
  event.registrationCount += 1;
  await event.save();

  // Create notification for organizer
  const organizerNotif = await Notification.create({
    user: event.organizer,
    type: 'new_registration',
    message: `New registration for ${event.title}`,
    relatedEvent: eventId,
    relatedUser: userId,
  });

  // Create confirmation notification for user
  const userNotif = await Notification.create({
    user: userId,
    type: 'registration_confirmed',
    message: `You registered for ${event.title}`,
    relatedEvent: eventId,
  });

  // Broadcast registration update via Socket.io
  if (io) {
    // Broadcast updated registration count to event room
    io.to(`event_${eventId}`).emit('registrationUpdate', {
      eventId,
      registrationCount: event.registrationCount,
      timestamp: new Date(),
    });

    // Send notification to organizer
    io.to(`user_${event.organizer}`).emit('notificationReceived', {
      ...organizerNotif.toObject(),
    });

    // Send notification to registered user
    io.to(`user_${userId}`).emit('notificationReceived', {
      ...userNotif.toObject(),
    });
  }

  res.status(201).json({
    message: 'Registered successfully',
    registration: {
      id: registration._id,
      eventId: registration.event,
      registeredAt: registration.registeredAt,
    },
    updatedCount: event.registrationCount,
  });
});

export const unregisterFromEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  // Check if registration exists
  const registration = await Registration.findOne({
    user: userId,
    event: eventId,
  });

  if (!registration) {
    return res.status(404).json({ message: 'Registration not found' });
  }

  // Delete registration
  await Registration.deleteOne({ _id: registration._id });

  // Update event registration count
  const event = await Event.findById(eventId);
  if (event) {
    event.registrationCount = Math.max(0, event.registrationCount - 1);
    await event.save();
  }

  // Broadcast unregistration update via Socket.io
  if (io) {
    io.to(`event_${eventId}`).emit('registrationUpdate', {
      eventId,
      registrationCount: event.registrationCount,
      timestamp: new Date(),
    });
  }

  res.status(200).json({
    message: 'Unregistered successfully',
    updatedCount: event.registrationCount,
  });
});

export const getUserRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const registrations = await Registration.find({ user: userId })
    .populate('event')
    .sort({ registeredAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Registration.countDocuments({ user: userId });

  res.status(200).json({
    registrations: registrations.map((reg) => reg.event),
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

  // Check if user is the organizer
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
