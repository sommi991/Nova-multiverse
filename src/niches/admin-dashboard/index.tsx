import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// ============================================================================
// PROVIDERS
// ============================================================================
import { AdminThemeProvider } from './providers/AdminThemeProvider'
import { AdminDataProvider } from './providers/AdminDataProvider'

// ============================================================================
// LAYOUTS
// ============================================================================
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { SettingsLayout } from './layouts/SettingsLayout'

// ============================================================================
// PAGES - AUTH
// ============================================================================
import { LoginPage } from './pages/auth/Login'
import { RegisterPage } from './pages/auth/Register'
import { ForgotPasswordPage } from './pages/auth/ForgotPassword'
import { ResetPasswordPage } from './pages/auth/ResetPassword'

// ============================================================================
// PAGES - DASHBOARD
// ============================================================================
import { DashboardPage } from './pages/dashboard/Index'
import { AnalyticsPage } from './pages/dashboard/Analytics'
import { ReportsPage } from './pages/dashboard/Reports'

// ============================================================================
// PAGES - USERS (FULL CRUD)
// ============================================================================
import { UsersListPage } from './pages/users/List'
import { UsersCreatePage } from './pages/users/Create'
import { UsersEditPage } from './pages/users/Edit'
import { UsersViewPage } from './pages/users/View'
import { UsersPermissionsPage } from './pages/users/Permissions'
import { UsersRolesPage } from './pages/users/Roles'

// ============================================================================
// PAGES - SETTINGS (MULTI-PAGE)
// ============================================================================
import { SettingsProfilePage } from './pages/settings/Profile'
import { SettingsSecurityPage } from './pages/settings/Security'
import { SettingsNotificationsPage } from './pages/settings/Notifications'
import { SettingsTeamPage } from './pages/settings/Team'
import { SettingsBillingPage } from './pages/settings/Billing'
import { SettingsApiPage } from './pages/settings/Api'
import { SettingsPreferencesPage } from './pages/settings/Preferences'

// ============================================================================
// PAGES - ACTIVITY
// ============================================================================
import { ActivityLogsPage } from './pages/activity/Logs'
import { ActivityAuditPage } from './pages/activity/Audit'

// ============================================================================
// PAGES - SYSTEM
// ============================================================================
import { SystemHealthPage } from './pages/system/Health'
import { SystemBackupPage } from './pages/system/Backup'
import { SystemLogsPage } from './pages/system/Logs'

// ============================================================================
// COMPONENTS
// ============================================================================
import { LoadingScreen } from './components/common/LoadingScreen'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// ============================================================================
// ADMIN DASHBOARD SPA - COMPLETE STANDALONE APPLICATION
// ============================================================================

export const AdminDashboardNiche: React.FC = () => {
  return (
    <ErrorBoundary>
      <AdminThemeProvider>
        <AdminDataProvider>
          <Router basename="/admin">
            <AnimatePresence mode="wait">
              <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                <Route element={<AuthLayout />}>
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />
                </Route>

                {/* ===== PROTECTED ROUTES ===== */}
                <Route element={<MainLayout />}>
                  {/* Dashboard */}
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="reports" element={<ReportsPage />} />

                  {/* Users Module - Full CRUD */}
                  <Route path="users">
                    <Route index element={<UsersListPage />} />
                    <Route path="create" element={<UsersCreatePage />} />
                    <Route path=":id" element={<UsersViewPage />} />
                    <Route path=":id/edit" element={<UsersEditPage />} />
                    <Route path="roles" element={<UsersRolesPage />} />
                    <Route path="permissions" element={<UsersPermissionsPage />} />
                  </Route>

                  {/* Settings Module - Multi-page */}
                  <Route path="settings" element={<SettingsLayout />}>
                    <Route index element={<Navigate to="profile" replace />} />
                    <Route path="profile" element={<SettingsProfilePage />} />
                    <Route path="security" element={<SettingsSecurityPage />} />
                    <Route path="notifications" element={<SettingsNotificationsPage />} />
                    <Route path="team" element={<SettingsTeamPage />} />
                    <Route path="billing" element={<SettingsBillingPage />} />
                    <Route path="api" element={<SettingsApiPage />} />
                    <Route path="preferences" element={<SettingsPreferencesPage />} />
                  </Route>

                  {/* Activity Module */}
                  <Route path="activity">
                    <Route index element={<Navigate to="logs" replace />} />
                    <Route path="logs" element={<ActivityLogsPage />} />
                    <Route path="audit" element={<ActivityAuditPage />} />
                  </Route>

                  {/* System Module */}
                  <Route path="system">
                    <Route index element={<Navigate to="health" replace />} />
                    <Route path="health" element={<SystemHealthPage />} />
                    <Route path="backup" element={<SystemBackupPage />} />
                    <Route path="logs" element={<SystemLogsPage />} />
                  </Route>
                </Route>

                {/* 404 - Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AnimatePresence>
          </Router>
        </AdminDataProvider>
      </AdminThemeProvider>
    </ErrorBoundary>
  )
}

// ============================================================================
// NOT FOUND PAGE
// ============================================================================

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cosmic-purple/20 flex items-center justify-center">
          <span className="text-6xl">404</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <a
          href="/admin/dashboard"
          className="inline-block px-6 py-3 bg-cosmic-purple text-white rounded-xl hover:bg-electric-blue transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}

// ============================================================================
// EXPORT ALL PAGES FOR EASY ACCESS
// ============================================================================

export * from './pages/dashboard/Index'
export * from './pages/users/List'
export * from './pages/settings/Profile'

export default AdminDashboardNiche
