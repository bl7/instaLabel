import Image from 'next/image';
import React from 'react';
import cleanKitchen from '@/assets/images/instaLabel.png';

export const Features = () => {
  return (
    <section className='py-24'>
      <div className='container px-4 lg:px-8'>
        <div className='min-h-[600px] w-full space-y-8'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl leading-tight tracking-tight sm:text-4xl '>
            Your All-in-One Kitchen Labeling Solution
            </h2>
            <p className='mt-4 text-base sm:text-xl text-muted-foreground font-light'>
            Whether you’re managing ingredients, tracking inventory, or ensuring food safety compliance, LabelIt is here to optimize your kitchen operations.
            </p>
          </div>

          <div className='flex gap-12 h-fit items-center justify-center flex-wrap lg:flex-nowrap'>
            <Image src={cleanKitchen} alt='Instalabel Services' className='' />
            <div className='text-center lg:text-start text-balance lg:text-pretty lg:max-w-xl space-y-4'>
              <p className='text-xl md:text-2xl '>
              Smart Printing, Inventory Tracking, Compliance Assurance, Kitchen Analytics
              </p>
              <p className='md:text-lg font-light'>
              LabelIt connects you with an intuitive, streamlined labeling system that enhances food safety and &apos;  inventory management.
              </p>
              <p className='md:text-lg font-light'>
              With automated {' '}
                <strong className='font-medium'>
                compliance tracking, real-time updates, and easy-to-use labeling tools,
                </strong>{' '}
                LabelIt ensures your kitchen operations are running smoothly.
              </p>
              <p className='md:text-lg font-light'>
              Focus on running your kitchen efficiently, not on managing compliance. 
              Our platform simplifies the process, giving you the tools you need to stay compliant and organized with ease.
              </p>
            </div>
          </div>
          {/* <div className='flex justify-center flex-wrap'>
            <div className='basis-full mb-3 text-center'>
              <p className='text-2xl'>How to book a instaLabel?</p>
            </div>
            <div className='basis-full sm:basis-1/2 md:basis-1/3 pt-3 flex xl:basis-1/5 pr-3'>
              <div className='px-5 py-3 border w-full rounded-lg'>
                <p className='text-lg font-semibold'>Step 1</p>
                <p className=''>Open instaLabel App</p>
              </div>
            </div>
            <div className='basis-full sm:basis-1/2 md:basis-1/3 pt-3 flex xl:basis-1/5 pr-3'>
              <div className='px-5 py-3 border w-full rounded-lg '>
                <p className='text-lg font-semibold'>Step 1</p>
                <p className=''>Select your Hospital</p>
              </div>
            </div>
            <div className='basis-full sm:basis-1/2 md:basis-1/3 pt-3 flex xl:basis-1/5 pr-3'>
              <div className='px-5 py-3 border w-full rounded-lg '>
                <p className='text-lg font-semibold'>Step 1</p>
                <p className=''>Select the Dates and Time</p>
              </div>
            </div>
            <div className='basis-full sm:basis-1/2 md:basis-1/3 pt-3 flex xl:basis-1/5 pr-3'>
              <div className='px-5 py-3 border w-full rounded-lg '>
                <p className='text-lg font-semibold'>Step 1</p>
                <p className=''>Confirm Booking and Payment</p>
              </div>
            </div>
            <div className='basis-full sm:basis-1/2 md:basis-1/3 pt-3 flex xl:basis-1/5'>
              <div className='px-5 py-3 border w-full rounded-lg '>
                <p className='text-lg font-semibold'>Step 1</p>
                <p className=''>
                  Congratulations, your instaLabel will arrive shortly.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};
