import { db } from '../../db/storage.js';
import { ProviderAvailability, AvailabilityQueryParams } from './types.js';

export class AvailabilityService {
  public static getByProviderId(
    providerId: string,
    params: AvailabilityQueryParams
  ): { data?: ProviderAvailability[]; providerNotFound?: boolean } {
    const data = db.read();
    const providerExists = data.providers.some((p) => p.id === providerId);
    if (!providerExists) {
      return { providerNotFound: true };
    }

    let slots = data.availability.filter((a) => a.providerId === providerId);

    if (params.date) {
      slots = slots.filter((a) => a.date === params.date);
    }

    if (params.startDate && params.endDate) {
      slots = slots.filter((a) => a.date >= params.startDate! && a.date <= params.endDate!);
    }

    if (params.year) {
      slots = slots.filter((a) => {
        const yr = parseInt(a.date.split('-')[0], 10);
        return yr === params.year;
      });
    }

    if (params.month) {
      slots = slots.filter((a) => {
        const mo = parseInt(a.date.split('-')[1], 10);
        return mo === params.month;
      });
    }

    // Sort by date and startTime
    slots.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });

    return { data: slots };
  }

  public static create(
    providerId: string,
    payload: Omit<ProviderAvailability, 'id' | 'providerId'>
  ): { availability?: ProviderAvailability; providerNotFound?: boolean } {
    const data = db.read();
    const providerExists = data.providers.some((p) => p.id === providerId);
    if (!providerExists) {
      return { providerNotFound: true };
    }

    const newSlot: ProviderAvailability = {
      id: `avail-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      providerId,
      date: payload.date,
      status: payload.status || 'AVAILABLE',
      startTime: payload.startTime,
      endTime: payload.endTime,
      notes: payload.notes || '',
    };

    db.write((state) => {
      state.availability.push(newSlot);
    });

    return { availability: newSlot };
  }

  public static update(
    providerId: string,
    availabilityId: string,
    payload: Partial<Omit<ProviderAvailability, 'id' | 'providerId'>>
  ): { availability?: ProviderAvailability; notFound?: boolean } {
    const data = db.read();
    const index = data.availability.findIndex(
      (a) => a.id === availabilityId && a.providerId === providerId
    );

    if (index === -1) {
      return { notFound: true };
    }

    let updated!: ProviderAvailability;
    db.write((state) => {
      state.availability[index] = {
        ...state.availability[index],
        ...payload,
      };
      updated = state.availability[index];
    });

    return { availability: updated };
  }

  public static delete(
    providerId: string,
    availabilityId: string
  ): { success: boolean; notFound?: boolean } {
    const data = db.read();
    const index = data.availability.findIndex(
      (a) => a.id === availabilityId && a.providerId === providerId
    );

    if (index === -1) {
      return { success: false, notFound: true };
    }

    db.write((state) => {
      state.availability.splice(index, 1);
    });

    return { success: true };
  }
}
