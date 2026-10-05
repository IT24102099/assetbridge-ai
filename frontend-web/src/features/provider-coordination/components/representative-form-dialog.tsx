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
import type { Representative, RepresentativeStatus } from '../types'
import { useProviderCoordination } from '../context/provider-coordination-context'
import { toast } from 'sonner'

interface RepresentativeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  representative?: Representative | null
}

const regions = [
  'North Region',
  'South Region',
  'East Region',
  'West Region',
  'Central Region',
]

export function RepresentativeFormDialog({
  open,
  onOpenChange,
  representative,
}: RepresentativeFormDialogProps) {
  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <RepresentativeFormContent
        key={representative?.id || 'new-rep'}
        onOpenChange={onOpenChange}
        representative={representative}
      />
    </Dialog>
  )
}

function RepresentativeFormContent({
  onOpenChange,
  representative,
}: {
  onOpenChange: (open: boolean) => void
  representative?: Representative | null
}) {
  const { addRepresentative, updateRepresentative } = useProviderCoordination()

  const [name, setName] = useState(representative?.name || '')
  const [email, setEmail] = useState(representative?.email || '')
  const [phone, setPhone] = useState(representative?.phone || '')
  const [role, setRole] = useState(representative?.role || 'Field Coordinator')
  const [region, setRegion] = useState(representative?.region || 'North Region')
  const [status, setStatus] = useState<RepresentativeStatus>(representative?.status || 'active')
  const [rating, setRating] = useState(representative?.rating?.toString() || '4.5')
  const [specialization, setSpecialization] = useState(representative?.specialization || '')
  const [bio, setBio] = useState(representative?.bio || '')
  const [avatar, setAvatar] = useState(representative?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      toast.error('Please fill in required fields (Name, Email)')
      return
    }

    if (representative) {
      updateRepresentative(representative.id, {
        name,
        email,
        phone,
        role,
        region,
        status,
        rating: parseFloat(rating) || 4.5,
        specialization,
        bio,
        avatar: avatar || representative.avatar,
      })
      toast.success('Representative updated successfully')
    } else {
      addRepresentative({
        name,
        email,
        phone,
        role,
        region,
        status,
        rating: parseFloat(rating) || 4.5,
        specialization,
        bio,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        dateJoined: new Date().toISOString().split('T')[0],
      })
      toast.success('Representative added successfully')
    }

    onOpenChange(false)
  }

  return (
    <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
      <DialogHeader>
        <DialogTitle>
          {representative ? 'Edit Representative' : 'Add New Representative'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className='space-y-4 py-2'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Full Name *</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. Alex Morgan'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address *</Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='alex@assetbridge.com'
              required
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone Number</Label>
            <Input
              id='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='+1 (555) 000-0000'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='role'>Role Title</Label>
            <Input
              id='role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder='Senior Field Coordinator'
            />
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label>Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder='Select Region' />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as RepresentativeStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
                <SelectItem value='on-leave'>On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='rating'>Initial Rating (1-5)</Label>
            <Input
              id='rating'
              type='number'
              step='0.1'
              min='1'
              max='5'
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='specialization'>Specialization</Label>
          <Input
            id='specialization'
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder='e.g. Commercial Real Estate & Machinery'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='bio'>Biography / Notes</Label>
          <Textarea
            id='bio'
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Brief background and expertise...'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='avatar'>Avatar URL (Optional)</Label>
          <Input
            id='avatar'
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder='https://...'
          />
        </div>

        <DialogFooter className='pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type='submit'>
            {representative ? 'Save Changes' : 'Create Representative'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
