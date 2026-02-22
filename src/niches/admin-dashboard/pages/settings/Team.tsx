import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, UserPlus, Mail, Phone, Shield, Star,
  Crown, Award, Calendar, Clock, MoreVertical,
  Edit, Trash2, Copy, Check, X, AlertCircle,
  ChevronDown, ChevronUp, Search, Filter,
  Download, Upload, RefreshCw, Lock, Unlock,
  MessageSquare, Github, Linkedin, Twitter,
  Globe, MapPin, Briefcase, GraduationCap
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: 'owner' | 'admin' | 'manager' | 'member' | 'guest'
  department: string
  position: string
  status: 'active' | 'invited' | 'pending' | 'inactive'
  lastActive: string
  joinedAt: string
  permissions: string[]
  projects: number
  tasks: number
  skills: string[]
  social: {
    github?: string
    linkedin?: string
    twitter?: string
  }
  location: string
  timezone: string
}

interface Invitation {
  id: string
  email: string
  role: string
  invitedBy: string
  invitedAt: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'expired'
}

interface TeamActivity {
  id: string
  type: 'member_added' | 'member_removed' | 'role_changed' | 'permission_updated'
  user: string
  target?: string
  timestamp: string
  performedBy: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    role: 'owner',
    department: 'Executive',
    position: 'Founder & CEO',
    status: 'active',
    lastActive: '2 minutes ago',
    joinedAt: '2024-01-15',
    permissions: ['all'],
    projects: 12,
    tasks: 34,
    skills: ['Leadership', 'Strategy', 'Product'],
    social: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    },
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=150&h=150&fit=crop',
    role: 'admin',
    department: 'Engineering',
    position: 'CTO',
    status: 'active',
    lastActive: '15 minutes ago',
    joinedAt: '2024-01-20',
    permissions: ['all'],
    projects: 8,
    tasks: 23,
    skills: ['React', 'Node.js', 'AWS', 'Team Leadership'],
    social: {
      github: 'https://github.com/sarahj',
      linkedin: 'https://linkedin.com/in/sarahj',
      twitter: 'https://twitter.com/sarahj'
    },
    location: 'Austin, TX',
    timezone: 'America/Chicago'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.c@company.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'manager',
    department: 'Product',
    position: 'Product Lead',
    status: 'active',
    lastActive: '1 hour ago',
    joinedAt: '2024-02-01',
    permissions: ['read', 'write', 'delete'],
    projects: 5,
    tasks: 12,
    skills: ['Product Strategy', 'UX', 'Agile'],
    social: {
      linkedin: 'https://linkedin.com/in/michaelc',
      twitter: 'https://twitter.com/michaelc'
    },
    location: 'Seattle, WA',
    timezone: 'America/Los_Angeles'
  },
  {
    id: '4',
    name: 'Emma Watson',
    email: 'emma.w@company.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    role: 'member',
    department: 'Marketing',
    position: 'Marketing Specialist',
    status: 'active',
    lastActive: '3 hours ago',
    joinedAt: '2024-02-15',
    permissions: ['read', 'write'],
    projects: 3,
    tasks: 8,
    skills: ['Content', 'SEO', 'Social Media'],
    social: {
      linkedin: 'https://linkedin.com/in/emmaw',
      twitter: 'https://twitter.com/emmaw'
    },
    location: 'New York, NY',
    timezone: 'America/New_York'
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@company.com',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    role: 'guest',
    department: 'Consulting',
    position: 'External Consultant',
    status: 'inactive',
    lastActive: '2 weeks ago',
    joinedAt: '2024-03-01',
    permissions: ['read'],
    projects: 1,
    tasks: 3,
    skills: ['Consulting', 'Strategy'],
    social: {
      linkedin: 'https://linkedin.com/in/jamesw'
    },
    location: 'London, UK',
    timezone: 'Europe/London'
  }
]

