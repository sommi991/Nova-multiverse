import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  User, Mail, Phone, MapPin, Globe, Calendar,
  ChevronLeft, Edit, Trash2, MoreVertical,
  Shield, Award, Star, Briefcase, Clock,
  Check, X, AlertCircle, Copy, Download,
  MessageSquare, Mail as MailIcon, Phone as PhoneIcon,
  Github, Linkedin, Twitter, Facebook,
  Key, Bell, Moon, Sun, Lock, LogIn,
  Activity, BarChart3, FileText, Settings,
  Users, UserPlus, UserCheck, UserX
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  role: 'admin' | 'manager' | 'editor' | 'viewer'
  department: string
  position: string
  location: string
  timezone: string
  username: string
  permissions: string[]
  github: string
  linkedin: string
  twitter: string
  receiveEmails: boolean
  twoFactorAuth: boolean
  darkMode: boolean
  lastLogin: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  loginCount: number
  projects: number
  tasks: number
  completedTasks: number
  documents: number
  meetings: number
}

// ============================================================================
// MOCK USER DATA
// ============================================================================

const MOCK_USER: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop',
  role: 'admin',
  department: 'Engineering',
  position: 'Senior Developer',
  location: 'New York, NY',
  timezone: 'America/New_York',
  username: 'johndoe',
  permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles', 'view_analytics'],
  github: 'https://github.com/johndoe',
  linkedin: 'https://linkedin.com/in/johndoe',
  twitter: 'https://twitter.com/johndoe',
  receiveEmails: true,
  twoFactorAuth: true,
  darkMode: true,
  lastLogin: '2024-03-15T10:30:00Z',
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-03-14T15:45:00Z',
  status: 'active',
  loginCount: 156,
  projects: 12,
  tasks: 34,
  completedTasks: 28,
  documents: 45,
  meetings: 23
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  change?: string
  color: string
  index: number
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
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
        onTap={() => console.log('Stat card tapped')}
        onDoubleTap={() => console.log('Double tap - show details')}
        hapticFeedback
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
          <p className="text-gray-400 text-sm">{label}</p>
        </div>
      </Touchable>
    </motion.div>
  )
}

// ============================================================================
// INFO ROW COMPONENT
// ============================================================================

