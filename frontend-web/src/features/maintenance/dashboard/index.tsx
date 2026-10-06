import { Link } from '@tanstack/react-router'
import {
  Wrench,
  FileCheck2,
  Receipt,
  Scale,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function MaintenanceDashboard() {
  return (
    <>
      <Header>
        <div className='flex items-center gap-2 font-semibold text-lg me-auto'>
          <Wrench className='h-5 w-5 text-primary' />
          <span>AssetBridge AI — Maintenance & Quotation Control Center</span>
          <span className='rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
            Member 3
          </span>
        </div>
        <Search />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-6'>
        {/* Welcome & Context Banner */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight'>
              Maintenance & Quotation Management
            </h1>
            <p className='text-muted-foreground text-sm mt-1'>
              Component C: Inspection processing, multi-quote evaluation, budget
              compliance, and autonomous Agent 3 recommendations.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Link to='/quotations/compare'>
              <Button className='gap-2 shadow-sm'>
                <Scale className='h-4 w-4' />
                Compare Quotations (AI)
              </Button>
            </Link>
            <Link to='/inspections'>
              <Button variant='outline' className='gap-2'>
                <FileCheck2 className='h-4 w-4' />
                Inspect Incident
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Metric KPI Cards matching wireframe A1 (Page 18) */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='border-l-4 border-l-blue-500 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Active Inspections
              </CardTitle>
              <ClipboardList className='h-5 w-5 text-blue-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>8</div>
              <p className='text-xs text-muted-foreground mt-1'>
                <span className='font-semibold text-blue-600'>+2 new</span>{' '}
                submitted today
              </p>
            </CardContent>
          </Card>

          <Card className='border-l-4 border-l-amber-500 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Pending Quotations
              </CardTitle>
              <Receipt className='h-5 w-5 text-amber-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>5</div>
              <p className='text-xs text-muted-foreground mt-1'>
                <span className='font-semibold text-amber-600'>3 bids</span>{' '}
                awaiting AI recommendation
              </p>
            </CardContent>
          </Card>

          <Card className='border-l-4 border-l-purple-500 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Jobs In Progress
              </CardTitle>
              <Clock className='h-5 w-5 text-purple-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>3</div>
              <p className='text-xs text-muted-foreground mt-1'>
                JOB-101 Kandy House currently at 60%
              </p>
            </CardContent>
          </Card>

          <Card className='border-l-4 border-l-emerald-500 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Completed Jobs
              </CardTitle>
              <CheckCircle2 className='h-5 w-5 text-emerald-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>12</div>
              <p className='text-xs text-muted-foreground mt-1'>
                LKR 78,500 total saved vs owner budget
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Highlight Banner: Active Incident & AI Recommendation Status */}
        <Card className='bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/30 shadow-md'>
          <CardHeader className='pb-3'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <span className='flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse' />
                <span className='text-xs font-semibold uppercase tracking-wider text-primary'>
                  AI Agent 3 Active Recommendation
                </span>
              </div>
              <span className='rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary'>
                Incident: INC-1021 | Kandy House
              </span>
            </div>
            <CardTitle className='text-xl mt-1'>
              Kitchen Water Leakage — Recommendation Ready for Provider A
            </CardTitle>
            <CardDescription>
              Owner Budget:{' '}
              <strong className='text-foreground'>LKR 75,000</strong> |
              Recommended Bid:{' '}
              <strong className='text-emerald-600 font-bold'>
                LKR 38,000 (ABC Plumbing)
              </strong>{' '}
              | Savings: <strong>LKR 37,000 (49.3%)</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap items-center gap-3 pt-0'>
            <Link to='/quotations/compare'>
              <Button size='sm' className='gap-2'>
                <Sparkles className='h-4 w-4' />
                Review AI Proposal & Matrix
                <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
            <Link to='/inspections'>
              <Button size='sm' variant='outline'>
                View Inspection INS-1021
              </Button>
            </Link>
            <Link to='/maintenance/ai-agent'>
              <Button size='sm' variant='secondary' className='gap-2'>
                <ShieldCheck className='h-4 w-4 text-primary' />
                Inspect RAG Safety & Norms
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 2-Column: Recent Activities & Navigation Hub */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Recent Maintenance Activities */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center justify-between'>
                <span>Recent Activities</span>
                <span className='text-xs font-normal text-muted-foreground'>
                  Real-time audit log
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-start gap-3 rounded-lg border p-3 bg-muted/40'>
                  <AlertTriangle className='h-5 w-5 text-amber-500 mt-0.5 shrink-0' />
                  <div className='flex-1 text-sm'>
                    <div className='font-medium flex items-center justify-between'>
                      <span>Water leakage reported — Kandy House</span>
                      <span className='text-xs text-muted-foreground'>
                        10 mins ago
                      </span>
                    </div>
                    <p className='text-muted-foreground text-xs mt-0.5'>
                      Inspection INS-1021 submitted by Representative Nimal
                      Perera. High moisture detected.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 rounded-lg border p-3'>
                  <Receipt className='h-5 w-5 text-blue-500 mt-0.5 shrink-0' />
                  <div className='flex-1 text-sm'>
                    <div className='font-medium flex items-center justify-between'>
                      <span>Quotation submitted — QuickFix Plumbing</span>
                      <span className='text-xs text-muted-foreground'>
                        2 hours ago
                      </span>
                    </div>
                    <p className='text-muted-foreground text-xs mt-0.5'>
                      Bid of LKR 42,000 received for INC-1021. Evaluated by Agent
                      3.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 rounded-lg border p-3'>
                  <CheckCircle2 className='h-5 w-5 text-emerald-500 mt-0.5 shrink-0' />
                  <div className='flex-1 text-sm'>
                    <div className='font-medium flex items-center justify-between'>
                      <span>AC Servicing Completed — Colombo Apt</span>
                      <span className='text-xs text-muted-foreground'>
                        5 hours ago
                      </span>
                    </div>
                    <p className='text-muted-foreground text-xs mt-0.5'>
                      JOB-102 verified: 120 PSI pressure test reading logged & 6
                      month warranty active.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 rounded-lg border p-3'>
                  <TrendingUp className='h-5 w-5 text-primary mt-0.5 shrink-0' />
                  <div className='flex-1 text-sm'>
                    <div className='font-medium flex items-center justify-between'>
                      <span>Material Catalog Updated</span>
                      <span className='text-xs text-muted-foreground'>
                        1 day ago
                      </span>
                    </div>
                    <p className='text-muted-foreground text-xs mt-0.5'>
                      PPR 25mm pipes & RCBO breaker rates indexed with Sri Lanka
                      regional standards.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access to Member 3 Functional Areas */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>
                Member 3 Functional Workflows
              </CardTitle>
              <CardDescription>
                Direct access to all 7 core modules & wireframes
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-3 sm:grid-cols-2'>
              <Link
                to='/inspections'
                className='flex flex-col rounded-lg border p-3 hover:border-primary hover:bg-accent/40 transition-colors'
              >
                <div className='flex items-center gap-2 font-medium text-sm'>
                  <FileCheck2 className='h-4 w-4 text-blue-500' />
                  <span>Inspections</span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  Review damage findings, photos & trade recommendations
                </p>
              </Link>

              <Link
                to='/quotations'
                className='flex flex-col rounded-lg border p-3 hover:border-primary hover:bg-accent/40 transition-colors'
              >
                <div className='flex items-center gap-2 font-medium text-sm'>
                  <Receipt className='h-4 w-4 text-amber-500' />
                  <span>Quotation List</span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  Manage incoming provider bids and itemized breakdowns
                </p>
              </Link>

              <Link
                to='/quotations/compare'
                className='flex flex-col rounded-lg border p-3 hover:border-primary hover:bg-accent/40 transition-colors'
              >
                <div className='flex items-center gap-2 font-medium text-sm'>
                  <Scale className='h-4 w-4 text-emerald-500' />
                  <span>Quotation Comparison</span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  Multi-quote side-by-side analysis with AI Agent 3
                </p>
              </Link>

              <Link
                to='/maintenance/jobs'
                className='flex flex-col rounded-lg border p-3 hover:border-primary hover:bg-accent/40 transition-colors'
              >
                <div className='flex items-center gap-2 font-medium text-sm'>
                  <Clock className='h-4 w-4 text-purple-500' />
                  <span>Job Progress</span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  Track on-site repair timeline & sign-off completion
                </p>
              </Link>

              <Link
                to='/maintenance/catalog'
                className='flex flex-col rounded-lg border p-3 hover:border-primary hover:bg-accent/40 transition-colors'
              >
                <div className='flex items-center gap-2 font-medium text-sm'>
                  <Package className='h-4 w-4 text-indigo-500' />
                  <span>Price Book Catalog</span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  Regional material norms & certified trade rates
                </p>
              </Link>

              <Link
                to='/maintenance/reports'
                className='flex flex-col rounded-lg border p-3 hover:border-primary hover:bg-accent/40 transition-colors'
              >
                <div className='flex items-center gap-2 font-medium text-sm'>
                  <TrendingUp className='h-4 w-4 text-rose-500' />
                  <span>Reports & Analytics</span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  Cost trend charts, spend by category & ROI metrics
                </p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
