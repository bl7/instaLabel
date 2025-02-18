import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export const AboutHero = () => {
  return (
    <section>
      <div className='container relative h-full'>
        <div className='absolute -z-0 isolate top-0 left-0 h-80 w-80 bg-emerald-400 scale-125 p-6 rounded-full opacity-15 blur-3xl' />
        <div className='absolute -z-0 isolate -bottom-32 -right-20 h-96 w-96 bg-emerald-600 p-6 rounded-full opacity-15 blur-3xl' />
        <div className='absolute -z-0 isolate top-[30%] left-[40%] h-96 w-96 bg-amber-300 scale-150 p-6 rounded-full opacity-15 blur-3xl' />
        <div className='relative w-full min-h-[500px] py-24 flex items-center flex-wrap-reverse md:flex-nowrap justify-center lg:justify-between text-pretty '>
          <div className='flex flex-col items-start justify-center'>
            <p className='text-center md:text-start max-w-2xl mb-4'></p>
            <h1 className='text-4xl md:text-5xl lg:text-6xl text-center md:text-start max-w-4xl'>
              <span className='hidden lg:contents text-primary font-accent font-semibold'>
              InstaLabel:{' '}
              </span>
              Your Kitchen’s Smart Labeling Solution
            </h1>
            <p className='text-center md:text-start max-w-4xl mt-4 text-base sm:text-xl text-muted-foreground font-light'>
            At InstaLabel, we are committed to transforming the way kitchens manage ingredient safety and labeling. We believe every kitchen—big or small—deserves an easy, reliable, and efficient solution to track expiry dates, allergens, and food safety details.
            </p>
            <div className='w-full flex gap-4 mt-8 items-center justify-center md:justify-start'>
              <Button
                asChild
                size={'lg'}
                variant={'outline'}
                className='rounded-full text-lg group bg-transparent'>
                <a
                  href='/#services'
                  className='flex items-center gap-4 justify-between'>
                  Learn More
                  <ArrowRight className='group-hover:ml-2 duration-200' />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
