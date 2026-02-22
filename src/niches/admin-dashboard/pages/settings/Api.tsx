import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Key, Shield, Eye, EyeOff, Copy, Check,
  Plus, Trash2, Edit, RefreshCw, Download,
  Globe, Webhook, Zap, AlertCircle, X,
  Clock, Calendar, BarChart3, Activity,
  Lock, Unlock, Server, Database, Cloud,
  Github, Slack, Discord, Twitter, Facebook,
  ChevronDown, ChevronUp, MoreVertical
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface ApiKey {
  id: string
  name: string
  key: string
  prefix: string
  createdAt: string
  lastUsed: string
  expiresAt: string | null
  permissions: string[]
  rateLimit: number
  usage: number
  status: 'active' | 'expired' | 'revoked'
}

interface Webhook {
  id: string
  url: string
  events: string[]
  secret: string
  createdAt: string
  lastTriggered: string | null
  status: 'active' | 'paused' | 'failed'
  failureCount: number
}

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ElementType
  connected: boolean
  config: Record<string, any>
}

interface ApiLog {
  id: string
  timestamp: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  status: number
  duration: number
  apiKey: string
  ip: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_API_KEYS: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: '',
    prefix: 'sk_live',
    createdAt: '2024-01-15T10:30:00Z',
    lastUsed: '2024-03-15T14:23:00Z',
    expiresAt: null,
    permissions: ['read', 'write', 'delete'],
    rateLimit: 1000,
    usage: 45678,
    status: 'active'
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'sk_dev_1x9m8q3n4v6b2h1k5j8f4d1s7a4w6e2r',
    prefix: 'sk_dev',
    createdAt: '2024-02-01T09:15:00Z',
    lastUsed: '2024-03-15T10:05:00Z',
    expiresAt: '2024-06-01T09:15:00Z',
    permissions: ['read', 'write'],
    rateLimit: 500,
    usage: 12345,
    status: 'active'
  },
  {
    id: '3',
    name: 'Staging API Key',
    key: 'sk_stage_3x7m6q2n5v4b1h0k4j7f3d0s6a3w5e1r',
    prefix: 'sk_stage',
    createdAt: '2024-02-15T14:20:00Z',
    lastUsed: '2024-03-14T16:45:00Z',
    expiresAt: '2024-05-15T14:20:00Z',
    permissions: ['read'],
    rateLimit: 200,
    usage: 5678,
    status: 'active'
  }
]

const MOCK_WEBHOOKS: Webhook[] = [
  {
    id: '1',
    url: 'https://api.example.com/webhooks/user-created',
    events: ['user.created', 'user.updated'],
    secret: 'whsec_abc123def456ghi789jkl',
    createdAt: '2024-02-10T11:30:00Z',
    lastTriggered: '2024-03-15T09:23:00Z',
    status: 'active',
    failureCount: 0
  },
  {
    id: '2',
    url: 'https://api.example.com/webhooks/payment-success',
    events: ['payment.succeeded', 'payment.failed'],
    secret: 'whsec_jkl789ghi456def123abc',
    createdAt: '2024-02-12T15:45:00Z',
    lastTriggered: '2024-03-14T22:10:00Z',
    status: 'active',
    failureCount: 2
  },
  {
    id: '3',
    url: 'https://api.example.com/webhooks/order-updates',
    events: ['order.created', 'order.updated', 'order.cancelled'],
    secret: 'whsec_mno456pqr789stu123vwx',
    createdAt: '2024-02-20T09:00:00Z',
    lastTriggered: null,
    status: 'paused',
    failureCount: 5
  }
]

const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync your repositories and manage webhooks',
    icon: Github,
    connected: true,
    config: {
      username: 'johndoe',
      repos: 23
    }
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Receive notifications in your Slack channels',
    icon: Slack,
    connected: true,
    config: {
      workspace: 'company',
      channels: 3
    }
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send alerts and updates to Discord',
    icon: Discord,
    connected: false,
    config: {}
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'Post updates and monitor mentions',
    icon: Twitter,
    connected: false,
    config: {}
  }
]

const MOCK_API_LOGS: ApiLog[] = [
  {
    id: '1',
    timestamp: '2024-03-15T14:23:45Z',
    method: 'GET',
    endpoint: '/api/v1/users',
    status: 200,
    duration: 123,
    apiKey: 'Production API Key',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: '2024-03-15T14:22:30Z',
    method: 'POST',
    endpoint: '/api/v1/users',
    status: 201,
    duration: 234,
    apiKey: 'Production API Key',
    ip: '192.168.1.100'
  },
  {
    id: '3',
    timestamp: '2024-03-15T14:21:15Z',
    method: 'GET',
    endpoint: '/api/v1/products',
    status: 200,
    duration: 89,
    apiKey: 'Development API Key',
    ip: '192.168.1.101'
  },
  {
    id: '4',
    timestamp: '2024-03-15T14:20:00Z',
    method: 'DELETE',
    endpoint: '/api/v1/users/123',
    status: 403,
    duration: 56,
    apiKey: 'Development API Key',
    ip: '192.168.1.101'
  }
]

