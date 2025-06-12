export interface Application {
    id?: number
    job_id: number
    user_id: number
    status: "pending" | "accepted" | "rejected"
    cover_letter?: string
    resume_url?: string
    applied_at?: string
    updated_at?: string
  }
  
  export interface CreateApplicationData {
    job_id: number
    cover_letter?: string
    resume_url?: string
  }
  
  export interface UpdateApplicationData {
    status?: "pending" | "accepted" | "rejected"
    cover_letter?: string
    resume_url?: string
  }
  
  export interface ApplicationWithDetails extends Application {
    job_title?: string
    job_company?: string
    user_name?: string
    user_email?: string
  }
  