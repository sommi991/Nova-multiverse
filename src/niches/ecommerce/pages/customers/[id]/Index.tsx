import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, Mail, Phone, MapPin, Calendar,
  ShoppingBag, DollarSign, Star, Edit,
  MessageSquare, Award, Clock, Package,
  TrendingUp, CreditCard, Truck, Download
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'

// ============================================================================
// MOCK CUSTOMER DATA
// ============================================================================
const MOCK_CUSTOMER = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@email.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  location: 'San Francisco, CA',
  address: '123 Main St, Apt 4B, San Francisco, CA 94105',
  totalSpent: 1245.67,
  totalOrders: 8,
  averageOrder: 155.71,
  joinedAt: '2024-01-15',
  lastOrder: '2024-03-15',
  status: 'vip',
  tags: ['repeat', 'high-value'],
  recentOrders: [
    { id: 'ORD-2024-001', date: '2024-03-15', total: 299.99, status: 'delivered' },
    { id: 'ORD-2024-002', date: '2024-03-10', total: 89.99, status: 'delivered' },
    { id: 'ORD-2024-003', date: '2024-03-05', total: 149.99, status: 'shipped' }
  ],
  paymentMethods: [
    { type: 'Visa', last4: '4242', expiry: '12/25' },
    { type: 'PayPal', email: 'john.smith@email.com' }
  ]
}

// ============================================================================
// STAT CARD
// ============================================================================
interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => (
  <Touchable
    onTap={() => console.log('Stat tapped')}
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

// ============================================================================
// MAIN CUSTOMER PROFILE PAGE
// ============================================================================
export const CustomerProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const customer = MOCK_CUSTOMER

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Touchable
          onTap={() => navigate('/ecommerce/customers')}
          hapticFeedback
          className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-400" />
        </Touchable>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Customer Profile</h1>
          <p className="text-gray-400 text-sm mt-1">View and manage customer details</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center space-x-6">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-500/50"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
                <p className="text-gray-400 mt-1">Customer since {new Date(customer.joinedAt).toLocaleDateString()}</p>
              </div>
              <Touchable
                onTap={() => navigate(`/ecommerce/customers/${id}/edit`)}
                hapticFeedback
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Edit Profile
              </Touchable>
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{customer.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-3">
              {customer.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
              <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm">
                {customer.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          label="Total Spent"
          value={`$${customer.totalSpent.toFixed(2)}`}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={customer.totalOrders.toString()}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Average Order"
          value={`$${customer.averageOrder.toFixed(2)}`}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Star}
          label="Customer Value"
          value="High"
          color="from-gold to-amber-500"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact & Address */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <Touchable
                onTap={() => window.location.href = `mailto:${customer.email}`}
                hapticFeedback
                className="flex items-center space-x-3 p-3 bg-dark-hover rounded-lg hover:bg-teal-500/10 transition-colors"
              >
                <Mail className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-gray-300">{customer.email}</span>
              </Touchable>
              <Touchable
                onTap={() => window.location.href = `tel:${customer.phone}`}
                hapticFeedback
                className="flex items-center space-x-3 p-3 bg-dark-hover rounded-lg hover:bg-teal-500/10 transition-colors"
              >
                <Phone className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-gray-300">{customer.phone}</span>
              </Touchable>
              <Touchable
                onTap={() => window.open(`https://maps.google.com/?q=${customer.address}`)}
                hapticFeedback
                className="flex items-center space-x-3 p-3 bg-dark-hover rounded-lg hover:bg-teal-500/10 transition-colors"
              >
                <MapPin className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-gray-300">{customer.address}</span>
              </Touchable>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {customer.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-dark-hover rounded-lg">
                  <CreditCard className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-sm text-white">
                      {method.type} •••• {method.last4}
                    </p>
                    {method.expiry && (
                      <p className="text-xs text-gray-400">Expires {method.expiry}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Recent Orders */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
              <Touchable
                onTap={() => navigate(`/ecommerce/customers/${id}/orders`)}
                hapticFeedback
                className="text-sm text-teal-400 hover:text-teal-300"
              >
                View All
              </Touchable>
            </div>

            <div className="space-y-3">
              {customer.recentOrders.map((order) => (
                <Touchable
                  key={order.id}
                  onTap={() => navigate(`/ecommerce/orders/${order.id}`)}
                  hapticFeedback
                  className="flex items-center justify-between p-3 bg-dark-hover rounded-lg hover:bg-teal-500/10 transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">{order.id}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">${order.total.toFixed(2)}</p>
                    <p className={`text-sm ${
                      order.status === 'delivered' ? 'text-success-green' :
                      order.status === 'shipped' ? 'text-teal-400' :
                      'text-warning-orange'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </Touchable>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to contact</span>
          <span>📊 View orders</span>
          <span>💳 Payment methods</span>
        </div>
      </div>
    </div>
  )
}
