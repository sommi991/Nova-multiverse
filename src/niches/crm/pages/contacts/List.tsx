import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Filter, Plus, Download, RefreshCw,
  Mail, Phone, Building2, MapPin, Star,
  MoreVertical, Edit, Trash2, Copy, Eye,
  ChevronDown, ChevronUp, X, Check, AlertCircle
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  avatar: string
  location: string
  status: 'active' | 'inactive' | 'lead'
  tags: string[]
  lastContact: string
  deals: number
  value: number
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    position: 'CTO',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    location: 'San Francisco, CA',
    status: 'active',
    tags: ['decision-maker', 'tech'],
    lastContact: '2024-03-15T10:30:00Z',
    deals: 3,
    value: 75000
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@startup.io',
    phone: '+1 (555) 234-5678',
    company: 'Startup.io',
    position: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=150&h=150&fit=crop',
    location: 'Austin, TX',
    status: 'active',
    tags: ['founder', 'saas'],
    lastContact: '2024-03-14T14:20:00Z',
    deals: 2,
    value: 45000
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.c@enterprise.com',
    phone: '+1 (555) 345-6789',
    company: 'Enterprise Ltd',
    position: 'VP Sales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    location: 'Seattle, WA',
    status: 'active',
    tags: ['executive', 'enterprise'],
    lastContact: '2024-03-13T09:15:00Z',
    deals: 4,
    value: 120000
  },
  {
    id: '4',
    firstName: 'Emma',
    lastName: 'Watson',
    email: 'emma.w@design.studio',
    phone: '+1 (555) 456-7890',
    company: 'Design Studio',
    position: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    location: 'Miami, FL',
    status: 'lead',
    tags: ['creative', 'agency'],
    lastContact: '2024-03-12T16:45:00Z',
    deals: 1,
    value: 15000
  },
  {
    id: '5',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.w@finance.com',
    phone: '+1 (555) 567-8901',
    company: 'Finance Group',
    position: 'CFO',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    location: 'Chicago, IL',
    status: 'inactive',
    tags: ['finance', 'executive'],
    lastContact: '2024-03-01T11:30:00Z',
    deals: 0,
    value: 0
  }
]

// ============================================================================
// STATS CARD
// ============================================================================

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: string
  change?: number
  color: string
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, change, color }) => {
  return (
    <Touchable
      onTap={() => console.log('Stats tapped')}
      hapticFeedback
      className="glass-card p-4 hover:scale-105 transition-transform"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-xs ${change >= 0 ? 'text-success-green' : 'text-error-red'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
      </div>
    </Touchable>
  )
}

// ============================================================================
// CONTACT CARD
// ============================================================================

interface ContactCardProps {
  contact: Contact
  onSelect: (contact: Contact) => void
  onEmail: (contact: Contact) => void
  onCall: (contact: Contact) => void
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onSelect, onEmail, onCall }) => {
  const [showActions, setShowActions] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-green/10 text-success-green'
      case 'inactive': return 'bg-gray-500/10 text-gray-400'
      case 'lead': return 'bg-blue-500/10 text-blue-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const formatLastContact = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const fullName = `${contact.firstName} ${contact.lastName}`

  return (
    <div className="relative">
      <Touchable
        onTap={() => onSelect(contact)}
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-4 block hover:scale-105 transition-transform"
      >
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <img
            src={contact.avatar}
            alt={fullName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-green-500/50"
          />

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium">{fullName}</h3>
                <p className="text-sm text-gray-400">{contact.position} at {contact.company}</p>
                <p className="text-xs text-gray-500 mt-1">{contact.location}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                {contact.status}
              </span>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-300 truncate">{contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-300">{contact.phone}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-xs text-gray-400">Deals</p>
                  <p className="text-sm font-bold text-white">{contact.deals}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Value</p>
                  <p className="text-sm font-bold text-green-400">
                    ${contact.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Last Contact</p>
                <p className="text-xs text-gray-300">{formatLastContact(contact.lastContact)}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
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
                onEmail(contact)
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Mail className="w-6 h-6 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onCall(contact)
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-green-500/20 rounded-full hover:bg-green-500/30 transition-colors"
            >
              <Phone className="w-6 h-6 text-green-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                window.location.href = `/crm/contacts/${contact.id}/edit`
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
            >
              <Edit className="w-6 h-6 text-purple-400" />
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
// FILTER BAR
// ============================================================================

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const statuses = ['All', 'active', 'inactive', 'lead']

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search contacts by name, email, company..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
          />
        </div>

        <Touchable
          onTap={() => setShowFilters(!showFilters)}
          hapticFeedback
          className={`p-3 rounded-xl transition-colors ${
            showFilters ? 'bg-green-500 text-white' : 'bg-dark-hover text-gray-400 hover:text-white'
          }`}
        >
          <Filter className="w-5 h-5" />
        </Touchable>

        <Touchable
          onTap={() => console.log('Refresh')}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:text-white transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </Touchable>

        <Touchable
          onTap={() => console.log('Export')}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:text-white transition-colors"
        >
          <Download className="w-5 h-5 text-gray-400" />
        </Touchable>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s === 'All' ? '' : s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                  <select className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white">
                    <option>Name</option>
                    <option>Company</option>
                    <option>Last Contact</option>
                    <option>Value</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// MAIN CONTACTS LIST PAGE
// ============================================================================

export const ContactsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return MOCK_CONTACTS.filter(contact => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase()
      const matchesSearch = 
        fullName.includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = !statusFilter || contact.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  // Stats
  const totalContacts = MOCK_CONTACTS.length
  const activeContacts = MOCK_CONTACTS.filter(c => c.status === 'active').length
  const totalValue = MOCK_CONTACTS.reduce((sum, c) => sum + c.value, 0)
  const totalDeals = MOCK_CONTACTS.reduce((sum, c) => sum + c.deals, 0)

  const handleViewContact = (contact: Contact) => {
    window.location.href = `/crm/contacts/${contact.id}`
  }

  const handleEmail = (contact: Contact) => {
    window.location.href = `mailto:${contact.email}`
  }

  const handleCall = (contact: Contact) => {
    window.location.href = `tel:${contact.phone}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Contacts</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your contacts and relationships</p>
        </div>
        <Touchable
          onTap={() => window.location.href = '/crm/contacts/create'}
          hapticFeedback
          className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Contact</span>
        </Touchable>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          label="Total Contacts"
          value={totalContacts.toString()}
          change={8.3}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={Star}
          label="Active"
          value={activeContacts.toString()}
          change={12.5}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={Building2}
          label="Total Value"
          value={`$${(totalValue / 1000).toFixed(0)}K`}
          change={15.2}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={Target}
          label="Associated Deals"
          value={totalDeals.toString()}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Contacts Grid */}
      <div className="space-y-4">
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onSelect={handleViewContact}
            onEmail={handleEmail}
            onCall={handleCall}
          />
        ))}
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view</span>
          <span>🤏 Long press for actions</span>
          <span>📞 Call • 📧 Email</span>
        </div>
      </div>
    </div>
  )
}
