import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Users, Target, DollarSign,
  Phone, Mail, Calendar, CheckSquare,
  ArrowUpRight, ArrowDownRight, Star,
  Award, Clock, UserPlus, UserCheck
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'

// ============================================================================
// STATS CARD
// ============================================================================

interface StatsCardProps {
  title: string
  value: string
  change: number
  icon: React.ElementType
  color: string
  index: number
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  index
}) => {
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Touchable
        onTap={() => console.log('Stats tapped')}
        onDoubleTap={() => console.log('Double tap - details')}
        onLongPress={() => console.log('Long press - export')}
        hapticFeedback
        className="glass-card p-6 relative overflow-hidden group hover:scale-105 transition-transform"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-success-green' : 'text-error-red'}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
          <p className="text-gray-400 text-sm">{title}</p>

          {/* Sparkline */}
          <div className="mt-4 h-12">
            <svg className="w-full h-full" viewBox="0 0 100 30">
              <path
                d="M0,20 Q20,10 40,15 T80,10 T100,5"
                fill="none"
                stroke={isPositive ? '#10B981' : '#EF4444'}
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </Touchable>
    </motion.div>
  )
}

// ============================================================================
// RECENT LEADS
// ============================================================================

const RecentLeads: React.FC = () => {
  const leads = [
    { name: 'John Smith', company: 'Tech Corp', value: 50000, status: 'hot', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { name: 'Sarah Johnson', company: 'Startup Inc', value: 25000, status: 'warm', avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop' },
    { name: 'Michael Chen', company: 'Enterprise Ltd', value: 100000, status: 'cold', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-error-red/10 text-error-red'
      case 'warm': return 'bg-warning-orange/10 text-warning-orange'
      case 'cold': return 'bg-blue-500/10 text-blue-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Leads</h2>
        <Touchable
          onTap={() => window.location.href = '/crm/leads'}
          hapticFeedback
          className="text-sm text-green-400 hover:text-green-300"
        >
          View All
        </Touchable>
      </div>

      <div className="space-y-4">
        {leads.map((lead, index) => (
          <Touchable
            key={index}
            onTap={() => window.location.href = '/crm/leads/1'}
            onSwipe={(direction) => {
              if (direction === 'left') console.log('Call lead')
              if (direction === 'right') console.log('Email lead')
            }}
            hapticFeedback
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-hover transition-colors"
          >
            <img src={lead.avatar} alt={lead.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="text-white font-medium">{lead.name}</p>
              <p className="text-sm text-gray-400">{lead.company}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">${lead.value.toLocaleString()}</p>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>
          </Touchable>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// PIPELINE PREVIEW
// ============================================================================

const PipelinePreview: React.FC = () => {
  const stages = [
    { name: 'Lead', count: 45, value: 450000, color: 'bg-blue-500' },
    { name: 'Qualified', count: 32, value: 520000, color: 'bg-purple-500' },
    { name: 'Proposal', count: 18, value: 380000, color: 'bg-orange-500' },
    { name: 'Negotiation', count: 12, value: 290000, color: 'bg-yellow-500' },
    { name: 'Closed', count: 8, value: 180000, color: 'bg-green-500' },
  ]

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Pipeline Overview</h2>
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={index}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-300">{stage.name}</span>
              <span className="text-white">{stage.count} deals • ${stage.value.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stage.count / 45) * 100}%` }}
                className={`h-full ${stage.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// UPCOMING TASKS
// ============================================================================

const UpcomingTasks: React.FC = () => {
  const tasks = [
    { title: 'Call John Smith', time: '10:30 AM', priority: 'high', type: 'call' },
    { title: 'Send proposal to Sarah', time: '2:00 PM', priority: 'medium', type: 'email' },
    { title: 'Meeting with Tech Corp', time: '4:30 PM', priority: 'high', type: 'meeting' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error-red'
      case 'medium': return 'text-warning-orange'
      case 'low': return 'text-success-green'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Today's Tasks</h2>
        <Touchable
          onTap={() => window.location.href = '/crm/tasks'}
          hapticFeedback
          className="text-sm text-green-400 hover:text-green-300"
        >
          View All
        </Touchable>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <Touchable
            key={index}
            onTap={() => console.log('Task tapped')}
            onSwipe={(direction) => {
              if (direction === 'left') console.log('Mark complete')
              if (direction === 'right') console.log('Snooze')
            }}
            hapticFeedback
            className="flex items-center justify-between p-3 bg-dark-hover rounded-lg hover:bg-dark-card transition-colors"
          >
            <div>
              <p className="text-white text-sm">{task.title}</p>
              <p className="text-xs text-gray-400">{task.time}</p>
            </div>
            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </Touchable>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================

export const DashboardPage: React.FC = () => {
  const stats = [
    { title: 'Total Leads', value: '234', change: 12.5, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Active Deals', value: '156', change: 8.3, icon: Target, color: 'from-purple-500 to-pink-500' },
    { title: 'Pipeline Value', value: '$2.4M', change: 23.1, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { title: 'Conversion Rate', value: '24%', change: 5.2, icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">CRM Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, Sarah! Here's your sales overview</p>
        </div>
        <Touchable
          onTap={() => window.location.href = '/crm/leads/create'}
          hapticFeedback
          className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Lead</span>
        </Touchable>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentLeads />
        <PipelinePreview />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasks />
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Phone, label: 'Log Call', color: 'from-green-500 to-emerald-500' },
              { icon: Mail, label: 'Send Email', color: 'from-blue-500 to-cyan-500' },
              { icon: Calendar, label: 'Schedule', color: 'from-purple-500 to-pink-500' },
              { icon: CheckSquare, label: 'Add Task', color: 'from-orange-500 to-red-500' },
            ].map((action, index) => (
              <Touchable
                key={index}
                onTap={() => console.log(action.label)}
                hapticFeedback
                className="p-4 bg-dark-hover rounded-xl hover:scale-105 transition-transform text-center"
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-300">{action.label}</span>
              </Touchable>
            ))}
          </div>
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view</span>
          <span>👉 Swipe for actions</span>
          <span>🤏 Long press for menu</span>
        </div>
      </div>
    </div>
  )
}