// ============================================================================
// API KEY CARD COMPONENT
// ============================================================================

interface ApiKeyCardProps {
  apiKey: ApiKey
  onCopy: () => void
  onEdit: () => void
  onRevoke: () => void
  onRegenerate: () => void
}

const ApiKeyCard: React.FC<ApiKeyCardProps> = ({
  apiKey,
  onCopy,
  onEdit,
  onRevoke,
  onRegenerate
}) => {
  const [showKey, setShowKey] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-green/10 text-success-green'
      case 'expired': return 'bg-warning-orange/10 text-warning-orange'
      case 'revoked': return 'bg-error-red/10 text-error-red'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const usagePercentage = (apiKey.usage / (apiKey.rateLimit * 1000)) * 100

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      <Touchable
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-4 block hover:scale-105 transition-transform"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Key className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-medium">{apiKey.name}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(apiKey.status)}`}>
                  {apiKey.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Created {new Date(apiKey.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Touchable
              onTap={handleCopy}
              hapticFeedback
              className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success-green" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </Touchable>
            <Touchable
              onTap={() => setShowKey(!showKey)}
              hapticFeedback
              className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </Touchable>
          </div>
        </div>

        {/* API Key display */}
        <div className="mb-4">
          <div className="font-mono text-sm bg-dark-hover p-3 rounded-lg">
            {showKey ? apiKey.key : `${apiKey.prefix}_••••••••••••••••`}
          </div>
        </div>

        {/* Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Usage this month</span>
            <span className="text-white">{apiKey.usage.toLocaleString()} / {apiKey.rateLimit * 1000}</span>
          </div>
          <div className="w-full h-1.5 bg-dark-card rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full ${usagePercentage > 80 ? 'bg-warning-orange' : 'bg-purple-500'}`}
            />
          </div>
        </div>

        {/* Permissions */}
        <div className="flex flex-wrap gap-1 mt-3">
          {apiKey.permissions.map((perm) => (
            <span
              key={perm}
              className="px-2 py-0.5 bg-dark-hover text-gray-300 text-xs rounded-full"
            >
              {perm}
            </span>
          ))}
        </div>

        {/* Expiry */}
        {apiKey.expiresAt && (
          <p className="text-xs text-gray-500 mt-3">
            Expires {new Date(apiKey.expiresAt).toLocaleDateString()}
          </p>
        )}
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
                onRegenerate()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-blue-400" />
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
                onRevoke()
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
    </motion.div>
  )
}

// ============================================================================
// WEBHOOK CARD COMPONENT
// ============================================================================

interface WebhookCardProps {
  webhook: Webhook
  onEdit: () => void
  onToggle: () => void
  onDelete: () => void
}

