"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FolderTree, 
  CreditCard,
  LogOut,
  Utensils,
  ListTree,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    name?: string
    email: string
  }
  onLogout: () => void
}

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Allergens",
    href: "/dashboard/allergens",
    icon: AlertTriangle,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: FolderTree,
  },
  {
    name: "Menu Item Categories",
    href: "/dashboard/menu-item-categories",
    icon: ListTree,
  },
  {
    name: "Subscription",
    href: "/dashboard/subscription",
    icon: CreditCard,
  },
  {
    name: 'Ingredients',
    href: '/dashboard/ingredients',
    icon: Utensils,
  },
]

export function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden border-r bg-background lg:block lg:w-64">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">InstaLabel</h2>
          </div>
          <ScrollArea className="flex-1">
            <nav className="space-y-1 p-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name || user.email}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  )
} 