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
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { authService } from "@/lib/services/authService"

const companyLookupSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
})

export function CompanyLookupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof companyLookupSchema>>({
    resolver: zodResolver(companyLookupSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof companyLookupSchema>) {
    try {
      setIsLoading(true)
      
      // Look up the company by email
      const tenant = await authService.getTenantByEmail(values.email)
      
      if (tenant) {
        // Store the tenant ID and name in session storage for the next step
        sessionStorage.setItem('loginTenantId', tenant._id)
        sessionStorage.setItem('loginTenantName', tenant.name)
        
        // Show success message
        toast.success(`Found company: ${tenant.name}`)
        
        // Redirect to the login form
        router.push('/login/credentials')
      } else {
        toast.error('No company found with this email. Please check your email or register.')
      }
    } catch (error) {
      console.error('Company lookup error:', error)
      
      // Handle specific error cases
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast.error('Unable to connect to the server. Please check if the server is running.')
      } else if (error instanceof Error) {
        // Check for specific error messages from the server
        if (error.message.includes('Invalid company data')) {
          toast.error('Invalid company data received. Please try again.')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('Failed to find company. Please try again.')
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
              <FormLabel>Company Email</FormLabel>
              <FormControl>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="company@example.com" 
                  className="w-full" 
                  disabled={isLoading}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={isLoading}>
          {isLoading ? "Looking up company..." : "Continue"}
        </Button>
        <div className="mt-6 flex items-center justify-end gap-2">
          <p className="text-sm text-muted-foreground">Don't have a company account?</p>
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