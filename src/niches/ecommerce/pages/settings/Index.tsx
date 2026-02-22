import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Store, Truck, CreditCard, Percent,
  Globe, Mail, Bell, Shield, Key, Save,
  ChevronRight, Camera, Upload, X, Check
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'

// ============================================================================
// SETTINGS SECTION COMPONENT
// ============================================================================

interface SettingsSectionProps {
  icon: React.ElementType
  title: string
  description: string
  color: string
  to: string
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  icon: Icon,
  title,
  description,
  color,
  to
}) => {
  return (
    <Touchable
      onTap={() => window.location.href = to}
      hapticFeedback
      className="glass-card p-4 hover:scale-105 transition-transform"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Touchable>
  )
}

// ============================================================================
// STORE INFO FORM
// ============================================================================

const StoreInfoForm: React.FC = () => {
  const [storeName, setStoreName] = useState('NOVA Store')
  const [storeEmail, setStoreEmail] = useState('store@nova.com')
  const [storePhone, setStorePhone] = useState('+1 (555) 123-4567')
  const [storeAddress, setStoreAddress] = useState('123 Market St, San Francisco, CA 94105')
  const [currency, setCurrency] = useState('USD')
  const [timezone, setTimezone] = useState('America/Los_Angeles')

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
            <Store className="w-12 h-12 text-white" />
          </div>
          <Touchable
            onTap={() => console.log('Upload logo')}
            hapticFeedback
            className="absolute -bottom-2 -right-2 p-2 bg-dark-hover rounded-full hover:bg-teal-500/20 transition-colors"
          >
            <Camera className="w-4 h-4 text-gray-400" />
          </Touchable>
        </div>
        <div>
          <p className="text-white font-medium">Store Logo</p>
          <p className="text-sm text-gray-400">Recommended size: 200x200px</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Store Email</label>
          <input
            type="email"
            value={storeEmail}
            onChange={(e) => setStoreEmail(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Store Phone</label>
          <input
            type="tel"
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 mb-2">Store Address</label>
          <input
            type="text"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-400 mb-2">Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
          >
            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
            <option value="America/Denver">Mountain Time (US & Canada)</option>
            <option value="America/Chicago">Central Time (US & Canada)</option>
            <option value="America/New_York">Eastern Time (US & Canada)</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Touchable
          onTap={() => console.log('Save store info')}
          hapticFeedback
          className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Changes</span>
        </Touchable>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')

  const sections = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'taxes', label: 'Taxes', icon: Percent },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Store Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your store preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map((section) => (
            <Touchable
              key={section.id}
              onTap={() => setActiveTab(section.id)}
              hapticFeedback
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === section.id
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{section.label}</span>
            </Touchable>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            {activeTab === 'general' && <StoreInfoForm />}
            {activeTab === 'shipping' && (
              <div className="text-center py-12 text-gray-400">
                <Truck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Shipping settings coming soon...</p>
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="text-center py-12 text-gray-400">
                <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Payment settings coming soon...</p>
              </div>
            )}
            {activeTab === 'taxes' && (
              <div className="text-center py-12 text-gray-400">
                <Percent className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Tax settings coming soon...</p>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div className="text-center py-12 text-gray-400">
                <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Notification settings coming soon...</p>
              </div>
            )}
            {activeTab === 'security' && (
              <div className="text-center py-12 text-gray-400">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Security settings coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to navigate</span>
          <span>⚙️ Configure store</span>
          <span>💾 Auto-save</span>
        </div>
      </div>
    </div>
  )
}
