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
import { useState } from "react"
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
  const [tenantEmail, setTenantEmail] = useState("")
  const [tenantName, setTenantName] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function findTenant() {
    const email = form.getValues("email")
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    try {
      setIsLoading(true)
      const tenant = await authService.getTenantByEmail(email)
      setTenantEmail(email)
      setCompanyEmail(email)
      setTenantName(tenant.name || 'Your company')
      setStep('login')
      toast.success(`Found company: ${tenant.name || 'Your company'}`)
    } catch (error) {
      console.error('Error finding tenant:', error)
      toast.error('We could not find a company associated with this email')
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true)
      const response = await authService.login(values)
      
      // Store token and user data
      if (response.token) {
        localStorage.setItem('token', response.token)
        if (response.user) localStorage.setItem('user', JSON.stringify(response.user))
        if (response.tenant) localStorage.setItem('tenant', JSON.stringify(response.tenant))
      }
      
      toast.success('Login successful')
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form className="w-full max-w-lg space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {step === 'login' && (
          <div className="text-xl font-semibold text-center mb-6">
            {tenantName}
          </div>
        )}
        
        {step === 'lookup' && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="email@example.com" 
                      className="w-full" 
                      {...field} 
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={findTenant}
                    disabled={isLoading}
                  >
                    Find
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {step === 'login' && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="your.email@company.com" 
                      className="w-full" 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground mt-1">
                    Enter your email address within {tenantName}
                  </div>
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
          </>
        )}
        
        <div className="flex space-x-2">
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
          <Button 
            type={step === 'lookup' ? 'button' : 'submit'} 
            className="flex-1" 
            disabled={isLoading}
            onClick={step === 'lookup' ? findTenant : undefined}
          >
            {isLoading ? "Processing..." : step === 'lookup' ? "Find Company" : "Sign in"}
          </Button>
        </div>
        
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
