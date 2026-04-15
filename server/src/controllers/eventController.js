import Event from '../models/Event.js';
import User from '../models/User.js';
import Registration from '../models/Registration.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, category, maxCapacity } = req.body;

  if (!title || !description || !date || !location) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const event = await Event.create({
    title,
    description,
    date,
    location,
    category: category || 'other',
    maxCapacity: maxCapacity || null,
    organizer: req.user.id,
  });

  // Create notification for all users about new event
  const users = await User.find({ role: 'user' });
  const notifications = users.map((user) => ({
    user: user._id,
    type: 'event_created',
    message: `New event: ${title}`,
    relatedEvent: event._id,
  }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }

  res.status(201).json({
    message: 'Event created successfully',
    event,
  });
});

export const getEvents = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (category) filter.category = category;

  const events = await Event.find(filter)
    .populate('organizer', 'name email')
    .sort({ date: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Event.countDocuments(filter);

  res.status(200).json({
    events,
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
    event,
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

  const { title, description, date, location, category, maxCapacity } = req.body;

  if (title) event.title = title;
  if (description) event.description = description;
  if (date) event.date = date;
  if (location) event.location = location;
  if (category) event.category = category;
  if (maxCapacity !== undefined) event.maxCapacity = maxCapacity;

  await event.save();

  res.status(200).json({
    message: 'Event updated successfully',
    event,
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
    .sort({ date: 1 });

  res.status(200).json({
    events,
  });
});
