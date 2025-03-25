"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { authService } from "@/lib/services/authService"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, "Password is required"),
})

export function CredentialsLoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tenantName, setTenantName] = useState<string>("")
  
  useEffect(() => {
    // Check if we have a tenant ID from the previous step
    const tenantId = sessionStorage.getItem('loginTenantId')
    const tenantName = sessionStorage.getItem('loginTenantName')
    
    if (!tenantId || !tenantName) {
      // If no tenant ID, redirect back to company lookup
      router.push('/login')
    } else {
      setTenantName(tenantName)
    }
  }, [router])
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true)
      
      // Get the tenant ID from session storage
      const tenantId = sessionStorage.getItem('loginTenantId')
      if (!tenantId) {
        throw new Error('No company selected. Please start over.')
      }
      
      // Attempt to login
      const response = await authService.login({
        ...values,
        tenantId
      })
      
      // Clear the session storage
      sessionStorage.removeItem('loginTenantId')
      sessionStorage.removeItem('loginTenantName')
      
      toast.success('Login successful! Redirecting to dashboard...')
      router.push('/dashboard')
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Login to {tenantName}</h2>
          <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="email@example.com" 
                  className="w-full" 
                  {...field} 
                />
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
                <PasswordInput 
                  id="password" 
                  placeholder="Enter your password" 
                  className="w-full" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center justify-between">
          <Link
            className="text-sm font-medium text-primary hover:underline hover:underline-offset-2"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        
        <Button className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        
        <div className="mt-6 flex items-center justify-end gap-2">
          <p className="text-sm text-muted-foreground">Don't have an account?</p>
          <Link
            className="text-sm font-medium text-primary hover:underline hover:underline-offset-2"
            href="/register"
          >
            Register
          </Link>
        </div>
      </form>
    </Form>
  )
} 