import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  UserPlus, Mail, Phone, Lock, Eye, EyeOff,
  Check, X, AlertCircle, Camera, Upload,
  Briefcase, MapPin, Globe, Calendar,
  ChevronLeft, ChevronRight, Save, Users,
  Shield, Award, Star, Sparkles, Zap,
  Github, Linkedin, Twitter, Facebook
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface FormData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string | null
  
  // Professional Info
  role: 'admin' | 'manager' | 'editor' | 'viewer'
  department: string
  position: string
  location: string
  timezone: string
  
  // Account Info
  username: string
  password: string
  confirmPassword: string
  
  // Permissions
  permissions: string[]
  
  // Social
  github: string
  linkedin: string
  twitter: string
  
  // Preferences
  receiveEmails: boolean
  twoFactorAuth: boolean
  darkMode: boolean
}

interface FormErrors {
  [key: string]: string
}

// ============================================================================
// AVATAR UPLOAD COMPONENT
// ============================================================================

interface AvatarUploadProps {
  avatar: string | null
  onAvatarChange: (avatar: string) => void
  error?: string
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatar, onAvatarChange, error }) => {
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onAvatarChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Touchable
        onTap={() => fileInputRef.current?.click()}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        hapticFeedback
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <UserPlus className="w-12 h-12 text-white" />
          </div>
        )}
        
        {/* Overlay */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <Camera className="w-8 h-8 text-white" />
        </motion.div>
      </Touchable>
      
      {error && (
        <p className="text-error-red text-sm mt-2">{error}</p>
      )}
      
      <p className="text-gray-400 text-xs mt-2">Tap to upload photo</p>
    </div>
  )
}

