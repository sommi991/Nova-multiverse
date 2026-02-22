import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, Zap, Shield, Rocket, Crown, Gem,
  Settings, ShoppingBag, GraduationCap, Users,
  DollarSign, Cloud, Star, Award, Target,
  TrendingUp, Activity, ChevronRight, Search,
  X, Eye, Layout, Code, FileText, HeadphonesIcon
} from 'lucide-react'
import { Touchable } from '../../core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================
interface Niche {
  id: string
  name: string
  tagline: string
  description: string
  longDescription: string
  icon: React.ElementType
  color: {
    primary: string
    secondary: string
    gradient: string
  }
  features: string[]
  pages: number
  components: number
  popularity: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  previewImage: string
  galleryImages: string[]
  path: string
}

// ============================================================================
// NICHE DATA
// ============================================================================
const NICHES: Niche[] = [
  {
    id: 'admin',
    name: 'Admin Dashboard',
    tagline: 'Complete administration panel',
    description: 'Professional admin dashboard with user management, role-based access, real-time analytics, and audit logs.',
    longDescription: 'The ultimate admin dashboard for managing your entire application. Features include user management, role-based access control, real-time analytics, activity logs, notification system, and multi-language support.',
    icon: Settings,
    color: {
      primary: '#8B5CF6',
      secondary: '#3B82F6',
      gradient: 'from-purple-500 via-blue-500 to-cyan-400'
    },
    features: [
      'User Management (CRUD)',
      'Roles & Permissions',
      'Real-time Analytics',
      'Activity Logs',
      'Notification Center',
      'Settings Manager'
    ],
    pages: 21,
    components: 45,
    popularity: 98,
    difficulty: 'intermediate',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop'
    ],
    path: '/admin'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    tagline: 'Complete online store',
    description: 'Full-featured e-commerce solution with product management, inventory tracking, order processing, and sales analytics.',
    longDescription: 'The most complete e-commerce template for building your online store. Features include product management with variants, inventory tracking, order management, customer profiles, shopping cart, coupons, and sales analytics.',
    icon: ShoppingBag,
    color: {
      primary: '#2DD4BF',
      secondary: '#F97316',
      gradient: 'from-teal-500 via-cyan-500 to-emerald-500'
    },
    features: [
      'Product Management',
      'Inventory Tracking',
      'Order Processing',
      'Customer Profiles',
      'Shopping Cart',
      'Sales Analytics'
    ],
    pages: 8,
    components: 25,
    popularity: 95,
    difficulty: 'intermediate',
    previewImage: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&h=400&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop'
    ],
    path: '/ecommerce'
  },
  {
    id: 'education',
    name: 'Education Portal',
    tagline: 'Complete school management',
    description: 'Comprehensive education platform with student management, classes, exams, and parent portal.',
    longDescription: 'The ultimate school management system for educational institutions. Features include student profiles, teacher management, class scheduling, attendance tracking, exam grading, report cards, and parent portal.',
    icon: GraduationCap,
    color: {
      primary: '#3B82F6',
      secondary: '#10B981',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500'
    },
    features: [
      'Student Management',
      'Teacher Profiles',
      'Class Scheduling',
      'Attendance Tracking',
      'Exam Grading',
      'Parent Portal'
    ],
    pages: 20,
    components: 48,
    popularity: 92,
    difficulty: 'advanced',
    previewImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop'
    ],
    path: '/education'
  },
  {
    id: 'crm',
    name: 'CRM System',
    tagline: 'Complete customer management',
    description: 'Professional CRM with leads, pipeline, deals, and team collaboration.',
    longDescription: 'The ultimate CRM for managing your sales pipeline and customer relationships. Features include lead management, pipeline visualization, deal tracking, contact management, task management, and sales forecasting.',
    icon: Users,
    color: {
      primary: '#10B981',
      secondary: '#8B5CF6',
      gradient: 'from-green-500 via-emerald-500 to-teal-400'
    },
    features: [
      'Lead Management',
      'Pipeline Kanban',
      'Deal Tracking',
      'Contact Management',
      'Task Management',
      'Sales Forecasting'
    ],
    pages: 17,
    components: 42,
    popularity: 94,
    difficulty: 'advanced',
    previewImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop'
    ],
    path: '/crm'
  },
  {
    id: 'finance',
    name: 'Finance Dashboard',
    tagline: 'Complete financial management',
    description: 'Professional finance dashboard with transactions, budgets, investments, and forecasting.',
    longDescription: 'The ultimate financial management system for individuals and businesses. Features include transaction management, account tracking, budget planning, investment portfolio, bill reminders, and financial reports.',
    icon: DollarSign,
    color: {
      primary: '#F97316',
      secondary: '#10B981',
      gradient: 'from-orange-500 via-amber-500 to-yellow-400'
    },
    features: [
      'Transaction Management',
      'Account Tracking',
      'Budget Planning',
      'Investment Portfolio',
      'Bill Reminders',
      'Financial Reports'
    ],
    pages: 14,
    components: 38,
    popularity: 91,
    difficulty: 'advanced',
    previewImage: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=800&h=400&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554224154-26032dfc0dbe?w=800&h=400&fit=crop'
    ],
    path: '/finance'
  },
  {
    id: 'saas',
    name: 'SaaS Platform',
    tagline: 'Complete subscription management',
    description: 'Professional SaaS dashboard with subscriptions, billing, usage analytics, and customer management.',
    longDescription: 'The ultimate dashboard for SaaS businesses to manage subscriptions and customers. Features include subscription plans, customer management, billing system, usage analytics, MRR tracking, churn analysis, and support tickets.',
    icon: Cloud,
    color: {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      gradient: 'from-pink-500 via-purple-500 to-indigo-400'
    },
    features: [
      'Subscription Plans',
      'Customer Management',
      'Billing System',
      'Usage Analytics',
      'MRR Tracking',
      'Support Tickets'
    ],
    pages: 17,
    components: 44,
    popularity: 96,
    difficulty: 'advanced',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop'
    ],
    path: '/saas'
  }
]

