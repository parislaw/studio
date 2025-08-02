'use server';

import { detectImageManipulation } from '@/ai/flows/detect-image-manipulation';
import { verifyStepImage } from '@/ai/flows/verify-step-image';

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

    // In a real app, you would save this to a database and revalidate the path
    // e.g., await db.saveStepSubmission({ userId, ...verification });
    // revalidatePath('/dashboard');
    
    return { ...verification, ...manipulation };

  } catch (error) {
    console.error('Error in submitStep action:', error);
    return { error: 'An error occurred during AI verification.' };
  }
}
