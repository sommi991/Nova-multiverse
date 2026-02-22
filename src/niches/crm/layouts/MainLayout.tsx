import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Target, Briefcase,
  Building2, CheckSquare, Calendar, BarChart3,
  Settings, LogOut, Bell, Search, Menu, X,
  ChevronDown, User, HelpCircle, TrendingUp,
  Star, Award, Clock, Phone, Mail
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/crm/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-green-500 to-emerald-500' },
    { path: '/crm/leads', icon: Users, label: 'Leads', color: 'from-blue-500 to-cyan-500' },
    { path: '/crm/deals', icon: Target, label: 'Deals', color: 'from-purple-500 to-pink-500' },
    { path: '/crm/contacts', icon: Briefcase, label: 'Contacts', color: 'from-orange-500 to-red-500' },
    { path: '/crm/companies', icon: Building2, label: 'Companies', color: 'from-yellow-500 to-amber-500' },
    { path: '/crm/tasks', icon: CheckSquare, label: 'Tasks', color: 'from-indigo-500 to-purple-500' },
    { path: '/crm/activities', icon: Clock, label: 'Activities', color: 'from-pink-500 to-rose-500' },
    { path: '/crm/reports', icon: BarChart3, label: 'Reports', color: 'from-green-500 to-teal-500' },
  ]

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 30 }}
        className={`fixed top-0 left-0 z-50 h-full w-72 glass-card border-r border-dark-border overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <Touchable
            onTap={() => window.location.href = '/crm/dashboard'}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-white">NOVA</span>
              <span className="text-xs text-gray-400 block">CRM</span>
            </div>
          </Touchable>
          <Touchable
            onTap={onClose}
            className="lg:hidden p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>

        {/* User Profile Summary */}
        <div className="p-4 border-b border-dark-border">
          <Touchable
            onTap={() => window.location.href = '/crm/settings'}
            className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
              alt="User"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500/50"
            />
            <div className="flex-1">
              <p className="text-white font-medium">Sarah Johnson</p>
              <p className="text-xs text-gray-400">Sales Manager</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Touchable>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Touchable
                key={item.path}
                onTap={() => {
                  window.location.href = item.path
                  if (window.innerWidth < 1024) onClose()
                }}
                hapticFeedback
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Touchable>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border">
          <Touchable
            onTap={() => window.location.href = '/crm/settings'}
            hapticFeedback
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-hover transition-colors mb-2"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </Touchable>
          <Touchable
            onTap={() => window.location.href = '/crm/login'}
            hapticFeedback
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-hover transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </Touchable>
          <p className="text-xs text-gray-500 text-center mt-4">
            NOVA CRM v1.0
          </p>
        </div>
      </motion.aside>
    </>
  )
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { triggerHaptic } = useGestures()

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-dark-border">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Touchable
            onTap={onMenuClick}
            hapticFeedback
            className="lg:hidden p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </Touchable>

          {/* Page title - will be dynamic */}
          <h1 className="text-xl font-bold text-white hidden md:block">CRM Dashboard</h1>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads, contacts, deals..."
              className="w-full bg-dark-hover border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Quick actions */}
          <Touchable
            onTap={() => window.location.href = '/crm/tasks/create'}
            hapticFeedback
            className="hidden md:block px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            + New Task
          </Touchable>

          {/* Notifications */}
          <div className="relative">
            <Touchable
              onTap={() => {
                triggerHaptic([10])
                setShowNotifications(!showNotifications)
              }}
              className="relative p-2 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-red rounded-full" />
            </Touchable>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 glass-card rounded-xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-dark-border">
                    <h4 className="text-white font-medium">Notifications</h4>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                      <Touchable
                        key={i}
                        onTap={() => setShowNotifications(false)}
                        className="w-full p-4 border-b border-dark-border last:border-0 hover:bg-dark-hover transition-colors text-left"
                      >
                        <p className="text-sm text-white">New lead assigned</p>
                        <p className="text-xs text-gray-400 mt-1">John Smith • 2 min ago</p>
                      </Touchable>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative">
            <Touchable
              onTap={() => {
                triggerHaptic([10])
                setShowUserMenu(!showUserMenu)
              }}
              className="flex items-center space-x-2 p-1.5 hover:bg-dark-hover rounded-xl transition-colors"
            >
              <img
                src="https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=150&h=150&fit=crop"
                alt="User"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-green-500/50"
              />
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </Touchable>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden z-50"
                >
                  {[
                    { icon: User, label: 'Profile', path: '/crm/settings' },
                    { icon: Settings, label: 'Settings', path: '/crm/settings' },
                    { icon: HelpCircle, label: 'Help', path: '/crm/help' },
                    { icon: LogOut, label: 'Logout', path: '/crm/login' },
                  ].map((item) => (
                    <Touchable
                      key={item.label}
                      onTap={() => {
                        window.location.href = item.path
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-dark-hover transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </Touchable>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
          />
        </div>
      </div>
    </header>
  )
}

// ============================================================================
// MAIN LAYOUT
// ============================================================================

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="lg:pl-72">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Gesture hint for mobile */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full lg:hidden">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap</span>
          <span>👉 Swipe</span>
          <span>🤏 Long press</span>
        </div>
      </div>
    </div>
  )
}
