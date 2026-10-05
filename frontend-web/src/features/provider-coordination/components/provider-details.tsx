import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Building2,
  Edit,
  Trash2,
  Award,
  Calendar,
  UserCheck,
  Plus,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProviderCoordination } from '../context/use-provider-coordination'
import { ProviderFormDialog } from './provider-form-dialog'
import { AssignRepresentativeDialog } from './assign-representative-dialog'
import { SlotFormDialog } from './slot-form-dialog'
import { BookSlotDialog } from './book-slot-dialog'
import type { AvailabilitySlot } from '../types'
import { toast } from 'sonner'

export function ProviderDetails() {
  const params = useParams({ from: '/_authenticated/provider-coordination/providers/$providerId' })
  const { providerId } = params

  const { providers, representatives, availabilitySlots, deleteProvider } = useProviderCoordination()

  const provider = providers.find((p) => p.id === providerId)

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [slotDialogOpen, setSlotDialogOpen] = useState(false)
  const [bookDialogOpen, setBookDialogOpen] = useState(false)
  const [selectedSlotForBook, setSelectedSlotForBook] = useState<AvailabilitySlot | null>(null)

  if (!provider) {
    return (
      <>
        <Header />
        <Main className='bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)] p-6'>
          <div className='flex flex-col items-center justify-center py-16 space-y-4'>
            <h2 className='text-xl font-bold'>Service Provider Not Found</h2>
            <p className='text-muted-foreground'>The service provider with ID "{providerId}" does not exist.</p>
            <Link to='/provider-coordination/providers'>
              <Button variant='outline' className='gap-2'>
                <ArrowLeft className='h-4 w-4' /> Back to Service Providers
              </Button>
            </Link>
          </div>
        </Main>
      </>
    )
  }

  // Assigned Representative
  const assignedRep = representatives.find((r) => r.id === provider.assignedRepresentativeId)

  // Slots for this provider
  const providerSlots = availabilitySlots.filter((s) => s.providerId === provider.id)

  const handleBookSlot = (slot: AvailabilitySlot) => {
    setSelectedSlotForBook(slot)
    setBookDialogOpen(true)
  }

  const handleDelete = () => {
    if (confirm(`Remove provider ${provider.companyName}?`)) {
      deleteProvider(provider.id)
      toast.success('Service provider removed')
      window.history.back()
    }
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-3 me-auto'>
          <Link
            to='/provider-coordination/providers'
            className='inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors'
          >
            <ArrowLeft className='h-4 w-4 me-1.5' /> Service Providers
          </Link>
          <span className='text-slate-300 dark:text-slate-700'>/</span>
          <span className='text-sm font-semibold text-slate-900 dark:text-slate-100'>{provider.companyName}</span>
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)] p-6 space-y-6'>
        {/* Profile Header Banner */}
        <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row gap-6 items-start md:items-center justify-between'>
              <div className='flex items-start gap-4'>
                <Avatar className='h-20 w-20 border-2 border-blue-100 dark:border-blue-900 shadow-sm shrink-0'>
                  <AvatarImage src={provider.avatar} alt={provider.companyName} />
                  <AvatarFallback className='bg-blue-600 text-white font-bold text-2xl'>
                    {provider.companyName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className='space-y-1.5'>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                      {provider.companyName}
                    </h1>
                    <span className='font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900'>
                      {provider.code}
                    </span>
                    {provider.status === 'verified' && (
                      <Badge className='bg-green-100 text-green-800 border-green-200 font-medium'>Verified</Badge>
                    )}
                    {provider.status === 'pending' && (
                      <Badge className='bg-amber-100 text-amber-800 border-amber-200 font-medium'>Pending</Badge>
                    )}
                    {provider.status === 'suspended' && (
                      <Badge className='bg-red-100 text-red-800 border-red-200 font-medium'>Suspended</Badge>
                    )}
                  </div>

                  <p className='text-slate-600 dark:text-slate-300 font-medium text-sm flex items-center gap-2 flex-wrap'>
                    <Badge variant='outline' className='bg-slate-50 dark:bg-slate-900'>{provider.category}</Badge>
                    <span>•</span>
                    <span className='flex items-center gap-1 text-slate-600 dark:text-slate-400'>
                      <MapPin className='h-3.5 w-3.5 text-blue-600' /> {provider.region}
                    </span>
                  </p>

                  <div className='flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap'>
                    <span className='flex items-center gap-1'>
                      <Building2 className='h-3.5 w-3.5 text-blue-600' /> Contact: <strong className='text-slate-700 dark:text-slate-300'>{provider.contactPerson}</strong>
                    </span>
                    <span className='flex items-center gap-1'>
                      <Mail className='h-3.5 w-3.5 text-blue-600' /> {provider.email}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Phone className='h-3.5 w-3.5 text-blue-600' /> {provider.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2 self-start md:self-center flex-wrap'>
                <Button variant='outline' className='gap-2 border-slate-200 dark:border-slate-800' onClick={() => setAssignDialogOpen(true)}>
                  <UserCheck className='h-4 w-4 text-blue-600' /> Assign Rep
                </Button>
                <Button variant='outline' className='gap-2 border-slate-200 dark:border-slate-800' onClick={() => setEditDialogOpen(true)}>
                  <Edit className='h-4 w-4' /> Edit Profile
                </Button>
                <Button
                  variant='outline'
                  className='gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40'
                  onClick={handleDelete}
                >
                  <Trash2 className='h-4 w-4' /> Delete
                </Button>
              </div>
            </div>

            {provider.address && (
              <div className='mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2'>
                <MapPin className='h-3.5 w-3.5 text-blue-600' />
                <span>Office Address: <strong className='text-slate-700 dark:text-slate-300'>{provider.address}</strong></span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wireframe Tabs */}
        <Tabs defaultValue='overview' className='space-y-6'>
          <TabsList className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl w-full justify-start overflow-x-auto'>
            <TabsTrigger value='overview' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <Building2 className='h-4 w-4' /> Overview
            </TabsTrigger>
            <TabsTrigger value='skills' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <Award className='h-4 w-4' /> Skills
            </TabsTrigger>
            <TabsTrigger value='availability' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <Calendar className='h-4 w-4' /> Availability
            </TabsTrigger>
            <TabsTrigger value='documents' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <FileText className='h-4 w-4' /> Documents
            </TabsTrigger>
            <TabsTrigger value='reviews' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <Star className='h-4 w-4' /> Reviews
            </TabsTrigger>
          </TabsList>

          {/* 1. Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-3'>
              {/* Quick Info Cards */}
              <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-xs font-semibold uppercase text-slate-500 tracking-wider'>Hourly Service Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>${provider.hourlyRate}/hr</div>
                  <p className='text-xs text-slate-500 mt-1'>Standard contracted rate</p>
                </CardContent>
              </Card>

              <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-xs font-semibold uppercase text-slate-500 tracking-wider'>Dispatch Turnaround</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-slate-900 dark:text-slate-100'>{provider.responseTimeHours} Hours</div>
                  <p className='text-xs text-slate-500 mt-1'>Average response time</p>
                </CardContent>
              </Card>

              <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-xs font-semibold uppercase text-slate-500 tracking-wider'>Assigned Representative</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-base font-bold text-blue-700 dark:text-blue-300 truncate'>
                    {assignedRep ? assignedRep.name : provider.representativeName || 'Unassigned'}
                  </div>
                  <p className='text-xs text-slate-500 mt-1'>Internal field coordinator</p>
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>Company Profile & Overview</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 text-sm text-slate-600 dark:text-slate-300'>
                  <p>{provider.bio || 'No overview summary provided.'}</p>
                  <div className='pt-3 border-t border-slate-100 dark:border-slate-800'>
                    <h4 className='font-semibold text-xs uppercase text-slate-400 mb-1'>Service Coverage Scope</h4>
                    <p className='text-slate-800 dark:text-slate-200 font-medium'>{provider.serviceArea}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Coordinator Card */}
              <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <CardTitle className='text-base font-semibold'>Coordinator Representative</CardTitle>
                  <Button variant='ghost' size='sm' className='text-blue-600 text-xs' onClick={() => setAssignDialogOpen(true)}>
                    Change
                  </Button>
                </CardHeader>
                <CardContent>
                  {assignedRep ? (
                    <div className='flex items-start gap-4 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800'>
                      <Avatar className='h-12 w-12 border'>
                        <AvatarImage src={assignedRep.avatar} alt={assignedRep.name} />
                        <AvatarFallback>{assignedRep.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className='space-y-1 text-xs'>
                        <h4 className='font-bold text-sm text-slate-900 dark:text-slate-100'>{assignedRep.name}</h4>
                        <p className='text-slate-500'>{assignedRep.role} — {assignedRep.region}</p>
                        <p className='text-slate-500 pt-1'>Email: {assignedRep.email}</p>
                        <p className='text-slate-500'>Phone: {assignedRep.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <div className='py-6 text-center space-y-2 text-xs text-slate-500'>
                      <p>No representative currently assigned.</p>
                      <Button size='sm' className='bg-blue-600 text-white' onClick={() => setAssignDialogOpen(true)}>
                        Assign Representative
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 2. Skills Tab */}
          <TabsContent value='skills' className='space-y-6'>
            <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>Service Category & Certified Qualifications</CardTitle>
                <CardDescription>Verified technical skills, master licenses, and operational certifications.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <h4 className='text-xs font-semibold uppercase text-slate-400'>Primary Category</h4>
                  <Badge className='bg-blue-50 text-blue-700 border-blue-200 font-semibold px-3 py-1 text-sm'>
                    {provider.category}
                  </Badge>
                </div>

                <div className='pt-3 border-t space-y-3'>
                  <h4 className='text-xs font-semibold uppercase text-slate-400'>Verified Certifications List</h4>
                  {provider.certifications.length === 0 ? (
                    <p className='text-sm text-slate-500'>No certifications listed.</p>
                  ) : (
                    <div className='grid gap-3 sm:grid-cols-2'>
                      {provider.certifications.map((cert, idx) => (
                        <div key={idx} className='flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200'>
                          <ShieldCheck className='h-4 w-4 text-blue-600 shrink-0' />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. Availability Tab */}
          <TabsContent value='availability' className='space-y-6'>
            <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
              <CardHeader className='flex flex-row items-center justify-between'>
                <div>
                  <CardTitle className='text-base font-semibold'>Availability Schedule & Open Slots</CardTitle>
                  <CardDescription>View upcoming time windows and book service assignments.</CardDescription>
                </div>
                <Button size='sm' className='gap-1 bg-blue-600 text-white' onClick={() => setSlotDialogOpen(true)}>
                  <Plus className='h-4 w-4' /> Add Slot
                </Button>
              </CardHeader>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader className='bg-slate-50/80 dark:bg-slate-900/80'>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Task / Notes</TableHead>
                      <TableHead className='text-right pr-6'>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providerSlots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className='h-28 text-center text-slate-500'>
                          No availability slots found for this provider.
                        </TableCell>
                      </TableRow>
                    ) : (
                      providerSlots.map((slot) => (
                        <TableRow key={slot.id}>
                          <TableCell className='font-medium text-sm text-slate-900 dark:text-slate-100'>{slot.date}</TableCell>
                          <TableCell className='font-mono text-xs text-slate-600 dark:text-slate-300'>{slot.startTime} - {slot.endTime}</TableCell>
                          <TableCell>
                            {slot.status === 'available' && (
                              <Badge className='bg-green-100 text-green-800 border-green-200 font-medium'>Available</Badge>
                            )}
                            {slot.status === 'booked' && (
                              <Badge className='bg-blue-100 text-blue-800 border-blue-200 font-medium'>Booked</Badge>
                            )}
                            {slot.status === 'unavailable' && (
                              <Badge className='bg-slate-100 text-slate-700 border-slate-200 font-medium'>Unavailable</Badge>
                            )}
                          </TableCell>
                          <TableCell className='text-xs text-slate-600 dark:text-slate-300'>
                            {slot.taskTitle && <p className='font-semibold text-slate-900 dark:text-slate-100'>{slot.taskTitle}</p>}
                            <p>{slot.notes || 'No extra notes.'}</p>
                          </TableCell>
                          <TableCell className='text-right pr-4'>
                            {slot.status === 'available' ? (
                              <Button size='sm' className='bg-blue-600 text-white' onClick={() => handleBookSlot(slot)}>Book Slot</Button>
                            ) : (
                              <Button variant='ghost' size='sm' disabled className='text-slate-400'>Booked</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Documents Tab */}
          <TabsContent value='documents' className='space-y-6'>
            <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>Compliance & Legal Documents</CardTitle>
                <CardDescription>Verified vendor contracts, insurance policies, and licenses.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800'>
                  <div className='flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200'>
                    <FileText className='h-5 w-5 text-blue-600' />
                    <div>
                      <p>Master Service Provider Agreement (MSPA)</p>
                      <p className='text-xs font-normal text-slate-500'>Executed • Verified active</p>
                    </div>
                  </div>
                  <Badge className='bg-green-100 text-green-800 border-green-200'>Active</Badge>
                </div>

                <div className='flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800'>
                  <div className='flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200'>
                    <FileText className='h-5 w-5 text-blue-600' />
                    <div>
                      <p>Commercial General Liability Insurance Policy</p>
                      <p className='text-xs font-normal text-slate-500'>Valid through Dec 2027</p>
                    </div>
                  </div>
                  <Badge className='bg-green-100 text-green-800 border-green-200'>Verified</Badge>
                </div>

                <div className='flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800'>
                  <div className='flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200'>
                    <FileText className='h-5 w-5 text-blue-600' />
                    <div>
                      <p>State Trade & Master Operating License</p>
                      <p className='text-xs font-normal text-slate-500'>License # LIC-889012</p>
                    </div>
                  </div>
                  <Badge className='bg-green-100 text-green-800 border-green-200'>Verified</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5. Reviews Tab */}
          <TabsContent value='reviews' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-3'>
              <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl md:col-span-1'>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>Overall Feedback</CardTitle>
                </CardHeader>
                <CardContent className='text-center space-y-2 py-4'>
                  <div className='text-4xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2'>
                    {provider.rating} <Star className='h-7 w-7 text-amber-400 fill-amber-400' />
                  </div>
                  <p className='text-xs text-slate-500'>Based on verified job completion reports</p>
                  <div className='pt-3 border-t text-xs font-semibold text-green-700 dark:text-green-400'>
                    {provider.satisfactionRate}% Satisfaction Score
                  </div>
                </CardContent>
              </Card>

              <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl md:col-span-2'>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>Recent Client & Representative Reviews</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 text-xs'>
                  <div className='p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold text-slate-900 dark:text-slate-100'>Alex Morgan (Senior Coordinator)</span>
                      <div className='flex text-amber-400'>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className='h-3.5 w-3.5 fill-amber-400' />
                        ))}
                      </div>
                    </div>
                    <p className='text-slate-600 dark:text-slate-300'>
                      "Exceptional turnaround for emergency repairs. Equipment provided was top-tier and field technicians were certified."
                    </p>
                  </div>

                  <div className='p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <span className='font-bold text-slate-900 dark:text-slate-100'>Marcus Vance (Tech Lead)</span>
                      <div className='flex text-amber-400'>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className='h-3.5 w-3.5 fill-amber-400' />
                        ))}
                      </div>
                    </div>
                    <p className='text-slate-600 dark:text-slate-300'>
                      "Punctual dispatch and detailed documentation provided post-inspection. Highly recommended vendor."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <ProviderFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          provider={provider}
        />

        <AssignRepresentativeDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          provider={provider}
        />

        <SlotFormDialog
          open={slotDialogOpen}
          onOpenChange={setSlotDialogOpen}
          defaultProviderId={provider.id}
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
