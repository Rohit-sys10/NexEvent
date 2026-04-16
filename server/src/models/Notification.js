import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'NEW_EVENT',
        'NEW_REGISTRATION',
        'UNREGISTER',
        'EVENT_UPDATED',
        'event_created',
        'event_updated',
        'registration_confirmed',
        'new_registration',
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

notificationSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.userId = ret.user;
    ret.eventId = ret.relatedEvent;
    ret.isRead = ret.read;
    return ret;
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
