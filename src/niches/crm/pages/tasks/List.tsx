import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare, Plus, Search, Filter, Calendar as CalendarIcon,
  Clock, User, Tag, Flag, AlertCircle, CheckCircle,
  XCircle, Edit, Trash2, Copy, MoreVertical,
  ChevronDown, ChevronUp, Download, RefreshCw,
  X, Check, AlertTriangle, Star, Award
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface Task {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  dueDate: string
  assignee: {
    name: string
    avatar: string
  }
  relatedTo?: {
    type: 'lead' | 'deal' | 'contact' | 'company'
    id: string
    name: string
  }
  tags: string[]
  createdAt: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Call John Smith about proposal',
    description: 'Follow up on enterprise license proposal',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-03-16T10:00:00Z',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'lead',
      id: '1',
      name: 'John Smith'
    },
    tags: ['call', 'follow-up'],
    createdAt: '2024-03-15T09:00:00Z'
  },
  {
    id: '2',
    title: 'Send proposal to TechCorp',
    description: 'Prepare and send enterprise proposal',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-03-15T17:00:00Z',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'company',
      id: '1',
      name: 'TechCorp Solutions'
    },
    tags: ['email', 'proposal'],
    createdAt: '2024-03-14T14:30:00Z'
  },
  {
    id: '3',
    title: 'Schedule demo with Startup.io',
    description: 'Set up product demo for the team',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-03-17T14:00:00Z',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'deal',
      id: '2',
      name: 'Startup Package'
    },
    tags: ['demo', 'meeting'],
    createdAt: '2024-03-14T11:20:00Z'
  },
  {
    id: '4',
    title: 'Update contact information',
    description: 'Review and update contact details for Enterprise Ltd',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-03-14T09:00:00Z',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    relatedTo: {
      type: 'contact',
      id: '3',
      name: 'Michael Chen'
    },
    tags: ['admin', 'update'],
    createdAt: '2024-03-13T16:45:00Z'
  },
  {
    id: '5',
    title: 'Prepare quarterly review',
    description: 'Compile data for Q2 review meeting',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-03-18T15:00:00Z',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    },
    tags: ['report', 'meeting'],
    createdAt: '2024-03-15T10:15:00Z'
  }
]

// ============================================================================
// STATS CARD
// ============================================================================

interface StatsCardProps {
  icon: React.ElementType
  label: string
  value: string
  color: string
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, color }) => {
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
        </div>
      </div>
    </Touchable>
  )
}

// ============================================================================
// TASK CARD
// ============================================================================

