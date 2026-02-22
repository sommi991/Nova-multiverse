import React, { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Settings, Activity, Shield,
  BarChart3, FileText, LogOut, Bell, Search,
  Menu, X, ChevronDown, User, HelpCircle,
  Moon, Sun, Grid, Database, Lock, Key
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
  const [isExpanded, setIsExpanded] = useState(true)

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
    { 
      path: '/admin/users', 
      icon: Users, 
      label: 'Users',
      children: [
        { path: '/admin/users', label: 'All Users' },
        { path: '/admin/users/create', label: 'Add User' },
        { path: '/admin/users/roles', label: 'Roles' },
        { path: '/admin/users/permissions', label: 'Permissions' },
      ]
    },
    { path: '/admin/activity/logs', icon: Activity, label: 'Activity' },
    { path: '/admin/system/health', icon: Shield, label: 'System' },
    { path: '/admin/settings/profile', icon: Settings, label: 'Settings' },
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
        className={`fixed top-0 left-0 z-50 h-full w-72 glass-card border-r border-dark-border overflow-hidden flex flex-col ${
          isOpen ? '' : 'lg:translate-x-0 lg:static'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <Touchable
            onTap={() => window.location.href = '/admin/dashboard'}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">AdminHub</span>
          </Touchable>
          <Touchable
            onTap={onClose}
            className="lg:hidden p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <div key={item.path}>
                <Touchable
                  onTap={() => {
                    window.location.href = item.path
                    if (window.innerWidth < 1024) onClose()
                  }}
                  hapticFeedback
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.children && (
                    <Touchable
                      onTap={(e) => {
                        e.stopPropagation()
                        setIsExpanded(!isExpanded)
                      }}
                      className="p-1"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </Touchable>
                  )}
                </Touchable>

                {/* Submenu */}
                <AnimatePresence>
                  {item.children && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 mt-1 space-y-1"
                    >
                      {item.children.map((child) => (
                        <Touchable
                          key={child.path}
                          onTap={() => {
                            window.location.href = child.path
                            if (window.innerWidth < 1024) onClose()
                          }}
                          className={`w-full flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${
                            location.pathname === child.path
                              ? 'text-purple-400 bg-purple-500/10'
                              : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                          }`}
                        >
                          {child.label}
                        </Touchable>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-dark-border">
          <Touchable
            onTap={() => window.location.href = '/admin/settings/profile'}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-dark-hover transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <LogOut className="w-4 h-4 text-gray-400" />
          </Touchable>
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

          {/* Breadcrumbs */}
          <div className="hidden lg:flex items-center space-x-2 text-sm">
            <span className="text-gray-400">Admin</span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white">Dashboard</span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, settings, reports..."
              className="w-full bg-dark-hover border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <Touchable
            onTap={() => {}}
            hapticFeedback
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <Moon className="w-5 h-5 text-gray-400" />
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
                        <p className="text-sm text-white">New user registered</p>
                        <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
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
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
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
                    { icon: User, label: 'Profile', path: '/admin/settings/profile' },
                    { icon: Settings, label: 'Settings', path: '/admin/settings' },
                    { icon: HelpCircle, label: 'Help', path: '/admin/help' },
                    { icon: LogOut, label: 'Logout', path: '/admin/login' },
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
            className="w-full bg-dark-hover border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
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
    </div>
  )
}
