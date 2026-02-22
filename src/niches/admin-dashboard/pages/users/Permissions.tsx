import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Users, Search, Filter, Plus, Edit, Trash2,
  Check, X, AlertCircle, MoreVertical, ChevronDown,
  ChevronUp, Lock, Unlock, Eye, EyeOff, Settings,
  Save, RotateCcw, Copy, User as UserIcon,
  Briefcase, Mail, Phone, Calendar, Star,
  Award, Crown, Gem, Sparkles, Zap
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface UserPermission {
  id: string
  userId: string
  permissionId: string
  granted: boolean
  expiresAt?: string
  grantedBy: string
  grantedAt: string
  reason?: string
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
  permissionCount: number
}

interface Permission {
  id: string
  name: string
  description: string
  category: 'users' | 'content' | 'system' | 'analytics' | 'billing' | 'custom'
  isSystem: boolean
  dependsOn?: string[]
}

interface PermissionCategory {
  id: string
  name: string
  icon: React.ElementType
  color: string
  permissions: Permission[]
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    role: 'admin',
    department: 'Engineering',
    permissionCount: 24
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=150&h=150&fit=crop',
    role: 'manager',
    department: 'Product',
    permissionCount: 18
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.c@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'editor',
    department: 'Marketing',
    permissionCount: 12
  },
  {
    id: '4',
    name: 'Emma Watson',
    email: 'emma.w@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    role: 'viewer',
    department: 'Sales',
    permissionCount: 5
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@company.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    role: 'manager',
    department: 'Engineering',
    permissionCount: 16
  }
]

const MOCK_PERMISSIONS: Permission[] = [
  // Users category
  {
    id: 'view_users',
    name: 'View Users',
    description: 'Can view user list and profiles',
    category: 'users',
    isSystem: true
  },
  {
    id: 'create_users',
    name: 'Create Users',
    description: 'Can create new users',
    category: 'users',
    isSystem: true,
    dependsOn: ['view_users']
  },
  {
    id: 'edit_users',
    name: 'Edit Users',
    description: 'Can edit existing users',
    category: 'users',
    isSystem: true,
    dependsOn: ['view_users']
  },
  {
    id: 'delete_users',
    name: 'Delete Users',
    description: 'Can delete users',
    category: 'users',
    isSystem: true,
    dependsOn: ['view_users', 'edit_users']
  },
  {
    id: 'manage_roles',
    name: 'Manage Roles',
    description: 'Can create and edit roles',
    category: 'users',
    isSystem: true
  },

  // Content category
  {
    id: 'view_content',
    name: 'View Content',
    description: 'Can view all content',
    category: 'content',
    isSystem: true
  },
  {
    id: 'create_content',
    name: 'Create Content',
    description: 'Can create new content',
    category: 'content',
    isSystem: true,
    dependsOn: ['view_content']
  },
  {
    id: 'edit_content',
    name: 'Edit Content',
    description: 'Can edit existing content',
    category: 'content',
    isSystem: true,
    dependsOn: ['view_content']
  },
  {
    id: 'delete_content',
    name: 'Delete Content',
    description: 'Can delete content',
    category: 'content',
    isSystem: true,
    dependsOn: ['view_content', 'edit_content']
  },
  {
    id: 'publish_content',
    name: 'Publish Content',
    description: 'Can publish content',
    category: 'content',
    isSystem: true,
    dependsOn: ['create_content']
  },

  // System category
  {
    id: 'view_settings',
    name: 'View Settings',
    description: 'Can view system settings',
    category: 'system',
    isSystem: true
  },
  {
    id: 'edit_settings',
    name: 'Edit Settings',
    description: 'Can edit system settings',
    category: 'system',
    isSystem: true,
    dependsOn: ['view_settings']
  },
  {
    id: 'manage_api',
    name: 'Manage API',
    description: 'Can manage API keys and access',
    category: 'system',
    isSystem: true
  },
  {
    id: 'view_logs',
    name: 'View Logs',
    description: 'Can view system logs',
    category: 'system',
    isSystem: true
  },

  // Analytics category
  {
    id: 'view_analytics',
    name: 'View Analytics',
    description: 'Can view analytics dashboard',
    category: 'analytics',
    isSystem: true
  },
  {
    id: 'export_data',
    name: 'Export Data',
    description: 'Can export analytics data',
    category: 'analytics',
    isSystem: true,
    dependsOn: ['view_analytics']
  },
  {
    id: 'create_reports',
    name: 'Create Reports',
    description: 'Can create custom reports',
    category: 'analytics',
    isSystem: true,
    dependsOn: ['view_analytics']
  },

  // Billing category
  {
    id: 'view_billing',
    name: 'View Billing',
    description: 'Can view billing information',
    category: 'billing',
    isSystem: true
  },
  {
    id: 'edit_billing',
    name: 'Edit Billing',
    description: 'Can edit billing details',
    category: 'billing',
    isSystem: true,
    dependsOn: ['view_billing']
  },
  {
    id: 'manage_plans',
    name: 'Manage Plans',
    description: 'Can manage subscription plans',
    category: 'billing',
    isSystem: true
  },

  // Custom permissions
  {
    id: 'access_reports',
    name: 'Access Reports',
    description: 'Can access financial reports',
    category: 'custom',
    isSystem: false
  },
  {
    id: 'manage_team',
    name: 'Manage Team',
    description: 'Can manage team members',
    category: 'custom',
    isSystem: false
  },
  {
    id: 'view_financials',
    name: 'View Financials',
    description: 'Can view financial data',
    category: 'custom',
    isSystem: false
  },
  {
    id: 'approve_purchases',
    name: 'Approve Purchases',
    description: 'Can approve purchase requests',
    category: 'custom',
    isSystem: false
  }
]

