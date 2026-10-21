import {
  BarChart3,
  BookOpen,
  Layers,
  LayoutDashboard,
  Settings as SettingsIcon,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  shortLabel: string
  icon: LucideIcon
  description: string
  primary: boolean
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    shortLabel: 'Home',
    icon: LayoutDashboard,
    description: 'Today’s plan and progress',
    primary: true,
  },
  {
    to: '/learn',
    label: 'Learn',
    shortLabel: 'Learn',
    icon: Sparkles,
    description: 'Active-recall study sessions',
    primary: true,
  },
  {
    to: '/curriculum',
    label: 'Curriculum',
    shortLabel: 'Course',
    icon: BookOpen,
    description: 'All 14 weekly modules',
    primary: true,
  },
  {
    to: '/review',
    label: 'Review Queue',
    shortLabel: 'Review',
    icon: Layers,
    description: 'Leitner spaced repetition',
    primary: true,
  },
  {
    to: '/statistics',
    label: 'Statistics',
    shortLabel: 'Stats',
    icon: BarChart3,
    description: 'Mastery and activity analytics',
    primary: true,
  },
  {
    to: '/settings',
    label: 'Settings',
    shortLabel: 'Settings',
    icon: SettingsIcon,
    description: 'Preferences and data',
    primary: false,
  },
]
