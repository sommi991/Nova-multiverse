import React, { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  Shield, Users, Plus, Edit, Trash2, Copy,
  Check, X, AlertCircle, MoreVertical, ChevronDown,
  ChevronUp, Star, Award, Crown, Gem,
  Lock, Unlock, Eye, EyeOff, Settings,
  Save, RotateCcw, Search, Filter
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface Permission {
  id: string
  name: string
  description: string
  category: 'users' | 'content' | 'system' | 'analytics' | 'billing'
  isEnabled: boolean
  dependsOn?: string[]
}

interface Role {
  id: string
  name: string
  description: string
  icon: string
  color: string
  userCount: number
  isDefault: boolean
  isSystem: boolean
  permissions: {
    [key: string]: boolean
  }
  createdAt: string
  updatedAt: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_PERMISSIONS: Permission[] = [
  // Users category
  {
    id: 'view_users',
    name: 'View Users',
    description: 'Can view user list and profiles',
    category: 'users',
    isEnabled: true
  },
  {
    id: 'create_users',
    name: 'Create Users',
    description: 'Can create new users',
    category: 'users',
    isEnabled: true,
    dependsOn: ['view_users']
  },
  {
    id: 'edit_users',
    name: 'Edit Users',
    description: 'Can edit existing users',
    category: 'users',
    isEnabled: true,
    dependsOn: ['view_users']
  },
  {
    id: 'delete_users',
    name: 'Delete Users',
    description: 'Can delete users',
    category: 'users',
    isEnabled: false,
    dependsOn: ['view_users', 'edit_users']
  },
  {
    id: 'manage_roles',
    name: 'Manage Roles',
    description: 'Can create and edit roles',
    category: 'users',
    isEnabled: true
  },

  // Content category
  {
    id: 'view_content',
    name: 'View Content',
    description: 'Can view all content',
    category: 'content',
    isEnabled: true
  },
  {
    id: 'create_content',
    name: 'Create Content',
    description: 'Can create new content',
    category: 'content',
    isEnabled: true,
    dependsOn: ['view_content']
  },
  {
    id: 'edit_content',
    name: 'Edit Content',
    description: 'Can edit existing content',
    category: 'content',
    isEnabled: true,
    dependsOn: ['view_content']
  },
  {
    id: 'delete_content',
    name: 'Delete Content',
    description: 'Can delete content',
    category: 'content',
    isEnabled: false,
    dependsOn: ['view_content', 'edit_content']
  },
  {
    id: 'publish_content',
    name: 'Publish Content',
    description: 'Can publish content',
    category: 'content',
    isEnabled: true,
    dependsOn: ['create_content']
  },

  // System category
  {
    id: 'view_settings',
    name: 'View Settings',
    description: 'Can view system settings',
    category: 'system',
    isEnabled: true
  },
  {
    id: 'edit_settings',
    name: 'Edit Settings',
    description: 'Can edit system settings',
    category: 'system',
    isEnabled: false,
    dependsOn: ['view_settings']
  },
  {
    id: 'manage_api',
    name: 'Manage API',
    description: 'Can manage API keys and access',
    category: 'system',
    isEnabled: false
  },
  {
    id: 'view_logs',
    name: 'View Logs',
    description: 'Can view system logs',
    category: 'system',
    isEnabled: true
  },

  // Analytics category
  {
    id: 'view_analytics',
    name: 'View Analytics',
    description: 'Can view analytics dashboard',
    category: 'analytics',
    isEnabled: true
  },
  {
    id: 'export_data',
    name: 'Export Data',
    description: 'Can export analytics data',
    category: 'analytics',
    isEnabled: false,
    dependsOn: ['view_analytics']
  },
  {
    id: 'create_reports',
    name: 'Create Reports',
    description: 'Can create custom reports',
    category: 'analytics',
    isEnabled: false,
    dependsOn: ['view_analytics']
  },

  // Billing category
  {
    id: 'view_billing',
    name: 'View Billing',
    description: 'Can view billing information',
    category: 'billing',
    isEnabled: true
  },
  {
    id: 'edit_billing',
    name: 'Edit Billing',
    description: 'Can edit billing details',
    category: 'billing',
    isEnabled: false,
    dependsOn: ['view_billing']
  },
  {
    id: 'manage_plans',
    name: 'Manage Plans',
    description: 'Can manage subscription plans',
    category: 'billing',
    isEnabled: false
  }
]

const MOCK_ROLES: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    icon: '👑',
    color: 'from-purple-500 to-pink-500',
    userCount: 3,
    isDefault: false,
    isSystem: true,
    permissions: MOCK_PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.id]: true }), {}),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Administrative access with limited system permissions',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-500',
    userCount: 12,
    isDefault: false,
    isSystem: true,
    permissions: {
      view_users: true,
      create_users: true,
      edit_users: true,
      delete_users: false,
      manage_roles: false,
      view_content: true,
      create_content: true,
      edit_content: true,
      delete_content: false,
      publish_content: true,
      view_settings: true,
      edit_settings: false,
      manage_api: false,
      view_logs: true,
      view_analytics: true,
      export_data: true,
      create_reports: false,
      view_billing: true,
      edit_billing: false,
      manage_plans: false
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Manager',
    description: 'Can manage content and view analytics',
    icon: '⭐',
    color: 'from-green-500 to-emerald-500',
    userCount: 24,
    isDefault: false,
    isSystem: true,
    permissions: {
      view_users: true,
      create_users: false,
      edit_users: false,
      delete_users: false,
      manage_roles: false,
      view_content: true,
      create_content: true,
      edit_content: true,
      delete_content: false,
      publish_content: true,
      view_settings: false,
      edit_settings: false,
      manage_api: false,
      view_logs: false,
      view_analytics: true,
      export_data: true,
      create_reports: true,
      view_billing: false,
      edit_billing: false,
      manage_plans: false
    },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-03-13T11:20:00Z'
  },
  {
    id: '4',
    name: 'Editor',
    description: 'Can create and edit content',
    icon: '✏️',
    color: 'from-orange-500 to-red-500',
    userCount: 45,
    isDefault: true,
    isSystem: true,
    permissions: {
      view_users: false,
      create_users: false,
      edit_users: false,
      delete_users: false,
      manage_roles: false,
      view_content: true,
      create_content: true,
      edit_content: true,
      delete_content: false,
      publish_content: false,
      view_settings: false,
      edit_settings: false,
      manage_api: false,
      view_logs: false,
      view_analytics: true,
      export_data: false,
      create_reports: false,
      view_billing: false,
      edit_billing: false,
      manage_plans: false
    },
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-12T14:30:00Z'
  },
  {
    id: '5',
    name: 'Viewer',
    description: 'Read-only access',
    icon: '👁️',
    color: 'from-gray-500 to-gray-600',
    userCount: 123,
    isDefault: true,
    isSystem: true,
    permissions: {
      view_users: false,
      create_users: false,
      edit_users: false,
      delete_users: false,
      manage_roles: false,
      view_content: true,
      create_content: false,
      edit_content: false,
      delete_content: false,
      publish_content: false,
      view_settings: false,
      edit_settings: false,
      manage_api: false,
      view_logs: false,
      view_analytics: false,
      export_data: false,
      create_reports: false,
      view_billing: false,
      edit_billing: false,
      manage_plans: false
    },
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-03-11T09:15:00Z'
  }
]

