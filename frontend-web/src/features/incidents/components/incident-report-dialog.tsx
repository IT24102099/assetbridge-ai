import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IncidentSeverity, CreateIncidentInput } from '../types'
import { incidentsApi } from '../api/incidents-api'
import { assetsApi } from '@/features/assets/api/assets-api'
import { Asset } from '@/features/assets/types'
import { toast } from 'sonner'
import {
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  X,
} from 'lucide-react'

interface IncidentReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  preselectedAssetId?: number
}

const PRESET_PHOTOS = [
  {
    label: 'Pump / Valve Leak',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Generator Overheating',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Culvert Debris Jam',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  },
]

export function IncidentReportDialog({
  open,
  onOpenChange,
  onSuccess,
  preselectedAssetId,
}: IncidentReportDialogProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetId, setAssetId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium')
  const [budget, setBudget] = useState<string>('')
  const [preferredDate, setPreferredDate] = useState<string>('')
  const [photoUrl, setPhotoUrl] = useState<string>('')
  const [reportedBy, setReportedBy] = useState('Officer Karamanathan')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      assetsApi.getAll().then((data) => {
        setAssets(data)
        if (preselectedAssetId) {
          setAssetId(preselectedAssetId.toString())
        } else if (data.length > 0 && !assetId) {
          setAssetId(data[0].id.toString())
        }
      })
    }
  }, [open, preselectedAssetId])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!assetId) errs.assetId = 'Please select a linked asset'
    if (!title.trim()) errs.title = 'Incident title is required'
    if (!description.trim()) errs.description = 'Description is required'
    if (budget && isNaN(Number(budget))) errs.budget = 'Budget must be a valid number'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const input: CreateIncidentInput = {
        assetId: parseInt(assetId, 10),
        title: title.trim(),
        description: description.trim(),
        severity,
        budget: budget ? parseFloat(budget) : undefined,
        preferredDate: preferredDate || undefined,
        photoUrl: photoUrl || undefined,
        reportedBy: reportedBy || undefined,
      }

      await incidentsApi.create(input)
      toast.success(`Incident reported successfully. Triage code generated!`)

      // Reset
      setTitle('')
      setDescription('')
      setBudget('')
      setPreferredDate('')
      setPhotoUrl('')
      onOpenChange(false)
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit incident report'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Report New Incident</DialogTitle>
            <DialogDescription>
              Submit an infrastructure defect, breakdown, or maintenance failure for rapid dispatch.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Linked Asset */}
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="assetId">Linked Infrastructure Asset *</Label>
              <Select value={assetId} onValueChange={setAssetId}>
                <SelectTrigger id="assetId">
                  <SelectValue placeholder="Select Affected Asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>
                      {a.assetCode} — {a.name} ({a.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assetId && (
                <p className="text-xs text-destructive">{errors.assetId}</p>
              )}
            </div>

            {/* Incident Title */}
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="title">Incident Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Primary Impeller Vibration & Cavitation Leak"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Severity Selector */}
            <div className="space-y-1.5">
              <Label htmlFor="severity">Severity Assessment *</Label>
              <Select
                value={severity}
                onValueChange={(val) => setSeverity(val as IncidentSeverity)}
              >
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low — Minor observation / aesthetic</SelectItem>
                  <SelectItem value="Medium">Medium — Partial degradation</SelectItem>
                  <SelectItem value="High">High — Operational halt imminent</SelectItem>
                  <SelectItem value="Critical">Critical — Full failure / safety hazard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Budget */}
            <div className="space-y-1.5">
              <Label htmlFor="budget">Estimated Budget (LKR)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 75000"
                  className="pl-9"
                />
              </div>
              {errors.budget && (
                <p className="text-xs text-destructive">{errors.budget}</p>
              )}
            </div>

            {/* Preferred Completion Date */}
            <div className="space-y-1.5">
              <Label htmlFor="preferredDate">Preferred Target Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="preferredDate"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Reporter Name */}
            <div className="space-y-1.5">
              <Label htmlFor="reportedBy">Reporter / Inspector ID</Label>
              <Input
                id="reportedBy"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="Staff ID or Name"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description">Detailed Incident Description *</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible damage, leak rates, warning sounds, diagnostic codes, or emergency risk..."
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Photo Upload & Evidence */}
            <div className="space-y-2 md:col-span-2">
              <Label>Attach Inspection Photo / Evidence</Label>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Enter image URL or select preset below..."
                    className="pl-9"
                  />
                </div>
                {photoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPhotoUrl('')}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                )}
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">Sample photos:</span>
                {PRESET_PHOTOS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setPhotoUrl(p.url)}
                    className="text-xs bg-muted hover:bg-primary/10 hover:text-primary px-2.5 py-1 rounded-md border transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Photo Preview */}
              {photoUrl && (
                <div className="relative mt-2 rounded-lg overflow-hidden border max-h-40 w-full bg-black/5 flex items-center justify-center">
                  <img
                    src={photoUrl}
                    alt="Evidence Preview"
                    className="h-40 w-full object-cover"
                    onError={() => toast.error('Failed to load image from URL')}
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <UploadCloud className="h-4 w-4" />
              Submit Incident Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
