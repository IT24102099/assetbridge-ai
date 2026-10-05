import { db } from '../../db/storage.js';
import {
  ServiceProvider,
  ProviderQueryParams,
  ProviderSearchCriteria,
  ProviderMatchResult,
} from './types.js';
import { PaginatedResult } from '../representatives/types.js';
import { DeterministicMatchingEngine } from './matching.js';

export class ProviderService {
  public static getAll(params: ProviderQueryParams): PaginatedResult<ServiceProvider> {
    const data = db.read();
    let providers = [...data.providers];

    if (params.search) {
      const q = params.search.toLowerCase();
      providers = providers.filter(
        (p) =>
          p.companyName.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.contactPerson.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (params.skill) {
      const sk = params.skill.toLowerCase();
      providers = providers.filter((p) =>
        p.skills.some((s) => s.toLowerCase().includes(sk))
      );
    }

    if (params.status) {
      providers = providers.filter(
        (p) => p.verificationStatus.toUpperCase() === params.status?.toUpperCase()
      );
    }

    if (params.location) {
      const loc = params.location.toLowerCase();
      providers = providers.filter((p) => p.location.toLowerCase().includes(loc));
    }

    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const total = providers.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = providers.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  public static getById(id: string): ServiceProvider | null {
    const data = db.read();
    return data.providers.find((p) => p.id === id) || null;
  }

  public static searchAndMatch(criteria: ProviderSearchCriteria): ProviderMatchResult[] {
    const data = db.read();
    return DeterministicMatchingEngine.match(data.providers, data.availability, criteria);
  }

  public static create(
    payload: Omit<ServiceProvider, 'id'> & { id?: string }
  ): { provider?: ServiceProvider; conflict?: boolean; error?: string } {
    const data = db.read();

    const existingCode = data.providers.find(
      (p) => p.code.toLowerCase() === payload.code.toLowerCase()
    );
    if (existingCode) {
      return { conflict: true, error: `Provider code '${payload.code}' already exists` };
    }

    const newProvider: ServiceProvider = {
      id: payload.id || `prov-${Date.now()}`,
      code: payload.code,
      companyName: payload.companyName,
      contactPerson: payload.contactPerson,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      location: payload.location,
      registrationNumber: payload.registrationNumber,
      skills: payload.skills || [],
      serviceAreas: payload.serviceAreas || [],
      rating: payload.rating ?? 5.0,
      reviewCount: payload.reviewCount ?? 0,
      jobsCount: payload.jobsCount ?? 0,
      verificationStatus: payload.verificationStatus || 'PENDING',
      insuranceStatus: payload.insuranceStatus || 'PENDING',
      description: payload.description || '',
    };

    db.write((state) => {
      state.providers.push(newProvider);
    });

    return { provider: newProvider };
  }

  public static update(
    id: string,
    payload: Partial<ServiceProvider>
  ): { provider?: ServiceProvider; notFound?: boolean; conflict?: boolean; error?: string } {
    const data = db.read();
    const index = data.providers.findIndex((p) => p.id === id);
    if (index === -1) {
      return { notFound: true, error: 'Provider not found' };
    }

    if (payload.code) {
      const duplicateCode = data.providers.find(
        (p) => p.id !== id && p.code.toLowerCase() === payload.code?.toLowerCase()
      );
      if (duplicateCode) {
        return { conflict: true, error: `Provider code '${payload.code}' already exists` };
      }
    }

    let updatedProvider!: ServiceProvider;
    db.write((state) => {
      state.providers[index] = {
        ...state.providers[index],
        ...payload,
      };
      updatedProvider = state.providers[index];
    });

    return { provider: updatedProvider };
  }

  public static delete(id: string): { success: boolean; notFound?: boolean } {
    const data = db.read();
    const index = data.providers.findIndex((p) => p.id === id);
    if (index === -1) {
      return { success: false, notFound: true };
    }

    db.write((state) => {
      state.providers.splice(index, 1);
      // Clean up availability slots for deleted provider
      state.availability = state.availability.filter((a) => a.providerId !== id);
    });

    return { success: true };
  }
}
