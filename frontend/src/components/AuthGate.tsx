import { useState } from 'react'

import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'register'

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, login, register, logout } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await register({ email, password, full_name: fullName })
      }
      setEmail('')
      setPassword('')
      setFullName('')
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Authentication failed. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading session...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{
        maxWidth: '420px',
        margin: '40px auto',
        padding: '30px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '16px',
          textAlign: 'center',
          fontSize: '24px',
          color: '#4f9ff0'
        }}>
          {mode === 'login' ? 'Sign In to Continue' : 'Create an Account'}
        </h2>

        <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '24px' }}>
          Save your quest progress and code submissions across devices.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Full Name (optional)</label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Ada Lovelace"
                style={inputStyle}
                disabled={isSubmitting}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.7 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(231, 76, 60, 0.15)',
              color: '#ff8585',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #4f9ff0, #667eea)',
              color: 'white',
              fontSize: '16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          {mode === 'login' ? (
            <span>
              Need an account?{' '}
              <button
                onClick={() => setMode('register')}
                style={linkStyle}
                type="button"
                disabled={isSubmitting}
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Have an account?{' '}
              <button
                onClick={() => setMode('login')}
                style={linkStyle}
                type="button"
                disabled={isSubmitting}
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '20px',
        borderRadius: '0 0 12px 12px'
      }}>
        <div>
          <div style={{ fontWeight: 600 }}>Welcome back, {user.full_name || user.email} 👋</div>
          <div style={{ fontSize: '12px', opacity: 0.6 }}>Your quest progress is linked to this account.</div>
        </div>
        <button
          onClick={logout}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            color: 'white',
            padding: '8px 14px',
            cursor: 'pointer'
          }}
        >
          Sign out
        </button>
      </div>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(0,0,0,0.3)',
  color: 'white'
}

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#4f9ff0',
  cursor: 'pointer',
  fontWeight: 600,
}

export default AuthGate
