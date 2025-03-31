import React from "react"
import { LoginForm } from "./form"
import Link from "next/link"
import Image from "next/image"

function getTimeOfDayGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default function LoginPage() {
  return (
    <section className="flex h-full w-full flex-col justify-between py-12 min-h-fit">
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
          <h2 className="text-3xl font-semibold text-primary">instalabel</h2>
        </div>
      </div>
      <div>
        <div className="mt-6">
          <p className="text-3xl font-medium text-muted-foreground">
            {getTimeOfDayGreeting()}, Welcome Back
          </p>
          <p className="text-lg text-muted-foreground">Please login to your account to continue</p>
        </div>
        <div className="mt-6 w-full">
          <LoginForm />
        </div>
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        Copyright © 2023 - current. <Link href="/">InstaLabel Pvt. Ltd.</Link> All rights reserved.
      </div>
    </section>
  )
}