// ============================================================================
// PERMISSION CATEGORIES
// ============================================================================

const CATEGORIES = [
  { id: 'users', name: 'User Management', icon: Users, color: 'blue' },
  { id: 'content', name: 'Content Management', icon: Edit, color: 'green' },
  { id: 'system', name: 'System Settings', icon: Settings, color: 'purple' },
  { id: 'analytics', name: 'Analytics & Reports', icon: Eye, color: 'orange' },
  { id: 'billing', name: 'Billing & Plans', icon: Shield, color: 'pink' }
]

// ============================================================================
// ROLE CARD COMPONENT
// ============================================================================

interface RoleCardProps {
  role: Role
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [showActions, setShowActions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const getPermissionCount = () => {
    return Object.values(role.permissions).filter(Boolean).length
  }

  const getPermissionPercentage = () => {
    return Math.round((getPermissionCount() / MOCK_PERMISSIONS.length) * 100)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative cursor-pointer ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
    >
      <Touchable
        onTap={onSelect}
        onDoubleTap={() => setIsExpanded(!isExpanded)}
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-6 block"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl`}>
              {role.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{role.name}</h3>
              <p className="text-sm text-gray-400">{role.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {role.isSystem && (
              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full">
                System
              </span>
            )}
            {role.isDefault && (
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                Default
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-300">{role.userCount} users</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-300">{getPermissionCount()} permissions</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-dark-card rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getPermissionPercentage()}%` }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${role.color}`}
          />
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-dark-border"
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">{new Date(role.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last updated</span>
                  <span className="text-white">{new Date(role.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              className="p-4 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
            >
              <Edit className="w-6 h-6 text-purple-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onDuplicate()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Copy className="w-6 h-6 text-blue-400" />
            </Touchable>
            {!role.isSystem && (
              <Touchable
                onTap={() => {
                  onDelete()
                  setShowActions(false)
                }}
                hapticFeedback
                className="p-4 bg-error-red/20 rounded-full hover:bg-error-red/30 transition-colors"
              >
                <Trash2 className="w-6 h-6 text-error-red" />
              </Touchable>
            )}
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
// PERMISSION MATRIX COMPONENT
// ============================================================================

interface PermissionMatrixProps {
  permissions: Permission[]
  roles: Role[]
  selectedRoleId: string | null
  onPermissionToggle: (roleId: string, permissionId: string, value: boolean) => void
  onSelectAll: (roleId: string, category?: string) => void
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  permissions,
  roles,
  selectedRoleId,
  onPermissionToggle,
  onSelectAll
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map(c => c.id))
  )

  const selectedRole = roles.find(r => r.id === selectedRoleId)

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getCategoryPermissions = (categoryId: string) => {
    return permissions.filter(p => p.category === categoryId)
  }

  const getCategorySelectedCount = (role: Role, categoryId: string) => {
    const categoryPerms = getCategoryPermissions(categoryId)
    return categoryPerms.filter(p => role.permissions[p.id]).length
  }

  const areAllInCategorySelected = (role: Role, categoryId: string) => {
    const categoryPerms = getCategoryPermissions(categoryId)
    return categoryPerms.every(p => role.permissions[p.id])
  }

  const areSomeInCategorySelected = (role: Role, categoryId: string) => {
    const categoryPerms = getCategoryPermissions(categoryId)
    return categoryPerms.some(p => role.permissions[p.id]) && 
           !areAllInCategorySelected(role, categoryId)
  }

  if (!selectedRole) {
    return (
      <div className="glass-card p-12 text-center">
        <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Role Selected</h3>
        <p className="text-gray-400">Select a role to view and edit permissions</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">
            Permissions for {selectedRole.name}
          </h2>
          <p className="text-sm text-gray-400">
            {Object.values(selectedRole.permissions).filter(Boolean).length} of {permissions.length} permissions enabled
          </p>
        </div>
        <Touchable
          onTap={() => onSelectAll(selectedRole.id)}
          hapticFeedback
          className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
        >
          Select All
        </Touchable>
      </div>

      {/* Permissions by category */}
      <div className="space-y-4">
        {CATEGORIES.map((category) => {
          const categoryPerms = getCategoryPermissions(category.id)
          const isExpanded = expandedCategories.has(category.id)
          const allSelected = areAllInCategorySelected(selectedRole, category.id)
          const someSelected = areSomeInCategorySelected(selectedRole, category.id)

          return (
            <div key={category.id} className="border border-dark-border rounded-xl overflow-hidden">
              {/* Category header */}
              <Touchable
                onTap={() => toggleCategory(category.id)}
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
                      {getCategorySelectedCount(selectedRole, category.id)} of {categoryPerms.length} enabled
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Touchable
                    onTap={(e) => {
                      e.stopPropagation()
                      onSelectAll(selectedRole.id, category.id)
                    }}
                    hapticFeedback
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      allSelected
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-dark-card text-gray-400 hover:text-white'
                    }`}
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </Touchable>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </Touchable>

              {/* Permission items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="divide-y divide-dark-border">
                      {categoryPerms.map((permission) => {
                        const isEnabled = selectedRole.permissions[permission.id]
                        const hasDependency = permission.dependsOn?.some(
                          dep => !selectedRole.permissions[dep]
                        )

                        return (
                          <div key={permission.id} className="flex items-center justify-between p-4 hover:bg-dark-hover/50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-white">
                                  {permission.name}
                                </span>
                                {hasDependency && (
                                  <span className="px-2 py-0.5 bg-warning-orange/10 text-warning-orange text-xs rounded-full">
                                    Requires dependencies
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{permission.description}</p>
                              {permission.dependsOn && permission.dependsOn.length > 0 && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Lock className="w-3 h-3 text-gray-600" />
                                  <span className="text-xs text-gray-600">
                                    Depends on: {permission.dependsOn.join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>

                            <Touchable
                              onTap={() => onPermissionToggle(selectedRole.id, permission.id, !isEnabled)}
                              hapticFeedback
                              disabled={hasDependency}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                isEnabled
                                  ? 'bg-purple-500'
                                  : hasDependency
                                    ? 'bg-gray-700 cursor-not-allowed'
                                    : 'bg-dark-card'
                              }`}
                            >
                              <motion.div
                                animate={{ x: isEnabled ? 24 : 0 }}
                                className={`w-6 h-6 rounded-full shadow-lg ${
                                  isEnabled
                                    ? 'bg-white'
                                    : hasDependency
                                      ? 'bg-gray-500'
                                      : 'bg-gray-400'
                                }`}
                              />
                            </Touchable>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// CREATE/EDIT ROLE MODAL
// ============================================================================

interface RoleModalProps {
  isOpen: boolean
  onClose: () => void
  role?: Role
  onSave: (role: Partial<Role>) => void
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, role, onSave }) => {
  const [formData, setFormData] = useState<Partial<Role>>({
    name: role?.name || '',
    description: role?.description || '',
    icon: role?.icon || '⭐',
    color: role?.color || 'from-purple-500 to-pink-500'
  })

  const icons = ['👑', '⚡', '⭐', '✏️', '👁️', '🔒', '🔑', '⚙️', '📊', '💼']
  const colors = [
    { value: 'from-purple-500 to-pink-500', label: 'Purple' },
    { value: 'from-blue-500 to-cyan-500', label: 'Blue' },
    { value: 'from-green-500 to-emerald-500', label: 'Green' },
    { value: 'from-orange-500 to-red-500', label: 'Orange' },
    { value: 'from-yellow-500 to-amber-500', label: 'Yellow' },
    { value: 'from-gray-500 to-gray-600', label: 'Gray' }
  ]

  const handleSubmit = () => {
    onSave(formData)
    onClose()
  }

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
        <h2 className="text-xl font-bold text-white mb-4">
          {role ? 'Edit Role' : 'Create New Role'}
        </h2>

        <div className="space-y-4">
          {/* Icon selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {icons.map((icon) => (
                <Touchable
                  key={icon}
                  onTap={() => setFormData({ ...formData, icon })}
                  hapticFeedback
                  className={`p-3 text-2xl bg-dark-hover rounded-lg hover:bg-purple-500/20 transition-colors ${
                    formData.icon === icon ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {icon}
                </Touchable>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Color</label>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((color) => (
                <Touchable
                  key={color.value}
                  onTap={() => setFormData({ ...formData, color: color.value })}
                  hapticFeedback
                  className={`p-3 rounded-lg bg-gradient-to-r ${color.value} text-white text-sm text-center ${
                    formData.color === color.value ? 'ring-2 ring-white' : ''
                  }`}
                >
                  {color.label}
                </Touchable>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Role Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Content Manager"
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role's purpose..."
              rows={3}
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
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
            onTap={handleSubmit}
            hapticFeedback
            className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            {role ? 'Save Changes' : 'Create Role'}
          </Touchable>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// MAIN ROLES PAGE
// ============================================================================

export const UsersRolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(MOCK_ROLES[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | undefined>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePermissionToggle = (roleId: string, permissionId: string, value: boolean) => {
    setRoles(prev => prev.map(role =>
      role.id === roleId
        ? {
            ...role,
            permissions: {
              ...role.permissions,
              [permissionId]: value
            }
          }
        : role
    ))
  }

  const handleSelectAll = (roleId: string, category?: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id !== roleId) return role

      const newPermissions = { ...role.permissions }
      
      MOCK_PERMISSIONS.forEach(permission => {
        if (!category || permission.category === category) {
          newPermissions[permission.id] = true
        }
      })

      return { ...role, permissions: newPermissions }
    }))
  }

  const handleCreateRole = (roleData: Partial<Role>) => {
    const newRole: Role = {
      id: Date.now().toString(),
      name: roleData.name || 'New Role',
      description: roleData.description || '',
      icon: roleData.icon || '⭐',
      color: roleData.color || 'from-purple-500 to-pink-500',
      userCount: 0,
      isDefault: false,
      isSystem: false,
      permissions: MOCK_PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.id]: false }), {}),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setRoles([...roles, newRole])
    setSelectedRoleId(newRole.id)
  }

  const handleUpdateRole = (roleData: Partial<Role>) => {
    setRoles(prev => prev.map(role =>
      role.id === editingRole?.id
        ? { ...role, ...roleData, updatedAt: new Date().toISOString() }
        : role
    ))
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId))
    if (selectedRoleId === roleId) {
      setSelectedRoleId(roles[0]?.id || null)
    }
    setShowDeleteConfirm(null)
  }

  const handleDuplicateRole = (role: Role) => {
    const newRole: Role = {
      ...role,
      id: Date.now().toString(),
      name: `${role.name} (Copy)`,
      userCount: 0,
      isDefault: false,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setRoles([...roles, newRole])
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage user roles and their permissions
          </p>
        </div>
        <Touchable
          onTap={() => {
            setEditingRole(undefined)
            setShowRoleModal(true)
          }}
          hapticFeedback
          className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Role</span>
        </Touchable>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles list */}
        <div className="lg:col-span-1 space-y-4">
          <AnimatePresence>
            {filteredRoles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                isSelected={selectedRoleId === role.id}
                onSelect={() => setSelectedRoleId(role.id)}
                onEdit={() => {
                  setEditingRole(role)
                  setShowRoleModal(true)
                }}
                onDelete={() => setShowDeleteConfirm(role.id)}
                onDuplicate={() => handleDuplicateRole(role)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Permissions matrix */}
        <div className="lg:col-span-2">
          <PermissionMatrix
            permissions={MOCK_PERMISSIONS}
            roles={roles}
            selectedRoleId={selectedRoleId}
            onPermissionToggle={handlePermissionToggle}
            onSelectAll={handleSelectAll}
          />
        </div>
      </div>

      {/* Role modal */}
      <AnimatePresence>
        {showRoleModal && (
          <RoleModal
            isOpen={showRoleModal}
            onClose={() => setShowRoleModal(false)}
            role={editingRole}
            onSave={editingRole ? handleUpdateRole : handleCreateRole}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-red/20 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-error-red" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">Delete Role</h2>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to delete this role? This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3">
                <Touchable
                  onTap={() => setShowDeleteConfirm(null)}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
                >
                  Cancel
                </Touchable>
                <Touchable
                  onTap={() => showDeleteConfirm && handleDeleteRole(showDeleteConfirm)}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-error-red text-white rounded-xl hover:bg-error-red/80 transition-colors"
                >
                  Delete
                </Touchable>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to select</span>
          <span>👆👆 Double tap to expand</span>
          <span>🤏 Long press for actions</span>
        </div>
      </div>
    </div>
  )
}

export default UsersRolesPage
