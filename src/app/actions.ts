'use server';

import { z } from 'zod';
import { generateStudyPlan, GenerateStudyPlanInput } from '@/ai/flows/generate-study-plan';
import { generateQuickQuiz, GenerateQuickQuizInput } from '@/ai/flows/generate-quick-quiz';

const studyPlanSchema = z.object({
  course: z.string(),
  hours: z.coerce.number().min(1),
  subjects: z.string().optional(),
});

export async function generateStudyPlanAction(formData: FormData) {
  const rawData = {
    course: formData.get('course'),
    hours: formData.get('hours'),
    subjects: formData.get('subjects'),
  };

  const validation = studyPlanSchema.safeParse(rawData);

  if (!validation.success) {
    return { success: false, error: 'Invalid input data.' };
  }
  
  try {
    const result = await generateStudyPlan(validation.data as GenerateStudyPlanInput);
    return { success: true, data: result.studyPlan };
  } catch (error) {
    console.error('Study Plan Generation Error:', error);
    return { success: false, error: 'Failed to generate study plan. Please try again.' };
  }
}

const quizSchema = z.object({
  subject: z.string(),
  topic: z.string().min(3),
});

export async function generateQuickQuizAction(formData: FormData) {
  const rawData = {
    subject: formData.get('subject'),
    topic: formData.get('topic'),
  };

  const validation = quizSchema.safeParse(rawData);

  if (!validation.success) {
    return { success: false, error: 'Invalid input data.' };
  }

  try {
    const result = await generateQuickQuiz(validation.data as GenerateQuickQuizInput);
    return { success: true, data: result };
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    return { success: false, error: 'Failed to generate quiz. Please try again.' };
  }
}
