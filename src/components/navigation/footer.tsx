import React from 'react';
import Link from 'next/link';
import { Logo } from '@/assets/jsx/logo';
import playstore from '@/assets/icons/playstore.svg';
import appstore from '@/assets/icons/appstore.svg';
import {
  FaLinkedin,
  FaFacebook,
  FaXTwitter,
  FaInstagram,
} from 'react-icons/fa6';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className='border-t border-primary/50 border-dashed bg-primary/20'>
      <div className='container py-12'>
        <div className='flex gap-12 flex-wrap justify-between'>
          <div className='flex flex-col gap-2 w-full xl:max-w-fit'>
            <div className='flex gap-2 items-center'>
              <Logo className='h-12 w-12 [&>path]:fill-primary' />
              <h2 className='text-primary text-3xl font-semibold font-accent tracking-tighter'>
                InstaLabel
              </h2>
            </div>
            <div className='max-w-lg'>
              <p className='text-muted-foreground text-pretty'>
              Efficient Kitchen Labeling for Food Safety and Inventory Management
              </p>
            </div>
            <div className='flex flex-col gap-4 pt-4'>
              <p className='font-medium text-xl text-primary'>
                Download our app
              </p>
              <div className='flex gap-2 justify-start items-center'>
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
          <div className='space-y-4'>
            <p className='font-medium text-primary'>Information</p>
            <nav className='flex flex-col gap-2  text-muted-foreground'>
              <Link href={'/'}>Home</Link>
              <Link href={'/services'}>Services</Link>
              <Link href={'/about'}>About</Link>
              <Link href={'/contact'}>Contact</Link>
            </nav>
          </div>
          <div className='space-y-4'>
            <p className='font-medium text-primary'>Useful Links</p>
            <nav className='flex flex-col gap-2  text-muted-foreground'>
              <Link href={'/'}>Privacy Policy</Link>
              <Link href={'/services'}>Terms Of Service</Link>
              <Link href={'/about'}>Support</Link>
              <Link href={'/contact'}>FAQs</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-4 sm:items-end '>
            <p className='font-medium text-primary'>Useful Links</p>
            <nav className='flex flex-col gap-2 sm:items-end text-muted-foreground'>
              <Link href={'/'}>Bournemouth, England</Link>
              <Link href={'mailto:contact@kuruwa.com'}>contact@instalabel.com</Link>
              <Link href={'tel:+9779855011772'}>+44 7405924790</Link>
              <Link href={'tel:+9779851175495'}>+44 7509876500</Link>
            </nav>
            <p className='font-medium text-primary'>Follow Us On</p>
            <div className='flex gap-4 '>
              <Link href={''} target='_blank'>
                <FaXTwitter className='h-6 w-6 text-primary hover:text-black duration-200' />
              </Link>
              <Link href={''} target='_blank'>
                <FaInstagram className='h-6 w-6 text-primary hover:text-pink-600 duration-200' />
              </Link>
              <Link href={''} target='_blank'>
                <FaFacebook className='h-6 w-6 text-primary hover:text-blue-600 duration-200' />
              </Link>
              <Link href={''} target='_blank'>
                <FaLinkedin className='h-6 w-6 text-primary hover:text-sky-600 duration-200' />
              </Link>
            </div>
          </div>
        </div>
        <div className='text-center text-sm text-muted-foreground pt-12'>
          <p className=''>
            Copyright &copy; {new Date().getFullYear()} Kuruwa. All Rights
            Reserved | Design by{' '}
            <Link
              target='_blank'
              className='text-primary'
              href={'https:/www.nischaltimalsina.com.np'}>
              Nischal Timalsina
            </Link>
          </p>
        </div>
      </div>
      {/* <div className='container py-8'>
        <div className='pb-8'>
          <div className='flex justify-between items-center flex-wrap sm:flex-nowrap gap-4'>
            <div className='flex gap-2 items-center justify-center w-full sm:justify-start'>
              <Logo className='h-12 w-12' />
              <h2 className='text-primary text-3xl font-semibold font-accent tracking-tighter'>
                Kuruwa
              </h2>
            </div>
            <nav className='flex gap-7 items-center justify-center w-full sm:justify-end'>
              <Link href={'/'}>Home</Link>
              <Link href={'/services'}>Services</Link>
              <Link href={'/about'}>About</Link>
              <Link href={'/contact'}>Contact</Link>
            </nav>
          </div>
          <div className='flex gap-6 py-6 justify-between items-start flex-wrap sm:flex-nowrap'>
            <div className='flex flex-col w-full gap-2 items-center sm:items-start'>
              <p className='font-medium text-lg text-primary'>
                Download the Kuruwa App
              </p>
              <div className='flex gap-2 justify-start items-center'>
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
            <div className='w-full flex flex-col gap-2 items-center sm:items-end'>
              <p className='text-lg font-medium text-primary'>Follow Us On</p>
              <div className='flex gap-4 '>
                <Link href={''} target='_blank'>
                  <FaXTwitter className='h-6 w-6 text-primary hover:text-black duration-200' />
                </Link>
                <Link href={''} target='_blank'>
                  <FaInstagram className='h-6 w-6 text-primary hover:text-pink-600 duration-200' />
                </Link>
                <Link href={''} target='_blank'>
                  <FaFacebook className='h-6 w-6 text-primary hover:text-blue-600 duration-200' />
                </Link>
                <Link href={''} target='_blank'>
                  <FaLinkedin className='h-6 w-6 text-primary hover:text-sky-600 duration-200' />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='text-center text-sm md:text-base'>
          <p className=''>
            Copyright &copy; {new Date().getFullYear()} Kuruwa. All Rights
            Reserved | Design by{' '}
            <Link
              target='_blank'
              className='text-primary'
              href={'https:/www.nischaltimalsina.com.np'}>
              Nischal Timalsina
            </Link>
          </p>
        </div>
      </div> */}
    </footer>
  );
};
