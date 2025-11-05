'use server';

import connectDB from '../db';
import User from '@/app/models/user.model';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export async function updateProfileAction(formData: FormData) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { error: 'You must be logged in to update your profile' };
    }

    const data = {
      username: formData.get('username') as string,
      bio: formData.get('bio') as string,
    };

    const validated = ProfileSchema.parse(data);

    await connectDB();

    const existingUser = await User.findOne({
      username: validated.username,
      _id: { $ne: session.user.id },
    });

    if (existingUser) {
      return { error: 'Username already taken' };
    }

    await User.findByIdAndUpdate(session.user.id, {
      username: validated.username,
      bio: validated.bio || '',
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // return { error: error.errors[0].message };
    }
    console.error('Update profile error:', error);
    return { error: 'Failed to update profile' };
  }
}

export async function getUserProfile(email: string) {
  try {
    await connectDB();

    const user = await User.findOne({ email }).select('-password').lean();

    if (!user) {
      return null;
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}