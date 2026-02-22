import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Filter, Plus, MoreVertical,
  Edit, Trash2, Eye, Copy, Mail, Phone,
  Shield, Star, Award, ChevronDown, ChevronUp,
  Download, Upload, RefreshCw, X, Check,
  ArrowUpDown, ArrowUp, ArrowDown, Grid, List
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  avatar: string
  department: string
  location: string
  lastActive: string
  joinDate: string
  permissions: string[]
  projects: number
  tasks: number
  rating: number
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    department: 'Engineering',
    location: 'New York, NY',
    lastActive: '2 minutes ago',
    joinDate: '2024-01-15',
    permissions: ['all'],
    projects: 12,
    tasks: 34,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 (555) 234-5678',
    role: 'manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=150&h=150&fit=crop',
    department: 'Product',
    location: 'San Francisco, CA',
    lastActive: '15 minutes ago',
    joinDate: '2024-02-01',
    permissions: ['read', 'write', 'delete'],
    projects: 8,
    tasks: 23,
    rating: 4.6
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.c@company.com',
    phone: '+1 (555) 345-6789',
    role: 'editor',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    department: 'Marketing',
    location: 'Chicago, IL',
    lastActive: '1 hour ago',
    joinDate: '2024-02-15',
    permissions: ['read', 'write'],
    projects: 5,
    tasks: 12,
    rating: 4.2
  },
  {
    id: '4',
    name: 'Emma Watson',
    email: 'emma.w@company.com',
    phone: '+1 (555) 456-7890',
    role: 'viewer',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    department: 'Sales',
    location: 'Austin, TX',
    lastActive: '2 days ago',
    joinDate: '2024-01-20',
    permissions: ['read'],
    projects: 3,
    tasks: 8,
    rating: 4.0
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@company.com',
    phone: '+1 (555) 567-8901',
    role: 'manager',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    department: 'Engineering',
    location: 'Seattle, WA',
    lastActive: '5 hours ago',
    joinDate: '2024-03-01',
    permissions: ['read', 'write'],
    projects: 6,
    tasks: 15,
    rating: 4.3
  },
  {
    id: '6',
    name: 'Lisa Brown',
    email: 'lisa.b@company.com',
    phone: '+1 (555) 678-9012',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    department: 'Operations',
    location: 'Boston, MA',
    lastActive: '30 minutes ago',
    joinDate: '2024-01-10',
    permissions: ['all'],
    projects: 15,
    tasks: 42,
    rating: 4.9
  }
]

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ElementType
  color: string
  index: number
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Touchable
        onTap={() => console.log('Stats card tapped')}
        onDoubleTap={() => console.log('Double tap - show details')}
        onLongPress={() => console.log('Long press - export')}
        hapticFeedback
        scaleOnTap
        className="glass-card p-6 relative overflow-hidden group"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            {change && (
              <span className="text-success-green text-sm">{change}</span>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
          <p className="text-gray-400 text-sm">{title}</p>
        </div>
      </Touchable>
    </motion.div>
  )
}

// ============================================================================
// USER CARD COMPONENT (Grid View)
// ============================================================================

