'use server';

import { revalidatePath } from 'next/cache';
import { adminUpdateUserSteps } from '@/lib/db';

export async function handleAdminUpdate(formData: FormData) {
  try {
    const userId = formData.get('userId') as string;
    const day = Number(formData.get('day'));
    const steps = Number(formData.get('steps'));

    if (!userId || !day || isNaN(steps)) {
      throw new Error('Invalid input data.');
    }

    await adminUpdateUserSteps(userId, day, steps);

    revalidatePath('/admin');
    revalidatePath('/leaderboard');
    revalidatePath('/dashboard'); // In case the admin is also a participant

    return { success: true, message: `Successfully updated steps for Day ${day}.` };
  } catch (error: any) {
    console.error('Admin update failed:', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}
