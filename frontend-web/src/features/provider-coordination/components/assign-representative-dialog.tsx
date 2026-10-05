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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ServiceProvider } from '../types'
import { useProviderCoordination } from '../context/provider-coordination-context'
import { toast } from 'sonner'
import { UserCheck } from 'lucide-react'

interface AssignRepresentativeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: ServiceProvider | null
}

export function AssignRepresentativeDialog({
  open,
  onOpenChange,
  provider,
}: AssignRepresentativeDialogProps) {
  if (!open || !provider) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AssignRepresentativeContent
        key={provider.id}
        onOpenChange={onOpenChange}
        provider={provider}
      />
    </Dialog>
  )
}

function AssignRepresentativeContent({
  onOpenChange,
  provider,
}: {
  onOpenChange: (open: boolean) => void
  provider: ServiceProvider
}) {
  const { representatives, assignRepresentativeToProvider } = useProviderCoordination()
  const [selectedRepId, setSelectedRepId] = useState(provider.assignedRepresentativeId || '')

  const handleAssign = () => {
    assignRepresentativeToProvider(provider.id, selectedRepId)
    const selectedRep = representatives.find((r) => r.id === selectedRepId)
    toast.success(
      selectedRep
        ? `Assigned ${selectedRep.name} to ${provider.companyName}`
        : `Unassigned representative from ${provider.companyName}`
    )
    onOpenChange(false)
  }

  return (
    <DialogContent className='sm:max-w-[480px]'>
      <DialogHeader>
        <DialogTitle className='flex items-center gap-2'>
          <UserCheck className='h-5 w-5 text-primary' />
          Assign Representative
        </DialogTitle>
        <DialogDescription>
          Select a internal representative to manage and coordinate operations for{' '}
          <strong className='text-foreground'>{provider.companyName}</strong>.
        </DialogDescription>
      </DialogHeader>

      <div className='space-y-4 py-4'>
        <div className='rounded-md bg-muted p-3 text-xs space-y-1'>
          <div><span className='font-semibold'>Provider Region:</span> {provider.region}</div>
          <div><span className='font-semibold'>Provider Category:</span> {provider.category}</div>
          <div><span className='font-semibold'>Current Coordinator:</span> {provider.representativeName || 'Unassigned'}</div>
        </div>

        <div className='space-y-2'>
          <Label>Select Representative</Label>
          <Select value={selectedRepId} onValueChange={setSelectedRepId}>
            <SelectTrigger>
              <SelectValue placeholder='Choose representative...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>None (Unassign)</SelectItem>
              {representatives.map((rep) => (
                <SelectItem key={rep.id} value={rep.id}>
                  {rep.name} — {rep.region} ({rep.assignedProvidersCount} providers assigned)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button variant='outline' onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleAssign}>Confirm Assignment</Button>
      </DialogFooter>
    </DialogContent>
  )
}
