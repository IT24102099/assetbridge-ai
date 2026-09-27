import {
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  Download,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
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
import { ThemeSwitch } from '@/components/theme-switch'

const COST_TREND_DATA = [
  { month: 'Apr', spend: 45000, jobs: 2 },
  { month: 'May', spend: 62000, jobs: 4 },
  { month: 'Jun', spend: 38000, jobs: 2 },
  { month: 'Jul', spend: 84000, jobs: 5 },
  { month: 'Aug', spend: 52500, jobs: 3 },
  { month: 'Sep', spend: 74500, jobs: 4 },
]

const CATEGORY_DATA = [
  { type: 'Plumbing', count: 9, percentage: 45, color: '#3b82f6', spend: 168000 },
  { type: 'Electrical', count: 4, percentage: 20, color: '#f59e0b', spend: 78000 },
  { type: 'HVAC / AC', count: 3, percentage: 15, color: '#10b981', spend: 46500 },
  { type: 'Roofing', count: 2, percentage: 10, color: '#8b5cf6', spend: 39000 },
  { type: 'Masonry', count: 2, percentage: 10, color: '#ec4899', spend: 24500 },
]

export function MaintenanceReportsFeature() {
  return (
    <>
      <Header>
        <div className='flex items-center gap-2 font-semibold text-lg me-auto'>
          <TrendingUp className='h-5 w-5 text-primary' />
          <span>Maintenance Reports & Cost Analytics</span>
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-6'>
        {/* Top Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight'>
              Maintenance Reports & Analytics
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Financial expenditure trends, trade volume distributions, and owner
              budget efficiency KPIs.
            </p>
          </div>
          <Button variant='outline' className='gap-2 shadow-sm'>
            <Download className='h-4 w-4' />
            Generate PDF Report
          </Button>
        </div>

        {/* 4 KPI Cards matching Wireframe A7 */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Completed Jobs
              </CardTitle>
              <CheckCircle2 className='h-5 w-5 text-emerald-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>15</div>
              <p className='text-xs text-muted-foreground mt-1'>
                100% verified with on-site photos
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Active / In Progress
              </CardTitle>
              <Clock className='h-5 w-5 text-blue-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold'>3</div>
              <p className='text-xs text-muted-foreground mt-1'>
                Avg. resolution time: 2.4 days
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Total Maintenance Spend
              </CardTitle>
              <DollarSign className='h-5 w-5 text-purple-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-foreground'>
                LKR 285,500
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                Over 6-month tracking window
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm border-l-4 border-l-emerald-500'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                Budget Saved by Agent 3
              </CardTitle>
              <TrendingUp className='h-5 w-5 text-emerald-500' />
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-emerald-600'>
                LKR 78,500
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                21.5% below owner allocated budgets
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 2 Charts Grid matching Wireframe A7 */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Chart 1: Maintenance Cost Trend (LKR) */}
          <Card className='shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg flex items-center justify-between'>
                <span>Maintenance Cost Trend (LKR)</span>
                <span className='text-xs font-normal text-muted-foreground'>
                  Monthly expenditure
                </span>
              </CardTitle>
              <CardDescription>
                Historical monthly repair & replacement outlays
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-72 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={COST_TREND_DATA}>
                    <defs>
                      <linearGradient id='spendGrad' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='5%'
                          stopColor='#3b82f6'
                          stopOpacity={0.4}
                        />
                        <stop
                          offset='95%'
                          stopColor='#3b82f6'
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' opacity={0.2} />
                    <XAxis dataKey='month' fontSize={12} />
                    <YAxis
                      fontSize={11}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <Tooltip
                      formatter={(v: any) => [
                        `LKR ${Number(v).toLocaleString()}`,
                        'Total Spend',
                      ]}
                    />
                    <Area
                      type='monotone'
                      dataKey='spend'
                      stroke='#3b82f6'
                      strokeWidth={2}
                      fillOpacity={1}
                      fill='url(#spendGrad)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Top Maintenance Types Distribution */}
          <Card className='shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg flex items-center justify-between'>
                <span>Top Maintenance Incident Types</span>
                <span className='text-xs font-normal text-muted-foreground'>
                  Volume by trade
                </span>
              </CardTitle>
              <CardDescription>
                Plumbing accounts for 45% of total remote owner issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-72 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={CATEGORY_DATA} layout='vertical'>
                    <CartesianGrid strokeDasharray='3 3' opacity={0.2} />
                    <XAxis
                      type='number'
                      unit='%'
                      domain={[0, 50]}
                      fontSize={11}
                    />
                    <YAxis
                      type='category'
                      dataKey='type'
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Share of Incidents']}
                    />
                    <Bar dataKey='percentage' radius={[0, 4, 4, 0]}>
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown Table */}
        <Card className='shadow-sm'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg'>
              Trade Category Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <table className='w-full text-left text-sm'>
              <thead className='border-y bg-muted/40 text-xs uppercase text-muted-foreground'>
                <tr>
                  <th className='py-3 px-4 font-semibold'>Trade Category</th>
                  <th className='py-3 px-4 font-semibold'>Total Incidents</th>
                  <th className='py-3 px-4 font-semibold'>Volume Share</th>
                  <th className='py-3 px-4 font-semibold'>Total Spent</th>
                  <th className='py-3 px-4 font-semibold'>Avg Cost per Job</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {CATEGORY_DATA.map((cat) => (
                  <tr key={cat.type} className='hover:bg-muted/30'>
                    <td className='py-3 px-4 font-medium flex items-center gap-2'>
                      <span
                        className='h-3 w-3 rounded-full'
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.type}</span>
                    </td>
                    <td className='py-3 px-4'>{cat.count} jobs</td>
                    <td className='py-3 px-4 font-semibold'>{cat.percentage}%</td>
                    <td className='py-3 px-4 font-bold text-foreground'>
                      LKR {cat.spend.toLocaleString()}
                    </td>
                    <td className='py-3 px-4 text-muted-foreground'>
                      LKR {Math.round(cat.spend / cat.count).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
