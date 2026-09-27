import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Receipt,
  Plus,
  Scale,
  Sparkles,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { maintenanceApi } from '../api'
import { QuotationItem, QuotationLineItem } from '../types'

export function QuotationsFeature() {
  const [quotations, setQuotations] = useState<QuotationItem[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)

  // New quotation form state with line items
  const [providerName, setProviderName] = useState('Metro Technical Services')
  const [providerRating, setProviderRating] = useState(4.6)
  const [executionDays, setExecutionDays] = useState(3)
  const [warrantyMonths, setWarrantyMonths] = useState(12)
  const [lineItems, setLineItems] = useState<QuotationLineItem[]>([
    {
      itemName: 'PPR Piping & Couplings',
      category: 'Materials',
      quantity: 1,
      unitPrice: 9000,
      totalPrice: 9000,
    },
    {
      itemName: 'Plumber Labor (2 days)',
      category: 'Labour',
      quantity: 1,
      unitPrice: 16000,
      totalPrice: 16000,
    },
    {
      itemName: 'Masonry Plaster & Water Repellent',
      category: 'Repair',
      quantity: 1,
      unitPrice: 11000,
      totalPrice: 11000,
    },
    {
      itemName: 'Pressure Leak Testing',
      category: 'Testing',
      quantity: 1,
      unitPrice: 3500,
      totalPrice: 3500,
    },
  ])

  useEffect(() => {
    maintenanceApi.getQuotations().then(setQuotations)
  }, [])

  const totalCalculatedCost = lineItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  )

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        itemName: 'New Work Item',
        category: 'Materials',
        quantity: 1,
        unitPrice: 5000,
        totalPrice: 5000,
      },
    ])
  }

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const handleUpdateLineItem = (
    index: number,
    field: keyof QuotationLineItem,
    value: any
  ) => {
    const updated = [...lineItems]
    const item = { ...updated[index], [field]: value }
    if (field === 'quantity' || field === 'unitPrice') {
      item.totalPrice = item.quantity * item.unitPrice
    }
    updated[index] = item
    setLineItems(updated)
  }

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault()
    const created = await maintenanceApi.createQuotation({
      providerName,
      providerRating,
      amountLkr: totalCalculatedCost,
      executionTimeDays: executionDays,
      warrantyMonths,
      lineItems,
      incidentId: 'INC-1021',
      inspectionId: 'INS-1021',
      assetId: 'AS-KDY-001',
      assetName: 'Kandy House',
    })

    setQuotations([...quotations, created])
    setIsNewDialogOpen(false)
  }

  const filteredQuotes =
    filterStatus === 'ALL'
      ? quotations
      : quotations.filter((q) => q.status === filterStatus)

  return (
    <>
      <Header>
        <div className='flex items-center gap-2 font-semibold text-lg me-auto'>
          <Receipt className='h-5 w-5 text-primary' />
          <span>Quotation Management (INC-1021)</span>
        </div>
        <Search />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-6'>
        {/* Top Header & Comparison CTA */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight'>
              Contractor Quotations & Line Items
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Manage competitive vendor bids, audit line item materials, and
              execute AI multi-quote comparison.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Link to='/quotations/compare'>
              <Button className='gap-2 shadow-sm'>
                <Scale className='h-4 w-4' />
                Compare Quotations (AI)
              </Button>
            </Link>

            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
              <DialogTrigger asChild>
                <Button variant='outline' className='gap-2'>
                  <Plus className='h-4 w-4' />
                  New Quotation
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[650px] max-h-[85vh] overflow-y-auto'>
                <form onSubmit={handleCreateQuotation}>
                  <DialogHeader>
                    <DialogTitle>Submit Provider Quotation</DialogTitle>
                    <DialogDescription>
                      Enter line item cost breakdown for incident INC-1021 (Kandy
                      House).
                    </DialogDescription>
                  </DialogHeader>

                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='space-y-1.5'>
                        <Label>Service Provider Company</Label>
                        <Input
                          value={providerName}
                          onChange={(e) => setProviderName(e.target.value)}
                          required
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <Label>Rating & Past Score</Label>
                        <Input
                          type='number'
                          step='0.1'
                          value={providerRating}
                          onChange={(e) =>
                            setProviderRating(Number(e.target.value))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div className='space-y-1.5'>
                        <Label>Execution Timeline (Days)</Label>
                        <Input
                          type='number'
                          value={executionDays}
                          onChange={(e) =>
                            setExecutionDays(Number(e.target.value))
                          }
                          required
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <Label>Warranty Period (Months)</Label>
                        <Input
                          type='number'
                          value={warrantyMonths}
                          onChange={(e) =>
                            setWarrantyMonths(Number(e.target.value))
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Line Items Table in Modal */}
                    <div className='space-y-2 border-t pt-3'>
                      <div className='flex items-center justify-between'>
                        <Label className='font-bold text-sm'>
                          Itemized Cost Breakdown
                        </Label>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-7 text-xs text-primary gap-1'
                          onClick={handleAddLineItem}
                        >
                          <Plus className='h-3 w-3' /> Add Item
                        </Button>
                      </div>

                      <div className='space-y-2 max-h-48 overflow-y-auto pr-1'>
                        {lineItems.map((item, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-2 rounded-lg border p-2 bg-muted/20 text-xs'
                          >
                            <Input
                              value={item.itemName}
                              onChange={(e) =>
                                handleUpdateLineItem(
                                  index,
                                  'itemName',
                                  e.target.value
                                )
                              }
                              className='h-8 text-xs flex-1'
                              placeholder='Item description'
                            />
                            <select
                              value={item.category}
                              onChange={(e) =>
                                handleUpdateLineItem(
                                  index,
                                  'category',
                                  e.target.value
                                )
                              }
                              className='h-8 rounded-md border border-input bg-background px-2 text-xs'
                            >
                              <option value='Materials'>Materials</option>
                              <option value='Labour'>Labour</option>
                              <option value='Repair'>Repair</option>
                              <option value='Testing'>Testing</option>
                            </select>
                            <Input
                              type='number'
                              value={item.totalPrice}
                              onChange={(e) =>
                                handleUpdateLineItem(
                                  index,
                                  'totalPrice',
                                  Number(e.target.value)
                                )
                              }
                              className='h-8 w-24 text-xs'
                              placeholder='Amount'
                            />
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-red-500 hover:text-red-700'
                              onClick={() => handleRemoveLineItem(index)}
                            >
                              <Trash2 className='h-3.5 w-3.5' />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className='flex items-center justify-between pt-2 border-t font-semibold text-sm'>
                        <span>Total Quotation Amount:</span>
                        <span className='text-primary text-base font-bold'>
                          LKR {totalCalculatedCost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setIsNewDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type='submit'>Submit Quotation</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filter Badges */}
        <div className='flex gap-2 overflow-x-auto pb-1 text-xs'>
          {['ALL', 'AI Recommended', 'Submitted', 'Approved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status === 'ALL' ? 'All Quotations' : status}
            </button>
          ))}
        </div>

        {/* Quotation Table matching Wireframe A3 */}
        <Card className='shadow-sm'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg'>
              Submitted Contractor Proposals ({filteredQuotes.length})
            </CardTitle>
            <CardDescription>
              Owner Incident Budget: <strong>LKR 75,000</strong> (Target: Kitchen
              Pipe Leak Repair)
            </CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead className='border-y bg-muted/40 text-xs uppercase text-muted-foreground'>
                  <tr>
                    <th className='py-3 px-4 font-semibold'>Quotation ID</th>
                    <th className='py-3 px-4 font-semibold'>Provider</th>
                    <th className='py-3 px-4 font-semibold'>Asset</th>
                    <th className='py-3 px-4 font-semibold'>Amount (LKR)</th>
                    <th className='py-3 px-4 font-semibold'>Turnaround</th>
                    <th className='py-3 px-4 font-semibold'>Warranty</th>
                    <th className='py-3 px-4 font-semibold'>Status</th>
                    <th className='py-3 px-4 text-right font-semibold'>Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {filteredQuotes.map((q) => {
                    const isAi = q.isAiRecommended
                    return (
                      <tr
                        key={q.id}
                        className={`transition-colors ${
                          isAi ? 'bg-primary/5 font-medium' : 'hover:bg-muted/30'
                        }`}
                      >
                        <td className='py-4 px-4'>
                          <div className='font-mono font-bold text-xs'>
                            {q.id}
                          </div>
                          <span className='text-xs text-muted-foreground'>
                            {new Date(q.submittedAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className='py-4 px-4'>
                          <div className='font-semibold text-foreground'>
                            {q.providerName}
                          </div>
                          <div className='text-xs text-muted-foreground flex items-center gap-1.5'>
                            <span>★ {q.providerRating.toFixed(1)}</span>
                            <span>•</span>
                            <span>{q.previousJobsCompleted} jobs</span>
                            <span>•</span>
                            <span>{q.distanceKm} km</span>
                          </div>
                        </td>
                        <td className='py-4 px-4'>{q.assetName}</td>
                        <td className='py-4 px-4'>
                          <div className='text-base font-bold text-foreground'>
                            LKR {q.amountLkr.toLocaleString()}
                          </div>
                          <div className='text-xs text-emerald-600'>
                            Save LKR {(75000 - q.amountLkr).toLocaleString()}
                          </div>
                        </td>
                        <td className='py-4 px-4'>
                          <span className='text-xs font-medium'>
                            {q.executionTimeDays} Days
                          </span>
                        </td>
                        <td className='py-4 px-4'>
                          <span className='text-xs font-medium'>
                            {q.warrantyMonths} Months
                          </span>
                        </td>
                        <td className='py-4 px-4'>
                          {isAi ? (
                            <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400'>
                              <Sparkles className='h-3 w-3' /> AI Recommended
                            </span>
                          ) : (
                            <span className='rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground'>
                              {q.status}
                            </span>
                          )}
                        </td>
                        <td className='py-4 px-4 text-right'>
                          <Link to='/quotations/compare'>
                            <Button
                              variant={isAi ? 'default' : 'outline'}
                              size='sm'
                              className='gap-1 text-xs'
                            >
                              <span>Compare</span>
                              <ExternalLink className='h-3 w-3' />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
