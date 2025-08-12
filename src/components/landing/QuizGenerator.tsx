'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateQuickQuizAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { GenerateQuickQuizOutput } from '@/ai/flows/generate-quick-quiz';
import { ScrollArea } from '../ui/scroll-area';

const quizSchema = z.object({
  subject: z.string().min(1, 'Please select a subject.'),
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
});

type QuizFormValues = z.infer<typeof quizSchema>;

type ShuffledQuiz = {
  question: string;
  options: string[];
  answer: string;
}

export function QuizGenerator() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [quizData, setQuizData] = useState<GenerateQuickQuizOutput | null>(null);
  const [shuffledQuiz, setShuffledQuiz] = useState<ShuffledQuiz[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: { subject: 'Physics', topic: '' },
  });

  useEffect(() => {
    if (quizData) {
      const newShuffledQuiz = quizData.quiz.map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));
      setShuffledQuiz(newShuffledQuiz);
    }
  }, [quizData]);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitQuiz = () => {
    if (!quizData) return;
    let newScore = 0;
    quizData.quiz.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        newScore++;
      }
    });
    setScore(newScore);
  };

  const resetQuiz = () => {
    setQuizData(null);
    setShuffledQuiz([]);
    setUserAnswers({});
    setScore(null);
    // Do not reset form values here to allow for retries
  };
  
  const startNewQuiz = () => {
     resetQuiz();
     setIsModalOpen(false);
     form.reset({ subject: 'Physics', topic: '' });
  }

  const onSubmit = (data: QuizFormValues) => {
    resetQuiz();
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('topic', data.topic);

    startTransition(async () => {
      const result = await generateQuickQuizAction(formData);
      if (result.success && result.data) {
        setQuizData(result.data);
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
          <CardTitle>✨ Quick Quiz Generator</CardTitle>
          <CardDescription>
            Test your knowledge with a quick, AI-generated quiz on any topic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="quiz-subject">Select Subject</Label>
              <Select onValueChange={(value) => form.setValue('subject', value)} defaultValue={form.getValues('subject')}>
                <SelectTrigger id="quiz-subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-topic">Enter Topic</Label>
              <Input id="quiz-topic" placeholder="e.g., Newton's Laws of Motion" {...form.register('topic')} />
              {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
            </div>
            <Button type="submit" className="w-full text-lg py-6 mt-[2.3rem]" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : 'Generate a Quick Quiz'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) startNewQuiz(); else setIsModalOpen(open);}}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Quick Quiz: {form.getValues('topic')}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] my-4 pr-4">
            {shuffledQuiz.map((q, index) => (
              <div key={index} className="mb-6">
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  className="mt-2 space-y-2"
                  disabled={score !== null}
                >
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex} className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${score !== null ? (option === quizData?.quiz[index].answer ? 'bg-green-100' : userAnswers[index] === option ? 'bg-red-100' : '') : ''}`}>
                      <RadioGroupItem value={option} id={`q${index}-opt${optIndex}`} />
                      <Label htmlFor={`q${index}-opt${optIndex}`} className="cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </ScrollArea>
          {score !== null && (
            <div className="mt-4 text-center font-bold text-xl p-4 bg-primary/10 rounded-md">
              You scored {score} out of {quizData?.quiz.length}!
            </div>
          )}
          <div className="flex gap-2 justify-end">
            {score === null ? (
              <Button onClick={handleSubmitQuiz} className="w-full">
                Submit Answers
              </Button>
            ) : (
               <Button onClick={startNewQuiz} className="w-full">
                Start New Quiz
              </Button>
            )}
             <DialogClose asChild>
                <Button variant="secondary">Close</Button>
             </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