interface UserCardProps {
  user: User
  onSelect: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onDuplicate: (user: User) => void
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-success-green/10 text-success-green'
      case 'inactive': return 'bg-gray-500/10 text-gray-400'
      case 'pending': return 'bg-warning-orange/10 text-warning-orange'
      case 'suspended': return 'bg-error-red/10 text-error-red'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-purple-400" />
      case 'manager': return <Award className="w-4 h-4 text-blue-400" />
      case 'editor': return <Edit className="w-4 h-4 text-green-400" />
      case 'viewer': return <Eye className="w-4 h-4 text-gray-400" />
      default: return <Users className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="relative"
    >
      <Touchable
        onTap={() => onSelect(user)}
        onDoubleTap={() => setIsExpanded(!isExpanded)}
        onLongPress={() => setShowActions(true)}
        onSwipe={(direction) => {
          if (direction === 'left') onDelete(user)
          if (direction === 'right') onDuplicate(user)
        }}
        hapticFeedback
        className="glass-card p-6 cursor-pointer block"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-500/20"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-card ${
                user.status === 'active' ? 'bg-success-green' :
                user.status === 'inactive' ? 'bg-gray-500' :
                user.status === 'pending' ? 'bg-warning-orange' :
                'bg-error-red'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{user.name}</h3>
              <p className="text-sm text-gray-400">{user.department}</p>
              <div className="flex items-center space-x-2 mt-1">
                {getRoleIcon(user.role)}
                <span className="text-xs text-gray-500 capitalize">{user.role}</span>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
            {user.status}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-300">{user.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-300">{user.phone}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-dark-hover rounded-lg">
            <p className="text-lg font-bold text-white">{user.projects}</p>
            <p className="text-xs text-gray-400">Projects</p>
          </div>
          <div className="text-center p-2 bg-dark-hover rounded-lg">
            <p className="text-lg font-bold text-white">{user.tasks}</p>
            <p className="text-xs text-gray-400">Tasks</p>
          </div>
          <div className="text-center p-2 bg-dark-hover rounded-lg">
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 text-gold fill-current" />
              <span className="text-lg font-bold text-white">{user.rating}</span>
            </div>
            <p className="text-xs text-gray-400">Rating</p>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-dark-border"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Location</span>
                  <span className="text-white">{user.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Joined</span>
                  <span className="text-white">{user.joinDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Active</span>
                  <span className="text-white">{user.lastActive}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Permissions</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.permissions.map((perm, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Touchable>

      {/* Quick Actions Overlay */}
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
                onEdit(user)
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
            >
              <Edit className="w-6 h-6 text-purple-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onDuplicate(user)
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Copy className="w-6 h-6 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onDelete(user)
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-error-red/20 rounded-full hover:bg-error-red/30 transition-colors"
            >
              <Trash2 className="w-6 h-6 text-error-red" />
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
// USER TABLE ROW (List View)
// ============================================================================

interface UserTableRowProps {
  user: User
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}) => {
  return (
    <Touchable
      onTap={onSelect}
      onDoubleTap={onEdit}
      onSwipe={(direction) => {
        if (direction === 'left') onDelete()
      }}
      hapticFeedback
      className={`border-b border-dark-border hover:bg-dark-hover/50 transition-colors ${
        isSelected ? 'bg-purple-500/10' : ''
      }`}
    >
      <tr>
        <td className="py-3 px-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded border-dark-border bg-dark-hover text-purple-500"
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center space-x-2">
            {getRoleIcon(user.role)}
            <span className="text-sm text-gray-300 capitalize">{user.role}</span>
          </div>
        </td>
        <td className="py-3 px-4">
          <span className={`px-2 py-1 text-xs rounded-full ${
            user.status === 'active' ? 'bg-success-green/10 text-success-green' :
            user.status === 'inactive' ? 'bg-gray-500/10 text-gray-400' :
            user.status === 'pending' ? 'bg-warning-orange/10 text-warning-orange' :
            'bg-error-red/10 text-error-red'
          }`}>
            {user.status}
          </span>
        </td>
        <td className="py-3 px-4">
          <p className="text-sm text-gray-300">{user.department}</p>
        </td>
        <td className="py-3 px-4">
          <p className="text-sm text-gray-300">{user.location}</p>
        </td>
        <td className="py-3 px-4">
          <p className="text-sm text-gray-400">{user.lastActive}</p>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center space-x-2">
            <Touchable
              onTap={onEdit}
              hapticFeedback
              className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-400" />
            </Touchable>
            <Touchable
              onTap={onDelete}
              hapticFeedback
              className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-gray-400" />
            </Touchable>
            <Touchable
              onTap={() => {}}
              hapticFeedback
              className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Touchable>
          </div>
        </td>
      </tr>
    </Touchable>
  )
}

// ============================================================================
// FILTER BAR COMPONENT
// ============================================================================

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  roleFilter: string
  onRoleFilterChange: (role: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search users by name, email, department..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-3">
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="px-4 py-3 bg-dark-hover border border-dark-border rounded-xl text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-3 bg-dark-hover border border-dark-border rounded-xl text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-dark-hover rounded-xl p-1">
          <Touchable
            onTap={() => onViewModeChange('grid')}
            hapticFeedback
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400'
            }`}
          >
            <Grid className="w-5 h-5" />
          </Touchable>
          <Touchable
            onTap={() => onViewModeChange('list')}
            hapticFeedback
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400'
            }`}
          >
            <List className="w-5 h-5" />
          </Touchable>
        </div>

        {/* Actions */}
        <Touchable
          onTap={() => console.log('Refresh')}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:bg-purple-500/20 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </Touchable>

        <Touchable
          onTap={() => console.log('Export')}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:bg-purple-500/20 transition-colors"
        >
          <Download className="w-5 h-5 text-gray-400" />
        </Touchable>
      </div>
    </div>
  )
}

// ============================================================================
// BULK ACTIONS BAR
// ============================================================================

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onBulkDelete: () => void
  onBulkExport: () => void
  onBulkUpdateRole: () => void
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkExport,
  onBulkUpdateRole
}) => {
  if (selectedCount === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-6 py-4 rounded-full z-50"
    >
      <div className="flex items-center space-x-4">
        <span className="text-white">
          <span className="font-bold">{selectedCount}</span> users selected
        </span>
        <div className="w-px h-6 bg-dark-border" />
        <Touchable
          onTap={onBulkDelete}
          hapticFeedback
          className="px-4 py-2 bg-error-red/20 text-error-red rounded-lg hover:bg-error-red/30 transition-colors"
        >
          Delete
        </Touchable>
        <Touchable
          onTap={onBulkExport}
          hapticFeedback
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          Export
        </Touchable>
        <Touchable
          onTap={onBulkUpdateRole}
          hapticFeedback
          className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
        >
          Update Role
        </Touchable>
        <div className="w-px h-6 bg-dark-border" />
        <Touchable
          onTap={onClearSelection}
          hapticFeedback
          className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </Touchable>
      </div>
    </motion.div>
  )
}

