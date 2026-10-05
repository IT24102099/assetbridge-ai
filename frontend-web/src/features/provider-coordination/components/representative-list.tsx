import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Mail,
  Phone,
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
import type { Representative, RepresentativeStatus } from '../types'
import { RepresentativeFormDialog } from './representative-form-dialog'
import { toast } from 'sonner'

export function RepresentativeList() {
  const { representatives, deleteRepresentative } = useProviderCoordination()

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  // Modals
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null)

  // Filter Representatives
  const filteredReps = useMemo(() => {
    return representatives.filter((rep) => {
      const matchesSearch =
        rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.specialization.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || rep.status === statusFilter

      const matchesRegion =
        regionFilter === 'all' || rep.region === regionFilter

      return matchesSearch && matchesStatus && matchesRegion
    })
  }, [representatives, searchTerm, statusFilter, regionFilter])

  // Pagination
  const totalPages = Math.ceil(filteredReps.length / itemsPerPage) || 1
  const paginatedReps = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredReps.slice(start, start + itemsPerPage)
  }, [filteredReps, currentPage, itemsPerPage])

  const handleCreate = () => {
    setSelectedRep(null)
    setDialogOpen(true)
  }

  const handleEdit = (rep: Representative) => {
    setSelectedRep(rep)
    setDialogOpen(true)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove representative ${name}?`)) {
      deleteRepresentative(id)
      toast.success(`Representative ${name} removed`)
    }
  }

  const getStatusBadge = (status: RepresentativeStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge className='bg-green-100 text-green-800 hover:bg-green-100 border-green-200 font-medium px-2.5 py-0.5'>
            Active
          </Badge>
        )
      case 'on-leave':
        return (
          <Badge className='bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 font-medium px-2.5 py-0.5'>
            On Leave
          </Badge>
        )
      case 'inactive':
        return (
          <Badge className='bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200 font-medium px-2.5 py-0.5'>
            Inactive
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
            <span className='text-[11px] text-muted-foreground font-medium -mt-1'>Field Operations</span>
          </div>
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)] p-6 space-y-6'>
        {/* Page Title & Action */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
              Representative List
            </h1>
            <p className='text-muted-foreground text-sm mt-0.5'>
              Internal field coordinators, asset representatives, and region operational supervisors.
            </p>
          </div>
          <Button onClick={handleCreate} className='gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm'>
            <Plus className='h-4 w-4' />
            Add Representative
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
          <CardContent className='p-4'>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
              {/* Search */}
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                <Input
                  placeholder='Search representatives by name, code, email, role...'
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className='pl-9 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                />
              </div>

              {/* Filters */}
              <div className='flex flex-wrap items-center gap-2.5'>
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
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='on-leave'>On Leave</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
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

                {(searchTerm || statusFilter !== 'all' || regionFilter !== 'all') && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-slate-500 hover:text-slate-900'
                    onClick={() => {
                      setSearchTerm('')
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

        {/* Representative Table */}
        <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl overflow-hidden'>
          <CardContent className='p-0'>
            <Table>
              <TableHeader className='bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800'>
                <TableRow>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300 w-[90px]'>Code</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300'>Name & Role</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300'>Contact</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300'>Location</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300 text-center'>Assigned Assets</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300 text-center'>Status</TableHead>
                  <TableHead className='font-semibold text-slate-700 dark:text-slate-300 text-right pr-6'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='h-36 text-center text-slate-500 dark:text-slate-400'>
                      No representatives found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReps.map((rep) => (
                    <TableRow key={rep.id} className='hover:bg-slate-50/80 dark:hover:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 transition-colors'>
                      <TableCell className='font-mono text-xs font-medium text-blue-600 dark:text-blue-400'>
                        {rep.code}
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center gap-3 py-1'>
                          <Avatar className='h-10 w-10 border border-slate-200 dark:border-slate-700 shadow-2xs'>
                            <AvatarImage src={rep.avatar} alt={rep.name} />
                            <AvatarFallback className='bg-blue-50 text-blue-700 font-bold text-xs'>
                              {rep.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              to='/provider-coordination/representatives/$representativeId'
                              params={{ representativeId: rep.id }}
                              className='font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block'
                            >
                              {rep.name}
                            </Link>
                            <p className='text-xs text-slate-500 dark:text-slate-400'>{rep.role}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className='space-y-0.5 text-xs text-slate-600 dark:text-slate-300'>
                          <p className='flex items-center gap-1.5'>
                            <Mail className='h-3 w-3 text-slate-400' /> {rep.email}
                          </p>
                          <p className='flex items-center gap-1.5 text-slate-500'>
                            <Phone className='h-3 w-3 text-slate-400' /> {rep.phone}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className='text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5'>
                          <MapPin className='h-3.5 w-3.5 text-slate-400 shrink-0' />
                          <span>{rep.region}</span>
                        </div>
                      </TableCell>

                      <TableCell className='text-center'>
                        <span className='font-bold text-sm text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md'>
                          {rep.assignedProvidersCount} Vendors
                        </span>
                      </TableCell>

                      <TableCell className='text-center'>
                        {getStatusBadge(rep.status)}
                      </TableCell>

                      <TableCell className='text-right pr-4'>
                        <div className='flex items-center justify-end gap-1'>
                          <Link
                            to='/provider-coordination/representatives/$representativeId'
                            params={{ representativeId: rep.id }}
                          >
                            <Button variant='ghost' size='icon' className='h-8 w-8 text-slate-500 hover:text-blue-600' title='View Details'>
                              <Eye className='h-4 w-4' />
                            </Button>
                          </Link>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-slate-500 hover:text-blue-600'
                            onClick={() => handleEdit(rep)}
                            title='Edit Representative'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-slate-400 hover:text-red-600'
                            onClick={() => handleDelete(rep.id, rep.name)}
                            title='Delete Representative'
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

          {/* Pagination Footer */}
          <div className='flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/30'>
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              Showing <span className='font-semibold text-slate-700 dark:text-slate-200'>{filteredReps.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className='font-semibold text-slate-700 dark:text-slate-200'>{Math.min(currentPage * itemsPerPage, filteredReps.length)}</span> of{' '}
              <span className='font-semibold text-slate-700 dark:text-slate-200'>{filteredReps.length}</span> representatives
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

        {/* Dialog Modal */}
        <RepresentativeFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          representative={selectedRep}
        />
      </Main>
    </>
  )
}