const MOCK_INVITATIONS: Invitation[] = [
  {
    id: '1',
    email: 'alex.johnson@example.com',
    role: 'member',
    invitedBy: 'John Doe',
    invitedAt: '2024-03-14T10:30:00Z',
    expiresAt: '2024-03-21T10:30:00Z',
    status: 'pending'
  },
  {
    id: '2',
    email: 'maria.garcia@example.com',
    role: 'manager',
    invitedBy: 'Sarah Johnson',
    invitedAt: '2024-03-13T15:45:00Z',
    expiresAt: '2024-03-20T15:45:00Z',
    status: 'pending'
  }
]

const MOCK_ACTIVITY: TeamActivity[] = [
  {
    id: '1',
    type: 'member_added',
    user: 'Emma Watson',
    timestamp: '2024-03-15T09:30:00Z',
    performedBy: 'John Doe'
  },
  {
    id: '2',
    type: 'role_changed',
    user: 'Michael Chen',
    target: 'Manager → Product Lead',
    timestamp: '2024-03-14T14:20:00Z',
    performedBy: 'Sarah Johnson'
  },
  {
    id: '3',
    type: 'permission_updated',
    user: 'James Wilson',
    target: 'Added read access',
    timestamp: '2024-03-13T11:15:00Z',
    performedBy: 'John Doe'
  }
]

// ============================================================================
// TEAM MEMBER CARD COMPONENT
// ============================================================================

