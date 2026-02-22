import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Plus, Filter, Download, RefreshCw, Clock,
  AlertCircle, CheckCircle, XCircle, User,
  Tag, MoreVertical, Edit, Trash2, X
} from 'lucide-react'
import { Touchable } from '@core/providers/GestureProvider'
import { useGestures } from '@core/providers/GestureProvider'

// ============================================================================
// TYPES
// ============================================================================

interface CalendarTask {
  id: string
  title: string
  date: string
  time: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed'
  assignee: {
    name: string
    avatar: string
  }
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CALENDAR_TASKS: CalendarTask[] = [
  {
    id: '1',
    title: 'Call John Smith',
    date: '2024-03-16',
    time: '10:00 AM',
    priority: 'high',
    status: 'pending',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    }
  },
  {
    id: '2',
    title: 'Send proposal to TechCorp',
    date: '2024-03-15',
    time: '5:00 PM',
    priority: 'high',
    status: 'in-progress',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    }
  },
  {
    id: '3',
    title: 'Demo with Startup.io',
    date: '2024-03-17',
    time: '2:00 PM',
    priority: 'medium',
    status: 'pending',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    }
  },
  {
    id: '4',
    title: 'Quarterly review',
    date: '2024-03-18',
    time: '3:00 PM',
    priority: 'medium',
    status: 'pending',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-7669c5f07f99?w=100&h=100&fit=crop'
    }
  }
]

// ============================================================================
// CALENDAR DAY COMPONENT
// ============================================================================

interface CalendarDayProps {
  day: number
  month: number
  year: number
  isCurrentMonth: boolean
  tasks: CalendarTask[]
  onDayClick: (date: string) => void
  onTaskClick: (task: CalendarTask) => void
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  month,
  year,
  isCurrentMonth,
  tasks,
  onDayClick,
  onTaskClick
}) => {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <Touchable
      onTap={() => onDayClick(dateStr)}
      hapticFeedback
      className={`min-h-[100px] p-2 border border-dark-border rounded-lg transition-colors ${
        isCurrentMonth ? 'bg-dark-hover' : 'bg-dark-card opacity-50'
      } hover:bg-green-500/10`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-medium ${isCurrentMonth ? 'text-white' : 'text-gray-600'}`}>
          {day}
        </span>
        {tasks.length > 0 && (
          <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
            {tasks.length}
          </span>
        )}
      </div>

      <div className="space-y-1">
        {tasks.slice(0, 2).map((task) => (
          <Touchable
            key={task.id}
            onTap={(e) => {
              e.stopPropagation()
              onTaskClick(task)
            }}
            hapticFeedback
            className={`p-1 rounded text-xs truncate ${
              task.priority === 'high' ? 'bg-error-red/20 text-error-red' :
              task.priority === 'medium' ? 'bg-warning-orange/20 text-warning-orange' :
              'bg-success-green/20 text-success-green'
            }`}
          >
            {task.time} - {task.title}
          </Touchable>
        ))}
        {tasks.length > 2 && (
          <div className="text-xs text-gray-400 pl-1">
            +{tasks.length - 2} more
          </div>
        )}
      </div>
    </Touchable>
  )
}

// ============================================================================
// TASK DETAILS MODAL
// ============================================================================

interface TaskDetailsModalProps {
  task: CalendarTask | null
  isOpen: boolean
  onClose: () => void
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, isOpen, onClose }) => {
  if (!task || !isOpen) return null

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
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{task.title}</h2>
          <Touchable onTap={onClose} hapticFeedback className="p-1 hover:bg-dark-hover rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-300">{task.date} at {task.time}</span>
          </div>

          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <div className="flex items-center space-x-2">
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-gray-300">{task.assignee.name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-gray-500" />
            <span className={`px-2 py-1 text-xs rounded-full ${
              task.priority === 'high' ? 'bg-error-red/10 text-error-red' :
              task.priority === 'medium' ? 'bg-warning-orange/10 text-warning-orange' :
              'bg-success-green/10 text-success-green'
            }`}>
              {task.priority} priority
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-gray-500" />
            <span className={`px-2 py-1 text-xs rounded-full ${
              task.status === 'completed' ? 'bg-success-green/10 text-success-green' :
              'bg-warning-orange/10 text-warning-orange'
            }`}>
              {task.status}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-6">
          <Touchable
            onTap={() => {
              window.location.href = `/crm/tasks/${task.id}/edit`
              onClose()
            }}
            hapticFeedback
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
          >
            Edit Task
          </Touchable>
          <Touchable
            onTap={onClose}
            hapticFeedback
            className="flex-1 px-4 py-2 bg-dark-hover text-gray-300 rounded-lg hover:bg-dark-card transition-colors text-center"
          >
            Close
          </Touchable>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// MAIN TASK CALENDAR PAGE
// ============================================================================

export const TasksCalendarPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Get tasks for a specific date
  const getTasksForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return MOCK_CALENDAR_TASKS.filter(task => task.date === dateStr)
  }

  const handleDayClick = (date: string) => {
    console.log('Day clicked:', date)
  }

  const handleTaskClick = (task: CalendarTask) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Touchable
            onTap={() => navigate('/crm/tasks')}
            hapticFeedback
            className="p-2 glass-card hover:bg-dark-hover rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </Touchable>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Task Calendar</h1>
            <p className="text-gray-400 text-sm mt-1">View and manage tasks by date</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-dark-hover rounded-lg p-1">
            <Touchable
              onTap={prevMonth}
              hapticFeedback
              className="p-2 hover:bg-dark-card rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </Touchable>
            <span className="text-white font-medium px-4">
              {monthNames[month]} {year}
            </span>
            <Touchable
              onTap={nextMonth}
              hapticFeedback
              className="p-2 hover:bg-dark-card rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Touchable>
          </div>

          <Touchable
            onTap={() => window.location.href = '/crm/tasks/create'}
            hapticFeedback
            className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </Touchable>

          <Touchable
            onTap={() => console.log('Refresh')}
            hapticFeedback
            className="p-3 bg-dark-hover rounded-xl hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </Touchable>
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-card p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-2 border border-dark-border rounded-lg bg-dark-card opacity-50" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const tasks = getTasksForDate(day)
            return (
              <CalendarDay
                key={day}
                day={day}
                month={month}
                year={year}
                isCurrentMonth={true}
                tasks={tasks}
                onDayClick={handleDayClick}
                onTaskClick={handleTaskClick}
              />
            )
          })}
        </div>
      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {showTaskModal && selectedTask && (
          <TaskDetailsModal
            task={selectedTask}
            isOpen={showTaskModal}
            onClose={() => setShowTaskModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Gesture Hint */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>👆 Tap day to view</span>
          <span>📅 Swipe to change month</span>
          <span>✅ Click tasks</span>
        </div>
      </div>
    </div>
  )
}
