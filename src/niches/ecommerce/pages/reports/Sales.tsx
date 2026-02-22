import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, DollarSign, ShoppingBag, TrendingUp,
  Calendar, Download, Filter, Eye, Printer,
  ArrowUpRight, ArrowDownRight, CreditCard,
  Clock, Users, Award, Target
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_SALES_DATA = {
  daily: [
    { date: 'Mon', revenue: 5234, orders: 45, aov: 116 },
    { date: 'Tue', revenue: 6123, orders: 52, aov: 117 },
    { date: 'Wed', revenue: 5890, orders: 48, aov: 122 },
    { date: 'Thu', revenue: 6789, orders: 56, aov: 121 },
    { date: 'Fri', revenue: 8234, orders: 67, aov: 122 },
    { date: 'Sat', revenue: 9345, orders: 78, aov: 119 },
    { date: 'Sun', revenue: 4567, orders: 38, aov: 120 }
  ],
  paymentMethods: [
    { method: 'Credit Card', amount: 45234, percentage: 58 },
    { method: 'PayPal', amount: 21345, percentage: 27 },
    { method: 'Apple Pay', amount: 7890, percentage: 10 },
    { method: 'Other', amount: 3890, percentage: 5 }
  ],
  topProducts: [
    { name: 'Wireless Headphones Pro', revenue: 23456, orders: 78, aov: 300 },
    { name: 'Gaming Mouse X-1000', revenue: 18934, orders: 234, aov: 81 },
    { name: '4K Ultra HD Monitor', revenue: 17996, orders: 40, aov: 450 },
    { name: 'Mechanical Keyboard', revenue: 14985, orders: 100, aov: 150 }
  ]
}

// ============================================================================
// STAT CARD
// ============================================================================

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  change: number
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, change, color }) => {
  const isPositive = change >= 0

  return (
    <Touchable
      onTap={() => console.log('Stat tapped')}
      hapticFeedback
      className="glass-card p-4 hover:scale-105 transition-transform"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-success-green' : 'text-error-red'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </Touchable>
  )
}

// ============================================================================
// MAIN SALES REPORT PAGE
// ============================================================================

export const SalesReportsPage: React.FC = () => {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('week')

  const totalRevenue = MOCK_SALES_DATA.daily.reduce((sum, d) => sum + d.revenue, 0)
  const totalOrders = MOCK_SALES_DATA.daily.reduce((sum, d) => sum + d.orders, 0)
  const avgAOV = totalRevenue / totalOrders

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Touchable
          onTap={() => navigate('/ecommerce/reports')}
          hapticFeedback
          className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </Touchable>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Sales Report</h1>
          <p className="text-gray-400 text-sm mt-1">Detailed revenue and order analytics</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-2 mb-6">
        {['day', 'week', 'month', 'year'].map((p) => (
          <Touchable
            key={p}
            onTap={() => setPeriod(p)}
            hapticFeedback
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              period === p
                ? 'bg-teal-500 text-white'
                : 'bg-dark-hover text-gray-400 hover:text-white'
            }`}
          >
            {p}
          </Touchable>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={23.5}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders.toString()}
          change={12.3}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Average Order"
          value={`$${avgAOV.toFixed(2)}`}
          change={5.6}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Users}
          label="Conversion Rate"
          value="3.2%"
          change={0.4}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Daily Sales Chart */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Daily Sales</h2>
        <div className="h-64 flex items-end justify-between">
          {MOCK_SALES_DATA.daily.map((day, index) => {
            const height = (day.revenue / 10000) * 100
            return (
              <div key={index} className="flex flex-col items-center w-12">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="w-8 bg-gradient-to-t from-teal-500 to-cyan-500 rounded-t-lg"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400 mt-2">{day.date}</span>
                <span className="text-xs text-white">${day.revenue}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Methods & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Payment Methods</h2>
          <div className="space-y-4">
            {MOCK_SALES_DATA.paymentMethods.map((method) => (
              <div key={method.method}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">{method.method}</span>
                  <span className="text-white">${method.amount.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${method.percentage}%` }}
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Products</h2>
          <div className="space-y-4">
            {MOCK_SALES_DATA.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">${product.aov} avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to filter</span>
          <span>📊 Daily trends</span>
          <span>💰 Revenue breakdown</span>
        </div>
      </div>
    </div>
  )
}
