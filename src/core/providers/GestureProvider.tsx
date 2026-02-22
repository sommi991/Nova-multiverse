import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'

export type GestureType = 'tap' | 'doubleTap' | 'longPress' | 'swipe' | 'pinch' | 'rotate' | 'pan'
export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

export interface GestureConfig {
  enabled: boolean
  hapticFeedback: boolean
  visualFeedback: boolean
  swipeThreshold: number
  longPressDelay: number
  doubleTapDelay: number
}

const DEFAULT_CONFIG: GestureConfig = {
  enabled: true,
  hapticFeedback: true,
  visualFeedback: true,
  swipeThreshold: 50,
  longPressDelay: 500,
  doubleTapDelay: 300
}

interface GestureContextType {
  isGesturing: boolean
  currentGesture: GestureType | null
  triggerHaptic: (pattern?: number[]) => void
  showFeedback: (type: GestureType, position?: { x: number; y: number }) => void
  config: GestureConfig
}

const GestureContext = createContext<GestureContextType | undefined>(undefined)

export const GestureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGesturing, setIsGesturing] = useState(false)
  const [currentGesture, setCurrentGesture] = useState<GestureType | null>(null)
  const [config] = useState(DEFAULT_CONFIG)

  const feedbackX = useMotionValue(0)
  const feedbackY = useMotionValue(0)
  const feedbackScale = useMotionValue(1)
  const feedbackOpacity = useMotionValue(0)

  const springX = useSpring(feedbackX, { damping: 20, stiffness: 300 })
  const springY = useSpring(feedbackY, { damping: 20, stiffness: 300 })
  const springScale = useSpring(feedbackScale, { damping: 20, stiffness: 300 })
  const springOpacity = useSpring(feedbackOpacity, { damping: 20, stiffness: 300 })

  const triggerHaptic = useCallback((pattern?: number[]) => {
    if (config.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(pattern || [10])
    }
  }, [config.hapticFeedback])

  const showFeedback = useCallback((type: GestureType, position?: { x: number; y: number }) => {
    if (!config.visualFeedback) return
    if (position) {
      feedbackX.set(position.x)
      feedbackY.set(position.y)
    }
    feedbackOpacity.set(1)
    feedbackScale.set(1.2)
    setTimeout(() => feedbackOpacity.set(0), 300)
    setTimeout(() => feedbackScale.set(1), 200)
  }, [config.visualFeedback])

  return (
    <GestureContext.Provider
      value={{
        isGesturing,
        currentGesture,
        triggerHaptic,
        showFeedback,
        config
      }}
    >
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          scale: springScale,
          opacity: springOpacity,
          translateX: '-50%',
          translateY: '-50%'
        }}
      >
        <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center">
          <span className="text-2xl">👆</span>
        </div>
      </motion.div>

      {children}
    </GestureContext.Provider>
  )
}

export const useGestures = () => {
  const context = useContext(GestureContext)
  if (!context) throw new Error('useGestures must be used within GestureProvider')
  return context
}

export interface WithGesturesProps {
  onTap?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  onSwipe?: (direction: SwipeDirection) => void
  hapticFeedback?: boolean
}

export const Touchable: React.FC<{
  children: React.ReactNode
  className?: string
  onTap?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  onSwipe?: (direction: SwipeDirection) => void
  hapticFeedback?: boolean
  scaleOnTap?: boolean
}> = ({
  children,
  className = '',
  onTap,
  onDoubleTap,
  onLongPress,
  onSwipe,
  hapticFeedback = true,
  scaleOnTap = true
}) => {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <motion.div
      className={`cursor-pointer select-none touch-manipulation ${className}`}
      animate={{
        scale: isPressed && scaleOnTap ? 0.98 : 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      whileHover={{ scale: 1.02 }}
      onTap={onTap}
      onDoubleClick={onDoubleTap}
      onContextMenu={(e) => {
        e.preventDefault()
        onLongPress?.()
      }}
    >
      {children}
    </motion.div>
  )
}
