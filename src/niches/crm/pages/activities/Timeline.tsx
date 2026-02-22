import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Mail, Phone, Calendar, Users,
  Target, DollarSign, Building2, UserPlus,
  Filter, Download, RefreshCw, Clock,
  ChevronLeft, ChevronRight, X, Check,
  Star, Award, TrendingUp, AlertCircle
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface ActivityItem {
  id: string
  type: 'email' | 'call' | 'meeting' | 'note' | 'task' | 'deal' | 'lead' | 'system'
  title: string
  description: string
  timestamp: string
  user: {
    name: string
    avatar: string
  }
  relatedTo?: {
    type: 'lead' | 'deal' | 'contact' | 'company'
    id: string
    name: string
  }
  metadata?: Record<string, any>
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'deal',
    title: 'Deal Won',
    description: 'Enterprise License deal closed for $50,000',
    timestamp: '2024-03-15T14:30:00Z',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'deal',
      id: '1',
      name: 'Enterprise License'
    }
  },
  {
    id: '2',
    type: 'lead',
    title: 'New Lead Added',
    description: 'John Smith added as new lead from TechCorp',
    timestamp: '2024-03-15T11:20:00Z',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'lead',
      id: '1',
      name: 'John Smith'
    }
  },
  {
    id: '3',
    type: 'email',
    title: 'Email Sent',
    description: 'Sent proposal to TechCorp',
    timestamp: '2024-03-15T10:15:00Z',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.upslash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'company',
      id: '1',
      name: 'TechCorp Solutions'
    }
  },
  {
    id: '4',
    type: 'call',
    title: 'Call Completed',
    description: 'Discovery call with Startup.io',
    timestamp: '2024-03-15T09:45:00Z',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'company',
      id: '2',
      name: 'Startup.io'
    },
    metadata: {
      duration: '45 minutes'
    }
  },
  {
    id: '5',
    type: 'meeting',
    title: 'Meeting Scheduled',
    description: 'Quarterly review with Enterprise Ltd',
    timestamp: '2024-03-15T08:30:00Z',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'company',
      id: '3',
      name: 'Enterprise Ltd'
    },
    metadata: {
      duration: '1 hour'
    }
  },
  {
    id: '6',
    type: 'task',
    title: 'Task Completed',
    description: 'Follow-up call with John Smith completed',
    timestamp: '2024-03-14T16:20:00Z',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'lead',
      id: '1',
      name: 'John Smith'
    }
  },
  {
    id: '7',
    type: 'system',
    title: 'Stage Changed',
    description: 'Deal moved from Proposal to Negotiation',
    timestamp: '2024-03-14T14:15:00Z',
    user: {
      name: 'System',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'deal',
      id: '1',
      name: 'Enterprise License'
    }
  }
]

// ============================================================================
// ACTIVITY ICON MAP
// ============================================================================

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'email': return Mail
    case 'call': return Phone
    case 'meeting': return Users
    case 'note': return FileText
    case 'task': return Check
    case 'deal': return DollarSign
    case 'lead': return UserPlus
    case 'system': return Activity
    default: return Activity
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'email': return 'bg-blue-500/10 text-blue-400'
    case 'call': return 'bg-green-500/10 text-green-400'
    case 'meeting': return 'bg-purple-500/10 text-purple-400'
    case 'note': return 'bg-yellow-500/10 text-yellow-400'
    case 'task': return 'bg-orange-500/10 text-orange-400'
    case 'deal': return 'bg-emerald-500/10 text-emerald-400'
    case 'lead': return 'bg-cyan-500/10 text-cyan-400'
    case 'system': return 'bg-gray-500/10 text-gray-400'
    default: return 'bg-gray-500/10 text-gray-400'
  }
}

// ============================================================================
// ACTIVITY ITEM
// ============================================================================

