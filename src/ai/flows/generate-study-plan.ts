// This file is machine-generated - edit with care!
'use server';

/**
 * @fileOverview Generates a personalized study plan based on user inputs.
 *
 * - generateStudyPlan - A function that generates a study plan.
 * - GenerateStudyPlanInput - The input type for the generateStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generateStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyPlanInputSchema = z.object({
  course: z.string().describe('The course for which the study plan is being generated (e.g., JEE Preparation, Class 10 ICSE).'),
  hours: z.number().describe('The number of hours per week the student can dedicate to studying.'),
  subjects: z.string().describe('A comma-separated list of tough subjects for the student (optional).'),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const GenerateStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('A detailed weekly study plan, broken down day-by-day, with time allocated for each subject, revision, and practice tests.'),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}

const generateStudyPlanPrompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {schema: GenerateStudyPlanInputSchema},
  output: {schema: GenerateStudyPlanOutputSchema},
  prompt: `Create a detailed weekly study plan for a student preparing for {{{course}}}. They can study for {{hours}} hours a week. Their self-identified tough subjects are: {{subjects}}. Break down the plan day-by-day (Monday to Sunday), allocating time for each subject, including revision, and practice tests. The tone should be encouraging and motivational. Format the output clearly with headings for each day.`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await generateStudyPlanPrompt(input);
    return output!;
  }
);
