import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Filter, Download, RefreshCw,
  Mail, Phone, MapPin, Calendar, DollarSign,
  ShoppingBag, Star, ChevronRight, MoreVertical,
  Edit, Trash2, Eye, MessageSquare, UserPlus
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  location: string
  totalSpent: number
  totalOrders: number
  lastOrder: string
  joinedAt: string
  status: 'active' | 'inactive' | 'vip'
  tags: string[]
}

// ============================================================================
// MOCK DATA
// ============================================================================
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    location: 'San Francisco, CA',
    totalSpent: 1245.67,
    totalOrders: 8,
    lastOrder: '2024-03-15',
    joinedAt: '2024-01-15',
    status: 'vip',
    tags: ['repeat', 'high-value']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=150&h=150&fit=crop',
    location: 'Austin, TX',
    totalSpent: 567.89,
    totalOrders: 4,
    lastOrder: '2024-03-14',
    joinedAt: '2024-02-01',
    status: 'active',
    tags: ['new']
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.c@email.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    location: 'Seattle, WA',
    totalSpent: 2345.67,
    totalOrders: 12,
    lastOrder: '2024-03-13',
    joinedAt: '2024-01-20',
    status: 'vip',
    tags: ['repeat', 'high-value', 'wholesale']
  },
  {
    id: '4',
    name: 'Emma Watson',
    email: 'emma.w@email.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    location: 'Miami, FL',
    totalSpent: 345.67,
    totalOrders: 2,
    lastOrder: '2024-03-10',
    joinedAt: '2024-03-01',
    status: 'active',
    tags: ['new']
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    location: 'Chicago, IL',
    totalSpent: 89.99,
    totalOrders: 1,
    lastOrder: '2024-03-05',
    joinedAt: '2024-03-05',
    status: 'inactive',
    tags: ['one-time']
  }
]

// ============================================================================
// STATS CARD
// ============================================================================
interface StatsCardProps {
  title: string
  value: string
  icon: React.ElementType
  color: string
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color }) => (
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
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  </Touchable>
)

// ============================================================================
// CUSTOMER CARD
// ============================================================================
interface CustomerCardProps {
  customer: Customer
  onSelect: (customer: Customer) => void
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onSelect }) => {
  const [showActions, setShowActions] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-gold/10 text-gold'
      case 'active': return 'bg-success-green/10 text-success-green'
      case 'inactive': return 'bg-gray-500/10 text-gray-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  return (
    <div className="relative">
      <Touchable
        onTap={() => onSelect(customer)}
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className="glass-card p-4 block hover:scale-105 transition-transform"
      >
        <div className="flex items-start space-x-4">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-500/50"
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-medium">{customer.name}</h3>
                <p className="text-sm text-gray-400">{customer.email}</p>
                <p className="text-xs text-gray-500 mt-1">{customer.phone}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center">
                <p className="text-sm font-bold text-white">${customer.totalSpent}</p>
                <p className="text-xs text-gray-400">Spent</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">{customer.totalOrders}</p>
                <p className="text-xs text-gray-400">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">
                  {new Date(customer.lastOrder).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">Last Order</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-400">{customer.location}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {customer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
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
                window.location.href = `/ecommerce/customers/${customer.id}`
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <Eye className="w-5 h-5 text-blue-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                window.location.href = `mailto:${customer.email}`
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
            >
              <Mail className="w-5 h-5 text-purple-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                console.log('Edit customer')
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-teal-500/20 rounded-full hover:bg-teal-500/30 transition-colors"
            >
              <Edit className="w-5 h-5 text-teal-400" />
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
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search customers by name, email, phone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-3 bg-dark-hover border border-dark-border rounded-xl text-white focus:border-teal-500 focus:outline-none"
      >
        <option value="">All Status</option>
        <option value="vip">VIP</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

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
  )
}

// ============================================================================
// MAIN CUSTOMERS LIST PAGE
// ============================================================================
export const CustomersListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredCustomers = useMemo(() => {
    return MOCK_CUSTOMERS.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
      
      const matchesStatus = !statusFilter || customer.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const stats = {
    total: MOCK_CUSTOMERS.length,
    active: MOCK_CUSTOMERS.filter(c => c.status === 'active' || c.status === 'vip').length,
    vip: MOCK_CUSTOMERS.filter(c => c.status === 'vip').length,
    revenue: MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0)
  }

  const handleViewCustomer = (customer: Customer) => {
    window.location.href = `/ecommerce/customers/${customer.id}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Customers</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your customer relationships</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Customers"
          value={stats.total.toString()}
          icon={Users}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          title="Active"
          value={stats.active.toString()}
          icon={Users}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          title="VIP"
          value={stats.vip.toString()}
          icon={Star}
          color="from-gold to-amber-500"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          icon={DollarSign}
          color="from-purple-500 to-pink-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Customers Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onSelect={handleViewCustomer}
          />
        ))}
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to view</span>
          <span>🤏 Long press for actions</span>
          <span>📧 Quick email</span>
        </div>
      </div>
    </div>
  )
}

// Helper component for X icon
const X: React.FC<{ className?: string }> = ({ className }) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
