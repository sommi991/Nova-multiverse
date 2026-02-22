import React, { createContext, useContext, useState } from 'react'

type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja' | 'zh' | 'ar'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  direction: 'ltr' | 'rtl'
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'welcome': 'Welcome',
    'dashboard': 'Dashboard',
    'products': 'Products',
    'orders': 'Orders',
    'customers': 'Customers'
  },
  es: {
    'welcome': 'Bienvenido',
    'dashboard': 'Panel',
    'products': 'Productos',
    'orders': 'Pedidos',
    'customers': 'Clientes'
  },
  fr: {
    'welcome': 'Bienvenue',
    'dashboard': 'Tableau de bord',
    'products': 'Produits',
    'orders': 'Commandes',
    'customers': 'Clients'
  },
  de: {
    'welcome': 'Willkommen',
    'dashboard': 'Dashboard',
    'products': 'Produkte',
    'orders': 'Bestellungen',
    'customers': 'Kunden'
  },
  it: {
    'welcome': 'Benvenuto',
    'dashboard': 'Cruscotto',
    'products': 'Prodotti',
    'orders': 'Ordini',
    'customers': 'Clienti'
  },
  pt: {
    'welcome': 'Bem-vindo',
    'dashboard': 'Painel',
    'products': 'Produtos',
    'orders': 'Pedidos',
    'customers': 'Clientes'
  },
  ru: {
    'welcome': 'Добро пожаловать',
    'dashboard': 'Панель управления',
    'products': 'Товары',
    'orders': 'Заказы',
    'customers': 'Клиенты'
  },
  ja: {
    'welcome': 'ようこそ',
    'dashboard': 'ダッシュボード',
    'products': '製品',
    'orders': '注文',
    'customers': '顧客'
  },
  zh: {
    'welcome': '欢迎',
    'dashboard': '仪表板',
    'products': '产品',
    'orders': '订单',
    'customers': '客户'
  },
  ar: {
    'welcome': 'مرحبا',
    'dashboard': 'لوحة القيادة',
    'products': 'منتجات',
    'orders': 'طلبات',
    'customers': 'عملاء'
  }
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const direction = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, direction }}>
      <div dir={direction}>
        {children}
      </div>
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
