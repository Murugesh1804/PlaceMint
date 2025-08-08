'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { analyticsAPI, applicationsAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { FileText, Building2, Calendar, TrendingUp, Target, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'

const applicationData = [
  { month: 'Jan', applications: 12, interviews: 3, offers: 1 },
  { month: 'Feb', applications: 18, interviews: 5, offers: 2 },
  { month: 'Mar', applications: 25, interviews: 8, offers: 3 },
  { month: 'Apr', applications: 22, interviews: 6, offers: 1 },
  { month: 'May', applications: 30, interviews: 10, offers: 4 },
  { month: 'Jun', applications: 28, interviews: 9, offers: 3 },
]

const statusData = [
  { name: 'Applied', value: 45, color: '#8B5CF6' },
  { name: 'In Review', value: 25, color: '#3B82F6' },
  { name: 'Interview', value: 15, color: '#10B981' },
  { name: 'Rejected', value: 12, color: '#EF4444' },
  { name: 'Offer', value: 3, color: '#F59E0B' },
]

const recentApplications = [
  {
    id: 1,
    company: 'Google',
    position: 'Software Engineer',
    status: 'Interview Scheduled',
    date: '2024-01-15',
    logo: '/placeholder.svg?height=40&width=40',
  },
  {
    id: 2,
    company: 'Microsoft',
    position: 'Product Manager',
    status: 'In Review',
    date: '2024-01-14',
    logo: '/placeholder.svg?height=40&width=40',
  },
  {
    id: 3,
    company: 'Amazon',
    position: 'Data Scientist',
    status: 'Applied',
    date: '2024-01-13',
    logo: '/placeholder.svg?height=40&width=40',
  },
  {
    id: 4,
    company: 'Meta',
    position: 'Frontend Developer',
    status: 'Rejected',
    date: '2024-01-12',
    logo: '/placeholder.svg?height=40&width=40',
  },
]

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [statusDistribution, setStatusDistribution] = useState<any[]>([])
  const [goals, setGoals] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          statsResponse,
          trendsResponse,
          statusResponse,
          goalsResponse,
          activityResponse
        ] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getTrends(),
          analyticsAPI.getStatusDistribution(),
          analyticsAPI.getMonthlyGoals(),
          analyticsAPI.getRecentActivity()
        ])

        setDashboardStats(statsResponse.data.data)
        setTrends(trendsResponse.data.data)
        setStatusDistribution(statusResponse.data.data)
        setGoals(goalsResponse.data.data)
        setRecentActivity(activityResponse.data.data)
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h1>
        <p className="text-purple-100">
          You have 3 upcoming interviews this week. Keep up the great work!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.totalApplications || 0}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-600">+{dashboardStats?.recentApplications || 0}</span> this month
        </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.uniqueCompanies || 0}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-600">+{dashboardStats?.recentApplications || 0}</span> new this month
        </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.totalInterviews || 0}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-blue-600">{dashboardStats?.upcomingInterviews || 0}</span> scheduled this week
        </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.successRate || 0}%</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-600">+{dashboardStats?.recentApplications || 0}</span> improvement
        </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>
              Your application activity over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#8B5CF6" />
                <Bar dataKey="interviews" fill="#3B82F6" />
                <Bar dataKey="offers" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Current status distribution of your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>
                Your latest job applications and their status
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={app.logo || "/placeholder.svg"}
                      alt={`${app.company} logo`}
                      className="w-10 h-10 rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium">{app.position}</h4>
                      <p className="text-sm text-gray-600">{app.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={
                        app.status === 'interview'
                          ? 'default'
                          : app.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {app.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(app.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals & Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Goals</CardTitle>
            <CardDescription>Track your application targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Applications</span>
                <span className="text-sm text-gray-600">
                  {goals?.progress?.applications?.current || 0}/{goals?.goals?.applications || 30}
                </span>
              </div>
              <Progress value={goals?.progress?.applications?.percentage || 0} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Interviews</span>
                <span className="text-sm text-gray-600">
                  {goals?.progress?.interviews?.current || 0}/{goals?.goals?.interviews || 10}
                </span>
              </div>
              <Progress value={goals?.progress?.interviews?.percentage || 0} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Offers</span>
                <span className="text-sm text-gray-600">
                  {goals?.progress?.offers?.current || 0}/{goals?.goals?.offers || 5}
                </span>
              </div>
              <Progress value={goals?.progress?.offers?.percentage || 0} className="h-2" />
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Set New Goal
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
