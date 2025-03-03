import React from "react"
import Link from "next/link"
import { Logo } from "@/assets/jsx/logo"
import playstore from "@/assets/icons/playstore.svg"
import appstore from "@/assets/icons/appstore.svg"
import { FaLinkedin, FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6"
import Image from "next/image"

export const Footer = () => {
  return (
    <footer className="border-t border-dashed border-primary/50 bg-primary/20">
      <div className="container py-12">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex w-full flex-col gap-2 xl:max-w-fit">
            <div className="flex items-center gap-2">
              <Logo className="h-12 w-12 [&>path]:fill-primary" />
              <h2 className="font-accent text-3xl font-semibold tracking-tighter text-primary">
                InstaLabel
              </h2>
            </div>
            <div className="max-w-lg">
              <p className="text-pretty text-muted-foreground">
                Efficient Kitchen Labeling for Food Safety and Inventory Management
              </p>
            </div>
            <div className="flex flex-col gap-4 pt-4">
              <p className="text-xl font-medium text-primary">Download our app</p>
              <div className="flex items-center justify-start gap-2">
                <Link href={""} className="">
                  <Image src={playstore} alt="Google Playstore" className="h-12 w-fit" />
                </Link>
                <Link href={""} className="">
                  <Image src={appstore} alt="Google Playstore" className="h-12 w-fit" />
                </Link>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="font-medium text-primary">Information</p>
            <nav className="flex flex-col gap-2 text-muted-foreground">
              <Link href={"/"}>Home</Link>
              <Link href={"/services"}>Services</Link>
              <Link href={"/about"}>About</Link>
              <Link href={"/contact"}>Contact</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <p className="font-medium text-primary">Useful Links</p>
            <nav className="flex flex-col gap-2 text-muted-foreground">
              <Link href={"#"}>Blog</Link>
              <Link href={"/privacy-policy"}>Privacy Policy</Link>
              <Link href={"/cookie-policy"}>Cookie Policy</Link>
              <Link href={"/terms"}>Terms Of Service</Link>
              <Link href={"/faqs"}>FAQs</Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4 sm:items-end">
            <p className="font-medium text-primary">Useful Links</p>
            <nav className="flex flex-col gap-2 text-muted-foreground sm:items-end">
              <Link href={"/"}>Bournemouth, England</Link>
              <Link href={"mailto:contact@instalabel.co"}>contact@instalabel.co</Link>
              <Link href={"tel:+9779855011772"}>+44 7405924790</Link>
              <Link href={"tel:+9779851175495"}>+44 7509876500</Link>
            </nav>
            <p className="font-medium text-primary">Follow Us On</p>
            <div className="flex gap-4">
              <Link href={""} target="_blank">
                <FaXTwitter className="h-6 w-6 text-primary duration-200 hover:text-black" />
              </Link>
              <Link href={""} target="_blank">
                <FaInstagram className="h-6 w-6 text-primary duration-200 hover:text-pink-600" />
              </Link>
              <Link href={""} target="_blank">
                <FaFacebook className="h-6 w-6 text-primary duration-200 hover:text-blue-600" />
              </Link>
              <Link href={""} target="_blank">
                <FaLinkedin className="h-6 w-6 text-primary duration-200 hover:text-sky-600" />
              </Link>
            </div>
          </div>
        </div>
        <div className="pt-12 text-center text-sm text-muted-foreground">
          <p className="">
            Copyright &copy; {new Date().getFullYear()} instaLabel. All Rights Reserved | Design by{" "}
            <Link
              target="_blank"
              className="text-primary"
              href={"https:/www.nischaltimalsina.com.np"}
            >
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
                instaLabel
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
                Download the instaLabel App
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
            Copyright &copy; {new Date().getFullYear()} instaLabel. All Rights
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
  )
}
