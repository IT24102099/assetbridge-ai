import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  FileCheck2,
  AlertTriangle,
  MapPin,
  Calendar,
  Sparkles,
  Camera,
  Scale,
  Plus,
  ShieldAlert,
  ArrowRight,
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
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { maintenanceApi } from '../api'
import { InspectionItem } from '../types'

export function InspectionsFeature() {
  const [inspections, setInspections] = useState<InspectionItem[]>([])
  const [selectedInspection, setSelectedInspection] =
    useState<InspectionItem | null>(null)
  const [activePhoto, setActivePhoto] = useState<string>('')
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)

  // Form state for creating inspection
  const [formData, setFormData] = useState({
    assetName: 'Kandy House',
    problemCategory: 'Water Leakage',
    finding: '',
    requiredWork: 'Pipe replacement, Wall repair, Testing',
    priority: 'HIGH' as const,
    damageLevel: 'Moderate' as const,
    recommendations: '',
    estimatedDamageCost: 35000,
  })

  useEffect(() => {
    maintenanceApi.getInspections().then((data) => {
      setInspections(data)
      if (data.length > 0) {
        setSelectedInspection(data[0])
        setActivePhoto(data[0].photos[0] || '')
      }
    })
  }, [])

  const handleSelectInspection = (item: InspectionItem) => {
    setSelectedInspection(item)
    setActivePhoto(item.photos[0] || '')
  }

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault()
    const created = await maintenanceApi.createInspection({
      ...formData,
      incidentId: `INC-${Math.floor(1030 + Math.random() * 900)}`,
      assetId: 'AS-KDY-001',
      inspectorName: 'Nimal Perera (Representative)',
      photos: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
      ],
    })
    setInspections([created, ...inspections])
    setSelectedInspection(created)
    setActivePhoto(created.photos[0] || '')
    setIsNewDialogOpen(false)
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-2 font-semibold text-lg me-auto'>
          <FileCheck2 className='h-5 w-5 text-primary' />
          <span>Inspection Management & Damage Audit (INS-1021)</span>
        </div>
        <Search />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-6'>
        {/* Page Top Actions */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight'>
              Inspection Details & Field Audit
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              On-site representative findings, photographic evidence, and AI trade
              hazard classification.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Link to='/quotations/compare'>
              <Button className='gap-2 shadow-sm'>
                <Scale className='h-4 w-4' />
                Compare Quotes for Incident
              </Button>
            </Link>

            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
              <DialogTrigger asChild>
                <Button variant='outline' className='gap-2'>
                  <Plus className='h-4 w-4' />
                  New Inspection
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[550px]'>
                <form onSubmit={handleCreateInspection}>
                  <DialogHeader>
                    <DialogTitle>Submit On-Site Inspection</DialogTitle>
                    <DialogDescription>
                      Record damage diagnosis, required trades, and representative
                      recommendations.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='space-y-1.5'>
                        <Label>Asset</Label>
                        <Input
                          value={formData.assetName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              assetName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <Label>Problem Category</Label>
                        <Input
                          value={formData.problemCategory}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              problemCategory: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-1.5'>
                      <Label>Inspection Finding & Defect Description</Label>
                      <Textarea
                        rows={3}
                        placeholder='Describe leak point, masonry moisture, or equipment fault...'
                        value={formData.finding}
                        onChange={(e) =>
                          setFormData({ ...formData, finding: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className='space-y-1.5'>
                      <Label>Required Work Items</Label>
                      <Input
                        value={formData.requiredWork}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            requiredWork: e.target.value,
                          })
                        }
                        placeholder='Pipe replacement, Wall repair, Leak testing'
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div className='space-y-1.5'>
                        <Label>Priority</Label>
                        <select
                          className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                          value={formData.priority}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              priority: e.target.value as any,
                            })
                          }
                        >
                          <option value='LOW'>LOW</option>
                          <option value='MEDIUM'>MEDIUM</option>
                          <option value='HIGH'>HIGH</option>
                          <option value='EMERGENCY'>EMERGENCY</option>
                        </select>
                      </div>
                      <div className='space-y-1.5'>
                        <Label>Estimated Damage Cost (LKR)</Label>
                        <Input
                          type='number'
                          value={formData.estimatedDamageCost}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              estimatedDamageCost: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className='space-y-1.5'>
                      <Label>Representative Recommendations</Label>
                      <Textarea
                        rows={2}
                        placeholder='Isolation instructions, warranty checks...'
                        value={formData.recommendations}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recommendations: e.target.value,
                          })
                        }
                      />
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
                    <Button type='submit'>Save & Submit Inspection</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 2-Column: Inspection Selector & Active Inspection Details */}
        <div className='grid gap-6 lg:grid-cols-12'>
          {/* Left Column: Inspection List (4 cols) */}
          <div className='lg:col-span-4 space-y-3'>
            <div className='text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1'>
              Select Inspection Record
            </div>
            {inspections.map((item) => {
              const isSelected = selectedInspection?.id === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectInspection(item)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'hover:border-border hover:bg-muted/30'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-bold text-sm tracking-wide text-primary'>
                      {item.id}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${
                        item.priority === 'HIGH' || item.priority === 'EMERGENCY'
                          ? 'bg-red-500/10 text-red-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <div className='font-semibold text-base mt-1'>
                    {item.assetName}
                  </div>
                  <div className='text-xs text-muted-foreground mt-0.5 flex items-center gap-1'>
                    <AlertTriangle className='h-3 w-3 text-amber-500' />
                    {item.problemCategory}
                  </div>
                  <div className='text-xs text-muted-foreground mt-2 line-clamp-2'>
                    {item.finding}
                  </div>
                  <div className='mt-3 flex items-center justify-between text-xs pt-2 border-t'>
                    <span>{new Date(item.inspectedAt).toLocaleDateString()}</span>
                    <span className='font-medium text-foreground'>
                      Est. LKR {item.estimatedDamageCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Detailed View matching Wireframe A2 (8 cols) */}
          {selectedInspection && (
            <div className='lg:col-span-8 space-y-6'>
              <Card className='shadow-sm border-primary/20'>
                <CardHeader className='pb-4 border-b'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <span className='rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground'>
                        {selectedInspection.id}
                      </span>
                      <span className='text-sm text-muted-foreground'>
                        Linked Incident: {selectedInspection.incidentId}
                      </span>
                    </div>
                    <span className='rounded-full bg-emerald-500/10 text-emerald-600 px-3 py-1 text-xs font-semibold'>
                      Status: {selectedInspection.status}
                    </span>
                  </div>
                  <CardTitle className='text-2xl mt-2'>
                    {selectedInspection.assetName} — {selectedInspection.problemCategory}
                  </CardTitle>
                  <CardDescription className='flex flex-wrap items-center gap-4 text-xs mt-1'>
                    <span className='flex items-center gap-1'>
                      <MapPin className='h-3.5 w-3.5 text-muted-foreground' />
                      {selectedInspection.locationGps}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                      Inspected on{' '}
                      {new Date(selectedInspection.inspectedAt).toLocaleString()}
                    </span>
                    <span className='font-medium text-foreground'>
                      Inspector: {selectedInspection.inspectorName}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className='space-y-6 pt-5'>
                  {/* Problem & Damage Grid */}
                  <div className='grid gap-4 sm:grid-cols-3'>
                    <div className='rounded-lg border p-3 bg-muted/20'>
                      <div className='text-xs text-muted-foreground uppercase font-medium'>
                        Problem Category
                      </div>
                      <div className='font-semibold text-base mt-1 text-blue-600'>
                        {selectedInspection.problemCategory}
                      </div>
                    </div>
                    <div className='rounded-lg border p-3 bg-muted/20'>
                      <div className='text-xs text-muted-foreground uppercase font-medium'>
                        Damage Severity
                      </div>
                      <div className='font-semibold text-base mt-1 text-red-600'>
                        {selectedInspection.damageLevel} ({selectedInspection.priority})
                      </div>
                    </div>
                    <div className='rounded-lg border p-3 bg-muted/20'>
                      <div className='text-xs text-muted-foreground uppercase font-medium'>
                        Damage Assessment
                      </div>
                      <div className='font-semibold text-base mt-1'>
                        LKR {selectedInspection.estimatedDamageCost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Inspector Findings */}
                  <div>
                    <h3 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1'>
                      Inspector Finding
                    </h3>
                    <p className='text-sm leading-relaxed rounded-lg border p-3 bg-card'>
                      {selectedInspection.finding}
                    </p>
                  </div>

                  {/* Required Work */}
                  <div>
                    <h3 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2'>
                      Required Work Items
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {selectedInspection.requiredWork
                        .split(',')
                        .map((w, idx) => (
                          <span
                            key={idx}
                            className='rounded-md border bg-muted/40 px-3 py-1 text-xs font-medium'
                          >
                            ✓ {w.trim()}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1'>
                      Recommendations & Safety Protocol
                    </h3>
                    <p className='text-sm text-muted-foreground rounded-lg border p-3 bg-amber-500/5 border-amber-500/30'>
                      {selectedInspection.recommendations}
                    </p>
                  </div>

                  {/* Photo Evidence Section with Gallery */}
                  <div>
                    <h3 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between'>
                      <span>On-Site Photographic Evidence</span>
                      <span className='text-xs font-normal text-muted-foreground flex items-center gap-1'>
                        <Camera className='h-3.5 w-3.5' />
                        {selectedInspection.photos.length} photos logged
                      </span>
                    </h3>

                    {/* Main Photo Display */}
                    {activePhoto && (
                      <div className='relative overflow-hidden rounded-xl border bg-black/5 aspect-video mb-3'>
                        <img
                          src={activePhoto}
                          alt='Inspection evidence'
                          className='h-full w-full object-cover'
                        />
                        <div className='absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white backdrop-blur'>
                          GPS: {selectedInspection.locationGps} | Timestamped
                        </div>
                      </div>
                    )}

                    {/* Thumbnails */}
                    <div className='flex gap-2 overflow-x-auto pb-1'>
                      {selectedInspection.photos.map((url, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePhoto(url)}
                          className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                            activePhoto === url
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Thumb ${i}`}
                            className='h-full w-full object-cover'
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Agent 3 Assistant Card (Grounding from RAG) */}
                  <Card className='bg-primary/5 border-primary/30 shadow-none'>
                    <CardHeader className='pb-2'>
                      <div className='flex items-center gap-2'>
                        <Sparkles className='h-5 w-5 text-primary' />
                        <CardTitle className='text-base font-bold'>
                          AI Agent 3 — Trade & Safety Hazard Assessment
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-3 text-xs'>
                      <div className='flex items-start gap-2 text-foreground font-medium'>
                        <ShieldAlert className='h-4 w-4 text-amber-600 mt-0.5 shrink-0' />
                        <span>
                          RAG Synthesis from{' '}
                          <em>Water_Leakage_Maintenance_Guide.md</em> &{' '}
                          <em>Electrical_Safety_Guide.md</em>:
                        </span>
                      </div>
                      <ul className='list-disc list-inside space-y-1 text-muted-foreground ps-2'>
                        <li>
                          Concealed pipe failure behind electrical outlets requires{' '}
                          <strong>Plumbing + Electrical</strong> dual trade
                          sign-off.
                        </li>
                        <li>
                          Mandatory electrical supply isolation prior to wall
                          plaster excavation (IET BS 7671 standard).
                        </li>
                        <li>
                          Hydrostatic pressure testing required at 6.0 bar for 30
                          minutes before plaster sealing.
                        </li>
                      </ul>
                      <div className='pt-2 flex justify-end'>
                        <Link to='/quotations/compare'>
                          <Button size='sm' className='gap-2'>
                            Compare Provider Quotations
                            <ArrowRight className='h-4 w-4' />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
