import React from "react"
import { ForgotPasswordForm } from "./form"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
  function getTimeOfDayGreeting() {
    const currentHour = new Date().getHours()

    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning"
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon"
    } else if (currentHour >= 18 && currentHour < 22) {
      return "Good evening"
    } else {
      return "Good night"
    }
  }

  return (
    <section className="flex h-full w-full flex-col justify-between py-12">
      <div className="flex justify-between">
        <div className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Image
            src="/logo.png"
            width={48}
            height={48}
            alt="logo"
            className="aspect-square size-8 shrink-0"
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-primary">Kuruwa</h2>
          <h4 className="-mt-2 text-end text-sm font-light text-muted-foreground/80">
            By <span className="font-medium">Vitacre</span>
          </h4>
        </div>
      </div>
      <div>
        <div className="mt-6">
          <p className="text-3xl font-medium text-muted-foreground">
            Forgot Password? Let Us Help.
          </p>
          <p className="text-lg text-muted-foreground">Please enter your email to continue</p>
        </div>
        <div className="mt-6 w-full">
          <ForgotPasswordForm />
        </div>{" "}
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        Copyright © 2023 - current. <Link href="/">Vitacre Pvt. Ltd.</Link> All rights reserved.
      </div>
    </section>
  )
}
