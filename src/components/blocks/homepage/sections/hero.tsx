import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import instaLabel from '@/assets/images/instaLabel.png';

export const Hero = () => {
  return (
    <section className=''>
      <div className='container relative h-full'>
        <div className='absolute -z-0 isolate top-0 left-0 h-80 w-80 bg-emerald-400 scale-125 p-6 rounded-full opacity-15 blur-3xl' />
        <div className='absolute -z-0 isolate -bottom-32 -right-20 h-96 w-96 bg-emerald-600 p-6 rounded-full opacity-15 blur-3xl' />
        <div className='absolute -z-0 isolate top-[30%] left-[40%] h-96 w-96 bg-amber-300 scale-150 p-6 rounded-full opacity-15 blur-3xl' />
        <div className='relative w-full min-h-[750px] py-24 flex items-center flex-wrap-reverse md:flex-nowrap justify-center lg:justify-between text-pretty '>
          <div className=' min-w-80'>
            <Image
              src={instaLabel}
              alt=''
              className='h-full w-full md:hover:scale-[1.15]  md:hover:-rotate-6 duration-300 ease-linear'
            />
          </div>
          <div className='flex flex-col items-start justify-center'>
            <p className='text-center md:text-start max-w-2xl mb-4'></p>
            <h1 className='text-4xl md:text-5xl lg:text-6xl text-center md:text-start max-w-4xl'>
              <span className='hidden lg:contents text-primary font-accent font-semibold'>
                InstaLabel:{' '}
              </span>
              Efficient Kitchen Labeling for Food Safety and Inventory Management
            </h1>
            <p className='text-center md:text-start max-w-4xl mt-4 text-base sm:text-xl text-muted-foreground font-light'>
            Streamline your kitchen operations with LabelIt’s comprehensive labeling solution for food safety compliance, inventory tracking, and efficiency.
            </p>
            <div className='w-full flex gap-4 mt-8 items-center justify-center md:justify-start'>
              <Button
                size={'lg'}
                asChild
                variant={'outline'}
                className='rounded-full text-lg gap-4 group items-center bg-transparent'>
                <a href='#services'>
                Get Started Today
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
