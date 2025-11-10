'use server';

import connectDB from '../db';
import Event from '@/app/models/event.model';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import User from '@/app/models/user.model';

const EventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  maxAttendees: z.string().optional(),
});


export async function createEventAction(formData: FormData) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return { error: 'You must be logged in to create an event' };
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      category: formData.get('category') as string,
      maxAttendees: formData.get('maxAttendees') as string,
    };

    const validated = EventSchema.parse(data);

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return { error: 'User not found' };
    }


    const eventData: any = {
      title: validated.title,
      description: validated.description,
      date: new Date(validated.date),
      location: validated.location,
      category: validated.category,
      organizer: new mongoose.Types.ObjectId(user._id),
    };

    if (validated.maxAttendees && parseInt(validated.maxAttendees) > 0) {
      eventData.maxAttendees = parseInt(validated.maxAttendees);
    }

    await Event.create(eventData);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    // if (error instanceof z.ZodError ) {
    //   return { error: error.errors[0].message };
    // }
    console.error('Create event error:', error);
    return { error: 'Failed to create event' };
  }
}

export async function updateEventAction(eventId: string, formData: FormData) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return { error: 'You must be logged in to update an event' };
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });


    if (!user) {
      return { error: 'User not found' };
    }


    const event = await Event.findById(eventId);

    if (!event) {
      return { error: 'Event not found' };
    }

    if (event.organizer.toString() !== user._id.toString()) {
      return { error: 'You are not authorized to update this event' };
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      category: formData.get('category') as string,
      maxAttendees: formData.get('maxAttendees') as string,
    };

    const validated = EventSchema.parse(data);

    const updateData: any = {
      title: validated.title,
      description: validated.description,
      date: new Date(validated.date),
      location: validated.location,
      category: validated.category,
    };

    if (validated.maxAttendees && parseInt(validated.maxAttendees) > 0) {
      updateData.maxAttendees = parseInt(validated.maxAttendees);
    }

    await Event.findByIdAndUpdate(eventId, updateData);

    revalidatePath('/');
    revalidatePath(`/events/${eventId}`);
    revalidatePath('/my-events');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // return { error: error.errors[0].message };
    }
    console.error('Update event error:', error);
    return { error: 'Failed to update event' };
  }
}

export async function deleteEventAction(eventId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return { error: 'You must be logged in to delete an event' };
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return { error: 'User not found' };
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return { error: 'Event not found' };
    }

    if (event.organizer.toString() !== user._id.toString()) {
      return { error: 'You are not authorized to delete this event' };
    }

    await Event.findByIdAndDelete(eventId);

    revalidatePath('/');
    revalidatePath('/my-events');
    return { success: true };
  } catch (error) {
    console.error('Delete event error:', error);
    return { error: 'Failed to delete event' };
  }
}

export async function joinEventAction(eventId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return { error: 'You must be logged in to join an event' };
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

      if (!user) {
      return { error: 'User not found' };
    }


    const event = await Event.findById(eventId);

    if (!event) {
      return { error: 'Event not found' };
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    if (event.attendees.some((id: string) => id.toString() === userId.toString())) {
      return { error: 'You are already registered for this event' };
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return { error: 'Event is full' };
    }

    await Event.findByIdAndUpdate(eventId, {
      $push: { attendees: userId },
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Join event error:', error);
    return { error: 'Failed to join event' };
  }
}

export async function leaveEventAction(eventId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return { error: 'You must be logged in to leave an event' };
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return { error: 'User not found' };
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return { error: 'Event not found' };
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    if (!event.attendees.some((id: string) => id.toString() === userId.toString())) {
      return { error: 'You are not registered for this event' };
    }

    await Event.findByIdAndUpdate(eventId, {
      $pull: { attendees: userId },
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Leave event error:', error);
    return { error: 'Failed to leave event' };
  }
}

export async function getAllEvents(filters?: {
  category?: string;
  search?: string;
}) {
  try {
    await connectDB();

    const query: any = { date: { $gte: new Date() } };

    if (filters?.category && filters.category !== 'all') {
      query.category = filters.category;
    }

    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { location: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .sort({ date: "ascending" })
      .populate('organizer', 'username email')


    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Get events error:', error);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    await connectDB();

    const event = await Event.findById(id)
      .populate('organizer', 'username email')
      .populate('attendees', 'username email')
      .lean();

    if (!event) {
      return null;
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error('Get event error:', error);
    return null;
  }
}

export async function getUserEvents(email: string) {
  try {
    await connectDB();

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      return null;
    }

     const userId = new mongoose.Types.ObjectId(user._id);

    const events = await Event.find({ organizer: userId })
      .sort({ date: -1 })
      .populate('organizer', 'username email')
      .lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Get user events error:', error);
    return [];
  }
}

export async function getUserAttendingEvents(email: string) {
  try {
    await connectDB();

    const user = await User.findOne({ email }).select('-password');   
     if (!user) {
      return null;
    }

    const userId = new mongoose.Types.ObjectId(user._id);


    const events = await Event.find({ 
      attendees: userId,
      date: { $gte: new Date() }
    })
      .sort({ date: 1 })
      .populate('organizer', 'username email')
      .lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Get attending events error:', error);
    return [];
  }
}
