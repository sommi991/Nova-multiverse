import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// ============================================================================
// LAYOUTS
// ============================================================================
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'

// ============================================================================
// DASHBOARD PAGES
// ============================================================================
import { DashboardPage } from './pages/dashboard/Index'

// ============================================================================
// PRODUCTS PAGES (with subpages)
// ============================================================================
import { ProductsListPage } from './pages/products/List'
import { ProductsCreatePage } from './pages/products/Create'
import { ProductsCategoriesPage } from './pages/products/Categories'
import { ProductDetailsPage } from './pages/products/[id]/Index'
import { ProductEditPage } from './pages/products/[id]/Edit'
import { ProductReviewsPage } from './pages/products/[id]/Reviews'

// ============================================================================
// ORDERS PAGES (with subpages)
// ============================================================================
import { OrdersListPage } from './pages/orders/List'
import { OrderDetailsPage } from './pages/orders/[id]/Index'
import { OrderInvoicePage } from './pages/orders/[id]/Invoice'
import { OrderTrackingPage } from './pages/orders/[id]/Tracking'

// ============================================================================
// CUSTOMERS PAGES (with subpages)
// ============================================================================
import { CustomersListPage } from './pages/customers/List'
import { CustomerProfilePage } from './pages/customers/[id]/Index'
import { CustomerOrdersPage } from './pages/customers/[id]/Orders'
import { CustomerActivityPage } from './pages/customers/[id]/Activity'

// ============================================================================
// INVENTORY PAGES (with subpages)
// ============================================================================
import { InventoryPage } from './pages/inventory/Index'
import { LowStockPage } from './pages/inventory/LowStock'
import { StockMovementsPage } from './pages/inventory/Movements'

// ============================================================================
// REPORTS PAGES (with subpages)
// ============================================================================
import { ReportsPage } from './pages/reports/Index'
import { SalesReportsPage } from './pages/reports/Sales'
import { AnalyticsPage } from './pages/reports/Analytics'

// ============================================================================
// SETTINGS PAGES (with subpages)
// ============================================================================
import { SettingsPage } from './pages/settings/Index'
import { ShippingSettingsPage } from './pages/settings/Shipping'
import { PaymentSettingsPage } from './pages/settings/Payments'
import { TaxSettingsPage } from './pages/settings/Taxes'

// ============================================================================
// AUTH PAGES
// ============================================================================
import { LoginPage } from './pages/auth/Login'
import { RegisterPage } from './pages/auth/Register'

// ============================================================================
// LOADING COMPONENT
// ============================================================================
const LoadingScreen = () => (
  <div className="min-h-screen bg-dark-bg flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white">Loading E-Commerce Dashboard</h2>
    </div>
  </div>
)

// ============================================================================
// MAIN E-COMMERCE NICHE EXPORT
// ============================================================================
export const EcommerceNiche: React.FC = () => {
  return (
    <Router basename="/ecommerce">
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

            {/* PRODUCTS - Main Pages */}
            <Route path="products">
              <Route index element={<ProductsListPage />} />
              <Route path="create" element={<ProductsCreatePage />} />
              <Route path="categories" element={<ProductsCategoriesPage />} />
              
              {/* Product Subpages */}
              <Route path=":id">
                <Route index element={<ProductDetailsPage />} />
                <Route path="edit" element={<ProductEditPage />} />
                <Route path="reviews" element={<ProductReviewsPage />} />
              </Route>
            </Route>

            {/* ORDERS - Main Pages */}
            <Route path="orders">
              <Route index element={<OrdersListPage />} />
              
              {/* Order Subpages */}
              <Route path=":id">
                <Route index element={<OrderDetailsPage />} />
                <Route path="invoice" element={<OrderInvoicePage />} />
                <Route path="tracking" element={<OrderTrackingPage />} />
              </Route>
            </Route>

            {/* CUSTOMERS - Main Pages */}
            <Route path="customers">
              <Route index element={<CustomersListPage />} />
              
              {/* Customer Subpages */}
              <Route path=":id">
                <Route index element={<CustomerProfilePage />} />
                <Route path="orders" element={<CustomerOrdersPage />} />
                <Route path="activity" element={<CustomerActivityPage />} />
              </Route>
            </Route>

            {/* INVENTORY - Main Pages */}
            <Route path="inventory">
              <Route index element={<InventoryPage />} />
              <Route path="low-stock" element={<LowStockPage />} />
              <Route path="movements" element={<StockMovementsPage />} />
            </Route>

            {/* REPORTS - Main Pages */}
            <Route path="reports">
              <Route index element={<ReportsPage />} />
              <Route path="sales" element={<SalesReportsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

            {/* SETTINGS - Main Pages */}
            <Route path="settings">
              <Route index element={<SettingsPage />} />
              <Route path="shipping" element={<ShippingSettingsPage />} />
              <Route path="payments" element={<PaymentSettingsPage />} />
              <Route path="taxes" element={<TaxSettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default EcommerceNiche
