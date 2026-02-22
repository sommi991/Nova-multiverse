import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Mail, MessageSquare, Smartphone, Globe,
  Check, X, AlertCircle, Clock, Calendar,
  Volume2, VolumeX, Vibrate, Moon, Sun,
  Zap, Star, Award, Heart, ThumbsUp,
  ShoppingBag, Users, Settings, Shield,
  Eye, EyeOff, Download, Upload, RefreshCw,
  ChevronRight, ChevronLeft, Plus, Trash2
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface NotificationChannel {
  id: string
  name: string
  description: string
  icon: React.ElementType
  enabled: boolean
  color: string
}

interface NotificationType {
  id: string
  name: string
  description: string
  channels: {
    email: boolean
    push: boolean
    sms: boolean
    inApp: boolean
  }
  importance: 'low' | 'medium' | 'high' | 'critical'
}

interface QuietHours {
  enabled: boolean
  start: string
  end: string
  timezone: string
  days: number[]
}

interface NotificationTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: string
  lastEdited: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  {
    id: 'email',
    name: 'Email',
    description: 'Receive notifications via email',
    icon: Mail,
    enabled: true,
    color: 'blue'
  },
  {
    id: 'push',
    name: 'Push Notifications',
    description: 'Browser and mobile push notifications',
    icon: Bell,
    enabled: true,
    color: 'purple'
  },
  {
    id: 'sms',
    name: 'SMS',
    description: 'Text message notifications',
    icon: MessageSquare,
    enabled: false,
    color: 'green'
  },
  {
    id: 'inApp',
    name: 'In-App',
    description: 'Notifications within the dashboard',
    icon: Globe,
    enabled: true,
    color: 'orange'
  }
]

const NOTIFICATION_TYPES: NotificationType[] = [
  {
    id: 'security',
    name: 'Security Alerts',
    description: 'Login attempts, password changes, 2FA updates',
    channels: {
      email: true,
      push: true,
      sms: true,
      inApp: true
    },
    importance: 'critical'
  },
  {
    id: 'account',
    name: 'Account Updates',
    description: 'Profile changes, email updates, preferences',
    channels: {
      email: true,
      push: false,
      sms: false,
      inApp: true
    },
    importance: 'high'
  },
  {
    id: 'billing',
    name: 'Billing & Payments',
    description: 'Invoices, payment confirmations, subscription updates',
    channels: {
      email: true,
      push: true,
      sms: false,
      inApp: true
    },
    importance: 'high'
  },
  {
    id: 'team',
    name: 'Team Activity',
    description: 'Team member actions, role changes, invitations',
    channels: {
      email: true,
      push: true,
      sms: false,
      inApp: true
    },
    importance: 'medium'
  },
  {
    id: 'marketing',
    name: 'Marketing & Promotions',
    description: 'Product updates, features, special offers',
    channels: {
      email: true,
      push: false,
      sms: false,
      inApp: false
    },
    importance: 'low'
  },
  {
    id: 'system',
    name: 'System Updates',
    description: 'Maintenance, downtime, new features',
    channels: {
      email: true,
      push: true,
      sms: false,
      inApp: true
    },
    importance: 'medium'
  }
]

const MOCK_TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to the platform, {{name}}!',
    body: 'Hello {{name}},\n\nWelcome to our platform! We\'re excited to have you on board...',
    type: 'email',
    lastEdited: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Password Reset',
    subject: 'Reset your password',
    body: 'Click the link below to reset your password...',
    type: 'email',
    lastEdited: '2024-03-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Login Alert',
    subject: 'New login detected',
    body: 'A new login was detected from {{location}} using {{device}}.',
    type: 'push',
    lastEdited: '2024-03-13T09:20:00Z'
  }
]

// ============================================================================
// NOTIFICATION PREVIEW COMPONENT
// ============================================================================

