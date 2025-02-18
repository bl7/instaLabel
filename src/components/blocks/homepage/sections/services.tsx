import React from 'react';
import care from '@/assets/images/educate.jpeg';
import plans from '@/assets/images/educate.jpeg';
import deliver from '@/assets/images/educate.jpeg';
import alltime from '@/assets/images/educate.jpeg';
import dose from '@/assets/images/educate.jpeg';
import know from '@/assets/images/educate.jpeg';
import Image from 'next/image';

export const Services = () => {
  return (
    <section id='services' className=''>
      <div className='container py-24'>
        <div className='min-h-[50vh] w-full space-y-8'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl leading-tight tracking-tight sm:text-4xl '>
            Your Ultimate Labeling Solution for Kitchens
            </h2>
            <p className='mt-4 text-base sm:text-xl text-muted-foreground font-light'>
            InstaLabel is designed to streamline kitchen management, making it easier for restaurants to track expiry dates, allergens, and ingredient details. Here&apos;s how InstaLabel ensures your kitchen stays organized and efficient:
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            <div className='p-6 shadow-md rounded-lg space-y-5 text-pretty'>
              <p className='text-lg md:text-xl '>
              Smart Labeling, Simplified
              </p>
              <div className='h-56 w-full rounded-lg overflow-hidden'>
                <Image
                  placeholder='blur'
                  loading='lazy'
                  src={care}
                  alt=''
                  className='h-56 w-full object-cover rounded-lg hover:scale-125 duration-200'
                />
              </div>
              <p className='text-sm md:text-base font-light'>
              Easily create and print labels for ingredients and menu items directly from our app. Whether it&apos;s tracking expiry dates or ensuring allergen information is displayed correctly, InstaLabel provides a seamless solution for keeping your kitchen safe and compliant, whenever you need it.
              </p>
            </div>
            <div className='p-6 bg-primary/10 shadow-md rounded-lg space-y-5 text-pretty'>
              <p className='text-lg md:text-xl '>
              Affordable Plans for Every Kitchen
              </p>
              <div className='h-56 w-full rounded-lg overflow-hidden'>
                <Image
                  placeholder='blur'
                  loading='lazy'
                  src={plans}
                  alt=''
                  className='h-56 w-full object-cover rounded-lg hover:scale-125 duration-200'
                />
              </div>
              <p className='text-sm md:text-base font-light'>
              We offer a range of subscription plans to suit the needs of your kitchen, whether you&apos;re a small restaurant or a larger chain. Choose from flexible monthly plans or one-time solutions for specific needs, allowing you to easily manage costs while getting the most out of InstaLabel&apos;s features.
              </p>
            </div>
            <div className='p-6 shadow-md rounded-lg space-y-5 text-pretty'>
              <p className='text-lg md:text-xl '>
              Effortless Tracking, From Anywhere
              </p>
              <div className='h-56 w-full rounded-lg overflow-hidden'>
                <Image
                  placeholder='blur'
                  loading='lazy'
                  src={deliver}
                  alt=''
                  className='h-56 w-full object-cover rounded-lg hover:scale-125 duration-200'
                />
              </div>
              <p className='text-sm md:text-base font-light'>
              InstaLabel&apos;s web and mobile apps make it easy to manage your labels and ingredient lists, no matter where you are. Whether you&apos;re in the kitchen or on the go, InstaLabel keeps you updated in real time, allowing you to always know what&apos;s in your kitchen and when it&apos;s time to take action.
              </p>
            </div>
            <div className='p-6 bg-primary/10 shadow-md rounded-lg space-y-5 text-pretty'>
              <p className='text-lg md:text-xl '>Never Miss an Expiry Date</p>
              <div className='h-56 w-full rounded-lg overflow-hidden'>
                <Image
                  placeholder='blur'
                  loading='lazy'
                  src={dose}
                  alt=''
                  className='h-56 w-full object-cover rounded-lg hover:scale-125 duration-200'
                />{' '}
              </div>
              <p className='text-sm md:text-base font-light'>
              Effortlessly track ingredient expiry dates and allergen information with InstaLabel. Our automated label printing ensures you always have up-to-date details on your ingredients and menu items, helping your kitchen stay compliant and efficient. Never worry about missing a critical expiry again.
              </p>
            </div>
            <div className='p-6 shadow-md rounded-lg space-y-5 text-pretty'>
              <p className='text-lg md:text-xl '>
              24/7 Support for Your Kitchen Needs
              </p>
              <div className='h-56 w-full rounded-lg overflow-hidden'>
                <Image
                  placeholder='blur'
                  loading='lazy'
                  src={alltime}
                  alt=''
                  className='h-56 w-full object-cover rounded-lg hover:scale-125 duration-200'
                />
              </div>
              <p className='text-sm md:text-base font-light'>
              InstaLabel&apos;s support team is available around the clock to help with any questions or technical issues. Whether you need help with label printing, ingredient management, or app navigation, our experts are here to provide prompt assistance, ensuring your kitchen runs smoothly at all times.
                journey.
              </p>
            </div>
            <div className='p-6 bg-primary/10 shadow-md rounded-lg space-y-5 text-pretty'>
              <p className='text-lg md:text-xl '>
              Stay Ahead with Smart Kitchen Management
              </p>
              <div className='h-56 w-full rounded-lg overflow-hidden'>
                <Image
                  placeholder='blur'
                  loading='lazy'
                  src={know}
                  alt=''
                  className='h-56 w-full object-cover rounded-lg hover:scale-125 duration-200'
                />
              </div>
              <p className='text-sm md:text-base font-light'>
              At InstaLabel, we believe that informed kitchens make better decisions. Access our library of resources and tips to optimize your labeling process, understand ingredient safety, and stay compliant with food safety regulations. Our tools help you take control of your kitchen&apos;s efficiency, reducing waste and improving customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
