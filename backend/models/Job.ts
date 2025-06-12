export interface Job {
    id?: number
    title: string
    description: string
    requirements?: string
    location: string
    job_type: "full-time" | "part-time" | "internship" | "contract"
    salary_range?: string
    deadline: string
    status: "active" | "closed" | "draft"
    posted_by: number
    college: string
    created_at?: string
    updated_at?: string
  }
  
  export interface CreateJobData {
    title: string
    description: string
    requirements?: string
    location: string
    job_type: "full-time" | "part-time" | "internship" | "contract"
    salary_range?: string
    deadline: string
    college: string
  }
  
  export interface UpdateJobData {
    title?: string
    description?: string
    requirements?: string
    location?: string
    job_type?: "full-time" | "part-time" | "internship" | "contract"
    salary_range?: string
    deadline?: string
    status?: "active" | "closed" | "draft"
  }
  
  export interface JobFilters {
    search?: string
    location?: string
    job_type?: string
    college?: string
    status?: string
    page?: number
    limit?: number
  }
  