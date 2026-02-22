import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Server, Database, Cloud, Shield,
  Cpu, HardDrive, Wifi, Zap, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Download,
  Clock, Calendar, BarChart3, PieChart,
  TrendingUp, TrendingDown, Users, Key,
  Lock, Unlock, Eye, EyeOff, Filter,
  ChevronDown, ChevronUp, MoreVertical,
  Smartphone, Laptop, Tablet, Globe
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface ServiceStatus {
  id: string
  name: string
  type: 'api' | 'database' | 'cache' | 'queue' | 'storage' | 'auth'
  status: 'operational' | 'degraded' | 'down' | 'maintenance'
  latency: number
  uptime: number
  lastIncident?: string
  region: string
  version: string
}

interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  limit: number
  history: number[]
  color: string
  icon: React.ElementType
}

interface ServerInfo {
  id: string
  name: string
  status: 'healthy' | 'warning' | 'critical'
  cpu: number
  memory: number
  disk: number
  network: {
    in: number
    out: number
  }
  uptime: number
  lastRestart: string
  region: string
}

interface DatabaseStatus {
  name: string
  status: 'connected' | 'disconnected' | 'slow'
  connections: number
  queriesPerSecond: number
  replicationLag?: number
  size: number
}

interface Alert {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  service: string
  timestamp: string
  acknowledged: boolean
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_SERVICES: ServiceStatus[] = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    type: 'api',
    status: 'operational',
    latency: 45,
    uptime: 99.99,
    region: 'us-west-2',
    version: 'v2.1.3'
  },
  {
    id: 'auth-service',
    name: 'Authentication Service',
    type: 'auth',
    status: 'operational',
    latency: 32,
    uptime: 99.95,
    region: 'us-west-2',
    version: 'v1.8.2'
  },
  {
    id: 'user-db',
    name: 'User Database',
    type: 'database',
    status: 'operational',
    latency: 12,
    uptime: 99.99,
    region: 'us-west-2',
    version: 'PostgreSQL 15.2'
  },
  {
    id: 'redis-cache',
    name: 'Redis Cache',
    type: 'cache',
    status: 'operational',
    latency: 2,
    uptime: 99.99,
    region: 'us-west-2',
    version: 'Redis 7.0'
  },
  {
    id: 'file-storage',
    name: 'File Storage',
    type: 'storage',
    status: 'degraded',
    latency: 234,
    uptime: 98.5,
    lastIncident: '2024-03-15T10:30:00Z',
    region: 'us-west-2',
    version: 'S3'
  },
  {
    id: 'payment-api',
    name: 'Payment API',
    type: 'api',
    status: 'operational',
    latency: 89,
    uptime: 99.9,
    region: 'us-west-2',
    version: 'v3.2.1'
  }
]

const MOCK_SYSTEM_METRICS: SystemMetric[] = [
  {
    id: 'cpu',
    name: 'CPU Usage',
    value: 45,
    unit: '%',
    limit: 80,
    history: [35, 42, 38, 45, 52, 48, 45],
    color: 'blue',
    icon: Cpu
  },
  {
    id: 'memory',
    name: 'Memory Usage',
    value: 6.2,
    unit: 'GB',
    limit: 16,
    history: [5.1, 5.4, 5.8, 6.2, 5.9, 5.7, 6.2],
    color: 'green',
    icon: HardDrive
  },
  {
    id: 'disk',
    name: 'Disk Usage',
    value: 234,
    unit: 'GB',
    limit: 500,
    history: [210, 218, 225, 230, 234, 232, 234],
    color: 'purple',
    icon: Database
  },
  {
    id: 'network',
    name: 'Network I/O',
    value: 45,
    unit: 'Mbps',
    limit: 100,
    history: [38, 42, 45, 52, 48, 44, 45],
    color: 'orange',
    icon: Wifi
  }
]

