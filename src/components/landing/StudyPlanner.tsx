'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateStudyPlanAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const planSchema = z.object({
  course: z.string().min(1, 'Please select a course.'),
  hours: z.coerce.number().min(1, 'Please enter a valid number of hours.').max(100, 'Hours must be 100 or less.'),
  subjects: z.string().optional(),
});

type PlanFormValues = z.infer<typeof planSchema>;

export function StudyPlanner() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      course: '',
      hours: 15,
      subjects: '',
    },
  });

  const onSubmit = (data: PlanFormValues) => {
    const formData = new FormData();
    formData.append('course', data.course);
    formData.append('hours', String(data.hours));
    formData.append('subjects', data.subjects || '');

    startTransition(async () => {
      const result = await generateStudyPlanAction(formData);
      if (result.success && result.data) {
        setStudyPlan(result.data);
        setIsModalOpen(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>✨ Personalized Study Planner</CardTitle>
          <CardDescription>
            Get a custom study plan tailored to your needs. Just tell us your goals and we'll map out a schedule for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="plan-course">Select Course</Label>
               <Select onValueChange={(value) => form.setValue('course', value)} defaultValue={form.getValues('course')}>
                <SelectTrigger id="plan-course">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JEE Preparation">JEE Preparation</SelectItem>
                  <SelectItem value="Class 10 ICSE">Class 10 ICSE</SelectItem>
                  <SelectItem value="Class 10 CBSE">Class 10 CBSE</SelectItem>
                  <SelectItem value="Class 9 ICSE">Class 9 ICSE</SelectItem>
                  <SelectItem value="Class 9 CBSE">Class 9 CBSE</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.course && <p className="text-sm text-destructive">{form.formState.errors.course.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-hours">Weekly Study Hours</Label>
              <Input id="plan-hours" type="number" placeholder="e.g., 15" {...form.register('hours')} />
              {form.formState.errors.hours && <p className="text-sm text-destructive">{form.formState.errors.hours.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-subjects">Tough Subjects (optional)</Label>
              <Input id="plan-subjects" placeholder="e.g., Physics, Organic Chemistry" {...form.register('subjects')} />
            </div>
            <Button type="submit" className="w-full text-lg py-6" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : 'Generate My Study Plan'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Your Personalized Study Plan</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] my-4">
             <div className="text-gray-700 whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
                {studyPlan}
             </div>
          </ScrollArea>
           <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
