import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Asset, AssetHistory } from '../types'
import { assetsApi } from '../api/assets-api'
import { AssetStatusBadge } from './asset-status-badge'
import {
  Building2,
  Calendar,
  Clock,
  History,
  MapPin,
  Tag,
  User,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'

interface AssetDetailsDialogProps {
  assetId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssetDetailsDialog({
  assetId,
  open,
  onOpenChange,
}: AssetDetailsDialogProps) {
  const [asset, setAsset] = useState<Asset | null>(null)
  const [histories, setHistories] = useState<AssetHistory[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!assetId || !open) return

    setLoading(true)
    Promise.all([assetsApi.getById(assetId), assetsApi.getHistory(assetId)])
      .then(([assetData, historyData]) => {
        setAsset(assetData)
        setHistories(historyData || [])
      })
      .finally(() => setLoading(false))
  }, [assetId, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {asset?.name || 'Asset Details'}
                </DialogTitle>
                <DialogDescription className="font-mono text-xs">
                  {asset?.assetCode}
                </DialogDescription>
              </div>
            </div>
            {asset && <AssetStatusBadge status={asset.status} />}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex justify-center items-center text-muted-foreground">
            <Clock className="h-5 w-5 animate-spin mr-2" />
            Loading asset information...
          </div>
        ) : !asset ? (
          <div className="py-8 text-center text-muted-foreground">
            Asset not found.
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium text-foreground">{asset.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Assigned Owner:</span>
                  <span className="font-medium text-foreground">
                    {asset.ownerId || 'Unassigned'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Registered:</span>
                  <span className="font-medium text-foreground">
                    {format(new Date(asset.createdAt), 'PPP')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">{asset.location}</div>
                    {asset.address && (
                      <div className="text-xs text-muted-foreground">{asset.address}</div>
                    )}
                    {asset.coordinates && (
                      <div className="text-xs font-mono text-primary mt-0.5">
                        Coords: {asset.coordinates}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Active Incidents:</span>
                  <span
                    className={`font-semibold ${
                      asset.activeIncidentsCount > 0 ? 'text-amber-500' : 'text-emerald-500'
                    }`}
                  >
                    {asset.activeIncidentsCount} active
                  </span>
                </div>
              </div>
            </div>

            {/* Maintenance & Audit History Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <History className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Maintenance & Audit Timeline</h3>
              </div>

              {histories.length === 0 ? (
                <div className="text-xs text-muted-foreground py-4 text-center border rounded-lg bg-muted/20">
                  No maintenance or status history recorded yet.
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-muted-foreground/20 space-y-4 my-2">
                  {histories.map((h) => (
                    <div key={h.id} className="relative group">
                      <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-primary border-4 border-background" />
                      <div className="bg-card p-3 rounded-lg border shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-primary">{h.eventType}</span>
                          <span className="text-muted-foreground font-mono">
                            {format(new Date(h.date), 'PP p')}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{h.description}</p>
                        {h.recordedBy && (
                          <div className="text-[11px] text-muted-foreground">
                            Logged by: <span className="font-medium">{h.recordedBy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
