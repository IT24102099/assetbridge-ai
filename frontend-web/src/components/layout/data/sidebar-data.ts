import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  FileX,
  Lock,
  Bell,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  ShieldCheck,
  Command,
  GalleryVerticalEnd,
  FileCheck2,
  Receipt,
  Scale,
  Sparkles,
  Clock,
  TrendingUp,
  ClipboardCheck,
  ScrollText,
  ListChecks,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  UserCheck,
  Building2,
  Sparkles,
  Calendar,
  TriangleAlert,
  Boxes,

} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Nimal Perera',
    email: 'nimal.rep@assetbridge.ai',
    name: 'Facility Admin',
    email: 'admin@assetbridge.ai',
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
  name: 'AssetBridge AI',
  logo: Boxes,
  plan: 'Enterprise Platform',
},
    {
      name: 'Acme Facilities',
      logo: Building2,
      plan: 'Public Infrastructure',
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
      title: 'Management',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Assets',
          url: '/assets',
          icon: Building2,
        },
        {
          title: 'Incidents',
          url: '/incidents',
          icon: TriangleAlert,
        },
      ],
    },
    {
      title: 'Provider Coordination',
      items: [
        {
          title: 'Representatives',
          url: '/provider-coordination/representatives',
          icon: UserCheck,
        },
        {
          title: 'Service Providers',
          url: '/provider-coordination/providers',
          icon: Building2,
        },
        {
          title: 'Provider Matching',
          url: '/provider-coordination/matching',
          icon: Sparkles,
        },
        {
          title: 'Availability Calendar',
          url: '/provider-coordination/calendar',
          icon: Calendar,
        },
        {
          title: 'Approvals',
          url: '/approvals',
          icon: ClipboardCheck,
        },
        {
          title: 'Follow-ups',
          url: '/follow-ups',
          icon: ListChecks,
        },
        {
          title: 'Audit logs',
          url: '/audit-logs',
          icon: ScrollText,
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
      title: 'System',
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