// Generate user permissions
const generateUserPermissions = (): UserPermission[] => {
  const permissions: UserPermission[] = []
  
  MOCK_USERS.forEach(user => {
    MOCK_PERMISSIONS.forEach(permission => {
      // Randomly grant about 60% of permissions
      if (Math.random() > 0.4) {
        permissions.push({
          id: `${user.id}-${permission.id}`,
          userId: user.id,
          permissionId: permission.id,
          granted: true,
          grantedBy: 'admin_1',
          grantedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          reason: Math.random() > 0.7 ? 'Required for role' : undefined
        })
      }
    })
  })
  
  return permissions
}

const MOCK_USER_PERMISSIONS = generateUserPermissions()

// ============================================================================
// PERMISSION CATEGORIES
// ============================================================================

const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'users',
    name: 'User Management',
    icon: Users,
    color: 'blue',
    permissions: MOCK_PERMISSIONS.filter(p => p.category === 'users')
  },
  {
    id: 'content',
    name: 'Content Management',
    icon: Edit,
    color: 'green',
    permissions: MOCK_PERMISSIONS.filter(p => p.category === 'content')
  },
  {
    id: 'system',
    name: 'System Settings',
    icon: Settings,
    color: 'purple',
    permissions: MOCK_PERMISSIONS.filter(p => p.category === 'system')
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: Eye,
    color: 'orange',
    permissions: MOCK_PERMISSIONS.filter(p => p.category === 'analytics')
  },
  {
    id: 'billing',
    name: 'Billing',
    icon: Shield,
    color: 'pink',
    permissions: MOCK_PERMISSIONS.filter(p => p.category === 'billing')
  },
  {
    id: 'custom',
    name: 'Custom Permissions',
    icon: Sparkles,
    color: 'yellow',
    permissions: MOCK_PERMISSIONS.filter(p => p.category === 'custom')
  }
]

// ============================================================================
// USER CARD COMPONENT
// ============================================================================

