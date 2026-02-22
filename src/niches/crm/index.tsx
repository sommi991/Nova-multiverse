import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// ============================================================================
// LAYOUTS
// ============================================================================
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'

// ============================================================================
// DASHBOARD
// ============================================================================
import { DashboardPage } from './pages/dashboard/Index'

// ============================================================================
// LEADS (with subpages)
// ============================================================================
import { LeadsListPage } from './pages/leads/List'
import { LeadsCreatePage } from './pages/leads/Create'
import { LeadDetailsPage } from './pages/leads/[id]/Index'
import { LeadEditPage } from './pages/leads/[id]/Edit'
import { LeadActivityPage } from './pages/leads/[id]/Activity'
import { LeadConvertPage } from './pages/leads/[id]/Convert'

// ============================================================================
// DEALS (with subpages)
// ============================================================================
import { DealsPipelinePage } from './pages/deals/Pipeline'
import { DealsListPage } from './pages/deals/List'
import { DealDetailsPage } from './pages/deals/[id]/Index'
import { DealEditPage } from './pages/deals/[id]/Edit'
import { DealTasksPage } from './pages/deals/[id]/Tasks'
import { DealNotesPage } from './pages/deals/[id]/Notes'

// ============================================================================
// CONTACTS (with subpages)
// ============================================================================
import { ContactsListPage } from './pages/contacts/List'
import { ContactDetailsPage } from './pages/contacts/[id]/Index'
import { ContactEditPage } from './pages/contacts/[id]/Edit'
import { ContactDealsPage } from './pages/contacts/[id]/Deals'
import { ContactActivityPage } from './pages/contacts/[id]/Activity'

// ============================================================================
// COMPANIES (with subpages)
// ============================================================================
import { CompaniesListPage } from './pages/companies/List'
import { CompanyDetailsPage } from './pages/companies/[id]/Index'
import { CompanyEditPage } from './pages/companies/[id]/Edit'
import { CompanyContactsPage } from './pages/companies/[id]/Contacts'
import { CompanyDealsPage } from './pages/companies/[id]/Deals'

// ============================================================================
// TASKS (with subpages)
// ============================================================================
import { TasksListPage } from './pages/tasks/List'
import { TasksCreatePage } from './pages/tasks/Create'
import { TasksCalendarPage } from './pages/tasks/Calendar'
import { TaskEditPage } from './pages/tasks/[id]/Edit'

// ============================================================================
// ACTIVITIES
// ============================================================================
import { ActivityTimelinePage } from './pages/activities/Timeline'
import { ActivityCallsPage } from './pages/activities/Calls'
import { ActivityEmailsPage } from './pages/activities/Emails'

// ============================================================================
// REPORTS
// ============================================================================
import { ReportsPage } from './pages/reports/Index'
import { PipelineReportPage } from './pages/reports/Pipeline'
import { PerformanceReportPage } from './pages/reports/Performance'

// ============================================================================
// AUTH
// ============================================================================
import { LoginPage } from './pages/auth/Login'
import { RegisterPage } from './pages/auth/Register'

// ============================================================================
// LOADING COMPONENT
// ============================================================================
const LoadingScreen = () => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white">Loading CRM Dashboard</h2>
    </div>
  </div>
)

// ============================================================================
// MAIN CRM NICHE EXPORT
// ============================================================================
export const CRMNiche: React.FC = () => {
  return (
    <Router basename="/crm">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<MainLayout />}>
            {/* Dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* LEADS - Complete CRUD with subpages */}
            <Route path="leads">
              <Route index element={<LeadsListPage />} />
              <Route path="create" element={<LeadsCreatePage />} />
              
              {/* Lead Subpages */}
              <Route path=":id">
                <Route index element={<LeadDetailsPage />} />
                <Route path="edit" element={<LeadEditPage />} />
                <Route path="activity" element={<LeadActivityPage />} />
                <Route path="convert" element={<LeadConvertPage />} />
              </Route>
            </Route>

            {/* DEALS - Pipeline and List with subpages */}
            <Route path="deals">
              <Route index element={<DealsPipelinePage />} />
              <Route path="list" element={<DealsListPage />} />
              
              {/* Deal Subpages */}
              <Route path=":id">
                <Route index element={<DealDetailsPage />} />
                <Route path="edit" element={<DealEditPage />} />
                <Route path="tasks" element={<DealTasksPage />} />
                <Route path="notes" element={<DealNotesPage />} />
              </Route>
            </Route>

            {/* CONTACTS - Complete contact management */}
            <Route path="contacts">
              <Route index element={<ContactsListPage />} />
              
              {/* Contact Subpages */}
              <Route path=":id">
                <Route index element={<ContactDetailsPage />} />
                <Route path="edit" element={<ContactEditPage />} />
                <Route path="deals" element={<ContactDealsPage />} />
                <Route path="activity" element={<ContactActivityPage />} />
              </Route>
            </Route>

            {/* COMPANIES - B2B company management */}
            <Route path="companies">
              <Route index element={<CompaniesListPage />} />
              
              {/* Company Subpages */}
              <Route path=":id">
                <Route index element={<CompanyDetailsPage />} />
                <Route path="edit" element={<CompanyEditPage />} />
                <Route path="contacts" element={<CompanyContactsPage />} />
                <Route path="deals" element={<CompanyDealsPage />} />
              </Route>
            </Route>

            {/* TASKS - Task management with calendar */}
            <Route path="tasks">
              <Route index element={<TasksListPage />} />
              <Route path="create" element={<TasksCreatePage />} />
              <Route path="calendar" element={<TasksCalendarPage />} />
              
              {/* Task Subpages */}
              <Route path=":id">
                <Route path="edit" element={<TaskEditPage />} />
              </Route>
            </Route>

            {/* ACTIVITIES - Global activity tracking */}
            <Route path="activities">
              <Route index element={<ActivityTimelinePage />} />
              <Route path="calls" element={<ActivityCallsPage />} />
              <Route path="emails" element={<ActivityEmailsPage />} />
            </Route>

            {/* REPORTS - Analytics and forecasting */}
            <Route path="reports">
              <Route index element={<ReportsPage />} />
              <Route path="pipeline" element={<PipelineReportPage />} />
              <Route path="performance" element={<PerformanceReportPage />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default CRMNiche
