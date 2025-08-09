'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import api, { authAPI, handleApiError } from '@/lib/api'

export default function TestApiPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>({})
  const { toast } = useToast()

  const testHealthCheck = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/health')
      setTestResults(prev => ({ ...prev, health: response.data }))
      toast({
        title: 'Success',
        description: 'Health check passed!',
      })
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, health: { error: handleApiError(error) } }))
      toast({
        title: 'Error',
        description: 'Health check failed!',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testRegister = async () => {
    setIsLoading(true)
    try {
      const response = await authAPI.register({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'test123456'
      })
      setTestResults(prev => ({ ...prev, register: response.data }))
      toast({
        title: 'Success',
        description: 'Registration test passed!',
      })
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, register: { error: handleApiError(error) } }))
      toast({
        title: 'Error',
        description: 'Registration test failed!',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testLogin = async () => {
    setIsLoading(true)
    try {
      const response = await authAPI.login({
        email: 'admin@example.com',
        password: 'admin123'
      })
      setTestResults(prev => ({ ...prev, login: response.data }))
      toast({
        title: 'Success',
        description: 'Login test passed!',
      })
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, login: { error: handleApiError(error) } }))
      toast({
        title: 'Error',
        description: 'Login test failed!',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Connection Test</h1>
          <p className="text-gray-600">Test the connection between frontend and backend</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Health Check</CardTitle>
              <CardDescription>Test if backend is running</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testHealthCheck} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Health'}
              </Button>
              {testResults.health && (
                <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(testResults.health, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Register Test</CardTitle>
              <CardDescription>Test user registration</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testRegister} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Register'}
              </Button>
              {testResults.register && (
                <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(testResults.register, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login Test</CardTitle>
              <CardDescription>Test admin login</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testLogin} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Login'}
              </Button>
              {testResults.login && (
                <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(testResults.login, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Current API settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
