import { apiClient } from '@/lib/api-client'
import { Asset, AssetHistory, CreateAssetInput, UpdateAssetInput } from '../types'

// Realistic Sri Lanka infrastructure sample data
const initialMockAssets: Asset[] = [
  {
    id: 1,
    assetCode: 'AST-CMB-001',
    name: 'Colombo Central Water Pump #4',
    category: 'Water & Sanitation',
    location: 'Maligawatta Pumping Station, Colombo 10',
    address: 'No 45, Sri Sangaraja Mawatha, Colombo',
    coordinates: '6.9319° N, 79.8656° E',
    status: 'Active',
    ownerId: 'EMP-0144',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    activeIncidentsCount: 0,
    histories: [
      {
        id: 101,
        assetId: 1,
        eventType: 'Registered',
        description: 'Asset registered in system and passed initial pressure verification.',
        date: new Date(Date.now() - 30 * 86400000).toISOString(),
        recordedBy: 'Eng. Perera',
      },
      {
        id: 102,
        assetId: 1,
        eventType: 'Maintenance',
        description: 'Routine seal replacement and lubrication completed.',
        date: new Date(Date.now() - 10 * 86400000).toISOString(),
        recordedBy: 'Tech. Silva',
      },
    ],
  },
  {
    id: 2,
    assetCode: 'AST-KND-002',
    name: 'Kandy General Hospital Backup Generator',
    category: 'Power & Energy',
    location: 'Main Power House, Kandy Teaching Hospital',
    address: 'Hospital Square, Kandy',
    coordinates: '7.2906° N, 80.6337° E',
    status: 'Maintenance',
    ownerId: 'EMP-0210',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    activeIncidentsCount: 1,
    histories: [
      {
        id: 201,
        assetId: 2,
        eventType: 'Registered',
        description: 'Diesel generator 500kVA commissioned for critical ICU backup.',
        date: new Date(Date.now() - 60 * 86400000).toISOString(),
        recordedBy: 'Chief Engineer',
      },
      {
        id: 202,
        assetId: 2,
        eventType: 'StatusChanged',
        description: 'Asset placed in Maintenance due to High severity cooling sensor fault.',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        recordedBy: 'System',
      },
    ],
  },
  {
    id: 3,
    assetCode: 'AST-JFN-003',
    name: 'Jaffna Agro Solar Grid Inverter Unit',
    category: 'Renewable Energy',
    location: 'Thirunelvely Agri-Research Zone, Jaffna',
    address: 'Palali Road, Thirunelvely, Jaffna',
    coordinates: '9.6849° N, 80.0210° E',
    status: 'Active',
    ownerId: 'EMP-0312',
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    activeIncidentsCount: 0,
    histories: [
      {
        id: 301,
        assetId: 3,
        eventType: 'Registered',
        description: 'Smart Solar inverter installed for community cold storage irrigation pump.',
        date: new Date(Date.now() - 90 * 86400000).toISOString(),
        recordedBy: 'Jaffna Grid Admin',
      },
    ],
  },
  {
    id: 4,
    assetCode: 'AST-GLE-004',
    name: 'Galle Fort Coastal Drainage Gate #2',
    category: 'Flood Control',
    location: 'Rampart Street Gate, Galle Fort',
    address: 'Old Dutch Ramparts, Galle',
    coordinates: '6.0329° N, 80.2168° E',
    status: 'Active',
    ownerId: 'EMP-0089',
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    activeIncidentsCount: 0,
    histories: [
      {
        id: 401,
        assetId: 4,
        eventType: 'Registered',
        description: 'Automated sluice gate commissioned for tidal flood management.',
        date: new Date(Date.now() - 120 * 86400000).toISOString(),
        recordedBy: 'Irrigation Dept',
      },
    ],
  },
  {
    id: 5,
    assetCode: 'AST-MTL-005',
    name: 'Matara Railway Telecommunication Tower',
    category: 'Telecommunication',
    location: 'Matara Railway Station Junction, Matara',
    address: 'Station Road, Matara',
    coordinates: '5.9496° N, 80.5353° E',
    status: 'Decommissioned',
    ownerId: 'EMP-0402',
    createdAt: new Date(Date.now() - 365 * 86400000).toISOString(),
    activeIncidentsCount: 0,
    histories: [
      {
        id: 501,
        assetId: 5,
        eventType: 'Registered',
        description: 'VHF rail signal repeater installed.',
        date: new Date(Date.now() - 365 * 86400000).toISOString(),
        recordedBy: 'Signals Team',
      },
      {
        id: 502,
        assetId: 5,
        eventType: 'StatusChanged',
        description: 'Decommissioned and replaced by fiber optical signaling unit.',
        date: new Date(Date.now() - 15 * 86400000).toISOString(),
        recordedBy: 'Manager Fernando',
      },
    ],
  },
]

