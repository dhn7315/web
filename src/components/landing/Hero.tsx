'use client';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { ThreeCanvas } from './ThreeCanvas';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const exams = [
  { text: 'KCET', color: 'text-cyan-400' },
  { text: 'JEE', color: 'text-green-400' },
  { text: 'KVPY', color: 'text-yellow-400' },
  { text: 'NEET', color: 'text-pink-500' },
  { text: 'OLYMPIADS', color: 'text-purple-400' },
];

const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      ease: 'easeInOut',
      duration: 0.3
    }
  },
};

export function Hero() {
  const [examIndex, setExamIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      setExamIndex((prevIndex) => (prevIndex + 1) % exams.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section id="hero" className="relative bg-gray-900 overflow-hidden">
      {!isMobile && (
        <>
          <div className="absolute inset-0 z-0 opacity-50">
            <Suspense fallback={<div className="bg-gray-900 w-full h-full" />}>
              <ThreeCanvas />
            </Suspense>
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-gray-900/30 to-gray-900"></div>
        </>
      )}
      <div className="relative z-20 container mx-auto px-6 pt-40 md:pt-56 pb-20 text-center flex flex-col items-center">
        <h1 
          className="text-4xl md:text-7xl font-extrabold leading-tight mb-4 text-white"
        >
          Aiming for{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={exams[examIndex].text}
              variants={textVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`inline-block ${exams[examIndex].color}`}
            >
              {exams[examIndex].text}?
            </motion.span>
          </AnimatePresence>
        </h1>
        <motion.p 
          className="text-lg md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto font-bold"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.5 }}
        >
          Start your journey with <span className="text-orange-500">GCC</span>
        </motion.p>
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 1 }}
        >
            <Button asChild size="lg" className="text-lg font-bold rounded-full px-8 py-6">
                <Link href="#courses">
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5"/>
                </Link>
            </Button>
        </motion.div>
      </div>
    </section>
  );
}
