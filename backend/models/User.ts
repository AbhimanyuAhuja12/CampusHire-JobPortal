export interface User {
    id?: number
    name: string
    email: string
    password: string
    role: "student" | "admin"
    college: string
    is_approved: boolean
    profile_picture?: string
    created_at?: string
    updated_at?: string
  }
  
  export interface CreateUserData {
    name: string
    email: string
    password: string
    role: "student" | "admin"
    college: string
  }
  
  export interface UpdateUserData {
    name?: string
    email?: string
    college?: string
    profile_picture?: string
  }
  
  export interface LoginCredentials {
    email: string
    password: string
    role: "student" | "admin"
  }
  