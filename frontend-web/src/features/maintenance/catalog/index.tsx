import { useState, useEffect } from 'react'
import { Package, Search, Plus, CheckCircle2 } from 'lucide-react'
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
import { ThemeSwitch } from '@/components/theme-switch'
import { maintenanceApi } from '../api'
import { CatalogItem } from '../types'

export function CatalogFeature() {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [newItem, setNewItem] = useState({
    itemName: '',
    category: 'Plumbing',
    unit: 'Piece',
    unitPriceLkr: 2500,
    status: 'Available' as const,
    description: '',
  })

  useEffect(() => {
    maintenanceApi.getCatalog().then(setItems)
  }, [])

  const categories = ['ALL', 'Plumbing', 'Electrical', 'Masonry', 'HVAC', 'Testing']

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    const created: CatalogItem = {
      id: `CAT-${Math.floor(100 + Math.random() * 900)}`,
      ...newItem,
    }
    setItems([...items, created])
    setIsDialogOpen(false)
    setNewItem({
      itemName: '',
      category: 'Plumbing',
      unit: 'Piece',
      unitPriceLkr: 2500,
      status: 'Available',
      description: '',
    })
  }

  return (
    <>
      <Header>
        <div className='flex items-center gap-2 font-semibold text-lg me-auto'>
          <Package className='h-5 w-5 text-primary' />
          <span>Regional Material & Service Price Book Catalog</span>
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='space-y-6'>
        {/* Top Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight'>
              Material & Service Rate Catalog
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Benchmarked regional price standards used by AI Agent 3 to audit
              contractor line-item bids.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className='gap-2 shadow-sm'>
                <Plus className='h-4 w-4' />
                Add Catalog Item
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[450px]'>
              <form onSubmit={handleAddItem}>
                <DialogHeader>
                  <DialogTitle>Add New Price Book Item</DialogTitle>
                  <DialogDescription>
                    Define standard unit rates and trade materials for Sri Lanka
                    region.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-1.5'>
                    <Label>Item Name</Label>
                    <Input
                      required
                      value={newItem.itemName}
                      onChange={(e) =>
                        setNewItem({ ...newItem, itemName: e.target.value })
                      }
                      placeholder='e.g., PPR Pipe 25mm'
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='space-y-1.5'>
                      <Label>Category</Label>
                      <select
                        className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                        value={newItem.category}
                        onChange={(e) =>
                          setNewItem({ ...newItem, category: e.target.value })
                        }
                      >
                        <option value='Plumbing'>Plumbing</option>
                        <option value='Electrical'>Electrical</option>
                        <option value='Masonry'>Masonry</option>
                        <option value='HVAC'>HVAC</option>
                        <option value='Testing'>Testing</option>
                      </select>
                    </div>
                    <div className='space-y-1.5'>
                      <Label>Unit</Label>
                      <Input
                        required
                        value={newItem.unit}
                        onChange={(e) =>
                          setNewItem({ ...newItem, unit: e.target.value })
                        }
                        placeholder='Piece, Day, Bag'
                      />
                    </div>
                  </div>
                  <div className='space-y-1.5'>
                    <Label>Standard Unit Price (LKR)</Label>
                    <Input
                      type='number'
                      required
                      value={newItem.unitPriceLkr}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          unitPriceLkr: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label>Description</Label>
                    <Input
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      placeholder='Specification or rating'
                    />
                  </div>
                </div>
                <div className='flex justify-end gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type='submit'>Save Item</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Bar & Search */}
        <div className='flex flex-col sm:flex-row gap-3 items-center justify-between'>
          <div className='flex gap-2 overflow-x-auto pb-1 text-xs w-full sm:w-auto'>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search items or specs...'
              className='pl-8 h-9 text-xs'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Catalog Items Table matching Wireframe A6 */}
        <Card className='shadow-sm'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg'>
              Regional Price Benchmarks ({filteredItems.length})
            </CardTitle>
            <CardDescription>
              Currency: Sri Lankan Rupee (LKR) | Last updated with Q4 2026 indices
            </CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead className='border-y bg-muted/40 text-xs uppercase text-muted-foreground'>
                  <tr>
                    <th className='py-3 px-4 font-semibold'>Item ID</th>
                    <th className='py-3 px-4 font-semibold'>Item Name</th>
                    <th className='py-3 px-4 font-semibold'>Category</th>
                    <th className='py-3 px-4 font-semibold'>Unit</th>
                    <th className='py-3 px-4 font-semibold'>Benchmark Rate</th>
                    <th className='py-3 px-4 font-semibold'>Stock / Status</th>
                    <th className='py-3 px-4 font-semibold'>Specification</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className='hover:bg-muted/30 transition-colors'
                    >
                      <td className='py-3.5 px-4 font-mono font-bold text-xs text-primary'>
                        {item.id}
                      </td>
                      <td className='py-3.5 px-4 font-semibold text-foreground'>
                        {item.itemName}
                      </td>
                      <td className='py-3.5 px-4'>
                        <span className='rounded bg-muted px-2 py-0.5 text-xs font-medium'>
                          {item.category}
                        </span>
                      </td>
                      <td className='py-3.5 px-4 text-xs text-muted-foreground'>
                        {item.unit}
                      </td>
                      <td className='py-3.5 px-4 font-bold text-foreground'>
                        LKR {item.unitPriceLkr.toLocaleString()}
                      </td>
                      <td className='py-3.5 px-4'>
                        <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600'>
                          <CheckCircle2 className='h-3 w-3' />
                          {item.status}
                        </span>
                      </td>
                      <td className='py-3.5 px-4 text-xs text-muted-foreground'>
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
