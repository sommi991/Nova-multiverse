import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, DollarSign, ShoppingBag,
  Users, Package, Calendar, Download, Filter,
  ChevronRight, Star, Award, Target, Zap
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'

// ============================================================================
// REPORT CARD COMPONENT
// ============================================================================

interface ReportCardProps {
  title: string
  description: string
  icon: React.ElementType
  color: string
  to: string
  stats: {
    label: string
    value: string
    change?: number
  }[]
}

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  to,
  stats
}) => {
  return (
    <Touchable
      onTap={() => window.location.href = to}
      hapticFeedback
      className="glass-card p-6 hover:scale-105 transition-transform"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-xs text-gray-400">{stat.label}</p>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            {stat.change !== undefined && (
              <span className={`text-xs ${stat.change >= 0 ? 'text-success-green' : 'text-error-red'}`}>
                {stat.change >= 0 ? '+' : ''}{stat.change}%
              </span>
            )}
          </div>
        ))}
      </div>
    </Touchable>
  )
}

// ============================================================================
// MAIN REPORTS PAGE
// ============================================================================

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30')

  const reports = [
    {
      title: 'Sales Report',
      description: 'Revenue, orders, and conversion metrics',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      to: '/ecommerce/reports/sales',
      stats: [
        { label: 'Revenue', value: '$124.5K', change: 23.5 },
        { label: 'Orders', value: '1,243', change: 12.3 }
      ]
    },
    {
      title: 'Product Performance',
      description: 'Best sellers, inventory, and categories',
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      to: '/ecommerce/reports/products',
      stats: [
        { label: 'Products Sold', value: '3,456', change: 8.7 },
        { label: 'Top Product', value: 'Headphones', change: 34.2 }
      ]
    },
    {
      title: 'Customer Analytics',
      description: 'Acquisition, retention, and value',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      to: '/ecommerce/reports/customers',
      stats: [
        { label: 'New Customers', value: '567', change: 18.2 },
        { label: 'Repeat Rate', value: '34%', change: 5.6 }
      ]
    },
    {
      title: 'Inventory Report',
      description: 'Stock levels, reorder points, value',
      icon: Package,
      color: 'from-orange-500 to-red-500',
      to: '/ecommerce/reports/inventory',
      stats: [
        { label: 'Stock Value', value: '$234K', change: -2.3 },
        { label: 'Low Stock', value: '23', change: 45 }
      ]
    }
  ]

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Analytics and insights for your store</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 glass-card hover:bg-dark-hover rounded-xl text-white border-none outline-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">This year</option>
          </select>

          <Touchable
            onTap={() => console.log('Export all')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <Download className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ReportCard {...report} />
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold text-white">$124,563</p>
            <span className="text-success-green text-sm">+23.5%</span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Orders</p>
            <p className="text-2xl font-bold text-white">1,243</p>
            <span className="text-success-green text-sm">+12.3%</span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-white">3.2%</p>
            <span className="text-success-green text-sm">+0.4%</span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Avg Order Value</p>
            <p className="text-2xl font-bold text-white">$89.50</p>
            <span className="text-success-green text-sm">+5.6%</span>
          </div>
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view report</span>
          <span>📊 Analytics</span>
          <span>📈 Trends</span>
        </div>
      </div>
    </div>
  )
}
