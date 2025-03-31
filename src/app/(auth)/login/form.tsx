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
import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { authService } from "@/lib/services/authService"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'lookup' | 'login'>('lookup')
  const [tenantName, setTenantName] = useState("")

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const findTenant = useCallback(async () => {
    const email = form.getValues("email")
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    try {
      setIsLoading(true)
      const tenant = await authService.getTenantByEmail(email)
      console.log(tenant)
      setTenantName(tenant.name || 'Your company')
      setStep('login')
      toast.success(`Found company: ${tenant.name || 'Your company'}`)
    } catch (error) {
      console.error('Error finding tenant:', error)
      toast.error('No company associated with this email')
    } finally {
      setIsLoading(false)
    }
  }, [form])

  const onSubmit = useCallback(async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true)
      const response = await authService.login(values)
      console.log(response)

      // Store token and user data
      if (response.token) {
        router.push('/dashboard')
        toast.success('Login successful')
      }

    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }, [router])
  return (
    <Form {...form}>
      <form className="w-full max-w-lg space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Step 1: Lookup Tenant */}
        {step === 'lookup' && (
          <>
            <div className="text-xl font-semibold text-center mb-6">
              {tenantName ? `Find your company within ${tenantName}` : "Enter your company email"}
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
          </>
        )}
  
        {/* Step 2: Login after tenant is found */}
        {step === 'login' && (
          <>
            <div className="text-xl font-semibold text-center mb-6">
              {tenantName ? `Sign in to ${tenantName}` : "Company not found. Try again."}
            </div>
  
            {/* Request User's Email within the Company */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email within {tenantName}</FormLabel>
                  <FormControl>
                    <Input 
                      id="userEmail" 
                      type="email"
                      placeholder="your.email@company.com" 
                      className="w-full" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            {/* Request Password */}
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
  
            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <Link
                className="text-sm font-medium text-primary hover:underline hover:underline-offset-2"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
          </>
        )}
  
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {/* Back Button (Only for Step 2) */}
          {step === 'login' && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep('lookup')}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
  
          {/* Submit Button */}
          <Button 
            type={step === 'lookup' ? 'button' : 'submit'} 
            className="flex-1" 
            disabled={isLoading}
            onClick={step === 'lookup' ? findTenant : undefined}
          >
            {isLoading ? "Processing..." : step === 'lookup' ? "Find Company" : "Sign In"}
          </Button>
        </div>
  
        {/* Register Link */}
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