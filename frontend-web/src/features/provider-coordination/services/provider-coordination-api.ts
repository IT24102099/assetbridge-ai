import type {
  Representative,
  ServiceProvider,
  AvailabilitySlot,
  ProviderMatchResult,
} from '../types';

const API_BASE = '/api';

interface BackendRepresentative {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  location?: string;
  status: string;
  assignedAssets?: string[];
  notes?: string;
  skills?: string[];
  joinedDate?: string;
}

interface BackendProvider {
  id: string;
  code: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  skills?: string[];
  location: string;
  serviceAreas?: string[];
  rating?: number;
  verificationStatus: string;
  jobsCount?: number;
  description?: string;
  address?: string;
}

interface BackendMatchResult {
  provider: BackendProvider;
  distance: number;
  rating: number;
  verificationStatus: string;
  jobsCount: number;
  availability: string;
}

interface BackendAvailability {
  id: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
}

export async function fetchRepresentativesApi(): Promise<Representative[] | null> {
  try {
    const res = await fetch(`${API_BASE}/representatives`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return null;

    return (json.data as BackendRepresentative[]).map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      email: item.email,
      phone: item.phone,
      role: item.role,
      region: item.location || 'North Region',
      status:
        item.status.toLowerCase() === 'active'
          ? 'active'
          : item.status.toLowerCase() === 'inactive'
            ? 'inactive'
            : 'on-leave',
      assignedProvidersCount: item.assignedAssets ? item.assignedAssets.length : 0,
      activeTasks: item.assignedAssets ? item.assignedAssets.length * 2 : 0,
      rating: 4.8,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: item.notes || `Field representative based in ${item.location}.`,
      specialization: (item.skills && item.skills.join(' & ')) || 'General Operations',
      dateJoined: item.joinedDate || '2021-01-01',
    }));
  } catch {
    return null;
  }
}

