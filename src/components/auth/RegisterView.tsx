'use client';

import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ThreeCanvas } from '@/components/landing/ThreeCanvas';
import { useIsMobile } from '@/hooks/use-mobile';
import { HomeButton } from './HomeButton';

export function RegisterView() {
  const isMobile = useIsMobile();
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <HomeButton />
      {!isMobile && (
        <>
          <div className="absolute inset-0 z-0 opacity-50">
            <Suspense fallback={<div className="bg-background w-full h-full" />}>
              <ThreeCanvas />
            </Suspense>
          </div>
          <div className="absolute inset-0 z-10 bg-background/40 backdrop-blur-sm"></div>
        </>
      )}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <RegisterForm />
      </div>
    </div>
  );
}