interface TeamMemberCardProps {
  member: TeamMember
  isCurrentUser?: boolean
  onEdit: () => void
  onRemove: () => void
  onMessage: () => void
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  isCurrentUser,
  onEdit,
  onRemove,
  onMessage
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-gold" />
      case 'admin': return <Shield className="w-4 h-4 text-purple-400" />
      case 'manager': return <Star className="w-4 h-4 text-blue-400" />
      case 'member': return <Users className="w-4 h-4 text-green-400" />
      case 'guest': return <UserPlus className="w-4 h-4 text-gray-400" />
      default: return <Users className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-green/10 text-success-green'
      case 'invited': return 'bg-warning-orange/10 text-warning-orange'
      case 'pending': return 'bg-blue-500/10 text-blue-400'
      case 'inactive': return 'bg-gray-500/10 text-gray-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      <Touchable
        onTap={() => setIsExpanded(!isExpanded)}
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-4 block hover:scale-105 transition-transform"
      >
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-500/20"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-card ${
              member.status === 'active' ? 'bg-success-green' :
              member.status === 'invited' ? 'bg-warning-orange' :
              member.status === 'pending' ? 'bg-blue-400' :
              'bg-gray-500'
            }`} />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  {getRoleIcon(member.role)}
                  {isCurrentUser && (
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{member.position}</p>
                <p className="text-xs text-gray-500 mt-1">{member.department}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                {member.status}
              </span>
            </div>

            {/* Quick stats */}
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-400">{member.projects} projects</span>
              </div>
              <div className="flex items-center space-x-1">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-400">{member.tasks} tasks</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-400">{member.lastActive}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mt-3">
              {member.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {member.skills.length > 3 && (
                <span className="px-2 py-0.5 bg-dark-hover text-gray-400 text-xs rounded-full">
                  +{member.skills.length - 3}
                </span>
              )}
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
                  <div className="space-y-3">
                    {/* Contact */}
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{member.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{member.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{member.timezone}</span>
                    </div>

                    {/* Social */}
                    <div className="flex items-center space-x-2 mt-2">
                      {member.social.github && (
                        <Touchable
                          onTap={() => window.open(member.social.github, '_blank')}
                          hapticFeedback
                          className="p-2 bg-dark-hover rounded-lg hover:bg-purple-500/20 transition-colors"
                        >
                          <Github className="w-4 h-4 text-gray-400" />
                        </Touchable>
                      )}
                      {member.social.linkedin && (
                        <Touchable
                          onTap={() => window.open(member.social.linkedin, '_blank')}
                          hapticFeedback
                          className="p-2 bg-dark-hover rounded-lg hover:bg-purple-500/20 transition-colors"
                        >
                          <Linkedin className="w-4 h-4 text-gray-400" />
                        </Touchable>
                      )}
                      {member.social.twitter && (
                        <Touchable
                          onTap={() => window.open(member.social.twitter, '_blank')}
                          hapticFeedback
                          className="p-2 bg-dark-hover rounded-lg hover:bg-purple-500/20 transition-colors"
                        >
                          <Twitter className="w-4 h-4 text-gray-400" />
                        </Touchable>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                onMessage()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-blue-400" />
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
            {!isCurrentUser && (
              <Touchable
                onTap={() => {
                  onRemove()
                  setShowActions(false)
                }}
                hapticFeedback
                className="p-3 bg-error-red/20 rounded-full hover:bg-error-red/30 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-error-red" />
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
// INVITATION CARD COMPONENT
// ============================================================================

interface InvitationCardProps {
  invitation: Invitation
  onResend: () => void
  onCancel: () => void
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onResend,
  onCancel
}) => {
  const [showActions, setShowActions] = useState(false)

  const getTimeRemaining = () => {
    const expires = new Date(invitation.expiresAt).getTime()
    const now = new Date().getTime()
    const days = Math.ceil((expires - now) / (1000 * 60 * 60 * 24))
    return `${days} days remaining`
  }

  return (
    <div className="relative">
      <Touchable
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-4 block hover:scale-105 transition-transform"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-warning-orange/20">
              <Mail className="w-5 h-5 text-warning-orange" />
            </div>
            <div>
              <h4 className="text-white font-medium">{invitation.email}</h4>
              <p className="text-sm text-gray-400">
                Invited as {invitation.role} • {getTimeRemaining()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                by {invitation.invitedBy} • {new Date(invitation.invitedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className="px-2 py-1 bg-warning-orange/10 text-warning-orange text-xs rounded-full">
            Pending
          </span>
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
                onResend()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onCancel()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-error-red/20 rounded-full hover:bg-error-red/30 transition-colors"
            >
              <X className="w-5 h-5 text-error-red" />
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
// INVITE MEMBER MODAL
// ============================================================================

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (email: string, role: string, message?: string) => void
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInvite
}) => {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [message, setMessage] = useState('')

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
        <h2 className="text-xl font-bold text-white mb-4">Invite Team Member</h2>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Personal Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to your invitation..."
              rows={3}
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* Permissions preview */}
          <div className="p-3 bg-dark-hover rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">This user will have:</h4>
            <ul className="space-y-1">
              {role === 'admin' && (
                <>
                  <li className="text-xs text-gray-400">• Full access to all settings</li>
                  <li className="text-xs text-gray-400">• Can manage team members</li>
                  <li className="text-xs text-gray-400">• Can modify billing</li>
                </>
              )}
              {role === 'manager' && (
                <>
                  <li className="text-xs text-gray-400">• Can manage projects</li>
                  <li className="text-xs text-gray-400">• Can assign tasks</li>
                  <li className="text-xs text-gray-400">• View-only for billing</li>
                </>
              )}
              {role === 'member' && (
                <>
                  <li className="text-xs text-gray-400">• Can create and edit content</li>
                  <li className="text-xs text-gray-400">• Can view team members</li>
                  <li className="text-xs text-gray-400">• No billing access</li>
                </>
              )}
              {role === 'guest' && (
                <>
                  <li className="text-xs text-gray-400">• View-only access</li>
                  <li className="text-xs text-gray-400">• Can comment on projects</li>
                  <li className="text-xs text-gray-400">• No editing permissions</li>
                </>
              )}
            </ul>
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
              onInvite(email, role, message)
              onClose()
            }}
            hapticFeedback
            disabled={!email}
            className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Invitation
          </Touchable>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// ACTIVITY ITEM COMPONENT
// ============================================================================

interface ActivityItemProps {
  activity: TeamActivity
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'member_added': return <UserPlus className="w-4 h-4 text-success-green" />
      case 'member_removed': return <Trash2 className="w-4 h-4 text-error-red" />
      case 'role_changed': return <Shield className="w-4 h-4 text-blue-400" />
      case 'permission_updated': return <Lock className="w-4 h-4 text-purple-400" />
      default: return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getActivityText = () => {
    switch (activity.type) {
      case 'member_added':
        return `${activity.performedBy} added ${activity.user} to the team`
      case 'member_removed':
        return `${activity.performedBy} removed ${activity.user} from the team`
      case 'role_changed':
        return `${activity.performedBy} changed ${activity.user}'s role to ${activity.target}`
      case 'permission_updated':
        return `${activity.performedBy} updated permissions for ${activity.user}`
      default:
        return ''
    }
  }

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-dark-border last:border-0">
      <div className="p-2 bg-dark-hover rounded-lg">
        {getActivityIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm text-white">{getActivityText()}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN TEAM SETTINGS PAGE
// ============================================================================

export const SettingsTeamPage: React.FC = () => {
  const [members, setMembers] = useState(MOCK_TEAM_MEMBERS)
  const [invitations, setInvitations] = useState(MOCK_INVITATIONS)
  const [activity, setActivity] = useState(MOCK_ACTIVITY)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null)

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(member =>
    roleFilter === 'all' || member.role === roleFilter
  )

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    admins: members.filter(m => m.role === 'admin' || m.role === 'owner').length,
    pending: invitations.length
  }

  const handleInvite = (email: string, role: string, message?: string) => {
    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email,
      role,
      invitedBy: 'You',
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }
    setInvitations([...invitations, newInvitation])
  }

  const handleResendInvite = (invitationId: string) => {
    console.log('Resend invitation', invitationId)
  }

  const handleCancelInvite = (invitationId: string) => {
    setInvitations(prev => prev.filter(i => i.id !== invitationId))
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId))
    setShowRemoveConfirm(null)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your team members and their roles
          </p>
        </div>
        <Touchable
          onTap={() => setShowInviteModal(true)}
          hapticFeedback
          className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite Member</span>
        </Touchable>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">Total Members</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">Active</p>
          <p className="text-2xl font-bold text-success-green">{stats.active}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">Admins</p>
          <p className="text-2xl font-bold text-purple-400">{stats.admins}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">Pending Invites</p>
          <p className="text-2xl font-bold text-warning-orange">{stats.pending}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 bg-dark-hover border border-dark-border rounded-xl text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="member">Member</option>
          <option value="guest">Guest</option>
        </select>
      </div>

      {/* Team Members */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-white">Team Members</h2>
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                isCurrentUser={member.id === '1'}
                onEdit={() => console.log('Edit member', member.id)}
                onRemove={() => setShowRemoveConfirm(member.id)}
                onMessage={() => console.log('Message member', member.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-white">Pending Invitations</h2>
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onResend={() => handleResendInvite(invitation.id)}
                onCancel={() => handleCancelInvite(invitation.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <div className="glass-card p-4">
          {activity.map((act) => (
            <ActivityItem key={act.id} activity={act} />
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteMemberModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            onInvite={handleInvite}
          />
        )}
      </AnimatePresence>

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {showRemoveConfirm && (
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
              <h2 className="text-xl font-bold text-white text-center mb-2">Remove Member</h2>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to remove this team member? This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3">
                <Touchable
                  onTap={() => setShowRemoveConfirm(null)}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
                >
                  Cancel
                </Touchable>
                <Touchable
                  onTap={() => handleRemoveMember(showRemoveConfirm)}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-error-red text-white rounded-xl hover:bg-error-red/80 transition-colors"
                >
                  Remove
                </Touchable>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to expand</span>
          <span>🤏 Long press for actions</span>
          <span>👆👆 Double tap to message</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const Activity: React.FC<{ className?: string }> = ({ className }) => (
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
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

export default SettingsTeamPage
