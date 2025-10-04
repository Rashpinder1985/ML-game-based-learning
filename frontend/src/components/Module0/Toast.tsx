import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="#4ecdc4" />
      case 'error':
        return <XCircle size={20} color="#ff6b6b" />
      case 'info':
        return <Info size={20} color="#4f9ff0" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(78, 205, 196, 0.1)'
      case 'error':
        return 'rgba(255, 107, 107, 0.1)'
      case 'info':
        return 'rgba(79, 159, 240, 0.1)'
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#4ecdc4'
      case 'error':
        return '#ff6b6b'
      case 'info':
        return '#4f9ff0'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.8 }}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getBackgroundColor(),
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '400px',
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {getIcon()}
      <span style={{ color: 'white', fontWeight: '500' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '4px',
          marginLeft: 'auto',
          opacity: 0.7,
          fontSize: '18px'
        }}
      >
        ×
      </button>
    </motion.div>
  )
}

export default Toast