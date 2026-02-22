import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Truck, Package, MapPin, Globe,
  DollarSign, Clock, Plus, Edit, Trash2,
  Save, X, Check, AlertCircle
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface ShippingZone {
  id: string
  name: string
  countries: string[]
  rates: ShippingRate[]
}

interface ShippingRate {
  id: string
  name: string
  price: number
  conditions?: {
    minWeight?: number
    maxWeight?: number
    minPrice?: number
    maxPrice?: number
  }
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ZONES: ShippingZone[] = [
  {
    id: '1',
    name: 'United States',
    countries: ['US'],
    rates: [
      { id: '1', name: 'Standard Shipping', price: 5.99 },
      { id: '2', name: 'Express Shipping', price: 12.99 },
      { id: '3', name: 'Free Shipping', price: 0, conditions: { minPrice: 100 } }
    ]
  },
  {
    id: '2',
    name: 'Canada',
    countries: ['CA'],
    rates: [
      { id: '4', name: 'Standard Shipping', price: 8.99 },
      { id: '5', name: 'Express Shipping', price: 15.99 }
    ]
  },
  {
    id: '3',
    name: 'Europe',
    countries: ['GB', 'FR', 'DE', 'IT', 'ES'],
    rates: [
      { id: '6', name: 'International Standard', price: 14.99 },
      { id: '7', name: 'International Express', price: 24.99 }
    ]
  }
]

// ============================================================================
// SHIPPING ZONE CARD
// ============================================================================

interface ShippingZoneCardProps {
  zone: ShippingZone
  onEdit: () => void
  onDelete: () => void
}

const ShippingZoneCard: React.FC<ShippingZoneCardProps> = ({ zone, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="glass-card p-4">
      <Touchable
        onTap={() => setIsExpanded(!isExpanded)}
        hapticFeedback
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <MapPin className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">{zone.name}</h3>
              <p className="text-sm text-gray-400">{zone.countries.length} countries • {zone.rates.length} rates</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </Touchable>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-dark-border"
          >
            {/* Countries */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-2">Countries</h4>
              <div className="flex flex-wrap gap-2">
                {zone.countries.map((country) => (
                  <span
                    key={country}
                    className="px-3 py-1 bg-dark-hover text-gray-300 rounded-full text-sm"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            {/* Rates */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-2">Shipping Rates</h4>
              <div className="space-y-2">
                {zone.rates.map((rate) => (
                  <div key={rate.id} className="flex items-center justify-between p-2 bg-dark-hover rounded-lg">
                    <div>
                      <p className="text-white text-sm">{rate.name}</p>
                      {rate.conditions?.minPrice && (
                        <p className="text-xs text-gray-400">Free over ${rate.conditions.minPrice}</p>
                      )}
                    </div>
                    <p className="text-white font-bold">${rate.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Touchable
                onTap={onEdit}
                hapticFeedback
                className="flex-1 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-teal-500/20 transition-colors text-center"
              >
                Edit Zone
              </Touchable>
              <Touchable
                onTap={onDelete}
                hapticFeedback
                className="p-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-error-red/20 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </Touchable>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// ADD ZONE MODAL
// ============================================================================

interface AddZoneModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (zone: any) => void
}

const AddZoneModal: React.FC<AddZoneModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [zoneName, setZoneName] = useState('')
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  if (!isOpen) return null

  const countries = [
    'US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES', 'AU', 'JP', 'CN'
  ]

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    )
  }

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
        <h2 className="text-xl font-bold text-white mb-4">Add Shipping Zone</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Zone Name</label>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="e.g., North America"
              className="w-full bg-dark-hover border border-dark-border rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Countries</label>
            <div className="grid grid-cols-3 gap-2">
              {countries.map((country) => (
                <Touchable
                  key={country}
                  onTap={() => toggleCountry(country)}
                  hapticFeedback
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    selectedCountries.includes(country)
                      ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                      : 'border-dark-border bg-dark-hover text-gray-400'
                  }`}
                >
                  {country}
                </Touchable>
              ))}
            </div>
          </div>
        </div>

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
              onAdd({ name: zoneName, countries: selectedCountries })
              onClose()
            }}
            hapticFeedback
            className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
          >
            Add Zone
          </Touchable>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// MAIN SHIPPING SETTINGS PAGE
// ============================================================================

export const ShippingSettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const [zones, setZones] = useState(MOCK_ZONES)
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Touchable
            onTap={() => navigate('/ecommerce/settings')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </Touchable>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Shipping Settings</h1>
            <p className="text-gray-400 text-sm mt-1">Configure shipping zones and rates</p>
          </div>
        </div>

        <Touchable
          onTap={() => setShowAddModal(true)}
          hapticFeedback
          className="px-4 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Zone</span>
        </Touchable>
      </div>

      {/* Shipping Zones */}
      <div className="space-y-4">
        {zones.map((zone) => (
          <ShippingZoneCard
            key={zone.id}
            zone={zone}
            onEdit={() => console.log('Edit zone', zone.id)}
            onDelete={() => setZones(zones.filter(z => z.id !== zone.id))}
          />
        ))}
      </div>

      {/* Add Zone Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddZoneModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={(newZone) => {
              const zone: ShippingZone = {
                id: Date.now().toString(),
                name: newZone.name,
                countries: newZone.countries,
                rates: []
              }
              setZones([...zones, zone])
            }}
          />
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap to expand</span>
          <span>➕ Add zones</span>
          <span>🌍 Worldwide shipping</span>
        </div>
      </div>
    </div>
  )
}

// Helper components
const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
