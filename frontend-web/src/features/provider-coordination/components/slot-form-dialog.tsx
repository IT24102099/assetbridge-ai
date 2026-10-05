import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import type { AvailabilitySlot, SlotStatus } from '../types'
import { useProviderCoordination } from '../context/provider-coordination-context'
import { toast } from 'sonner'

interface SlotFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slot?: AvailabilitySlot | null
  defaultProviderId?: string
}

export function SlotFormDialog({
  open,
  onOpenChange,
  slot,
  defaultProviderId,
}: SlotFormDialogProps) {
  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SlotFormContent
        key={slot?.id || defaultProviderId || 'new-slot'}
        onOpenChange={onOpenChange}
        slot={slot}
        defaultProviderId={defaultProviderId}
      />
    </Dialog>
  )
}

function SlotFormContent({
  onOpenChange,
  slot,
  defaultProviderId,
}: {
  onOpenChange: (open: boolean) => void
  slot?: AvailabilitySlot | null
  defaultProviderId?: string
}) {
  const { providers, addAvailabilitySlot, updateAvailabilitySlot } = useProviderCoordination()

  const [providerId, setProviderId] = useState(
    slot?.providerId || defaultProviderId || (providers[0]?.id || '')
  )
  const [date, setDate] = useState(slot?.date || new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState(slot?.startTime || '09:00')
  const [endTime, setEndTime] = useState(slot?.endTime || '12:00')
  const [status, setStatus] = useState<SlotStatus>(slot?.status || 'available')
  const [taskTitle, setTaskTitle] = useState(slot?.taskTitle || '')
  const [notes, setNotes] = useState(slot?.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!providerId || !date || !startTime || !endTime) {
      toast.error('Please fill in required fields (Provider, Date, Start & End Time)')
      return
    }

    if (slot) {
      updateAvailabilitySlot(slot.id, {
        providerId,
        date,
        startTime,
        endTime,
        status,
        taskTitle: status === 'booked' ? taskTitle : undefined,
        notes,
      })
      toast.success('Availability slot updated')
    } else {
      addAvailabilitySlot({
        providerId,
        date,
        startTime,
        endTime,
        status,
        taskTitle: status === 'booked' ? taskTitle : undefined,
        notes,
      })
      toast.success('Availability slot created')
    }

    onOpenChange(false)
  }

  return (
    <DialogContent className='sm:max-w-[500px]'>
      <DialogHeader>
        <DialogTitle>
          {slot ? 'Edit Availability Slot' : 'Add Provider Availability Slot'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className='space-y-4 py-2'>
        <div className='space-y-2'>
          <Label>Service Provider *</Label>
          <Select value={providerId} onValueChange={setProviderId}>
            <SelectTrigger>
              <SelectValue placeholder='Select Provider' />
            </SelectTrigger>
            <SelectContent>
              {providers.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.companyName} ({p.category})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='grid grid-cols-3 gap-3'>
          <div className='space-y-2'>
            <Label htmlFor='slot-date'>Date *</Label>
            <Input
              id='slot-date'
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='start-time'>Start Time *</Label>
            <Input
              id='start-time'
              type='time'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='end-time'>End Time *</Label>
            <Input
              id='end-time'
              type='time'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label>Initial Slot Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as SlotStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='available'>Available</SelectItem>
              <SelectItem value='booked'>Booked</SelectItem>
              <SelectItem value='unavailable'>Unavailable / Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {status === 'booked' && (
          <div className='space-y-2'>
            <Label htmlFor='taskTitle'>Task / Assignment Title</Label>
            <Input
              id='taskTitle'
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder='e.g. Asset Inspection at Plant B'
            />
          </div>
        )}

        <div className='space-y-2'>
          <Label htmlFor='notes'>Slot Notes / Remarks</Label>
          <Textarea
            id='notes'
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='e.g. Technician with thermal camera available...'
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
          <Button type='submit'>
            {slot ? 'Save Slot' : 'Create Slot'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
