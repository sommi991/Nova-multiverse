import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, AlertTriangle, CheckCircle, XCircle,
  Eye, EyeOff, Download, Upload, Filter,
  Search, Calendar, Clock, Globe, User,
  Key, Lock, Unlock, FileText, Database,
  Settings, Users, CreditCard, Mail,
  Phone, Smartphone, Laptop, Tablet,
  MoreVertical, ChevronDown, ChevronUp,
  RefreshCw, X, Check, AlertCircle,
  Fingerprint, QrCode, Camera, Mic
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface AuditEvent {
  id: string
  timestamp: string
  type: 'authentication' | 'authorization' | 'data_access' | 'configuration' | 'compliance' | 'security'
  severity: 'critical' | 'high' | 'medium' | 'low'
  actor: {
    id: string
    name: string
    email: string
    avatar: string
    role: string
  }
  action: string
  resource: {
    type: string
    id: string
    name: string
    before?: any
    after?: any
  }
  context: {
    ip: string
    userAgent: string
    location: {
      country: string
      city: string
      coordinates?: [number, number]
    }
    sessionId: string
    requestId: string
  }
  outcome: 'success' | 'failure' | 'pending'
  reason?: string
  compliance?: {
    regulation: string
    requirement: string
    status: 'compliant' | 'non-compliant' | 'pending'
  }[]
  metadata?: Record<string, any>
}

interface AuditFilter {
  dateRange: 'today' | 'yesterday' | 'week' | 'month' | 'custom'
  types: string[]
  severities: string[]
  outcomes: string[]
  actors: string[]
  search: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: '1',
    timestamp: '2024-03-15T14:23:45Z',
    type: 'authentication',
    severity: 'high',
    actor: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      role: 'admin'
    },
    action: 'User logged in from new device',
    resource: {
      type: 'session',
      id: 'sess_123456',
      name: 'New Session'
    },
    context: {
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/122.0.0.0',
      location: {
        country: 'United States',
        city: 'San Francisco'
      },
      sessionId: 'sess_123456',
      requestId: 'req_789012'
    },
    outcome: 'success',
    compliance: [
      {
        regulation: 'GDPR',
        requirement: 'User consent tracking',
        status: 'compliant'
      }
    ]
  },
  {
    id: '2',
    timestamp: '2024-03-15T14:20:12Z',
    type: 'data_access',
    severity: 'medium',
    actor: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=150&h=150&fit=crop',
      role: 'manager'
    },
    action: 'Exported sensitive user data',
    resource: {
      type: 'export',
      id: 'exp_123456',
      name: 'User Data Export',
      before: null,
      after: {
        format: 'CSV',
        records: 1234,
        fields: ['name', 'email', 'phone', 'address']
      }
    },
    context: {
      ip: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4) Safari',
      location: {
        country: 'United States',
        city: 'Austin'
      },
      sessionId: 'sess_234567',
      requestId: 'req_890123'
    },
    outcome: 'success',
    compliance: [
      {
        regulation: 'GDPR',
        requirement: 'Data export logging',
        status: 'compliant'
      },
      {
        regulation: 'CCPA',
        requirement: 'Data access audit',
        status: 'compliant'
      }
    ],
    metadata: {
      reason: 'Annual compliance audit',
      approvedBy: 'Compliance Officer'
    }
  },
  {
    id: '3',
    timestamp: '2024-03-15T14:15:30Z',
    type: 'security',
    severity: 'critical',
    actor: {
      id: 'system',
      name: 'System',
      email: 'system@company.com',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop',
      role: 'system'
    },
    action: 'Multiple failed login attempts detected',
    resource: {
      type: 'security_alert',
      id: 'alert_123456',
      name: 'Brute Force Attempt',
      before: null,
      after: {
        attempts: 5,
        ips: ['185.142.53.23', '185.142.53.24'],
        duration: '5 minutes'
      }
    },
    context: {
      ip: '185.142.53.23',
      userAgent: 'Unknown',
      location: {
        country: 'Russia',
        city: 'Moscow'
      },
      sessionId: 'sess_345678',
      requestId: 'req_901234'
    },
    outcome: 'failure',
    reason: 'Account lockout triggered',
    metadata: {
      action: 'Account temporarily locked',
      notifyAdmin: true
    }
  },
  {
    id: '4',
    timestamp: '2024-03-15T14:10:00Z',
    type: 'configuration',
    severity: 'high',
    actor: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      role: 'admin'
    },
    action: 'Changed security settings',
    resource: {
      type: 'configuration',
      id: 'config_123456',
      name: 'Security Settings',
      before: {
        mfaRequired: false,
        passwordPolicy: 'standard',
        sessionTimeout: 30
      },
      after: {
        mfaRequired: true,
        passwordPolicy: 'strict',
        sessionTimeout: 15
      }
    },
    context: {
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/122.0.0.0',
      location: {
        country: 'United States',
        city: 'San Francisco'
      },
      sessionId: 'sess_123456',
      requestId: 'req_012345'
    },
    outcome: 'success'
  },
  {
    id: '5',
    timestamp: '2024-03-15T14:05:23Z',
    type: 'compliance',
    severity: 'medium',
    actor: {
      id: 'system',
      name: 'Compliance Bot',
      email: 'compliance@company.com',
      avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop',
      role: 'system'
    },
    action: 'GDPR data retention policy applied',
    resource: {
      type: 'data_retention',
      id: 'ret_123456',
      name: 'User Data Cleanup',
      before: {
        recordsKept: 15000
      },
      after: {
        recordsKept: 12000,
        recordsDeleted: 3000
      }
    },
    context: {
      ip: '10.0.0.1',
      userAgent: 'ComplianceBot/1.0',
      location: {
        country: 'United States',
        city: 'Virtual'
      },
      sessionId: 'sess_456789',
      requestId: 'req_123456'
    },
    outcome: 'success',
    compliance: [
      {
        regulation: 'GDPR',
        requirement: 'Data retention (Article 5)',
        status: 'compliant'
      }
    ]
  }
]

