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
  user_id: number
  code: string
  language: string
  status: string
  result?: any
  job_id?: string
  created_at: string
  completed_at?: string
}

export interface SubmissionCreate {
  lesson_id: number
  code: string
  language?: string
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
  user_id: number
  lesson_id: number
  status: string
  score: number
  attempts: number
  best_submission_id?: number
  progress_metadata?: any
  created_at: string
  updated_at?: string
}

export interface ProgressCreate {
  lesson_id: number
  status?: string
  score?: number
  attempts?: number
  best_submission_id?: number
  progress_metadata?: any
}

export interface ProgressUpdate {
  status?: string
  score?: number
  attempts?: number
  best_submission_id?: number
  progress_metadata?: any
}

export interface ExecutionResult {
  passed: boolean
  metrics?: Record<string, number>
  hints?: string[]
  logs?: string
}

export interface User {
  id: number
  email: string
  full_name?: string
  is_active: boolean
  is_verified: boolean
  total_xp: number
  current_level: number
  badges: string[]
  last_login?: string
  created_at: string
  updated_at?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  full_name?: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}
