import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AssetList } from './components/asset-list'
import { assetsApi } from './api/assets-api'
import { Asset } from './types'
import {
  Building2,
  CheckCircle2,
  Wrench,
  Ban,
  RefreshCw,
} from 'lucide-react'

export function AssetsFeature() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAssets = async () => {
    setLoading(true)
    try {
      const data = await assetsApi.getAll()
      setAssets(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  // KPI Calculations
  const totalAssets = assets.length
  const activeAssets = assets.filter((a) => a.status === 'Active').length
  const maintenanceAssets = assets.filter((a) => a.status === 'Maintenance').length
  const decommissionedAssets = assets.filter((a) => a.status === 'Decommissioned').length

  return (
    <>
      <Header fixed>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h1 className="text-base font-semibold">Infrastructure Asset Register</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-6">
          {/* Header Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Asset Management</h2>
              <p className="text-sm text-muted-foreground">
                Register, monitor, and maintain public and municipal infrastructure across Sri Lanka.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAssets}
              disabled={loading}
              className="gap-2 self-start sm:self-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssets}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered infrastructure units
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Active
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {activeAssets}
                </div>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                  Operational and online
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-amber-500/20 bg-amber-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Maintenance
                </CardTitle>
                <Wrench className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {maintenanceAssets}
                </div>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                  Requires attention / under repair
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-rose-500/20 bg-rose-500/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-rose-600 dark:text-rose-400">
                  Decommissioned
                </CardTitle>
                <Ban className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {decommissionedAssets}
                </div>
                <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">
                  Archived / offline units
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main List & Table */}
          <AssetList assets={assets} loading={loading} onRefresh={fetchAssets} />
        </div>
      </Main>
    </>
  )
}
export default AssetsFeature