let memoryAssets = [...initialMockAssets]

export const assetsApi = {
  async getAll(params?: { search?: string; category?: string; status?: string }): Promise<Asset[]> {
    try {
      const response = await apiClient.get<Asset[]>('/assets', { params })
      return response.data
    } catch {
      // Fallback to local memory mock if API is not yet running
      let filtered = [...memoryAssets]
      if (params?.search) {
        const s = params.search.toLowerCase()
        filtered = filtered.filter(
          (a) =>
            a.name.toLowerCase().includes(s) ||
            a.assetCode.toLowerCase().includes(s) ||
            a.location.toLowerCase().includes(s) ||
            a.category.toLowerCase().includes(s)
        )
      }
      if (params?.category && params.category !== 'all') {
        filtered = filtered.filter(
          (a) => a.category.toLowerCase() === params.category!.toLowerCase()
        )
      }
      if (params?.status && params.status !== 'all') {
        filtered = filtered.filter((a) => a.status === params.status)
      }
      return filtered
    }
  },

  async getById(id: number): Promise<Asset | null> {
    try {
      const response = await apiClient.get<Asset>(`/assets/${id}`, {
        params: { includeHistory: true },
      })
      return response.data
    } catch {
      const asset = memoryAssets.find((a) => a.id === id)
      return asset || null
    }
  },

  async create(input: CreateAssetInput): Promise<Asset> {
    try {
      const response = await apiClient.post<Asset>('/assets', input)
      return response.data
    } catch {
      const newAsset: Asset = {
        id: Date.now(),
        assetCode: input.assetCode.toUpperCase(),
        name: input.name,
        category: input.category,
        location: input.location,
        address: input.address,
        coordinates: input.coordinates,
        status: input.status,
        ownerId: input.ownerId,
        createdAt: new Date().toISOString(),
        activeIncidentsCount: 0,
        histories: [
          {
            id: Date.now() + 1,
            assetId: Date.now(),
            eventType: 'Registered',
            description: `Asset '${input.name}' registered via web console.`,
            date: new Date().toISOString(),
            recordedBy: input.ownerId || 'Admin',
          },
        ],
      }
      memoryAssets.unshift(newAsset)
      return newAsset
    }
  },

  async update(id: number, input: UpdateAssetInput): Promise<Asset> {
    try {
      const response = await apiClient.put<Asset>(`/assets/${id}`, input)
      return response.data
    } catch {
      const index = memoryAssets.findIndex((a) => a.id === id)
      if (index === -1) throw new Error('Asset not found')
      const updated: Asset = {
        ...memoryAssets[index],
        ...input,
        updatedAt: new Date().toISOString(),
      }
      memoryAssets[index] = updated
      return updated
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/assets/${id}`)
    } catch {
      memoryAssets = memoryAssets.filter((a) => a.id !== id)
    }
  },

  async getHistory(assetId: number): Promise<AssetHistory[]> {
    try {
      const response = await apiClient.get<AssetHistory[]>(`/assets/${assetId}/history`)
      return response.data
    } catch {
      const asset = memoryAssets.find((a) => a.id === assetId)
      return asset?.histories || []
    }
  },
}
