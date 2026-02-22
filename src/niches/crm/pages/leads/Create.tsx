import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  UserPlus, Mail, Phone, Building2, Briefcase,
  Globe, Linkedin, Twitter, Save, X,
  ChevronLeft, Check, AlertCircle, Upload,
  Star, Award, DollarSign, Tag
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface LeadFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  website: string
  linkedin: string
  twitter: string
  source: 'website' | 'referral' | 'linkedin' | 'call' | 'email' | 'other'
  value: number
  tags: string[]
  notes: string
}

// ============================================================================
// FORM FIELD
// ============================================================================

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: React.ElementType
  required?: boolean
  placeholder?: string
  error?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  required,
  placeholder,
  error
}) => {
  const [isFocused, setIsFocused] = useState(false)

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
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full bg-dark-hover border rounded-xl py-3 text-white placeholder-gray-600
            focus:outline-none focus:ring-2 transition-all
            ${Icon ? 'pl-10' : 'pl-4'} pr-4
            ${error 
              ? 'border-error-red focus:border-error-red focus:ring-error-red/20' 
              : isFocused 
                ? 'border-green-500 focus:ring-green-500/20' 
                : 'border-dark-border'
            }
          `}
        />
      </div>
      {error && (
        <p className="text-error-red text-sm flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

// ============================================================================
// SELECT FIELD
// ============================================================================

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  icon?: React.ElementType
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  icon: Icon
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
        )}
        
        <Touchable
          onTap={() => setIsOpen(!isOpen)}
          hapticFeedback
          className={`
            w-full bg-dark-hover border border-dark-border rounded-xl py-3 px-4
            text-white text-left flex items-center justify-between
            ${Icon ? 'pl-10' : 'pl-4'}
            focus:border-green-500 focus:ring-2 focus:ring-green-500/20
          `}
        >
          <span>{options.find(o => o.value === value)?.label || 'Select source...'}</span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Touchable>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-10"
            >
              {options.map((option) => (
                <Touchable
                  key={option.value}
                  onTap={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  hapticFeedback
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
                >
                  <span className="text-sm text-gray-300">{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-green-400 ml-auto" />
                  )}
                </Touchable>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// TAGS INPUT
// ============================================================================

interface TagsInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('')

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onChange([...tags, inputValue.trim()])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Tags</label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTag()}
          placeholder="Add tags (e.g., enterprise, tech, hot)"
          className="flex-1 bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
        />
        <Touchable
          onTap={addTag}
          hapticFeedback
          className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </Touchable>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm"
          >
            <span>{tag}</span>
            <Touchable
              onTap={() => removeTag(tag)}
              hapticFeedback
              className="p-0.5 hover:bg-green-500/20 rounded"
            >
              <X className="w-3 h-3" />
            </Touchable>
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN LEAD CREATE PAGE
// ============================================================================

export const LeadsCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const { triggerHaptic } = useGestures()

  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    website: '',
    linkedin: '',
    twitter: '',
    source: 'website',
    value: 0,
    tags: [],
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const sources = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'call', label: 'Inbound Call' },
    { value: 'email', label: 'Email' },
    { value: 'other', label: 'Other' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.company) newErrors.company = 'Company is required'
    if (!formData.position) newErrors.position = 'Position is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    triggerHaptic([15, 10, 15])
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    setTimeout(() => {
      navigate('/crm/leads')
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Touchable
          onTap={() => navigate('/crm/leads')}
          hapticFeedback
          className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </Touchable>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Add New Lead</h1>
          <p className="text-gray-400 text-sm mt-1">Create a new lead in your CRM</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                icon={UserPlus}
                required
                error={errors.firstName}
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                icon={UserPlus}
                required
                error={errors.lastName}
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
                error={errors.email}
              />
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
              />
            </div>

            {/* Company & Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                icon={Building2}
                required
                error={errors.company}
              />
              <FormField
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                icon={Briefcase}
                required
                error={errors.position}
              />
            </div>

            {/* Social & Web */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                icon={Globe}
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

            {/* Source & Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Lead Source"
                value={formData.source}
                onChange={(value) => setFormData(prev => ({ ...prev, source: value as any }))}
                options={sources}
                icon={Globe}
              />
              <FormField
                label="Estimated Value ($)"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                icon={DollarSign}
              />
            </div>

            {/* Tags */}
            <TagsInput
              tags={formData.tags}
              onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
            />

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Add any additional notes about this lead..."
                className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-dark-border">
            <Touchable
              onTap={() => navigate('/crm/leads')}
              hapticFeedback
              className="px-6 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
            >
              Cancel
            </Touchable>
            <Touchable
              onTap={handleSubmit}
              hapticFeedback
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Create Lead</span>
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
              <h2 className="text-2xl font-bold text-white mb-2">Lead Created!</h2>
              <p className="text-gray-400 mb-6">
                {formData.firstName} {formData.lastName} has been added to your leads.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse" />
                <p className="text-sm text-gray-400">Redirecting to leads list...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to fill</span>
          <span>➕ Add tags</span>
          <span>💾 Auto-save</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const Plus: React.FC<{ className?: string }> = ({ className }) => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const Linkedin: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const Twitter: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)
