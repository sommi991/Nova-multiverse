import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, Clock, ShoppingBag, Mail, Phone,
  MapPin, Star, Award, Heart, MessageSquare,
  Eye, Edit, LogIn, LogOut, CreditCard,
  Truck, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface ActivityItem {
  id: string
  type: 'order' | 'login' | 'email' | 'call' | 'review' | 'support' | 'payment' | 'address'
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, any>
  status?: 'success' | 'warning' | 'error'
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Placed',
    description: 'Order #ORD-2024-001 for $649.97',
    timestamp: '2024-03-15T10:30:00Z',
    metadata: {
      orderId: 'ORD-2024-001',
      amount: 649.97
    },
    status: 'success'
  },
  {
    id: '2',
    type: 'login',
    title: 'Account Login',
    description: 'Logged in from San Francisco, CA',
    timestamp: '2024-03-15T09:15:00Z',
    metadata: {
      ip: '192.168.1.100',
      device: 'Chrome on macOS'
    },
    status: 'success'
  },
  {
    id: '3',
    type: 'email',
    title: 'Email Opened',
    description: 'Opened marketing newsletter',
    timestamp: '2024-03-14T14:20:00Z',
    metadata: {
      campaign: 'Spring Sale 2024'
    },
    status: 'success'
  },
  {
    id: '4',
    type: 'review',
    title: 'Product Review',
    description: 'Left a 5-star review for Wireless Headphones',
    timestamp: '2024-03-13T11:45:00Z',
    metadata: {
      product: 'Wireless Headphones Pro',
      rating: 5
    },
    status: 'success'
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment Method Added',
    description: 'Added Visa ending in 4242',
    timestamp: '2024-03-12T16:30:00Z',
    status: 'success'
  },
  {
    id: '6',
    type: 'address',
    title: 'Address Updated',
    description: 'Updated shipping address',
    timestamp: '2024-03-10T13:20:00Z',
    status: 'success'
  },
  {
    id: '7',
    type: 'support',
    title: 'Support Ticket',
    description: 'Asked about return policy',
    timestamp: '2024-03-08T10:15:00Z',
    metadata: {
      ticketId: 'TKT-1234'
    },
    status: 'warning'
  },
  {
    id: '8',
    type: 'order',
    title: 'Order Delivered',
    description: 'Order #ORD-2024-002 delivered',
    timestamp: '2024-03-07T14:30:00Z',
    status: 'success'
  },
  {
    id: '9',
    type: 'call',
    title: 'Customer Support Call',
    description: '15 minute call about product inquiry',
    timestamp: '2024-03-05T11:00:00Z',
    metadata: {
      duration: '15 min',
      agent: 'Sarah'
    },
    status: 'success'
  },
  {
    id: '10',
    type: 'review',
    title: 'Product Review',
    description: 'Left a 4-star review for Gaming Mouse',
    timestamp: '2024-03-03T09:30:00Z',
    metadata: {
      product: 'Gaming Mouse X-1000',
      rating: 4
    },
    status: 'success'
  }
]

// ============================================================================
// ACTIVITY ICON MAP
// ============================================================================

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order': return ShoppingBag
    case 'login': return LogIn
    case 'email': return Mail
    case 'call': return Phone
    case 'review': return Star
    case 'support': return MessageSquare
    case 'payment': return CreditCard
    case 'address': return MapPin
    default: return Clock
  }
}

const getActivityColor = (type: string, status?: string) => {
  if (status === 'warning') return 'bg-warning-orange/10 text-warning-orange'
  if (status === 'error') return 'bg-error-red/10 text-error-red'
  
  switch (type) {
    case 'order': return 'bg-purple-500/10 text-purple-400'
    case 'login': return 'bg-green-500/10 text-green-400'
    case 'email': return 'bg-blue-500/10 text-blue-400'
    case 'call': return 'bg-teal-500/10 text-teal-400'
    case 'review': return 'bg-gold/10 text-gold'
    case 'support': return 'bg-orange-500/10 text-orange-400'
    case 'payment': return 'bg-pink-500/10 text-pink-400'
    case 'address': return 'bg-cyan-500/10 text-cyan-400'
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
  const colorClass = getActivityColor(activity.type, activity.status)

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
              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                {formatTime(activity.timestamp)}
              </span>
            </div>

            {/* Metadata */}
            {activity.metadata && (
              <div className="mt-2 text-xs text-gray-500">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <span key={key} className="mr-3">
                    {key}: {value}
                  </span>
                ))}
              </div>
            )}
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
  const types = [
    { value: '', label: 'All Activity' },
    { value: 'order', label: 'Orders' },
    { value: 'login', label: 'Logins' },
    { value: 'email', label: 'Emails' },
    { value: 'call', label: 'Calls' },
    { value: 'review', label: 'Reviews' },
    { value: 'support', label: 'Support' },
    { value: 'payment', label: 'Payments' }
  ]

  return (
    <div className="glass-card p-4 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Activity Type</label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
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
            className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STATS CARD
// ============================================================================

interface StatsCardProps {
  label: string
  value: string
  icon: React.ElementType
  color: string
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color }) => (
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
// MAIN CUSTOMER ACTIVITY PAGE
// ============================================================================

export const CustomerActivityPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [selectedType, setSelectedType] = useState('')
  const [dateRange, setDateRange] = useState('all')

  const customerName = "John Smith"

  // Filter activities
  const filteredActivities = selectedType
    ? MOCK_ACTIVITIES.filter(a => a.type === selectedType)
    : MOCK_ACTIVITIES

  // Calculate stats
  const totalActivities = MOCK_ACTIVITIES.length
  const orderCount = MOCK_ACTIVITIES.filter(a => a.type === 'order').length
  const reviewCount = MOCK_ACTIVITIES.filter(a => a.type === 'review').length
  const supportCount = MOCK_ACTIVITIES.filter(a => a.type === 'support').length

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Touchable
          onTap={() => navigate(`/ecommerce/customers/${id}`)}
          hapticFeedback
          className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </Touchable>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">{customerName}'s Activity</h1>
          <p className="text-gray-400 text-sm mt-1">Complete customer interaction timeline</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          label="Total Activities"
          value={totalActivities.toString()}
          icon={Clock}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          label="Orders"
          value={orderCount.toString()}
          icon={ShoppingBag}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          label="Reviews"
          value={reviewCount.toString()}
          icon={Star}
          color="from-gold to-amber-500"
        />
        <StatsCard
          label="Support Tickets"
          value={supportCount.toString()}
          icon={MessageSquare}
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

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap for details</span>
          <span>📊 Activity timeline</span>
          <span>🔍 Filter by type</span>
        </div>
      </div>
    </div>
  )
}
