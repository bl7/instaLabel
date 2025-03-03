import { Button } from "@/components/ui"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import React from "react"
import instaLabel from "@/assets/images/instaLabel.png"

export const Hero = () => {
  return (
    <section className="">
      <div className="container relative h-full">
        <div className="absolute left-0 top-0 isolate -z-0 h-80 w-80 scale-125 rounded-full bg-violet-400 p-6 opacity-15 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-0 h-96 w-96 rounded-full bg-violet-600 p-6 opacity-15 blur-3xl" />
        <div className="absolute left-[40%] top-[30%] isolate -z-0 h-96 w-96 scale-150 rounded-full bg-pink-300 p-6 opacity-15 blur-3xl" />
        <div className="relative flex min-h-[750px] w-full flex-wrap-reverse items-center justify-center text-pretty py-24 md:flex-nowrap lg:justify-between">
          <div className="min-w-80">
            <Image
              src={instaLabel}
              alt=""
              className="h-full w-full duration-300 ease-linear md:hover:-rotate-6 md:hover:scale-[1.15]"
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <p className="mb-4 max-w-2xl text-center md:text-start"></p>
            <h1 className="max-w-4xl text-center text-4xl md:text-start md:text-5xl lg:text-6xl">
              <span className="hidden font-accent font-semibold text-primary lg:contents">
                InstaLabel:{" "}
              </span>
              Efficient Kitchen Labeling for Food Safety and Inventory Management
            </h1>
            <p className="mt-4 max-w-4xl text-center text-base font-light text-muted-foreground sm:text-xl md:text-start">
              Streamline your kitchen operations with Label. It&apos;s comprehensive labeling
              solution for food safety compliance, inventory tracking, and efficiency.
            </p>
            <div className="mt-8 flex w-full items-center justify-center gap-4 md:justify-start">
              <Button
                size={"lg"}
                asChild
                variant={"outline"}
                className="group items-center gap-4 rounded-full bg-transparent text-lg"
              >
                <a href="#services">
                  Get Started Today
                  <ArrowRight className="duration-200 group-hover:ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
