import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, Key, Shield, Eye, EyeOff, Check, X,
  AlertCircle, Smartphone, Laptop, Tablet,
  Globe, Clock, LogOut, RefreshCw, Download,
  Mail, MessageSquare, Fingerprint, QrCode,
  Copy, RotateCcw, Trash2, MoreVertical,
  ChevronRight, ChevronLeft, Star, Award
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface SecurityLog {
  id: string
  type: 'login' | 'logout' | 'password_change' | '2fa_enable' | '2fa_disable' | 'device_added' | 'device_removed'
  device: string
  location: string
  ip: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

interface ActiveSession {
  id: string
  device: string
  browser: string
  os: string
  location: string
  ip: string
  lastActive: string
  isCurrent: boolean
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_SESSIONS: ActiveSession[] = [
  {
    id: '1',
    device: 'MacBook Pro',
    browser: 'Chrome 122.0',
    os: 'macOS 14.3',
    location: 'San Francisco, CA',
    ip: '192.168.1.100',
    lastActive: 'Now',
    isCurrent: true
  },
  {
    id: '2',
    device: 'iPhone 15 Pro',
    browser: 'Safari',
    os: 'iOS 17.4',
    location: 'San Francisco, CA',
    ip: '192.168.1.101',
    lastActive: '2 hours ago',
    isCurrent: false
  },
  {
    id: '3',
    device: 'iPad Pro',
    browser: 'Safari',
    os: 'iPadOS 17.4',
    location: 'San Francisco, CA',
    ip: '192.168.1.102',
    lastActive: '1 day ago',
    isCurrent: false
  },
  {
    id: '4',
    device: 'Windows PC',
    browser: 'Firefox 123.0',
    os: 'Windows 11',
    location: 'New York, NY',
    ip: '192.168.2.50',
    lastActive: '3 days ago',
    isCurrent: false
  }
]

const MOCK_SECURITY_LOGS: SecurityLog[] = [
  {
    id: '1',
    type: 'login',
    device: 'MacBook Pro - Chrome',
    location: 'San Francisco, CA',
    ip: '192.168.1.100',
    timestamp: '2024-03-15T10:30:00Z',
    status: 'success'
  },
  {
    id: '2',
    type: 'login',
    device: 'iPhone 15 Pro - Safari',
    location: 'San Francisco, CA',
    ip: '192.168.1.101',
    timestamp: '2024-03-15T08:15:00Z',
    status: 'success'
  },
  {
    id: '3',
    type: 'password_change',
    device: 'MacBook Pro - Chrome',
    location: 'San Francisco, CA',
    ip: '192.168.1.100',
    timestamp: '2024-03-14T15:45:00Z',
    status: 'success'
  },
  {
    id: '4',
    type: 'login',
    device: 'Unknown Device - Firefox',
    location: 'New York, NY',
    ip: '192.168.2.50',
    timestamp: '2024-03-13T22:10:00Z',
    status: 'warning'
  },
  {
    id: '5',
    type: '2fa_enable',
    device: 'MacBook Pro - Chrome',
    location: 'San Francisco, CA',
    ip: '192.168.1.100',
    timestamp: '2024-03-12T11:20:00Z',
    status: 'success'
  }
]

// ============================================================================
// PASSWORD STRENGTH METER
// ============================================================================

interface PasswordStrengthMeterProps {
  password: string
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: 'No password', color: 'bg-gray-600' }

    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-error-red' }
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-warning-orange' }
    if (score <= 5) return { score: 3, label: 'Strong', color: 'bg-success-green' }
    return { score: 4, label: 'Very Strong', color: 'bg-purple-500' }
  }

  const strength = calculateStrength(password)
  const percentage = (strength.score / 4) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Password strength</span>
        <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
      </div>
      <div className="w-full h-1.5 bg-dark-card rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
          className={`h-full ${strength.color}`}
        />
      </div>
      <ul className="grid grid-cols-2 gap-2 mt-3">
        {[
          { test: password.length >= 8, label: '8+ characters' },
          { test: /[a-z]/.test(password), label: 'Lowercase letter' },
          { test: /[A-Z]/.test(password), label: 'Uppercase letter' },
          { test: /[0-9]/.test(password), label: 'Number' },
          { test: /[^A-Za-z0-9]/.test(password), label: 'Special character' },
        ].map((req, i) => (
          <li key={i} className="flex items-center space-x-2 text-xs">
            {req.test ? (
              <Check className="w-4 h-4 text-success-green" />
            ) : (
              <X className="w-4 h-4 text-gray-600" />
            )}
            <span className={req.test ? 'text-gray-300' : 'text-gray-600'}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================================================
// PASSWORD CHANGE FORM
// ============================================================================

interface PasswordChangeFormProps {
  onChange?: (passwords: { current: string; new: string; confirm: string }) => void
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onChange }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  const passwordsMatch = newPassword === confirmPassword
  const canSubmit = currentPassword && newPassword && confirmPassword && passwordsMatch

  const handleSubmit = () => {
    if (!canSubmit) return
    setIsChanging(true)
    onChange?.({ current: currentPassword, new: newPassword, confirm: confirmPassword })
    setTimeout(() => setIsChanging(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Current Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Current Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-12 py-3 text-white focus:border-purple-500 focus:outline-none"
            placeholder="Enter current password"
          />
          <Touchable
            onTap={() => setShowCurrent(!showCurrent)}
            hapticFeedback
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showCurrent ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </Touchable>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">New Password</label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-12 py-3 text-white focus:border-purple-500 focus:outline-none"
            placeholder="Enter new password"
          />
          <Touchable
            onTap={() => setShowNew(!showNew)}
            hapticFeedback
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showNew ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </Touchable>
        </div>
        <PasswordStrengthMeter password={newPassword} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-12 py-3 text-white focus:border-purple-500 focus:outline-none"
            placeholder="Confirm new password"
          />
          <Touchable
            onTap={() => setShowConfirm(!showConfirm)}
            hapticFeedback
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showConfirm ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </Touchable>
        </div>
        {confirmPassword && (
          <div className="flex items-center space-x-1 mt-1">
            {passwordsMatch ? (
              <>
                <Check className="w-4 h-4 text-success-green" />
                <span className="text-xs text-success-green">Passwords match</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-error-red" />
                <span className="text-xs text-error-red">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Touchable
        onTap={handleSubmit}
        hapticFeedback
        disabled={!canSubmit || isChanging}
        className={`
          w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2
          ${canSubmit && !isChanging
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
            : 'bg-dark-hover text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isChanging ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Changing Password...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Change Password</span>
          </>
        )}
      </Touchable>
    </div>
  )
}

// ============================================================================
// TWO-FACTOR AUTHENTICATION
// ============================================================================

interface TwoFactorAuthProps {
  isEnabled: boolean
  onToggle: () => void
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ isEnabled, onToggle }) => {
  const [showSetup, setShowSetup] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  const handleEnable = () => {
    setShowSetup(true)
  }

  const handleVerify = () => {
    // Mock verification
    setBackupCodes([
      'ABCD-EFGH-IJKL-MNOP',
      'QRST-UVWX-YZ12-3456',
      '7890-ABCD-EFGH-IJKL',
      'MNOP-QRST-UVWX-YZ12',
      '3456-7890-ABCD-EFGH',
      'IJKL-MNOP-QRST-UVWX',
      'YZ12-3456-7890-ABCD',
      'EFGH-IJKL-MNOP-QRST'
    ])
    setShowBackupCodes(true)
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'))
  }

  const downloadBackupCodes = () => {
    const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nova-backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isEnabled) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-success-green/10 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-success-green/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-success-green" />
            </div>
            <div>
              <h4 className="text-white font-medium">Two-Factor Authentication is ON</h4>
              <p className="text-sm text-gray-400">Your account is extra secure</p>
            </div>
          </div>
          <Touchable
            onTap={onToggle}
            hapticFeedback
            className="px-4 py-2 bg-error-red/20 text-error-red rounded-lg hover:bg-error-red/30 transition-colors"
          >
            Disable
          </Touchable>
        </div>

        <Touchable
          onTap={() => setShowBackupCodes(!showBackupCodes)}
          hapticFeedback
          className="w-full flex items-center justify-between p-4 bg-dark-hover rounded-xl hover:bg-dark-card transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">View Backup Codes</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showBackupCodes ? 'rotate-90' : ''}`} />
        </Touchable>

        <AnimatePresence>
          {showBackupCodes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-dark-hover rounded-xl space-y-4">
                <p className="text-sm text-gray-400">
                  Keep these backup codes in a safe place. You can use them to access your account if you lose your phone.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, i) => (
                    <div key={i} className="p-2 bg-dark-card rounded-lg font-mono text-xs text-purple-400">
                      {code}
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Touchable
                    onTap={copyBackupCodes}
                    hapticFeedback
                    className="flex-1 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Codes</span>
                  </Touchable>
                  <Touchable
                    onTap={downloadBackupCodes}
                    hapticFeedback
                    className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Touchable>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (showSetup) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
            <QrCode className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Scan QR Code</h3>
          <p className="text-sm text-gray-400 mb-4">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </p>
        </div>

        {/* Mock QR Code */}
        <div className="w-48 h-48 mx-auto bg-white p-4 rounded-xl">
          <div className="w-full h-full bg-black/90 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-white rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-400 text-center">
            Or enter this code manually: <span className="font-mono text-purple-400">JBSWY3DPEHPK3PXP</span>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-center text-2xl tracking-widest text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Touchable
              onTap={() => setShowSetup(false)}
              hapticFeedback
              className="flex-1 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
            >
              Back
            </Touchable>
            <Touchable
              onTap={handleVerify}
              hapticFeedback
              disabled={verificationCode.length !== 6}
              className="flex-1 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Enable
            </Touchable>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
        <Shield className="w-10 h-10 text-purple-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Protect Your Account</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
        Two-factor authentication adds an extra layer of security to your account. 
        You'll need to enter a verification code from your phone when signing in.
      </p>
      <Touchable
        onTap={handleEnable}
        hapticFeedback
        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
      >
        <Shield className="w-5 h-5" />
        <span>Enable Two-Factor Authentication</span>
      </Touchable>
    </div>
  )
}

// ============================================================================
// ACTIVE SESSION CARD
// ============================================================================

interface ActiveSessionCardProps {
  session: ActiveSession
  onRevoke: (id: string) => void
}

const ActiveSessionCard: React.FC<ActiveSessionCardProps> = ({ session, onRevoke }) => {
  const [showConfirm, setShowConfirm] = useState(false)

  const getDeviceIcon = () => {
    if (session.device.includes('iPhone') || session.device.includes('iPad')) {
      return <Smartphone className="w-5 h-5" />
    }
    if (session.device.includes('Mac')) {
      return <Laptop className="w-5 h-5" />
    }
    return <Globe className="w-5 h-5" />
  }

  return (
    <div className="p-4 bg-dark-hover rounded-xl relative">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-dark-card rounded-lg">
            {getDeviceIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-white font-medium">{session.device}</h4>
              {session.isCurrent && (
                <span className="px-2 py-0.5 bg-success-green/10 text-success-green text-xs rounded-full">
                  Current
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {session.browser} • {session.os}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs">
              <span className="text-gray-500">{session.location}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">IP: {session.ip}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">Active {session.lastActive}</span>
            </div>
          </div>
        </div>

        {!session.isCurrent && (
          <div className="relative">
            <Touchable
              onTap={() => setShowConfirm(!showConfirm)}
              hapticFeedback
              className="p-2 hover:bg-dark-card rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Touchable>

            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden z-10"
                >
                  <Touchable
                    onTap={() => {
                      onRevoke(session.id)
                      setShowConfirm(false)
                    }}
                    hapticFeedback
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-error-red/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-error-red" />
                    <span className="text-sm text-error-red">Revoke Access</span>
                  </Touchable>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirmation overlay */}
      <AnimatePresence>
        {showConfirm && session.isCurrent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 glass-card flex items-center justify-center space-x-3 p-4"
          >
            <p className="text-sm text-gray-300">Revoke current session?</p>
            <Touchable
              onTap={() => setShowConfirm(false)}
              hapticFeedback
              className="px-3 py-1 bg-dark-hover text-gray-300 rounded-lg hover:bg-dark-card transition-colors"
            >
              Cancel
            </Touchable>
            <Touchable
              onTap={() => {
                onRevoke(session.id)
                setShowConfirm(false)
              }}
              hapticFeedback
              className="px-3 py-1 bg-error-red text-white rounded-lg hover:bg-error-red/80 transition-colors"
            >
              Yes, Revoke
            </Touchable>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// SECURITY LOG ITEM
// ============================================================================

interface SecurityLogItemProps {
  log: SecurityLog
}

const SecurityLogItem: React.FC<SecurityLogItemProps> = ({ log }) => {
  const getLogIcon = () => {
    switch (log.type) {
      case 'login': return LogIn
      case 'logout': return LogOut
      case 'password_change': return Key
      case '2fa_enable': return Shield
      case '2fa_disable': return Shield
      case 'device_added': return Smartphone
      case 'device_removed': return Trash2
      default: return Activity
    }
  }

  const getLogColor = () => {
    switch (log.status) {
      case 'success': return 'text-success-green bg-success-green/10'
      case 'warning': return 'text-warning-orange bg-warning-orange/10'
      case 'error': return 'text-error-red bg-error-red/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getLogMessage = () => {
    switch (log.type) {
      case 'login': return 'Signed in'
      case 'logout': return 'Signed out'
      case 'password_change': return 'Password changed'
      case '2fa_enable': return 'Two-factor authentication enabled'
      case '2fa_disable': return 'Two-factor authentication disabled'
      case 'device_added': return 'New device added'
      case 'device_removed': return 'Device removed'
      default: return log.type
    }
  }

  const Icon = getLogIcon()
  const colorClass = getLogColor()

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-dark-border last:border-0">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white">{getLogMessage()}</p>
          <span className="text-xs text-gray-500">
            {new Date(log.timestamp).toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {log.device} • {log.location} • {log.ip}
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN SECURITY SETTINGS PAGE
// ============================================================================

export const SettingsSecurityPage: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessions, setSessions] = useState<ActiveSession[]>(MOCK_SESSIONS)
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(MOCK_SECURITY_LOGS)
  const [showRevokeAll, setShowRevokeAll] = useState(false)

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
  }

  const handleRevokeAllOthers = () => {
    setSessions(prev => prev.filter(s => s.isCurrent))
    setShowRevokeAll(false)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Security Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your account security and authentication methods
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Password Change Section */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
          <PasswordChangeForm />
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Two-Factor Authentication</h2>
          <TwoFactorAuth
            isEnabled={twoFactorEnabled}
            onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)}
          />
        </div>

        {/* Active Sessions Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Active Sessions</h2>
            {sessions.filter(s => !s.isCurrent).length > 0 && (
              <Touchable
                onTap={() => setShowRevokeAll(true)}
                hapticFeedback
                className="text-sm text-error-red hover:text-error-red/80"
              >
                Revoke all others
              </Touchable>
            )}
          </div>

          <div className="space-y-4">
            {sessions.map((session) => (
              <ActiveSessionCard
                key={session.id}
                session={session}
                onRevoke={handleRevokeSession}
              />
            ))}
          </div>

          {/* Revoke All Confirmation */}
          <AnimatePresence>
            {showRevokeAll && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 bg-error-red/10 border border-error-red/20 rounded-xl"
              >
                <p className="text-sm text-gray-300 mb-3">
                  Are you sure you want to revoke all other sessions? You'll be signed out from all other devices.
                </p>
                <div className="flex items-center space-x-3">
                  <Touchable
                    onTap={() => setShowRevokeAll(false)}
                    hapticFeedback
                    className="px-4 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-dark-card transition-colors"
                  >
                    Cancel
                  </Touchable>
                  <Touchable
                    onTap={handleRevokeAllOthers}
                    hapticFeedback
                    className="px-4 py-2 bg-error-red text-white rounded-lg hover:bg-error-red/80 transition-colors"
                  >
                    Yes, Revoke All
                  </Touchable>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Logs Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Security Logs</h2>
            <Touchable
              onTap={() => setSecurityLogs(MOCK_SECURITY_LOGS)}
              hapticFeedback
              className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </Touchable>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {securityLogs.map((log) => (
              <SecurityLogItem key={log.id} log={log} />
            ))}
          </div>
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to toggle</span>
          <span>👆👆 Double tap to copy</span>
          <span>🤏 Long press for options</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const LogIn: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
)

const Activity: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

export default SettingsSecurityPage
