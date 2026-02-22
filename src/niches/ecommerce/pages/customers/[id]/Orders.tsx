import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, ShoppingBag, DollarSign, Package,
  Truck, CheckCircle, XCircle, Clock, Calendar,
  Download, Filter, Search, Eye, Printer,
  TrendingUp, TrendingDown, Star, Award
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface CustomerOrder {
  id: string
  orderNumber: string
  date: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'paid' | 'unpaid' | 'refunded'
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }[]
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  trackingNumber?: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-03-15T10:30:00Z',
    total: 649.97,
    subtotal: 649.97,
    tax: 51.99,
    shipping: 0,
    discount: 0,
    status: 'delivered',
    paymentStatus: 'paid',
    items: [
      {
        id: 'p1',
        name: 'Wireless Headphones Pro',
        quantity: 2,
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
      },
      {
        id: 'p2',
        name: 'USB-C Hub',
        quantity: 1,
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1619946794135-5bc0bd7c6b7f?w=100&h=100&fit=crop'
      }
    ],
    shippingAddress: {
      name: 'John Smith',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    }
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-03-10T14:20:00Z',
    total: 89.99,
    subtotal: 89.99,
    tax: 7.20,
    shipping: 5.99,
    discount: 0,
    status: 'delivered',
    paymentStatus: 'paid',
    items: [
      {
        id: 'p3',
        name: 'Gaming Mouse',
        quantity: 1,
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
      }
    ],
    shippingAddress: {
      name: 'John Smith',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    }
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-03-05T09:15:00Z',
    total: 149.99,
    subtotal: 149.99,
    tax: 12.00,
    shipping: 0,
    discount: 0,
    status: 'shipped',
    paymentStatus: 'paid',
    items: [
      {
        id: 'p4',
        name: 'Mechanical Keyboard',
        quantity: 1,
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=100&h=100&fit=crop'
      }
    ],
    shippingAddress: {
      name: 'John Smith',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    trackingNumber: '1Z999AA10123456784'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-02-28T16:45:00Z',
    total: 299.99,
    subtotal: 299.99,
    tax: 24.00,
    shipping: 0,
    discount: 0,
    status: 'cancelled',
    paymentStatus: 'refunded',
    items: [
      {
        id: 'p5',
        name: 'Wireless Headphones Pro',
        quantity: 1,
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
      }
    ],
    shippingAddress: {
      name: 'John Smith',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    }
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
// ORDER CARD
// ============================================================================

interface OrderCardProps {
  order: CustomerOrder
  onSelect: (order: CustomerOrder) => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success-green/10 text-success-green'
      case 'shipped': return 'bg-electric-blue/10 text-electric-blue'
      case 'processing': return 'bg-warning-orange/10 text-warning-orange'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400'
      case 'cancelled': return 'bg-error-red/10 text-error-red'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card overflow-hidden"
    >
      <Touchable
        onTap={() => setIsExpanded(!isExpanded)}
        onDoubleTap={() => onSelect(order)}
        hapticFeedback
        className="w-full p-4 text-left"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-medium">{order.orderNumber}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {formatDate(order.date)} • {order.items.length} items
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">${order.total.toFixed(2)}</p>
            <p className={`text-xs ${
              order.paymentStatus === 'paid' ? 'text-success-green' :
              order.paymentStatus === 'unpaid' ? 'text-warning-orange' :
              'text-gray-400'
            }`}>
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Items Preview */}
        <div className="flex -space-x-2 mb-3">
          {order.items.slice(0, 3).map((item, i) => (
            <img
              key={i}
              src={item.image}
              alt={item.name}
              className="w-8 h-8 rounded-full border-2 border-dark-card object-cover"
              title={item.name}
            />
          ))}
          {order.items.length > 3 && (
            <span className="w-8 h-8 rounded-full bg-dark-card border-2 border-dark-card flex items-center justify-center text-xs text-gray-400">
              +{order.items.length - 3}
            </span>
          )}
        </div>

        {/* Tracking if available */}
        {order.trackingNumber && (
          <div className="flex items-center space-x-2 text-xs text-teal-400">
            <Truck className="w-3 h-3" />
            <span>Track: {order.trackingNumber}</span>
          </div>
        )}

        {/* Expand/Collapse Icon */}
        <div className="flex justify-end mt-2">
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </Touchable>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-dark-border"
          >
            <div className="p-4 space-y-4">
              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Items</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-gray-300">{item.name} x{item.quantity}</span>
                      </div>
                      <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success-green">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-dark-border font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-400">
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                  {order.shippingAddress.country}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Touchable
                  onTap={() => onSelect(order)}
                  hapticFeedback
                  className="flex-1 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm text-center"
                >
                  View Order Details
                </Touchable>
                {order.trackingNumber && (
                  <Touchable
                    onTap={() => window.open(`https://track.example.com/${order.trackingNumber}`)}
                    hapticFeedback
                    className="px-4 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-teal-500/20 transition-colors"
                  >
                    <Truck className="w-4 h-4" />
                  </Touchable>
                )}
                <Touchable
                  onTap={() => window.print()}
                  hapticFeedback
                  className="px-4 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-teal-500/20 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </Touchable>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
  dateRange: string
  onDateRangeChange: (range: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange
}) => {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search orders by number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
          />
        </div>

        <Touchable
          onTap={() => setShowFilters(!showFilters)}
          hapticFeedback
          className={`p-3 rounded-xl transition-colors ${
            showFilters ? 'bg-teal-500 text-white' : 'bg-dark-hover text-gray-400 hover:text-white'
          }`}
        >
          <Filter className="w-5 h-5" />
        </Touchable>

        <Touchable
          onTap={() => console.log('Export orders')}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="">All</option>
                    <option value="delivered">Delivered</option>
                    <option value="shipped">Shipped</option>
                    <option value="processing">Processing</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => onDateRangeChange(e.target.value)}
                    className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="all">All Time</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="365">This Year</option>
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
// MAIN CUSTOMER ORDERS PAGE
// ============================================================================

