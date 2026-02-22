import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Users, Shield, Settings, Key,
  Mail, Bell, Download, Upload, Edit,
  Trash2, Eye, EyeOff, Filter, Search,
  Calendar, Clock, Globe, Smartphone,
  Laptop, Tablet, AlertCircle, Check,
  X, AlertTriangle, Info, MoreVertical,
  ChevronDown, ChevronUp, RefreshCw,
  FileText, Database, Cloud, Lock
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface ActivityLog {
  id: string
  timestamp: string
  user: {
    id: string
    name: string
    avatar: string
    email: string
  }
  action: string
  category: 'auth' | 'user' | 'system' | 'security' | 'data' | 'billing'
  resource: string
  resourceId?: string
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  ip: string
  userAgent: string
  location: {
    country: string
    city: string
    coordinates?: [number, number]
  }
  status: 'success' | 'warning' | 'error'
  duration?: number
  metadata?: Record<string, any>
}

interface ActivityFilter {
  dateRange: 'today' | 'yesterday' | 'week' | 'month' | 'custom'
  categories: string[]
  users: string[]
  status: string[]
  search: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2024-03-15T14:23:45Z',
    user: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      email: 'john.doe@company.com'
    },
    action: 'User logged in',
    category: 'auth',
    resource: 'session',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/122.0.0.0',
    location: {
      country: 'United States',
      city: 'San Francisco'
    },
    status: 'success',
    duration: 234
  },
  {
    id: '2',
    timestamp: '2024-03-15T14:20:12Z',
    user: {
      id: '2',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=150&h=150&fit=crop',
      email: 'sarah.j@company.com'
    },
    action: 'Updated user permissions',
    category: 'user',
    resource: 'user',
    resourceId: '3',
    changes: [
      { field: 'role', oldValue: 'editor', newValue: 'manager' },
      { field: 'permissions', oldValue: 'read,write', newValue: 'read,write,delete' }
    ],
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4) Safari',
    location: {
      country: 'United States',
      city: 'Austin'
    },
    status: 'success',
    duration: 567
  },
  {
    id: '3',
    timestamp: '2024-03-15T14:15:30Z',
    user: {
      id: '3',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      email: 'michael.c@company.com'
    },
    action: 'Failed login attempt',
    category: 'security',
    resource: 'session',
    ip: '185.142.53.23',
    userAgent: 'Unknown',
    location: {
      country: 'Russia',
      city: 'Moscow'
    },
    status: 'error',
    metadata: {
      reason: 'Invalid password',
      attempts: 3
    }
  },
  {
    id: '4',
    timestamp: '2024-03-15T14:10:00Z',
    user: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      email: 'john.doe@company.com'
    },
    action: 'Exported user data',
    category: 'data',
    resource: 'export',
    resourceId: 'export_123',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/122.0.0.0',
    location: {
      country: 'United States',
      city: 'San Francisco'
    },
    status: 'success',
    metadata: {
      format: 'CSV',
      rows: 1234
    }
  },
  {
    id: '5',
    timestamp: '2024-03-15T14:05:23Z',
    user: {
      id: '4',
      name: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      email: 'emma.w@company.com'
    },
    action: 'Changed password',
    category: 'security',
    resource: 'user',
    resourceId: '4',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_4) Safari',
    location: {
      country: 'United States',
      city: 'New York'
    },
    status: 'success'
  },
  {
    id: '6',
    timestamp: '2024-03-15T13:55:45Z',
    user: {
      id: '5',
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      email: 'james.w@company.com'
    },
    action: 'API rate limit exceeded',
    category: 'system',
    resource: 'api',
    ip: '192.168.1.103',
    userAgent: 'PostmanRuntime/7.36.0',
    location: {
      country: 'United States',
      city: 'Seattle'
    },
    status: 'warning',
    metadata: {
      endpoint: '/api/v1/users',
      limit: 1000,
      current: 1234
    }
  }
]

// ============================================================================
// ACTIVITY ICON MAP
// ============================================================================

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'auth': return Key
    case 'user': return Users
    case 'system': return Settings
    case 'security': return Shield
    case 'data': return Database
    case 'billing': return FileText
    default: return Activity
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'auth': return 'text-blue-400 bg-blue-500/10'
    case 'user': return 'text-green-400 bg-green-500/10'
    case 'system': return 'text-purple-400 bg-purple-500/10'
    case 'security': return 'text-orange-400 bg-orange-500/10'
    case 'data': return 'text-pink-400 bg-pink-500/10'
    case 'billing': return 'text-yellow-400 bg-yellow-500/10'
    default: return 'text-gray-400 bg-gray-500/10'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-success-green bg-success-green/10'
    case 'warning': return 'text-warning-orange bg-warning-orange/10'
    case 'error': return 'text-error-red bg-error-red/10'
    default: return 'text-gray-400 bg-gray-500/10'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return Check
    case 'warning': return AlertTriangle
    case 'error': return AlertCircle
    default: return Info
  }
}

