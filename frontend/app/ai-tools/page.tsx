'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { aiAPI } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { 
  FileText, 
  Brain, 
  MessageSquare, 
  Target, 
  Sparkles, 
  Copy, 
  Download,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState('cover-letter')
  const [loading, setLoading] = useState(false)
  const [coverLetterData, setCoverLetterData] = useState({
    companyName: '',
    positionTitle: '',
    jobDescription: '',
    userExperience: ''
  })
  const [resumeData, setResumeData] = useState({
    resumeContent: '',
    jobDescription: ''
  })
  const [interviewData, setInterviewData] = useState({
    companyName: '',
    positionTitle: '',
    interviewType: 'general'
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const { toast } = useToast()

  const handleCoverLetterGeneration = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await aiAPI.generateCoverLetter(coverLetterData)
      setGeneratedContent(response.data.data.coverLetter)
      setWordCount(response.data.data.wordCount)
      toast({
        title: 'Success',
        description: 'Cover letter generated successfully!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate cover letter',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResumeAnalysis = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await aiAPI.analyzeResume(resumeData)
      setGeneratedContent(response.data.data.analysis)
      setWordCount(response.data.data.wordCount)
      toast({
        title: 'Success',
        description: 'Resume analysis completed!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to analyze resume',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInterviewPrep = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await aiAPI.getInterviewPrep(interviewData)
      setGeneratedContent(response.data.data.interviewPrep)
      setWordCount(response.data.data.interviewPrep.split(' ').length)
      toast({
        title: 'Success',
        description: 'Interview prep materials generated!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate interview prep',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard',
    })
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI Tools</h1>
        <p className="text-gray-600">Leverage AI to enhance your job search</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Tools */}
        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
            </TabsList>

            <TabsContent value="cover-letter" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Cover Letter Generator</span>
                  </CardTitle>
                  <CardDescription>
                    Generate personalized cover letters using AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCoverLetterGeneration} className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={coverLetterData.companyName}
                        onChange={(e) => setCoverLetterData({...coverLetterData, companyName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="positionTitle">Position Title</Label>
                      <Input
                        id="positionTitle"
                        value={coverLetterData.positionTitle}
                        onChange={(e) => setCoverLetterData({...coverLetterData, positionTitle: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobDescription">Job Description</Label>
                      <Textarea
                        id="jobDescription"
                        value={coverLetterData.jobDescription}
                        onChange={(e) => setCoverLetterData({...coverLetterData, jobDescription: e.target.value})}
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="userExperience">Your Experience (Optional)</Label>
                      <Textarea
                        id="userExperience"
                        value={coverLetterData.userExperience}
                        onChange={(e) => setCoverLetterData({...coverLetterData, userExperience: e.target.value})}
                        rows={3}
                        placeholder="Briefly describe your relevant experience..."
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Cover Letter
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resume" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Resume Analyzer</span>
                  </CardTitle>
                  <CardDescription>
                    Get AI-powered feedback on your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResumeAnalysis} className="space-y-4">
                    <div>
                      <Label htmlFor="resumeContent">Resume Content</Label>
                      <Textarea
                        id="resumeContent"
                        value={resumeData.resumeContent}
                        onChange={(e) => setResumeData({...resumeData, resumeContent: e.target.value})}
                        rows={8}
                        required
                        placeholder="Paste your resume content here..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetJobDescription">Target Job Description (Optional)</Label>
                      <Textarea
                        id="targetJobDescription"
                        value={resumeData.jobDescription}
                        onChange={(e) => setResumeData({...resumeData, jobDescription: e.target.value})}
                        rows={4}
                        placeholder="Paste the job description to get targeted feedback..."
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze Resume
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Interview Prep</span>
                  </CardTitle>
                  <CardDescription>
                    Generate interview preparation materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInterviewPrep} className="space-y-4">
                    <div>
                      <Label htmlFor="interviewCompanyName">Company Name</Label>
                      <Input
                        id="interviewCompanyName"
                        value={interviewData.companyName}
                        onChange={(e) => setInterviewData({...interviewData, companyName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="interviewPositionTitle">Position Title</Label>
                      <Input
                        id="interviewPositionTitle"
                        value={interviewData.positionTitle}
                        onChange={(e) => setInterviewData({...interviewData, positionTitle: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="interviewType">Interview Type</Label>
                      <Select 
                        value={interviewData.interviewType} 
                        onValueChange={(value) => setInterviewData({...interviewData, interviewType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="behavioral">Behavioral</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="onsite">Onsite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Generate Prep Materials
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Generated Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>
                    {activeTab === 'cover-letter' && 'Your AI-generated cover letter'}
                    {activeTab === 'resume' && 'Resume analysis and recommendations'}
                    {activeTab === 'interview' && 'Interview preparation materials'}
                  </CardDescription>
                </div>
                {generatedContent && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {wordCount} words
                    </Badge>
                    <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedContent}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to generate content
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form on the left and click generate to create your content.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Cover Letter Generator</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Generate personalized cover letters tailored to specific job descriptions and companies.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Professional tone</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Company-specific content</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">ATS-optimized</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Resume Analyzer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Get detailed feedback and improvement suggestions for your resume.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Content analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Format recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Skills gap analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span>Interview Prep</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Prepare for interviews with company-specific questions and tips.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Company research</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Common questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Follow-up templates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