interface ActivityItemProps {
  activity: ActivityItem
  index: number
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, index }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = getActivityIcon(activity.type)
  const colorClass = getActivityColor(activity.type)

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

  const formatFullDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative"
    >
      <Touchable
        onTap={() => setIsExpanded(!isExpanded)}
        hapticFeedback
        className="glass-card p-4 hover:scale-105 transition-transform"
      >
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium">{activity.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                {formatTime(activity.timestamp)}
              </span>
            </div>

            {/* User and related info */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <img
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs text-gray-400">{activity.user.name}</span>
              </div>

              {activity.relatedTo && (
                <>
                  <span className="text-gray-600">•</span>
                  <Touchable
                    onTap={(e) => {
                      e.stopPropagation()
                      window.location.href = `/crm/${activity.relatedTo?.type}s/${activity.relatedTo?.id}`
                    }}
                    hapticFeedback
                    className="text-xs text-green-400 hover:text-green-300"
                  >
                    {activity.relatedTo.name}
                  </Touchable>
                </>
              )}
            </div>

            {/* Metadata preview */}
            {activity.metadata && (
              <div className="mt-2 text-xs text-gray-500">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <span key={key} className="mr-3">
                    {key}: {value}
                  </span>
                ))}
              </div>
            )}

            {/* Expanded details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-dark-border overflow-hidden"
                >
                  <p className="text-sm text-gray-400">
                    Full timestamp: {formatFullDate(activity.timestamp)}
                  </p>
                  {activity.metadata && (
                    <pre className="mt-2 text-xs text-gray-500 bg-dark-hover p-2 rounded-lg overflow-x-auto">
                      {JSON.stringify(activity.metadata, null, 2)}
                    </pre>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Touchable>
    </motion.div>
  )
}

// ============================================================================
// FILTER BAR
// ============================================================================

interface FilterBarProps {
  selectedType: string
  onTypeChange: (type: string) => void
  dateRange: string
  onDateRangeChange: (range: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  onTypeChange,
  dateRange,
  onDateRangeChange
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const types = [
    { value: '', label: 'All Activities' },
    { value: 'email', label: 'Emails' },
    { value: 'call', label: 'Calls' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'task', label: 'Tasks' },
    { value: 'deal', label: 'Deals' },
    { value: 'lead', label: 'Leads' },
    { value: 'system', label: 'System' }
  ]

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search activities..."
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
          />
        </div>

        <Touchable
          onTap={() => setShowFilters(!showFilters)}
          hapticFeedback
          className={`p-3 rounded-xl transition-colors ${
            showFilters ? 'bg-green-500 text-white' : 'bg-dark-hover text-gray-400 hover:text-white'
          }`}
        >
          <Filter className="w-5 h-5" />
        </Touchable>

        <Touchable
          onTap={() => console.log('Refresh')}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:text-white transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </Touchable>

        <Touchable
          onTap={() => console.log('Export')}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:text-white transition-colors"
        >
          <Download className="w-5 h-5 text-gray-400" />
        </Touchable>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Activity Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  >
                    {types.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => onDateRangeChange(e.target.value)}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="all">All time</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// STATS CARD
// ============================================================================

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: string
  color: string
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-4">
    <div className="flex items-center space-x-3">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
)

// ============================================================================
// MAIN ACTIVITY TIMELINE PAGE
// ============================================================================

export const ActivityTimelinePage: React.FC = () => {
  const [selectedType, setSelectedType] = useState('')
  const [dateRange, setDateRange] = useState('week')

  // Filter activities
  const filteredActivities = selectedType
    ? MOCK_ACTIVITIES.filter(a => a.type === selectedType)
    : MOCK_ACTIVITIES

  // Stats
  const totalActivities = MOCK_ACTIVITIES.length
  const emailsCount = MOCK_ACTIVITIES.filter(a => a.type === 'email').length
  const callsCount = MOCK_ACTIVITIES.filter(a => a.type === 'call').length
  const meetingsCount = MOCK_ACTIVITIES.filter(a => a.type === 'meeting').length
  const dealsCount = MOCK_ACTIVITIES.filter(a => a.type === 'deal').length

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Activity Timeline</h1>
        <p className="text-gray-400 text-sm mt-1">Track all team activities and interactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatsCard
          icon={Activity}
          label="Total"
          value={totalActivities.toString()}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={Mail}
          label="Emails"
          value={emailsCount.toString()}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={Phone}
          label="Calls"
          value={callsCount.toString()}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={Users}
          label="Meetings"
          value={meetingsCount.toString()}
          color="from-orange-500 to-red-500"
        />
        <StatsCard
          icon={DollarSign}
          label="Deals"
          value={dealsCount.toString()}
          color="from-yellow-500 to-amber-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Timeline */}
      <div className="space-y-4">
        {filteredActivities.map((activity, index) => (
          <ActivityItem key={activity.id} activity={activity} index={index} />
        ))}
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to expand</span>
          <span>📊 Activity feed</span>
          <span>🔍 Filter by type</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const Search: React.FC<{ className?: string }> = ({ className }) => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const FileText: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)
