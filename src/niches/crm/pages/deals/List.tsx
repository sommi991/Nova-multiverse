import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Search, Filter, Plus, Download, RefreshCw,
  Eye, Edit, Trash2, Copy, MoreVertical,
  DollarSign, Users, Calendar, Clock,
  TrendingUp, Award, Star, ChevronDown,
  ChevronUp, X, Check, AlertCircle
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// MOCK DATA (same as pipeline)
// ============================================================================

const MOCK_DEALS = [
  {
    id: '1',
    name: 'Enterprise License',
    company: 'TechCorp Solutions',
    value: 50000,
    probability: 80,
    expectedClose: '2024-04-15',
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    contacts: 3,
    tasks: 5,
    stage: 'negotiation',
    tags: ['enterprise', 'high-value']
  },
  {
    id: '2',
    name: 'Startup Package',
    company: 'Startup.io',
    value: 15000,
    probability: 60,
    expectedClose: '2024-04-30',
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    contacts: 2,
    tasks: 3,
    stage: 'proposal',
    tags: ['startup', 'saas']
  },
  {
    id: '3',
    name: 'Consulting Services',
    company: 'Enterprise Ltd',
    value: 75000,
    probability: 90,
    expectedClose: '2024-04-10',
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    contacts: 4,
    tasks: 2,
    stage: 'qualified',
    tags: ['consulting', 'enterprise']
  },
  {
    id: '4',
    name: 'Software License',
    company: 'Design Studio',
    value: 25000,
    probability: 40,
    expectedClose: '2024-05-15',
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    contacts: 1,
    tasks: 4,
    stage: 'lead',
    tags: ['creative', 'agency']
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
// DEAL TABLE ROW
// ============================================================================

interface DealTableRowProps {
  deal: typeof MOCK_DEALS[0]
  onSelect: () => void
  onEdit: () => void
}

const DealTableRow: React.FC<DealTableRowProps> = ({ deal, onSelect, onEdit }) => {
  const [showActions, setShowActions] = useState(false)

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'qualified': return 'bg-blue-500/10 text-blue-400'
      case 'proposal': return 'bg-purple-500/10 text-purple-400'
      case 'negotiation': return 'bg-orange-500/10 text-orange-400'
      case 'closed-won': return 'bg-success-green/10 text-success-green'
      case 'closed-lost': return 'bg-error-red/10 text-error-red'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="relative">
      <Touchable
        onTap={onSelect}
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="flex items-center p-4 bg-dark-hover rounded-lg hover:bg-dark-card transition-colors"
      >
        <div className="flex-1 grid grid-cols-12 gap-4 items-center">
          {/* Deal Name */}
          <div className="col-span-3">
            <p className="text-white font-medium">{deal.name}</p>
            <p className="text-sm text-gray-400">{deal.company}</p>
          </div>

          {/* Value */}
          <div className="col-span-2">
            <p className="text-white font-bold">{formatCurrency(deal.value)}</p>
          </div>

          {/* Probability */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">{deal.probability}%</span>
            </div>
          </div>

          {/* Stage */}
          <div className="col-span-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getStageColor(deal.stage)}`}>
              {deal.stage}
            </span>
          </div>

          {/* Expected Close */}
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-300">{formatDate(deal.expectedClose)}</span>
            </div>
          </div>

          {/* Owner */}
          <div className="col-span-1">
            <img
              src={deal.owner.avatar}
              alt={deal.owner.name}
              className="w-6 h-6 rounded-full"
            />
          </div>

          {/* Actions */}
          <div className="col-span-1 flex items-center justify-end space-x-2">
            <Touchable
              onTap={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              hapticFeedback
              className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-400" />
            </Touchable>
            <Touchable
              onTap={(e) => {
                e.stopPropagation()
                setShowActions(true)
              }}
              hapticFeedback
              className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Touchable>
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
                console.log('Duplicate deal')
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Copy className="w-5 h-5 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                console.log('Export deal')
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
            >
              <Download className="w-5 h-5 text-purple-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                if (window.confirm('Delete this deal?')) {
                  console.log('Delete deal')
                }
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-error-red/20 rounded-full hover:bg-error-red/30 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-error-red" />
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
  stageFilter: string
  onStageChange: (stage: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  stageFilter,
  onStageChange
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const stages = ['All', 'lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search deals by name or company..."
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
                  <label className="block text-sm text-gray-400 mb-2">Stage</label>
                  <select
                    value={stageFilter}
                    onChange={(e) => onStageChange(e.target.value)}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  >
                    {stages.map(s => (
                      <option key={s} value={s === 'All' ? '' : s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date Range</label>
                  <select className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white">
                    <option>Last 30 days</option>
                    <option>This quarter</option>
                    <option>This year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Owner</label>
                  <select className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white">
                    <option>All</option>
                    <option>Sarah Johnson</option>
                    <option>John Smith</option>
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
// MAIN DEALS LIST PAGE
// ============================================================================

export const DealsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  // Filter deals
  const filteredDeals = useMemo(() => {
    return MOCK_DEALS.filter(deal => {
      const matchesSearch = 
        deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStage = !stageFilter || deal.stage === stageFilter
      
      return matchesSearch && matchesStage
    })
  }, [searchQuery, stageFilter])

  // Stats
  const totalValue = filteredDeals.reduce((sum, d) => sum + d.value, 0)
  const weightedValue = filteredDeals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0)
  const avgProbability = Math.round(
    filteredDeals.reduce((sum, d) => sum + d.probability, 0) / filteredDeals.length
  )

  const handleViewDeal = (deal: typeof MOCK_DEALS[0]) => {
    window.location.href = `/crm/deals/${deal.id}`
  }

  const handleEditDeal = (deal: typeof MOCK_DEALS[0]) => {
    window.location.href = `/crm/deals/${deal.id}/edit`
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Deals</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your sales pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          <Touchable
            onTap={() => window.location.href = '/crm/deals/pipeline'}
            hapticFeedback
            className="px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-green-500/20 transition-colors flex items-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>Pipeline View</span>
          </Touchable>
          <Touchable
            onTap={() => window.location.href = '/crm/deals/create'}
            hapticFeedback
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Deal</span>
          </Touchable>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          icon={Target}
          label="Total Deals"
          value={filteredDeals.length.toString()}
          change={12.5}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={DollarSign}
          label="Total Value"
          value={`$${(totalValue / 1000).toFixed(0)}K`}
          change={23.1}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={TrendingUp}
          label="Weighted Value"
          value={`$${(weightedValue / 1000).toFixed(0)}K`}
          change={15.3}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={Award}
          label="Avg Probability"
          value={`${avgProbability}%`}
          change={5.2}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
      />

      {/* Deals List */}
      <div className="space-y-3">
        {filteredDeals.map((deal) => (
          <DealTableRow
            key={deal.id}
            deal={deal}
            onSelect={() => handleViewDeal(deal)}
            onEdit={() => handleEditDeal(deal)}
          />
        ))}
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view</span>
          <span>🤏 Long press for actions</span>
          <span>📊 Pipeline view</span>
        </div>
      </div>
    </div>
  )
}