// ============================================================================
// MAIN USERS LIST PAGE
// ============================================================================

export const UsersListPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User
    direction: 'asc' | 'desc'
  } | null>(null)

  // Filter users
  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.department.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [searchQuery, roleFilter, statusFilter])

  // Sort users
  const sortedUsers = useMemo(() => {
    if (!sortConfig) return filteredUsers

    return [...filteredUsers].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredUsers, sortConfig])

  // Stats
  const stats = {
    total: MOCK_USERS.length,
    active: MOCK_USERS.filter(u => u.status === 'active').length,
    admins: MOCK_USERS.filter(u => u.role === 'admin').length,
    pending: MOCK_USERS.filter(u => u.status === 'pending').length
  }

  const handleSelectAll = () => {
    if (selectedUsers.size === sortedUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(sortedUsers.map(u => u.id)))
    }
  }

  const handleSelectUser = (id: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedUsers(newSelected)
  }

  const handleSort = (key: keyof User) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' }
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })
  }

  const handleDelete = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log('Delete user:', user)
    }
  }

  const handleEdit = (user: User) => {
    window.location.href = `/admin/users/${user.id}/edit`
  }

  const handleView = (user: User) => {
    window.location.href = `/admin/users/${user.id}`
  }

  const handleDuplicate = (user: User) => {
    console.log('Duplicate user:', user)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your team members and their permissions</p>
        </div>
        <Touchable
          onTap={() => window.location.href = '/admin/users/create'}
          hapticFeedback
          className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </Touchable>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.total}
          change="+12.5%"
          icon={Users}
          color="from-purple-500 to-pink-500"
          index={0}
        />
        <StatsCard
          title="Active Users"
          value={stats.active}
          change="+8.2%"
          icon={Users}
          color="from-blue-500 to-cyan-500"
          index={1}
        />
        <StatsCard
          title="Admins"
          value={stats.admins}
          change="+2"
          icon={Shield}
          color="from-green-500 to-emerald-500"
          index={2}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Users}
          color="from-orange-500 to-red-500"
          index={3}
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Bulk Selection Header */}
      {viewMode === 'list' && (
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="checkbox"
            checked={selectedUsers.size === sortedUsers.length}
            onChange={handleSelectAll}
            className="rounded border-dark-border bg-dark-hover text-purple-500"
          />
          <span className="text-sm text-gray-400">
            {selectedUsers.size} of {sortedUsers.length} selected
          </span>
        </div>
      )}

      {/* Users Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onSelect={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-card p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === sortedUsers.length}
                    onChange={handleSelectAll}
                    className="rounded border-dark-border bg-dark-hover text-purple-500"
                  />
                </th>
                {[
                  { key: 'name', label: 'User' },
                  { key: 'role', label: 'Role' },
                  { key: 'status', label: 'Status' },
                  { key: 'department', label: 'Department' },
                  { key: 'location', label: 'Location' },
                  { key: 'lastActive', label: 'Last Active' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="py-3 px-4 text-left cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort(col.key as keyof User)}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-400">{col.label}</span>
                      {sortConfig?.key === col.key && (
                        sortConfig.direction === 'asc' 
                          ? <ArrowUp className="w-4 h-4 text-purple-400" />
                          : <ArrowDown className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isSelected={selectedUsers.has(user.id)}
                  onSelect={() => handleSelectUser(user.id)}
                  onEdit={() => handleEdit(user)}
                  onDelete={() => handleDelete(user)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bulk Actions */}
      <BulkActionsBar
        selectedCount={selectedUsers.size}
        onClearSelection={() => setSelectedUsers(new Set())}
        onBulkDelete={() => console.log('Bulk delete')}
        onBulkExport={() => console.log('Bulk export')}
        onBulkUpdateRole={() => console.log('Bulk update role')}
      />

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-6 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view</span>
          <span>👆👆 Double tap to edit</span>
          <span>🤏 Long press for actions</span>
          <span>👉 Swipe left to delete</span>
        </div>
      </div>
    </div>
  )
}

// Helper function for role icons (reused from above)
const getRoleIcon = (role: User['role']) => {
  switch (role) {
    case 'admin': return <Shield className="w-4 h-4 text-purple-400" />
    case 'manager': return <Award className="w-4 h-4 text-blue-400" />
    case 'editor': return <Edit className="w-4 h-4 text-green-400" />
    case 'viewer': return <Eye className="w-4 h-4 text-gray-400" />
    default: return <Users className="w-4 h-4 text-gray-400" />
  }
}

export default UsersListPage
