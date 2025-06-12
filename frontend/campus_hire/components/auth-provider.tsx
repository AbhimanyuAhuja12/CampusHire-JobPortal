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
  is_approved?: boolean
  profile_picture?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  token: string | null
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  college: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // useEffect(() => {
  //   // Check for stored auth token on mount
  //   const storedToken = localStorage.getItem("auth-token")
  //   const userData = localStorage.getItem("user-data")

  //   if (storedToken && userData) {
  //     setToken(storedToken)
  //     setUser(JSON.parse(userData))
  //     // Verify token is still valid
  //     verifyToken(storedToken)
  //   }
  //   setLoading(false)
  // }, [])

  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        // Token is invalid, clear storage
        logout()
        return
      }

      const data = await response.json()
      setUser(data.data.user)
    } catch (error) {
      console.error("Token verification failed:", error)
      logout()
    }
  }

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      const { user: userData, token: authToken } = data.data

      localStorage.setItem("auth-token", authToken)
      localStorage.setItem("user-data", JSON.stringify(userData))
      setToken(authToken)
      setUser(userData)

      // Redirect based on role
      if (userData.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Registration failed")
      }

      const { user: userData, token: authToken } = result.data

      localStorage.setItem("auth-token", authToken)
      localStorage.setItem("user-data", JSON.stringify(userData))
      setToken(authToken)
      setUser(userData)

      // Redirect based on role
      if (userData.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      throw new Error(error.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-data")
    setToken(null)
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, token }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// API helper function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("auth-token")

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "API call failed")
  }

  return data
}
