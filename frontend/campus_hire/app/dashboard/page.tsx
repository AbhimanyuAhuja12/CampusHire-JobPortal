"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuth, apiCall } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  User,
  History,
  Loader2,
} from "lucide-react"

interface Job {
  id: string
  title: string
  description: string
  location: string
  deadline: string
  posted_by_name: string
  requirements: string
  job_type: string
  salary_range?: string
  created_at: string
}

interface Application {
  id: string
  job_id: string
  job_title: string
  applied_at: string
  status: "pending" | "accepted" | "rejected"
}

export default function StudentDashboard() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "student") {
      redirect("/auth")
    } else {
      fetchJobs()
      fetchApplications()
    }
  }, [user])

  const fetchJobs = async () => {
    try {
      const response = await apiCall(`/jobs?college=${encodeURIComponent(user?.college || "")}`)
      setJobs(response.data.jobs || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch jobs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await apiCall("/applications/my-applications")
      setApplications(response.data.applications || [])
    } catch (error: any) {
      console.error("Failed to fetch applications:", error)
    }
  }

  const handleApply = async (jobId: string) => {
    if (!user?.is_approved) {
      toast({
        title: "Account Pending Approval",
        description: "Your account needs to be approved by your college admin before you can apply for jobs.",
        variant: "destructive",
      })
      return
    }

    setApplying(jobId)
    try {
      await apiCall("/applications", {
        method: "POST",
        body: JSON.stringify({
          job_id: jobId,
          cover_letter: "I am interested in this position and believe I would be a great fit.",
        }),
      })

      toast({
        title: "Application submitted!",
        description: "Your application has been sent successfully.",
      })

      // Refresh applications
      fetchApplications()

      // Update jobs to reflect application status
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, applied: true } : job)))
    } catch (error: any) {
      toast({
        title: "Application failed",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setApplying(null)
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.posted_by_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    }
  }

  const isJobApplied = (jobId: string) => {
    return applications.some((app) => app.job_id === jobId)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.name}!</h1>

          {!user.is_approved ? (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
              <CardContent className="flex items-center gap-3 pt-6">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Pending College Approval</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Your account is waiting for approval from your college admin.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CardContent className="flex items-center gap-3 pt-6">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Account Approved</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You can now apply for jobs from {user.college}.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Available Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              My Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, location, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                              {job.posted_by_name}
                            </CardDescription>
                          </div>
                          {isJobApplied(job.id) && (
                            <Badge variant="secondary" className="text-xs">
                              Applied
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{job.description}</p>

                        {job.requirements && (
                          <div className="flex flex-wrap gap-1">
                            {job.requirements.split(",").map((req, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {req.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </div>
                          {job.salary_range && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-green-600">{job.salary_range}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleApply(job.id)}
                          disabled={isJobApplied(job.id) || !user.is_approved || applying === job.id}
                          className="w-full"
                        >
                          {applying === job.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Applying...
                            </>
                          ) : isJobApplied(job.id) ? (
                            "Applied"
                          ) : (
                            "Apply Now"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchTerm ? "Try adjusting your search terms" : "No jobs available at the moment"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-4">
              {applications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <div>
                            <h3 className="font-medium">{application.job_title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Applied on {new Date(application.applied_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications yet</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Start applying to jobs to see your application history here
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Photo</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="college">College</Label>
                    <Input id="college" defaultValue={user.college} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={user.role} disabled />
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
