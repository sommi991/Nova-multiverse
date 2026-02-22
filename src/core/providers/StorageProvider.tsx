import React, { createContext, useContext } from 'react'

interface StorageContextType {
  getItem: <T>(key: string, defaultValue: T) => T
  setItem: <T>(key: string, value: T) => void
  removeItem: (key: string) => void
  clear: () => void
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getItem = <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const setItem = <T,>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const removeItem = (key: string): void => {
    localStorage.removeItem(key)
  }

  const clear = (): void => {
    localStorage.clear()
  }

  return (
    <StorageContext.Provider value={{ getItem, setItem, removeItem, clear }}>
      {children}
    </StorageContext.Provider>
  )
}

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) throw new Error('useStorage must be used within StorageProvider')
  return context
}
