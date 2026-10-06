import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/db/storage.js';

describe('Provider Availability API', () => {
  beforeEach(() => {
    db.resetToSeed();
  });

  it('GET /api/providers/:id/availability - should return provider availability slots', async () => {
    const res = await request(app).get('/api/providers/prov-1/availability');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/providers/:id/availability - should filter by date', async () => {
    const res = await request(app).get('/api/providers/prov-1/availability?date=2026-10-06');
    expect(res.status).toBe(200);
    expect(res.body.data.every((s: any) => s.date === '2026-10-06')).toBe(true);
  });

  it('POST /api/providers/:id/availability - should create availability slot', async () => {
    const newSlot = {
      date: '2026-10-15',
      status: 'AVAILABLE',
      startTime: '09:00',
      endTime: '12:00',
      notes: 'Test open slot',
    };

    const res = await request(app).post('/api/providers/prov-1/availability').send(newSlot);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.date).toBe('2026-10-15');
    expect(res.body.data.providerId).toBe('prov-1');
  });

  it('PUT /api/providers/:id/availability/:availabilityId - should update slot', async () => {
    const res = await request(app)
      .put('/api/providers/prov-1/availability/avail-1')
      .send({ status: 'BUSY', notes: 'Booked for urgent repair' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('BUSY');
    expect(res.body.data.notes).toBe('Booked for urgent repair');
  });

  it('DELETE /api/providers/:id/availability/:availabilityId - should delete slot', async () => {
    const delRes = await request(app).delete('/api/providers/prov-1/availability/avail-3');
    expect(delRes.status).toBe(200);

    const getRes = await request(app).get('/api/providers/prov-1/availability?date=2026-10-07');
    expect(getRes.body.data.some((s: any) => s.id === 'avail-3')).toBe(false);
  });

  it('GET /api/providers/:id/availability - 404 if provider does not exist', async () => {
    const res = await request(app).get('/api/providers/prov-99999/availability');
    expect(res.status).toBe(404);
  });
});
