import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Globe, Calendar,
  Camera, Upload, X, Check, AlertCircle, Edit,
  Save, RotateCcw, AtSign, Briefcase, Award,
  Github, Linkedin, Twitter, Facebook, Instagram,
  Link as LinkIcon, Key, Shield, Bell, Moon,
  Sun, Clock, Languages, DollarSign, Percent,
  Star, Heart, ThumbsUp, MessageSquare
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface UserProfile {
  // Personal Info
  firstName: string
  lastName: string
  displayName: string
  email: string
  phone: string
  avatar: string
  coverImage: string
  bio: string
  birthday: string
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  
  // Professional Info
  jobTitle: string
  department: string
  company: string
 工作经验: string
  skills: string[]
  languages: string[]
  
  // Location
  country: string
  city: string
  address: string
  timezone: string
  workingHours: {
    start: string
    end: string
    timezone: string
  }
  
  // Social Links
  github: string
  linkedin: string
  twitter: string
  facebook: string
  instagram: string
  website: string
  
  // Preferences
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  twoFactorAuth: boolean
  darkMode: boolean
  language: string
  currency: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  
  // Metadata
  memberSince: string
  lastActive: string
  profileViews: number
  contributions: number
  endorsements: number
}

// ============================================================================
// MOCK USER DATA
// ============================================================================

const MOCK_USER: UserProfile = {
  // Personal Info
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop',
  bio: 'Senior Full Stack Developer with 8+ years of experience in building scalable web applications. Passionate about React, Node.js, and cloud architecture.',
  birthday: '1990-05-15',
  gender: 'male',
  
  // Professional Info
  jobTitle: 'Senior Full Stack Developer',
  department: 'Engineering',
  company: 'Tech Corp',
  工作经验: '8 years',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'GraphQL'],
  languages: ['English (Native)', 'Spanish (Conversational)', 'French (Basic)'],
  
  // Location
  country: 'United States',
  city: 'San Francisco',
  address: '123 Market St, Apt 4B',
  timezone: 'America/Los_Angeles',
  workingHours: {
    start: '09:00',
    end: '17:00',
    timezone: 'PST'
  },
  
  // Social Links
  github: 'https://github.com/johndoe',
  linkedin: 'https://linkedin.com/in/johndoe',
  twitter: 'https://twitter.com/johndoe',
  facebook: 'https://facebook.com/johndoe',
  instagram: 'https://instagram.com/johndoe',
  website: 'https://johndoe.dev',
  
  // Preferences
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  twoFactorAuth: true,
  darkMode: true,
  language: 'en',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  
  // Metadata
  memberSince: '2024-01-15',
  lastActive: '2024-03-15T10:30:00Z',
  profileViews: 1234,
  contributions: 156,
  endorsements: 89
}

// ============================================================================
// COUNTRIES AND TIMEZONES
// ============================================================================

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Japan', 'Brazil', 'India', 'Mexico'
]

const TIMEZONES = [
  'America/Los_Angeles (PST)',
  'America/Denver (MST)',
  'America/Chicago (CST)',
  'America/New_York (EST)',
  'Europe/London (GMT)',
  'Europe/Paris (CET)',
  'Asia/Tokyo (JST)',
  'Australia/Sydney (AEST)'
]

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
]

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
]

const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY' },
  { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY' }
]

// ============================================================================
// COVER IMAGE COMPONENT
// ============================================================================

interface CoverImageProps {
  coverImage: string
  onCoverChange: (cover: string) => void
  onCoverRemove: () => void
}

