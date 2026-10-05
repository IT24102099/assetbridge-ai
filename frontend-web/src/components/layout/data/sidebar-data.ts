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
    name: 'Facility Admin',
    email: 'admin@assetbridge.ai',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
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
