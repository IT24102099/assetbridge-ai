import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Filter,
  CheckCircle2,
  Star,
  MapPin,
  Calendar,
  UserCheck,
  ArrowRight,
  RefreshCw,
  Search,
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import type { ProviderMatchCriteria, ServiceProvider } from '../types'
import { AssignRepresentativeDialog } from './assign-representative-dialog'

export function ProviderMatching() {
  const { runMatchingEngine } = useProviderCoordination()

  // Form inputs
  const [requiredSkill, setRequiredSkill] = useState<string>('all')
  const [location, setLocation] = useState<string>('all')
  const [maxDistance, setMaxDistance] = useState<number>(25)
  const [availableDate, setAvailableDate] = useState<string>('')
  const [minRating, setMinRating] = useState<number>(4.0)

  // Applied criteria (evaluated on "Search Providers" click or dynamic change)
  const [appliedCriteria, setAppliedCriteria] = useState<ProviderMatchCriteria>({
    category: '',
    region: '',
    minRating: 4.0,
    maxHourlyRate: 300,
    requiredCertification: '',
    availabilityDate: '',
  })

  // Selected for assignment modal
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [targetProvider, setTargetProvider] = useState<ServiceProvider | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setAppliedCriteria({
      category: requiredSkill === 'all' ? '' : requiredSkill,
      region: location === 'all' ? '' : location,
      minRating,
      maxHourlyRate: 300,
      requiredCertification: '',
      availabilityDate: availableDate,
    })
  }

  const matchResults = useMemo(() => {
    return runMatchingEngine(appliedCriteria)
  }, [appliedCriteria, runMatchingEngine])

  const handleOpenAssign = (prov: ServiceProvider) => {
    setTargetProvider(prov)
    setAssignDialogOpen(true)
  }

  const handleReset = () => {
    setRequiredSkill('all')
    setLocation('all')
    setMaxDistance(25)
    setAvailableDate('')
    setMinRating(4.0)
    setAppliedCriteria({
      category: '',
      region: '',
      minRating: 4.0,
      maxHourlyRate: 300,
      requiredCertification: '',
      availabilityDate: '',
    })
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
            <span className='text-[11px] text-muted-foreground font-medium -mt-1'>Algorithmic Matching</span>
          </div>
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)] p-6 space-y-6'>
        {/* Title */}
        <div className='border-b pb-4'>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5'>
            Provider Search & Matching
            <Badge className='bg-blue-50 text-blue-700 border-blue-200 font-semibold px-2.5 py-0.5 text-xs'>
              AI Engine
            </Badge>
          </h1>
          <p className='text-muted-foreground text-sm mt-0.5'>
            Find and rank qualified service providers based on required skill, location distance, ratings, and availability date.
          </p>
        </div>

        {/* Wireframe Search Form Card */}
        <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
          <CardHeader className='pb-3 border-b border-slate-100 dark:border-slate-800'>
            <CardTitle className='text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between'>
              <span className='flex items-center gap-2'>
                <Filter className='h-4 w-4 text-blue-600' /> Search Criteria
              </span>
              <Button variant='ghost' size='sm' onClick={handleReset} className='h-7 text-xs text-slate-500 gap-1'>
                <RefreshCw className='h-3 w-3' /> Reset Form
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className='p-6'>
            <form onSubmit={handleSearch} className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {/* 1. Required Skill */}
                <div className='space-y-2'>
                  <Label className='text-xs font-semibold uppercase text-slate-500'>Required Skill / Category</Label>
                  <Select value={requiredSkill} onValueChange={setRequiredSkill}>
                    <SelectTrigger className='bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'>
                      <SelectValue placeholder='Select Skill' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Skills (Any)</SelectItem>
                      <SelectItem value='Maintenance'>Maintenance</SelectItem>
                      <SelectItem value='Inspection'>Inspection</SelectItem>
                      <SelectItem value='Valuation'>Valuation</SelectItem>
                      <SelectItem value='Legal'>Legal</SelectItem>
                      <SelectItem value='Logistics'>Logistics</SelectItem>
                      <SelectItem value='Insurance'>Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Location */}
                <div className='space-y-2'>
                  <Label className='text-xs font-semibold uppercase text-slate-500'>Location / Region</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className='bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'>
                      <SelectValue placeholder='Select Location' />
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

                {/* 3. Maximum Distance */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-xs font-semibold uppercase text-slate-500'>Maximum Distance</Label>
                    <span className='font-bold text-xs text-blue-600'>{maxDistance} Miles</span>
                  </div>
                  <Select
                    value={maxDistance.toString()}
                    onValueChange={(v) => setMaxDistance(Number(v))}
                  >
                    <SelectTrigger className='bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='15'>Within 15 Miles</SelectItem>
                      <SelectItem value='25'>Within 25 Miles</SelectItem>
                      <SelectItem value='50'>Within 50 Miles</SelectItem>
                      <SelectItem value='100'>Within 100 Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Available Date */}
                <div className='space-y-2'>
                  <Label htmlFor='avail-date' className='text-xs font-semibold uppercase text-slate-500'>Available Date</Label>
                  <div className='relative'>
                    <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                    <Input
                      id='avail-date'
                      type='date'
                      value={availableDate}
                      onChange={(e) => setAvailableDate(e.target.value)}
                      className='pl-9 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                    />
                  </div>
                </div>
              </div>

              {/* Submit Primary Blue Button */}
              <div className='pt-2 flex justify-end'>
                <Button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 shadow-sm gap-2'>
                  <Search className='h-4 w-4' /> Search Providers
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Provider Results List */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2'>
              Matched Providers
              <Badge variant='secondary' className='rounded-full px-2.5 font-semibold text-xs'>
                {matchResults.length} Found
              </Badge>
            </h2>
            <span className='text-xs text-slate-500'>Ranked by overall match percentage</span>
          </div>

          {matchResults.length === 0 ? (
            <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
              <CardContent className='h-44 flex items-center justify-center text-slate-500'>
                No service providers match the criteria specified. Try broadening your search.
              </CardContent>
            </Card>
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {matchResults.map(({ provider, matchScore, matchReasons }) => (
                <Card
                  key={provider.id}
                  className='border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900 shadow-sm bg-white dark:bg-card rounded-xl overflow-hidden transition-all'
                >
                  <CardContent className='p-5 space-y-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex items-start gap-3.5'>
                        <Avatar className='h-12 w-12 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0'>
                          <AvatarImage src={provider.avatar} alt={provider.companyName} />
                          <AvatarFallback className='bg-blue-50 text-blue-700 font-bold'>
                            {provider.companyName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className='space-y-1'>
                          <div className='flex items-center gap-2 flex-wrap'>
                            <Link
                              to='/provider-coordination/providers/$providerId'
                              params={{ providerId: provider.id }}
                              className='font-bold text-base text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors'
                            >
                              {provider.companyName}
                            </Link>
                          </div>

                          <p className='text-xs text-slate-500 flex items-center gap-2 flex-wrap'>
                            <Badge variant='outline' className='text-[10px] font-normal py-0 bg-slate-50 dark:bg-slate-900'>
                              {provider.category}
                            </Badge>
                            <span>•</span>
                            <span className='flex items-center gap-1 text-slate-600 dark:text-slate-400'>
                              <MapPin className='h-3 w-3 text-blue-600' /> {maxDistance} miles away ({provider.region})
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Match Score */}
                      <Badge className='bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shrink-0'>
                        {matchScore}% Match
                      </Badge>
                    </div>

                    {/* Key Stats Row */}
                    <div className='grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-50/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center text-xs'>
                      <div>
                        <span className='text-slate-400 block text-[10px] uppercase font-semibold'>Rating</span>
                        <span className='font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5 mt-0.5'>
                          <Star className='h-3 w-3 fill-amber-400 text-amber-400' /> {provider.rating}
                        </span>
                      </div>
                      <div>
                        <span className='text-slate-400 block text-[10px] uppercase font-semibold'>Verification</span>
                        <span className='font-bold text-green-700 dark:text-green-400 block mt-0.5 capitalize'>
                          {provider.status}
                        </span>
                      </div>
                      <div>
                        <span className='text-slate-400 block text-[10px] uppercase font-semibold'>Jobs Done</span>
                        <span className='font-bold text-slate-800 dark:text-slate-200 block mt-0.5'>
                          {provider.completedJobs} Jobs
                        </span>
                      </div>
                    </div>

                    {/* Match Reasons Badges */}
                    <div className='flex flex-wrap gap-1.5'>
                      {matchReasons.map((reason, idx) => (
                        <span
                          key={idx}
                          className='inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded'
                        >
                          <CheckCircle2 className='h-3 w-3 text-green-600' />
                          {reason}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className='pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs'>
                      <span className='text-slate-500'>
                        Rate: <strong className='text-slate-800 dark:text-slate-200'>${provider.hourlyRate}/hr</strong>
                      </span>

                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='h-8 text-xs border-slate-200 dark:border-slate-800'
                          onClick={() => handleOpenAssign(provider)}
                        >
                          <UserCheck className='h-3.5 w-3.5 mr-1 text-blue-600' /> Assign Rep
                        </Button>

                        <Link
                          to='/provider-coordination/providers/$providerId'
                          params={{ providerId: provider.id }}
                        >
                          <Button size='sm' className='h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium gap-1'>
                            View Profile <ArrowRight className='h-3.5 w-3.5' />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Assign Representative Dialog */}
        <AssignRepresentativeDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          provider={targetProvider}
        />
      </Main>
    </>
  )
}
