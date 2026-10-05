import { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Building2,
  UserCheck,
  Search,
  Edit,
  Trash2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProviderCoordination } from '../context/use-provider-coordination'
import type { AvailabilitySlot, SlotStatus } from '../types'
import { SlotFormDialog } from './slot-form-dialog'
import { BookSlotDialog } from './book-slot-dialog'
import { toast } from 'sonner'

export function AvailabilityCalendar() {
  const { availabilitySlots, providers, deleteAvailabilitySlot } = useProviderCoordination()

  // Filters
  const [providerFilter, setProviderFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentMonth] = useState<string>('October 2026')

  // Modals
  const [slotDialogOpen, setSlotDialogOpen] = useState(false)
  const [selectedSlotForEdit, setSelectedSlotForEdit] = useState<AvailabilitySlot | null>(null)
  const [bookDialogOpen, setBookDialogOpen] = useState(false)
  const [selectedSlotForBook, setSelectedSlotForBook] = useState<AvailabilitySlot | null>(null)

  // Filter slots
  const filteredSlots = useMemo(() => {
    return availabilitySlots.filter((slot) => {
      const matchesProvider =
        providerFilter === 'all' || slot.providerId === providerFilter

      const matchesStatus =
        statusFilter === 'all' || slot.status === statusFilter

      const prov = providers.find((p) => p.id === slot.providerId)
      const matchesSearch =
        !searchTerm ||
        (slot.taskTitle && slot.taskTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (slot.notes && slot.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prov && prov.companyName.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesProvider && matchesStatus && matchesSearch
    })
  }, [availabilitySlots, providers, providerFilter, statusFilter, searchTerm])

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>()
    filteredSlots.forEach((s) => {
      const arr = map.get(s.date) || []
      arr.push(s)
      map.set(s.date, arr)
    })
    return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])))
  }, [filteredSlots])

  const handleAddSlot = () => {
    setSelectedSlotForEdit(null)
    setSlotDialogOpen(true)
  }

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setSelectedSlotForEdit(slot)
    setSlotDialogOpen(true)
  }

  const handleBookSlot = (slot: AvailabilitySlot) => {
    setSelectedSlotForBook(slot)
    setBookDialogOpen(true)
  }

  const handleDeleteSlot = (id: string) => {
    if (confirm('Delete this availability slot?')) {
      deleteAvailabilitySlot(id)
      toast.success('Availability slot removed')
    }
  }

  const getStatusBadge = (status: SlotStatus) => {
    switch (status) {
      case 'available':
        return (
          <Badge className='bg-green-100 text-green-800 border-green-200 font-medium px-2 py-0.5 text-xs'>
            Available
          </Badge>
        )
      case 'booked':
        return (
          <Badge className='bg-blue-100 text-blue-800 border-blue-200 font-medium px-2 py-0.5 text-xs'>
            Busy / Booked
          </Badge>
        )
      case 'unavailable':
        return (
          <Badge className='bg-slate-100 text-slate-700 border-slate-200 font-medium px-2 py-0.5 text-xs'>
            Unavailable
          </Badge>
        )
    }
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-3 me-auto'>
          <div className='flex items-center justify-center h-8 w-8 rounded-lg bg-blue-600 text-white font-bold text-sm'>
            AB
          </div>
          <div className='flex flex-col'>
            <span className='font-bold text-base tracking-tight text-blue-950 dark:text-blue-100'>AssetBridge AI</span>
            <span className='text-[11px] text-muted-foreground font-medium -mt-1'>Calendar Operations</span>
          </div>
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)] p-6 space-y-6'>
        {/* Title & Actions */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
              Availability Calendar
            </h1>
            <p className='text-muted-foreground text-sm mt-0.5'>
              View provider open slots, scheduled appointments, and filter availability by date and provider.
            </p>
          </div>
          <Button onClick={handleAddSlot} className='gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm'>
            <Plus className='h-4 w-4' /> Add Slot
          </Button>
        </div>

        {/* Wireframe Controls: Provider Selector & Month Navigation & Status Legend */}
        <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
          <CardContent className='p-4 space-y-4'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              {/* Provider Selector & Filters */}
              <div className='flex flex-wrap items-center gap-3 flex-1'>
                <div className='w-64'>
                  <Select value={providerFilter} onValueChange={setProviderFilter}>
                    <SelectTrigger className='bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 font-medium'>
                      <SelectValue placeholder='Select Provider' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Providers (Master Calendar)</SelectItem>
                      {providers.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.companyName} ({p.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='relative w-56'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                  <Input
                    placeholder='Filter task or notes...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-9 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-xs'
                  />
                </div>

                {(searchTerm || providerFilter !== 'all' || statusFilter !== 'all') && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-slate-500 hover:text-slate-900'
                    onClick={() => {
                      setSearchTerm('')
                      setProviderFilter('all')
                      setStatusFilter('all')
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>

              {/* Month Navigation */}
              <div className='flex items-center gap-2 bg-slate-50/80 dark:bg-slate-900/60 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 self-start lg:self-center'>
                <Button variant='ghost' size='icon' className='h-7 w-7 text-slate-600' title='Previous Month'>
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <span className='font-bold text-xs px-3 text-slate-800 dark:text-slate-200 flex items-center gap-1.5'>
                  <CalendarIcon className='h-3.5 w-3.5 text-blue-600' />
                  {currentMonth}
                </span>
                <Button variant='ghost' size='icon' className='h-7 w-7 text-slate-600' title='Next Month'>
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Wireframe Status Indicators Legend */}
            <div className='pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs flex-wrap gap-3'>
              <span className='font-semibold text-slate-500 uppercase text-[11px] tracking-wider'>Status Indicators:</span>
              <div className='flex items-center gap-4 flex-wrap'>
                <div className='flex items-center gap-1.5'>
                  <span className='h-2.5 w-2.5 rounded-full bg-green-500 inline-block'></span>
                  <span className='font-medium text-slate-700 dark:text-slate-300'>Available</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <span className='h-2.5 w-2.5 rounded-full bg-blue-600 inline-block'></span>
                  <span className='font-medium text-slate-700 dark:text-slate-300'>Busy / Booked</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <span className='h-2.5 w-2.5 rounded-full bg-slate-400 inline-block'></span>
                  <span className='font-medium text-slate-700 dark:text-slate-300'>Unavailable</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Master Schedule Date Views */}
        {slotsByDate.size === 0 ? (
          <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
            <CardContent className='h-44 flex items-center justify-center text-slate-500'>
              No availability slots found matching your filters.
            </CardContent>
          </Card>
        ) : (
          Array.from(slotsByDate.entries()).map(([dateStr, slots]) => (
            <div key={dateStr} className='space-y-3'>
              {/* Date Header */}
              <div className='flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2'>
                <CalendarIcon className='h-4 w-4 text-blue-600' />
                <span>{dateStr}</span>
                <Badge variant='outline' className='text-xs font-medium bg-slate-100 dark:bg-slate-800'>
                  {slots.length} {slots.length === 1 ? 'Slot' : 'Slots'}
                </Badge>
              </div>

              {/* Slot Cards Grid */}
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {slots.map((slot) => {
                  const prov = providers.find((p) => p.id === slot.providerId)
                  return (
                    <Card
                      key={slot.id}
                      className={`border shadow-sm bg-white dark:bg-card rounded-xl overflow-hidden transition-all ${
                        slot.status === 'available'
                          ? 'border-green-200 hover:border-green-400 dark:border-green-950/60'
                          : slot.status === 'booked'
                          ? 'border-blue-200 hover:border-blue-400 dark:border-blue-950/60'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <CardHeader className='p-4 pb-2 space-y-1 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800'>
                        <div className='flex items-center justify-between'>
                          <span className='font-mono text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5'>
                            <Clock className='h-3.5 w-3.5 text-blue-600' />
                            {slot.startTime} - {slot.endTime}
                          </span>
                          {getStatusBadge(slot.status)}
                        </div>

                        <CardTitle className='text-sm font-semibold text-slate-900 dark:text-slate-100 truncate pt-1'>
                          {prov?.companyName || 'Unknown Provider'}
                        </CardTitle>
                        <p className='text-xs text-slate-500 flex items-center gap-1'>
                          <Building2 className='h-3 w-3 text-slate-400' /> {prov?.category} ({prov?.region})
                        </p>
                      </CardHeader>

                      <CardContent className='p-4 pt-3 space-y-3 text-xs'>
                        {slot.status === 'booked' && (
                          <div className='p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-1'>
                            <span className='font-bold text-blue-900 dark:text-blue-200 block text-xs'>
                              Task: {slot.taskTitle || 'Scheduled Job'}
                            </span>
                            {slot.representativeName && (
                              <span className='text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-1'>
                                <UserCheck className='h-3 w-3 text-blue-600' /> Rep: {slot.representativeName}
                              </span>
                            )}
                          </div>
                        )}

                        {slot.notes && (
                          <p className='text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800'>
                            "{slot.notes}"
                          </p>
                        )}

                        <div className='flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800'>
                          <div className='flex items-center gap-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-7 w-7 text-slate-500 hover:text-blue-600'
                              onClick={() => handleEditSlot(slot)}
                              title='Edit Slot'
                            >
                              <Edit className='h-3.5 w-3.5' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-7 w-7 text-slate-400 hover:text-red-600'
                              onClick={() => handleDeleteSlot(slot.id)}
                              title='Delete Slot'
                            >
                              <Trash2 className='h-3.5 w-3.5' />
                            </Button>
                          </div>

                          {slot.status === 'available' && (
                            <Button
                              size='sm'
                              className='h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium gap-1'
                              onClick={() => handleBookSlot(slot)}
                            >
                              <CalendarCheck className='h-3.5 w-3.5' /> Book Slot
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))
        )}

        {/* Dialog Modals */}
        <SlotFormDialog
          open={slotDialogOpen}
          onOpenChange={setSlotDialogOpen}
          slot={selectedSlotForEdit}
        />

        <BookSlotDialog
          open={bookDialogOpen}
          onOpenChange={setBookDialogOpen}
          slot={selectedSlotForBook}
        />
      </Main>
    </>
  )
}
