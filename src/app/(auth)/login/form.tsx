"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import React from "react"
import { useForm } from "react-hook-form"
import { FcGoogle } from "react-icons/fc"
import { z } from "zod"

const loginFormSchema = z.object({
  email: z.string().email({ message: "Input must me a valid email" }),
  password: z.string().refine((val) => val.length >= 8, "Input must be at least 8 characters long"),
})
export function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values)
  }
  return (
    <Form {...form}>
      <form className="w-full max-w-lg space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input id="email" placeholder="email@example.com" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput id="password" placeholder="Password" className="w-full" {...field} />
              </FormControl>
              <FormDescription className={cn(form.formState.errors.password && "hidden")}>
                Password must be at least 8 characters long, contain one uppercase and one special
                character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end py-2">
          <Link
            className="text-sm text-primary hover:underline hover:underline-offset-2"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <Label className="font-normal text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link className="text-primary hover:underline hover:underline-offset-2" href="/terms">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className="text-primary hover:underline hover:underline-offset-2" href="/privacy">
            Privacy Policy
          </Link>
          .
        </Label>
        <Button className="mt-4 w-full">Continue</Button>
        <div className="flex items-center justify-center py-4">
          <hr className="w-full" />
          <p className="absolute rounded-full bg-background p-1 text-lg leading-none text-muted-foreground">
            or
          </p>
        </div>
        <Button className="w-full gap-2" variant="outline">
          Continue with Google
          <FcGoogle className="size-5" />
        </Button>
        <div className="mt-6 flex items-center justify-end gap-2">
          <p className="text-sm text-muted-foreground">Don't have an account?</p>
          <Link
            className="text-sm font-medium text-primary hover:underline hover:underline-offset-2"
            href="/register"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </Form>
  )
}
