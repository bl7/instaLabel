import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui';
import { cn } from '@/lib/utils';

export const Header = () => {
  return (
    <header className='sticky -top-16 md:top-0 bg-white/20 backdrop-blur-lg z-20'>
      <div className='container py-2.5 sm:py-6 gap-12 flex justify-between items-center'>
        <h2 className='text-primary text-3xl font-semibold font-accent tracking-tighter'>
          instalabel
        </h2>
        <nav className='hidden md:flex gap-7 items-center '>
          <Link href={'/'}>Home</Link>
          <Link href={'/#services'}>Services</Link>
          <Link href={'/about'}>About</Link>
          <Link href={'/about#contact'}>Contact</Link>
        </nav>
        <div className='flex gap-2  ml-auto'>
          <Link href={'/login'} className={cn(buttonVariants({ variant: 'default', size:"sm" }), "text-base rounded-full")}>
            Sign In
          </Link>
          <Link href={'/register'}
            className={cn(buttonVariants({ variant: 'ghost', size:"sm" }), "text-base rounded-full")}>
            Register
          </Link>
        </div>
      </div>
      <div className='container md:hidden border-y py-4 '>
        <nav className='flex gap-5 items-center justify-center'>
          <Link href={'/'}>Home</Link>
          <Link href={'/#services'}>Services</Link>
          <Link href={'/about'}>About</Link>
          <Link href={'/about#contact'}>Contact</Link>
        </nav>
      </div>
    </header>
  );
};
