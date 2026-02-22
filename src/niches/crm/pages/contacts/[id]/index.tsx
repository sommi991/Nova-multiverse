import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, Mail, Phone, Building2, MapPin,
  Edit, Trash2, Copy, Share2, Download,
  Star, Award, Target, Calendar, Clock,
  MessageSquare, MoreVertical, X, Check,
  AlertCircle, Users, DollarSign
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// MOCK CONTACT DATA
// ============================================================================

const MOCK_CONTACT = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@techcorp.com',
  phone: '+1 (555) 123-4567',
  company: 'TechCorp Solutions',
  position: 'CTO',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  location: 'San Francisco, CA',
  address: '123 Market St, Suite 400, San Francisco, CA 94105',
  status: 'active',
  tags: ['decision-maker', 'tech', 'enterprise'],
  notes: 'Met at Tech Conference 2024. Interested in enterprise solutions.',
  lastContact: '2024-03-15T10:30:00Z',
  createdAt: '2024-01-10T09:00:00Z',
  deals: [
    { id: '1', name: 'Enterprise License', value: 50000, stage: 'negotiation' },
    { id: '2', name: 'Consulting Services', value: 25000, stage: 'proposal' }
  ],
  activities: [
    { type: 'email', description: 'Sent proposal', date: '2024-03-14T11:30:00Z' },
    { type: 'call', description: 'Discovery call', date: '2024-03-13T15:00:00Z' },
    { type: 'meeting', description: 'Product demo', date: '2024-03-12T10:00:00Z' }
  ]
}

// ============================================================================
// STAT CARD
// ============================================================================

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <Touchable
      onTap={() => console.log('Stat tapped')}
      hapticFeedback
      className="glass-card p-4 hover:scale-105 transition-transform"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-lg font-bold text-white">{value}</p>
        </div>
      </div>
    </Touchable>
  )
}

// ============================================================================
// INFO ROW
// ============================================================================

interface InfoRowProps {
  icon: React.ElementType
  label: string
  value: string
  href?: string
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value, href }) => {
  const content = (
    <div className="flex items-center space-x-3 p-3 bg-dark-hover rounded-lg hover:bg-green-500/10 transition-colors">
      <Icon className="w-5 h-5 text-gray-400" />
      <span className="text-sm text-gray-300">{label}:</span>
      <span className="text-sm text-white flex-1">{value}</span>
    </div>
  )

  if (href) {
    return (
      <Touchable
        onTap={() => window.open(href, '_blank')}
        hapticFeedback
      >
        {content}
      </Touchable>
    )
  }

  return content
}

// ============================================================================
// ACTIVITY ITEM
// ============================================================================

interface ActivityItemProps {
  activity: any
  index: number
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, index }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'call': return Phone
      case 'meeting': return Users
      default: return MessageSquare
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-500/10 text-blue-400'
      case 'call': return 'bg-green-500/10 text-green-400'
      case 'meeting': return 'bg-purple-500/10 text-purple-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const Icon = getIcon(activity.type)
  const colorClass = getColor(activity.type)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-dark-hover transition-colors"
    >
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-white">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDate(activity.date)}</p>
      </div>
    </motion.div>
  )
}

// ============================================================================
// MAIN CONTACT DETAILS PAGE
// ============================================================================

