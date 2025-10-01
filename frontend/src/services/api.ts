import axios from 'axios'
import { Lesson, Submission, Job, Progress, SubmissionCreate } from '../types'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API service functions
export const apiService = {
  // Lessons
  async getLessons(params?: {
    skip?: number
    limit?: number
    module?: string
    difficulty?: string
  }): Promise<Lesson[]> {
    const response = await api.get('/api/v1/lessons', { params })
    return response.data
  },

  async getLesson(id: number): Promise<Lesson> {
    const response = await api.get(`/api/v1/lessons/${id}`)
    return response.data
  },

  // Submissions
  async submitCode(data: SubmissionCreate): Promise<Submission> {
    const response = await api.post('/api/v1/submit', data)
    return response.data
  },

  async getSubmission(id: number): Promise<Submission> {
    const response = await api.get(`/api/v1/submissions/${id}`)
    return response.data
  },

  // Jobs
  async getJob(id: string): Promise<Job> {
    const response = await api.get(`/api/v1/jobs/${id}`)
    return response.data
  },

  // Progress
  async getMyProgress(userId: string): Promise<Progress[]> {
    const response = await api.get('/api/v1/progress/me', {
      params: { user_id: userId }
    })
    return response.data
  },

  async createProgress(data: {
    user_id: string
    lesson_id: number
    status?: string
    score?: number
    attempts?: number
    metadata?: any
  }): Promise<Progress> {
    const response = await api.post('/api/v1/progress', data)
    return response.data
  },

  async updateProgress(id: number, data: {
    status?: string
    score?: number
    attempts?: number
    best_submission_id?: number
    metadata?: any
  }): Promise<Progress> {
    const response = await api.put(`/api/v1/progress/${id}`, data)
    return response.data
  },
}