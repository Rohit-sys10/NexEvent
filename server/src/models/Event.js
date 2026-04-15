import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registrationCount: {
      type: Number,
      default: 0,
    },
    maxCapacity: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      enum: ['conference', 'workshop', 'seminar', 'networking', 'other'],
      default: 'other',
    },
    imageUrl: {
      type: String,
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
eventSchema.index({ organizer: 1 });
eventSchema.index({ date: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
