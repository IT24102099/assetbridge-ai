import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  Command,
  GalleryVerticalEnd,
  FileCheck2,
  Receipt,
  Scale,
  Sparkles,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Nimal Perera',
    email: 'nimal.rep@assetbridge.ai',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'AssetBridge AI',
      logo: Command,
      plan: 'Remote Asset Platform',
    },
    {
      name: 'Overseas Owner Portal',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise Continuity',
    },
  ],
  navGroups: [
    {
      title: 'Member 3: Maintenance & Quotations',
      items: [
        {
          title: 'Maintenance Overview',
          url: '/maintenance',
          icon: Wrench,
        },
        {
          title: 'Damage Inspections',
          url: '/inspections',
          icon: FileCheck2,
          badge: 'INS-1021',
        },
        {
          title: 'Quotations',
          url: '/quotations',
          icon: Receipt,
        },
        {
          title: 'Compare Quotations (AI)',
          url: '/quotations/compare',
          icon: Scale,
          badge: 'AI Rec',
        },
        {
          title: 'Maintenance Jobs',
          url: '/maintenance/jobs',
          icon: Clock,
        },
        {
          title: 'Price Book Catalog',
          url: '/maintenance/catalog',
          icon: Package,
        },
        {
          title: 'Reports & Analytics',
          url: '/maintenance/reports',
          icon: TrendingUp,
        },
        {
          title: 'Agent 3 & RAG Studio',
          url: '/maintenance/ai-agent',
          icon: Sparkles,
        },
      ],
    },
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
      ],
    },
  ],
}
