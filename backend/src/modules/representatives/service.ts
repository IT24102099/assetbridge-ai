import { db } from '../../db/storage.js';
import { Representative, RepresentativeQueryParams, PaginatedResult } from './types.js';

export class RepresentativeService {
  public static getAll(params: RepresentativeQueryParams): PaginatedResult<Representative> {
    const data = db.read();
    let reps = [...data.representatives];

    if (params.search) {
      const q = params.search.toLowerCase();
      reps = reps.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (params.status) {
      reps = reps.filter((r) => r.status.toUpperCase() === params.status?.toUpperCase());
    }

    if (params.location) {
      const loc = params.location.toLowerCase();
      reps = reps.filter((r) => r.location.toLowerCase().includes(loc));
    }

    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const total = reps.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = reps.slice(startIndex, startIndex + limit);

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

  public static getById(id: string): Representative | null {
    const data = db.read();
    return data.representatives.find((r) => r.id === id) || null;
  }

  public static create(payload: Omit<Representative, 'id'> & { id?: string }): { representative?: Representative; conflict?: boolean; error?: string } {
    const data = db.read();

    const existingCode = data.representatives.find(
      (r) => r.code.toLowerCase() === payload.code.toLowerCase()
    );
    if (existingCode) {
      return { conflict: true, error: `Representative code '${payload.code}' already exists` };
    }

    const newRep: Representative = {
      id: payload.id || `rep-${Date.now()}`,
      code: payload.code,
      name: payload.name,
      role: payload.role,
      email: payload.email,
      phone: payload.phone,
      location: payload.location,
      address: payload.address,
      nic: payload.nic,
      skills: payload.skills || [],
      preferredAreas: payload.preferredAreas || [],
      assignedAssets: payload.assignedAssets || [],
      status: payload.status || 'PENDING',
      verificationStatus: payload.verificationStatus || 'PENDING',
      joinedDate: payload.joinedDate,
      notes: payload.notes || '',
    };

    db.write((state) => {
      state.representatives.push(newRep);
    });

    return { representative: newRep };
  }

  public static update(
    id: string,
    payload: Partial<Representative>
  ): { representative?: Representative; notFound?: boolean; conflict?: boolean; error?: string } {
    const data = db.read();
    const index = data.representatives.findIndex((r) => r.id === id);
    if (index === -1) {
      return { notFound: true, error: 'Representative not found' };
    }

    if (payload.code) {
      const duplicateCode = data.representatives.find(
        (r) => r.id !== id && r.code.toLowerCase() === payload.code?.toLowerCase()
      );
      if (duplicateCode) {
        return { conflict: true, error: `Representative code '${payload.code}' already exists` };
      }
    }

    let updatedRep!: Representative;
    db.write((state) => {
      state.representatives[index] = {
        ...state.representatives[index],
        ...payload,
      };
      updatedRep = state.representatives[index];
    });

    return { representative: updatedRep };
  }

  public static delete(id: string): { success: boolean; notFound?: boolean } {
    const data = db.read();
    const index = data.representatives.findIndex((r) => r.id === id);
    if (index === -1) {
      return { success: false, notFound: true };
    }

    db.write((state) => {
      state.representatives.splice(index, 1);
    });

    return { success: true };
  }
}