// ============================================================================
// AUDIT ICON MAP
// ============================================================================

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'authentication': return Key
    case 'authorization': return Lock
    case 'data_access': return Database
    case 'configuration': return Settings
    case 'compliance': return Shield
    case 'security': return AlertTriangle
    default: return FileText
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'authentication': return 'text-blue-400 bg-blue-500/10'
    case 'authorization': return 'text-purple-400 bg-purple-500/10'
    case 'data_access': return 'text-green-400 bg-green-500/10'
    case 'configuration': return 'text-orange-400 bg-orange-500/10'
    case 'compliance': return 'text-yellow-400 bg-yellow-500/10'
    case 'security': return 'text-error-red bg-error-red/10'
    default: return 'text-gray-400 bg-gray-500/10'
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-error-red/10 text-error-red'
    case 'high': return 'bg-warning-orange/10 text-warning-orange'
    case 'medium': return 'bg-blue-500/10 text-blue-400'
    case 'low': return 'bg-gray-500/10 text-gray-400'
    default: return 'bg-gray-500/10 text-gray-400'
  }
}

const getOutcomeIcon = (outcome: string) => {
  switch (outcome) {
    case 'success': return CheckCircle
    case 'failure': return XCircle
    case 'pending': return AlertCircle
    default: return AlertCircle
  }
}

const getOutcomeColor = (outcome: string) => {
  switch (outcome) {
    case 'success': return 'text-success-green'
    case 'failure': return 'text-error-red'
    case 'pending': return 'text-warning-orange'
    default: return 'text-gray-400'
  }
}

// ============================================================================
// AUDIT EVENT ITEM COMPONENT
// ============================================================================

interface AuditEventItemProps {
  event: AuditEvent
  onSelect: (event: AuditEvent) => void
}

