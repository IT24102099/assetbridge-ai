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
  Sparkles,
  AlertTriangle,
  Bot,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProviderCoordination } from '../context/use-provider-coordination'
import type { ProviderMatchCriteria, ServiceProvider } from '../types'
import { AssignRepresentativeDialog } from './assign-representative-dialog'
import {
  runProviderIntelligenceAgentApi,
  type AgentRecommendationResponse,
} from '../services/provider-coordination-api'

export function ProviderMatching() {
  const { runMatchingEngine, providers } = useProviderCoordination()

  // Mode tab: deterministic vs ai-agent
  const [activeTab, setActiveTab] = useState<'deterministic' | 'ai-agent'>('deterministic')

  // Deterministic Form inputs
  const [requiredSkill, setRequiredSkill] = useState<string>('all')
  const [location, setLocation] = useState<string>('all')
  const [maxDistance, setMaxDistance] = useState<number>(25)
  const [availableDate, setAvailableDate] = useState<string>('')
  const [minRating] = useState<number>(4.0)

  // AI Agent Form inputs
  const [maintenanceRequirement, setMaintenanceRequirement] = useState<string>(
    'Cooling system compressor failure in main cold storage warehouse, urgent HVAC technician required.'
  )
  const [aiSkill, setAiSkill] = useState<string>('Maintenance')
  const [aiLocation, setAiLocation] = useState<string>('North Region')
  const [aiDate, setAiDate] = useState<string>('2026-10-06')
  const [aiLoading, setAiLoading] = useState<boolean>(false)
  const [aiResponse, setAiResponse] = useState<AgentRecommendationResponse | null>(null)

  // Applied criteria for deterministic search
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

  const handleDeterministicSearch = (e: React.FormEvent) => {
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

  const handleRunAiAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    setAiLoading(true)
    const result = await runProviderIntelligenceAgentApi({
      maintenanceRequirement,
      requiredSkill: aiSkill === 'all' ? undefined : aiSkill,
      location: aiLocation === 'all' ? undefined : aiLocation,
      requiredDate: aiDate || undefined,
    })
    setAiResponse(result)
    setAiLoading(false)
  }

  const matchResults = useMemo(() => {
    return runMatchingEngine(appliedCriteria)
  }, [appliedCriteria, runMatchingEngine])

  const handleOpenAssign = (prov: ServiceProvider) => {
    setTargetProvider(prov)
    setAssignDialogOpen(true)
  }

  const handleResetDeterministic = () => {
    setRequiredSkill('all')
    setLocation('all')
    setMaxDistance(25)
    setAvailableDate('')
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
            <span className='text-[11px] text-muted-foreground font-medium -mt-1'>Provider Intelligence</span>
          </div>
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)] p-6 space-y-6'>
        {/* Title */}
        <div className='border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5'>
              Provider Matching & Intelligence
              <Badge className='bg-blue-600 text-white font-semibold px-2.5 py-0.5 text-xs'>
                Member 2 Module
              </Badge>
            </h1>
            <p className='text-muted-foreground text-sm mt-0.5'>
              Evaluate, rank, and match service providers using deterministic business rules and Agentic AI recommendation.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'deterministic' | 'ai-agent')} className='w-full md:w-auto'>
            <TabsList className='bg-slate-200/70 dark:bg-slate-800 p-1'>
              <TabsTrigger value='deterministic' className='text-xs font-semibold gap-1.5 px-4'>
                <Filter className='h-3.5 w-3.5' /> Deterministic Matching
              </TabsTrigger>
              <TabsTrigger value='ai-agent' className='text-xs font-semibold gap-1.5 px-4 text-blue-700 dark:text-blue-400'>
                <Bot className='h-3.5 w-3.5' /> Provider Intelligence Agent
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* TAB 1: DETERMINISTIC MATCHING ENGINE */}
        {activeTab === 'deterministic' && (
          <div className='space-y-6'>
            <Card className='border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card rounded-xl'>
              <CardHeader className='pb-3 border-b border-slate-100 dark:border-slate-800'>
                <CardTitle className='text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between'>
                  <span className='flex items-center gap-2'>
                    <Filter className='h-4 w-4 text-blue-600' /> Deterministic Rule Criteria
                  </span>
                  <Button variant='ghost' size='sm' onClick={handleResetDeterministic} className='h-7 text-xs text-slate-500 gap-1'>
                    <RefreshCw className='h-3 w-3' /> Reset Criteria
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent className='p-6'>
                <form onSubmit={handleDeterministicSearch} className='space-y-4'>
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

                  <div className='pt-2 flex justify-end'>
                    <Button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 shadow-sm gap-2'>
                      <Search className='h-4 w-4' /> Run Deterministic Search
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Deterministic Results List */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2'>
                  Matched Providers
                  <Badge variant='secondary' className='rounded-full px-2.5 font-semibold text-xs'>
                    {matchResults.length} Found
                  </Badge>
                </h2>
                <span className='text-xs text-slate-500'>Deterministic Rule Engine</span>
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
          </div>
        )}

        {/* TAB 2: PROVIDER INTELLIGENCE AGENT */}
        {activeTab === 'ai-agent' && (
          <div className='space-y-6'>
            <Card className='border border-blue-200 dark:border-blue-900 shadow-md bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:to-slate-950 rounded-xl overflow-hidden'>
              <CardHeader className='pb-3 border-b border-blue-100 dark:border-slate-800 bg-blue-50/80 dark:bg-slate-900/80'>
                <CardTitle className='text-base font-bold text-blue-950 dark:text-blue-100 flex items-center justify-between'>
                  <span className='flex items-center gap-2'>
                    <Bot className='h-5 w-5 text-blue-600 dark:text-blue-400' /> Provider Intelligence Agent
                  </span>
                  <Badge className='bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5'>
                    Agentic AI Executable
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className='p-6'>
                <form onSubmit={handleRunAiAgent} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='maint-req' className='text-xs font-bold uppercase text-slate-700 dark:text-slate-300'>
                      Maintenance Requirement / Issue Description
                    </Label>
                    <textarea
                      id='maint-req'
                      rows={3}
                      value={maintenanceRequirement}
                      onChange={(e) => setMaintenanceRequirement(e.target.value)}
                      placeholder='Describe the asset maintenance requirement, breakdown severity, and equipment context...'
                      className='w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>

                  <div className='grid gap-4 sm:grid-cols-3'>
                    <div className='space-y-2'>
                      <Label className='text-xs font-semibold uppercase text-slate-500'>Required Category</Label>
                      <Select value={aiSkill} onValueChange={setAiSkill}>
                        <SelectTrigger className='bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'>
                          <SelectValue placeholder='Select Category' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All Categories</SelectItem>
                          <SelectItem value='Maintenance'>Maintenance</SelectItem>
                          <SelectItem value='Inspection'>Inspection</SelectItem>
                          <SelectItem value='Valuation'>Valuation</SelectItem>
                          <SelectItem value='Legal'>Legal</SelectItem>
                          <SelectItem value='Logistics'>Logistics</SelectItem>
                          <SelectItem value='Insurance'>Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-xs font-semibold uppercase text-slate-500'>Target Location</Label>
                      <Select value={aiLocation} onValueChange={setAiLocation}>
                        <SelectTrigger className='bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'>
                          <SelectValue placeholder='Select Region' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All Regions</SelectItem>
                          <SelectItem value='North Region'>North Region</SelectItem>
                          <SelectItem value='South Region'>South Region</SelectItem>
                          <SelectItem value='East Region'>East Region</SelectItem>
                          <SelectItem value='West Region'>West Region</SelectItem>
                          <SelectItem value='Central Region'>Central Region</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='ai-date' className='text-xs font-semibold uppercase text-slate-500'>Required Date</Label>
                      <Input
                        id='ai-date'
                        type='date'
                        value={aiDate}
                        onChange={(e) => setAiDate(e.target.value)}
                        className='bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                      />
                    </div>
                  </div>

                  <div className='pt-2 flex justify-end'>
                    <Button
                      type='submit'
                      disabled={aiLoading || !maintenanceRequirement.trim()}
                      className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-md gap-2'
                    >
                      <Sparkles className={`h-4 w-4 ${aiLoading ? 'animate-spin' : ''}`} />
                      {aiLoading ? 'Agent Reasoning & Evaluating Tools...' : 'Execute Provider Intelligence Agent'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* AI Agent Recommendation Output */}
            {aiResponse && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between border-b pb-2'>
                  <div className='flex items-center gap-2'>
                    <Bot className='h-5 w-5 text-blue-600' />
                    <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
                      Agent Recommendations & Analysis
                    </h2>
                    <Badge variant='outline' className='text-xs font-mono bg-blue-50 text-blue-700 border-blue-200'>
                      Run ID: {aiResponse.agentRunId}
                    </Badge>
                  </div>
                  <span className='text-xs text-slate-500 font-mono'>
                    Timestamp: {new Date(aiResponse.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {aiResponse.warnings.length > 0 && (
                  <div className='p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs space-y-1'>
                    <div className='font-bold flex items-center gap-1.5'>
                      <AlertTriangle className='h-4 w-4 text-amber-600' /> Agent Warning / Missing Input Criteria:
                    </div>
                    {aiResponse.warnings.map((w, idx) => (
                      <p key={idx} className='pl-5.5'>• {w}</p>
                    ))}
                  </div>
                )}

                <div className='grid gap-4 md:grid-cols-2'>
                  {aiResponse.recommendations.map((rec) => {
                    const matchedProviderObj = providers.find((p) => p.id === rec.providerId)
                    return (
                      <Card
                        key={rec.providerId}
                        className='border border-blue-200 dark:border-blue-900 hover:border-blue-400 shadow-md bg-white dark:bg-card rounded-xl overflow-hidden transition-all'
                      >
                        <CardHeader className='pb-2 bg-gradient-to-r from-blue-50/80 to-transparent dark:from-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
                          <div>
                            <CardTitle className='text-base font-bold text-slate-900 dark:text-slate-100'>
                              {rec.providerName}
                            </CardTitle>
                            <span className='text-xs text-slate-500 flex items-center gap-1 mt-0.5'>
                              <MapPin className='h-3 w-3 text-blue-600' /> Distance: {rec.distanceKm} km
                            </span>
                          </div>

                          <div className='text-right'>
                            <Badge className='bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full'>
                              {Math.round(rec.matchScore * 100)}% AI Score
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className='p-5 space-y-3.5 text-xs'>
                          {/* Rating & Status Row */}
                          <div className='flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800'>
                            <div className='flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400'>
                              <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' /> {rec.rating} / 5.0
                            </div>
                            <div className='flex items-center gap-2'>
                              <Badge
                                variant='outline'
                                className={`text-[10px] font-bold ${
                                  rec.availability === 'AVAILABLE'
                                    ? 'bg-green-50 text-green-700 border-green-300'
                                    : 'bg-amber-50 text-amber-700 border-amber-300'
                                }`}
                              >
                                {rec.availability}
                              </Badge>
                              <Badge variant='outline' className='text-[10px] font-bold bg-blue-50 text-blue-700 border-blue-300'>
                                {rec.verificationStatus}
                              </Badge>
                            </div>
                          </div>

                          {/* Agent Reasons */}
                          <div className='space-y-1.5'>
                            <span className='font-bold text-slate-700 dark:text-slate-300 block text-[11px] uppercase tracking-wider'>
                              Agent Rationale & Reasons:
                            </span>
                            <div className='space-y-1'>
                              {rec.reasons.map((r, idx) => (
                                <div key={idx} className='flex items-start gap-1.5 text-slate-700 dark:text-slate-300'>
                                  <CheckCircle2 className='h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5' />
                                  <span>{r}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Relevant Experience */}
                          <div className='pt-1 text-slate-600 dark:text-slate-400'>
                            <strong className='text-slate-800 dark:text-slate-200'>Relevant Experience:</strong> {rec.relevantExperience}
                          </div>

                          {/* Item Warnings if any */}
                          {rec.warnings && rec.warnings.length > 0 && (
                            <div className='p-2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] space-y-0.5'>
                              {rec.warnings.map((w, idx) => (
                                <div key={idx} className='flex items-center gap-1'>
                                  <AlertTriangle className='h-3 w-3 text-amber-600 shrink-0' /> {w}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action button */}
                          <div className='pt-2 flex justify-end border-t border-slate-100 dark:border-slate-800'>
                            <Button
                              size='sm'
                              className='h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium gap-1'
                              onClick={() => {
                                if (matchedProviderObj) {
                                  handleOpenAssign(matchedProviderObj)
                                }
                              }}
                            >
                              <UserCheck className='h-3.5 w-3.5' /> Review & Assign Provider
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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
