import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  Check, X, AlertCircle, Camera, Upload,
  Briefcase, MapPin, Globe, Calendar,
  ChevronLeft, ChevronRight, Save, Users,
  Shield, Award, Star, Sparkles, Zap,
  Github, Linkedin, Twitter, Facebook,
  History, RotateCcw, Trash2, Copy,
  Key, Bell, Moon, Sun, Clock
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  role: 'admin' | 'manager' | 'editor' | 'viewer'
  department: string
  position: string
  location: string
  timezone: string
  username: string
  permissions: string[]
  github: string
  linkedin: string
  twitter: string
  receiveEmails: boolean
  twoFactorAuth: boolean
  darkMode: boolean
  lastLogin: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  loginCount: number
}

interface FormErrors {
  [key: string]: string
}

// ============================================================================
// MOCK USER DATA
// ============================================================================

const MOCK_USER: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop',
  role: 'admin',
  department: 'Engineering',
  position: 'Senior Developer',
  location: 'New York, NY',
  timezone: 'America/New_York',
  username: 'johndoe',
  permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles', 'view_analytics'],
  github: 'https://github.com/johndoe',
  linkedin: 'https://linkedin.com/in/johndoe',
  twitter: 'https://twitter.com/johndoe',
  receiveEmails: true,
  twoFactorAuth: true,
  darkMode: true,
  lastLogin: '2024-03-15T10:30:00Z',
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-03-14T15:45:00Z',
  status: 'active',
  loginCount: 156
}

// ============================================================================
// AVATAR EDIT COMPONENT
// ============================================================================

interface AvatarEditProps {
  avatar: string
  onAvatarChange: (avatar: string) => void
  onAvatarRemove: () => void
}