const AuditEventItem: React.FC<AuditEventItemProps> = ({ event, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = getTypeIcon(event.type)
  const typeColor = getTypeColor(event.type)
  const severityColor = getSeverityColor(event.severity)
  const OutcomeIcon = getOutcomeIcon(event.outcome)
  const outcomeColor = getOutcomeColor(event.outcome)

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
      className={`glass-card overflow-hidden border-l-4 ${
        event.severity === 'critical' ? 'border-error-red' :
        event.severity === 'high' ? 'border-warning-orange' :
        event.severity === 'medium' ? 'border-blue-500' :
        'border-gray-500'
      }`}
    >
      <Touchable
        onTap={() => setIsExpanded(!isExpanded)}
        onLongPress={() => onSelect(event)}
        hapticFeedback
        className="w-full p-4 text-left hover:bg-dark-hover/50 transition-colors"
      >
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`p-3 rounded-xl ${typeColor}`}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-white font-medium">{event.action}</h4>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${severityColor}`}>
                    {event.severity}
                  </span>
                  <span className={`flex items-center space-x-1 ${outcomeColor}`}>
                    <OutcomeIcon className="w-4 h-4" />
                    <span className="text-xs capitalize">{event.outcome}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  by {event.actor.name} • {event.resource.type} • {event.resource.name}
                </p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                {formatTimeAgo(event.timestamp)}
              </span>
            </div>

            {/* Context summary */}
            <div className="flex items-center space-x-4 mt-2 text-xs">
              <div className="flex items-center space-x-1 text-gray-500">
                <Globe className="w-3 h-3" />
                <span>{event.context.location.city}, {event.context.location.country}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Smartphone className="w-3 h-3" />
                <span>{event.context.ip}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Key className="w-3 h-3" />
                <span className="font-mono">{event.context.sessionId.slice(0, 8)}...</span>
              </div>
            </div>

            {/* Compliance badges */}
            {event.compliance && event.compliance.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {event.compliance.map((comp, index) => (
                  <span
                    key={index}
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      comp.status === 'compliant' ? 'bg-success-green/10 text-success-green' :
                      comp.status === 'non-compliant' ? 'bg-error-red/10 text-error-red' :
                      'bg-warning-orange/10 text-warning-orange'
                    }`}
                  >
                    {comp.regulation}
                  </span>
                ))}
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
              {/* Resource changes */}
              {event.resource.before && event.resource.after && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-white mb-2">Resource Changes</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-dark-hover rounded-lg">
                      <p className="text-xs text-gray-400 mb-2">Before</p>
                      <pre className="text-xs text-gray-300 overflow-x-auto">
                        {JSON.stringify(event.resource.before, null, 2)}
                      </pre>
                    </div>
                    <div className="p-3 bg-dark-hover rounded-lg">
                      <p className="text-xs text-gray-400 mb-2">After</p>
                      <pre className="text-xs text-gray-300 overflow-x-auto">
                        {JSON.stringify(event.resource.after, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Full context */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="text-sm font-medium text-white mb-2">Actor Details</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{event.actor.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{event.actor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{event.actor.role}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-white mb-2">Request Details</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300 font-mono">{event.context.requestId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{event.context.userAgent}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance details */}
              {event.compliance && event.compliance.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-white mb-2">Compliance</h5>
                  <div className="space-y-2">
                    {event.compliance.map((comp, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-dark-hover rounded-lg">
                        <div>
                          <p className="text-sm text-white">{comp.regulation}</p>
                          <p className="text-xs text-gray-400">{comp.requirement}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          comp.status === 'compliant' ? 'bg-success-green/10 text-success-green' :
                          comp.status === 'non-compliant' ? 'bg-error-red/10 text-error-red' :
                          'bg-warning-orange/10 text-warning-orange'
                        }`}>
                          {comp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reason if failure */}
              {event.reason && (
                <div className="mt-4 p-3 bg-error-red/10 rounded-lg">
                  <p className="text-sm text-error-red">{event.reason}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Touchable>
    </motion.div>
  )
}

// ============================================================================
// AUDIT FILTER BAR COMPONENT
// ============================================================================

interface AuditFilterBarProps {
  filters: AuditFilter
  onFilterChange: (filters: AuditFilter) => void
  onRefresh: () => void
  onExport: () => void
}

const AuditFilterBar: React.FC<AuditFilterBarProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  onExport
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const types = [
    { id: 'authentication', label: 'Authentication', icon: Key },
    { id: 'authorization', label: 'Authorization', icon: Lock },
    { id: 'data_access', label: 'Data Access', icon: Database },
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'security', label: 'Security', icon: AlertTriangle }
  ]

  const severities = [
    { id: 'critical', label: 'Critical', color: 'error-red' },
    { id: 'high', label: 'High', color: 'warning-orange' },
    { id: 'medium', label: 'Medium', color: 'blue-500' },
    { id: 'low', label: 'Low', color: 'gray-400' }
  ]

  const outcomes = [
    { id: 'success', label: 'Success', icon: CheckCircle },
    { id: 'failure', label: 'Failure', icon: XCircle },
    { id: 'pending', label: 'Pending', icon: AlertCircle }
  ]

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'Last 7 days' },
    { id: 'month', label: 'Last 30 days' },
    { id: 'custom', label: 'Custom range' }
  ]

  const toggleType = (typeId: string) => {
    const newTypes = filters.types.includes(typeId)
      ? filters.types.filter(t => t !== typeId)
      : [...filters.types, typeId]
    onFilterChange({ ...filters, types: newTypes })
  }

  const toggleSeverity = (severityId: string) => {
    const newSeverities = filters.severities.includes(severityId)
      ? filters.severities.filter(s => s !== severityId)
      : [...filters.severities, severityId]
    onFilterChange({ ...filters, severities: newSeverities })
  }

  const toggleOutcome = (outcomeId: string) => {
    const newOutcomes = filters.outcomes.includes(outcomeId)
      ? filters.outcomes.filter(o => o !== outcomeId)
      : [...filters.outcomes, outcomeId]
    onFilterChange({ ...filters, outcomes: newOutcomes })
  }

  return (
    <div className="glass-card p-4 mb-6">
      {/* Search and actions */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search audit events..."
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                {/* Event Types */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Event Types</h4>
                  <div className="space-y-2">
                    {types.map((type) => (
                      <Touchable
                        key={type.id}
                        onTap={() => toggleType(type.id)}
                        hapticFeedback
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <type.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{type.label}</span>
                        </div>
                        {filters.types.includes(type.id) && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </Touchable>
                    ))}
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Severity</h4>
                  <div className="space-y-2">
                    {severities.map((severity) => (
                      <Touchable
                        key={severity.id}
                        onTap={() => toggleSeverity(severity.id)}
                        hapticFeedback
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors"
                      >
                        <span className={`text-sm text-${severity.color}`}>{severity.label}</span>
                        {filters.severities.includes(severity.id) && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </Touchable>
                    ))}
                  </div>
                </div>

                {/* Outcome */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Outcome</h4>
                  <div className="space-y-2">
                    {outcomes.map((outcome) => (
                      <Touchable
                        key={outcome.id}
                        onTap={() => toggleOutcome(outcome.id)}
                        hapticFeedback
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-dark-hover transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <outcome.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{outcome.label}</span>
                        </div>
                        {filters.outcomes.includes(outcome.id) && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </Touchable>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active filters */}
              {(filters.types.length > 0 || filters.severities.length > 0 || filters.outcomes.length > 0) && (
                <div className="mt-4 pt-4 border-t border-dark-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Active filters:</span>
                    <Touchable
                      onTap={() => onFilterChange({
                        ...filters,
                        types: [],
                        severities: [],
                        outcomes: []
                      })}
                      hapticFeedback
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      Clear all
                    </Touchable>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.types.map((typeId) => {
                      const type = types.find(t => t.id === typeId)
                      return (
                        <span
                          key={typeId}
                          className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full flex items-center space-x-1"
                        >
                          <span>{type?.label}</span>
                          <X className="w-3 h-3 cursor-pointer" onClick={() => toggleType(typeId)} />
                        </span>
                      )
                    })}
                    {filters.severities.map((sevId) => {
                      const sev = severities.find(s => s.id === sevId)
                      return (
                        <span
                          key={sevId}
                          className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full flex items-center space-x-1"
                        >
                          <span>{sev?.label}</span>
                          <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSeverity(sevId)} />
                        </span>
                      )
                    })}
                    {filters.outcomes.map((outId) => {
                      const out = outcomes.find(o => o.id === outId)
                      return (
                        <span
                          key={outId}
                          className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full flex items-center space-x-1"
                        >
                          <span>{out?.label}</span>
                          <X className="w-3 h-3 cursor-pointer" onClick={() => toggleOutcome(outId)} />
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
// AUDIT STATS COMPONENT
// ============================================================================

interface AuditStatsProps {
  events: AuditEvent[]
}

const AuditStats: React.FC<AuditStatsProps> = ({ events }) => {
  const criticalCount = events.filter(e => e.severity === 'critical').length
  const highCount = events.filter(e => e.severity === 'high').length
  const failureCount = events.filter(e => e.outcome === 'failure').length
  const complianceCount = events.filter(e => e.compliance && e.compliance.length > 0).length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="glass-card p-4">
        <p className="text-sm text-gray-400 mb-1">Critical Events</p>
        <p className="text-2xl font-bold text-error-red">{criticalCount}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-sm text-gray-400 mb-1">High Severity</p>
        <p className="text-2xl font-bold text-warning-orange">{highCount}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-sm text-gray-400 mb-1">Failed Actions</p>
        <p className="text-2xl font-bold text-error-red">{failureCount}</p>
      </div>
      <div className="glass-card p-4">
        <p className="text-sm text-gray-400 mb-1">Compliance Events</p>
        <p className="text-2xl font-bold text-success-green">{complianceCount}</p>
      </div>
    </div>
  )
}

// ============================================================================
// AUDIT DETAILS MODAL
// ============================================================================

interface AuditDetailsModalProps {
  event: AuditEvent | null
  isOpen: boolean
  onClose: () => void
}

const AuditDetailsModal: React.FC<AuditDetailsModalProps> = ({ event, isOpen, onClose }) => {
  if (!event || !isOpen) return null

  const Icon = getTypeIcon(event.type)
  const typeColor = getTypeColor(event.type)
  const OutcomeIcon = getOutcomeIcon(event.outcome)
  const outcomeColor = getOutcomeColor(event.outcome)

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
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${typeColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Audit Event Details</h2>
              <p className="text-sm text-gray-400 mt-1">{event.action}</p>
            </div>
          </div>
          <Touchable onTap={onClose} hapticFeedback className="p-2 hover:bg-dark-hover rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-dark-hover rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Severity</p>
            <p className={`text-sm font-medium ${
              event.severity === 'critical' ? 'text-error-red' :
              event.severity === 'high' ? 'text-warning-orange' :
              event.severity === 'medium' ? 'text-blue-400' :
              'text-gray-400'
            }`}>
              {event.severity.toUpperCase()}
            </p>
          </div>
          <div className="p-3 bg-dark-hover rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Outcome</p>
            <div className={`flex items-center space-x-1 ${outcomeColor}`}>
              <OutcomeIcon className="w-4 h-4" />
              <span className="text-sm capitalize">{event.outcome}</span>
            </div>
          </div>
          <div className="p-3 bg-dark-hover rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Timestamp</p>
            <p className="text-sm text-white">{new Date(event.timestamp).toLocaleString()}</p>
          </div>
        </div>

        {/* Actor Info */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Actor</h3>
          <div className="flex items-center space-x-4 p-4 bg-dark-hover rounded-lg">
            <img src={event.actor.avatar} alt={event.actor.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <p className="text-white font-medium">{event.actor.name}</p>
              <p className="text-sm text-gray-400">{event.actor.email}</p>
              <p className="text-xs text-gray-500 mt-1">Role: {event.actor.role}</p>
            </div>
          </div>
        </div>

        {/* Resource Details */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Resource</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Type</p>
              <p className="text-sm text-white">{event.resource.type}</p>
            </div>
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">ID</p>
              <p className="text-sm text-white font-mono">{event.resource.id}</p>
            </div>
            <div className="col-span-2 p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Name</p>
              <p className="text-sm text-white">{event.resource.name}</p>
            </div>
          </div>

          {event.resource.before && event.resource.after && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">Before</p>
                <pre className="text-xs text-gray-300 bg-dark-hover p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(event.resource.before, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">After</p>
                <pre className="text-xs text-gray-300 bg-dark-hover p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(event.resource.after, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Context */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-white mb-3">Context</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">IP Address</p>
              <p className="text-sm text-white">{event.context.ip}</p>
            </div>
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Location</p>
              <p className="text-sm text-white">{event.context.location.city}, {event.context.location.country}</p>
            </div>
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Session ID</p>
              <p className="text-sm text-white font-mono">{event.context.sessionId}</p>
            </div>
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Request ID</p>
              <p className="text-sm text-white font-mono">{event.context.requestId}</p>
            </div>
            <div className="col-span-2 p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">User Agent</p>
              <p className="text-sm text-white break-all">{event.context.userAgent}</p>
            </div>
          </div>
        </div>

        {/* Compliance */}
        {event.compliance && event.compliance.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white mb-3">Compliance</h3>
            <div className="space-y-2">
              {event.compliance.map((comp, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-hover rounded-lg">
                  <div>
                    <p className="text-sm text-white">{comp.regulation}</p>
                    <p className="text-xs text-gray-400">{comp.requirement}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    comp.status === 'compliant' ? 'bg-success-green/10 text-success-green' :
                    comp.status === 'non-compliant' ? 'bg-error-red/10 text-error-red' :
                    'bg-warning-orange/10 text-warning-orange'
                  }`}>
                    {comp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {event.metadata && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white mb-3">Additional Information</h3>
            <pre className="text-xs text-gray-300 bg-dark-hover p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(event.metadata, null, 2)}
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
// MAIN AUDIT LOGS PAGE
// ============================================================================

export const ActivityAuditPage: React.FC = () => {
  const [events, setEvents] = useState(MOCK_AUDIT_EVENTS)
  const [filters, setFilters] = useState<AuditFilter>({
    dateRange: 'today',
    types: [],
    severities: [],
    outcomes: [],
    actors: [],
    search: ''
  })
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Filter events
  const filteredEvents = events.filter(event => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch = 
        event.action.toLowerCase().includes(searchLower) ||
        event.actor.name.toLowerCase().includes(searchLower) ||
        event.actor.email.toLowerCase().includes(searchLower) ||
        event.resource.name.toLowerCase().includes(searchLower) ||
        event.context.ip.includes(filters.search)
      if (!matchesSearch) return false
    }

    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(event.type)) {
      return false
    }

    // Severity filter
    if (filters.severities.length > 0 && !filters.severities.includes(event.severity)) {
      return false
    }

    // Outcome filter
    if (filters.outcomes.length > 0 && !filters.outcomes.includes(event.outcome)) {
      return false
    }

    return true
  })

  const handleRefresh = () => {
    setEvents([...MOCK_AUDIT_EVENTS])
  }

  const handleExport = () => {
    // Create JSON export
    const data = JSON.stringify(filteredEvents, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Audit Logs</h1>
        <p className="text-gray-400 text-sm mt-1">
          Comprehensive audit trail for compliance and security
        </p>
      </div>

      {/* Stats */}
      <AuditStats events={filteredEvents} />

      {/* Filter bar */}
      <AuditFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      {/* Events list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-12 text-center"
            >
              <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No audit events found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </motion.div>
          ) : (
            filteredEvents.map((event) => (
              <AuditEventItem
                key={event.id}
                event={event}
                onSelect={(event) => {
                  setSelectedEvent(event)
                  setShowDetails(true)
                }}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Details modal */}
      <AnimatePresence>
        {showDetails && selectedEvent && (
          <AuditDetailsModal
            event={selectedEvent}
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
          <span>🔍 Compliance tracking</span>
        </div>
      </div>
    </div>
  )
}

export default ActivityAuditPage
