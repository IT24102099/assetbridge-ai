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
  Briefcase,
  Calendar,
  UserCheck,
  FileText,
  History as HistoryIcon,
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
import { RepresentativeFormDialog } from './representative-form-dialog'
import { AssignRepresentativeDialog } from './assign-representative-dialog'
import type { ServiceProvider } from '../types'
import { toast } from 'sonner'

export function RepresentativeDetails() {
  const params = useParams({ from: '/_authenticated/provider-coordination/representatives/$representativeId' })
  const { representativeId } = params

  const { representatives, providers, availabilitySlots, deleteRepresentative } = useProviderCoordination()

  const representative = representatives.find((r) => r.id === representativeId)

  // Dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedProviderForAssign, setSelectedProviderForAssign] = useState<ServiceProvider | null>(null)

  if (!representative) {
    return (
      <>
        <Header />
        <Main className='bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)] p-6'>
          <div className='flex flex-col items-center justify-center py-16 space-y-4'>
            <h2 className='text-xl font-bold'>Representative Not Found</h2>
            <p className='text-muted-foreground'>The representative with ID "{representativeId}" does not exist.</p>
            <Link to='/provider-coordination/representatives'>
              <Button variant='outline' className='gap-2'>
                <ArrowLeft className='h-4 w-4' /> Back to Representatives Directory
              </Button>
            </Link>
          </div>
        </Main>
      </>
    )
  }

  // Assigned providers for this representative
  const assignedProviders = providers.filter(
    (p) => p.assignedRepresentativeId === representative.id
  )

  // Related slots booked by or assigned to this rep
  const repSlots = availabilitySlots.filter(
    (s) => s.representativeName === representative.name || assignedProviders.some((p) => p.id === s.providerId)
  )

  const handleOpenAssign = (prov: ServiceProvider) => {
    setSelectedProviderForAssign(prov)
    setAssignDialogOpen(true)
  }

  const handleDelete = () => {
    if (confirm(`Remove representative ${representative.name}?`)) {
      deleteRepresentative(representative.id)
      toast.success('Representative removed')
      window.history.back()
    }
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-3 me-auto'>
          <Link
            to='/provider-coordination/representatives'
            className='inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors'
          >
            <ArrowLeft className='h-4 w-4 me-1.5' /> Representative List
          </Link>
          <span className='text-slate-300 dark:text-slate-700'>/</span>
          <span className='text-sm font-semibold text-slate-900 dark:text-slate-100'>{representative.name}</span>
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)] p-6 space-y-6'>
        {/* Profile Banner */}
        <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row gap-6 items-start md:items-center justify-between'>
              <div className='flex items-start gap-4'>
                <Avatar className='h-20 w-20 border-2 border-blue-100 dark:border-blue-900 shadow-sm shrink-0'>
                  <AvatarImage src={representative.avatar} alt={representative.name} />
                  <AvatarFallback className='bg-blue-600 text-white font-bold text-2xl'>
                    {representative.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className='space-y-1.5'>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                      {representative.name}
                    </h1>
                    <span className='font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900'>
                      {representative.code}
                    </span>
                    {representative.status === 'active' && (
                      <Badge className='bg-green-100 text-green-800 border-green-200 font-medium'>Active</Badge>
                    )}
                    {representative.status === 'on-leave' && (
                      <Badge className='bg-amber-100 text-amber-800 border-amber-200 font-medium'>On Leave</Badge>
                    )}
                    {representative.status === 'inactive' && (
                      <Badge className='bg-slate-100 text-slate-700 border-slate-200 font-medium'>Inactive</Badge>
                    )}
                  </div>

                  <p className='text-slate-600 dark:text-slate-300 font-medium text-sm flex items-center gap-2 flex-wrap'>
                    <Briefcase className='h-4 w-4 text-blue-600' />
                    <span>{representative.role}</span>
                    <span>•</span>
                    <MapPin className='h-3.5 w-3.5 inline text-blue-600' /> {representative.region}
                  </p>

                  <div className='flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap'>
                    <span className='flex items-center gap-1'>
                      <Mail className='h-3.5 w-3.5 text-blue-600' /> {representative.email}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Phone className='h-3.5 w-3.5 text-blue-600' /> {representative.phone}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Calendar className='h-3.5 w-3.5 text-blue-600' /> Joined {representative.dateJoined}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2 self-start md:self-center flex-wrap'>
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
          </CardContent>
        </Card>

        {/* Wireframe Tabs */}
        <Tabs defaultValue='profile' className='space-y-6'>
          <TabsList className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl w-full justify-start overflow-x-auto'>
            <TabsTrigger value='profile' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <UserCheck className='h-4 w-4' /> Profile
            </TabsTrigger>
            <TabsTrigger value='assigned-assets' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <Building2 className='h-4 w-4' /> Assigned Assets ({assignedProviders.length})
            </TabsTrigger>
            <TabsTrigger value='availability' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <Calendar className='h-4 w-4' /> Availability ({repSlots.length})
            </TabsTrigger>
            <TabsTrigger value='documents' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <FileText className='h-4 w-4' /> Documents
            </TabsTrigger>
            <TabsTrigger value='history' className='gap-2 font-medium text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <HistoryIcon className='h-4 w-4' /> History
            </TabsTrigger>
          </TabsList>

          {/* 1. Profile Tab */}
          <TabsContent value='profile' className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>Biography & Jurisdiction</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 text-sm text-slate-600 dark:text-slate-300'>
                  <p>{representative.bio || 'No biography details recorded.'}</p>
                  <div className='pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5'>
                    <h4 className='font-semibold text-xs uppercase text-slate-400'>Specialization Focus</h4>
                    <p className='text-blue-700 dark:text-blue-300 font-semibold'>{representative.specialization}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>Operational Summary</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 text-sm'>
                  <div className='flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5'>
                    <span className='text-slate-500'>Assigned Region</span>
                    <span className='font-bold text-slate-900 dark:text-slate-100'>{representative.region}</span>
                  </div>
                  <div className='flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5'>
                    <span className='text-slate-500'>Assigned Service Vendors</span>
                    <span className='font-bold text-blue-600'>{assignedProviders.length} Vendors</span>
                  </div>
                  <div className='flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5'>
                    <span className='text-slate-500'>Satisfaction Rating</span>
                    <span className='font-bold text-amber-600 flex items-center gap-1'>
                      <Star className='h-4 w-4 fill-amber-400 text-amber-400' /> {representative.rating} / 5.0
                    </span>
                  </div>
                  <div className='flex items-center justify-between pb-1'>
                    <span className='text-slate-500'>Active Field Tasks</span>
                    <span className='font-bold text-slate-900 dark:text-slate-100'>{representative.activeTasks} Active</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 2. Assigned Assets Tab */}
          <TabsContent value='assigned-assets' className='space-y-6'>
            <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>Assigned Vendor Accounts & Asset Operations</CardTitle>
                <CardDescription>Service providers managed under {representative.name}'s coordination.</CardDescription>
              </CardHeader>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader className='bg-slate-50/80 dark:bg-slate-900/80'>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Skill Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className='text-center'>Rating</TableHead>
                      <TableHead className='text-right pr-6'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedProviders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className='h-28 text-center text-slate-500'>
                          No service providers currently assigned to this representative.
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignedProviders.map((prov) => (
                        <TableRow key={prov.id}>
                          <TableCell className='font-mono text-xs font-semibold text-blue-600'>{prov.code}</TableCell>
                          <TableCell>
                            <Link
                              to='/provider-coordination/providers/$providerId'
                              params={{ providerId: prov.id }}
                              className='font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600'
                            >
                              {prov.companyName}
                            </Link>
                            <p className='text-xs text-slate-500'>{prov.contactPerson}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant='outline'>{prov.category}</Badge>
                          </TableCell>
                          <TableCell className='text-xs text-slate-600'>{prov.region}</TableCell>
                          <TableCell className='text-center font-bold text-xs text-amber-600'>★ {prov.rating}</TableCell>
                          <TableCell className='text-right pr-4'>
                            <div className='flex items-center justify-end gap-2'>
                              <Button variant='outline' size='sm' onClick={() => handleOpenAssign(prov)}>
                                Reassign
                              </Button>
                              <Link to='/provider-coordination/providers/$providerId' params={{ providerId: prov.id }}>
                                <Button variant='ghost' size='sm'>View Profile</Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. Availability Tab */}
          <TabsContent value='availability' className='space-y-6'>
            <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>Upcoming Availability & Field Schedule</CardTitle>
                <CardDescription>Scheduled calendar appointments under this representative's territory.</CardDescription>
              </CardHeader>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader className='bg-slate-50/80 dark:bg-slate-900/80'>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Task Details</TableHead>
                      <TableHead className='text-center'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repSlots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className='h-28 text-center text-slate-500'>
                          No scheduled appointments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      repSlots.map((slot) => {
                        const prov = providers.find((p) => p.id === slot.providerId)
                        return (
                          <TableRow key={slot.id}>
                            <TableCell className='font-medium text-xs text-slate-900 dark:text-slate-100'>
                              {slot.date} ({slot.startTime} - {slot.endTime})
                            </TableCell>
                            <TableCell className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
                              {prov?.companyName || 'Vendor'}
                            </TableCell>
                            <TableCell className='text-xs text-slate-600 dark:text-slate-300'>
                              {slot.taskTitle && <p className='font-semibold text-slate-900 dark:text-slate-100'>{slot.taskTitle}</p>}
                              <p>{slot.notes || 'No extra notes.'}</p>
                            </TableCell>
                            <TableCell className='text-center'>
                              {slot.status === 'available' && <Badge className='bg-green-100 text-green-800 border-green-200'>Available</Badge>}
                              {slot.status === 'booked' && <Badge className='bg-blue-100 text-blue-800 border-blue-200'>Booked</Badge>}
                              {slot.status === 'unavailable' && <Badge className='bg-slate-100 text-slate-700 border-slate-200'>Unavailable</Badge>}
                            </TableCell>
                          </TableRow>
                        )
                      })
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
                <CardTitle className='text-base font-semibold'>Credentials & Field Operations Documents</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800'>
                  <div className='flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200'>
                    <FileText className='h-5 w-5 text-blue-600' />
                    <div>
                      <p>Field Coordinator Accreditation Certificate</p>
                      <p className='text-xs font-normal text-slate-500'>Verified • Valid through 2028</p>
                    </div>
                  </div>
                  <Badge className='bg-green-100 text-green-800 border-green-200'>Verified</Badge>
                </div>

                <div className='flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800'>
                  <div className='flex items-center gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200'>
                    <FileText className='h-5 w-5 text-blue-600' />
                    <div>
                      <p>Asset Security Clearance & Background Check</p>
                      <p className='text-xs font-normal text-slate-500'>Passed annual audit</p>
                    </div>
                  </div>
                  <Badge className='bg-green-100 text-green-800 border-green-200'>Active</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5. History Tab */}
          <TabsContent value='history' className='space-y-6'>
            <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>Coordination & Audit Logs History</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-xs'>
                <div className='p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1'>
                  <div className='flex items-center justify-between font-bold text-slate-900 dark:text-slate-100'>
                    <span>Provider Onboarding Verification</span>
                    <span className='text-slate-400 font-normal'>2026-09-24</span>
                  </div>
                  <p className='text-slate-600 dark:text-slate-300'>
                    Verified credentials and assigned Apex Maintenance Ltd. to Northern region operations.
                  </p>
                </div>

                <div className='p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1'>
                  <div className='flex items-center justify-between font-bold text-slate-900 dark:text-slate-100'>
                    <span>Quarterly Operational Audit</span>
                    <span className='text-slate-400 font-normal'>2026-08-15</span>
                  </div>
                  <p className='text-slate-600 dark:text-slate-300'>
                    Completed field inspection audit with 100% compliance pass score.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog Modals */}
        <RepresentativeFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          representative={representative}
        />

        <AssignRepresentativeDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          provider={selectedProviderForAssign}
        />
      </Main>
    </>
  )
}