const AvatarEdit: React.FC<AvatarEditProps> = ({ avatar, onAvatarChange, onAvatarRemove }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onAvatarChange(reader.result as string)
        setShowOptions(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Touchable
        onTap={() => setShowOptions(!showOptions)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        hapticFeedback
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
      >
        <img
          src={avatar}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        
        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <Camera className="w-8 h-8 text-white" />
        </motion.div>

        {/* Status indicator */}
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-success-green rounded-full border-2 border-dark-card" />
      </Touchable>

      {/* Options menu */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 glass-card rounded-xl overflow-hidden z-10 min-w-[160px]"
          >
            <Touchable
              onTap={() => {
                fileInputRef.current?.click()
                setShowOptions(false)
              }}
              hapticFeedback
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
            >
              <Upload className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Upload new</span>
            </Touchable>
            
            <Touchable
              onTap={() => {
                onAvatarRemove()
                setShowOptions(false)
              }}
              hapticFeedback
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
            >
              <Trash2 className="w-4 h-4 text-error-red" />
              <span className="text-sm text-gray-300">Remove</span>
            </Touchable>
            
            <Touchable
              onTap={() => setShowOptions(false)}
              hapticFeedback
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors border-t border-dark-border"
            >
              <X className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Cancel</span>
            </Touchable>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// FORM FIELD COMPONENT (Enhanced for edit)
// ============================================================================

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  error?: string
  icon?: React.ElementType
  required?: boolean
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  helper?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  required = false,
  placeholder,
  autoComplete,
  disabled = false,
  helper
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          {label} {required && <span className="text-error-red">*</span>}
        </label>
        {helper && (
          <span className="text-xs text-gray-500">{helper}</span>
        )}
      </div>
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
        )}
        
        <input
          type={isPassword && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`
            w-full bg-dark-hover border rounded-xl py-3 text-white placeholder-gray-600
            focus:outline-none focus:ring-2 transition-all
            ${Icon ? 'pl-10' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${error 
              ? 'border-error-red focus:border-error-red focus:ring-error-red/20' 
              : isFocused 
                ? 'border-purple-500 focus:ring-purple-500/20' 
                : 'border-dark-border'
            }
          `}
        />
        
        {isPassword && (
          <Touchable
            onTap={() => setShowPassword(!showPassword)}
            hapticFeedback
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </Touchable>
        )}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-error-red text-sm flex items-center space-x-1"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// SELECT FIELD COMPONENT (Enhanced for edit)
// ============================================================================

interface SelectFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  error?: string
  icon?: React.ElementType
  required?: boolean
  disabled?: boolean
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  icon: Icon,
  required = false,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-error-red">*</span>}
      </label>
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
        )}
        
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full bg-dark-hover border rounded-xl py-3 text-white appearance-none
            focus:outline-none focus:ring-2 transition-all
            ${Icon ? 'pl-10' : 'pl-4'}
            pr-10
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${error 
              ? 'border-error-red focus:border-error-red focus:ring-error-red/20' 
              : isFocused 
                ? 'border-purple-500 focus:ring-purple-500/20' 
                : 'border-dark-border'
            }
          `}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 rotate-90" />
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-error-red text-sm flex items-center space-x-1"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// PERMISSIONS GRID COMPONENT (Enhanced for edit)
// ============================================================================

interface PermissionsGridProps {
  selected: string[]
  onChange: (permissions: string[]) => void
  disabled?: boolean
}

const PermissionsGrid: React.FC<PermissionsGridProps> = ({ 
  selected, 
  onChange,
  disabled = false 
}) => {
  const permissions = [
    { id: 'read', label: 'Read', description: 'View content and data', category: 'basic' },
    { id: 'write', label: 'Write', description: 'Create and edit content', category: 'basic' },
    { id: 'delete', label: 'Delete', description: 'Remove content', category: 'basic' },
    { id: 'publish', label: 'Publish', description: 'Publish content', category: 'content' },
    { id: 'manage_users', label: 'Manage Users', description: 'Create/edit users', category: 'admin' },
    { id: 'manage_roles', label: 'Manage Roles', description: 'Assign roles', category: 'admin' },
    { id: 'view_analytics', label: 'View Analytics', description: 'Access reports', category: 'analytics' },
    { id: 'manage_settings', label: 'Manage Settings', description: 'Change settings', category: 'admin' },
    { id: 'export_data', label: 'Export Data', description: 'Export to CSV/PDF', category: 'data' },
    { id: 'api_access', label: 'API Access', description: 'Use API endpoints', category: 'advanced' },
  ]

  const categories = [
    { id: 'basic', label: 'Basic Permissions', color: 'blue' },
    { id: 'content', label: 'Content Management', color: 'green' },
    { id: 'admin', label: 'Administration', color: 'purple' },
    { id: 'analytics', label: 'Analytics', color: 'orange' },
    { id: 'data', label: 'Data Management', color: 'pink' },
    { id: 'advanced', label: 'Advanced', color: 'indigo' },
  ]

  const togglePermission = (id: string) => {
    if (disabled) return
    if (selected.includes(id)) {
      onChange(selected.filter(p => p !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const selectAllInCategory = (category: string) => {
    if (disabled) return
    const categoryPermissions = permissions
      .filter(p => p.category === category)
      .map(p => p.id)
    
    const allSelected = categoryPermissions.every(p => selected.includes(p))
    
    if (allSelected) {
      onChange(selected.filter(p => !categoryPermissions.includes(p)))
    } else {
      const newPermissions = [...selected]
      categoryPermissions.forEach(p => {
        if (!newPermissions.includes(p)) {
          newPermissions.push(p)
        }
      })
      onChange(newPermissions)
    }
  }

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryPerms = permissions.filter(p => p.category === category.id)
        const allSelected = categoryPerms.every(p => selected.includes(p.id))
        const someSelected = categoryPerms.some(p => selected.includes(p.id))

        return (
          <div key={category.id} className="space-y-3">
            {/* Category header */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">{category.label}</h4>
              {!disabled && (
                <Touchable
                  onTap={() => selectAllInCategory(category.id)}
                  hapticFeedback
                  className={`text-xs px-2 py-1 rounded-full transition-colors ${
                    allSelected 
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-dark-hover text-gray-400 hover:text-white'
                  }`}
                >
                  {allSelected ? 'Deselect all' : 'Select all'}
                </Touchable>
              )}
            </div>

            {/* Permissions grid */}
            <div className="grid grid-cols-2 gap-3">
              {categoryPerms.map((permission) => (
                <Touchable
                  key={permission.id}
                  onTap={() => togglePermission(permission.id)}
                  hapticFeedback
                  disabled={disabled}
                  className={`
                    p-3 rounded-xl border transition-all
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${selected.includes(permission.id)
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-dark-hover border-dark-border hover:border-purple-500/30'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0
                      ${selected.includes(permission.id)
                        ? 'bg-purple-500 text-white'
                        : 'bg-dark-card border border-dark-border'
                      }
                    `}>
                      {selected.includes(permission.id) && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{permission.label}</p>
                      <p className="text-xs text-gray-400">{permission.description}</p>
                    </div>
                  </div>
                </Touchable>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// ACTIVITY TIMELINE COMPONENT
// ============================================================================

interface ActivityTimelineProps {
  user: User
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ user }) => {
  const activities = [
    { action: 'User logged in', time: user.lastLogin, icon: LogIn },
    { action: 'Profile updated', time: user.updatedAt, icon: Edit },
    { action: 'Password changed', time: '2024-03-10T14:20:00Z', icon: Key },
    { action: 'Permissions updated', time: '2024-03-05T09:15:00Z', icon: Shield },
    { action: 'Account created', time: user.createdAt, icon: UserPlus },
  ]

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon
        return (
          <div key={index} className="flex items-start space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-purple-400" />
              </div>
              {index < activities.length - 1 && (
                <div className="absolute top-8 left-1/2 w-0.5 h-12 bg-dark-border -translate-x-1/2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm text-white">{activity.action}</p>
              <p className="text-xs text-gray-400 mt-1">{formatTime(activity.time)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-lg font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN USER EDIT PAGE
// ============================================================================

export const UsersEditPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { triggerHaptic } = useGestures()
  
  // State
  const [formData, setFormData] = useState<User>(MOCK_USER)
  const [originalData, setOriginalData] = useState<User>(MOCK_USER)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'activity' | 'security'>('edit')
  const [hasChanges, setHasChanges] = useState(false)

  // Check for unsaved changes
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData)
    setHasChanges(changed)
  }, [formData, originalData])

  // Validation
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value) return `${name === 'firstName' ? 'First' : 'Last'} name is required`
        if (value.length < 2) return 'Must be at least 2 characters'
        if (value.length > 50) return 'Must be less than 50 characters'
        break

      case 'email':
        if (!value) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
        break

      case 'phone':
        if (value && !/^[\d\s\-+()]{10,}$/.test(value)) return 'Invalid phone number'
        break

      case 'username':
        if (!value) return 'Username is required'
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
          return 'Username must be 3-20 characters (letters, numbers, underscore)'
        }
        break

      case 'department':
      case 'position':
        if (!value) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
        break
    }
    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'username', 'department', 'position']

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof User])
      if (error) newErrors[field] = error
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => ({ ...prev, [name]: finalValue }))
    
    if (touched.has(name)) {
      const error = validateField(name, finalValue)
      setErrors(prev => error ? { ...prev, [name]: error } : { ...prev, [name]: undefined })
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => new Set(prev).add(name))
    const error = validateField(name, formData[name as keyof User])
    setErrors(prev => error ? { ...prev, [name]: error } : { ...prev, [name]: undefined })
  }

  const handleSubmit = async () => {
    triggerHaptic([15, 10, 15])
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    setOriginalData(formData)
    
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  const handleReset = () => {
    triggerHaptic([10])
    setFormData(originalData)
    setErrors({})
    setTouched(new Set())
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    triggerHaptic([30, 20, 30])
    setShowDeleteConfirm(false)
    // Simulate delete
    setTimeout(() => {
      navigate('/admin/users')
    }, 1000)
  }

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(formData.id)
    triggerHaptic([10])
    // Show toast notification
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Touchable
            onTap={() => {
              if (hasChanges) {
                if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                  navigate('/admin/users')
                }
              } else {
                navigate('/admin/users')
              }
            }}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </Touchable>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Edit User</h1>
            <p className="text-gray-400 text-sm mt-1">
              Editing {formData.firstName} {formData.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* User ID badge */}
          <Touchable
            onTap={handleCopyUserId}
            hapticFeedback
            className="flex items-center space-x-2 px-3 py-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <span className="text-xs text-gray-400">ID:</span>
            <span className="text-sm text-white font-mono">{formData.id}</span>
            <Copy className="w-4 h-4 text-gray-400" />
          </Touchable>

          {/* Delete button */}
          <Touchable
            onTap={handleDelete}
            hapticFeedback
            className="p-2 glass-card hover:bg-error-red/20 rounded-xl transition-colors"
          >
            <Trash2 className="w-5 h-5 text-error-red" />
          </Touchable>

          {/* Reset button */}
          {hasChanges && (
            <Touchable
              onTap={handleReset}
              hapticFeedback
              className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-gray-400" />
            </Touchable>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 mb-6 border-b border-dark-border">
        {[
          { id: 'edit', label: 'Edit Profile', icon: Edit },
          { id: 'activity', label: 'Activity', icon: History },
          { id: 'security', label: 'Security', icon: Shield },
        ].map((tab) => (
          <Touchable
            key={tab.id}
            onTap={() => setActiveTab(tab.id as any)}
            hapticFeedback
            className={`
              flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
              }
            `}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </Touchable>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Avatar and Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar */}
            <div className="glass-card p-6 flex flex-col items-center">
              <AvatarEdit
                avatar={formData.avatar}
                onAvatarChange={(avatar) => setFormData(prev => ({ ...prev, avatar }))}
                onAvatarRemove={() => setFormData(prev => ({ ...prev, avatar: '' }))}
              />
              
              <h2 className="text-xl font-bold text-white mt-4">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-sm text-gray-400">{formData.position}</p>
              
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  formData.status === 'active' ? 'bg-success-green/10 text-success-green' :
                  formData.status === 'inactive' ? 'bg-gray-500/10 text-gray-400' :
                  formData.status === 'pending' ? 'bg-warning-orange/10 text-warning-orange' :
                  'bg-error-red/10 text-error-red'
                }`}>
                  {formData.status}
                </span>
                <span className="text-xs text-gray-500">
                  Last login: {new Date(formData.lastLogin).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Stats Cards */}
            <StatsCard
              icon={Users}
              label="Login count"
              value={formData.loginCount}
              color="from-blue-500 to-cyan-500"
            />
            <StatsCard
              icon={Calendar}
              label="Member since"
              value={new Date(formData.createdAt).toLocaleDateString()}
              color="from-purple-500 to-pink-500"
            />
            <StatsCard
              icon={Clock}
              label="Last updated"
              value={new Date(formData.updatedAt).toLocaleDateString()}
              color="from-orange-500 to-red-500"
            />
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Edit Tab */}
              {activeTab === 'edit' && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6"
                >
                  <div className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={() => handleBlur('firstName')}
                        error={errors.firstName}
                        icon={User}
                        required
                      />
                      <FormField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={() => handleBlur('lastName')}
                        error={errors.lastName}
                        icon={User}
                        required
                      />
                    </div>

                    {/* Contact Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        error={errors.email}
                        icon={Mail}
                        required
                      />
                      <FormField
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        error={errors.phone}
                        icon={Phone}
                      />
                    </div>

                    {/* Username */}
                    <FormField
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={() => handleBlur('username')}
                      error={errors.username}
                      icon={AtSign}
                      required
                      helper="Used for login"
                    />

                    {/* Role & Department */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SelectField
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        icon={Shield}
                        options={[
                          { value: 'admin', label: 'Admin' },
                          { value: 'manager', label: 'Manager' },
                          { value: 'editor', label: 'Editor' },
                          { value: 'viewer', label: 'Viewer' }
                        ]}
                      />
                      <FormField
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        onBlur={() => handleBlur('department')}
                        error={errors.department}
                        icon={Briefcase}
                        required
                      />
                    </div>

                    {/* Position & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        onBlur={() => handleBlur('position')}
                        error={errors.position}
                        icon={Award}
                        required
                      />
                      <FormField
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        icon={MapPin}
                      />
                    </div>

                    {/* Timezone */}
                    <SelectField
                      label="Timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      icon={Globe}
                      options={[
                        { value: 'America/New_York', label: 'Eastern Time' },
                        { value: 'America/Chicago', label: 'Central Time' },
                        { value: 'America/Denver', label: 'Mountain Time' },
                        { value: 'America/Los_Angeles', label: 'Pacific Time' },
                        { value: 'Europe/London', label: 'Greenwich Mean Time' },
                        { value: 'Europe/Paris', label: 'Central European Time' },
                        { value: 'Asia/Tokyo', label: 'Japan Standard Time' },
                        { value: 'Australia/Sydney', label: 'Australian Eastern Time' }
                      ]}
                    />

                    {/* Permissions */}
                    <div className="pt-6 border-t border-dark-border">
                      <h3 className="text-lg font-medium text-white mb-4">Permissions</h3>
                      <PermissionsGrid
                        selected={formData.permissions}
                        onChange={(perms) => setFormData(prev => ({ ...prev, permissions: perms }))}
                      />
                    </div>

                    {/* Social Links */}
                    <div className="pt-6 border-t border-dark-border">
                      <h3 className="text-lg font-medium text-white mb-4">Social Profiles</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          label="GitHub"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          icon={Github}
                        />
                        <FormField
                          label="LinkedIn"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          icon={Linkedin}
                        />
                        <FormField
                          label="Twitter"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                          icon={Twitter}
                        />
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="pt-6 border-t border-dark-border">
                      <h3 className="text-lg font-medium text-white mb-4">Preferences</h3>
                      <div className="space-y-3">
                        <Touchable
                          onTap={() => setFormData(prev => ({ ...prev, receiveEmails: !prev.receiveEmails }))}
                          hapticFeedback
                          className="flex items-center justify-between p-3 bg-dark-hover rounded-xl"
                        >
                          <span className="text-gray-300">Receive email notifications</span>
                          <div className={`w-12 h-6 rounded-full transition-colors ${
                            formData.receiveEmails ? 'bg-purple-500' : 'bg-dark-card'
                          }`}>
                            <motion.div
                              animate={{ x: formData.receiveEmails ? 24 : 0 }}
                              className="w-6 h-6 bg-white rounded-full shadow-lg"
                            />
                          </div>
                        </Touchable>

                        <Touchable
                          onTap={() => setFormData(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                          hapticFeedback
                          className="flex items-center justify-between p-3 bg-dark-hover rounded-xl"
                        >
                          <span className="text-gray-300">Two-factor authentication</span>
                          <div className={`w-12 h-6 rounded-full transition-colors ${
                            formData.twoFactorAuth ? 'bg-purple-500' : 'bg-dark-card'
                          }`}>
                            <motion.div
                              animate={{ x: formData.twoFactorAuth ? 24 : 0 }}
                              className="w-6 h-6 bg-white rounded-full shadow-lg"
                            />
                          </div>
                        </Touchable>

                        <Touchable
                          onTap={() => setFormData(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                          hapticFeedback
                          className="flex items-center justify-between p-3 bg-dark-hover rounded-xl"
                        >
                          <span className="text-gray-300">Dark mode</span>
                          <div className={`w-12 h-6 rounded-full transition-colors ${
                            formData.darkMode ? 'bg-purple-500' : 'bg-dark-card'
                          }`}>
                            <motion.div
                              animate={{ x: formData.darkMode ? 24 : 0 }}
                              className="w-6 h-6 bg-white rounded-full shadow-lg"
                            />
                          </div>
                        </Touchable>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-medium text-white mb-6">Activity Timeline</h3>
                  <ActivityTimeline user={formData} />
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6"
                >
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white">Security Settings</h3>
                    
                    {/* Change Password */}
                    <div className="p-4 bg-dark-hover rounded-xl">
                      <h4 className="text-white font-medium mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <FormField
                          label="Current Password"
                          name="currentPassword"
                          type="password"
                          value=""
                          onChange={() => {}}
                          icon={Lock}
                        />
                        <FormField
                          label="New Password"
                          name="newPassword"
                          type="password"
                          value=""
                          onChange={() => {}}
                          icon={Lock}
                        />
                        <FormField
                          label="Confirm New Password"
                          name="confirmPassword"
                          type="password"
                          value=""
                          onChange={() => {}}
                          icon={Lock}
                        />
                        <Touchable
                          onTap={() => {}}
                          hapticFeedback
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          Update Password
                        </Touchable>
                      </div>
                    </div>

                    {/* Sessions */}
                    <div className="p-4 bg-dark-hover rounded-xl">
                      <h4 className="text-white font-medium mb-4">Active Sessions</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-success-green rounded-full" />
                            <div>
                              <p className="text-white text-sm">Current session</p>
                              <p className="text-xs text-gray-400">Chrome on macOS • New York, NY</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">Active now</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gray-600 rounded-full" />
                            <div>
                              <p className="text-white text-sm">iPhone 14 Pro</p>
                              <p className="text-xs text-gray-400">Safari • 2 days ago</p>
                            </div>
                          </div>
                          <Touchable
                            onTap={() => {}}
                            hapticFeedback
                            className="text-xs text-error-red hover:text-error-red/80"
                          >
                            Revoke
                          </Touchable>
                        </div>
                      </div>
                      <Touchable
                        onTap={() => {}}
                        hapticFeedback
                        className="mt-4 w-full py-2 bg-dark-card text-gray-300 rounded-lg hover:bg-dark-hover transition-colors text-sm"
                      >
                        Sign out all other sessions
                      </Touchable>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="p-4 bg-dark-hover rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-colors ${
                          formData.twoFactorAuth ? 'bg-purple-500' : 'bg-dark-card'
                        }`}>
                          <motion.div
                            animate={{ x: formData.twoFactorAuth ? 24 : 0 }}
                            className="w-6 h-6 bg-white rounded-full shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Button */}
            {activeTab === 'edit' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-end"
              >
                <Touchable
                  onTap={handleSubmit}
                  hapticFeedback
                  disabled={isSubmitting || !hasChanges}
                  className={`
                    px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl
                    hover:shadow-lg transition-all flex items-center space-x-2
                    ${(isSubmitting || !hasChanges) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Touchable>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 glass-card px-6 py-4 rounded-xl flex items-center space-x-3"
          >
            <div className="w-8 h-8 rounded-full bg-success-green/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-success-green" />
            </div>
            <div>
              <p className="text-white font-medium">Changes saved!</p>
              <p className="text-xs text-gray-400">User profile updated successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full p-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-red/20 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-error-red" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">Delete User</h2>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to delete {formData.firstName} {formData.lastName}? 
                This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3">
                <Touchable
                  onTap={() => setShowDeleteConfirm(false)}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
                >
                  Cancel
                </Touchable>
                <Touchable
                  onTap={confirmDelete}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-error-red text-white rounded-xl hover:bg-error-red/80 transition-colors"
                >
                  Delete
                </Touchable>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Warning */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 glass-card px-6 py-3 rounded-full flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-warning-orange" />
            <span className="text-sm text-gray-300">You have unsaved changes</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to edit</span>
          <span>👆👆 Double tap to toggle</span>
          <span>🤏 Long press for options</span>
        </div>
      </div>
    </div>
  )
}

// Helper component for AtSign icon
const AtSign: React.FC<{ className?: string }> = ({ className }) => (
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
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </svg>
)

// Helper icons
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

export default UsersEditPage