const CoverImage: React.FC<CoverImageProps> = ({
  coverImage,
  onCoverChange,
  onCoverRemove
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onCoverChange(reader.result as string)
        setShowOptions(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      className="relative h-48 rounded-t-2xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <img
        src={coverImage}
        alt="Cover"
        className="w-full h-full object-cover"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Edit overlay */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-black/50 flex items-center justify-center"
      >
        <Touchable
          onTap={() => setShowOptions(!showOptions)}
          hapticFeedback
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors flex items-center space-x-2"
        >
          <Camera className="w-5 h-5" />
          <span>Change Cover</span>
        </Touchable>
      </motion.div>

      {/* Options menu */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 glass-card rounded-xl overflow-hidden z-10"
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
              <span className="text-sm text-gray-300">Upload new cover</span>
            </Touchable>
            
            <Touchable
              onTap={() => {
                onCoverRemove()
                setShowOptions(false)
              }}
              hapticFeedback
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
            >
              <Trash2 className="w-4 h-4 text-error-red" />
              <span className="text-sm text-gray-300">Remove cover</span>
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
// AVATAR COMPONENT
// ============================================================================

interface AvatarProps {
  avatar: string
  onAvatarChange: (avatar: string) => void
  onAvatarRemove: () => void
}

const Avatar: React.FC<AvatarProps> = ({
  avatar,
  onAvatarChange,
  onAvatarRemove
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    <div className="relative -mt-16 ml-8 mb-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        className="relative w-32 h-32 rounded-full border-4 border-dark-card overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={avatar}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
          onClick={() => setShowOptions(!showOptions)}
        >
          <Camera className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Options menu */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 glass-card rounded-xl overflow-hidden z-10 min-w-[160px]"
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
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: number
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <Touchable
      onTap={() => console.log('Stat card tapped')}
      hapticFeedback
      className="glass-card p-4 flex items-center space-x-3 hover:scale-105 transition-transform"
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </Touchable>
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
  icon?: React.ElementType
  placeholder?: string
  disabled?: boolean
  helper?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  placeholder,
  disabled = false,
  helper
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
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
          disabled={disabled}
          className={`
            w-full bg-dark-hover border rounded-xl py-3 text-white placeholder-gray-600
            focus:outline-none focus:ring-2 transition-all
            ${Icon ? 'pl-10' : 'pl-4'}
            pr-4
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isFocused 
              ? 'border-purple-500 focus:ring-purple-500/20' 
              : 'border-dark-border'
            }
          `}
        />
      </div>
      
      {helper && (
        <p className="text-xs text-gray-500">{helper}</p>
      )}
    </div>
  )
}

// ============================================================================
// SELECT FIELD COMPONENT
// ============================================================================

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; icon?: string }[]
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
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
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
            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
          `}
        >
          <span>{options.find(o => o.value === value)?.label || 'Select...'}</span>
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
                  {option.icon && <span className="text-xl">{option.icon}</span>}
                  <span className="text-sm text-gray-300">{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-purple-400 ml-auto" />
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
// SKILLS INPUT COMPONENT
// ============================================================================

interface SkillsInputProps {
  skills: string[]
  onChange: (skills: string[]) => void
}

const SkillsInput: React.FC<SkillsInputProps> = ({ skills, onChange }) => {
  const [inputValue, setInputValue] = useState('')

  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      onChange([...skills, inputValue.trim()])
      setInputValue('')
    }
  }

  const removeSkill = (skill: string) => {
    onChange(skills.filter(s => s !== skill))
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">Skills</label>
      
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Add a skill (e.g., React)"
          className="flex-1 bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
        />
        <Touchable
          onTap={addSkill}
          hapticFeedback
          className="p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </Touchable>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <motion.div
            key={skill}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="group relative"
          >
            <span className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-sm">
              {skill}
            </span>
            <Touchable
              onTap={() => removeSkill(skill)}
              hapticFeedback
              className="absolute -top-1 -right-1 w-5 h-5 bg-error-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white" />
            </Touchable>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// TIME RANGE PICKER COMPONENT
// ============================================================================

interface TimeRangePickerProps {
  start: string
  end: string
  onStartChange: (time: string) => void
  onEndChange: (time: string) => void
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  start,
  end,
  onStartChange,
  onEndChange
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="time"
        value={start}
        onChange={(e) => onStartChange(e.target.value)}
        className="flex-1 bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
      />
      <span className="text-gray-400">to</span>
      <input
        type="time"
        value={end}
        onChange={(e) => onEndChange(e.target.value)}
        className="flex-1 bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
      />
    </div>
  )
}

// ============================================================================
// MAIN PROFILE SETTINGS PAGE
// ============================================================================

export const SettingsProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER)
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('personal')

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'social', label: 'Social Links', icon: LinkIcon },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ]

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    setShowSuccess(true)
    setHasChanges(false)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleReset = () => {
    setProfile(MOCK_USER)
    setHasChanges(false)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <>
              <Touchable
                onTap={handleReset}
                hapticFeedback
                className="px-4 py-2 glass-card hover:bg-dark-hover rounded-xl transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Reset</span>
              </Touchable>
              
              <Touchable
                onTap={handleSave}
                hapticFeedback
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </Touchable>
            </>
          )}
          
          <Touchable
            onTap={() => setIsEditing(!isEditing)}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <Edit className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-card overflow-hidden">
        {/* Cover Image */}
        <CoverImage
          coverImage={profile.coverImage}
          onCoverChange={(cover) => handleChange('coverImage', cover)}
          onCoverRemove={() => handleChange('coverImage', 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop')}
        />

        {/* Avatar and Stats */}
        <div className="relative">
          <Avatar
            avatar={profile.avatar}
            onAvatarChange={(avatar) => handleChange('avatar', avatar)}
            onAvatarRemove={() => handleChange('avatar', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop')}
          />

          {/* Stats Row */}
          <div className="absolute top-4 right-8 flex items-center space-x-4">
            <StatCard
              icon={Eye}
              label="Profile Views"
              value={profile.profileViews}
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              icon={Star}
              label="Contributions"
              value={profile.contributions}
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              icon={ThumbsUp}
              label="Endorsements"
              value={profile.endorsements}
              color="from-green-500 to-emerald-500"
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="px-8 border-b border-dark-border">
          <div className="flex items-center space-x-6">
            {sections.map((section) => (
              <Touchable
                key={section.id}
                onTap={() => setActiveSection(section.id)}
                hapticFeedback
                className={`
                  flex items-center space-x-2 py-4 border-b-2 transition-colors
                  ${activeSection === section.id
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                  }
                `}
              >
                <section.icon className="w-5 h-5" />
                <span>{section.label}</span>
              </Touchable>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* Personal Info Section */}
            {activeSection === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    icon={User}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    icon={User}
                    disabled={!isEditing}
                  />
                </div>

                <FormField
                  label="Display Name"
                  name="displayName"
                  value={profile.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  icon={AtSign}
                  disabled={!isEditing}
                  helper="This is how your name will appear"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    icon={Mail}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    icon={Phone}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Birthday"
                    name="birthday"
                    type="date"
                    value={profile.birthday}
                    onChange={(e) => handleChange('birthday', e.target.value)}
                    icon={Calendar}
                    disabled={!isEditing}
                  />
                  <SelectField
                    label="Gender"
                    value={profile.gender}
                    onChange={(value) => handleChange('gender', value as any)}
                    icon={User}
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none disabled:opacity-50"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </motion.div>
            )}

            {/* Professional Info Section */}
            {activeSection === 'professional' && (
              <motion.div
                key="professional"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Job Title"
                    name="jobTitle"
                    value={profile.jobTitle}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                    icon={Briefcase}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Department"
                    name="department"
                    value={profile.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    icon={Award}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Company"
                    name="company"
                    value={profile.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    icon={Briefcase}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Experience"
                    name="experience"
                    value={profile.工作经验}
                    onChange={(e) => handleChange('工作经验', e.target.value)}
                    icon={Clock}
                    disabled={!isEditing}
                  />
                </div>

                <SkillsInput
                  skills={profile.skills}
                  onChange={(skills) => handleChange('skills', skills)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Languages</label>
                  <div className="space-y-2">
                    {profile.languages.map((lang, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={lang}
                          onChange={(e) => {
                            const newLanguages = [...profile.languages]
                            newLanguages[index] = e.target.value
                            handleChange('languages', newLanguages)
                          }}
                          disabled={!isEditing}
                          className="flex-1 bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                        />
                        <Touchable
                          onTap={() => {
                            const newLanguages = profile.languages.filter((_, i) => i !== index)
                            handleChange('languages', newLanguages)
                          }}
                          hapticFeedback
                          className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-error-red" />
                        </Touchable>
                      </div>
                    ))}
                    <Touchable
                      onTap={() => handleChange('languages', [...profile.languages, ''])}
                      hapticFeedback
                      className="flex items-center space-x-2 text-purple-400 hover:text-purple-300"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Language</span>
                    </Touchable>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Location Section */}
            {activeSection === 'location' && (
              <motion.div
                key="location"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Country"
                    value={profile.country}
                    onChange={(value) => handleChange('country', value)}
                    icon={Globe}
                    options={COUNTRIES.map(c => ({ value: c, label: c }))}
                  />
                  <FormField
                    label="City"
                    name="city"
                    value={profile.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    icon={MapPin}
                    disabled={!isEditing}
                  />
                </div>

                <FormField
                  label="Address"
                  name="address"
                  value={profile.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  icon={MapPin}
                  disabled={!isEditing}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Timezone"
                    value={profile.timezone}
                    onChange={(value) => handleChange('timezone', value)}
                    icon={Clock}
                    options={TIMEZONES.map(tz => ({ value: tz, label: tz }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Working Hours
                    </label>
                    <TimeRangePicker
                      start={profile.workingHours.start}
                      end={profile.workingHours.end}
                      onStartChange={(time) => handleChange('workingHours', { ...profile.workingHours, start: time })}
                      onEndChange={(time) => handleChange('workingHours', { ...profile.workingHours, end: time })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Social Links Section */}
            {activeSection === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="GitHub"
                    name="github"
                    value={profile.github}
                    onChange={(e) => handleChange('github', e.target.value)}
                    icon={Github}
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                  />
                  <FormField
                    label="LinkedIn"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    icon={Linkedin}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Twitter"
                    name="twitter"
                    value={profile.twitter}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    icon={Twitter}
                    disabled={!isEditing}
                    placeholder="https://twitter.com/username"
                  />
                  <FormField
                    label="Facebook"
                    name="facebook"
                    value={profile.facebook}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    icon={Facebook}
                    disabled={!isEditing}
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Instagram"
                    name="instagram"
                    value={profile.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value)}
                    icon={Instagram}
                    disabled={!isEditing}
                    placeholder="https://instagram.com/username"
                  />
                  <FormField
                    label="Personal Website"
                    name="website"
                    value={profile.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    icon={LinkIcon}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </motion.div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Notification Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Notifications</h3>
                  
                  <Touchable
                    onTap={() => handleChange('emailNotifications', !profile.emailNotifications)}
                    hapticFeedback
                    className="flex items-center justify-between p-4 bg-dark-hover rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Email Notifications</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      profile.emailNotifications ? 'bg-purple-500' : 'bg-dark-card'
                    }`}>
                      <motion.div
                        animate={{ x: profile.emailNotifications ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </div>
                  </Touchable>

                  <Touchable
                    onTap={() => handleChange('pushNotifications', !profile.pushNotifications)}
                    hapticFeedback
                    className="flex items-center justify-between p-4 bg-dark-hover rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Push Notifications</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      profile.pushNotifications ? 'bg-purple-500' : 'bg-dark-card'
                    }`}>
                      <motion.div
                        animate={{ x: profile.pushNotifications ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </div>
                  </Touchable>

                  <Touchable
                    onTap={() => handleChange('smsNotifications', !profile.smsNotifications)}
                    hapticFeedback
                    className="flex items-center justify-between p-4 bg-dark-hover rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">SMS Notifications</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      profile.smsNotifications ? 'bg-purple-500' : 'bg-dark-card'
                    }`}>
                      <motion.div
                        animate={{ x: profile.smsNotifications ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </div>
                  </Touchable>
                </div>

                {/* Security Preferences */}
                <div className="space-y-4 pt-4 border-t border-dark-border">
                  <h3 className="text-lg font-medium text-white">Security</h3>
                  
                  <Touchable
                    onTap={() => handleChange('twoFactorAuth', !profile.twoFactorAuth)}
                    hapticFeedback
                    className="flex items-center justify-between p-4 bg-dark-hover rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Two-Factor Authentication</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      profile.twoFactorAuth ? 'bg-purple-500' : 'bg-dark-card'
                    }`}>
                      <motion.div
                        animate={{ x: profile.twoFactorAuth ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </div>
                  </Touchable>
                </div>

                {/* Display Preferences */}
                <div className="space-y-4 pt-4 border-t border-dark-border">
                  <h3 className="text-lg font-medium text-white">Display</h3>
                  
                  <Touchable
                    onTap={() => handleChange('darkMode', !profile.darkMode)}
                    hapticFeedback
                    className="flex items-center justify-between p-4 bg-dark-hover rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      {profile.darkMode ? (
                        <Moon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-gray-300">Dark Mode</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      profile.darkMode ? 'bg-purple-500' : 'bg-dark-card'
                    }`}>
                      <motion.div
                        animate={{ x: profile.darkMode ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </div>
                  </Touchable>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      label="Language"
                      value={profile.language}
                      onChange={(value) => handleChange('language', value)}
                      icon={Globe}
                      options={LANGUAGES.map(l => ({ 
                        value: l.code, 
                        label: l.name,
                        icon: l.flag 
                      }))}
                    />

                    <SelectField
                      label="Currency"
                      value={profile.currency}
                      onChange={(value) => handleChange('currency', value)}
                      icon={DollarSign}
                      options={CURRENCIES.map(c => ({ 
                        value: c.code, 
                        label: `${c.symbol} ${c.name}` 
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      label="Date Format"
                      value={profile.dateFormat}
                      onChange={(value) => handleChange('dateFormat', value)}
                      icon={Calendar}
                      options={DATE_FORMATS.map(df => ({ value: df.value, label: df.label }))}
                    />

                    <SelectField
                      label="Time Format"
                      value={profile.timeFormat}
                      onChange={(value) => handleChange('timeFormat', value as any)}
                      icon={Clock}
                      options={[
                        { value: '12h', label: '12-hour (2:30 PM)' },
                        { value: '24h', label: '24-hour (14:30)' }
                      ]}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              <p className="text-white font-medium">Profile Updated!</p>
              <p className="text-xs text-gray-400">Your changes have been saved</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to edit</span>
          <span>👆👆 Double tap toggle</span>
          <span>🤏 Long press for options</span>
        </div>
      </div>
    </div>
  )
}

export default SettingsProfilePage
