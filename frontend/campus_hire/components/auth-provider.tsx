"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type UserRole = "student" | "admin"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  college: string
  isApproved?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  college: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // useEffect(() => {
  //   // Check for stored auth token
  //   const token = localStorage.getItem("auth-token")
  //   const userData = localStorage.getItem("user-data")

  //   if (token && userData) {
  //     setUser(JSON.parse(userData))
  //   }
  //   setLoading(false)
  // }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true)
    try {
      // API call to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()

      localStorage.setItem("auth-token", data.token)
      localStorage.setItem("user-data", JSON.stringify(data.user))
      setUser(data.user)

      router.push(role === "admin" ? "/admin" : "/dashboard")
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    try {
      // API call to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const result = await response.json()

      localStorage.setItem("auth-token", result.token)
      localStorage.setItem("user-data", JSON.stringify(result.user))
      setUser(result.user)

      router.push(data.role === "admin" ? "/admin" : "/dashboard")
    } catch (error) {
      throw new Error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-data")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
