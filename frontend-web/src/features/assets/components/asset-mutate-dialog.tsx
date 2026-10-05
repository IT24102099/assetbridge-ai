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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Asset, AssetStatus, CreateAssetInput, UpdateAssetInput } from '../types'
import { assetsApi } from '../api/assets-api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface AssetMutateDialogProps {
  assetToEdit?: Asset | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const CATEGORIES = [
  'Water & Sanitation',
  'Power & Energy',
  'Renewable Energy',
  'Flood Control',
  'Telecommunication',
  'Healthcare Infrastructure',
  'Roads & Bridges',
  'Public Buildings',
]

export function AssetMutateDialog({
  assetToEdit,
  open,
  onOpenChange,
  onSuccess,
}: AssetMutateDialogProps) {
  const isEditing = !!assetToEdit

  const [assetCode, setAssetCode] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState('')
  const [status, setStatus] = useState<AssetStatus>('Active')
  const [ownerId, setOwnerId] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (assetToEdit) {
      setAssetCode(assetToEdit.assetCode)
      setName(assetToEdit.name)
      setCategory(assetToEdit.category)
      setLocation(assetToEdit.location)
      setAddress(assetToEdit.address || '')
      setCoordinates(assetToEdit.coordinates || '')
      setStatus(assetToEdit.status)
      setOwnerId(assetToEdit.ownerId || '')
    } else {
      setAssetCode(`AST-LK-${Math.floor(100 + Math.random() * 900)}`)
      setName('')
      setCategory(CATEGORIES[0])
      setLocation('')
      setAddress('')
      setCoordinates('')
      setStatus('Active')
      setOwnerId('EMP-' + Math.floor(100 + Math.random() * 900))
    }
    setErrors({})
  }, [assetToEdit, open])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Asset name is required'
    if (!assetCode.trim()) errs.assetCode = 'Asset code is required'
    if (!category.trim()) errs.category = 'Category is required'
    if (!location.trim()) errs.location = 'Location is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      if (isEditing && assetToEdit) {
        const updateData: UpdateAssetInput = {
          name,
          category,
          location,
          address: address || undefined,
          coordinates: coordinates || undefined,
          status,
          ownerId: ownerId || undefined,
        }
        await assetsApi.update(assetToEdit.id, updateData)
        toast.success(`Asset '${name}' updated successfully`)
      } else {
        const createData: CreateAssetInput = {
          assetCode,
          name,
          category,
          location,
          address: address || undefined,
          coordinates: coordinates || undefined,
          status,
          ownerId: ownerId || undefined,
        }
        await assetsApi.create(createData)
        toast.success(`Asset '${name}' registered successfully`)
      }
      onOpenChange(false)
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save asset'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditing ? 'Edit Asset' : 'Register New Asset'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update asset metadata, operational status, or location details.'
                : 'Add a new public or organizational infrastructure asset to the registry.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="assetCode">Asset Code *</Label>
              <Input
                id="assetCode"
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                placeholder="e.g. AST-CMB-001"
                disabled={isEditing}
                className="font-mono uppercase"
              />
              {errors.assetCode && (
                <p className="text-xs text-destructive">{errors.assetCode}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Colombo Municipal Pump #4"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Operational Status</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as AssetStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="location">Primary Location / Facility *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Maligawatta Water Station, Colombo 10"
              />
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Physical Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address (optional)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coordinates">GPS Coordinates</Label>
              <Input
                id="coordinates"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="e.g. 6.9271° N, 79.8612° E"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="ownerId">Assigned Custodian / Owner ID</Label>
              <Input
                id="ownerId"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                placeholder="e.g. EMP-0144 or Irrigation Dept"
              />
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
              {isEditing ? 'Save Changes' : 'Register Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
