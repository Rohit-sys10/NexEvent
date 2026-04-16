import Event from '../models/Event.js';
import User from '../models/User.js';
import Registration from '../models/Registration.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { emitGlobal, emitToUser, emitToUsers } from '../socket/realtime.js';

const normalizeDateTime = (value) => (value ? new Date(value) : null);

const buildEventPayload = (eventDoc) => {
  const event = eventDoc.toObject ? eventDoc.toObject() : eventDoc;
  return {
    ...event,
    dateTime: event.dateTime || event.date,
    createdBy: event.createdBy || event.organizer,
    registrationDeadline: event.registrationDeadline || event.dateTime || event.date,
    registeredUsers: event.registeredUsers || [],
    registrationCount: event.registrationCount || (event.registeredUsers?.length || 0),
  };
};

const createNotifications = async ({ userIds, type, message, eventId, relatedUser }) => {
  if (!userIds.length) return [];

  return Notification.insertMany(
    userIds.map((userId) => ({
      user: userId,
      type,
      message,
      relatedEvent: eventId,
      relatedUser: relatedUser || null,
    }))
  );
};

const emitNotificationBatch = (userIds, notifications) => {
  notifications.forEach((notification, index) => {
    const userId = userIds[index];
    if (!userId) return;
    const payload = notification.toJSON();
    emitToUser(userId, 'notification_received', payload);
    emitToUser(userId, 'notificationReceived', payload);
  });
};

export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    dateTime,
    location,
    category,
    maxCapacity,
    registrationDeadline,
    image,
    imageUrl,
  } = req.body;

  const effectiveDate = normalizeDateTime(dateTime || date);

  if (!title || !description || !effectiveDate || !location) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const effectiveRegistrationDeadline =
    normalizeDateTime(registrationDeadline) || effectiveDate;

  if (effectiveRegistrationDeadline > effectiveDate) {
    return res.status(400).json({
      message: 'Registration deadline must be before or equal to the event date/time',
    });
  }

  const event = await Event.create({
    title,
    description,
    date: effectiveDate,
    dateTime: effectiveDate,
    location,
    category: category || 'other',
    maxCapacity: maxCapacity || null,
    registrationDeadline: effectiveRegistrationDeadline,
    imageUrl: imageUrl || image || null,
    registeredUsers: [],
    organizer: req.user.id,
    createdBy: req.user.id,
  });

  const users = await User.find({ _id: { $ne: req.user.id } }, '_id');
  const recipientIds = users.map((user) => user._id.toString());

  const notifications = await createNotifications({
    userIds: recipientIds,
    type: 'NEW_EVENT',
    message: `New event published: ${title}`,
    eventId: event._id,
    relatedUser: req.user.id,
  });

  const eventPayload = buildEventPayload(event);

  emitGlobal('new_event', {
    event: eventPayload,
    actorId: req.user.id,
  });
  emitNotificationBatch(recipientIds, notifications);


  res.status(201).json({
    message: 'Event created successfully',
    event: eventPayload,
  });
});

export const getEvents = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (category) filter.category = category;

  const events = await Event.find(filter)
    .populate('organizer', 'name email')
    .sort({ dateTime: 1, date: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Event.countDocuments(filter);

  res.status(200).json({
    events: events.map(buildEventPayload),
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    },
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email');

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Get registrations for this event
  const registrations = await Registration.find({ event: event._id }).populate(
    'user',
    'name email'
  );

  res.status(200).json({
    event: buildEventPayload(event),
    registrations,
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.organizer.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not the organizer' });
  }

  const {
    title,
    description,
    date,
    dateTime,
    location,
    category,
    maxCapacity,
    registrationDeadline,
    image,
    imageUrl,
  } = req.body;

  const effectiveDate = normalizeDateTime(dateTime || date || event.dateTime || event.date);
  const effectiveRegistrationDeadline =
    normalizeDateTime(registrationDeadline) || event.registrationDeadline || effectiveDate;

  if (effectiveRegistrationDeadline > effectiveDate) {
    return res.status(400).json({
      message: 'Registration deadline must be before or equal to the event date/time',
    });
  }

  const currentRegistrations = event.registrationCount || event.registeredUsers.length;
  if (maxCapacity !== undefined && maxCapacity !== null) {
    const capacityValue = Number(maxCapacity);
    if (Number.isNaN(capacityValue) || capacityValue < currentRegistrations) {
      return res.status(400).json({
        message: `Max capacity cannot be less than current registrations (${currentRegistrations}).`,
      });
    }
  }

  if (title) event.title = title;
  if (description) event.description = description;
  if (effectiveDate) {
    event.date = effectiveDate;
    event.dateTime = effectiveDate;
  }
  if (location) event.location = location;
  if (category) event.category = category;
  if (maxCapacity !== undefined) event.maxCapacity = maxCapacity;
  if (registrationDeadline !== undefined) {
    event.registrationDeadline = effectiveRegistrationDeadline;
  }
  if (imageUrl !== undefined || image !== undefined) event.imageUrl = imageUrl || image || null;

  await event.save();

  const registrationDocs = await Registration.find({ event: event._id }, 'user');
  const recipients = registrationDocs
    .map((registration) => registration.user.toString())
    .filter((userId) => userId !== req.user.id);

  const notifications = await createNotifications({
    userIds: recipients,
    type: 'EVENT_UPDATED',
    message: `Event updated: ${event.title}`,
    eventId: event._id,
    relatedUser: req.user.id,
  });

  const payload = buildEventPayload(event);

  emitGlobal('event_updated', { event: payload, actorId: req.user.id });
  emitToUsers(recipients, 'event_updated', { event: payload, actorId: req.user.id });
  emitNotificationBatch(recipients, notifications);

  res.status(200).json({
    message: 'Event updated successfully',
    event: payload,
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.organizer.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not the organizer' });
  }

  await Event.findByIdAndDelete(req.params.id);
  await Registration.deleteMany({ event: event._id });
  await Notification.deleteMany({ relatedEvent: event._id });

  res.status(200).json({
    message: 'Event deleted successfully',
  });
});

export const getOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user.id })
    .populate('organizer', 'name email')
    .sort({ dateTime: 1, date: 1 });

  res.status(200).json({
    events: events.map(buildEventPayload),
  });
});