// ============================================================================
// NICHE CARD
// ============================================================================
interface NicheCardProps {
  niche: Niche
  index: number
  onSelect: (path: string) => void
  onPreview: (niche: Niche) => void
}

const NicheCard: React.FC<NicheCardProps> = ({ niche, index, onSelect, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
      onClick={() => onSelect(niche.path)}
    >
      {niche.popularity > 95 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 z-20"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gold rounded-full blur-md opacity-50 animate-pulse" />
            <div className="relative w-12 h-12 bg-gradient-to-r from-gold to-amber-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      )}

      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${niche.color.primary}20, ${niche.color.secondary}20)`,
        }}
      >
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={niche.previewImage}
            alt={niche.name}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute top-4 left-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${niche.color.primary}, ${niche.color.secondary})`
              }}
            >
              <niche.icon className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="absolute top-4 right-4 glass-card px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-gold fill-current" />
              <span className="text-xs text-white">{niche.popularity}%</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4">
            <h3 className="text-2xl font-bold text-white">{niche.name}</h3>
            <p className="text-sm text-gray-300">{niche.tagline}</p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{niche.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {niche.features.slice(0, 3).map((feature, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-dark-hover text-gray-300 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
            {niche.features.length > 3 && (
              <span className="px-2 py-1 bg-dark-hover text-gray-400 text-xs rounded-full">
                +{niche.features.length - 3}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{niche.pages}</p>
              <p className="text-xs text-gray-400">Pages</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{niche.components}</p>
              <p className="text-xs text-gray-400">Components</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white capitalize">
                {niche.difficulty === 'beginner' ? 'Easy' :
                 niche.difficulty === 'intermediate' ? 'Med' : 'Adv'}
              </p>
              <p className="text-xs text-gray-400">Level</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Touchable
              onTap={(e) => {
                e.stopPropagation()
                onSelect(niche.path)
              }}
              className="flex-1 py-3 rounded-xl text-white font-medium transition-all text-center"
              style={{
                background: `linear-gradient(135deg, ${niche.color.primary}, ${niche.color.secondary})`
              }}
            >
              Launch Niche
            </Touchable>
            <Touchable
              onTap={(e) => {
                e.stopPropagation()
                onPreview(niche)
              }}
              className="p-3 bg-dark-hover rounded-xl hover:bg-dark-card transition-colors"
            >
              <Eye className="w-5 h-5 text-gray-400" />
            </Touchable>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// PREVIEW MODAL
// ============================================================================
interface PreviewModalProps {
  niche: Niche | null
  isOpen: boolean
  onClose: () => void
  onSelect: (path: string) => void
}

const PreviewModal: React.FC<PreviewModalProps> = ({ niche, isOpen, onClose, onSelect }) => {
  const [currentImage, setCurrentImage] = useState(0)

  if (!niche || !isOpen) return null

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
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${niche.color.primary}, ${niche.color.secondary})`
              }}
            >
              <niche.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{niche.name}</h2>
              <p className="text-gray-400">{niche.tagline}</p>
            </div>
          </div>
          <Touchable onTap={onClose} className="p-2 hover:bg-dark-hover rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>

        <div className="relative h-64 rounded-xl overflow-hidden mb-6">
          <img
            src={niche.galleryImages[currentImage]}
            alt={`${niche.name} preview`}
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-gray-300 mb-6">{niche.longDescription}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {niche.features.map((feature, i) => (
            <div key={i} className="flex items-center space-x-2 p-3 bg-dark-hover rounded-lg">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: niche.color.primary }}
              />
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-dark-hover rounded-lg">
            <p className="text-2xl font-bold text-white">{niche.pages}</p>
            <p className="text-sm text-gray-400">Pages</p>
          </div>
          <div className="text-center p-4 bg-dark-hover rounded-lg">
            <p className="text-2xl font-bold text-white">{niche.components}</p>
            <p className="text-sm text-gray-400">Components</p>
          </div>
          <div className="text-center p-4 bg-dark-hover rounded-lg">
            <p className="text-2xl font-bold text-white">{niche.popularity}%</p>
            <p className="text-sm text-gray-400">Popularity</p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Touchable
            onTap={onClose}
            className="px-6 py-3 bg-dark-hover text-gray-300 rounded-xl hover:bg-dark-card"
          >
            Close
          </Touchable>
          <Touchable
            onTap={() => {
              onSelect(niche.path)
              onClose()
            }}
            className="px-6 py-3 text-white rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${niche.color.primary}, ${niche.color.secondary})`
            }}
          >
            Launch {niche.name}
          </Touchable>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// FEATURED NICHE
// ============================================================================
const FeaturedNiche: React.FC<{ niche: Niche; onSelect: (path: string) => void }> = ({
  niche,
  onSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-96 rounded-2xl overflow-hidden mb-12 group"
    >
      <img
        src={niche.previewImage}
        alt={niche.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${niche.color.primary}CC, transparent)`
        }}
      />

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <niche.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-lg font-medium">Featured Niche</span>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">{niche.name}</h2>
            <p className="text-xl text-white/90 mb-6">{niche.description}</p>
            
            <div className="flex items-center space-x-4 mb-8">
              {niche.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>

            <Touchable
              onTap={() => onSelect(niche.path)}
              className="px-8 py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-opacity-90 transition-colors flex items-center space-x-2"
            >
              <span>Explore {niche.name}</span>
              <ChevronRight className="w-5 h-5" />
            </Touchable>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// STATS SECTION
// ============================================================================
const StatsSection = () => {
  const stats = [
    { value: '6', label: 'Complete Niches', icon: Layout },
    { value: '100+', label: 'Pages Total', icon: FileText },
    { value: '250+', label: 'Components', icon: Code },
    { value: '24/7', label: 'Support', icon: HeadphonesIcon }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="text-center"
        >
          <div className="glass-card p-6">
            <stat.icon className="w-8 h-8 text-cosmic-purple mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================================================
// MAIN NICHE SELECTOR
// ============================================================================
export const NicheSelector: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const filteredNiches = NICHES.filter(niche =>
    niche.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    niche.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredNiche = NICHES.find(n => n.popularity > 95) || NICHES[0]

  const handleSelectNiche = (path: string) => {
    navigate(path)
  }

  const handlePreview = (niche: Niche) => {
    setSelectedNiche(niche)
    setShowPreview(true)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/20 via-electric-blue/20 to-neon-cyan/20" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.3), transparent 70%)'
          }} />
          
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cosmic-purple rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * 400,
              }}
              animate={{
                y: [null, -30, 30, -30],
                x: [null, 30, -30, 30],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gray-300">6 Complete SPAs • 100+ Pages • One Template</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Choose Your
            <span className="block bg-gradient-to-r from-cosmic-purple via-electric-blue to-neon-cyan bg-clip-text text-transparent">
              Digital Universe
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-12"
          >
            Select from 6 professionally crafted SPAs, each a complete application with its own pages,
            components, and features. All fully responsive and production-ready.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search niches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-hover border border-dark-border rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-cosmic-purple focus:outline-none"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-20">
        <StatsSection />
        <FeaturedNiche niche={featuredNiche} onSelect={handleSelectNiche} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNiches.map((niche, index) => (
            <NicheCard
              key={niche.id}
              niche={niche}
              index={index}
              onSelect={handleSelectNiche}
              onPreview={handlePreview}
            />
          ))}
        </div>
      </div>

      <PreviewModal
        niche={selectedNiche}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onSelect={handleSelectNiche}
      />
    </div>
  )
}
