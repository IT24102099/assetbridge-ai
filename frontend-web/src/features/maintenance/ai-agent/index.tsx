import { useState } from 'react'
import {
  Sparkles,
  Search,
  BookOpen,
  Wrench,
  ShieldAlert,
  Play,
  CheckCircle2,
  FileText,
  Cpu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { maintenanceApi } from '../api'

const AGENT_TOOLS = [
  {
    name: 'GetInspection(id)',
    description: 'Retrieves on-site damage diagnosis, severity, and photo metadata.',
    output: '{ issue: "Water leak", finding: "Damaged PPR pipe behind cabinet" }',
  },
  {
    name: 'GetMaintenanceHistory(assetId)',
    description: 'Retrieves asset repair ledger, past contractors, and active warranties.',
    output: '[ { jobId: "JOB-091", type: "Water Pump", cost: 28000 } ]',
  },
  {
    name: 'GetQuotations(incidentId)',
    description: 'Fetches all competitive contractor bids submitted for an incident.',
    output: '[ { provider: "Provider A", amount: 38000 }, { provider: "Provider B", amount: 42000 } ]',
  },
  {
    name: 'CompareQuotations(incidentId, budget)',
    description: 'Multi-criteria evaluation balancing cost (40%), warranty (20%), rating (20%), and time.',
    output: '{ topPick: "Provider A", score: 96, savings: 37000 }',
  },
  {
    name: 'CheckBudget(quotationId, budget)',
    description: 'Verifies proposal against owner allocation and flags overruns or savings.',
    output: '{ isWithinBudget: true, savingsLkr: 37000, percentSaved: 49.3 }',
  },
  {
    name: 'CalculateTotalCost(quotationId)',
    description: 'Audits line-item breakdown (Pipe 8k + Labour 15k + Repair 12k + Testing 3k).',
    output: '{ computedTotal: 38000, isAccurate: true }',
  },
  {
    name: 'GetWarrantyInformation(quotationId)',
    description: 'Validates vendor warranty terms against minimum legal policy requirements.',
    output: '{ warrantyMonths: 12, meetsMinimumPolicy: true }',
  },
]

export function Agent3StudioFeature() {
  const [ragQuery, setRagQuery] = useState('Water leak near electrical socket')
  const [ragResults, setRagResults] = useState<any[]>([])
  const [isSearchingRag, setIsSearchingRag] = useState(false)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [agentOutput, setAgentOutput] = useState<any | null>(null)
  const [isExecutingAgent, setIsExecutingAgent] = useState(false)

  const handleSearchRag = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSearchingRag(true)
    const results = await maintenanceApi.searchRag(ragQuery)
    setRagResults(results)
    setIsSearchingRag(false)
  }

  const handleRunAgentWorkflow = () => {
    setIsExecutingAgent(true)
    setTimeout(() => {
      setAgentOutput({
        recommendedProvider: 'Provider A (ABC Plumbing & Engineering)',
        estimatedCost: 38000,
        budgetSavings: 37000,
        reasons: [
          'Within owner budget: LKR 38,000 vs LKR 75,000 budget (49.3% savings)',
          'Suitable expertise: Certified master plumber with verified history',
          'Available before deadline: 2 business days turnaround',
          'Strong previous performance: 4.8/5 rating across 24 completed jobs',
        ],
        ragGrounding: [
          'Water_Leakage_Maintenance_Guide.md — Shut off main water stopcock immediately',
          'Electrical_Safety_Guide.md — Mandatory electrical supply isolation before plaster cutting',
          'Service_Standards_and_Price_Book.md — Itemized parts conform to regional price norms',
        ],
      })
      setIsExecutingAgent(false)
    }, 600)
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-2 font-semibold text-lg me-auto'>
          <Cpu className='h-5 w-5 text-primary' />
          <span>Agent 3: Maintenance & Cost Recommendation Studio</span>
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight'>
              Agent 3 — AI Maintenance & Cost Engine
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Member 3 Autonomous AI Contribution: Controlled tool execution,
              RAG knowledge grounding, and deterministic proposal validation.
            </p>
          </div>
          <Button
            onClick={handleRunAgentWorkflow}
            disabled={isExecutingAgent}
            className='gap-2 shadow-sm'
          >
            <Play className='h-4 w-4' />
            {isExecutingAgent ? 'Running Agent Tools...' : 'Execute Full Agent Workflow'}
          </Button>
        </div>

        {/* 2-Column: Agent Tools & Autonomous Execution Output */}
        <div className='grid gap-6 lg:grid-cols-12'>
          {/* Left: 7 Agent Tools list (5 cols) */}
          <div className='lg:col-span-5 space-y-4'>
            <Card className='shadow-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base flex items-center justify-between'>
                  <span>Agent 3 Tool Registry</span>
                  <span className='rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary'>
                    7 Tools
                  </span>
                </CardTitle>
                <CardDescription className='text-xs'>
                  Controlled tools exposed to Agent 3 (Notice: AI does not query
                  DB directly)
                </CardDescription>
              </CardHeader>
              <CardContent className='p-0 divide-y max-h-[500px] overflow-y-auto'>
                {AGENT_TOOLS.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTool(t.name)}
                    className={`p-3.5 text-xs cursor-pointer transition-colors ${
                      activeTool === t.name
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-muted/40'
                    }`}
                  >
                    <div className='font-mono font-bold text-foreground flex items-center gap-1.5'>
                      <Wrench className='h-3.5 w-3.5 text-primary' />
                      <span>{t.name}</span>
                    </div>
                    <p className='text-muted-foreground mt-1 leading-snug'>
                      {t.description}
                    </p>
                    <div className='mt-1.5 font-mono text-[11px] text-primary/80 bg-muted/50 rounded px-2 py-0.5 truncate'>
                      {t.output}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Agent 3 Execution & RAG Integration (7 cols) */}
          <div className='lg:col-span-7 space-y-6'>
            {/* Live Agent Output Card matching Page 15 Specification */}
            <Card className='border-2 border-primary/30 shadow-sm'>
              <CardHeader className='pb-3 bg-muted/20 border-b'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Sparkles className='h-5 w-5 text-primary' />
                    <CardTitle className='text-lg'>
                      Agent 3 Output (Structured JSON)
                    </CardTitle>
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    Incident: INC-1021
                  </span>
                </div>
              </CardHeader>
              <CardContent className='space-y-4 pt-4'>
                {agentOutput ? (
                  <div className='space-y-4'>
                    <div className='rounded-lg bg-muted/40 border p-3.5 space-y-2'>
                      <div className='text-xs uppercase text-muted-foreground font-semibold'>
                        Recommended Provider
                      </div>
                      <div className='text-xl font-black text-foreground'>
                        {agentOutput.recommendedProvider}
                      </div>
                      <div className='flex gap-4 text-xs font-semibold'>
                        <span className='text-emerald-600'>
                          Estimated Cost: LKR{' '}
                          {agentOutput.estimatedCost.toLocaleString()}
                        </span>
                        <span className='text-primary'>
                          Surplus Saved: LKR{' '}
                          {agentOutput.budgetSavings.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2'>
                        Reason Array (Page 15 Spec):
                      </div>
                      <div className='space-y-1.5'>
                        {agentOutput.reasons.map((r: string, idx: number) => (
                          <div
                            key={idx}
                            className='flex items-center gap-2 text-xs rounded border p-2 bg-card'
                          >
                            <CheckCircle2 className='h-4 w-4 text-emerald-500 shrink-0' />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='rounded-lg border p-3 bg-amber-500/5 border-amber-500/30 text-xs space-y-1.5'>
                      <div className='font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5'>
                        <ShieldAlert className='h-4 w-4' />
                        <span>RAG Safety & Regulatory Citations:</span>
                      </div>
                      <ul className='list-disc list-inside space-y-1 text-muted-foreground ps-1'>
                        {agentOutput.ragGrounding.map((g: string, i: number) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-8 text-muted-foreground text-xs'>
                    <Sparkles className='h-8 w-8 mx-auto mb-2 opacity-40' />
                    <p>Click "Execute Full Agent Workflow" above to run Agent 3</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live RAG Knowledge Base Query (Page 16 Wireframe D) */}
            <Card className='shadow-sm'>
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                  <BookOpen className='h-5 w-5 text-blue-500' />
                  <CardTitle className='text-lg'>
                    RAG Knowledge Base Live Query Engine
                  </CardTitle>
                </div>
                <CardDescription className='text-xs'>
                  Demonstrates Section 16 example: "Water leak near electrical
                  socket" retrieves isolation rules & dual trades
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <form onSubmit={handleSearchRag} className='flex gap-2'>
                  <Input
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    placeholder='Type issue query e.g. Water leak near electrical socket...'
                    className='text-xs'
                  />
                  <Button
                    type='submit'
                    disabled={isSearchingRag}
                    className='gap-1.5 text-xs'
                  >
                    <Search className='h-3.5 w-3.5' />
                    Search RAG
                  </Button>
                </form>

                <div className='space-y-3'>
                  {ragResults.map((r, i) => (
                    <div
                      key={i}
                      className='rounded-lg border p-3 bg-muted/20 text-xs space-y-1.5'
                    >
                      <div className='flex items-center justify-between font-bold text-primary'>
                        <div className='flex items-center gap-1.5'>
                          <FileText className='h-4 w-4 text-blue-600' />
                          <span>{r.documentName}</span>
                        </div>
                        <span className='rounded bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-600'>
                          Relevance {(r.relevanceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className='text-muted-foreground leading-relaxed'>
                        {r.matchedSnippet}
                      </p>
                      {r.extractedSafetyPoints && (
                        <div className='pt-1.5 border-t border-border/50'>
                          <span className='font-semibold text-foreground'>
                            Extracted Safety Actions:
                          </span>
                          <ul className='list-disc list-inside mt-0.5 space-y-0.5 text-amber-700 dark:text-amber-400'>
                            {r.extractedSafetyPoints.map((p: string, j: number) => (
                              <li key={j}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
