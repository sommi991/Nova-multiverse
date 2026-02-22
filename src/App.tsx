import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

// ============================================================================
// CORE PROVIDERS
// ============================================================================
import { GestureProvider } from './core/providers/GestureProvider'
import { ThemeProvider } from './core/providers/ThemeProvider'
import { AuthProvider } from './core/providers/AuthProvider'
import { NotificationProvider } from './core/providers/NotificationProvider'
import { I18nProvider } from './core/providers/I18nProvider'
import { AnalyticsProvider } from './core/providers/AnalyticsProvider'
import { StorageProvider } from './core/providers/StorageProvider'
import { ErrorBoundaryProvider } from './core/providers/ErrorBoundaryProvider'

// ============================================================================
// NICHE SELECTOR
// ============================================================================
import { NicheSelector } from './pages/niche-selector/index'

// ============================================================================
// LAZY LOAD ALL NICHES
// ============================================================================
const AdminNiche = lazy(() => import('@niches/admin-dashboard'))
const EcommerceNiche = lazy(() => import('@niches/ecommerce'))
const EducationNiche = lazy(() => import('@niches/education'))
const CRMNiche = lazy(() => import('@niches/crm'))
const FinanceNiche = lazy(() => import('@niches/finance'))
const SaasNiche = lazy(() => import('@niches/saas'))

// ============================================================================
// LOADING COMPONENTS
// ============================================================================
const LoadingScreen = () => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="w-24 h-24 mx-auto mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple via-electric-blue to-neon-cyan rounded-full blur-xl opacity-50" />
        <div className="relative w-full h-full bg-gradient-to-r from-cosmic-purple to-electric-blue rounded-full flex items-center justify-center">
          <span className="text-4xl font-bold text-white">N</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white mb-4"
      >
        NOVA Multiverse
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 mb-8"
      >
        6 Complete SPAs • 100+ Pages • Infinite Possibilities
      </motion.p>

      <div className="w-64 h-2 bg-dark-card rounded-full overflow-hidden mx-auto">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-cosmic-purple via-electric-blue to-neon-cyan"
        />
      </div>
    </div>
  </div>
)

const NicheLoadingScreen = ({ nicheName }: { nicheName: string }) => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-cosmic-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Loading {nicheName}</h2>
      <p className="text-gray-400">Preparing your dashboard...</p>
    </div>
  </div>
)

// ============================================================================
// PAGE TRANSITION
// ============================================================================
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// QUICK NICHE SWITCHER
// ============================================================================
const QuickNicheSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const niches = [
    { path: '/', name: 'Niche Selector', icon: '🏠', color: 'from-gray-500 to-gray-600' },
    { path: '/admin', name: 'Admin', icon: '📊', color: 'from-purple-500 to-pink-500' },
    { path: '/ecommerce', name: 'E-Commerce', icon: '🛍️', color: 'from-teal-500 to-cyan-500' },
    { path: '/education', name: 'Education', icon: '🎓', color: 'from-blue-500 to-indigo-500' },
    { path: '/crm', name: 'CRM', icon: '💼', color: 'from-green-500 to-emerald-500' },
    { path: '/finance', name: 'Finance', icon: '💰', color: 'from-orange-500 to-red-500' },
    { path: '/saas', name: 'SaaS', icon: '☁️', color: 'from-pink-500 to-rose-500' },
  ]

  if (location.pathname === '/') return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-cosmic-purple to-electric-blue rounded-full shadow-2xl flex items-center justify-center"
      >
        <span className="text-2xl">🚀</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-4 glass-card rounded-2xl overflow-hidden min-w-[200px]"
          >
            <div className="p-3 border-b border-dark-border">
              <h4 className="text-sm font-medium text-white">Quick Switch</h4>
            </div>
            <div className="p-2">
              {niches.map((niche) => (
                <a
                  key={niche.path}
                  href={niche.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    location.pathname.startsWith(niche.path) && niche.path !== '/'
                      ? 'bg-cosmic-purple/20 text-cosmic-purple'
                      : 'hover:bg-dark-hover text-gray-300'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">{niche.icon}</span>
                  <span className="text-sm">{niche.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// MAIN APP
// ============================================================================
function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial load
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ErrorBoundaryProvider>
      <BrowserRouter>
        <ThemeProvider>
          <GestureProvider>
            <StorageProvider>
              <AuthProvider>
                <NotificationProvider>
                  <I18nProvider>
                    <AnalyticsProvider>
                      <Toaster
                        position="top-right"
                        toastOptions={{
                          duration: 4000,
                          style: {
                            background: '#1A1A24',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px'
                          }
                        }}
                      />

                      <PageTransition>
                        <Routes>
                          {/* Niche Selector */}
                          <Route path="/" element={<NicheSelector />} />

                          {/* Admin Dashboard */}
                          <Route
                            path="/admin/*"
                            element={
                              <Suspense fallback={<NicheLoadingScreen nicheName="Admin Dashboard" />}>
                                <AdminNiche />
                              </Suspense>
                            }
                          />

                          {/* E-Commerce */}
                          <Route
                            path="/ecommerce/*"
                            element={
                              <Suspense fallback={<NicheLoadingScreen nicheName="E-Commerce" />}>
                                <EcommerceNiche />
                              </Suspense>
                            }
                          />

                          {/* Education */}
                          <Route
                            path="/education/*"
                            element={
                              <Suspense fallback={<NicheLoadingScreen nicheName="Education Portal" />}>
                                <EducationNiche />
                              </Suspense>
                            }
                          />

                          {/* CRM */}
                          <Route
                            path="/crm/*"
                            element={
                              <Suspense fallback={<NicheLoadingScreen nicheName="CRM System" />}>
                                <CRMNiche />
                              </Suspense>
                            }
                          />

                          {/* Finance */}
                          <Route
                            path="/finance/*"
                            element={
                              <Suspense fallback={<NicheLoadingScreen nicheName="Finance Dashboard" />}>
                                <FinanceNiche />
                              </Suspense>
                            }
                          />

                          {/* SaaS */}
                          <Route
                            path="/saas/*"
                            element={
                              <Suspense fallback={<NicheLoadingScreen nicheName="SaaS Platform" />}>
                                <SaasNiche />
                              </Suspense>
                            }
                          />

                          {/* 404 */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </PageTransition>

                      <QuickNicheSwitcher />
                    </AnalyticsProvider>
                  </I18nProvider>
                </NotificationProvider>
              </AuthProvider>
            </StorageProvider>
          </GestureProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundaryProvider>
  )
}

export default App
