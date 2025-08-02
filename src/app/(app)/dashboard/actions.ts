'use server';

import { revalidatePath } from 'next/cache';
import { detectImageManipulation } from '@/ai/flows/detect-image-manipulation';
import { verifyStepImage } from '@/ai/flows/verify-step-image';
import { addStepRecord } from '@/lib/db';
import { MOCK_CURRENT_USER } from '@/lib/mock-data'; // Will be replaced by auth

export async function submitStep(photoDataUri: string) {
  try {
    const [verification, manipulation] = await Promise.all([
      verifyStepImage({ photoDataUri }),
      detectImageManipulation({ photoDataUri }),
    ]);

    if (manipulation.isManipulated && manipulation.confidence > 0.7) {
      return { 
        error: 'Image manipulation detected.',
        ...verification,
        ...manipulation
      };
    }
    
    if (verification.fraudProbability > 0.6) {
      return {
          error: 'High probability of fraud detected.',
          ...verification,
          ...manipulation
      }
    }

    if (verification.stepCount !== undefined) {
      const today = new Date().getDate(); // Simplified for mock data
      const newProgress = {
        day: today,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        steps: verification.stepCount,
        goalMet: verification.stepCount >= 10000,
        image: photoDataUri,
      };
      
      // In a real app, you would get the user ID from the session
      const userId = MOCK_CURRENT_USER.id;
      await addStepRecord(userId, newProgress);

      revalidatePath('/dashboard');
      revalidatePath('/leaderboard');
    }
    
    return { ...verification, ...manipulation };

  } catch (error) {
    console.error('Error in submitStep action:', error);
    return { error: 'An error occurred during AI verification.' };
  }
}
