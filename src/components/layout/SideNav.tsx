"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard, 
  Utensils, 
  List, 
  Settings,
  LogOut
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Menu Items",
    icon: Utensils,
    href: "/dashboard/menu-items",
  },
  {
    label: "Ingredients",
    icon: List,
    href: "/dashboard/ingredients",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-[200px] flex-col border-r bg-background">
      <div className="p-6">
        <h1 className="text-lg font-semibold">InstaLabel</h1>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-x-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
} 