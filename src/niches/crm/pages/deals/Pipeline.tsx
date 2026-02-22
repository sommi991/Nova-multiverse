import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import {
  Layout, Plus, Filter, Download, RefreshCw,
  Edit, Trash2, Copy, Eye, MoreVertical,
  DollarSign, Users, Calendar, Clock,
  TrendingUp, Award, Star, Target,
  ChevronDown, ChevronUp, X, Check
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface Deal {
  id: string
  name: string
  company: string
  value: number
  probability: number
  expectedClose: string
  owner: {
    name: string
    avatar: string
  }
  contacts: number
  tasks: number
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  tags: string[]
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_DEALS: Deal[] = [
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
  },
  {
    id: '5',
    name: 'Maintenance Contract',
    company: 'Finance Group',
    value: 35000,
    probability: 75,
    expectedClose: '2024-04-20',
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    contacts: 2,
    tasks: 3,
    stage: 'negotiation',
    tags: ['finance', 'ongoing']
  },
  {
    id: '6',
    name: 'Cloud Migration',
    company: 'TechStart Inc',
    value: 45000,
    probability: 30,
    expectedClose: '2024-06-01',
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    contacts: 2,
    tasks: 6,
    stage: 'lead',
    tags: ['cloud', 'tech']
  },
  {
    id: '7',
    name: 'Security Audit',
    company: 'SecureCorp',
    value: 20000,
    probability: 85,
    expectedClose: '2024-04-05',
    owner: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    contacts: 3,
    tasks: 2,
    stage: 'closed-won',
    tags: ['security', 'completed']
  }
]

// ============================================================================
// STAGE COLUMNS
// ============================================================================

const STAGES = [
  { id: 'lead', label: 'Lead', color: 'bg-gray-500', textColor: 'text-gray-400' },
  { id: 'qualified', label: 'Qualified', color: 'bg-blue-500', textColor: 'text-blue-400' },
  { id: 'proposal', label: 'Proposal', color: 'bg-purple-500', textColor: 'text-purple-400' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500', textColor: 'text-orange-400' },
  { id: 'closed-won', label: 'Closed Won', color: 'bg-green-500', textColor: 'text-green-400' },
  { id: 'closed-lost', label: 'Closed Lost', color: 'bg-gray-600', textColor: 'text-gray-400' }
]

// ============================================================================
// DEAL CARD
// ============================================================================

interface DealCardProps {
  deal: Deal
  index: number
  onSelect: (deal: Deal) => void
  onEdit: (deal: Deal) => void
}

const DealCard: React.FC<DealCardProps> = ({ deal, index, onSelect, onEdit }) => {
  const [showActions, setShowActions] = useState(false)
  const { triggerHaptic } = useGestures()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} days`
    return date.toLocaleDateString()
  }

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 ${snapshot.isDragging ? 'rotate-2 scale-105' : ''}`}
        >
          <div className="relative">
            <Touchable
              onTap={() => onSelect(deal)}
              onLongPress={() => setShowActions(true)}
              hapticFeedback
              className="glass-card p-4 block hover:scale-105 transition-transform"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-white font-medium">{deal.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  deal.stage === 'closed-won' ? 'bg-success-green/10 text-success-green' :
                  deal.stage === 'closed-lost' ? 'bg-error-red/10 text-error-red' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {deal.stage}
                </span>
              </div>

              {/* Company */}
              <p className="text-sm text-gray-400 mb-3">{deal.company}</p>

              {/* Value & Probability */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-white">
                  {formatCurrency(deal.value)}
                </span>
                <span className="text-sm text-green-400">{deal.probability}%</span>
              </div>

              {/* Progress bar for probability */}
              <div className="w-full h-1.5 bg-dark-card rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${deal.probability}%` }}
                  className="h-full bg-green-500"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <img
                    src={deal.owner.avatar}
                    alt={deal.owner.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-gray-400">{deal.owner.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400">{deal.contacts}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-400">{deal.tasks}</span>
                  </div>
                </div>
              </div>

              {/* Expected close */}
              <div className="mt-2 flex items-center space-x-1 text-xs">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className={`${
                  formatDate(deal.expectedClose) === 'Overdue' 
                    ? 'text-error-red' 
                    : 'text-gray-400'
                }`}>
                  {formatDate(deal.expectedClose)}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {deal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
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
                      onEdit(deal)
                      setShowActions(false)
                    }}
                    hapticFeedback
                    className="p-4 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
                  >
                    <Edit className="w-6 h-6 text-blue-400" />
                  </Touchable>
                  <Touchable
                    onTap={() => {
                      console.log('Duplicate deal')
                      setShowActions(false)
                    }}
                    hapticFeedback
                    className="p-4 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
                  >
                    <Copy className="w-6 h-6 text-purple-400" />
                  </Touchable>
                  <Touchable
                    onTap={() => {
                      if (window.confirm('Delete this deal?')) {
                        console.log('Delete deal')
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
        </div>
      )}
    </Draggable>
  )
}

// ============================================================================
// PIPELINE COLUMN
// ============================================================================

interface PipelineColumnProps {
  stage: typeof STAGES[0]
  deals: Deal[]
  onDealSelect: (deal: Deal) => void
  onDealEdit: (deal: Deal) => void
}

const PipelineColumn: React.FC<PipelineColumnProps> = ({
  stage,
  deals,
  onDealSelect,
  onDealEdit
}) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      notation: 'compact'
    }).format(value)
  }

  return (
    <Droppable droppableId={stage.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`glass-card p-4 min-w-[320px] h-full ${
            snapshot.isDraggingOver ? 'ring-2 ring-green-500' : ''
          }`}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <h3 className="text-white font-medium">{stage.label}</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">{deals.length}</span>
              <span className="text-sm font-bold text-white">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>

          {/* Deals */}
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {deals.map((deal, index) => (
              <DealCard
                key={deal.id}
                deal={deal}
                index={index}
                onSelect={onDealSelect}
                onEdit={onDealEdit}
              />
            ))}
            {provided.placeholder}
          </div>

          {/* Add Deal Button */}
          <Touchable
            onTap={() => window.location.href = '/crm/deals/create'}
            hapticFeedback
            className="mt-4 w-full py-3 border-2 border-dashed border-dark-border rounded-xl text-gray-400 hover:text-white hover:border-green-500/30 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Deal</span>
          </Touchable>
        </div>
      )}
    </Droppable>
  )
}