const MOCK_SERVERS: ServerInfo[] = [
  {
    id: 'web-01',
    name: 'Web Server 01',
    status: 'healthy',
    cpu: 35,
    memory: 4.2,
    disk: 120,
    network: { in: 25, out: 30 },
    uptime: 15,
    lastRestart: '2024-03-10T08:00:00Z',
    region: 'us-west-2a'
  },
  {
    id: 'web-02',
    name: 'Web Server 02',
    status: 'healthy',
    cpu: 42,
    memory: 5.1,
    disk: 145,
    network: { in: 28, out: 35 },
    uptime: 15,
    lastRestart: '2024-03-10T08:00:00Z',
    region: 'us-west-2b'
  },
  {
    id: 'db-01',
    name: 'Database Primary',
    status: 'warning',
    cpu: 68,
    memory: 12.5,
    disk: 380,
    network: { in: 85, out: 92 },
    uptime: 30,
    lastRestart: '2024-02-15T10:00:00Z',
    region: 'us-west-2a'
  },
  {
    id: 'cache-01',
    name: 'Redis Primary',
    status: 'healthy',
    cpu: 22,
    memory: 2.8,
    disk: 15,
    network: { in: 45, out: 48 },
    uptime: 45,
    lastRestart: '2024-01-20T14:30:00Z',
    region: 'us-west-2b'
  }
]

const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    severity: 'high',
    message: 'High CPU usage on Database Primary',
    service: 'Database',
    timestamp: '2024-03-15T14:23:45Z',
    acknowledged: false
  },
  {
    id: '2',
    severity: 'medium',
    message: 'File storage latency increased',
    service: 'Storage',
    timestamp: '2024-03-15T13:15:22Z',
    acknowledged: false
  },
  {
    id: '3',
    severity: 'low',
    message: 'API Gateway request rate spike',
    service: 'API Gateway',
    timestamp: '2024-03-15T12:05:10Z',
    acknowledged: true
  }
]

// ============================================================================
// SERVICE STATUS CARD COMPONENT
// ============================================================================

interface ServiceStatusCardProps {
  service: ServiceStatus
  onSelect: (service: ServiceStatus) => void
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ service, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-success-green bg-success-green/10'
      case 'degraded': return 'text-warning-orange bg-warning-orange/10'
      case 'down': return 'text-error-red bg-error-red/10'
      case 'maintenance': return 'text-blue-400 bg-blue-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle
      case 'degraded': return AlertTriangle
      case 'down': return XCircle
      case 'maintenance': return Clock
      default: return Activity
    }
  }

  const StatusIcon = getStatusIcon(service.status)
  const statusColor = getStatusColor(service.status)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return Globe
      case 'database': return Database
      case 'cache': return Zap
      case 'queue': return Activity
      case 'storage': return HardDrive
      case 'auth': return Lock
      default: return Server
    }
  }

  const TypeIcon = getTypeIcon(service.type)

  return (
    <Touchable
      onTap={() => onSelect(service)}
      hapticFeedback
      className="glass-card p-4 hover:scale-105 transition-transform"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${statusColor}`}>
            <StatusIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.type} • {service.region}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
          {service.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-300">{service.latency}ms</span>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-300">{service.uptime}% uptime</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Version: {service.version}</span>
        {service.lastIncident && (
          <span className="text-warning-orange">
            Incident {new Date(service.lastIncident).toLocaleDateString()}
          </span>
        )}
      </div>
    </Touchable>
  )
}

// ============================================================================
// METRIC GAUGE COMPONENT
// ============================================================================

interface MetricGaugeProps {
  metric: SystemMetric
}

const MetricGauge: React.FC<MetricGaugeProps> = ({ metric }) => {
  const percentage = (metric.value / metric.limit) * 100
  const isWarning = percentage > 70
  const isCritical = percentage > 90

  const getStatusColor = () => {
    if (isCritical) return 'text-error-red'
    if (isWarning) return 'text-warning-orange'
    return `text-${metric.color}-400`
  }

  const getProgressColor = () => {
    if (isCritical) return 'bg-error-red'
    if (isWarning) return 'bg-warning-orange'
    return `bg-${metric.color}-500`
  }

  const Icon = metric.icon

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${getStatusColor()}`} />
          <h3 className="text-white font-medium">{metric.name}</h3>
        </div>
        <span className={`text-lg font-bold ${getStatusColor()}`}>
          {metric.value} {metric.unit}
        </span>
      </div>

      <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${getProgressColor()}`}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Limit: {metric.limit} {metric.unit}</span>
        <span className={`${getStatusColor()}`}>{Math.round(percentage)}%</span>
      </div>

      {/* Sparkline */}
      <div className="mt-3 h-8">
        <svg className="w-full h-full" viewBox="0 0 100 30">
          <path
            d={`M0,${30 - metric.history[0] / metric.limit * 30} ${metric.history.map((val, i) => 
              `L${i * (100 / (metric.history.length - 1))},${30 - (val / metric.limit * 30)}`
            ).join(' ')}`}
            fill="none"
            stroke={isCritical ? '#EF4444' : isWarning ? '#F97316' : '#8B5CF6'}
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  )
}

// ============================================================================
// SERVER CARD COMPONENT
// ============================================================================

interface ServerCardProps {
  server: ServerInfo
  onSelect: (server: ServerInfo) => void
}

const ServerCard: React.FC<ServerCardProps> = ({ server, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success-green bg-success-green/10'
      case 'warning': return 'text-warning-orange bg-warning-orange/10'
      case 'critical': return 'text-error-red bg-error-red/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const formatUptime = (days: number) => {
    if (days < 1) return `${Math.round(days * 24)} hours`
    return `${days} days`
  }

  return (
    <Touchable
      onTap={() => onSelect(server)}
      hapticFeedback
      className="glass-card p-4 hover:scale-105 transition-transform"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${getStatusColor(server.status)}`}>
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium">{server.name}</h3>
            <p className="text-sm text-gray-400">{server.region}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(server.status)}`}>
          {server.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">CPU</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-1.5 bg-dark-card rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  server.cpu > 80 ? 'bg-error-red' : server.cpu > 60 ? 'bg-warning-orange' : 'bg-success-green'
                }`}
                style={{ width: `${server.cpu}%` }}
              />
            </div>
            <span className="text-xs text-white">{server.cpu}%</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Memory</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-1.5 bg-dark-card rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  (server.memory / 16) * 100 > 80 ? 'bg-error-red' :
                  (server.memory / 16) * 100 > 60 ? 'bg-warning-orange' : 'bg-success-green'
                }`}
                style={{ width: `${(server.memory / 16) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white">{server.memory}GB</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Activity className="w-3 h-3" />
          <span>↑{server.network.in} ↓{server.network.out} Mbps</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Uptime {formatUptime(server.uptime)}</span>
        </div>
      </div>
    </Touchable>
  )
}