export const CustomerOrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { triggerHaptic } = useGestures()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateRange, setDateRange] = useState('all')

  // Mock customer name - in real app, fetch from API
  const customerName = "John Smith"

  // Filter orders
  const filteredOrders = useMemo(() => {
    return MOCK_CUSTOMER_ORDERS.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !statusFilter || order.status === statusFilter
      
      // Date filtering logic would go here
      
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  // Calculate stats
  const totalSpent = filteredOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = filteredOrders.length
  const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0
  const completedOrders = filteredOrders.filter(o => o.status === 'delivered').length

  const handleViewOrder = (order: CustomerOrder) => {
    triggerHaptic([10])
    navigate(`/ecommerce/orders/${order.id}`)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Touchable
          onTap={() => navigate(`/ecommerce/customers/${id}`)}
          hapticFeedback
          className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </Touchable>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">{customerName}'s Orders</h1>
          <p className="text-gray-400 text-sm mt-1">Complete order history and analytics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders.toString()}
          change={12.5}
          color="from-blue-500 to-cyan-500"
        />
        <StatsCard
          icon={DollarSign}
          label="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          change={8.3}
          color="from-green-500 to-emerald-500"
        />
        <StatsCard
          icon={TrendingUp}
          label="Average Order"
          value={`$${averageOrder.toFixed(2)}`}
          change={5.2}
          color="from-purple-500 to-pink-500"
        />
        <StatsCard
          icon={CheckCircle}
          label="Completed"
          value={completedOrders.toString()}
          change={15.7}
          color="from-teal-500 to-cyan-500"
        />
      </div>

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
              <p className="text-gray-400">This customer hasn't placed any orders yet</p>
            </motion.div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={handleViewOrder}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to expand</span>
          <span>👆👆 Double tap to view</span>
          <span>📊 Order analytics</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const Truck: React.FC<{ className?: string }> = ({ className }) => (
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
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

const Printer: React.FC<{ className?: string }> = ({ className }) => (
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
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
)
