'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from './api'

interface User {
  _id: string
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await authAPI.getMe()
      if (response.data.success) {
        setUser(response.data.data)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Auth context: Making login request...')
      const response = await authAPI.login({ email, password })
      console.log('Auth context: Login response:', response.data)
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        setUser(response.data.data)
        console.log('Auth context: User set, token stored')
        return true
      }
      console.log('Auth context: Login response not successful')
      return false
    } catch (error) {
      console.error('Auth context: Login failed:', error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.register({ name, email, password })
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        setUser(response.data.data)
        return true
      }
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
