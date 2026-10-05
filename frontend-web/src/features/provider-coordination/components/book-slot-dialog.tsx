import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AvailabilitySlot } from '../types'
import { useProviderCoordination } from '../context/provider-coordination-context'
import { toast } from 'sonner'
import { CalendarCheck } from 'lucide-react'

interface BookSlotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slot: AvailabilitySlot | null
}

export function BookSlotDialog({
  open,
  onOpenChange,
  slot,
}: BookSlotDialogProps) {
  if (!open || !slot) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <BookSlotContent
        key={slot.id}
        onOpenChange={onOpenChange}
        slot={slot}
      />
    </Dialog>
  )
}

function BookSlotContent({
  onOpenChange,
  slot,
}: {
  onOpenChange: (open: boolean) => void
  slot: AvailabilitySlot
}) {
  const { providers, representatives, bookAvailabilitySlot } = useProviderCoordination()

  const [taskTitle, setTaskTitle] = useState(slot.taskTitle || '')
  const [repName, setRepName] = useState(
    slot.representativeName || (representatives[0]?.name || '')
  )
  const [notes, setNotes] = useState(slot.notes || '')

  const provider = providers.find((p) => p.id === slot.providerId)

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle) {
      toast.error('Please provide a Task Title')
      return
    }

    bookAvailabilitySlot(slot.id, taskTitle, repName, notes)
    toast.success(`Slot booked for ${taskTitle}`)
    onOpenChange(false)
  }

  if (!provider) return null

  return (
    <DialogContent className='sm:max-w-[480px]'>
      <DialogHeader>
        <DialogTitle className='flex items-center gap-2'>
          <CalendarCheck className='h-5 w-5 text-primary' />
          Book Provider Slot
        </DialogTitle>
        <DialogDescription>
          Schedule a service assignment with{' '}
          <strong className='text-foreground'>{provider.companyName}</strong> on{' '}
          <strong className='text-foreground'>{slot.date}</strong> ({slot.startTime} - {slot.endTime}).
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleBook} className='space-y-4 py-2'>
        <div className='space-y-2'>
          <Label htmlFor='book-task'>Task / Assignment Title *</Label>
          <Input
            id='book-task'
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder='e.g. Asset Inspection & Condition Report'
            required
          />
        </div>

        <div className='space-y-2'>
          <Label>Assigned Representative Coordinator</Label>
          <Select value={repName} onValueChange={setRepName}>
            <SelectTrigger>
              <SelectValue placeholder='Select Representative' />
            </SelectTrigger>
            <SelectContent>
              {representatives.map((rep) => (
                <SelectItem key={rep.id} value={rep.name}>
                  {rep.name} ({rep.region})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='book-notes'>Booking Notes / Instructions</Label>
          <Textarea
            id='book-notes'
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Enter location details, specific asset ID or inspection criteria...'
          />
        </div>

        <DialogFooter className='pt-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type='submit'>Confirm Booking</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
