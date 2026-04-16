import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
} from '../controllers/eventController.js';
import {
  registerForEventByParam,
  unregisterFromEventByParam,
} from '../controllers/registrationController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', authenticate, authorize('organizer'), createEvent);
router.post('/:id/register', authenticate, registerForEventByParam);
router.post('/:id/unregister', authenticate, unregisterFromEventByParam);
router.put('/:id', authenticate, authorize('organizer'), updateEvent);
router.delete('/:id', authenticate, authorize('organizer'), deleteEvent);
router.get('/organizer/my-events', authenticate, getOrganizerEvents);

export default router;
