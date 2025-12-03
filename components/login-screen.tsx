"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Lock, User, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"

interface LoginScreenProps {
  onLogin: (username: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim()) {
      setError("Please enter your username")
      return
    }

    if (!password.trim()) {
      setError("Please enter your password")
      return
    }

    setIsLoading(true)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation - accept any non-empty credentials
    if (username.trim() && password.trim()) {
      onLogin(username.trim())
    } else {
      setError("Invalid credentials. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Claim Resolution Agent</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError(null)
                  }}
                  className="pl-10 bg-secondary/50 border-border h-11"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(null)
                  }}
                  className="pl-10 pr-10 bg-secondary/50 border-border h-11"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full h-11 text-base gap-2 mt-6">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
