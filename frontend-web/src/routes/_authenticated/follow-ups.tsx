import { createFileRoute } from '@tanstack/react-router'
import { FollowUpsPage } from '@/features/m4/pages/follow-ups-page'
export const Route = createFileRoute('/_authenticated/follow-ups')({ component: FollowUpsPage })

