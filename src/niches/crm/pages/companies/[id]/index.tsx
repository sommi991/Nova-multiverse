import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, Building2, Globe, MapPin, Users,
  Target, DollarSign, Mail, Phone, Calendar,
  Clock, Edit, Trash2, Copy, Share2, Download,
  MoreVertical, X, Check, AlertCircle, Star,
  Award, TrendingUp, Briefcase, Link
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// MOCK COMPANY DATA
// ============================================================================

const MOCK_COMPANY = {
  id: '1',
  name: 'TechCorp Solutions',
  logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=300&fit=crop',
  industry: 'Technology',
  size: '500-1000',
  founded: '2010',
  location: 'San Francisco, CA',
  address: '123 Market St, Suite 400, San Francisco, CA 94105',
  website: 'https://techcorp.com',
  phone: '+1 (555) 123-4567',
  email: 'info@techcorp.com',
  status: 'active',
  tags: ['enterprise', 'saas', 'tech', 'fast-growing'],
  notes: 'Key client in the enterprise space. Multiple ongoing deals.',
  lastContact: '2024-03-15T10:30:00Z',
  createdAt: '2024-01-10T09:00:00Z',
  contacts: [
    {
      id: '1',
      name: 'John Smith',
      position: 'CTO',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      position: 'CEO',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop',
      email: 'sarah.j@techcorp.com',
      phone: '+1 (555) 234-5678'
    }
  ],
  deals: [
    { id: '1', name: 'Enterprise License', value: 50000, stage: 'negotiation' },
    { id: '2', name: 'Consulting Services', value: 25000, stage: 'proposal' }
  ],
  activities: [
    { type: 'meeting', description: 'Quarterly review', date: '2024-03-14T11:30:00Z' },
    { type: 'call', description: 'Discovery call with CTO', date: '2024-03-13T15:00:00Z' },
    { type: 'email', description: 'Sent proposal', date: '2024-03-12T10:00:00Z' }
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
// CONTACT CARD
// ============================================================================

interface ContactCardProps {
  contact: typeof MOCK_COMPANY.contacts[0]
  onSelect: () => void
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onSelect }) => {
  return (
    <Touchable
      onTap={onSelect}
      hapticFeedback
      className="flex items-center space-x-3 p-3 bg-dark-hover rounded-lg hover:bg-green-500/10 transition-colors"
    >
      <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <p className="text-white font-medium">{contact.name}</p>
        <p className="text-sm text-gray-400">{contact.position}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Touchable
          onTap={(e) => {
            e.stopPropagation()
            window.location.href = `mailto:${contact.email}`
          }}
          hapticFeedback
          className="p-2 hover:bg-dark-card rounded-lg transition-colors"
        >
          <Mail className="w-4 h-4 text-gray-400" />
        </Touchable>
        <Touchable
          onTap={(e) => {
            e.stopPropagation()
            window.location.href = `tel:${contact.phone}`
          }}
          hapticFeedback
          className="p-2 hover:bg-dark-card rounded-lg transition-colors"
        >
          <Phone className="w-4 h-4 text-gray-400" />
        </Touchable>
      </div>
    </Touchable>
  )
}

// ============================================================================
// DEAL CARD
// ============================================================================

interface DealCardProps {
  deal: typeof MOCK_COMPANY.deals[0]
  onSelect: () => void
}

const DealCard: React.FC<DealCardProps> = ({ deal, onSelect }) => {
  return (
    <Touchable
      onTap={onSelect}
      hapticFeedback
      className="flex items-center justify-between p-3 bg-dark-hover rounded-lg hover:bg-green-500/10 transition-colors"
    >
      <div>
        <p className="text-white font-medium">{deal.name}</p>
        <p className="text-sm text-gray-400">Stage: {deal.stage}</p>
      </div>
      <p className="text-lg font-bold text-white">${deal.value.toLocaleString()}</p>
    </Touchable>
  )
}

// ============================================================================
// ACTIVITY ITEM
// ============================================================================

interface ActivityItemProps {
  activity: typeof MOCK_COMPANY.activities[0]
  index: number
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, index }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'call': return Phone
      case 'meeting': return Users
      default: return Calendar
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
// MAIN COMPANY DETAILS PAGE
// ============================================================================

export const CompanyDetailsPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { triggerHaptic } = useGestures()
  const [showActions, setShowActions] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const company = MOCK_COMPANY

  const handleEdit = () => {
    navigate(`/crm/companies/${id}/edit`)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    triggerHaptic([30, 20, 30])
    setShowDeleteConfirm(false)
    // Simulate delete
    setTimeout(() => {
      navigate('/crm/companies')
    }, 1000)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Touchable
            onTap={() => navigate('/crm/companies')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </Touchable>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">{company.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{company.industry} • {company.size}</p>
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
                navigator.clipboard.writeText(company.website)
                setShowActions(false)
              }}
              hapticFeedback
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
            >
              <Copy className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Copy Website</span>
            </Touchable>
            <Touchable
              onTap={() => {
                console.log('Export company')
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
        {/* Left Column - Company Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="glass-card p-6 text-center">
            <img
              src={company.logo}
              alt={company.name}
              className="w-24 h-24 rounded-xl object-cover ring-4 ring-green-500/50 mx-auto"
            />

            <h2 className="text-xl font-bold text-white mt-4">{company.name}</h2>
            <p className="text-gray-400">{company.industry}</p>
            <p className="text-gray-500 text-sm">Founded {company.founded}</p>

            <div className="flex items-center justify-center space-x-2 mt-4">
              <span className={`px-3 py-1 text-sm rounded-full ${
                company.status === 'active' ? 'bg-success-green/10 text-success-green' :
                company.status === 'lead' ? 'bg-blue-500/10 text-blue-400' :
                'bg-gray-500/10 text-gray-400'
              }`}>
                {company.status}
              </span>
              {company.tags.slice(0, 2).map((tag) => (
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
                onTap={() => window.open(company.website, '_blank')}
                hapticFeedback
                className="p-3 bg-dark-hover rounded-full hover:bg-green-500/20 transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-400" />
              </Touchable>
              <Touchable
                onTap={() => window.location.href = `mailto:${company.email}`}
                hapticFeedback
                className="p-3 bg-dark-hover rounded-full hover:bg-green-500/20 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-400" />
              </Touchable>
              <Touchable
                onTap={() => window.location.href = `tel:${company.phone}`}
                hapticFeedback
                className="p-3 bg-dark-hover rounded-full hover:bg-green-500/20 transition-colors"
              >
                <Phone className="w-5 h-5 text-gray-400" />
              </Touchable>
            </div>
          </div>

          {/* Stats */}
          <StatCard
            icon={Users}
            label="Contacts"
            value={company.contacts.length.toString()}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={Target}
            label="Active Deals"
            value={company.deals.length.toString()}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={DollarSign}
            label="Total Value"
            value={`$${company.deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}`}
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
            <div className="space-y-3">
              <InfoRow
                icon={Globe}
                label="Website"
                value={company.website}
                href={company.website}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={company.email}
                href={`mailto:${company.email}`}
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={company.phone}
                href={`tel:${company.phone}`}
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={company.address}
                href={`https://maps.google.com/?q=${company.address}`}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
            <p className="text-gray-300">{company.notes}</p>
          </div>

          {/* Contacts */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Key Contacts</h3>
              <Touchable
                onTap={() => navigate(`/crm/companies/${id}/contacts`)}
                hapticFeedback
                className="text-sm text-green-400 hover:text-green-300"
              >
                View All
              </Touchable>
            </div>
            <div className="space-y-3">
              {company.contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onSelect={() => navigate(`/crm/contacts/${contact.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Deals */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Deals</h3>
              <Touchable
                onTap={() => navigate(`/crm/companies/${id}/deals`)}
                hapticFeedback
                className="text-sm text-green-400 hover:text-green-300"
              >
                View All
              </Touchable>
            </div>
            <div className="space-y-3">
              {company.deals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onSelect={() => navigate(`/crm/deals/${deal.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {company.activities.map((activity, index) => (
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
              <h2 className="text-xl font-bold text-white text-center mb-2">Delete Company</h2>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to delete {company.name}? This action cannot be undone.
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
          <span>🌐 Website • 📧 Email</span>
          <span>👥 View contacts</span>
        </div>
      </div>
    </div>
  )
}
