import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Scale,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Star,
  DollarSign,
  BookOpen,
  Send,
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
import { maintenanceApi } from '../api'
import { QuotationItem } from '../types'

export function QuotationComparisonFeature() {
  const [quotations, setQuotations] = useState<QuotationItem[]>([])
  const [selectedProviderId, setSelectedProviderId] = useState<string>('PRV-001')
  const [isSubmittedForApproval, setIsSubmittedForApproval] = useState(false)
  const ownerBudget = 75000

  useEffect(() => {
    maintenanceApi.getQuotations('INC-1021').then((data) => {
      setQuotations(data)
    })
  }, [])

  const recommendedQuote = quotations.find((q) => q.isAiRecommended) || quotations[0]

  const handleSelectAndSubmit = (providerId: string) => {
    setSelectedProviderId(providerId)
    setIsSubmittedForApproval(true)
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-2 font-semibold text-lg me-auto'>
          <Scale className='h-5 w-5 text-primary' />
          <span>Quotation Comparison & AI Recommendation Engine</span>
        </div>
        <Search />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-6'>
        {/* Breadcrumb / Top Info */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground mb-1'>
              <Link to='/quotations' className='hover:underline'>
                Quotations
              </Link>
              <span>/</span>
              <span>Compare Incident Bids</span>
            </div>
            <h1 className='text-3xl font-extrabold tracking-tight'>
              Quotation Comparison — Incident INC-1021
            </h1>
            <p className='text-sm text-muted-foreground mt-0.5'>
              Asset: <strong>Kandy House</strong> (123, Peradeniya Road) | Target
              Work: <strong>Kitchen Pipe Leak Repair</strong>
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Link to='/maintenance/ai-agent'>
              <Button variant='outline' className='gap-2'>
                <Sparkles className='h-4 w-4 text-primary' />
                Inspect AI Tool Calls
              </Button>
            </Link>
          </div>
        </div>

        {/* Owner Budget Banner */}
        <div className='rounded-xl border bg-card p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='rounded-lg bg-emerald-500/10 p-2.5 text-emerald-600'>
              <DollarSign className='h-6 w-6' />
            </div>
            <div>
              <div className='text-xs uppercase tracking-wider text-muted-foreground font-semibold'>
                Owner Incident Budget Allocation
              </div>
              <div className='text-2xl font-bold text-foreground'>
                LKR {ownerBudget.toLocaleString()}
              </div>
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-4 text-xs'>
            <div className='rounded-lg border p-2 bg-muted/40'>
              <span className='text-muted-foreground'>Lowest Quote:</span>{' '}
              <strong className='text-emerald-600'>LKR 38,000</strong>
            </div>
            <div className='rounded-lg border p-2 bg-muted/40'>
              <span className='text-muted-foreground'>Potential Savings:</span>{' '}
              <strong className='text-emerald-600'>LKR 37,000 (49.3%)</strong>
            </div>
            <div className='rounded-lg border p-2 bg-muted/40'>
              <span className='text-muted-foreground'>Bids Compared:</span>{' '}
              <strong>3 Verified Providers</strong>
            </div>
          </div>
        </div>

        {/* Wireframe A4: Side-by-Side Comparison Matrix */}
        <Card className='shadow-sm overflow-hidden'>
          <CardHeader className='pb-3 border-b bg-muted/20'>
            <CardTitle className='text-lg flex items-center justify-between'>
              <span>Contractor Evaluation Matrix</span>
              <span className='text-xs font-normal text-muted-foreground'>
                Deterministic multi-criteria scoring + AI recommendation
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm border-collapse'>
                <thead>
                  <tr className='border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground'>
                    <th className='py-4 px-4 w-48'>Metric / Criteria</th>
                    {quotations.map((q) => (
                      <th
                        key={q.id}
                        className={`py-4 px-4 min-w-[220px] ${
                          q.isAiRecommended
                            ? 'bg-primary/10 border-x border-primary/30 text-foreground'
                            : ''
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <span className='font-bold text-sm text-foreground'>
                            {q.providerName}
                          </span>
                          {q.isAiRecommended && (
                            <span className='rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground'>
                              AI PICK
                            </span>
                          )}
                        </div>
                        <div className='text-[11px] font-normal text-muted-foreground mt-0.5'>
                          {q.id}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y text-xs sm:text-sm'>
                  {/* Estimated Cost */}
                  <tr className='hover:bg-muted/10'>
                    <td className='py-3.5 px-4 font-semibold text-muted-foreground'>
                      Estimated Cost (LKR)
                    </td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={`py-3.5 px-4 ${
                          q.isAiRecommended
                            ? 'bg-primary/5 border-x border-primary/20 font-bold'
                            : ''
                        }`}
                      >
                        <span className='text-base font-extrabold text-foreground'>
                          LKR {q.amountLkr.toLocaleString()}
                        </span>
                        <div className='text-xs text-emerald-600 font-medium mt-0.5'>
                          {q.amountLkr <= ownerBudget ? (
                            <span>
                              ✓ Within budget (-
                              {(
                                ((ownerBudget - q.amountLkr) / ownerBudget) *
                                100
                              ).toFixed(0)}
                              %)
                            </span>
                          ) : (
                            <span className='text-red-600'>Exceeds budget</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Execution Timeline */}
                  <tr className='hover:bg-muted/10'>
                    <td className='py-3.5 px-4 font-semibold text-muted-foreground'>
                      Execution Timeline
                    </td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={`py-3.5 px-4 ${
                          q.isAiRecommended
                            ? 'bg-primary/5 border-x border-primary/20 font-medium'
                            : ''
                        }`}
                      >
                        <span className='font-semibold'>
                          {q.executionTimeDays} Business Days
                        </span>
                        <div className='text-xs text-muted-foreground'>
                          Start: {q.availableStartDate}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Warranty Terms */}
                  <tr className='hover:bg-muted/10'>
                    <td className='py-3.5 px-4 font-semibold text-muted-foreground'>
                      Workmanship Warranty
                    </td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={`py-3.5 px-4 ${
                          q.isAiRecommended
                            ? 'bg-primary/5 border-x border-primary/20'
                            : ''
                        }`}
                      >
                        <span
                          className={`font-bold ${
                            q.warrantyMonths >= 12
                              ? 'text-emerald-600'
                              : 'text-foreground'
                          }`}
                        >
                          {q.warrantyMonths} Months
                        </span>
                        <div className='text-xs text-muted-foreground line-clamp-1'>
                          {q.warrantyDescription}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Provider Rating */}
                  <tr className='hover:bg-muted/10'>
                    <td className='py-3.5 px-4 font-semibold text-muted-foreground'>
                      Provider Rating & Track Record
                    </td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={`py-3.5 px-4 ${
                          q.isAiRecommended
                            ? 'bg-primary/5 border-x border-primary/20'
                            : ''
                        }`}
                      >
                        <div className='flex items-center gap-1 font-bold text-amber-600'>
                          <Star className='h-4 w-4 fill-amber-500 text-amber-500' />
                          <span>{q.providerRating.toFixed(1)} / 5.0</span>
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {q.previousJobsCompleted} verified jobs completed
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Distance & Proximity */}
                  <tr className='hover:bg-muted/10'>
                    <td className='py-3.5 px-4 font-semibold text-muted-foreground'>
                      Distance to Asset
                    </td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={`py-3.5 px-4 ${
                          q.isAiRecommended
                            ? 'bg-primary/5 border-x border-primary/20'
                            : ''
                        }`}
                      >
                        <span>{q.distanceKm} km</span>
                        <span className='text-xs text-muted-foreground ml-1'>
                          from Kandy House
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Composite Evaluation Score */}
                  <tr className='hover:bg-muted/10 bg-muted/10 font-medium'>
                    <td className='py-4 px-4 font-bold text-foreground'>
                      AI Composite Score
                    </td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={`py-4 px-4 ${
                          q.isAiRecommended
                            ? 'bg-primary/10 border-x border-primary/30'
                            : ''
                        }`}
                      >
                        <div className='flex items-center gap-2'>
                          <div className='h-2 flex-1 rounded-full bg-muted overflow-hidden'>
                            <div
                              className={`h-full ${
                                q.isAiRecommended
                                  ? 'bg-emerald-500'
                                  : 'bg-primary/60'
                              }`}
                              style={{ width: `${q.recommendationScore}%` }}
                            />
                          </div>
                          <span className='font-bold text-sm'>
                            {q.recommendationScore}/100
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Line Item Breakdown */}
                  <tr className='hover:bg-muted/10'>
                    <td className='py-4 px-4 font-semibold text-muted-foreground'>
                      Line Items Audited
                    </td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={`py-4 px-4 text-xs ${
                          q.isAiRecommended
                            ? 'bg-primary/5 border-x border-primary/20'
                            : ''
                        }`}
                      >
                        <ul className='space-y-1 text-muted-foreground'>
                          {q.lineItems.map((li, idx) => (
                            <li
                              key={idx}
                              className='flex justify-between border-b pb-0.5'
                            >
                              <span>{li.itemName}</span>
                              <span className='font-semibold text-foreground ml-1'>
                                LKR {li.totalPrice.toLocaleString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Action Row */}
                  <tr>
                    <td className='py-4 px-4 font-semibold text-muted-foreground'>
                      Selection
                    </td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={`py-4 px-4 ${
                          q.isAiRecommended
                            ? 'bg-primary/5 border-x border-primary/20'
                            : ''
                        }`}
                      >
                        <Button
                          size='sm'
                          variant={q.isAiRecommended ? 'default' : 'outline'}
                          className='w-full text-xs font-semibold'
                          onClick={() => handleSelectAndSubmit(q.providerId)}
                        >
                          {q.isAiRecommended ? 'Select AI Winner' : 'Select Bid'}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Agent 3 Recommendation Card & Human Approval Handoff (Matches Page 15 & 18) */}
        {recommendedQuote && (
          <Card className='border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-md'>
            <CardHeader className='pb-3'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-lg bg-primary p-2 text-primary-foreground'>
                    <Sparkles className='h-5 w-5' />
                  </div>
                  <div>
                    <CardTitle className='text-xl'>
                      Agent 3 — Autonomous Recommendation Result
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      Formulated by Maintenance & Cost Recommendation Agent
                    </CardDescription>
                  </div>
                </div>
                <span className='rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-3 py-1 text-xs font-bold'>
                  Score: {recommendedQuote.recommendationScore} / 100
                </span>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='rounded-lg border bg-muted/30 p-4'>
                <div className='text-xs uppercase tracking-wider text-muted-foreground font-semibold'>
                  Recommended Proposal
                </div>
                <div className='text-2xl font-black text-foreground mt-0.5'>
                  {recommendedQuote.providerName}{' '}
                  <span className='text-emerald-600 font-bold'>
                    (LKR {recommendedQuote.amountLkr.toLocaleString()})
                  </span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {recommendedQuote.recommendationSummary}
                </p>
              </div>

              {/* Rationale Checklist from Agent 3 (matching Page 15) */}
              <div>
                <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2'>
                  AI Decision Rationale:
                </h4>
                <div className='grid gap-2 sm:grid-cols-2'>
                  {recommendedQuote.recommendationReasons.map((reason, i) => (
                    <div
                      key={i}
                      className='flex items-start gap-2 rounded-md border p-2.5 bg-card text-xs'
                    >
                      <CheckCircle2 className='h-4 w-4 text-emerald-500 mt-0.5 shrink-0' />
                      <span className='leading-tight'>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RAG Domain Knowledge References */}
              <div className='rounded-lg border p-3 bg-card/60 text-xs text-muted-foreground space-y-1.5'>
                <div className='flex items-center gap-2 font-semibold text-foreground'>
                  <BookOpen className='h-4 w-4 text-primary' />
                  <span>RAG Knowledge Base Verification Grounding:</span>
                </div>
                <p>
                  Line-item pricing audited against{' '}
                  <em>Service_Standards_and_Price_Book.md</em> (Standard plumber day
                  rate: LKR 15,000; PPR pipe: LKR 4,000). Workmanship warranty
                  exceeds minimum threshold mandated in{' '}
                  <em>Warranty_Documents_and_Policies.md</em>.
                </p>
              </div>

              {/* Human Approval Handoff Banner */}
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t'>
                <div>
                  <div className='text-xs font-semibold text-foreground flex items-center gap-1.5'>
                    <ShieldCheck className='h-4 w-4 text-primary' />
                    Deterministic Rule Validation: PASSED
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    Quote LKR 38,000 is under budget (LKR 75,000). Ready for Owner /
                    Manager Approval (Member 4 layer).
                  </p>
                </div>
                <Button
                  onClick={() => handleSelectAndSubmit(recommendedQuote.providerId)}
                  className='gap-2 shadow-sm'
                >
                  <Send className='h-4 w-4' />
                  {isSubmittedForApproval
                    ? 'Submitted to Workflow Approval ✓'
                    : 'Submit Proposal for Human Approval'}
                </Button>
              </div>

              {isSubmittedForApproval && (
                <div className='rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 shrink-0' />
                  <span>
                    Proposal for Provider ({selectedProviderId}) successfully queued for Human Approval
                    (Member 4 Workflow Layer)!
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}
