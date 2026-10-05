import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/db/storage.js';

describe('Service Provider API', () => {
  beforeEach(() => {
    db.resetToSeed();
  });

  it('GET /api/providers - should return paginated service providers list', async () => {
    const res = await request(app).get('/api/providers');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/providers - filter by skill and status', async () => {
    const res = await request(app).get('/api/providers?skill=Maintenance&status=VERIFIED');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((p: any) => p.verificationStatus === 'VERIFIED')).toBe(true);
  });

  it('GET /api/providers/:id - return provider details', async () => {
    const res = await request(app).get('/api/providers/prov-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('prov-1');
    expect(res.body.data.companyName).toBe('Apex Maintenance Services Ltd.');
  });

  it('GET /api/providers/:id - return 404 for unknown provider', async () => {
    const res = await request(app).get('/api/providers/prov-99999');
    expect(res.status).toBe(404);
  });

  it('POST /api/providers - create new provider', async () => {
    const newProv = {
      code: 'SP-9999',
      companyName: 'New Horizon Maintenance',
      contactPerson: 'Jane Doe',
      email: 'jane@newhorizon.com',
      phone: '+1 (555) 777-8888',
      address: '500 Skyline Drive',
      location: 'West Region',
      registrationNumber: 'REG-99999',
      skills: ['Maintenance', 'Electrical'],
      serviceAreas: ['West Region'],
      rating: 4.5,
      reviewCount: 10,
      jobsCount: 25,
      verificationStatus: 'VERIFIED',
      insuranceStatus: 'VERIFIED',
      description: 'Reliable commercial maintenance.',
    };

    const res = await request(app).post('/api/providers').send(newProv);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('SP-9999');
  });

  it('PUT /api/providers/:id - update provider details', async () => {
    const res = await request(app)
      .put('/api/providers/prov-1')
      .send({ rating: 4.95, description: 'Updated provider bio' });

    expect(res.status).toBe(200);
    expect(res.body.data.rating).toBe(4.95);
    expect(res.body.data.description).toBe('Updated provider bio');
  });

  it('DELETE /api/providers/:id - delete provider', async () => {
    const res = await request(app).delete('/api/providers/prov-7');
    expect(res.status).toBe(200);

    const getRes = await request(app).get('/api/providers/prov-7');
    expect(getRes.status).toBe(404);
  });
});