interface InfoRowProps {
  icon: React.ElementType
  label: string
  value: string
  onCopy?: () => void
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value, onCopy }) => {
  return (
    <div className="flex items-start justify-between py-3 border-b border-dark-border last:border-0">
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-400">{label}:</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-white">{value}</span>
        {onCopy && (
          <Touchable
            onTap={onCopy}
            hapticFeedback
            className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </Touchable>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// PERMISSION BADGE COMPONENT
// ============================================================================

interface PermissionBadgeProps {
  permission: string
}

const PermissionBadge: React.FC<PermissionBadgeProps> = ({ permission }) => {
  const getPermissionColor = (perm: string) => {
    switch (perm) {
      case 'read': return 'bg-blue-500/10 text-blue-400'
      case 'write': return 'bg-green-500/10 text-green-400'
      case 'delete': return 'bg-red-500/10 text-red-400'
      case 'manage_users': return 'bg-purple-500/10 text-purple-400'
      case 'manage_roles': return 'bg-indigo-500/10 text-indigo-400'
      case 'view_analytics': return 'bg-orange-500/10 text-orange-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const getPermissionLabel = (perm: string) => {
    return perm.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${getPermissionColor(permission)}`}>
      {getPermissionLabel(permission)}
    </span>
  )
}

// ============================================================================
// ACTIVITY ITEM COMPONENT
// ============================================================================

interface ActivityItemProps {
  icon: React.ElementType
  action: string
  time: string
  color: string
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon: Icon,
  action,
  time,
  color
}) => {
  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-20`}>
        <Icon className={`w-4 h-4 text-${color.split('-')[1]}-400`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-white">{action}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

// ============================================================================
// QUICK ACTION BUTTON
// ============================================================================

interface QuickActionProps {
  icon: React.ElementType
  label: string
  color: string
  onTap: () => void
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon: Icon,
  label,
  color,
  onTap
}) => {
  return (
    <Touchable
      onTap={onTap}
      hapticFeedback
      className="flex flex-col items-center space-y-2 p-3 glass-card hover:bg-dark-hover transition-colors"
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs text-gray-300">{label}</span>
    </Touchable>
  )
}

// ============================================================================
// MAIN USER VIEW PAGE
// ============================================================================

export const UsersViewPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { triggerHaptic } = useGestures()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'documents'>('overview')
  const [showActions, setShowActions] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const user = MOCK_USER

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    triggerHaptic([10])
    // Show toast notification
  }

  const handleEdit = () => {
    navigate(`/admin/users/${id}/edit`)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    triggerHaptic([30, 20, 30])
    setShowDeleteConfirm(false)
    // Simulate delete
    setTimeout(() => {
      navigate('/admin/users')
    }, 1000)
  }

  const handleMessage = () => {
    console.log('Send message to user')
  }

  const handleEmail = () => {
    window.location.href = `mailto:${user.email}`
  }

  const handleCall = () => {
    window.location.href = `tel:${user.phone}`
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-success-green/10 text-success-green'
      case 'inactive': return 'bg-gray-500/10 text-gray-400'
      case 'pending': return 'bg-warning-orange/10 text-warning-orange'
      case 'suspended': return 'bg-error-red/10 text-error-red'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Touchable
            onTap={() => navigate('/admin/users')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </Touchable>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">User Profile</h1>
            <p className="text-gray-400 text-sm mt-1">
              Viewing {user.firstName} {user.lastName}'s details
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Actions menu */}
          <div className="relative">
            <Touchable
              onTap={() => setShowActions(!showActions)}
              hapticFeedback
              className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </Touchable>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden z-50"
                >
                  <Touchable
                    onTap={() => {
                      handleEdit()
                      setShowActions(false)
                    }}
                    hapticFeedback
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
                  >
                    <Edit className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Edit User</span>
                  </Touchable>
                  
                  <Touchable
                    onTap={() => {
                      handleMessage()
                      setShowActions(false)
                    }}
                    hapticFeedback
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Send Message</span>
                  </Touchable>
                  
                  <Touchable
                    onTap={() => {
                      handleEmail()
                      setShowActions(false)
                    }}
                    hapticFeedback
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
                  >
                    <MailIcon className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Send Email</span>
                  </Touchable>
                  
                  <Touchable
                    onTap={() => {
                      handleCall()
                      setShowActions(false)
                    }}
                    hapticFeedback
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
                  >
                    <PhoneIcon className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-300">Call User</span>
                  </Touchable>
                  
                  <div className="border-t border-dark-border my-1" />
                  
                  <Touchable
                    onTap={() => {
                      handleDelete()
                      setShowActions(false)
                    }}
                    hapticFeedback
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-error-red/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-error-red" />
                    <span className="text-sm text-error-red">Delete User</span>
                  </Touchable>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Edit button */}
          <Touchable
            onTap={handleEdit}
            hapticFeedback
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit</span>
          </Touchable>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
            {/* Avatar */}
            <div className="relative mb-6 lg:mb-0">
              <div className="relative w-32 h-32 mx-auto lg:mx-0">
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full rounded-full object-cover ring-4 ring-purple-500/20"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-card ${
                  user.status === 'active' ? 'bg-success-green' :
                  user.status === 'inactive' ? 'bg-gray-500' :
                  user.status === 'pending' ? 'bg-warning-orange' :
                  'bg-error-red'
                }`} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
              
              <p className="text-lg text-gray-400 mb-2">{user.position}</p>
              <p className="text-sm text-gray-500 mb-4">{user.department}</p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">{user.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">
                    Last active: {new Date(user.lastLogin).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex lg:flex-col items-center justify-center space-x-4 lg:space-x-0 lg:space-y-2 mt-6 lg:mt-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user.loginCount}</p>
                <p className="text-xs text-gray-400">Logins</p>
              </div>
              <div className="w-px h-8 bg-dark-border lg:hidden" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user.projects}</p>
                <p className="text-xs text-gray-400">Projects</p>
              </div>
              <div className="w-px h-8 bg-dark-border lg:hidden" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user.tasks}</p>
                <p className="text-xs text-gray-400">Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={Activity}
            label="Projects"
            value={user.projects}
            color="from-blue-500 to-cyan-500"
            index={0}
          />
          <StatCard
            icon={Check}
            label="Completed Tasks"
            value={`${user.completedTasks}/${user.tasks}`}
            change={`${Math.round((user.completedTasks / user.tasks) * 100)}%`}
            color="from-green-500 to-emerald-500"
            index={1}
          />
          <StatCard
            icon={FileText}
            label="Documents"
            value={user.documents}
            color="from-purple-500 to-pink-500"
            index={2}
          />
          <StatCard
            icon={Users}
            label="Meetings"
            value={user.meetings}
            color="from-orange-500 to-red-500"
            index={3}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mb-6 border-b border-dark-border">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'activity', label: 'Activity', icon: Activity },
            { id: 'documents', label: 'Documents', icon: FileText },
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

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Contact Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
                  <div className="space-y-2">
                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={user.email}
                      onCopy={() => handleCopy(user.email)}
                    />
                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={user.phone}
                      onCopy={() => handleCopy(user.phone)}
                    />
                    <InfoRow
                      icon={MapPin}
                      label="Location"
                      value={user.location}
                    />
                    <InfoRow
                      icon={Globe}
                      label="Timezone"
                      value={user.timezone}
                    />
                    <InfoRow
                      icon={User}
                      label="Username"
                      value={user.username}
                      onCopy={() => handleCopy(user.username)}
                    />
                  </div>
                </div>

                {/* Professional Info */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Professional Information</h2>
                  <div className="space-y-2">
                    <InfoRow
                      icon={Briefcase}
                      label="Department"
                      value={user.department}
                    />
                    <InfoRow
                      icon={Award}
                      label="Position"
                      value={user.position}
                    />
                    <InfoRow
                      icon={Shield}
                      label="Role"
                      value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Permissions</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.map((permission) => (
                      <PermissionBadge key={permission} permission={permission} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <QuickAction
                      icon={MessageSquare}
                      label="Message"
                      color="from-blue-500 to-cyan-500"
                      onTap={handleMessage}
                    />
                    <QuickAction
                      icon={MailIcon}
                      label="Email"
                      color="from-green-500 to-emerald-500"
                      onTap={handleEmail}
                    />
                    <QuickAction
                      icon={PhoneIcon}
                      label="Call"
                      color="from-orange-500 to-red-500"
                      onTap={handleCall}
                    />
                    <QuickAction
                      icon={Edit}
                      label="Edit"
                      color="from-purple-500 to-pink-500"
                      onTap={handleEdit}
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Social Profiles</h2>
                  <div className="space-y-3">
                    {user.github && (
                      <Touchable
                        onTap={() => window.open(user.github, '_blank')}
                        hapticFeedback
                        className="flex items-center justify-between p-3 bg-dark-hover rounded-xl hover:bg-dark-card transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Github className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-300">GitHub</span>
                        </div>
                        <span className="text-xs text-purple-400">View →</span>
                      </Touchable>
                    )}
                    {user.linkedin && (
                      <Touchable
                        onTap={() => window.open(user.linkedin, '_blank')}
                        hapticFeedback
                        className="flex items-center justify-between p-3 bg-dark-hover rounded-xl hover:bg-dark-card transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Linkedin className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-300">LinkedIn</span>
                        </div>
                        <span className="text-xs text-purple-400">View →</span>
                      </Touchable>
                    )}
                    {user.twitter && (
                      <Touchable
                        onTap={() => window.open(user.twitter, '_blank')}
                        hapticFeedback
                        className="flex items-center justify-between p-3 bg-dark-hover rounded-xl hover:bg-dark-card transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Twitter className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-300">Twitter</span>
                        </div>
                        <span className="text-xs text-purple-400">View →</span>
                      </Touchable>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-300">Email Notifications</span>
                      </div>
                      {user.receiveEmails ? (
                        <Check className="w-5 h-5 text-success-green" />
                      ) : (
                        <X className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-300">Two-Factor Auth</span>
                      </div>
                      {user.twoFactorAuth ? (
                        <Check className="w-5 h-5 text-success-green" />
                      ) : (
                        <X className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Moon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-300">Dark Mode</span>
                      </div>
                      {user.darkMode ? (
                        <Check className="w-5 h-5 text-success-green" />
                      ) : (
                        <X className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Today</h3>
                  <ActivityItem
                    icon={LogIn}
                    action="Logged in from Chrome on macOS"
                    time="2 hours ago"
                    color="from-green-500 to-emerald-500"
                  />
                  <ActivityItem
                    icon={Edit}
                    action="Updated profile information"
                    time="3 hours ago"
                    color="from-blue-500 to-cyan-500"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Yesterday</h3>
                  <ActivityItem
                    icon={FileText}
                    action="Uploaded 3 documents"
                    time="1 day ago"
                    color="from-purple-500 to-pink-500"
                  />
                  <ActivityItem
                    icon={Users}
                    action="Attended team meeting"
                    time="1 day ago"
                    color="from-orange-500 to-red-500"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Last Week</h3>
                  <ActivityItem
                    icon={Key}
                    action="Changed password"
                    time="3 days ago"
                    color="from-yellow-500 to-amber-500"
                  />
                  <ActivityItem
                    icon={Shield}
                    action="Updated permissions"
                    time="5 days ago"
                    color="from-indigo-500 to-purple-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Documents</h2>
                <Touchable
                  onTap={() => console.log('Upload document')}
                  hapticFeedback
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Upload New
                </Touchable>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Touchable
                    key={i}
                    onTap={() => console.log('View document')}
                    hapticFeedback
                    className="flex items-center justify-between p-4 bg-dark-hover rounded-xl hover:bg-dark-card transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white text-sm">Document {i}.pdf</p>
                        <p className="text-xs text-gray-400">Uploaded on Mar {i}, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Touchable
                        onTap={(e) => {
                          e.stopPropagation()
                          console.log('Download document')
                        }}
                        hapticFeedback
                        className="p-2 hover:bg-dark-card rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4 text-gray-400" />
                      </Touchable>
                      <Touchable
                        onTap={(e) => {
                          e.stopPropagation()
                          console.log('Copy link')
                        }}
                        hapticFeedback
                        className="p-2 hover:bg-dark-card rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </Touchable>
                    </div>
                  </Touchable>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
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
              <h2 className="text-xl font-bold text-white text-center mb-2">Delete User</h2>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to delete {user.firstName} {user.lastName}? 
                This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3">
                <Touchable
                  onTap={() => setShowDeleteConfirm(false)}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
                >
                  Cancel
                </Touchable>
                <Touchable
                  onTap={confirmDelete}
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
          <span>👆 Tap to interact</span>
          <span>👆👆 Double tap for details</span>
          <span>🤏 Long press for actions</span>
        </div>
      </div>
    </div>
  )
}

export default UsersViewPage
