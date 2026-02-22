import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Search, Filter, Plus, Download, RefreshCw,
  Users, Target, DollarSign, MapPin, Globe,
  MoreVertical, Edit, Trash2, Copy, Eye,
  ChevronDown, ChevronUp, X, Check, Star,
  Award, TrendingUp, Calendar, Clock
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface Company {
  id: string
  name: string
  logo: string
  industry: string
  size: string
  location: string
  website: string
  contacts: number
  deals: number
  value: number
  status: 'active' | 'lead' | 'inactive'
  tags: string[]
  lastContact: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop',
    industry: 'Technology',
    size: '500-1000',
    location: 'San Francisco, CA',
    website: 'https://techcorp.com',
    contacts: 12,
    deals: 5,
    value: 450000,
    status: 'active',
    tags: ['enterprise', 'saas', 'tech'],
    lastContact: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Startup.io',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop',
    industry: 'SaaS',
    size: '50-100',
    location: 'Austin, TX',
    website: 'https://startup.io',
    contacts: 5,
    deals: 3,
    value: 180000,
    status: 'active',
    tags: ['startup', 'saas', 'fast-growing'],
    lastContact: '2024-03-14T14:20:00Z'
  },
  {
    id: '3',
    name: 'Enterprise Ltd',
    logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop',
    industry: 'Manufacturing',
    size: '1000+',
    location: 'Chicago, IL',
    website: 'https://enterprise.com',
    contacts: 23,
    deals: 8,
    value: 890000,
    status: 'active',
    tags: ['enterprise', 'manufacturing'],
    lastContact: '2024-03-13T09:15:00Z'
  },
  {
    id: '4',
    name: 'Design Studio',
    logo: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=150&h=150&fit=crop',
    industry: 'Creative',
    size: '10-50',
    location: 'Miami, FL',
    website: 'https://design.studio',
    contacts: 3,
    deals: 2,
    value: 85000,
    status: 'lead',
    tags: ['creative', 'agency', 'design'],
    lastContact: '2024-03-12T16:45:00Z'
  },
  {
    id: '5',
    name: 'Finance Group',
    logo: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=150&h=150&fit=crop',
    industry: 'Finance',
    size: '500-1000',
    location: 'New York, NY',
    website: 'https://finance.com',
    contacts: 8,
    deals: 4,
    value: 320000,
    status: 'inactive',
    tags: ['finance', 'investment', 'banking'],
    lastContact: '2024-03-01T11:30:00Z'
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
// COMPANY CARD
// ============================================================================

interface CompanyCardProps {
  company: Company
  onSelect: (company: Company) => void
  onWebsite: (company: Company) => void
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onSelect, onWebsite }) => {
  const [showActions, setShowActions] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-green/10 text-success-green'
      case 'lead': return 'bg-blue-500/10 text-blue-400'
      case 'inactive': return 'bg-gray-500/10 text-gray-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const formatLastContact = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative">
      <Touchable
        onTap={() => onSelect(company)}
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-4 block hover:scale-105 transition-transform"
      >
        <div className="flex items-start space-x-4">
          {/* Logo */}
          <img
            src={company.logo}
            alt={company.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-green-500/50"
          />

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium">{company.name}</h3>
                <p className="text-sm text-gray-400">{company.industry} • {company.size}</p>
                <p className="text-xs text-gray-500 mt-1">{company.location}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(company.status)}`}>
                {company.status}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center">
                <p className="text-sm font-bold text-white">{company.contacts}</p>
                <p className="text-xs text-gray-400">Contacts</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">{company.deals}</p>
                <p className="text-xs text-gray-400">Deals</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-green-400">
                  ${(company.value / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-gray-400">Value</p>
              </div>
            </div>

            {/* Tags & Last Contact */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-wrap gap-1">
                {company.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {company.tags.length > 2 && (
                  <span className="text-xs text-gray-500">+{company.tags.length - 2}</span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-400">{formatLastContact(company.lastContact)}</span>
              </div>
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
                onWebsite(company)
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Globe className="w-6 h-6 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                window.location.href = `/crm/companies/${company.id}/edit`
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
            >
              <Edit className="w-6 h-6 text-purple-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                if (window.confirm('Delete this company?')) {
                  console.log('Delete company')
                }
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
    </div>
  )
}

// ============================================================================
// FILTER BAR
// ============================================================================

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  industryFilter: string
  onIndustryChange: (industry: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  industryFilter,
  onIndustryChange,
  statusFilter,
  onStatusChange
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const industries = ['All', 'Technology', 'SaaS', 'Manufacturing', 'Creative', 'Finance']
  const statuses = ['All', 'active', 'lead', 'inactive']

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search companies by name, industry..."
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Industry</label>
                  <select
                    value={industryFilter}
                    onChange={(e) => onIndustryChange(e.target.value)}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  >
                    {industries.map(i => (
                      <option key={i} value={i === 'All' ? '' : i}>{i}</option>
                    ))}
                  </select>
                </div>
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
                  <label className="block text-sm text-gray-400 mb-2">Company Size</label>
                  <select className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white">
                    <option>All</option>
                    <option>1-10</option>
                    <option>10-50</option>
                    <option>50-200</option>
                    <option>200-500</option>
                    <option>500+</option>
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
// MAIN COMPANIES LIST PAGE
// ============================================================================

export const CompaniesListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return MOCK_COMPANIES.filter(company => {
      const matchesSearch = 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesIndustry = !industryFilter || company.industry === industryFilter
      const matchesStatus = !statusFilter || company.status === statusFilter
      
      return matchesSearch && matchesIndustry && matchesStatus
    })
  }, [searchQuery, industryFilter, statusFilter])

  // Stats
  const totalCompanies = MOCK_COMPANIES.length
  const activeCompanies = MOCK_COMPANIES.filter(c => c.status === 'active').length
  const totalValue = MOCK_COMPANIES.reduce((sum, c) => sum + c.value, 0)
  const totalContacts = MOCK_COMPANIES.reduce((sum, c) => sum + c.contacts, 0)
  const totalDeals = MOCK_COMPANIES.reduce((sum, c) => sum + c.deals, 0)

  const handleViewCompany = (company: Company) => {
    window.location.href = `/crm/companies/${company.id}`
  }

  const handleWebsite = (company: Company) => {
    window.open(company.website, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Companies</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your client companies and accounts</p>
        </div>
        <Touchable
          onTap={() => window.location.href = '/crm/companies/create'}
          hapticFeedback
          className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Company</span>
        </Touchable>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Building2}
          label="Total Companies"
          value={totalCompanies.toString()}
          change={12.5}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={Award}
          label="Active"
          value={activeCompanies.toString()}
          change={8.3}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={DollarSign}
          label="Pipeline Value"
          value={`$${(totalValue / 1000).toFixed(0)}K`}
          change={15.2}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={Users}
          label="Total Contacts"
          value={totalContacts.toString()}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        industryFilter={industryFilter}
        onIndustryChange={setIndustryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Companies Grid */}
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onSelect={handleViewCompany}
            onWebsite={handleWebsite}
          />
        ))}
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view</span>
          <span>🤏 Long press for actions</span>
          <span>🌐 Visit website</span>
        </div>
      </div>
    </div>
  )
}
