import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { apiService, setAuthToken } from '../services/api'
import { LoginRequest, RegisterRequest, TokenResponse, User } from '../types'

type AuthContextValue = {
  user: User | null
  token: string | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_STORAGE_KEY = 'ml-learning-token'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const applyToken = useCallback(async (accessToken: string | null) => {
    setTokenState(accessToken)
    setAuthToken(accessToken)
    if (accessToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
      try {
        const profile = await apiService.getCurrentUser()
        setUser(profile)
      } catch (error) {
        console.error('Failed to fetch user profile', error)
        setUser(null)
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setAuthToken(null)
      }
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      setUser(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (storedToken) {
      setAuthToken(storedToken)
      apiService
        .getCurrentUser()
        .then((profile) => {
          setUser(profile)
          setTokenState(storedToken)
        })
        .catch((error) => {
          console.warn('Stored token invalid, clearing session', error)
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          setAuthToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const tokenResponse: TokenResponse = await apiService.login(credentials)
      await applyToken(tokenResponse.access_token)
    },
    [applyToken],
  )

  const register = useCallback(
    async (payload: RegisterRequest) => {
      await apiService.register(payload)
      await login({ email: payload.email, password: payload.password })
    },
    [login],
  )

  const logout = useCallback(() => {
    applyToken(null)
  }, [applyToken])

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