// ============================================================================
// ACTIVITY LOG ITEM COMPONENT
// ============================================================================

interface ActivityLogItemProps {
  log: ActivityLog
  onSelect: (log: ActivityLog) => void
}

const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ log, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = getCategoryIcon(log.category)
  const StatusIcon = getStatusIcon(log.status)
  const categoryColor = getCategoryColor(log.category)
  const statusColor = getStatusColor(log.status)

  const getDeviceIcon = (ua: string) => {
    if (ua.includes('iPhone') || ua.includes('iPad')) return Smartphone
    if (ua.includes('Mac')) return Laptop
    if (ua.includes('Windows')) return Laptop
    if (ua.includes('Android')) return Smartphone
    return Globe
  }

  const DeviceIcon = getDeviceIcon(log.userAgent)

  const formatTimeAgo = (timestamp: string) => {
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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card overflow-hidden"
    >
      <Touchable
        onTap={() => setIsExpanded(!isExpanded)}
        onLongPress={() => onSelect(log)}
        hapticFeedback
        className="w-full p-4 text-left hover:bg-dark-hover/50 transition-colors"
      >
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`p-3 rounded-xl ${categoryColor}`}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-white font-medium">{log.action}</h4>
                  <span className={`px-2 py-0.5 text-xs rounded-full flex items-center space-x-1 ${statusColor}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{log.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  by {log.user.name} • {log.resource}
                  {log.resourceId && ` • ID: ${log.resourceId}`}
                </p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                {formatTimeAgo(log.timestamp)}
              </span>
            </div>

            {/* Metadata */}
            <div className="flex items-center space-x-4 mt-2 text-xs">
              <div className="flex items-center space-x-1 text-gray-500">
                <DeviceIcon className="w-3 h-3" />
                <span>{log.location.city}, {log.location.country}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Globe className="w-3 h-3" />
                <span>{log.ip}</span>
              </div>
              {log.duration && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{log.duration}ms</span>
                </div>
              )}
            </div>

            {/* Changes preview */}
            {log.changes && log.changes.length > 0 && (
              <div className="mt-2 flex items-center space-x-2">
                <Edit className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-400">
                  {log.changes.length} field{log.changes.length > 1 ? 's' : ''} changed
                </span>
              </div>
            )}

            {/* Metadata preview */}
            {log.metadata && (
              <div className="mt-2 flex items-center space-x-2">
                <Info className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-400">
                  {Object.entries(log.metadata).map(([key, value]) => (
                    <span key={key}>{key}: {value} </span>
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Expand/collapse indicator */}
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-dark-border overflow-hidden"
            >
              {/* Changes */}
              {log.changes && log.changes.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-white mb-2">Changes</h5>
                  <div className="space-y-2">
                    {log.changes.map((change, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-gray-400">{change.field}:</span>{' '}
                        <span className="text-error-red line-through mr-2">{change.oldValue}</span>
                        <span className="text-success-green">{change.newValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">User Agent</p>
                  <p className="text-gray-300 break-all">{log.userAgent}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Timestamp</p>
                  <p className="text-gray-300">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
                {log.metadata && (
                  <div className="col-span-2">
                    <p className="text-gray-400 mb-1">Additional Info</p>
                    <pre className="text-xs text-gray-300 bg-dark-hover p-2 rounded-lg overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Touchable>
    </motion.div>
  )
}

// ============================================================================
// FILTER BAR COMPONENT
// ============================================================================

interface FilterBarProps {
  filters: ActivityFilter
  onFilterChange: (filters: ActivityFilter) => void
  onRefresh: () => void
  onExport: () => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  onExport
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { id: 'auth', label: 'Authentication', icon: Key },
    { id: 'user', label: 'User Management', icon: Users },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'billing', label: 'Billing', icon: FileText }
  ]

  const statuses = [
    { id: 'success', label: 'Success', icon: Check },
    { id: 'warning', label: 'Warning', icon: AlertTriangle },
    { id: 'error', label: 'Error', icon: AlertCircle }
  ]

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'Last 7 days' },
    { id: 'month', label: 'Last 30 days' },
    { id: 'custom', label: 'Custom range' }
  ]

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId]
    onFilterChange({ ...filters, categories: newCategories })
  }

  const toggleStatus = (statusId: string) => {
    const newStatus = filters.status.includes(statusId)
      ? filters.status.filter(s => s !== statusId)
      : [...filters.status, statusId]
    onFilterChange({ ...filters, status: newStatus })
  }

  return (
    <div className="glass-card p-4 mb-6">
      {/* Search and actions */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search logs..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <Touchable
          onTap={() => setShowFilters(!showFilters)}
          hapticFeedback
          className={`p-3 rounded-xl transition-colors ${
            showFilters ? 'bg-purple-500 text-white' : 'bg-dark-hover text-gray-400 hover:text-white'
          }`}
        >
          <Filter className="w-5 h-5" />
        </Touchable>
        <Touchable
          onTap={onRefresh}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:text-white transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </Touchable>
        <Touchable
          onTap={onExport}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:text-white transition-colors"
        >
          <Download className="w-5 h-5 text-gray-400" />
        </Touchable>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-dark-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date range */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Date Range</h4>
                  <div className="space-y-2">
                    {dateRanges.map((range) => (
                      <Touchable
                        key={range.id}
                        onTap={() => onFilterChange({ ...filters, dateRange: range.id as any })}
                        hapticFeedback
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          filters.dateRange === range.id
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                        }`}
                      >
                        {range.label}
                      </Touchable>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <Touchable
                        key={cat.id}
                        onTap={() => toggleCategory(cat.id)}
                        hapticFeedback
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <cat.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{cat.label}</span>
                        </div>
                        {filters.categories.includes(cat.id) && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </Touchable>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Status</h4>
                  <div className="space-y-2">
                    {statuses.map((stat) => (
                      <Touchable
                        key={stat.id}
                        onTap={() => toggleStatus(stat.id)}
                        hapticFeedback
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <stat.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{stat.label}</span>
                        </div>
                        {filters.status.includes(stat.id) && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </Touchable>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active filters */}
              {(filters.categories.length > 0 || filters.status.length > 0) && (
                <div className="mt-4 pt-4 border-t border-dark-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Active filters:</span>
                    <Touchable
                      onTap={() => onFilterChange({
                        ...filters,
                        categories: [],
                        status: []
                      })}
                      hapticFeedback
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      Clear all
                    </Touchable>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.categories.map((cat) => {
                      const category = categories.find(c => c.id === cat)
                      return (
                        <span
                          key={cat}
                          className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full flex items-center space-x-1"
                        >
                          <span>{category?.label}</span>
                          <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
                        </span>
                      )
                    })}
                    {filters.status.map((stat) => {
                      const status = statuses.find(s => s.id === stat)
                      return (
                        <span
                          key={stat}
                          className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full flex items-center space-x-1"
                        >
                          <span>{status?.label}</span>
                          <X className="w-3 h-3 cursor-pointer" onClick={() => toggleStatus(stat)} />
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: number | string
  change?: number
  color: string
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, change, color }) => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {change !== undefined && (
          <span className={`text-xs ${change >= 0 ? 'text-success-green' : 'text-error-red'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  )
}

// ============================================================================
// LOG DETAILS MODAL
// ============================================================================

interface LogDetailsModalProps {
  log: ActivityLog | null
  isOpen: boolean
  onClose: () => void
}

const LogDetailsModal: React.FC<LogDetailsModalProps> = ({ log, isOpen, onClose }) => {
  if (!log || !isOpen) return null

  const Icon = getCategoryIcon(log.category)
  const StatusIcon = getStatusIcon(log.status)
  const categoryColor = getCategoryColor(log.category)
  const statusColor = getStatusColor(log.status)

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
        className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${categoryColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Activity Details</h2>
              <p className="text-sm text-gray-400 mt-1">{log.action}</p>
            </div>
          </div>
          <Touchable onTap={onClose} hapticFeedback className="p-2 hover:bg-dark-hover rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>

        {/* User info */}
        <div className="flex items-center space-x-3 p-4 bg-dark-hover rounded-lg mb-4">
          <img src={log.user.avatar} alt={log.user.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-white font-medium">{log.user.name}</p>
            <p className="text-sm text-gray-400">{log.user.email}</p>
          </div>
          <span className={`ml-auto px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${statusColor}`}>
            <StatusIcon className="w-3 h-3" />
            <span>{log.status}</span>
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-dark-hover rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Timestamp</p>
            <p className="text-sm text-white">{new Date(log.timestamp).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-dark-hover rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Category</p>
            <p className="text-sm text-white capitalize">{log.category}</p>
          </div>
          <div className="p-3 bg-dark-hover rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Resource</p>
            <p className="text-sm text-white">{log.resource}</p>
          </div>
          {log.resourceId && (
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Resource ID</p>
              <p className="text-sm text-white font-mono">{log.resourceId}</p>
            </div>
          )}
          <div className="p-3 bg-dark-hover rounded-lg">
            <p className="text-xs text-gray-400 mb-1">IP Address</p>
            <p className="text-sm text-white">{log.ip}</p>
          </div>
          <div className="p-3 bg-dark-hover rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Location</p>
            <p className="text-sm text-white">{log.location.city}, {log.location.country}</p>
          </div>
        </div>

        {/* User Agent */}
        <div className="p-3 bg-dark-hover rounded-lg mb-4">
          <p className="text-xs text-gray-400 mb-1">User Agent</p>
          <p className="text-sm text-white break-all">{log.userAgent}</p>
        </div>

        {/* Changes */}
        {log.changes && log.changes.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white mb-2">Changes</h3>
            <div className="space-y-2">
              {log.changes.map((change, index) => (
                <div key={index} className="p-3 bg-dark-hover rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">{change.field}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-error-red line-through">{change.oldValue}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-sm text-success-green">{change.newValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {log.metadata && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white mb-2">Additional Information</h3>
            <pre className="text-xs text-gray-300 bg-dark-hover p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        )}

        {/* Close button */}
        <div className="flex justify-end">
          <Touchable
            onTap={onClose}
            hapticFeedback
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Close
          </Touchable>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// MAIN ACTIVITY LOGS PAGE
// ============================================================================

export const ActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState(MOCK_ACTIVITY_LOGS)
  const [filters, setFilters] = useState<ActivityFilter>({
    dateRange: 'today',
    categories: [],
    users: [],
    status: [],
    search: ''
  })
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Calculate stats
  const totalLogs = logs.length
  const successCount = logs.filter(l => l.status === 'success').length
  const warningCount = logs.filter(l => l.status === 'warning').length
  const errorCount = logs.filter(l => l.status === 'error').length

  const uniqueUsers = new Set(logs.map(l => l.user.id)).size

  // Filter logs
  const filteredLogs = logs.filter(log => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch = 
        log.action.toLowerCase().includes(searchLower) ||
        log.user.name.toLowerCase().includes(searchLower) ||
        log.user.email.toLowerCase().includes(searchLower) ||
        log.resource.toLowerCase().includes(searchLower) ||
        log.ip.includes(filters.search)
      if (!matchesSearch) return false
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(log.category)) {
      return false
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(log.status)) {
      return false
    }

    return true
  })

  const handleRefresh = () => {
    // Simulate refresh
    setLogs([...MOCK_ACTIVITY_LOGS])
  }

  const handleExport = () => {
    // Create CSV
    const csv = [
      ['Timestamp', 'User', 'Action', 'Category', 'Status', 'IP', 'Location'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user.name,
        log.action,
        log.category,
        log.status,
        log.ip,
        `${log.location.city}, ${log.location.country}`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-logs-${new Date().toISOString()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Activity Logs</h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor all system activity and user actions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          icon={Activity}
          label="Total Events"
          value={totalLogs}
          change={12}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={Check}
          label="Successful"
          value={successCount}
          change={8}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={AlertTriangle}
          label="Warnings"
          value={warningCount}
          change={-5}
          color="from-orange-500 to-red-500"
        />
        <StatsCard
          icon={Users}
          label="Active Users"
          value={uniqueUsers}
          color="from-blue-500 to-cyan-500"
        />
      </div>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      {/* Logs list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredLogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-12 text-center"
            >
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No logs found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </motion.div>
          ) : (
            filteredLogs.map((log) => (
              <ActivityLogItem
                key={log.id}
                log={log}
                onSelect={(log) => {
                  setSelectedLog(log)
                  setShowDetails(true)
                }}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Log details modal */}
      <AnimatePresence>
        {showDetails && selectedLog && (
          <LogDetailsModal
            log={selectedLog}
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
          />
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to expand</span>
          <span>🤏 Long press for details</span>
          <span>🔍 Pinch to zoom</span>
        </div>
      </div>
    </div>
  )
}

export default ActivityLogsPage
