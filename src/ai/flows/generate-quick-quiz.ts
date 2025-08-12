'use server';

/**
 * @fileOverview A quick quiz generator AI agent.
 *
 * - generateQuickQuiz - A function that handles the quiz generation process.
 * - GenerateQuickQuizInput - The input type for the generateQuickQuiz function.
 * - GenerateQuickQuizOutput - The return type for the generateQuickQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuickQuizInputSchema = z.object({
  subject: z.string().describe('The subject of the quiz.'),
  topic: z.string().describe('The topic of the quiz.'),
});
export type GenerateQuickQuizInput = z.infer<typeof GenerateQuickQuizInputSchema>;

const GenerateQuickQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers to the question.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions, options and answers'),
});
export type GenerateQuickQuizOutput = z.infer<typeof GenerateQuickQuizOutputSchema>;

export async function generateQuickQuiz(input: GenerateQuickQuizInput): Promise<GenerateQuickQuizOutput> {
  return generateQuickQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuickQuizPrompt',
  input: {schema: GenerateQuickQuizInputSchema},
  output: {schema: GenerateQuickQuizOutputSchema},
  prompt: `Generate a 5-question multiple-choice quiz on the topic of "{{topic}}" from the subject "{{subject}}".

Ensure that the output is formatted as a JSON object that conforms to the following schema:

{
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string"
    },
   {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string"
    },
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string"
    },
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string"
    },
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string"
    }
  ]
}
`,
});

const generateQuickQuizFlow = ai.defineFlow(
  {
    name: 'generateQuickQuizFlow',
    inputSchema: GenerateQuickQuizInputSchema,
    outputSchema: GenerateQuickQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
