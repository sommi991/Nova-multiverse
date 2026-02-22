import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, Mail, Phone, Calendar, Clock,
  MessageSquare, PhoneCall, Video, Users,
  FileText, Edit, Trash2, Plus, Filter,
  Download, RefreshCw, CheckCircle, XCircle,
  AlertCircle, Star, Award, TrendingUp
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface Activity {
  id: string
  type: 'email' | 'call' | 'meeting' | 'note' | 'task' | 'system'
  title: string
  description: string
  date: string
  user: string
  avatar: string
  metadata?: Record<string, any>
  status?: 'completed' | 'pending' | 'cancelled'
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'email',
    title: 'Sent proposal',
    description: 'Sent enterprise proposal with pricing options',
    date: '2024-03-15T10:30:00Z',
    user: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop',
    metadata: {
      subject: 'Proposal for Enterprise License',
      attachments: 2
    }
  },
  {
    id: '2',
    type: 'call',
    title: 'Discovery call',
    description: 'Discussed requirements and timeline',
    date: '2024-03-14T15:00:00Z',
    user: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop',
    metadata: {
      duration: '45 minutes',
      notes: 'Positive conversation, interested in Q2 timeline'
    }
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Product demo',
    description: 'Demo of enterprise features',
    date: '2024-03-13T11:00:00Z',
    user: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop',
    metadata: {
      attendees: 3,
      recording: 'https://meet.google.com/abc-xyz'
    }
  },
  {
    id: '4',
    type: 'note',
    title: 'Added note',
    description: 'Customer mentioned budget approval in April',
    date: '2024-03-12T09:15:00Z',
    user: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
  },
  {
    id: '5',
    type: 'task',
    title: 'Follow-up email',
    description: 'Send follow-up with pricing details',
    date: '2024-03-16T10:00:00Z',
    user: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop',
    status: 'pending'
  },
  {
    id: '6',
    type: 'system',
    title: 'Lead status changed',
    description: 'Lead moved from Contacted to Qualified',
    date: '2024-03-11T14:30:00Z',
    user: 'System',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop',
    metadata: {
      from: 'contacted',
      to: 'qualified'
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
    case 'task': return CheckCircle
    case 'system': return AlertCircle
    default: return Clock
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'email': return 'bg-blue-500/10 text-blue-400'
    case 'call': return 'bg-green-500/10 text-green-400'
    case 'meeting': return 'bg-purple-500/10 text-purple-400'
    case 'note': return 'bg-yellow-500/10 text-yellow-400'
    case 'task': return 'bg-orange-500/10 text-orange-400'
    case 'system': return 'bg-gray-500/10 text-gray-400'
    default: return 'bg-gray-500/10 text-gray-400'
  }
}

// ============================================================================
// ACTIVITY ITEM
// ============================================================================

interface ActivityItemProps {
  activity: Activity
  index: number
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, index }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = getActivityIcon(activity.type)
  const colorClass = getActivityColor(activity.type)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
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
          {/* Timeline dot/icon */}
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            {index < MOCK_ACTIVITIES.length - 1 && (
              <div className="absolute top-10 left-1/2 w-0.5 h-12 bg-dark-border -translate-x-1/2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium">{activity.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {formatDate(activity.date)}
                </span>
                {activity.status && (
                  <span className={`block text-xs mt-1 ${
                    activity.status === 'completed' ? 'text-success-green' :
                    activity.status === 'pending' ? 'text-warning-orange' :
                    'text-gray-400'
                  }`}>
                    {activity.status}
                  </span>
                )}
              </div>
            </div>

            {/* User info */}
            <div className="flex items-center space-x-2 mt-2">
              <img
                src={activity.avatar}
                alt={activity.user}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-xs text-gray-500">{activity.user}</span>
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
                  <p className="text-sm text-gray-300 mb-2">
                    Full timestamp: {formatFullDate(activity.date)}
                  </p>
                  {activity.metadata && (
                    <pre className="text-xs text-gray-400 bg-dark-hover p-2 rounded-lg overflow-x-auto">
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
// ADD ACTIVITY MODAL
// ============================================================================

interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (activity: any) => void
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [type, setType] = useState('note')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  if (!isOpen) return null

  const activityTypes = [
    { value: 'note', label: 'Note', icon: FileText },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'call', label: 'Call', icon: Phone },
    { value: 'meeting', label: 'Meeting', icon: Users },
    { value: 'task', label: 'Task', icon: CheckCircle }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">Log Activity</h2>

        <div className="space-y-4">
          {/* Activity Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {activityTypes.map((activity) => {
                const Icon = activity.icon
                return (
                  <Touchable
                    key={activity.value}
                    onTap={() => setType(activity.value)}
                    hapticFeedback
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      type === activity.value
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-dark-border bg-dark-hover'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${
                      type === activity.value ? 'text-green-400' : 'text-gray-400'
                    }`} />
                    <span className={`text-xs ${
                      type === activity.value ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {activity.label}
                    </span>
                  </Touchable>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Discovery call"
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add details about this activity..."
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none resize-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 mt-6">
          <Touchable
            onTap={onClose}
            hapticFeedback
            className="flex-1 px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
          >
            Cancel
          </Touchable>
          <Touchable
            onTap={() => {
              onAdd({ type, title, description, date })
              onClose()
            }}
            hapticFeedback
            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
          >
            Add Activity
          </Touchable>
        </div>
      </motion.div>
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
    { value: 'note', label: 'Notes' },
    { value: 'task', label: 'Tasks' }
  ]

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
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
                    <option value="all">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
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
// MAIN ACTIVITY PAGE
// ============================================================================

export const LeadActivityPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { triggerHaptic } = useGestures()

  const [selectedType, setSelectedType] = useState('')
  const [dateRange, setDateRange] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  // Filter activities
  const filteredActivities = selectedType
    ? MOCK_ACTIVITIES.filter(a => a.type === selectedType)
    : MOCK_ACTIVITIES

  // Calculate stats
  const totalActivities = MOCK_ACTIVITIES.length
  const emailsCount = MOCK_ACTIVITIES.filter(a => a.type === 'email').length
  const callsCount = MOCK_ACTIVITIES.filter(a => a.type === 'call').length
  const meetingsCount = MOCK_ACTIVITIES.filter(a => a.type === 'meeting').length

  const handleAddActivity = (activity: any) => {
    triggerHaptic([10])
    console.log('Add activity:', activity)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Touchable
            onTap={() => navigate(`/crm/leads/${id}`)}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </Touchable>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Lead Activity</h1>
            <p className="text-gray-400 text-sm mt-1">Complete interaction history</p>
          </div>
        </div>

        <Touchable
          onTap={() => setShowAddModal(true)}
          hapticFeedback
          className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Log Activity</span>
        </Touchable>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          icon={Clock}
          label="Total Activities"
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
      </div>

      {/* Filters */}
      <FilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Activity Timeline */}
      <div className="space-y-1">
        {filteredActivities.map((activity, index) => (
          <ActivityItem key={activity.id} activity={activity} index={index} />
        ))}
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddActivityModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddActivity}
          />
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to expand</span>
          <span>📊 Activity timeline</span>
          <span>➕ Log new activity</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const Filter: React.FC<{ className?: string }> = ({ className }) => (
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
    <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
  </svg>
)
