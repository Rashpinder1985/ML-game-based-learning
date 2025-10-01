export interface Lesson {
  id: number
  title: string
  description?: string
  content: string
  difficulty: string
  module: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface Submission {
  id: number
  lesson_id: number
  user_id: string
  code: string
  language: string
  status: string
  result?: any
  job_id?: string
  created_at: string
  completed_at?: string
}

export interface Job {
  id: string
  status: string
  result?: any
  error_message?: string
  created_at: string
  started_at?: string
  completed_at?: string
}

export interface Progress {
  id: number
  user_id: string
  lesson_id: number
  status: string
  score: number
  attempts: number
  best_submission_id?: number
  metadata?: any
  created_at: string
  updated_at?: string
}

export interface SubmissionCreate {
  lesson_id: number
  user_id: string
  code: string
  language: string
}

export interface ExecutionResult {
  passed: boolean
  metrics?: {
    execution_time: number
    return_code: number
    memory_used: number
    cpu_used: number
  }
  hints?: string[]
  logs?: string
}