interface TaskCardProps {
  task: Task
  onSelect: (task: Task) => void
  onStatusChange: (task: Task, status: Task['status']) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, onStatusChange }) => {
  const [showActions, setShowActions] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error-red bg-error-red/10'
      case 'medium': return 'text-warning-orange bg-warning-orange/10'
      case 'low': return 'text-success-green bg-success-green/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'in-progress': return AlertCircle
      case 'completed': return CheckCircle
      case 'cancelled': return XCircle
      default: return AlertCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning-orange'
      case 'in-progress': return 'text-blue-400'
      case 'completed': return 'text-success-green'
      case 'cancelled': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const StatusIcon = getStatusIcon(task.status)
  const statusColor = getStatusColor(task.status)
  const priorityColor = getPriorityColor(task.priority)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 0) return 'Overdue'
    if (diffHours === 0) return 'Today'
    if (diffHours === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} days`
    return date.toLocaleDateString()
  }

  const isOverdue = new Date(task.dueDate).getTime() < new Date().getTime() && task.status !== 'completed'

  return (
    <div className="relative">
      <Touchable
        onTap={() => onSelect(task)}
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className={`glass-card p-4 block hover:scale-105 transition-transform ${
          isOverdue ? 'border-l-4 border-error-red' : ''
        }`}
      >
        <div className="flex items-start space-x-4">
          {/* Status Icon */}
          <Touchable
            onTap={(e) => {
              e.stopPropagation()
              const newStatus = task.status === 'completed' ? 'pending' : 'completed'
              onStatusChange(task, newStatus)
            }}
            hapticFeedback
            className="mt-1"
          >
            <StatusIcon className={`w-6 h-6 ${statusColor}`} />
          </Touchable>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-white font-medium ${
                  task.status === 'completed' ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{task.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${priorityColor}`}>
                {task.priority}
              </span>
            </div>

            {/* Metadata */}
            <div className="flex items-center flex-wrap gap-3 mt-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className={`text-sm ${isOverdue ? 'text-error-red' : 'text-gray-300'}`}>
                  {formatDate(task.dueDate)}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <User className="w-4 h-4 text-gray-500" />
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className="w-5 h-5 rounded-full"
                />
              </div>

              {task.relatedTo && (
                <div className="flex items-center space-x-1">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">
                    {task.relatedTo.name}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
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
                onStatusChange(task, 'completed')
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-green-500/20 rounded-full hover:bg-green-500/30 transition-colors"
            >
              <CheckCircle className="w-6 h-6 text-green-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                window.location.href = `/crm/tasks/${task.id}/edit`
                setShowActions(false)
              }}
              hapticFeedback
              className="p-4 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Edit className="w-6 h-6 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                if (window.confirm('Delete this task?')) {
                  console.log('Delete task')
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
  statusFilter: string
  onStatusChange: (status: string) => void
  priorityFilter: string
  onPriorityChange: (priority: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const statuses = ['All', 'pending', 'in-progress', 'completed', 'cancelled']
  const priorities = ['All', 'high', 'medium', 'low']

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
          />
        </div>

        <Touchable
          onTap={() => window.location.href = '/crm/tasks/create'}
          hapticFeedback
          className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
        </Touchable>

        <Touchable
          onTap={() => window.location.href = '/crm/tasks/calendar'}
          hapticFeedback
          className="p-3 bg-dark-hover rounded-xl hover:bg-green-500/20 transition-colors"
        >
          <CalendarIcon className="w-5 h-5 text-gray-400" />
        </Touchable>

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
                  <label className="block text-sm text-gray-400 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => onPriorityChange(e.target.value)}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  >
                    {priorities.map(p => (
                      <option key={p} value={p === 'All' ? '' : p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Due Date</label>
                  <select className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white">
                    <option>All</option>
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>This Week</option>
                    <option>Overdue</option>
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
// MAIN TASKS LIST PAGE
// ============================================================================

export const TasksListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return MOCK_TASKS.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = !statusFilter || task.status === statusFilter
      const matchesPriority = !priorityFilter || task.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchQuery, statusFilter, priorityFilter])

  // Stats
  const totalTasks = MOCK_TASKS.length
  const pendingTasks = MOCK_TASKS.filter(t => t.status === 'pending').length
  const inProgressTasks = MOCK_TASKS.filter(t => t.status === 'in-progress').length
  const completedTasks = MOCK_TASKS.filter(t => t.status === 'completed').length
  const overdueTasks = MOCK_TASKS.filter(t => 
    new Date(t.dueDate).getTime() < new Date().getTime() && t.status !== 'completed'
  ).length

  const handleTaskSelect = (task: Task) => {
    window.location.href = `/crm/tasks/${task.id}`
  }

  const handleStatusChange = (task: Task, newStatus: Task['status']) => {
    console.log('Change status', task.id, newStatus)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Tasks</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your to-dos and activities</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          icon={CheckSquare}
          label="Total Tasks"
          value={totalTasks.toString()}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={Clock}
          label="Pending"
          value={pendingTasks.toString()}
          color="from-yellow-500 to-amber-500"
        />
        <StatsCard
          icon={AlertCircle}
          label="In Progress"
          value={inProgressTasks.toString()}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={CheckCircle}
          label="Completed"
          value={completedTasks.toString()}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={AlertTriangle}
          label="Overdue"
          value={overdueTasks.toString()}
          color="from-error-red to-red-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onSelect={handleTaskSelect}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view</span>
          <span>🤏 Long press for actions</span>
          <span>✅ Tap icon to complete</span>
        </div>
      </div>
    </div>
  )
}
