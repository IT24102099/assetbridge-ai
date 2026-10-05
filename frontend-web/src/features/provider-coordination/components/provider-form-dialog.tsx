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
import type { ServiceProvider, ProviderCategory, ProviderStatus } from '../types'
import { useProviderCoordination } from '../context/provider-coordination-context'
import { toast } from 'sonner'

interface ProviderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider?: ServiceProvider | null
}

const categories: ProviderCategory[] = [
  'Maintenance',
  'Inspection',
  'Valuation',
  'Legal',
  'Logistics',
  'Insurance',
]

const regions = [
  'North Region',
  'South Region',
  'East Region',
  'West Region',
  'Central Region',
]

export function ProviderFormDialog({
  open,
  onOpenChange,
  provider,
}: ProviderFormDialogProps) {
  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ProviderFormContent
        key={provider?.id || 'new-provider'}
        onOpenChange={onOpenChange}
        provider={provider}
      />
    </Dialog>
  )
}

function ProviderFormContent({
  onOpenChange,
  provider,
}: {
  onOpenChange: (open: boolean) => void
  provider?: ServiceProvider | null
}) {
  const { addProvider, updateProvider, representatives } = useProviderCoordination()

  const [companyName, setCompanyName] = useState(provider?.companyName || '')
  const [contactPerson, setContactPerson] = useState(provider?.contactPerson || '')
  const [email, setEmail] = useState(provider?.email || '')
  const [phone, setPhone] = useState(provider?.phone || '')
  const [category, setCategory] = useState<ProviderCategory>(provider?.category || 'Maintenance')
  const [region, setRegion] = useState(provider?.region || 'North Region')
  const [serviceArea, setServiceArea] = useState(provider?.serviceArea || 'Metro & Suburbs')
  const [hourlyRate, setHourlyRate] = useState(provider?.hourlyRate?.toString() || '95')
  const [rating, setRating] = useState(provider?.rating?.toString() || '4.8')
  const [status, setStatus] = useState<ProviderStatus>(provider?.status || 'verified')
  const [responseTimeHours, setResponseTimeHours] = useState(provider?.responseTimeHours?.toString() || '2')
  const [certificationsStr, setCertificationsStr] = useState(provider?.certifications?.join(', ') || 'ISO 9001, Safety Certified')
  const [assignedRepresentativeId, setAssignedRepresentativeId] = useState(provider?.assignedRepresentativeId || (representatives[0]?.id || ''))
  const [bio, setBio] = useState(provider?.bio || '')
  const [address, setAddress] = useState(provider?.address || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName || !email || !contactPerson) {
      toast.error('Please fill in required fields (Company Name, Contact Person, Email)')
      return
    }

    const certs = certificationsStr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    const rep = representatives.find((r) => r.id === assignedRepresentativeId)

    if (provider) {
      updateProvider(provider.id, {
        companyName,
        contactPerson,
        email,
        phone,
        category,
        region,
        serviceArea,
        hourlyRate: parseFloat(hourlyRate) || 0,
        rating: parseFloat(rating) || 4.5,
        status,
        responseTimeHours: parseInt(responseTimeHours) || 2,
        certifications: certs,
        assignedRepresentativeId,
        representativeName: rep ? rep.name : 'Unassigned',
        bio,
        address,
      })
      toast.success('Service provider updated successfully')
    } else {
      addProvider({
        companyName,
        contactPerson,
        email,
        phone,
        category,
        region,
        serviceArea,
        hourlyRate: parseFloat(hourlyRate) || 0,
        rating: parseFloat(rating) || 4.5,
        status,
        responseTimeHours: parseInt(responseTimeHours) || 2,
        certifications: certs,
        assignedRepresentativeId,
        representativeName: rep ? rep.name : 'Unassigned',
        avatar: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
        bio,
        address,
      })
      toast.success('Service provider added successfully')
    }

    onOpenChange(false)
  }

  return (
    <DialogContent className='sm:max-w-[650px] max-h-[90vh] overflow-y-auto'>
      <DialogHeader>
        <DialogTitle>
          {provider ? 'Edit Service Provider' : 'Add New Service Provider'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className='space-y-4 py-2'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='companyName'>Company Name *</Label>
            <Input
              id='companyName'
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder='Apex Services Inc.'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='contactPerson'>Contact Person *</Label>
            <Input
              id='contactPerson'
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder='John Doe'
              required
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='p-email'>Email Address *</Label>
            <Input
              id='p-email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='contact@apex.com'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='p-phone'>Phone Number</Label>
            <Input
              id='p-phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='+1 (555) 888-0000'
            />
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label>Category *</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ProviderCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              onValueChange={(v) => setStatus(v as ProviderStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='verified'>Verified</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='suspended'>Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='hourlyRate'>Hourly Rate ($/hr)</Label>
            <Input
              id='hourlyRate'
              type='number'
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='p-rating'>Rating (1-5)</Label>
            <Input
              id='p-rating'
              type='number'
              step='0.1'
              min='1'
              max='5'
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='responseTime'>Response Time (Hrs)</Label>
            <Input
              id='responseTime'
              type='number'
              value={responseTimeHours}
              onChange={(e) => setResponseTimeHours(e.target.value)}
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label>Assigned Representative</Label>
          <Select
            value={assignedRepresentativeId}
            onValueChange={setAssignedRepresentativeId}
          >
            <SelectTrigger>
              <SelectValue placeholder='Assign Representative' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>Unassigned</SelectItem>
              {representatives.map((rep) => (
                <SelectItem key={rep.id} value={rep.id}>
                  {rep.name} ({rep.region} - {rep.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='certifications'>Certifications (comma separated)</Label>
          <Input
            id='certifications'
            value={certificationsStr}
            onChange={(e) => setCertificationsStr(e.target.value)}
            placeholder='ISO 9001, OSHA Certified, Commercial Master License'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='serviceArea'>Service Area Scope</Label>
          <Input
            id='serviceArea'
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            placeholder='e.g. Greater Metro Area & Suburbs'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='address'>Office Address</Label>
          <Input
            id='address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder='123 Main St, City, State'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='p-bio'>Company Bio / Overview</Label>
          <Textarea
            id='p-bio'
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Services offered, equipment possessed, specialties...'
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
            {provider ? 'Save Changes' : 'Create Provider'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
