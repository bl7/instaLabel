import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import playstore from '@/assets/icons/playstore.svg';
import appstore from '@/assets/icons/appstore.svg';
import { Button } from '@/components/ui';
import { ArrowRightIcon } from 'lucide-react';

export const CTA = () => {
  return (
    <section className='bg-primary/10'>
      <div className='flex flex-col lg:flex-row gap-x-12 gap-y-8 w-full container items-center py-20'>
        <div className='lg:basis-1/2'>
          <h3 className='text-3xl sm:text-4xl text-pretty text-center lg:text-start'>
          Ready to unlock a safer, more efficient kitchen?
          </h3>
        </div>
        <div className='lg:basis-1/2 flex flex-col'>
          <p className='sm:text-lg font-light max-w-2xl text-center lg:text-start mt-4'>
            Learn More about our subscription plans and pricing options to find
            the perfect fit for your needs.
          </p>
          <div className='w-full max-w-2xl flex justify-center lg:justify-start'>

              <Button
                size={'lg'}
                asChild
                variant='outline'
                className='border-primary bg-transparent rounded-full text-lg sm:text-xl font-light w-full sm:w-fit h-12 gap-4 mt-3'>
                <a
                  href='/about#contact'
                  className='flex gap-4 items-center justify-between'>
                  Get in Touch
                  <ArrowRightIcon className='h-6 w-6' />
                </a>
              </Button>

          </div>
        </div>
      </div>
    </section>
  );
};
