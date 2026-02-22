import React from 'react'
import { motion } from 'framer-motion'
import {
  Users, UserPlus, TrendingUp, DollarSign,
  ShoppingCart, Eye, Edit, Trash2, MoreVertical,
  Calendar, Clock, Download, Filter, RefreshCw
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ElementType
  color: string
  index: number
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Touchable
        onTap={() => console.log('Stat card tapped')}
        onDoubleTap={() => console.log('Double tap - show details')}
        onLongPress={() => console.log('Long press - export data')}
        hapticFeedback
        scaleOnTap
        className="glass-card p-6 relative overflow-hidden group"
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`}
        />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-success-green' : 'text-error-red'
            }`}>
              {trend === 'up' ? '↑' : '↓'} {change}
            </span>
          </div>

          {/* Value */}
          <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
          <p className="text-gray-400 text-sm">{title}</p>

          {/* Sparkline (simulated) */}
          <div className="mt-4 h-12">
            <svg className="w-full h-full" viewBox="0 0 100 30">
              <path
                d="M0,20 Q20,10 40,15 T80,10 T100,5"
                fill="none"
                stroke={trend === 'up' ? '#10B981' : '#EF4444'}
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Touch ripple effect - CSS will handle */}
      </Touchable>
    </motion.div>
  )
}

// ============================================================================
// RECENT ACTIVITY COMPONENT
// ============================================================================

const RecentActivity: React.FC = () => {
  const activities = [
    { user: 'John Doe', action: 'created a new user', time: '2 minutes ago', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop' },
    { user: 'Sarah Smith', action: 'updated user permissions', time: '15 minutes ago', avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=50&h=50&fit=crop' },
    { user: 'Mike Johnson', action: 'deleted a user account', time: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop' },
  ]

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <Touchable
            key={index}
            onTap={() => console.log('Activity tapped')}
            onSwipe={(direction) => {
              if (direction === 'left') console.log('Archive activity')
              if (direction === 'right') console.log('Mark as read')
            }}
            hapticFeedback
            className="flex items-center space-x-3 p-3 bg-dark-hover rounded-xl hover:bg-dark-hover/80 transition-colors"
          >
            <img
              src={activity.avatar}
              alt={activity.user}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-white text-sm">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
            <Touchable
              onTap={(e) => {
                e.stopPropagation()
                console.log('More options')
              }}
              className="p-2 hover:bg-dark-card rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Touchable>
          </Touchable>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// QUICK ACTIONS COMPONENT
// ============================================================================

const QuickActions: React.FC = () => {
  const actions = [
    { icon: UserPlus, label: 'Add User', color: 'from-purple-500 to-pink-500', action: () => window.location.href = '/admin/users/create' },
    { icon: Users, label: 'View Users', color: 'from-blue-500 to-cyan-500', action: () => window.location.href = '/admin/users' },
    { icon: FileText, label: 'Generate Report', color: 'from-green-500 to-emerald-500', action: () => console.log('Generate report') },
    { icon: Settings, label: 'Settings', color: 'from-orange-500 to-red-500', action: () => window.location.href = '/admin/settings' },
  ]

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Touchable
            key={index}
            onTap={action.action}
            onLongPress={() => console.log('Long press on', action.label)}
            hapticFeedback
            scaleOnTap
            className="p-4 bg-dark-hover rounded-xl hover:bg-dark-hover/80 transition-colors text-center"
          >
            <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-300">{action.label}</span>
          </Touchable>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// DASHBOARD PAGE
// ============================================================================

export const DashboardPage: React.FC = () => {
  const stats = [
    { title: 'Total Users', value: '24,521', change: '+12.5%', trend: 'up', icon: Users, color: 'from-purple-500 to-pink-500' },
    { title: 'Active Users', value: '18,234', change: '+8.2%', trend: 'up', icon: UserPlus, color: 'from-blue-500 to-cyan-500' },
    { title: 'Revenue', value: '$89,234', change: '+23.1%', trend: 'up', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { title: 'Conversion', value: '3.2%', change: '-2.1%', trend: 'down', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <Touchable
            onTap={() => console.log('Refresh')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </Touchable>
          <Touchable
            onTap={() => console.log('Filter')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-400" />
          </Touchable>
          <Touchable
            onTap={() => console.log('Download')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-dark-border rounded-xl">
            <p className="text-gray-500">Interactive chart with pinch to zoom</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Users</h2>
          <Touchable
            onTap={() => window.location.href = '/admin/users'}
            hapticFeedback
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            View All
          </Touchable>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Active</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-dark-border hover:bg-dark-hover/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://images.unsplash.com/photo-${i}?w=50&h=50&fit=crop`}
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white text-sm">John Doe</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">Admin</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-success-green/10 text-success-green text-xs rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">2 min ago</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Touchable
                        onTap={() => window.location.href = `/admin/users/${i}`}
                        hapticFeedback
                        className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Touchable>
                      <Touchable
                        onTap={() => window.location.href = `/admin/users/${i}/edit`}
                        hapticFeedback
                        className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-400" />
                      </Touchable>
                      <Touchable
                        onTap={() => console.log('Delete user')}
                        onLongPress={() => console.log('Long press delete - show confirmation')}
                        hapticFeedback
                        className="p-1 hover:bg-dark-hover rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </Touchable>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-6 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap</span>
          <span>👆👆 Double tap</span>
          <span>🤏 Long press</span>
          <span>👉 Swipe</span>
        </div>
      </div>
    </div>
  )
}
