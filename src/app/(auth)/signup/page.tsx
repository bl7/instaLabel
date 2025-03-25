import { SignupForm } from "./form"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  return (
    <section className="container flex min-h-screen items-center justify-center px-4 py-8 md:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center">
          <div className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Image
              src="/logo.png"
              width={48}
              height={48}
              alt="logo"
              className="aspect-square size-8 shrink-0"
            />
          </div>
        </div>
        <SignupForm />
      </div>
    </section>
  )
} 