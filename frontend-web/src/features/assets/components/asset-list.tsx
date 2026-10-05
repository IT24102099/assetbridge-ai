import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Asset } from '../types'
import { AssetStatusBadge } from './asset-status-badge'
import { AssetDetailsDialog } from './asset-details-dialog'
import { AssetMutateDialog } from './asset-mutate-dialog'
import { assetsApi } from '../api/assets-api'
import { toast } from 'sonner'
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2,
  AlertTriangle,
} from 'lucide-react'

interface AssetListProps {
  assets: Asset[]
  loading: boolean
  onRefresh: () => void
}

const CATEGORIES = [
  'All Categories',
  'Water & Sanitation',
  'Power & Energy',
  'Renewable Energy',
  'Flood Control',
  'Telecommunication',
  'Healthcare Infrastructure',
  'Roads & Bridges',
  'Public Buildings',
]

const PAGE_SIZE = 6

export function AssetList({ assets, loading, onRefresh }: AssetListProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog states
  const [detailsAssetId, setDetailsAssetId] = useState<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [mutateOpen, setMutateOpen] = useState(false)
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null)

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchSearch =
        search === '' ||
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.assetCode.toLowerCase().includes(search.toLowerCase()) ||
        asset.location.toLowerCase().includes(search.toLowerCase())

      const matchCategory =
        categoryFilter === 'All Categories' ||
        asset.category.toLowerCase() === categoryFilter.toLowerCase()

      const matchStatus =
        statusFilter === 'all' || asset.status === statusFilter

      return matchSearch && matchCategory && matchStatus
    })
  }, [assets, search, categoryFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / PAGE_SIZE) || 1
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredAssets.slice(start, start + PAGE_SIZE)
  }, [filteredAssets, currentPage])

  const handleDelete = async (asset: Asset) => {
    if (asset.activeIncidentsCount > 0) {
      toast.error(
        `Cannot delete ${asset.assetCode}. It has ${asset.activeIncidentsCount} active incident(s).`
      )
      return
    }

    if (!confirm(`Are you sure you want to delete asset '${asset.name}'?`)) {
      return
    }

    try {
      await assetsApi.delete(asset.id)
      toast.success(`Asset '${asset.name}' removed`)
      onRefresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete asset'
      toast.error(msg)
    }
  }

  const handleOpenEdit = (asset: Asset) => {
    setAssetToEdit(asset)
    setMutateOpen(true)
  }

  const handleOpenCreate = () => {
    setAssetToEdit(null)
    setMutateOpen(true)
  }

  const handleOpenDetails = (id: number) => {
    setDetailsAssetId(id)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-4 rounded-xl border shadow-xs">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search code, name, or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:inline" />
            <Select
              value={categoryFilter}
              onValueChange={(val) => {
                setCategoryFilter(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                <SelectItem value="Decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleOpenCreate} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Register Asset
        </Button>
      </div>

      {/* Assets Table */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Asset Code</TableHead>
              <TableHead className="font-semibold">Name & Category</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Incidents</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Loading assets register...
                </TableCell>
              </TableRow>
            ) : paginatedAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Building2 className="h-8 w-8 text-muted-foreground/50 mb-1" />
                    <p className="font-medium">No assets found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAssets.map((asset) => (
                <TableRow
                  key={asset.id}
                  className="hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => handleOpenDetails(asset.id)}
                >
                  <TableCell className="font-mono font-medium text-xs text-primary">
                    {asset.assetCode}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">{asset.category}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {asset.location}
                  </TableCell>
                  <TableCell>
                    <AssetStatusBadge status={asset.status} />
                  </TableCell>
                  <TableCell>
                    {asset.activeIncidentsCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <AlertTriangle className="h-3 w-3" />
                        {asset.activeIncidentsCount} active
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Clean</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDetails(asset.id)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details & History
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(asset)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Asset
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(asset)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Asset
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-sm">
          <div className="text-muted-foreground text-xs">
            Showing <span className="font-medium">{filteredAssets.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * PAGE_SIZE, filteredAssets.length)}
            </span>{' '}
            of <span className="font-medium">{filteredAssets.length}</span> assets
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-xs font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AssetDetailsDialog
        assetId={detailsAssetId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <AssetMutateDialog
        assetToEdit={assetToEdit}
        open={mutateOpen}
        onOpenChange={setMutateOpen}
        onSuccess={onRefresh}
      />
    </div>
  )
}
