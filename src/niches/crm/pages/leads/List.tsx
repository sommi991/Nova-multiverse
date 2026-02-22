import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Filter, Plus, Phone, Mail,
  Star, Award, TrendingUp, DollarSign,
  MoreVertical, Edit, Trash2, Copy, Eye,
  ChevronDown, ChevronUp, Download, RefreshCw,
  X, Check, AlertCircle, Clock, Calendar
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  avatar: string
  score: number
  value: number
  status: 'new' | 'contacted' | 'qualified' | 'lost'
  source: 'website' | 'referral' | 'linkedin' | 'call' | 'email'
  lastContact: string
  tags: string[]
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    position: 'CTO',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    score: 92,
    value: 50000,
    status: 'qualified',
    source: 'linkedin',
    lastContact: '2024-03-15T10:30:00Z',
    tags: ['enterprise', 'tech']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@startup.io',
    phone: '+1 (555) 234-5678',
    company: 'Startup.io',
    position: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=150&h=150&fit=crop',
    score: 78,
    value: 25000,
    status: 'contacted',
    source: 'website',
    lastContact: '2024-03-14T14:20:00Z',
    tags: ['startup', 'saas']
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.c@enterprise.com',
    phone: '+1 (555) 345-6789',
    company: 'Enterprise Ltd',
    position: 'VP Sales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    score: 95,
    value: 100000,
    status: 'qualified',
    source: 'referral',
    lastContact: '2024-03-13T09:15:00Z',
    tags: ['enterprise', 'high-value']
  },
  {
    id: '4',
    name: 'Emma Watson',
    email: 'emma.w@design.studio',
    phone: '+1 (555) 456-7890',
    company: 'Design Studio',
    position: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    score: 45,
    value: 15000,
    status: 'new',
    source: 'website',
    lastContact: '2024-03-12T16:45:00Z',
    tags: ['creative', 'agency']
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@finance.com',
    phone: '+1 (555) 567-8901',
    company: 'Finance Group',
    position: 'CFO',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    score: 82,
    value: 75000,
    status: 'contacted',
    source: 'call',
    lastContact: '2024-03-11T11:30:00Z',
    tags: ['finance', 'executive']
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
// LEAD CARD
// ============================================================================

interface LeadCardProps {
  lead: Lead
  onSelect: (lead: Lead) => void
  onCall: (lead: Lead) => void
  onEmail: (lead: Lead) => void
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onSelect, onCall, onEmail }) => {
  const [showActions, setShowActions] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-green'
    if (score >= 60) return 'text-warning-orange'
    return 'text-error-red'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-success-green/10 text-success-green'
      case 'contacted': return 'bg-blue-500/10 text-blue-400'
      case 'new': return 'bg-purple-500/10 text-purple-400'
      case 'lost': return 'bg-gray-500/10 text-gray-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'linkedin': return '💼'
      case 'website': return '🌐'
      case 'referral': return '🤝'
      case 'call': return '📞'
      case 'email': return '📧'
      default: return '📌'
    }
  }

  const formatLastContact = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="relative">
      <Touchable
        onTap={() => onSelect(lead)}
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-4 block hover:scale-105 transition-transform"
      >
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={lead.avatar}
              alt={lead.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-green-500/50"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              lead.score >= 80 ? 'bg-success-green text-white' :
              lead.score >= 60 ? 'bg-warning-orange text-white' :
              'bg-error-red text-white'
            }`}>
              {lead.score}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium">{lead.name}</h3>
                <p className="text-sm text-gray-400">{lead.position} at {lead.company}</p>
                <p className="text-xs text-gray-500 mt-1">{lead.email} • {lead.phone}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center">
                <p className="text-sm font-bold text-white">${lead.value.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Value</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">{getSourceIcon(lead.source)}</p>
                <p className="text-xs text-gray-400">Source</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">{formatLastContact(lead.lastContact)}</p>
                <p className="text-xs text-gray-400">Last Contact</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {lead.tags.map((tag) => (
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
                onCall(lead)
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-green-500/20 rounded-full hover:bg-green-500/30 transition-colors"
            >
              <Phone className="w-6 h-6 text-green-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onEmail(lead)
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Mail className="w-6 h-6 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                window.location.href = `/crm/leads/${lead.id}/edit`
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
  sortBy: string
  onSortChange: (sort: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const statuses = ['All', 'new', 'contacted', 'qualified', 'lost']
  const sorts = [
    { value: 'score_desc', label: 'Score (High to Low)' },
    { value: 'score_asc', label: 'Score (Low to High)' },
    { value: 'value_desc', label: 'Value (High to Low)' },
    { value: 'value_asc', label: 'Value (Low to High)' },
    { value: 'recent', label: 'Most Recent' }
  ]

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search leads by name, company, email..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  >
                    {sorts.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Score Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="flex-1"
                    />
                    <span className="text-white text-sm">50+</span>
                  </div>
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
// MAIN LEADS LIST PAGE
// ============================================================================

export const LeadsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('score_desc')

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = MOCK_LEADS.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = !statusFilter || lead.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score_desc':
          return b.score - a.score
        case 'score_asc':
          return a.score - b.score
        case 'value_desc':
          return b.value - a.value
        case 'value_asc':
          return a.value - b.value
        case 'recent':
          return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, statusFilter, sortBy])

  // Stats
  const totalLeads = MOCK_LEADS.length
  const qualifiedLeads = MOCK_LEADS.filter(l => l.status === 'qualified').length
  const totalValue = MOCK_LEADS.reduce((sum, l) => sum + l.value, 0)
  const avgScore = Math.round(MOCK_LEADS.reduce((sum, l) => sum + l.score, 0) / MOCK_LEADS.length)

  const handleViewLead = (lead: Lead) => {
    window.location.href = `/crm/leads/${lead.id}`
  }

  const handleCall = (lead: Lead) => {
    window.location.href = `tel:${lead.phone}`
  }

  const handleEmail = (lead: Lead) => {
    window.location.href = `mailto:${lead.email}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Leads</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track your sales leads</p>
        </div>
        <Touchable
          onTap={() => window.location.href = '/crm/leads/create'}
          hapticFeedback
          className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lead</span>
        </Touchable>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          label="Total Leads"
          value={totalLeads.toString()}
          change={12.5}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={Star}
          label="Qualified"
          value={qualifiedLeads.toString()}
          change={8.3}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={DollarSign}
          label="Total Value"
          value={`$${(totalValue / 1000).toFixed(0)}K`}
          change={23.1}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={Award}
          label="Avg Score"
          value={avgScore.toString()}
          change={5.2}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Leads Grid */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onSelect={handleViewLead}
            onCall={handleCall}
            onEmail={handleEmail}
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

// Helper component for Edit icon
const Edit: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
)
