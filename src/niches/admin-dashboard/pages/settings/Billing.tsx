import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, DollarSign, Receipt, Calendar, Clock,
  Download, Mail, Check, X, AlertCircle, Plus,
  Edit, Trash2, Copy, Eye, MoreVertical,
  ChevronDown, ChevronUp, Shield, Zap,
  TrendingUp, TrendingDown, PieChart, BarChart3,
  Smartphone, Laptop, Globe, Lock, Unlock,
  RefreshCw, Save, RotateCcw, FileText
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  currency: string
  features: string[]
  limits: {
    users: number
    projects: number
    storage: number
    apiCalls: number
  }
  isCurrent: boolean
  isPopular?: boolean
  savings?: number
}

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  name: string
  email?: string
}

interface Invoice {
  id: string
  number: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'void'
  items: {
    description: string
    quantity: number
    price: number
    total: number
  }[]
  pdfUrl?: string
}

interface UsageMetric {
  id: string
  name: string
  used: number
  limit: number
  unit: string
  color: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    currency: 'USD',
    features: [
      'Up to 5 team members',
      '10 projects',
      '10GB storage',
      '10,000 API calls/month',
      'Basic support'
    ],
    limits: {
      users: 5,
      projects: 10,
      storage: 10,
      apiCalls: 10000
    },
    isCurrent: false
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 99,
    interval: 'month',
    currency: 'USD',
    features: [
      'Up to 20 team members',
      '50 projects',
      '100GB storage',
      '100,000 API calls/month',
      'Priority support',
      'Advanced analytics',
      'Custom integrations'
    ],
    limits: {
      users: 20,
      projects: 50,
      storage: 100,
      apiCalls: 100000
    },
    isCurrent: true,
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    currency: 'USD',
    features: [
      'Unlimited team members',
      'Unlimited projects',
      '1TB storage',
      '1,000,000+ API calls',
      '24/7 phone support',
      'SLA guarantee',
      'Custom development',
      'On-premise option'
    ],
    limits: {
      users: -1,
      projects: -1,
      storage: 1000,
      apiCalls: 1000000
    },
    isCurrent: false
  }
]

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    name: 'John Doe'
  },
  {
    id: '2',
    type: 'paypal',
    email: 'john.doe@example.com',
    isDefault: false,
    name: 'PayPal'
  }
]

const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '2024-03-01',
    amount: 99,
    status: 'paid',
    items: [
      {
        description: 'Professional Plan - March 2024',
        quantity: 1,
        price: 99,
        total: 99
      }
    ]
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '2024-02-01',
    amount: 99,
    status: 'paid',
    items: [
      {
        description: 'Professional Plan - February 2024',
        quantity: 1,
        price: 99,
        total: 99
      }
    ]
  },
  {
    id: '3',
    number: 'INV-2024-003',
    date: '2024-01-01',
    amount: 99,
    status: 'paid',
    items: [
      {
        description: 'Professional Plan - January 2024',
        quantity: 1,
        price: 99,
        total: 99
      }
    ]
  }
]

const MOCK_USAGE: UsageMetric[] = [
  {
    id: 'users',
    name: 'Team Members',
    used: 12,
    limit: 20,
    unit: 'users',
    color: 'blue'
  },
  {
    id: 'projects',
    name: 'Projects',
    used: 23,
    limit: 50,
    unit: 'projects',
    color: 'green'
  },
  {
    id: 'storage',
    name: 'Storage',
    used: 45,
    limit: 100,
    unit: 'GB',
    color: 'purple'
  },
  {
    id: 'api',
    name: 'API Calls',
    used: 45678,
    limit: 100000,
    unit: 'calls',
    color: 'orange'
  }
]

// ============================================================================
// PLAN CARD COMPONENT
// ============================================================================

