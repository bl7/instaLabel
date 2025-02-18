import React from 'react';
import { Button } from '@/components/ui';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import playstore from '@/assets/icons/playstore.svg';
import appstore from '@/assets/icons/appstore.svg';
import Image from 'next/image';

export const Download = () => {
  return (
    <section className='w-full py-12 bg-primary/20 border-y border-primary border-dashed'>
      <div className='container'>
        <div className='flex flex-wrap lg:flex-nowrap gap-12 items-center'>
          {/* <div className='basis-full lg:basis-1/2 flex flex-col items-start'>
            <p className='text-2xl md:text-3xl font-medium'>
              The Kuruwa Difference
            </p>
            <p className='mt-2 text-base sm:text-xl text-muted-foreground font-light'>
              Live life to the fullest with a care ecosystem that adapts to you.
            </p>
            <ul className='mt-8 space-y-2 text-start'>
              <li>
                <strong>Simplified Care: </strong>
                Manage all your healthcare needs through our user-friendly app.
              </li>
              <li>
                <strong>Reduced Stress: </strong>
                Find peace of mind knowing you have a dedicated support system
                in place.
              </li>
              <li>
                <strong>Empowerment: </strong>
                Gain the knowledge and resources to manage your health with
                confidence.
              </li>
              <li>
                <strong>Convenience: </strong>
                Access a variety of services at your fingertips, whenever you
                need them.
              </li>
              <li>
                <strong>Flexibility: </strong>
                Customize your care plan to fit your unique needs and budget.
              </li>
            </ul>
          </div> */}
          <div className='basis-full flex flex-col items-center justify-center'>
            <p className='text-lg sm:text-xl font-medium '>
              Download the App to explore our services and connect with the care
              you deserve.
            </p>
            <div className='flex gap-2 justify-start items-center mt-4'>
              <Link href={''} className=''>
                <Image
                  src={playstore}
                  alt='Google Playstore'
                  className='h-12 w-fit'
                />
              </Link>
              <Link href={''} className=''>
                <Image
                  src={appstore}
                  alt='Google Playstore'
                  className='h-12 w-fit'
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
