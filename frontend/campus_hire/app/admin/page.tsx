"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuth, apiCall } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  Eye,
  UserCheck,
  BarChart3,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react"

// Add imports for shimmer components
import { ShimmerJobCard, ShimmerTableRow } from "@/components/ui/shimmer-card"

interface Job {
  id: string
  title: string
  description: string
  location: string
  deadline: string
  requirements: string
  job_type: string
  salary_range?: string
  status: "active" | "closed" | "draft"
  created_at: string
}

interface PendingStudent {
  id: string
  name: string
  email: string
  college: string
  created_at: string
}

interface Application {
  id: string
  job_id: string
  job_title: string
  user_name: string
  user_email: string
  status: "pending" | "accepted" | "rejected"
  applied_at: string
  cover_letter?: string
}

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [currentJob, setCurrentJob] = useState<Job | null>(null)
  const [jobFormData, setJobFormData] = useState({
    title: "",
    description: "",
    location: "",
    deadline: "",
    requirements: "",
    job_type: "full-time",
    salary_range: "",
    status: "active",
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      redirect("/auth")
    } else {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      await Promise.all([fetchJobs(), fetchPendingStudents(), fetchApplications()])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await apiCall("/jobs/admin/my-jobs")
      console.log("Admin jobs:", response.data)
      setJobs(response.data.jobs || [])
    } catch (error: any) {
      console.error("Failed to fetch jobs:", error)
    }
  }

  const fetchPendingStudents = async () => {
    try {
      const response = await apiCall("/admin/pending-students")
      setPendingStudents(response.data.students || [])
    } catch (error: any) {
      console.error("Failed to fetch pending students:", error)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await apiCall("/applications/admin/all")
      setApplications(response.data.applications || [])
    } catch (error: any) {
      console.error("Failed to fetch applications:", error)
    }
  }

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const jobData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      deadline: formData.get("deadline") as string,
      requirements: formData.get("requirements") as string,
      job_type: formData.get("job_type") as string,
      salary_range: formData.get("salary_range") as string,
    }

    try {
      await apiCall("/jobs", {
        method: "POST",
        body: JSON.stringify(jobData),
      })

      setIsJobDialogOpen(false)
      fetchJobs()
      toast({
        title: "Job posted successfully!",
        description: "Your job posting is now live and visible to students.",
      })

      // Reset form
      e.currentTarget.reset()
    } catch (error: any) {
      toast({
        title: "Failed to create job",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditJob = (job: Job) => {
    setCurrentJob(job)
    setJobFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      deadline: job.deadline.split("T")[0], // Format date for input
      requirements: job.requirements,
      job_type: job.job_type,
      salary_range: job.salary_range || "",
      status: job.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentJob) return

    setSubmitting(true)
    try {
      await apiCall(`/jobs/${currentJob.id}`, {
        method: "PUT",
        body: JSON.stringify(jobFormData),
      })

      setIsEditDialogOpen(false)
      fetchJobs()
      toast({
        title: "Job updated successfully!",
        description: "Your changes have been saved.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to update job",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    setDeleting(jobId)
    try {
      await apiCall(`/jobs/${jobId}`, {
        method: "DELETE",
      })

      setJobs(jobs.filter((job) => job.id !== jobId))
      toast({
        title: "Job deleted",
        description: "The job has been permanently deleted.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to delete job",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const handleApproveStudent = async (studentId: string) => {
    try {
      await apiCall(`/admin/approve-student/${studentId}`, {
        method: "POST",
      })

      setPendingStudents(pendingStudents.filter((s) => s.id !== studentId))
      toast({
        title: "Student approved!",
        description: "The student can now access and apply for jobs.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to approve student",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleApplicationAction = async (applicationId: string, action: "accepted" | "rejected") => {
    try {
      await apiCall(`/applications/${applicationId}`, {
        method: "PUT",
        body: JSON.stringify({ status: action }),
      })

      setApplications(applications.map((app) => (app.id === applicationId ? { ...app, status: action } : app)))

      toast({
        title: `Application ${action}`,
        description: `The application has been ${action}.`,
      })
    } catch (error: any) {
      toast({
        title: "Failed to update application",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    }
  }

  const getJobApplications = (jobId: string) => {
    return applications.filter((app) => app.job_id === jobId)
  }

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "active").length,
    totalApplications: applications.length,
    pendingApprovals: pendingStudents.length,
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage jobs and student approvals for {user.college}</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalJobs}</p>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activeJobs}</p>
                    <p className="text-sm text-muted-foreground">Active Jobs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalApplications}</p>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                    <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Manage Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Student Approvals
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Posted Jobs</h2>
              <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Post New Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Post New Job</DialogTitle>
                    <DialogDescription>Create a new job posting for students to apply.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateJob} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input id="title" name="title" placeholder="e.g. Software Engineer Intern" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the role and responsibilities..."
                        rows={4}
                        required
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="e.g. San Francisco, CA" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deadline">Application Deadline</Label>
                        <Input id="deadline" name="deadline" type="date" required />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="job_type">Job Type</Label>
                        <select
                          id="job_type"
                          name="job_type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          required
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="internship">Internship</option>
                          <option value="contract">Contract</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salary_range">Salary Range (Optional)</Label>
                        <Input id="salary_range" name="salary_range" placeholder="e.g. $50,000 - $70,000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                      <Input
                        id="requirements"
                        name="requirements"
                        placeholder="e.g. React, JavaScript, Node.js"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsJobDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Post Job"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Edit Job Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Job</DialogTitle>
                  <DialogDescription>Update job details</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateJob} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Job Title</Label>
                    <Input
                      id="edit-title"
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={jobFormData.description}
                      onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                      rows={4}
                      required
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-location">Location</Label>
                      <Input
                        id="edit-location"
                        value={jobFormData.location}
                        onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-deadline">Application Deadline</Label>
                      <Input
                        id="edit-deadline"
                        type="date"
                        value={jobFormData.deadline}
                        onChange={(e) => setJobFormData({ ...jobFormData, deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-job_type">Job Type</Label>
                      <select
                        id="edit-job_type"
                        value={jobFormData.job_type}
                        onChange={(e) => setJobFormData({ ...jobFormData, job_type: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        required
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-salary_range">Salary Range (Optional)</Label>
                      <Input
                        id="edit-salary_range"
                        value={jobFormData.salary_range}
                        onChange={(e) => setJobFormData({ ...jobFormData, salary_range: e.target.value })}
                        placeholder="e.g. $50,000 - $70,000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-requirements">Requirements (comma-separated)</Label>
                    <Input
                      id="edit-requirements"
                      value={jobFormData.requirements}
                      onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <select
                      id="edit-status"
                      value={jobFormData.status}
                      onChange={(e) => setJobFormData({ ...jobFormData, status: e.target.value as any })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {loading ? (
              <div className="grid gap-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <ShimmerJobCard key={i} />
                  ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription className="mt-2">{job.description}</CardDescription>
                          </div>
                          <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-1">
                          {job.requirements.split(",").map((req, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {req.trim()}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{job.job_type}</Badge>
                            {getJobApplications(job.id).length > 0 && (
                              <Badge variant="secondary">
                                {getJobApplications(job.id).length} application
                                {getJobApplications(job.id).length !== 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => handleEditJob(job)}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the job posting and remove
                                  all associated applications.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {deleting === job.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && jobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs posted yet</h3>
                <p className="text-gray-600 dark:text-gray-300">Create your first job posting to get started</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Job Applications</h2>
            </div>

            <Card>
              {loading ? (
                <div className="p-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <ShimmerTableRow key={i} />
                    ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{application.user_name}</div>
                            <div className="text-sm text-muted-foreground">{application.user_email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{application.job_title}</TableCell>
                        <TableCell>{new Date(application.applied_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              application.status === "accepted"
                                ? "default"
                                : application.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {application.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApplicationAction(application.id, "accepted")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApplicationAction(application.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            {!loading && applications.length === 0 && (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications yet</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Applications will appear here once students start applying
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Pending Student Approvals</h2>
              <Badge variant="outline" className="text-sm">
                {pendingStudents.length} pending
              </Badge>
            </div>

            <Card>
              {loading ? (
                <div className="p-2">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <ShimmerTableRow key={i} />
                    ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Registered On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.college}</TableCell>
                        <TableCell>{new Date(student.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleApproveStudent(student.id)}
                            className="flex items-center gap-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>

            {!loading && pendingStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pending approvals</h3>
                <p className="text-gray-600 dark:text-gray-300">All student accounts have been approved</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Portal Analytics</CardTitle>
                <CardDescription>Overview of your job portal activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Detailed analytics and reporting features will be available soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
