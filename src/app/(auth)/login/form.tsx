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
import { API_ENDPOINTS } from "@/lib/config"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

const loginFormSchema = z.object({
  email: z.string().email({ message: "Input must me a valid email" }),
  password: z.string().refine((val) => val.length >= 8, "Input must be at least 8 characters long"),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      setIsLoading(true)
      console.log('Attempting to login with:', values)
      console.log('Request URL:', API_ENDPOINTS.auth.login)

      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
        credentials: 'include',
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers))

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.message || `Login failed with status ${response.status}`)
      }

      // Store only the token
      localStorage.setItem('token', data.token)
      console.log('Stored token:', data.token)

      toast.success('Login successful')
      console.log('Redirecting to dashboard...')
      router.replace('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast.error('Unable to connect to the server. Please check if the server is running.')
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to login')
      }
    } finally {
      setIsLoading(false)
    }
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
        <Button className="mt-4 w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Continue"}
        </Button>
        {/* <div className="flex items-center justify-center py-4">
          <hr className="w-full" />
          <p className="absolute rounded-full bg-background p-1 text-lg leading-none text-muted-foreground">
            or
          </p>
        </div>
        <Button className="w-full gap-2" variant="outline">
          Continue with Google
          <FcGoogle className="size-5" />
        </Button> */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <p className="text-sm text-muted-foreground">Don&apos;t have an account?</p>
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