export const ContactDetailsPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { triggerHaptic } = useGestures()
  const [showActions, setShowActions] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const contact = MOCK_CONTACT
  const fullName = `${contact.firstName} ${contact.lastName}`

  const handleEdit = () => {
    navigate(`/crm/contacts/${id}/edit`)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    triggerHaptic([30, 20, 30])
    setShowDeleteConfirm(false)
    // Simulate delete
    setTimeout(() => {
      navigate('/crm/contacts')
    }, 1000)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Touchable
            onTap={() => navigate('/crm/contacts')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </Touchable>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">{fullName}</h1>
            <p className="text-gray-400 text-sm mt-1">{contact.position} at {contact.company}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Touchable
            onTap={handleEdit}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <Edit className="w-5 h-5 text-gray-400" />
          </Touchable>
          <Touchable
            onTap={() => setShowActions(!showActions)}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>
      </div>

      {/* Quick Actions Dropdown */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-6 mt-2 w-48 glass-card rounded-xl overflow-hidden z-10"
          >
            <Touchable
              onTap={() => {
                navigator.clipboard.writeText(contact.email)
                setShowActions(false)
              }}
              hapticFeedback
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
            >
              <Copy className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Copy Email</span>
            </Touchable>
            <Touchable
              onTap={() => {
                console.log('Export contact')
                setShowActions(false)
              }}
              hapticFeedback
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Export</span>
            </Touchable>
            <Touchable
              onTap={handleDelete}
              hapticFeedback
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-error-red/10 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-error-red" />
              <span className="text-sm text-error-red">Delete</span>
            </Touchable>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="glass-card p-6 text-center">
            <img
              src={contact.avatar}
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-green-500/50 mx-auto"
            />

            <h2 className="text-xl font-bold text-white mt-4">{fullName}</h2>
            <p className="text-gray-400">{contact.position}</p>
            <p className="text-gray-500 text-sm">{contact.company}</p>

            <div className="flex items-center justify-center space-x-2 mt-4">
              <span className={`px-3 py-1 text-sm rounded-full ${
                contact.status === 'active' ? 'bg-success-green/10 text-success-green' :
                contact.status === 'inactive' ? 'bg-gray-500/10 text-gray-400' :
                'bg-blue-500/10 text-blue-400'
              }`}>
                {contact.status}
              </span>
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-4 mt-4">
              <Touchable
                onTap={() => window.location.href = `mailto:${contact.email}`}
                hapticFeedback
                className="p-3 bg-dark-hover rounded-full hover:bg-green-500/20 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-400" />
              </Touchable>
              <Touchable
                onTap={() => window.location.href = `tel:${contact.phone}`}
                hapticFeedback
                className="p-3 bg-dark-hover rounded-full hover:bg-green-500/20 transition-colors"
              >
                <Phone className="w-5 h-5 text-gray-400" />
              </Touchable>
              <Touchable
                onTap={() => window.open(`https://maps.google.com/?q=${contact.address}`)}
                hapticFeedback
                className="p-3 bg-dark-hover rounded-full hover:bg-green-500/20 transition-colors"
              >
                <MapPin className="w-5 h-5 text-gray-400" />
              </Touchable>
            </div>
          </div>

          {/* Stats */}
          <StatCard
            icon={Target}
            label="Active Deals"
            value={contact.deals.length.toString()}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={DollarSign}
            label="Total Value"
            value={`$${contact.deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}`}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={Calendar}
            label="Customer Since"
            value={new Date(contact.createdAt).toLocaleDateString()}
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <InfoRow
                icon={Mail}
                label="Email"
                value={contact.email}
                href={`mailto:${contact.email}`}
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={contact.phone}
                href={`tel:${contact.phone}`}
              />
              <InfoRow
                icon={Building2}
                label="Company"
                value={contact.company}
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={contact.address}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
            <p className="text-gray-300">{contact.notes}</p>
          </div>

          {/* Associated Deals */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Associated Deals</h3>
            <div className="space-y-3">
              {contact.deals.map((deal) => (
                <Touchable
                  key={deal.id}
                  onTap={() => navigate(`/crm/deals/${deal.id}`)}
                  hapticFeedback
                  className="flex items-center justify-between p-3 bg-dark-hover rounded-lg hover:bg-green-500/10 transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">{deal.name}</p>
                    <p className="text-sm text-gray-400">Stage: {deal.stage}</p>
                  </div>
                  <p className="text-lg font-bold text-white">${deal.value.toLocaleString()}</p>
                </Touchable>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {contact.activities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} index={index} />
              ))}
            </div>
          </div>
        </div>
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
              <h2 className="text-xl font-bold text-white text-center mb-2">Delete Contact</h2>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to delete {fullName}? This action cannot be undone.
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
          <span>📞 Call • 📧 Email</span>
          <span>📊 View deals</span>
        </div>
      </div>
    </div>
  )
}
