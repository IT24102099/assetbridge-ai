import { Check, Circle, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { WorkflowEvent } from '../types'

export function WorkflowTimeline({ events }: { events: WorkflowEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className='relative space-y-6 border-s ps-6'>
          {events.map((event) => (
            <li key={event.id} className='relative'>
              <span className='bg-background absolute -start-[33px] flex size-5 items-center justify-center rounded-full border'>
                {event.status === 'Completed' && <Check className='size-3 text-emerald-600' />}
                {event.status === 'Failed' && <X className='size-3 text-destructive' />}
                {event.status !== 'Completed' && event.status !== 'Failed' && (
                  <Circle className='size-2.5 fill-current text-primary' />
                )}
              </span>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <p className='font-medium'>{event.stage}</p>
                <span className='text-xs text-muted-foreground'>
                  {event.timestamp ? new Date(event.timestamp).toLocaleString() : event.status}
                </span>
              </div>
              {event.owner && <p className='text-sm text-muted-foreground'>Owner: {event.owner}</p>}
              {event.comment && <p className='mt-1 text-sm'>{event.comment}</p>}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