export async function createRepresentativeApi(
  data: Partial<Representative>
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/representatives`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name || 'New Representative',
        role: data.role || 'Field Representative',
        email: data.email || 'rep@assetbridge.com',
        phone: data.phone || '+1 (555) 000-0000',
        location: data.region || 'North Region',
        address: `${data.region || 'North Region'} Headquarters`,
        nic: `NIC-${Math.floor(100000000 + Math.random() * 900000000)}`,
        skills: data.specialization ? [data.specialization] : [],
        preferredAreas: [data.region || 'North Region'],
        assignedAssets: [],
        status: (data.status || 'ACTIVE').toUpperCase(),
        verificationStatus: 'VERIFIED',
        joinedDate: new Date().toISOString().split('T')[0],
        notes: data.bio || '',
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateRepresentativeApi(
  id: string,
  data: Partial<Representative>
): Promise<boolean> {
  try {
    const payload: Record<string, unknown> = {};
    if (data.name) payload.name = data.name;
    if (data.email) payload.email = data.email;
    if (data.phone) payload.phone = data.phone;
    if (data.role) payload.role = data.role;
    if (data.region) payload.location = data.region;
    if (data.status) payload.status = data.status.toUpperCase();
    if (data.bio) payload.notes = data.bio;

    const res = await fetch(`${API_BASE}/representatives/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteRepresentativeApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/representatives/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchProvidersApi(): Promise<ServiceProvider[] | null> {
  try {
    const res = await fetch(`${API_BASE}/providers`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return null;

    return (json.data as BackendProvider[]).map((item) => ({
      id: item.id,
      code: item.code,
      companyName: item.companyName,
      contactPerson: item.contactPerson,
      email: item.email,
      phone: item.phone,
      category: (item.skills?.[0] as ServiceProvider['category']) || 'Maintenance',
      region: item.location,
      serviceArea: item.serviceAreas?.[0] || item.location,
      rating: item.rating || 4.8,
      hourlyRate: 95,
      status:
        item.verificationStatus.toLowerCase() === 'verified'
          ? 'verified'
          : item.verificationStatus.toLowerCase() === 'pending'
            ? 'pending'
            : 'suspended',
      completedJobs: item.jobsCount || 0,
      responseTimeHours: 2,
      satisfactionRate: 96,
      certifications: item.skills || [],
      assignedRepresentativeId: 'rep-1',
      representativeName: 'Alex Morgan',
      avatar:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
      bio: item.description || '',
      address: item.address || '',
    }));
  } catch {
    return null;
  }
}

export async function createProviderApi(data: Partial<ServiceProvider>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: `SP-${Math.floor(2000 + Math.random() * 9000)}`,
        companyName: data.companyName || 'New Provider',
        contactPerson: data.contactPerson || 'Contact Person',
        email: data.email || 'provider@assetbridge.com',
        phone: data.phone || '+1 (555) 000-0000',
        address: data.address || `${data.region || 'North Region'} Industrial Plaza`,
        location: data.region || 'North Region',
        registrationNumber: `REG-${Math.floor(100000 + Math.random() * 900000)}`,
        skills: [data.category || 'Maintenance', ...(data.certifications || [])],
        serviceAreas: [data.serviceArea || data.region || 'North Region'],
        rating: 5.0,
        reviewCount: 0,
        jobsCount: 0,
        verificationStatus: (data.status || 'VERIFIED').toUpperCase(),
        insuranceStatus: 'VERIFIED',
        description: data.bio || '',
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateProviderApi(
  id: string,
  data: Partial<ServiceProvider>
): Promise<boolean> {
  try {
    const payload: Record<string, unknown> = {};
    if (data.companyName) payload.companyName = data.companyName;
    if (data.contactPerson) payload.contactPerson = data.contactPerson;
    if (data.email) payload.email = data.email;
    if (data.phone) payload.phone = data.phone;
    if (data.region) payload.location = data.region;
    if (data.status) payload.verificationStatus = data.status.toUpperCase();
    if (data.bio) payload.description = data.bio;

    const res = await fetch(`${API_BASE}/providers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteProviderApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/providers/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function searchMatchingProvidersApi(
  skill?: string,
  location?: string,
  availableDate?: string
): Promise<ProviderMatchResult[] | null> {
  try {
    const params = new URLSearchParams();
    if (skill) params.set('skill', skill);
    if (location) params.set('location', location);
    if (availableDate) params.set('availableDate', availableDate);

    const res = await fetch(`${API_BASE}/providers/search?${params.toString()}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return null;

    return (json.data as BackendMatchResult[]).map((item) => ({
      provider: {
        id: item.provider.id,
        code: item.provider.code,
        companyName: item.provider.companyName,
        contactPerson: item.provider.contactPerson,
        email: item.provider.email,
        phone: item.provider.phone,
        category: (item.provider.skills?.[0] as ServiceProvider['category']) || 'Maintenance',
        region: item.provider.location,
        serviceArea: item.provider.serviceAreas?.[0] || item.provider.location,
        rating: item.rating,
        hourlyRate: 95,
        status:
          item.verificationStatus.toLowerCase() === 'verified'
            ? 'verified'
            : 'pending',
        completedJobs: item.jobsCount,
        responseTimeHours: 2,
        satisfactionRate: 95,
        certifications: item.provider.skills || [],
        assignedRepresentativeId: 'rep-1',
        representativeName: 'Alex Morgan',
        avatar:
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
        bio: item.provider.description || '',
        address: item.provider.address || '',
      },
      matchScore: Math.max(60, Math.min(99, 100 - item.distance * 2)),
      matchReasons: [
        `Distance: ${item.distance} km`,
        `Rating: ${item.rating}/5.0`,
        `Status: ${item.verificationStatus}`,
      ],
      categoryMatch: true,
      regionMatch: item.distance <= 15,
      ratingMatch: item.rating >= 4.5,
      priceMatch: true,
      availabilityMatch: item.availability === 'AVAILABLE',
    }));
  } catch {
    return null;
  }
}

export async function fetchProviderAvailabilityApi(
  providerId: string
): Promise<AvailabilitySlot[] | null> {
  try {
    const res = await fetch(`${API_BASE}/providers/${providerId}/availability`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return null;

    return (json.data as BackendAvailability[]).map((item) => ({
      id: item.id,
      providerId: item.providerId,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      status:
        item.status.toLowerCase() === 'available'
          ? 'available'
          : item.status.toLowerCase() === 'busy'
            ? 'booked'
            : 'unavailable',
      notes: item.notes,
    }));
  } catch {
    return null;
  }
}

export async function createAvailabilitySlotApi(
  providerId: string,
  slot: Partial<AvailabilitySlot>
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/providers/${providerId}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: slot.date,
        status: slot.status === 'booked' ? 'BUSY' : (slot.status || 'AVAILABLE').toUpperCase(),
        startTime: slot.startTime,
        endTime: slot.endTime,
        notes: slot.notes || '',
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateAvailabilitySlotApi(
  providerId: string,
  slotId: string,
  slot: Partial<AvailabilitySlot>
): Promise<boolean> {
  try {
    const payload: Record<string, unknown> = {};
    if (slot.status)
      payload.status = slot.status === 'booked' ? 'BUSY' : slot.status.toUpperCase();
    if (slot.startTime) payload.startTime = slot.startTime;
    if (slot.endTime) payload.endTime = slot.endTime;
    if (slot.notes) payload.notes = slot.notes;

    const res = await fetch(`${API_BASE}/providers/${providerId}/availability/${slotId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteAvailabilitySlotApi(
  providerId: string,
  slotId: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/providers/${providerId}/availability/${slotId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface AgentRecommendationResponse {
  request: {
    maintenanceRequirement: string;
    requiredSkill?: string;
    location?: string;
    requiredDate?: string;
  };
  recommendations: Array<{
    providerId: string;
    providerName: string;
    matchScore: number;
    reasons: string[];
    availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
    relevantExperience: string;
    rating: number;
    verificationStatus: string;
    distanceKm: number;
    warnings?: string[];
  }>;
  warnings: string[];
  agentRunId: string;
  timestamp: string;
}

export async function runProviderIntelligenceAgentApi(req: {
  maintenanceRequirement: string;
  requiredSkill?: string;
  location?: string;
  requiredDate?: string;
}): Promise<AgentRecommendationResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/agents/provider-intelligence/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;
    return json.data as AgentRecommendationResponse;
  } catch {
    return null;
  }
}
