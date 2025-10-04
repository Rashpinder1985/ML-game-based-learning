import axios from 'axios'

import {
  Lesson,
  Submission,
  Job,
  Progress,
  SubmissionCreate,
  ProgressCreate,
  ProgressUpdate,
  User,
  TokenResponse,
  LoginRequest,
  RegisterRequest,
} from '../types'

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8002'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export const apiService = {
  // Auth
  async register(payload: RegisterRequest): Promise<User> {
    const response = await api.post<User>('/api/v1/auth/register', payload)
    return response.data
  },

  async login(payload: LoginRequest): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/api/v1/auth/login/json', payload)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/v1/auth/me')
    return response.data
  },

  // Lessons
  async getLessons(params?: {
    skip?: number
    limit?: number
    module?: string
    difficulty?: string
  }): Promise<Lesson[]> {
    const response = await api.get<Lesson[]>('/api/v1/lessons', { params })
    return response.data
  },

  async getLesson(id: number): Promise<Lesson> {
    const response = await api.get<Lesson>(`/api/v1/lessons/${id}`)
    return response.data
  },

  // Submissions
  async submitCode(data: SubmissionCreate): Promise<Submission> {
    const response = await api.post<Submission>('/api/v1/submit', {
      language: 'python',
      ...data,
    })
    return response.data
  },

  async getSubmission(id: number): Promise<Submission> {
    const response = await api.get<Submission>(`/api/v1/submissions/${id}`)
    return response.data
  },

  // Jobs
  async getJob(id: string): Promise<Job> {
    const response = await api.get<Job>(`/api/v1/jobs/${id}`)
    return response.data
  },

  // Progress
  async getMyProgress(): Promise<Progress[]> {
    const response = await api.get<Progress[]>('/api/v1/progress/me')
    return response.data
  },

  async createProgress(data: ProgressCreate): Promise<Progress> {
    const response = await api.post<Progress>('/api/v1/progress', data)
    return response.data
  },

  async updateProgress(id: number, data: ProgressUpdate): Promise<Progress> {
    const response = await api.put<Progress>(`/api/v1/progress/${id}`, data)
    return response.data
  },
}

export default api