interface NotificationPreviewProps {
  type: 'email' | 'push' | 'sms' | 'inApp'
  title: string
  message: string
  time?: string
  icon?: React.ElementType
  onClose?: () => void
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({
  type,
  title,
  message,
  time = 'Just now',
  icon: Icon = Bell,
  onClose
}) => {
  const getPreviewStyle = () => {
    switch (type) {
      case 'email':
        return 'max-w-md bg-white text-gray-900'
      case 'push':
        return 'max-w-sm glass-card text-white'
      case 'sms':
        return 'max-w-xs bg-green-500 text-white rounded-2xl'
      case 'inApp':
        return 'max-w-sm glass-card text-white border-l-4 border-purple-500'
      default:
        return 'glass-card text-white'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`relative rounded-xl shadow-2xl overflow-hidden ${getPreviewStyle()}`}
    >
      {onClose && (
        <Touchable
          onTap={onClose}
          hapticFeedback
          className="absolute top-3 right-3 p-1 hover:bg-black/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </Touchable>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 rounded-lg ${
            type === 'email' ? 'bg-blue-500' :
            type === 'push' ? 'bg-purple-500' :
            type === 'sms' ? 'bg-green-500' :
            'bg-orange-500'
          }`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs opacity-75">{time}</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm opacity-90">{message}</p>

        {/* Email specific */}
        {type === 'email' && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Mail className="w-3 h-3" />
              <span>To: john.doe@example.com</span>
            </div>
          </div>
        )}

        {/* Push specific */}
        {type === 'push' && (
          <div className="mt-3 flex items-center space-x-2 text-xs opacity-75">
            <Smartphone className="w-3 h-3" />
            <span>via Chrome • MacBook Pro</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// CHANNEL CARD COMPONENT
// ============================================================================

interface ChannelCardProps {
  channel: NotificationChannel
  onToggle: () => void
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onToggle }) => {
  const Icon = channel.icon

  return (
    <Touchable
      onTap={onToggle}
      onDoubleTap={() => console.log('Double tap - configure channel')}
      onLongPress={() => console.log('Long press - show options')}
      hapticFeedback
      className={`glass-card p-4 hover:scale-105 transition-transform ${
        channel.enabled ? `ring-2 ring-${channel.color}-500` : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl bg-${channel.color}-500/20`}>
          <Icon className={`w-6 h-6 text-${channel.color}-400`} />
        </div>
        <div className={`w-12 h-6 rounded-full transition-colors ${
          channel.enabled ? 'bg-purple-500' : 'bg-dark-card'
        }`}>
          <motion.div
            animate={{ x: channel.enabled ? 24 : 0 }}
            className="w-6 h-6 bg-white rounded-full shadow-lg"
          />
        </div>
      </div>
      <h3 className="text-white font-medium mb-1">{channel.name}</h3>
      <p className="text-sm text-gray-400">{channel.description}</p>
    </Touchable>
  )
}

// ============================================================================
// NOTIFICATION TYPE ROW COMPONENT
// ============================================================================

interface NotificationTypeRowProps {
  type: NotificationType
  onChannelToggle: (channelId: keyof NotificationType['channels']) => void
}

const NotificationTypeRow: React.FC<NotificationTypeRowProps> = ({
  type,
  onChannelToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-error-red/10 text-error-red'
      case 'high': return 'bg-warning-orange/10 text-warning-orange'
      case 'medium': return 'bg-blue-500/10 text-blue-400'
      case 'low': return 'bg-gray-500/10 text-gray-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  return (
    <div className="border border-dark-border rounded-xl overflow-hidden">
      {/* Main row */}
      <Touchable
        onTap={() => setIsExpanded(!isExpanded)}
        hapticFeedback
        className="w-full flex items-center justify-between p-4 bg-dark-hover hover:bg-dark-card transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h4 className="text-white font-medium">{type.name}</h4>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getImportanceColor(type.importance)}`}>
              {type.importance}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{type.description}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </Touchable>

      {/* Expanded channels */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-dark-border"
          >
            <div className="p-4 space-y-4">
              {/* Email toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Email</span>
                </div>
                <Touchable
                  onTap={() => onChannelToggle('email')}
                  hapticFeedback
                  className={`w-12 h-6 rounded-full transition-colors ${
                    type.channels.email ? 'bg-purple-500' : 'bg-dark-card'
                  }`}
                >
                  <motion.div
                    animate={{ x: type.channels.email ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </Touchable>
              </div>

              {/* Push toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Push</span>
                </div>
                <Touchable
                  onTap={() => onChannelToggle('push')}
                  hapticFeedback
                  className={`w-12 h-6 rounded-full transition-colors ${
                    type.channels.push ? 'bg-purple-500' : 'bg-dark-card'
                  }`}
                >
                  <motion.div
                    animate={{ x: type.channels.push ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </Touchable>
              </div>

              {/* SMS toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">SMS</span>
                </div>
                <Touchable
                  onTap={() => onChannelToggle('sms')}
                  hapticFeedback
                  className={`w-12 h-6 rounded-full transition-colors ${
                    type.channels.sms ? 'bg-purple-500' : 'bg-dark-card'
                  }`}
                >
                  <motion.div
                    animate={{ x: type.channels.sms ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </Touchable>
              </div>

              {/* In-App toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">In-App</span>
                </div>
                <Touchable
                  onTap={() => onChannelToggle('inApp')}
                  hapticFeedback
                  className={`w-12 h-6 rounded-full transition-colors ${
                    type.channels.inApp ? 'bg-purple-500' : 'bg-dark-card'
                  }`}
                >
                  <motion.div
                    animate={{ x: type.channels.inApp ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </Touchable>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// QUIET HOURS COMPONENT
// ============================================================================

interface QuietHoursProps {
  settings: QuietHours
  onUpdate: (settings: QuietHours) => void
}

const QuietHoursComponent: React.FC<QuietHoursProps> = ({ settings, onUpdate }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const toggleDay = (dayIndex: number) => {
    const newDays = settings.days.includes(dayIndex)
      ? settings.days.filter(d => d !== dayIndex)
      : [...settings.days, dayIndex].sort()
    onUpdate({ ...settings, days: newDays })
  }

  return (
    <div className="space-y-4">
      {/* Enable toggle */}
      <div className="flex items-center justify-between p-4 bg-dark-hover rounded-xl">
        <div className="flex items-center space-x-3">
          <Moon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-300">Quiet Hours</span>
        </div>
        <Touchable
          onTap={() => onUpdate({ ...settings, enabled: !settings.enabled })}
          hapticFeedback
          className={`w-12 h-6 rounded-full transition-colors ${
            settings.enabled ? 'bg-purple-500' : 'bg-dark-card'
          }`}
        >
          <motion.div
            animate={{ x: settings.enabled ? 24 : 0 }}
            className="w-6 h-6 bg-white rounded-full shadow-lg"
          />
        </Touchable>
      </div>

      <AnimatePresence>
        {settings.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Time range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Start Time</label>
                <input
                  type="time"
                  value={settings.start}
                  onChange={(e) => onUpdate({ ...settings, start: e.target.value })}
                  className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">End Time</label>
                <input
                  type="time"
                  value={settings.end}
                  onChange={(e) => onUpdate({ ...settings, end: e.target.value })}
                  className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Days selector */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Apply on</label>
              <div className="flex flex-wrap gap-2">
                {days.map((day, index) => (
                  <Touchable
                    key={day}
                    onTap={() => toggleDay(index)}
                    hapticFeedback
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center font-medium transition-colors
                      ${settings.days.includes(index)
                        ? 'bg-purple-500 text-white'
                        : 'bg-dark-hover text-gray-400 hover:text-white'
                      }
                    `}
                  >
                    {day}
                  </Touchable>
                ))}
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => onUpdate({ ...settings, timezone: e.target.value })}
                className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                <option value="Europe/Paris">Central European Time (CET)</option>
                <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// TEMPLATE CARD COMPONENT
// ============================================================================

interface TemplateCardProps {
  template: NotificationTemplate
  onEdit: () => void
  onPreview: () => void
  onDelete: () => void
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onPreview,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="relative">
      <Touchable
        onTap={onEdit}
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-4 block hover:scale-105 transition-transform"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              {template.type === 'email' ? (
                <Mail className="w-5 h-5 text-purple-400" />
              ) : (
                <Bell className="w-5 h-5 text-purple-400" />
              )}
            </div>
            <div>
              <h4 className="text-white font-medium">{template.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{template.subject}</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(template.lastEdited).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{template.body}</p>
      </Touchable>

      {/* Quick actions overlay */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 glass-card flex items-center justify-center space-x-4"
          >
            <Touchable
              onTap={() => {
                onPreview()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Eye className="w-5 h-5 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onEdit()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
            >
              <Edit className="w-5 h-5 text-purple-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onDelete()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-error-red/20 rounded-full hover:bg-error-red/30 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-error-red" />
            </Touchable>
            <Touchable
              onTap={() => setShowActions(false)}
              hapticFeedback
              className="absolute top-2 right-2 p-2 bg-dark-hover rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </Touchable>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// MAIN NOTIFICATIONS SETTINGS PAGE
// ============================================================================

export const SettingsNotificationsPage: React.FC = () => {
  const [channels, setChannels] = useState(NOTIFICATION_CHANNELS)
  const [types, setTypes] = useState(NOTIFICATION_TYPES)
  const [quietHours, setQuietHours] = useState<QuietHours>({
    enabled: false,
    start: '22:00',
    end: '07:00',
    timezone: 'America/New_York',
    days: [1, 2, 3, 4, 5] // Mon-Fri
  })
  const [templates, setTemplates] = useState(MOCK_TEMPLATES)
  const [previewType, setPreviewType] = useState<'email' | 'push' | 'sms' | 'inApp' | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [doNotDisturb, setDoNotDisturb] = useState(false)

  const handleChannelToggle = (channelId: string) => {
    setChannels(prev =>
      prev.map(ch =>
        ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch
      )
    )
  }

  const handleTypeChannelToggle = (
    typeId: string,
    channelId: keyof NotificationType['channels']
  ) => {
    setTypes(prev =>
      prev.map(type =>
        type.id === typeId
          ? {
              ...type,
              channels: {
                ...type.channels,
                [channelId]: !type.channels[channelId]
              }
            }
          : type
      )
    )
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Notification Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage how and when you receive notifications
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Channels Grid */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Notification Channels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onToggle={() => handleChannelToggle(channel.id)}
              />
            ))}
          </div>
        </div>

        {/* Global Settings */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Global Settings</h2>
          
          <div className="space-y-4">
            {/* Sound toggle */}
            <div className="flex items-center justify-between p-4 bg-dark-hover rounded-xl">
              <div className="flex items-center space-x-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-gray-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-gray-300">Notification Sounds</span>
              </div>
              <Touchable
                onTap={() => setSoundEnabled(!soundEnabled)}
                hapticFeedback
                className={`w-12 h-6 rounded-full transition-colors ${
                  soundEnabled ? 'bg-purple-500' : 'bg-dark-card'
                }`}
              >
                <motion.div
                  animate={{ x: soundEnabled ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </Touchable>
            </div>

            {/* Vibration toggle */}
            <div className="flex items-center justify-between p-4 bg-dark-hover rounded-xl">
              <div className="flex items-center space-x-3">
                <Vibrate className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Vibration</span>
              </div>
              <Touchable
                onTap={() => setVibrationEnabled(!vibrationEnabled)}
                hapticFeedback
                className={`w-12 h-6 rounded-full transition-colors ${
                  vibrationEnabled ? 'bg-purple-500' : 'bg-dark-card'
                }`}
              >
                <motion.div
                  animate={{ x: vibrationEnabled ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </Touchable>
            </div>

            {/* Do Not Disturb toggle */}
            <div className="flex items-center justify-between p-4 bg-dark-hover rounded-xl">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Do Not Disturb</span>
              </div>
              <Touchable
                onTap={() => setDoNotDisturb(!doNotDisturb)}
                hapticFeedback
                className={`w-12 h-6 rounded-full transition-colors ${
                  doNotDisturb ? 'bg-purple-500' : 'bg-dark-card'
                }`}
              >
                <motion.div
                  animate={{ x: doNotDisturb ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </Touchable>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Quiet Hours</h2>
          <QuietHoursComponent settings={quietHours} onUpdate={setQuietHours} />
        </div>

        {/* Notification Types */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Notification Types</h2>
          <div className="space-y-3">
            {types.map((type) => (
              <NotificationTypeRow
                key={type.id}
                type={type}
                onChannelToggle={(channelId) => handleTypeChannelToggle(type.id, channelId)}
              />
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Notification Templates</h2>
            <Touchable
              onTap={() => console.log('Create template')}
              hapticFeedback
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </Touchable>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={() => console.log('Edit template', template.id)}
                onPreview={() => setPreviewType(template.type as any)}
                onDelete={() => setTemplates(prev => prev.filter(t => t.id !== template.id))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewType(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {previewType === 'email' && (
                <NotificationPreview
                  type="email"
                  title="Welcome to the platform!"
                  message="Hello John, welcome to our platform! We're excited to have you on board. Get started by completing your profile."
                  icon={Mail}
                  onClose={() => setPreviewType(null)}
                />
              )}
              {previewType === 'push' && (
                <NotificationPreview
                  type="push"
                  title="New login detected"
                  message="A new login was detected from San Francisco using Chrome on MacBook Pro."
                  icon={Bell}
                  onClose={() => setPreviewType(null)}
                />
              )}
              {previewType === 'sms' && (
                <NotificationPreview
                  type="sms"
                  title="Your verification code is 123456"
                  message="Your verification code is 123456. Valid for 10 minutes."
                  icon={MessageSquare}
                  onClose={() => setPreviewType(null)}
                />
              )}
              {previewType === 'inApp' && (
                <NotificationPreview
                  type="inApp"
                  title="Profile updated"
                  message="Your profile information has been successfully updated."
                  icon={Globe}
                  onClose={() => setPreviewType(null)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to toggle</span>
          <span>👆👆 Double tap to configure</span>
          <span>🤏 Long press for actions</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const Edit: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
)

const Vibrate: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="m2 8 2 2-2 2 2 2-2 2" />
    <path d="m22 8-2 2 2 2-2 2 2 2" />
    <rect x="8" y="5" width="8" height="14" rx="1" />
  </svg>
)

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

export default SettingsNotificationsPage