interface PlanCardProps {
  plan: SubscriptionPlan
  onSelect: () => void
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-6 relative overflow-hidden ${
        plan.isCurrent ? 'ring-2 ring-purple-500' : ''
      } ${plan.isPopular ? 'scale-105' : ''}`}
    >
      {plan.isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-gold to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            MOST POPULAR
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-bold text-white">${plan.price}</span>
            <span className="text-gray-400 ml-1">/{plan.interval}</span>
          </div>
          {plan.savings && (
            <p className="text-success-green text-sm mt-1">Save ${plan.savings}/year</p>
          )}
        </div>
        {plan.isCurrent && (
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
            Current
          </span>
        )}
      </div>

      <Touchable
        onTap={() => setIsExpanded(!isExpanded)}
        hapticFeedback
        className="w-full flex items-center justify-between p-2 bg-dark-hover rounded-lg mb-4"
      >
        <span className="text-sm text-gray-300">View features</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </Touchable>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-success-green flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="p-3 bg-dark-hover rounded-lg mb-4">
              <h4 className="text-sm font-medium text-white mb-2">Limits</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-400">Users</p>
                  <p className="text-sm text-white">
                    {plan.limits.users === -1 ? 'Unlimited' : plan.limits.users}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Projects</p>
                  <p className="text-sm text-white">
                    {plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Storage</p>
                  <p className="text-sm text-white">
                    {plan.limits.storage === -1 ? 'Unlimited' : `${plan.limits.storage}GB`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">API Calls</p>
                  <p className="text-sm text-white">
                    {plan.limits.apiCalls === -1 ? 'Unlimited' : `${plan.limits.apiCalls.toLocaleString()}/mo`}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!plan.isCurrent && (
        <Touchable
          onTap={onSelect}
          hapticFeedback
          className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center font-medium"
        >
          Select Plan
        </Touchable>
      )}
    </motion.div>
  )
}

// ============================================================================
// PAYMENT METHOD CARD COMPONENT
// ============================================================================

interface PaymentMethodCardProps {
  method: PaymentMethod
  onSetDefault: () => void
  onEdit: () => void
  onRemove: () => void
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  onSetDefault,
  onEdit,
  onRemove
}) => {
  const [showActions, setShowActions] = useState(false)

  const getCardIcon = () => {
    if (method.type === 'paypal') return '💰'
    if (method.type === 'bank') return '🏦'
    switch (method.brand) {
      case 'visa': return '💳'
      case 'mastercard': return '💳'
      case 'amex': return '💳'
      default: return '💳'
    }
  }

  return (
    <div className="relative">
      <Touchable
        onLongPress={() => setShowActions(true)}
        hapticFeedback
        className={`glass-card p-4 block hover:scale-105 transition-transform ${
          method.isDefault ? 'ring-2 ring-purple-500' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCardIcon()}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-white font-medium">
                  {method.type === 'card' 
                    ? `${method.brand?.toUpperCase()} •••• ${method.last4}`
                    : method.type === 'paypal'
                      ? 'PayPal'
                      : 'Bank Account'
                  }
                </h4>
                {method.isDefault && (
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
              {method.type === 'card' && (
                <p className="text-sm text-gray-400">
                  Expires {method.expiryMonth}/{method.expiryYear}
                </p>
              )}
              {method.type === 'paypal' && (
                <p className="text-sm text-gray-400">{method.email}</p>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-400">{method.name}</span>
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
            {!method.isDefault && (
              <Touchable
                onTap={() => {
                  onSetDefault()
                  setShowActions(false)
                }}
                hapticFeedback
                className="p-3 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
              >
                <Check className="w-5 h-5 text-blue-400" />
              </Touchable>
            )}
            <Touchable
              onTap={() => {
                onEdit()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-colors"
            >
              <Edit className="w-5 h-5 text-purple-400" />
            </Touchable>
            <Touchable
              onTap={() => {
                onRemove()
                setShowActions(false)
              }}
              hapticFeedback
              className="p-3 bg-error-red/20 rounded-full hover:bg-error-red/30 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-error-red" />
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
// INVOICE CARD COMPONENT
// ============================================================================

interface InvoiceCardProps {
  invoice: Invoice
  onDownload: () => void
  onView: () => void
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onDownload, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success-green/10 text-success-green'
      case 'pending': return 'bg-warning-orange/10 text-warning-orange'
      case 'overdue': return 'bg-error-red/10 text-error-red'
      case 'void': return 'bg-gray-500/10 text-gray-400'
      default: return 'bg-gray-500/10 text-gray-400'
    }
  }

  return (
    <Touchable
      onTap={() => setIsExpanded(!isExpanded)}
      hapticFeedback
      className="glass-card p-4 block hover:scale-105 transition-transform"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-purple-500/20">
            <Receipt className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-white font-medium">{invoice.number}</h4>
            <p className="text-sm text-gray-400">{new Date(invoice.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
            {invoice.status}
          </span>
          <span className="text-lg font-bold text-white">${invoice.amount}</span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-dark-border overflow-hidden"
          >
            <div className="space-y-3">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{item.description}</span>
                  <span className="text-white">${item.total}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-dark-border">
                <span className="text-gray-300 font-medium">Total</span>
                <span className="text-white font-bold">${invoice.amount}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Touchable
                  onTap={(e) => {
                    e.stopPropagation()
                    onDownload()
                  }}
                  hapticFeedback
                  className="flex-1 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-dark-card transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </Touchable>
                <Touchable
                  onTap={(e) => {
                    e.stopPropagation()
                    onView()
                  }}
                  hapticFeedback
                  className="flex-1 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-dark-card transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </Touchable>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Touchable>
  )
}

// ============================================================================
// USAGE METER COMPONENT
// ============================================================================

interface UsageMeterProps {
  metric: UsageMetric
}

const UsageMeter: React.FC<UsageMeterProps> = ({ metric }) => {
  const percentage = (metric.used / metric.limit) * 100
  const isNearLimit = percentage > 80
  const isAtLimit = percentage >= 100

  const getStatusColor = () => {
    if (isAtLimit) return 'bg-error-red'
    if (isNearLimit) return 'bg-warning-orange'
    return `bg-${metric.color}-500`
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{metric.name}</span>
        <span className={`text-sm font-medium ${
          isAtLimit ? 'text-error-red' : isNearLimit ? 'text-warning-orange' : 'text-white'
        }`}>
          {metric.used.toLocaleString()} / {metric.limit === -1 ? '∞' : metric.limit.toLocaleString()} {metric.unit}
        </span>
      </div>
      <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${getStatusColor()}`}
        />
      </div>
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-warning-orange flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Approaching limit</span>
        </p>
      )}
      {isAtLimit && (
        <p className="text-xs text-error-red flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Limit reached</span>
        </p>
      )}
    </div>
  )
}

// ============================================================================
// ADD PAYMENT METHOD MODAL
// ============================================================================

interface AddPaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (method: any) => void
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [methodType, setMethodType] = useState<'card' | 'paypal'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">Add Payment Method</h2>

        {/* Method type selector */}
        <div className="flex items-center space-x-3 mb-6">
          <Touchable
            onTap={() => setMethodType('card')}
            hapticFeedback
            className={`flex-1 p-3 rounded-xl border transition-colors ${
              methodType === 'card'
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-dark-border bg-dark-hover'
            }`}
          >
            <CreditCard className={`w-5 h-5 mx-auto mb-1 ${
              methodType === 'card' ? 'text-purple-400' : 'text-gray-400'
            }`} />
            <span className={`text-xs ${
              methodType === 'card' ? 'text-purple-400' : 'text-gray-400'
            }`}>Credit Card</span>
          </Touchable>
          <Touchable
            onTap={() => setMethodType('paypal')}
            hapticFeedback
            className={`flex-1 p-3 rounded-xl border transition-colors ${
              methodType === 'paypal'
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-dark-border bg-dark-hover'
            }`}
          >
            <span className="text-2xl block mb-1">💰</span>
            <span className={`text-xs ${
              methodType === 'paypal' ? 'text-purple-400' : 'text-gray-400'
            }`}>PayPal</span>
          </Touchable>
        </div>

        {methodType === 'card' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Cardholder Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">PayPal Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <p className="text-sm text-gray-400">
              You'll be redirected to PayPal to complete the setup.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3 mt-6">
          <Touchable
            onTap={onClose}
            hapticFeedback
            className="flex-1 px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
          >
            Cancel
          </Touchable>
          <Touchable
            onTap={() => {
              onAdd({ type: methodType })
              onClose()
            }}
            hapticFeedback
            className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            Add Method
          </Touchable>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// MAIN BILLING SETTINGS PAGE
// ============================================================================

export const SettingsBillingPage: React.FC = () => {
  const [plans, setPlans] = useState(MOCK_PLANS)
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS)
  const [invoices, setInvoices] = useState(MOCK_INVOICES)
  const [usage, setUsage] = useState(MOCK_USAGE)
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const currentPlan = plans.find(p => p.isCurrent)
  const nextBillingDate = new Date()
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

  const totalSpent = invoices.reduce((sum, inv) => sum + inv.amount, 0)

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleConfirmPlanChange = () => {
    if (selectedPlan) {
      setPlans(prev => prev.map(p => ({
        ...p,
        isCurrent: p.id === selectedPlan
      })))
      setSelectedPlan(null)
    }
  }

  const handleSetDefaultPayment = (methodId: string) => {
    setPaymentMethods(prev => prev.map(m => ({
      ...m,
      isDefault: m.id === methodId
    })))
  }

  const handleRemovePayment = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== methodId))
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Current Plan Summary */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Current Plan</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Next billing:</span>
              <span className="text-white font-medium">
                {nextBillingDate.toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-2xl font-bold text-white">{currentPlan?.name}</h3>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                  Active
                </span>
              </div>
              <p className="text-gray-400 mt-1">
                ${currentPlan?.price}/{currentPlan?.interval} • {currentPlan?.features.length} features
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total spent to date</p>
              <p className="text-2xl font-bold text-white">${totalSpent}</p>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={() => handleSelectPlan(plan.id)}
              />
            ))}
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Usage Overview</h2>
          <div className="space-y-4">
            {usage.map((metric) => (
              <UsageMeter key={metric.id} metric={metric} />
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Payment Methods</h2>
            <Touchable
              onTap={() => setShowAddPaymentModal(true)}
              hapticFeedback
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Method</span>
            </Touchable>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onSetDefault={() => handleSetDefaultPayment(method.id)}
                onEdit={() => console.log('Edit method', method.id)}
                onRemove={() => handleRemovePayment(method.id)}
              />
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Billing History</h2>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onDownload={() => console.log('Download invoice', invoice.id)}
                onView={() => console.log('View invoice', invoice.id)}
              />
            ))}
          </div>
        </div>

        {/* Cancel Subscription */}
        <div className="glass-card p-6 border border-error-red/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Cancel Subscription</h3>
              <p className="text-sm text-gray-400 mt-1">
                Your subscription will remain active until the end of the billing period
              </p>
            </div>
            <Touchable
              onTap={() => setShowCancelConfirm(true)}
              hapticFeedback
              className="px-6 py-3 bg-error-red/20 text-error-red rounded-lg hover:bg-error-red/30 transition-colors"
            >
              Cancel Subscription
            </Touchable>
          </div>
        </div>
      </div>

      {/* Plan Change Confirmation Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full p-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">Change Plan</h2>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to switch to the {plans.find(p => p.id === selectedPlan)?.name} plan?
                {plans.find(p => p.id === selectedPlan)?.price > (currentPlan?.price || 0) && (
                  <span className="block mt-2 text-warning-orange">
                    Your next invoice will be prorated.
                  </span>
                )}
              </p>
              <div className="flex items-center space-x-3">
                <Touchable
                  onTap={() => setSelectedPlan(null)}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
                >
                  Cancel
                </Touchable>
                <Touchable
                  onTap={handleConfirmPlanChange}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                >
                  Confirm Change
                </Touchable>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Subscription Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card max-w-md w-full p-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-red/20 flex items-center justify-center">
                <X className="w-8 h-8 text-error-red" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">Cancel Subscription</h2>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
              </p>
              <div className="flex items-center space-x-3">
                <Touchable
                  onTap={() => setShowCancelConfirm(false)}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card transition-colors"
                >
                  Keep Subscription
                </Touchable>
                <Touchable
                  onTap={() => {
                    setShowCancelConfirm(false)
                    // Handle cancellation
                  }}
                  hapticFeedback
                  className="flex-1 px-4 py-3 bg-error-red text-white rounded-xl hover:bg-error-red/80 transition-colors"
                >
                  Yes, Cancel
                </Touchable>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showAddPaymentModal && (
          <AddPaymentMethodModal
            isOpen={showAddPaymentModal}
            onClose={() => setShowAddPaymentModal(false)}
            onAdd={(method) => {
              const newMethod: PaymentMethod = {
                id: Date.now().toString(),
                type: method.type,
                isDefault: paymentMethods.length === 0,
                name: 'New Method',
                ...(method.type === 'card' ? {
                  brand: 'visa',
                  last4: '4242',
                  expiryMonth: 12,
                  expiryYear: 2025
                } : {
                  email: 'user@example.com'
                })
              }
              setPaymentMethods([...paymentMethods, newMethod])
            }}
          />
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to expand</span>
          <span>🤏 Long press for actions</span>
          <span>💳 Add payment methods</span>
        </div>
      </div>
    </div>
  )
}

export default SettingsBillingPage
