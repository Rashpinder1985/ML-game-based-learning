import React from 'react'
import ReactDOM from 'react-dom/client'
import Module0Demo from './Module0Demo.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Module0Demo />
    </AuthProvider>
  </React.StrictMode>,
)
