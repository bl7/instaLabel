import Marquee from '@/lib/marqee';
import React from 'react';

export const FeaturesScroll = () => {
  return (
    <section className='border-y border-dashed border-primary'>
      <div className=' flex justify-between gap-12 py-4 text-xl font-light'>
        <Marquee speed={60} pauseOnHover className='cursor-pointer'>
          <p className=' flex gap-2 items-center leading-none whitespace-nowrap text-primary px-8 py-4'>
          Smart Printing
          </p>
          <p className=' flex gap-2 items-center leading-none whitespace-nowrap px-8 py-4'>
            Subscription plans
          </p>
          <p className=' flex gap-2 items-center leading-none whitespace-nowrap px-8 py-4'>
          Inventory Tracking
          </p>
          <p className=' flex gap-2 items-center leading-none whitespace-nowrap px-8 py-4'>
          Compliance Assurance
          </p>
          <p className=' flex gap-2 items-center leading-none whitespace-nowrap px-8 py-4'>
          Kitchen Analytics
          </p>
        </Marquee>
      </div>
    </section>
  );
};

