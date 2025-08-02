'use server';

/**
 * @fileOverview This file defines a Genkit flow for verifying the step count in an image using AI.
 *
 * - verifyStepImage - A function that takes an image and returns the verified step count and fraud probability.
 * - VerifyStepImageInput - The input type for the verifyStepImage function.
 * - VerifyStepImageOutput - The return type for the verifyStepImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyStepImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo containing step count information, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyStepImageInput = z.infer<typeof VerifyStepImageInputSchema>;

const VerifyStepImageOutputSchema = z.object({
  stepCount: z.number().describe('The verified step count from the image.'),
  fraudProbability: z
    .number()
    .describe(
      'The probability (0 to 1) that the image has been manipulated or the step count is inaccurate.'
    ),
});
export type VerifyStepImageOutput = z.infer<typeof VerifyStepImageOutputSchema>;

export async function verifyStepImage(
  input: VerifyStepImageInput
): Promise<VerifyStepImageOutput> {
  return verifyStepImageFlow(input);
}

const verifyStepImagePrompt = ai.definePrompt({
  name: 'verifyStepImagePrompt',
  input: {schema: VerifyStepImageInputSchema},
  output: {schema: VerifyStepImageOutputSchema},
  prompt: `You are an AI assistant specialized in verifying step counts from images and detecting potential fraud.

  Analyze the image provided and extract the step count. Also, assess the likelihood that the image has been manipulated or the step count is inaccurate. Provide a fraud probability score between 0 and 1, where 0 indicates no fraud and 1 indicates a high probability of fraud.

  Image: {{media url=photoDataUri}}
  `,
});

const verifyStepImageFlow = ai.defineFlow(
  {
    name: 'verifyStepImageFlow',
    inputSchema: VerifyStepImageInputSchema,
    outputSchema: VerifyStepImageOutputSchema,
  },
  async input => {
    const {output} = await verifyStepImagePrompt(input);
    return output!;
  }
);
