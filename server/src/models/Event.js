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
    dateTime: {
      type: Date,
      default: null,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    registrationCount: {
      type: Number,
      default: 0,
    },
    registrationDeadline: {
      type: Date,
      default: null,
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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
eventSchema.index({ registrationDeadline: 1 });

eventSchema.pre('save', function syncFields(next) {
  if (this.dateTime && !this.date) {
    this.date = this.dateTime;
  }
  if (this.date && !this.dateTime) {
    this.dateTime = this.date;
  }
  if (!this.registrationDeadline) {
    this.registrationDeadline = this.dateTime || this.date;
  }
  if (!this.createdBy) {
    this.createdBy = this.organizer;
  }
  if (!Array.isArray(this.registeredUsers)) {
    this.registeredUsers = [];
  }
  this.registrationCount = this.registeredUsers.length;
  next();
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
