
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Helper function to format the course name for display
function formatCourseName(course: string) {
  if (!course) return "Quiz";
  return course
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export function QuizView({ course }: { course: string }) {
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    setCourseName(formatCourseName(course));
  }, [course]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background text-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-foreground">
            {courseName} Quiz
          </CardTitle>
          <CardDescription>
            This quiz has not been assigned yet. Please check back later.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
            <p className="text-muted-foreground mb-8">
              In the future, an AI-generated quiz will appear here.
            </p>
            <Button asChild>
                <Link href="/#ai-tools">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to AI Tools
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
