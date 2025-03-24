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

const registerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email({ message: "Input must be a valid email" }),
  password: z.string().refine((val) => val.length >= 8, "Input must be at least 8 characters long"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      setIsLoading(true)
      // Remove confirmPassword and add subscriptionPlan
      const { confirmPassword, ...registerData } = values
      const userData = {
        ...registerData,
        subscriptionPlan: 'Free',
      }
      
      console.log('Attempting to register with:', userData)
      console.log('Request URL:', API_ENDPOINTS.auth.register)
      
      const response = await fetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      })

      // Log the response status and headers
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers))

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Error response:', errorData)
        throw new Error(errorData?.message || `Registration failed with status ${response.status}`)
      }

      const data = await response.json()
      console.log('Success response:', data)

      toast.success('Registration successful')
      router.push('/login')
    } catch (error) {
      console.error('Registration error:', error)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast.error('Unable to connect to the server. Please check if the server is running.')
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to register')
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input id="name" placeholder="John Doe" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                Password must be at least 8 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm password"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Label className="font-normal text-muted-foreground">
          By creating an account, you agree to our{" "}
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
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
        <div className="mt-6 flex items-center justify-end gap-2">
          <p className="text-sm text-muted-foreground">Already have an account?</p>
          <Link
            className="text-sm font-medium text-primary hover:underline hover:underline-offset-2"
            href="/login"
          >
            Sign In
          </Link>
        </div>
      </form>
    </Form>
  )
}