// ============================================================================
// FORM FIELD COMPONENT
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
  autoComplete
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-error-red">*</span>}
      </label>
      
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
          className={`
            w-full bg-dark-hover border rounded-xl py-3 text-white placeholder-gray-600
            focus:outline-none focus:ring-2 transition-all
            ${Icon ? 'pl-10' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
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
// SELECT FIELD COMPONENT
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
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  icon: Icon,
  required = false
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
          className={`
            w-full bg-dark-hover border rounded-xl py-3 text-white appearance-none
            focus:outline-none focus:ring-2 transition-all
            ${Icon ? 'pl-10' : 'pl-4'}
            pr-10
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
// PERMISSIONS GRID COMPONENT
// ============================================================================

interface PermissionsGridProps {
  selected: string[]
  onChange: (permissions: string[]) => void
}

const PermissionsGrid: React.FC<PermissionsGridProps> = ({ selected, onChange }) => {
  const permissions = [
    { id: 'read', label: 'Read', description: 'View content and data' },
    { id: 'write', label: 'Write', description: 'Create and edit content' },
    { id: 'delete', label: 'Delete', description: 'Remove content' },
    { id: 'publish', label: 'Publish', description: 'Publish content' },
    { id: 'manage_users', label: 'Manage Users', description: 'Create/edit users' },
    { id: 'manage_roles', label: 'Manage Roles', description: 'Assign roles' },
    { id: 'view_analytics', label: 'View Analytics', description: 'Access reports' },
    { id: 'manage_settings', label: 'Manage Settings', description: 'Change settings' },
    { id: 'export_data', label: 'Export Data', description: 'Export to CSV/PDF' },
    { id: 'api_access', label: 'API Access', description: 'Use API endpoints' },
  ]

  const togglePermission = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(p => p !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const selectAll = () => {
    onChange(permissions.map(p => p.id))
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          Permissions
        </label>
        <div className="flex items-center space-x-3">
          <Touchable
            onTap={selectAll}
            hapticFeedback
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Select All
          </Touchable>
          <span className="text-gray-600">|</span>
          <Touchable
            onTap={clearAll}
            hapticFeedback
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            Clear All
          </Touchable>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {permissions.map((permission) => (
          <Touchable
            key={permission.id}
            onTap={() => togglePermission(permission.id)}
            hapticFeedback
            className={`
              p-3 rounded-xl border transition-all
              ${selected.includes(permission.id)
                ? 'bg-purple-500/10 border-purple-500/30'
                : 'bg-dark-hover border-dark-border hover:border-purple-500/30'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                w-5 h-5 rounded-md flex items-center justify-center
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
}

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
// FORM STEP INDICATOR
// ============================================================================

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  titles: string[]
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  titles
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <React.Fragment key={i}>
            {/* Step circle */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: currentStep === i + 1 ? 1.2 : 1,
                  backgroundColor: i + 1 <= currentStep ? '#8B5CF6' : '#2A2A35'
                }}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${i + 1 <= currentStep ? 'bg-purple-500' : 'bg-dark-hover'}
                `}
              >
                {i + 1 < currentStep ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white font-medium">{i + 1}</span>
                )}
              </motion.div>
              <p className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                {titles[i]}
              </p>
            </div>

            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-dark-hover">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: i + 1 < currentStep ? '100%' : '0%' }}
                  className="h-full bg-purple-500"
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN USER CREATE PAGE
// ============================================================================

export const UsersCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const { triggerHaptic } = useGestures()
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: null,
    role: 'viewer',
    department: '',
    position: '',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    username: '',
    password: '',
    confirmPassword: '',
    permissions: [],
    github: '',
    linkedin: '',
    twitter: '',
    receiveEmails: true,
    twoFactorAuth: false,
    darkMode: true
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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

      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters'
        if (!/[a-z]/.test(value)) return 'Must contain lowercase letter'
        if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter'
        if (!/[0-9]/.test(value)) return 'Must contain number'
        break

      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match'
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
    const fieldsToValidate = currentStep === 1 
      ? ['firstName', 'lastName', 'email', 'phone']
      : currentStep === 2
        ? ['username', 'password', 'confirmPassword', 'department', 'position']
        : ['permissions']

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof FormData])
      if (error) newErrors[field] = error
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => ({ ...prev, [name]: finalValue }))
    
    // Real-time validation
    if (touched.has(name)) {
      const error = validateField(name, finalValue)
      setErrors(prev => error ? { ...prev, [name]: error } : { ...prev, [name]: undefined })
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => new Set(prev).add(name))
    const error = validateField(name, formData[name as keyof FormData])
    setErrors(prev => error ? { ...prev, [name]: error } : { ...prev, [name]: undefined })
  }

  const handleNext = () => {
    triggerHaptic([10])
    if (validateForm()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    triggerHaptic([10])
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    triggerHaptic([15, 10, 15])
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Navigate after success
    setTimeout(() => {
      navigate('/admin/users')
    }, 2000)
  }

  const stepTitles = ['Personal Info', 'Account Details', 'Permissions']

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Touchable
          onTap={() => navigate('/admin/users')}
          hapticFeedback
          className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </Touchable>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Create New User</h1>
          <p className="text-gray-400 text-sm mt-1">Add a new team member to your organization</p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {/* Step Indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={3}
            titles={stepTitles}
          />

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Avatar Upload */}
                <div className="flex justify-center mb-8">
                  <AvatarUpload
                    avatar={formData.avatar}
                    onAvatarChange={(avatar) => setFormData(prev => ({ ...prev, avatar }))}
                  />
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('firstName')}
                    error={errors.firstName}
                    icon={UserPlus}
                    required
                    placeholder="John"
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('lastName')}
                    error={errors.lastName}
                    icon={UserPlus}
                    required
                    placeholder="Doe"
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
                    placeholder="john.doe@company.com"
                    autoComplete="email"
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
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Account Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
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
                  placeholder="johndoe"
                  autoComplete="username"
                />

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormField
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      error={errors.password}
                      icon={Lock}
                      required
                      autoComplete="new-password"
                    />
                    <PasswordStrengthMeter password={formData.password} />
                  </div>
                  <FormField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    icon={Lock}
                    required
                    autoComplete="new-password"
                  />
                </div>

                {/* Role & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    error={errors.role}
                    icon={Shield}
                    required
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
                    placeholder="Engineering"
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
                    placeholder="Senior Developer"
                  />
                  <FormField
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    icon={MapPin}
                    placeholder="New York, NY"
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
              </motion.div>
            )}

            {/* Step 3: Permissions */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Permissions Grid */}
                <PermissionsGrid
                  selected={formData.permissions}
                  onChange={(perms) => setFormData(prev => ({ ...prev, permissions: perms }))}
                />

                {/* Social Links */}
                <div className="space-y-4 pt-6 border-t border-dark-border">
                  <h3 className="text-lg font-medium text-white">Social Profiles</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      label="GitHub"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      icon={Github}
                      placeholder="https://github.com/username"
                    />
                    <FormField
                      label="LinkedIn"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      icon={Linkedin}
                      placeholder="https://linkedin.com/in/username"
                    />
                    <FormField
                      label="Twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      icon={Twitter}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-4 pt-6 border-t border-dark-border">
                  <h3 className="text-lg font-medium text-white">Preferences</h3>
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
                      <span className="text-gray-300">Enable two-factor authentication</span>
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
                      <span className="text-gray-300">Use dark mode</span>
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-border">
            <Touchable
              onTap={currentStep === 1 ? () => navigate('/admin/users') : handleBack}
              hapticFeedback
              className="px-6 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
            </Touchable>

            <Touchable
              onTap={currentStep === 3 ? handleSubmit : handleNext}
              hapticFeedback
              disabled={isSubmitting}
              className={`
                px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl
                hover:shadow-lg transition-all flex items-center space-x-2
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === 3 ? 'Create User' : 'Next'}</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Touchable>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
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
              className="glass-card max-w-md w-full p-8 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success-green/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-success-green" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">User Created!</h2>
              <p className="text-gray-400 mb-6">
                {formData.firstName} {formData.lastName} has been successfully added to your team.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse" />
                <p className="text-sm text-gray-400">Redirecting to users list...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-6 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to select</span>
          <span>👆👆 Double tap to toggle</span>
          <span>🤏 Long press for info</span>
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

export default UsersCreatePage
