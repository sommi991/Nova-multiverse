import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, DollarSign, Target, Users,
  Calendar, Download, Filter, RefreshCw,
  ChevronRight, Award, Star, Clock,
  ArrowUpRight, ArrowDownRight, PieChart,
  BarChart3, LineChart, Activity
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_FORECAST = {
  monthly: [
    { month: 'Jan', actual: 45000, forecast: 42000 },
    { month: 'Feb', actual: 52000, forecast: 48000 },
    { month: 'Mar', actual: 58000, forecast: 55000 },
    { month: 'Apr', actual: null, forecast: 62000 },
    { month: 'May', actual: null, forecast: 68000 },
    { month: 'Jun', actual: null, forecast: 75000 }
  ],
  pipeline: {
    total: 450000,
    weighted: 320000,
    stages: [
      { name: 'Lead', value: 120000, count: 8 },
      { name: 'Qualified', value: 150000, count: 6 },
      { name: 'Proposal', value: 100000, count: 4 },
      { name: 'Negotiation', value: 80000, count: 3 }
    ]
  },
  team: [
    { name: 'Sarah Johnson', deals: 12, value: 180000, target: 200000 },
    { name: 'John Smith', deals: 8, value: 120000, target: 150000 },
    { name: 'Emma Wilson', deals: 10, value: 150000, target: 180000 }
  ],
  kpis: {
    winRate: 68,
    avgDealSize: 42500,
    salesCycle: 45,
    conversionRate: 24
  }
}

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
      <div className="flex items-center justify-between mb-2">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change !== undefined && (
          <span className={change >= 0 ? 'text-success-green' : 'text-error-red'}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </Touchable>
  )
}

// ============================================================================
// REPORT CARD
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
          </div>
        ))}
      </div>
    </Touchable>
  )
}

// ============================================================================
// PROGRESS BAR
// ============================================================================

interface ProgressBarProps {
  label: string
  value: number
  max: number
  color: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max, color }) => {
  const percentage = (value / max) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white">${value.toLocaleString()}</span>
      </div>
      <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  )
}

// ============================================================================
// MAIN REPORTS PAGE
// ============================================================================

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('quarter')

  const reports = [
    {
      title: 'Sales Forecast',
      description: 'Projected revenue and pipeline analysis',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      to: '/crm/reports/forecast',
      stats: [
        { label: 'Q2 Forecast', value: '$245K' },
        { label: 'Pipeline', value: '$450K' }
      ]
    },
    {
      title: 'Pipeline Analytics',
      description: 'Stage-by-stage pipeline breakdown',
      icon: PieChart,
      color: 'from-blue-500 to-cyan-500',
      to: '/crm/reports/pipeline',
      stats: [
        { label: 'Total Value', value: '$450K' },
        { label: 'Weighted', value: '$320K' }
      ]
    },
    {
      title: 'Team Performance',
      description: 'Individual and team metrics',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      to: '/crm/reports/performance',
      stats: [
        { label: 'Active Reps', value: '8' },
        { label: 'Win Rate', value: '68%' }
      ]
    },
    {
      title: 'Win Rate Analysis',
      description: 'Conversion rates by stage',
      icon: Award,
      color: 'from-orange-500 to-red-500',
      to: '/crm/reports/winrate',
      stats: [
        { label: 'Overall', value: '68%' },
        { label: 'QoQ', value: '+5%' }
      ]
    }
  ]

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Sales forecasting and performance metrics</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 glass-card hover:bg-dark-hover rounded-xl text-white border-none outline-none"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <Touchable
            onTap={() => console.log('Refresh')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </Touchable>

          <Touchable
            onTap={() => console.log('Export')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <Download className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          icon={Award}
          label="Win Rate"
          value={`${MOCK_FORECAST.kpis.winRate}%`}
          change={5.2}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={DollarSign}
          label="Avg Deal Size"
          value={`$${(MOCK_FORECAST.kpis.avgDealSize / 1000).toFixed(0)}K`}
          change={8.3}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={Clock}
          label="Sales Cycle"
          value={`${MOCK_FORECAST.kpis.salesCycle} days`}
          change={-12.5}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={Target}
          label="Conversion"
          value={`${MOCK_FORECAST.kpis.conversionRate}%`}
          change={2.1}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Pipeline Overview */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Pipeline Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline Value */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">Total Pipeline</p>
                <p className="text-3xl font-bold text-white">
                  ${(MOCK_FORECAST.pipeline.total / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Weighted</p>
                <p className="text-2xl font-bold text-green-400">
                  ${(MOCK_FORECAST.pipeline.weighted / 1000).toFixed(0)}K
                </p>
              </div>
            </div>

            {/* Stage breakdown */}
            <div className="space-y-4">
              {MOCK_FORECAST.pipeline.stages.map((stage) => (
                <ProgressBar
                  key={stage.name}
                  label={`${stage.name} (${stage.count})`}
                  value={stage.value}
                  max={MOCK_FORECAST.pipeline.total}
                  color="from-green-500 to-emerald-500"
                />
              ))}
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="h-64 bg-dark-hover rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Pipeline chart would go here</p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

      {/* Team Performance */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Team Performance</h2>
        <div className="space-y-4">
          {MOCK_FORECAST.team.map((member, index) => {
            const percentage = (member.value / member.target) * 100
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">{member.name}</span>
                    <span className="text-sm text-gray-400">{member.deals} deals</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-bold">${(member.value / 1000).toFixed(0)}K</span>
                    <span className="text-sm text-gray-400">of ${(member.target / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full ${
                      percentage >= 100 ? 'bg-success-green' :
                      percentage >= 80 ? 'bg-green-500' :
                      percentage >= 60 ? 'bg-yellow-500' :
                      'bg-orange-500'
                    }`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap for details</span>
          <span>📊 Sales analytics</span>
          <span>🎯 Team tracking</span>
        </div>
      </div>
    </div>
  )
}