const WebhookCard: React.FC<WebhookCardProps> = ({
  webhook,
  onEdit,
  onToggle,
  onDelete
}) => {
  const [showSecret, setShowSecret] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-green/10 text-success-green'
      case 'paused': return 'bg-warning-orange/10 text-warning-orange'
      case 'failed': return 'bg-error-red/10 text-error-red'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  return (
    <div className="relative">
      <Touchable
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-4 block hover:scale-105 transition-transform"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Webhook className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-medium">Webhook</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(webhook.status)}`}>
                  {webhook.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1 break-all">{webhook.url}</p>
            </div>
          </div>
          <Touchable
            onTap={onToggle}
            hapticFeedback
            className={`w-12 h-6 rounded-full transition-colors ${
              webhook.status === 'active' ? 'bg-purple-500' : 'bg-dark-card'
            }`}
          >
            <motion.div
              animate={{ x: webhook.status === 'active' ? 24 : 0 }}
              className="w-6 h-6 bg-white rounded-full shadow-lg"
            />
          </Touchable>
        </div>

        {/* Events */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2">Events</p>
          <div className="flex flex-wrap gap-1">
            {webhook.events.map((event) => (
              <span
                key={event}
                className="px-2 py-1 bg-dark-hover text-gray-300 text-xs rounded-full"
              >
                {event}
              </span>
            ))}
          </div>
        </div>

        {/* Secret */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2">Secret</p>
          <div className="flex items-center space-x-2">
            <code className="flex-1 font-mono text-sm bg-dark-hover p-2 rounded-lg">
              {showSecret ? webhook.secret : '••••••••••••••••••••••••'}
            </code>
            <Touchable
              onTap={() => setShowSecret(!showSecret)}
              hapticFeedback
              className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
            >
              {showSecret ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </Touchable>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-xs">
          <span className="text-gray-400">
            Created {new Date(webhook.createdAt).toLocaleDateString()}
          </span>
          {webhook.lastTriggered && (
            <span className="text-gray-400">
              Last triggered {new Date(webhook.lastTriggered).toLocaleDateString()}
            </span>
          )}
          {webhook.failureCount > 0 && (
            <span className="text-error-red">Failed {webhook.failureCount} times</span>
          )}
        </div>
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
                onEdit()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Edit className="w-5 h-5 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onToggle()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
            >
              {webhook.status === 'active' ? (
                <Pause className="w-5 h-5 text-purple-400" />
              ) : (
                <Play className="w-5 h-5 text-purple-400" />
              )}
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
// INTEGRATION CARD COMPONENT
// ============================================================================

interface IntegrationCardProps {
  integration: Integration
  onConnect: () => void
  onConfigure: () => void
  onDisconnect: () => void
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onConfigure,
  onDisconnect
}) => {
  const Icon = integration.icon

  return (
    <Touchable
      onTap={integration.connected ? onConfigure : onConnect}
      hapticFeedback
      className="glass-card p-4 hover:scale-105 transition-transform"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-dark-hover">
            <Icon className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">{integration.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{integration.description}</p>
            {integration.connected && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-success-green">Connected</span>
                {Object.entries(integration.config).map(([key, value]) => (
                  <span key={key} className="text-xs text-gray-500">
                    • {key}: {value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {integration.connected ? (
          <Touchable
            onTap={(e) => {
              e.stopPropagation()
              onDisconnect()
            }}
            hapticFeedback
            className="p-2 hover:bg-error-red/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-error-red" />
          </Touchable>
        ) : (
          <span className="text-purple-400 text-sm">Connect →</span>
        )}
      </div>
    </Touchable>
  )
}

// ============================================================================
// API LOG ITEM COMPONENT
// ============================================================================

interface ApiLogItemProps {
  log: ApiLog
}

const ApiLogItem: React.FC<ApiLogItemProps> = ({ log }) => {
  const getStatusColor = (status: number) => {
    if (status < 300) return 'text-success-green'
    if (status < 400) return 'text-warning-orange'
    return 'text-error-red'
  }

  return (
    <div className="flex items-center space-x-4 py-3 border-b border-dark-border last:border-0 text-sm">
      <span className={`font-mono ${getStatusColor(log.status)}`}>{log.status}</span>
      <span className="text-purple-400 font-mono">{log.method}</span>
      <span className="text-gray-300 flex-1">{log.endpoint}</span>
      <span className="text-gray-400">{log.duration}ms</span>
      <span className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
    </div>
  )
}

// ============================================================================
// CREATE API KEY MODAL
// ============================================================================

interface CreateApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (key: Partial<ApiKey>) => void
}

const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('')
  const [permissions, setPermissions] = useState<string[]>(['read'])
  const [expires, setExpires] = useState(false)
  const [expiryDate, setExpiryDate] = useState('')

  const availablePermissions = ['read', 'write', 'delete', 'admin']

  const togglePermission = (perm: string) => {
    setPermissions(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    )
  }

  if (!isOpen) return null

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
        <h2 className="text-xl font-bold text-white mb-4">Create API Key</h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Key Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Production API Key"
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Permissions</label>
            <div className="space-y-2">
              {availablePermissions.map((perm) => (
                <Touchable
                  key={perm}
                  onTap={() => togglePermission(perm)}
                  hapticFeedback
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    permissions.includes(perm)
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-dark-border bg-dark-hover'
                  }`}
                >
                  <span className="text-sm text-gray-300 capitalize">{perm}</span>
                  {permissions.includes(perm) && (
                    <Check className="w-4 h-4 text-purple-400" />
                  )}
                </Touchable>
              ))}
            </div>
          </div>

          {/* Expiration */}
          <div>
            <Touchable
              onTap={() => setExpires(!expires)}
              hapticFeedback
              className="flex items-center justify-between p-3 bg-dark-hover rounded-xl mb-2"
            >
              <span className="text-gray-300">Set expiration date</span>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                expires ? 'bg-purple-500' : 'bg-dark-card'
              }`}>
                <motion.div
                  animate={{ x: expires ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </div>
            </Touchable>

            {expires && (
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              />
            )}
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
              onCreate({
                name,
                permissions,
                expiresAt: expires ? expiryDate : null
              })
              onClose()
            }}
            hapticFeedback
            disabled={!name}
            className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Key
          </Touchable>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// MAIN API SETTINGS PAGE
// ============================================================================

export const SettingsApiPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState(MOCK_API_KEYS)
  const [webhooks, setWebhooks] = useState(MOCK_WEBHOOKS)
  const [integrations, setIntegrations] = useState(MOCK_INTEGRATIONS)
  const [apiLogs, setApiLogs] = useState(MOCK_API_LOGS)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'integrations' | 'logs'>('keys')

  const totalRequests = apiLogs.length
  const avgResponseTime = Math.round(apiLogs.reduce((sum, log) => sum + log.duration, 0) / apiLogs.length)
  const successRate = Math.round((apiLogs.filter(l => l.status < 400).length / apiLogs.length) * 100)

  const handleCreateKey = (keyData: Partial<ApiKey>) => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: keyData.name || 'New Key',
      key: `sk_${Math.random().toString(36).substr(2, 32)}`,
      prefix: 'sk',
      createdAt: new Date().toISOString(),
      lastUsed: 'Never',
      expiresAt: keyData.expiresAt || null,
      permissions: keyData.permissions || ['read'],
      rateLimit: 1000,
      usage: 0,
      status: 'active'
    }
    setApiKeys([...apiKeys, newKey])
  }

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === keyId ? { ...key, status: 'revoked' } : key
    ))
  }

  const handleRegenerateKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === keyId
        ? { ...key, key: `sk_${Math.random().toString(36).substr(2, 32)}` }
        : key
    ))
  }

  const handleToggleWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.map(webhook =>
      webhook.id === webhookId
        ? { ...webhook, status: webhook.status === 'active' ? 'paused' : 'active' }
        : webhook
    ))
  }

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== webhookId))
  }

  const handleConnectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, connected: true, config: { username: 'johndoe', connected: true } }
        : integration
    ))
  }

  const handleDisconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, connected: false, config: {} }
        : integration
    ))
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">API & Integrations</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage API keys, webhooks, and third-party integrations
          </p>
        </div>
        {activeTab === 'keys' && (
          <Touchable
            onTap={() => setShowCreateModal(true)}
            hapticFeedback
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create API Key</span>
          </Touchable>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">Total Requests (24h)</p>
          <p className="text-2xl font-bold text-white">{totalRequests.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">Avg Response Time</p>
          <p className="text-2xl font-bold text-white">{avgResponseTime}ms</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-success-green">{successRate}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 mb-6 border-b border-dark-border">
        {[
          { id: 'keys', label: 'API Keys', icon: Key },
          { id: 'webhooks', label: 'Webhooks', icon: Webhook },
          { id: 'integrations', label: 'Integrations', icon: Globe },
          { id: 'logs', label: 'API Logs', icon: Activity }
        ].map((tab) => (
          <Touchable
            key={tab.id}
            onTap={() => setActiveTab(tab.id as any)}
            hapticFeedback
            className={`
              flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
              }
            `}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </Touchable>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {/* API Keys Tab */}
          {activeTab === 'keys' && (
            <motion.div
              key="keys"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {apiKeys.map((key) => (
                <ApiKeyCard
                  key={key.id}
                  apiKey={key}
                  onCopy={() => navigator.clipboard.writeText(key.key)}
                  onEdit={() => console.log('Edit key', key.id)}
                  onRevoke={() => handleRevokeKey(key.id)}
                  onRegenerate={() => handleRegenerateKey(key.id)}
                />
              ))}
            </motion.div>
          )}

          {/* Webhooks Tab */}
          {activeTab === 'webhooks' && (
            <motion.div
              key="webhooks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Touchable
                onTap={() => console.log('Create webhook')}
                hapticFeedback
                className="glass-card p-4 border-2 border-dashed border-dark-border hover:border-purple-500/30 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Add New Webhook</span>
              </Touchable>
              {webhooks.map((webhook) => (
                <WebhookCard
                  key={webhook.id}
                  webhook={webhook}
                  onEdit={() => console.log('Edit webhook', webhook.id)}
                  onToggle={() => handleToggleWebhook(webhook.id)}
                  onDelete={() => handleDeleteWebhook(webhook.id)}
                />
              ))}
            </motion.div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {integrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onConnect={() => handleConnectIntegration(integration.id)}
                  onConfigure={() => console.log('Configure', integration.id)}
                  onDisconnect={() => handleDisconnectIntegration(integration.id)}
                />
              ))}
            </motion.div>
          )}

          {/* API Logs Tab */}
          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-4"
            >
              <div className="overflow-x-auto">
                {apiLogs.map((log) => (
                  <ApiLogItem key={log.id} log={log} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create API Key Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateApiKeyModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateKey}
          />
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view</span>
          <span>🤏 Long press for actions</span>
          <span>🔑 Copy API keys</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const Play: React.FC<{ className?: string }> = ({ className }) => (
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
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const Pause: React.FC<{ className?: string }> = ({ className }) => (
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
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
)

export default SettingsApiPage
