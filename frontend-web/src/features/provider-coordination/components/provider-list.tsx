import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Search,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Calendar,
  Sparkles,
  MapPin,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProviderCoordination } from '../context/use-provider-coordination'
import type { ServiceProvider, ProviderStatus } from '../types'
import { ProviderFormDialog } from './provider-form-dialog'
import { AssignRepresentativeDialog } from './assign-representative-dialog'
import { toast } from 'sonner'

export function ProviderList() {
  const { providers, deleteProvider } = useProviderCoordination()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  // Modals
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [assignProviderTarget, setAssignProviderTarget] = useState<ServiceProvider | null>(null)

  // Filter Providers
  const filteredProviders = useMemo(() => {
    return providers.filter((prov) => {
      const matchesSearch =
        prov.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prov.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prov.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prov.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prov.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        categoryFilter === 'all' || prov.category === categoryFilter

      const matchesStatus =
        statusFilter === 'all' || prov.status === statusFilter

      const matchesRegion =
        regionFilter === 'all' || prov.region === regionFilter

      return matchesSearch && matchesCategory && matchesStatus && matchesRegion
    })
  }, [providers, searchTerm, categoryFilter, statusFilter, regionFilter])

  // Pagination
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage) || 1
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProviders.slice(start, start + itemsPerPage)
  }, [filteredProviders, currentPage, itemsPerPage])

  const handleCreate = () => {
    setSelectedProvider(null)
    setDialogOpen(true)
  }

  const handleEdit = (prov: ServiceProvider) => {
    setSelectedProvider(prov)
    setDialogOpen(true)
  }

  const handleOpenAssign = (prov: ServiceProvider) => {
    setAssignProviderTarget(prov)
    setAssignDialogOpen(true)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove service provider ${name}?`)) {
      deleteProvider(id)
      toast.success(`Service provider ${name} removed`)
    }
  }

  const getStatusBadge = (status: ProviderStatus) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className='bg-green-100 text-green-800 hover:bg-green-100 border-green-200 font-medium px-2.5 py-0.5'>
            Verified
          </Badge>
        )
      case 'pending':
        return (
          <Badge className='bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 font-medium px-2.5 py-0.5'>
            Pending
          </Badge>
        )
      case 'suspended':
        return (
          <Badge className='bg-red-100 text-red-800 hover:bg-red-100 border-red-200 font-medium px-2.5 py-0.5'>
            Suspended
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
            <span className='text-[11px] text-muted-foreground font-medium -mt-1'>Provider Coordination</span>
          </div>
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)] p-6 space-y-6'>
        {/* Page Title & Actions */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
              Service Provider List
            </h1>
            <p className='text-muted-foreground text-sm mt-0.5'>
              Manage registered asset service providers, skill qualifications, locations, and verification statuses.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Link to='/provider-coordination/matching'>
              <Button variant='outline' className='gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/50 font-medium'>
                <Sparkles className='h-4 w-4 text-blue-600' />
                Provider Search / Matching
              </Button>
            </Link>
            <Button onClick={handleCreate} className='gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm'>
              <Plus className='h-4 w-4' />
              Add Provider
            </Button>
          </div>
        </div>

        {/* Clean Filter Section */}
        <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
          <CardContent className='p-4'>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
              {/* Search Bar */}
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                <Input
                  placeholder='Search providers by name, contact, code...'
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className='pl-9 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900'
                />
              </div>

              {/* Filters */}
              <div className='flex flex-wrap items-center gap-2.5'>
                <div className='w-40'>
                  <Select
                    value={categoryFilter}
                    onValueChange={(val) => {
                      setCategoryFilter(val)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className='bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'>
                      <SelectValue placeholder='Skill / Category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Skills/Categories</SelectItem>
                      <SelectItem value='Maintenance'>Maintenance</SelectItem>
                      <SelectItem value='Inspection'>Inspection</SelectItem>
                      <SelectItem value='Valuation'>Valuation</SelectItem>
                      <SelectItem value='Legal'>Legal</SelectItem>
                      <SelectItem value='Logistics'>Logistics</SelectItem>
                      <SelectItem value='Insurance'>Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='w-36'>
                  <Select
                    value={statusFilter}
                    onValueChange={(val) => {
                      setStatusFilter(val)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className='bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Statuses</SelectItem>
                      <SelectItem value='verified'>Verified</SelectItem>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='suspended'>Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='w-40'>
                  <Select
                    value={regionFilter}
                    onValueChange={(val) => {
                      setRegionFilter(val)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className='bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'>
                      <SelectValue placeholder='Location / Region' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Locations</SelectItem>
                      <SelectItem value='North Region'>North Region</SelectItem>
                      <SelectItem value='South Region'>South Region</SelectItem>
                      <SelectItem value='East Region'>East Region</SelectItem>
                      <SelectItem value='West Region'>West Region</SelectItem>
                      <SelectItem value='Central Region'>Central Region</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || regionFilter !== 'all') && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    onClick={() => {
                      setSearchTerm('')
                      setCategoryFilter('all')
                      setStatusFilter('all')
                      setRegionFilter('all')
                      setCurrentPage(1)
                    }}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clean Provider Table */}
        <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl overflow-hidden'>
          <CardContent className='p-0'>
            <Table>
              <TableHeader className='bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800'>
                <TableRow>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300 w-[90px]'>Code</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300'>Provider</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300'>Skills / Category</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300'>Location</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300 text-center'>Rating</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300 text-center'>Verification Status</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300'>Representative</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300 text-right pr-6'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProviders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className='h-36 text-center text-slate-500 dark:text-slate-400'>
                      No service providers found matching your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProviders.map((prov) => (
                    <TableRow key={prov.id} className='hover:bg-slate-50/80 dark:hover:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 transition-colors'>
                      <TableCell className='font-mono text-xs font-medium text-blue-600 dark:text-blue-400'>
                        {prov.code}
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center gap-3 py-1'>
                          <Avatar className='h-10 w-10 border border-slate-200 dark:border-slate-700 shadow-2xs'>
                            <AvatarImage src={prov.avatar} alt={prov.companyName} />
                            <AvatarFallback className='bg-blue-50 text-blue-700 font-bold text-xs'>
                              {prov.companyName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='space-y-0.5'>
                            <Link
                              to='/provider-coordination/providers/$providerId'
                              params={{ providerId: prov.id }}
                              className='font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block'
                            >
                              {prov.companyName}
                            </Link>
                            <p className='text-xs text-slate-500 dark:text-slate-400'>
                              Contact: <span className='font-medium text-slate-700 dark:text-slate-300'>{prov.contactPerson}</span>
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant='outline' className='bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-200 dark:border-slate-800 font-medium text-xs'>
                          {prov.category}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className='text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5'>
                          <MapPin className='h-3.5 w-3.5 text-slate-400 shrink-0' />
                          <span>{prov.region}</span>
                        </div>
                      </TableCell>

                      <TableCell className='text-center'>
                        <div className='inline-flex items-center gap-1 font-semibold text-xs text-slate-800 dark:text-slate-200 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/40'>
                          <Star className='h-3 w-3 fill-amber-400 text-amber-400' />
                          {prov.rating}
                          <span className='text-[10px] text-slate-400 font-normal'>(${prov.hourlyRate}/h)</span>
                        </div>
                      </TableCell>

                      <TableCell className='text-center'>
                        {getStatusBadge(prov.status)}
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center justify-between gap-1 text-xs'>
                          <span className='font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]'>
                            {prov.representativeName || 'Unassigned'}
                          </span>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                            onClick={() => handleOpenAssign(prov)}
                            title='Assign / Change Representative'
                          >
                            <UserCheck className='h-3.5 w-3.5' />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className='text-right pr-4'>
                        <div className='flex items-center justify-end gap-1'>
                          <Link
                            to='/provider-coordination/calendar'
                            search={{ providerId: prov.id }}
                          >
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-500 hover:text-blue-600' title='View Availability Calendar'>
                              <Calendar className='h-4 w-4' />
                            </Button>
                          </Link>
                          <Link
                            to='/provider-coordination/providers/$providerId'
                            params={{ providerId: prov.id }}
                          >
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-500 hover:text-blue-600' title='View Details'>
                              <Eye className='h-4 w-4' />
                            </Button>
                          </Link>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-slate-500 hover:text-blue-600'
                            onClick={() => handleEdit(prov)}
                            title='Edit Provider'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-slate-400 hover:text-red-600'
                            onClick={() => handleDelete(prov.id, prov.companyName)}
                            title='Delete Provider'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>

          {/* Clean Pagination Footer */}
          <div className='flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/30'>
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              Showing <span className='font-semibold text-slate-700 dark:text-slate-200'>{filteredProviders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className='font-semibold text-slate-700 dark:text-slate-200'>{Math.min(currentPage * itemsPerPage, filteredProviders.length)}</span> of{' '}
              <span className='font-semibold text-slate-700 dark:text-slate-200'>{filteredProviders.length}</span> providers
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 text-xs text-slate-500'>
                <span>Rows per page</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(val) => {
                    setItemsPerPage(Number(val))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className='h-8 w-16 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='5'>5</SelectItem>
                    <SelectItem value='6'>6</SelectItem>
                    <SelectItem value='10'>10</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center gap-1.5'>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <span className='text-xs font-semibold px-2 text-slate-700 dark:text-slate-300'>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Dialog Modals */}
        <ProviderFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          provider={selectedProvider}
        />

        <AssignRepresentativeDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          provider={assignProviderTarget}
        />
      </Main>
    </>
  )
}
