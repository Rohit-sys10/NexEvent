import express from 'express';
import {
  registerForEvent,
  unregisterFromEvent,
  getUserRegistrations,
  getEventRegistrations,
} from '../controllers/registrationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, registerForEvent);
router.post('/:eventId/unregister', authenticate, unregisterFromEvent);
router.delete('/:eventId', authenticate, unregisterFromEvent);
router.get('/my-registrations', authenticate, getUserRegistrations);
router.get('/event/:eventId/registrations', authenticate, getEventRegistrations);

export default router;
