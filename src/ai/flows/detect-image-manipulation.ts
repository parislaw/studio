'use server';

/**
 * @fileOverview An AI agent to detect image manipulation.
 *
 * - detectImageManipulation - A function that detects manipulation in an image.
 * - DetectImageManipulationInput - The input type for the detectImageManipulation function.
 * - DetectImageManipulationOutput - The return type for the detectImageManipulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectImageManipulationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be checked for manipulation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectImageManipulationInput = z.infer<typeof DetectImageManipulationInputSchema>;

const DetectImageManipulationOutputSchema = z.object({
  isManipulated: z
    .boolean()
    .describe('Whether the image has been manipulated or not.'),
  confidence: z
    .number()
    .describe(
      'The confidence level of the AI in determining if the image has been manipulated, from 0 to 1.'
    ),
  explanation: z
    .string()
    .describe('The explanation of why the AI thinks the image was manipulated.'),
});
export type DetectImageManipulationOutput = z.infer<typeof DetectImageManipulationOutputSchema>;

export async function detectImageManipulation(
  input: DetectImageManipulationInput
): Promise<DetectImageManipulationOutput> {
  return detectImageManipulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectImageManipulationPrompt',
  input: {schema: DetectImageManipulationInputSchema},
  output: {schema: DetectImageManipulationOutputSchema},
  prompt: `You are an expert in analyzing images for manipulation.

You are given a photo, and your job is to determine if it has been manipulated in any way.

You must return a JSON object with the following fields:
- isManipulated: true if the image has been manipulated, false otherwise.
- confidence: the confidence level of the AI in determining if the image has been manipulated, from 0 to 1.
- explanation: the explanation of why the AI thinks the image was manipulated.

Here is the photo: {{media url=photoDataUri}}`,
});

const detectImageManipulationFlow = ai.defineFlow(
  {
    name: 'detectImageManipulationFlow',
    inputSchema: DetectImageManipulationInputSchema,
    outputSchema: DetectImageManipulationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
