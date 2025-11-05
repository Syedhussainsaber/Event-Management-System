import mongoose, { Schema, models } from 'mongoose';

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  maxAttendees?: number;
  attendees: mongoose.Types.ObjectId[];
  organizer: mongoose.Types.ObjectId;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Business', 'Arts', 'Sports', 'Music', 'Education', 'Other'],
    default: 'Other',
  },
  maxAttendees: {
    type: Number,
    min: 1,
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;