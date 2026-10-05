export type AssetStatus = 'Active' | 'Maintenance' | 'Decommissioned'

export interface AssetHistory {
  id: number
  assetId: number
  eventType: string
  description: string
  date: string
  recordedBy?: string
}

export interface Asset {
  id: number
  assetCode: string
  name: string
  category: string
  location: string
  address?: string
  coordinates?: string
  status: AssetStatus
  ownerId?: string
  createdAt: string
  updatedAt?: string
  activeIncidentsCount: number
  histories?: AssetHistory[]
}

export interface CreateAssetInput {
  assetCode: string
  name: string
  category: string
  location: string
  address?: string
  coordinates?: string
  status: AssetStatus
  ownerId?: string
}

export interface UpdateAssetInput {
  name: string
  category: string
  location: string
  address?: string
  coordinates?: string
  status: AssetStatus
  ownerId?: string
}
