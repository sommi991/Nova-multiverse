import React, { createContext, useContext } from 'react'

interface AnalyticsContextType {
  trackEvent: (event: string, data?: any) => void
  trackPage: (page: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const trackEvent = (event: string, data?: any) => {
    console.log('Track event:', event, data)
    // In production, send to your analytics service
  }

  const trackPage = (page: string) => {
    console.log('Track page:', page)
    // In production, send to your analytics service
  }

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPage }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (!context) throw new Error('useAnalytics must be used within AnalyticsProvider')
  return context
}