interface UserCardProps {
  user: User
  isSelected: boolean
  onSelect: () => void
  grantedCount: number
  totalCount: number
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isSelected,
  onSelect,
  grantedCount,
  totalCount
}) => {
  const percentage = (grantedCount / totalCount) * 100

  return (
    <Touchable
      onTap={onSelect}
      hapticFeedback
      className={`glass-card p-4 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-purple-500' : 'hover:bg-dark-hover'
      }`}
    >
      <div className="flex items-center space-x-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-white font-medium">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.email}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500">{user.role}</span>
            <span className="text-xs text-gray-600">•</span>
            <span className="text-xs text-gray-500">{user.department}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">{grantedCount}</p>
          <p className="text-xs text-gray-400">permissions</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-dark-card rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-purple-500"
        />
      </div>
    </Touchable>
  )
}

// ============================================================================
// PERMISSION ROW COMPONENT
// ============================================================================

interface PermissionRowProps {
  permission: Permission
  userPermissions: UserPermission[]
  onToggle: (permissionId: string, granted: boolean) => void
  onAddReason: (permissionId: string) => void
  onSetExpiry: (permissionId: string) => void
}

const PermissionRow: React.FC<PermissionRowProps> = ({
  permission,
  userPermissions,
  onToggle,
  onAddReason,
  onSetExpiry
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const userPermission = userPermissions.find(up => up.permissionId === permission.id)
  const isGranted = userPermission?.granted || false
  const hasExpiry = !!userPermission?.expiresAt
  const hasReason = !!userPermission?.reason

  return (
    <div className="border-b border-dark-border last:border-0">
      {/* Main row */}
      <div className="flex items-center justify-between p-4 hover:bg-dark-hover/50 transition-colors">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">
              {permission.name}
            </span>
            {permission.isSystem && (
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full">
                System
              </span>
            )}
            {hasExpiry && (
              <span className="px-2 py-0.5 bg-warning-orange/10 text-warning-orange text-xs rounded-full">
                Expires soon
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">{permission.description}</p>
          
          {/* Dependency indicators */}
          {permission.dependsOn && permission.dependsOn.length > 0 && (
            <div className="flex items-center space-x-1 mt-1">
              <Lock className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-600">
                Requires: {permission.dependsOn.join(', ')}
              </span>
            </div>
          )}

          {/* Metadata */}
          {(hasReason || hasExpiry) && (
            <div className="flex items-center space-x-3 mt-2">
              {hasReason && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{userPermission?.reason}</span>
                </div>
              )}
              {hasExpiry && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    Expires: {new Date(userPermission!.expiresAt!).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Grant toggle */}
          <Touchable
            onTap={() => onToggle(permission.id, !isGranted)}
            hapticFeedback
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isGranted ? 'bg-purple-500' : 'bg-dark-card'
            }`}
          >
            <motion.div
              animate={{ x: isGranted ? 24 : 0 }}
              className="w-6 h-6 bg-white rounded-full shadow-lg"
            />
          </Touchable>

          {/* Options menu */}
          <div className="relative">
            <Touchable
              onTap={() => setIsExpanded(!isExpanded)}
              hapticFeedback
              className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Touchable>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden z-10"
                >
                  <Touchable
                    onTap={() => {
                      onAddReason(permission.id)
                      setIsExpanded(false)
                    }}
                    hapticFeedback
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Add Reason</span>
                  </Touchable>
                  
                  <Touchable
                    onTap={() => {
                      onSetExpiry(permission.id)
                      setIsExpanded(false)
                    }}
                    hapticFeedback
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Set Expiry</span>
                  </Touchable>

                  {isGranted && (
                    <Touchable
                      onTap={() => {
                        onToggle(permission.id, false)
                        setIsExpanded(false)
                      }}
                      hapticFeedback
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-error-red/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-error-red" />
                      <span className="text-sm text-error-red">Revoke</span>
                    </Touchable>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CATEGORY SECTION COMPONENT
// ============================================================================

interface CategorySectionProps {
  category: PermissionCategory
  userPermissions: UserPermission[]
  onTogglePermission: (permissionId: string, granted: boolean) => void
  onAddReason: (permissionId: string) => void
  onSetExpiry: (permissionId: string) => void
  onSelectAll: () => void
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  userPermissions,
  onTogglePermission,
  onAddReason,
  onSetExpiry,
  onSelectAll
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const grantedCount = category.permissions.filter(p => 
    userPermissions.find(up => up.permissionId === p.id)?.granted
  ).length

  const allGranted = grantedCount === category.permissions.length
  const someGranted = grantedCount > 0 && !allGranted

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <Touchable
        onTap={() => setIsExpanded(!isExpanded)}
        hapticFeedback
        className="w-full flex items-center justify-between p-4 bg-dark-hover hover:bg-dark-card transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-${category.color}-500/20`}>
            <category.icon className={`w-5 h-5 text-${category.color}-400`} />
          </div>
          <div>
            <h3 className="text-white font-medium">{category.name}</h3>
            <p className="text-xs text-gray-400">
              {grantedCount} of {category.permissions.length} granted
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Touchable
            onTap={(e) => {
              e.stopPropagation()
              onSelectAll()
            }}
            hapticFeedback
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              allGranted
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-dark-card text-gray-400 hover:text-white'
            }`}
          >
            {allGranted ? 'Revoke All' : 'Grant All'}
          </Touchable>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </Touchable>

      {/* Permissions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="divide-y divide-dark-border">
              {category.permissions.map((permission) => (
                <PermissionRow
                  key={permission.id}
                  permission={permission}
                  userPermissions={userPermissions}
                  onToggle={onTogglePermission}
                  onAddReason={onAddReason}
                  onSetExpiry={onSetExpiry}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// GRANT PERMISSION MODAL
// ============================================================================

interface GrantPermissionModalProps {
  isOpen: boolean
  onClose: () => void
  onGrant: (reason?: string, expiry?: string) => void
  permissionName: string
}

const GrantPermissionModal: React.FC<GrantPermissionModalProps> = ({
  isOpen,
  onClose,
  onGrant,
  permissionName
}) => {
  const [reason, setReason] = useState('')
  const [hasExpiry, setHasExpiry] = useState(false)
  const [expiryDate, setExpiryDate] = useState('')

  if (!isOpen) return null

  return (
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
        className="glass-card max-w-md w-full p-6"
      >
        <h2 className="text-xl font-bold text-white mb-2">Grant Permission</h2>
        <p className="text-gray-400 text-sm mb-6">
          Granting: <span className="text-purple-400">{permissionName}</span>
        </p>

        <div className="space-y-4">
          {/* Reason */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this permission being granted?"
              rows={3}
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Expiry toggle */}
          <Touchable
            onTap={() => setHasExpiry(!hasExpiry)}
            hapticFeedback
            className="flex items-center justify-between p-3 bg-dark-hover rounded-xl"
          >
            <span className="text-gray-300">Set expiration date</span>
            <div className={`w-12 h-6 rounded-full transition-colors ${
              hasExpiry ? 'bg-purple-500' : 'bg-dark-card'
            }`}>
              <motion.div
                animate={{ x: hasExpiry ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </div>
          </Touchable>

          {/* Expiry date */}
          {hasExpiry && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Expires on</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          )}
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
              onGrant(reason, hasExpiry ? expiryDate : undefined)
              onClose()
            }}
            hapticFeedback
            className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            Grant Permission
          </Touchable>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// MAIN PERMISSIONS PAGE
// ============================================================================

export const UsersPermissionsPage: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>(MOCK_USERS[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>(MOCK_USER_PERMISSIONS)
  const [showGrantModal, setShowGrantModal] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<string>('')

  const selectedUser = MOCK_USERS.find(u => u.id === selectedUserId)
  
  const filteredUsers = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getUserPermissions = (userId: string) => {
    return userPermissions.filter(up => up.userId === userId)
  }

  const getGrantedPermissions = (userId: string) => {
    return userPermissions.filter(up => up.userId === userId && up.granted)
  }

  const handleTogglePermission = (userId: string, permissionId: string, granted: boolean) => {
    setUserPermissions(prev => {
      const existing = prev.find(up => up.userId === userId && up.permissionId === permissionId)
      
      if (existing) {
        return prev.map(up =>
          up.id === existing.id
            ? { ...up, granted }
            : up
        )
      } else {
        return [
          ...prev,
          {
            id: `${userId}-${permissionId}`,
            userId,
            permissionId,
            granted,
            grantedBy: 'admin_1',
            grantedAt: new Date().toISOString()
          }
        ]
      }
    })
  }

  const handleGrantAll = (userId: string, categoryId: string) => {
    const category = PERMISSION_CATEGORIES.find(c => c.id === categoryId)
    if (!category) return

    category.permissions.forEach(permission => {
      handleTogglePermission(userId, permission.id, true)
    })
  }

  const handleRevokeAll = (userId: string, categoryId: string) => {
    const category = PERMISSION_CATEGORIES.find(c => c.id === categoryId)
    if (!category) return

    category.permissions.forEach(permission => {
      handleTogglePermission(userId, permission.id, false)
    })
  }

  const handleAddReason = (permissionId: string) => {
    setSelectedPermission(permissionId)
    setShowGrantModal(true)
  }

  const handleSetExpiry = (permissionId: string) => {
    setSelectedPermission(permissionId)
    setShowGrantModal(true)
  }

  const handleGrantWithDetails = (reason?: string, expiry?: string) => {
    if (!selectedUserId || !selectedPermission) return

    setUserPermissions(prev => {
      const existing = prev.find(up => 
        up.userId === selectedUserId && up.permissionId === selectedPermission
      )

      if (existing) {
        return prev.map(up =>
          up.id === existing.id
            ? { ...up, reason, expiresAt: expiry }
            : up
        )
      }

      return prev
    })
  }

  const grantedCount = selectedUserId ? getGrantedPermissions(selectedUserId).length : 0
  const totalCount = MOCK_PERMISSIONS.length

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">User Permissions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage granular permissions for individual users
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users list */}
        <div className="lg:col-span-1 space-y-4">
          <AnimatePresence>
            {filteredUsers.map((user) => {
              const userGrantedCount = getGrantedPermissions(user.id).length
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  isSelected={selectedUserId === user.id}
                  onSelect={() => setSelectedUserId(user.id)}
                  grantedCount={userGrantedCount}
                  totalCount={totalCount}
                />
              )
            })}
          </AnimatePresence>
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2 space-y-4">
          {selectedUser && (
            <>
              {/* User summary */}
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedUser.name}</h2>
                      <p className="text-sm text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{grantedCount}</p>
                    <p className="text-xs text-gray-400">of {totalCount} permissions</p>
                  </div>
                </div>
              </div>

              {/* Permission categories */}
              {PERMISSION_CATEGORIES.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  userPermissions={getUserPermissions(selectedUserId)}
                  onTogglePermission={(permissionId, granted) =>
                    handleTogglePermission(selectedUserId, permissionId, granted)
                  }
                  onAddReason={handleAddReason}
                  onSetExpiry={handleSetExpiry}
                  onSelectAll={() => {
                    const allGranted = category.permissions.every(p =>
                      getUserPermissions(selectedUserId).find(up => up.permissionId === p.id)?.granted
                    )
                    if (allGranted) {
                      handleRevokeAll(selectedUserId, category.id)
                    } else {
                      handleGrantAll(selectedUserId, category.id)
                    }
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Grant permission modal */}
      <AnimatePresence>
        {showGrantModal && (
          <GrantPermissionModal
            isOpen={showGrantModal}
            onClose={() => setShowGrantModal(false)}
            onGrant={handleGrantWithDetails}
            permissionName={MOCK_PERMISSIONS.find(p => p.id === selectedPermission)?.name || ''}
          />
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to toggle</span>
          <span>🤏 Long press for options</span>
          <span>📅 Set expiry dates</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const MessageSquare: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

export default UsersPermissionsPage