// ============================================================================
// ALERT ITEM COMPONENT
// ============================================================================

interface AlertItemProps {
  alert: Alert
  onAcknowledge: (id: string) => void
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onAcknowledge }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-error-red/10 text-error-red border-error-red/20'
      case 'high': return 'bg-warning-orange/10 text-warning-orange border-warning-orange/20'
      case 'medium': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'low': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle
      case 'high': return AlertTriangle
      case 'medium': return AlertCircle
      case 'low': return Info
      default: return AlertCircle
    }
  }

  const Icon = getSeverityIcon(alert.severity)
  const colorClass = getSeverityColor(alert.severity)

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 rounded-xl border ${colorClass} ${
        !alert.acknowledged ? 'animate-pulse' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-white">{alert.service}</h4>
            <span className="text-xs opacity-75">{formatTimeAgo(alert.timestamp)}</span>
          </div>
          <p className="text-sm mb-2">{alert.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs capitalize">{alert.severity}</span>
            {!alert.acknowledged && (
              <Touchable
                onTap={() => onAcknowledge(alert.id)}
                hapticFeedback
                className="px-3 py-1 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20 transition-colors"
              >
                Acknowledge
              </Touchable>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// SERVICE DETAILS MODAL
// ============================================================================

interface ServiceDetailsModalProps {
  service: ServiceStatus | null
  isOpen: boolean
  onClose: () => void
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({ service, isOpen, onClose }) => {
  if (!service || !isOpen) return null

  const StatusIcon = getStatusIcon(service.status)
  const statusColor = getStatusColor(service.status)

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
        className="glass-card max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${statusColor}`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{service.name}</h2>
              <p className="text-sm text-gray-400">{service.type} • {service.region}</p>
            </div>
          </div>
          <Touchable onTap={onClose} hapticFeedback className="p-2 hover:bg-dark-hover rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <p className={`text-sm font-medium capitalize ${statusColor}`}>
                {service.status}
              </p>
            </div>
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Latency</p>
              <p className="text-sm text-white">{service.latency}ms</p>
            </div>
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Uptime</p>
              <p className="text-sm text-white">{service.uptime}%</p>
            </div>
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Version</p>
              <p className="text-sm text-white">{service.version}</p>
            </div>
          </div>

          {service.lastIncident && (
            <div className="p-3 bg-dark-hover rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Last Incident</p>
              <p className="text-sm text-white">
                {new Date(service.lastIncident).toLocaleString()}
              </p>
            </div>
          )}

          {/* Performance graph placeholder */}
          <div className="h-32 bg-dark-hover rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Performance graph would go here</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
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
// HELPER FUNCTIONS
// ============================================================================

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational': return CheckCircle
    case 'degraded': return AlertTriangle
    case 'down': return XCircle
    case 'maintenance': return Clock
    default: return Activity
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational': return 'text-success-green bg-success-green/10'
    case 'degraded': return 'text-warning-orange bg-warning-orange/10'
    case 'down': return 'text-error-red bg-error-red/10'
    case 'maintenance': return 'text-blue-400 bg-blue-500/10'
    default: return 'text-gray-400 bg-gray-500/10'
  }
}

// ============================================================================
// MAIN SYSTEM HEALTH PAGE
// ============================================================================

export const SystemHealthPage: React.FC = () => {
  const [services, setServices] = useState(MOCK_SERVICES)
  const [metrics, setMetrics] = useState(MOCK_SYSTEM_METRICS)
  const [servers, setServers] = useState(MOCK_SERVERS)
  const [alerts, setAlerts] = useState(MOCK_ALERTS)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedService, setSelectedService] = useState<ServiceStatus | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate overall health
  const operationalServices = services.filter(s => s.status === 'operational').length
  const degradedServices = services.filter(s => s.status === 'degraded').length
  const downServices = services.filter(s => s.status === 'down').length
  const totalServices = services.length

  const overallHealth = (operationalServices / totalServices) * 100

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1500)
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }

  const handleServiceSelect = (service: ServiceStatus) => {
    setSelectedService(service)
    setShowDetails(true)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">System Health</h1>
          <p className="text-gray-400 text-sm mt-1">
            Monitor system performance and service status
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Touchable
            onTap={handleRefresh}
            hapticFeedback
            className={`p-3 glass-card hover:bg-dark-hover rounded-xl transition-colors ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>
      </div>

      {/* Overall Health */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Overall System Health</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-green rounded-full" />
              <span className="text-sm text-gray-400">Operational: {operationalServices}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning-orange rounded-full" />
              <span className="text-sm text-gray-400">Degraded: {degradedServices}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error-red rounded-full" />
              <span className="text-sm text-gray-400">Down: {downServices}</span>
            </div>
          </div>
        </div>
        <div className="w-full h-4 bg-dark-card rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallHealth}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${
              overallHealth > 90 ? 'bg-success-green' :
              overallHealth > 70 ? 'bg-warning-orange' :
              'bg-error-red'
            }`}
          />
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <MetricGauge key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {alerts.filter(a => !a.acknowledged).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {alerts
                .filter(a => !a.acknowledged)
                .map((alert) => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={handleAcknowledgeAlert}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceStatusCard
              key={service.id}
              service={service}
              onSelect={handleServiceSelect}
            />
          ))}
        </div>
      </div>

      {/* Servers Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Servers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {servers.map((server) => (
            <ServerCard
              key={server.id}
              server={server}
              onSelect={(server) => console.log('Server selected', server)}
            />
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {showDetails && selectedService && (
          <ServiceDetailsModal
            service={selectedService}
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
          />
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap for details</span>
          <span>🔄 Pull to refresh</span>
          <span>📊 Real-time metrics</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const Info: React.FC<{ className?: string }> = ({ className }) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const AlertCircle: React.FC<{ className?: string }> = ({ className }) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

export default SystemHealthPage
