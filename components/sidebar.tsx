"use client"

import { ClipboardList, Settings, HelpCircle, ChevronLeft, Bot, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SidebarProps {
  user?: { username: string } | null
  onLogout?: () => void
}

const navItems = [
  { icon: ClipboardList, label: "Claims", active: true },
  { icon: Settings, label: "Settings", active: false },
  { icon: HelpCircle, label: "Help", active: false },
]

export function Sidebar({ user, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const getUserInitials = (username: string) => {
    const parts = username.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return username.slice(0, 2).toUpperCase()
  }

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-56",
      )}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground text-sm">Claim Resolution Agent</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          <ChevronLeft
            className={cn("w-4 h-4 text-sidebar-foreground transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              item.active
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && user && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
              {getUserInitials(user.username)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">RCM Specialist</p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-foreground"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  )
}