// ============================================================================
// FILTER BAR
// ============================================================================

interface FilterBarProps {
  onRefresh: () => void
  onExport: () => void
}

const FilterBar: React.FC<FilterBarProps> = ({ onRefresh, onExport }) => {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <Touchable
          onTap={() => window.location.href = '/crm/deals/create'}
          hapticFeedback
          className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Deal</span>
        </Touchable>

        <Touchable
          onTap={() => window.location.href = '/crm/deals/list'}
          hapticFeedback
          className="px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-green-500/20 transition-colors flex items-center space-x-2"
        >
          <Layout className="w-5 h-5" />
          <span>List View</span>
        </Touchable>
      </div>

      <div className="flex items-center space-x-3">
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
          onTap={onRefresh}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:text-white transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </Touchable>

        <Touchable
          onTap={onExport}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:text-white transition-colors"
        >
          <Download className="w-5 h-5 text-gray-400" />
        </Touchable>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-20 right-6 glass-card p-4 rounded-xl z-10"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Date Range</label>
                <select className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2 text-white">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This month</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Owner</label>
                <select className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2 text-white">
                  <option>All</option>
                  <option>Sarah Johnson</option>
                  <option>John Smith</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// MAIN PIPELINE PAGE
// ============================================================================

export const DealsPipelinePage: React.FC = () => {
  const [deals, setDeals] = useState(MOCK_DEALS)

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const newDeals = Array.from(deals)
    const [removed] = newDeals.splice(source.index, 1)
    removed.stage = destination.droppableId as Deal['stage']
    newDeals.splice(destination.index, 0, removed)

    setDeals(newDeals)
  }

  const handleDealSelect = (deal: Deal) => {
    window.location.href = `/crm/deals/${deal.id}`
  }

  const handleDealEdit = (deal: Deal) => {
    window.location.href = `/crm/deals/${deal.id}/edit`
  }

  const handleRefresh = () => {
    setDeals(MOCK_DEALS)
  }

  const handleExport = () => {
    console.log('Export pipeline')
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Deals Pipeline</h1>
        <p className="text-gray-400 text-sm mt-1">Drag and drop deals to update stages</p>
      </div>

      {/* Filter Bar */}
      <FilterBar onRefresh={handleRefresh} onExport={handleExport} />

      {/* Pipeline */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              deals={deals.filter(d => d.stage === stage.id)}
              onDealSelect={handleDealSelect}
              onDealEdit={handleDealEdit}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Stats Bar */}
      <div className="mt-6 glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-sm text-gray-400">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-white">
                ${deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Deals</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Weighted Pipeline</p>
              <p className="text-2xl font-bold text-green-400">
                ${deals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Win Rate:</span>
            <span className="text-lg font-bold text-green-400">64%</span>
          </div>
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view</span>
          <span>🤏 Long press for actions</span>
          <span>🖐️ Drag to move</span>
        </div>
      </div>
    </div>
  )
}
