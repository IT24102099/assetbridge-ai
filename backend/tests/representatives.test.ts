import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/db/storage.js';

describe('Representative API', () => {
  beforeEach(() => {
    db.resetToSeed();
  });

  it('GET /api/representatives - should return paginated representatives list', async () => {
    const res = await request(app).get('/api/representatives');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/representatives - filter by status and search keyword', async () => {
    const res = await request(app).get('/api/representatives?status=ACTIVE&search=Alex');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Alex Morgan');
  });

  it('GET /api/representatives/:id - should return representative details', async () => {
    const res = await request(app).get('/api/representatives/rep-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('rep-1');
    expect(res.body.data.code).toBe('REP-1001');
  });

  it('GET /api/representatives/:id - return 404 when not found', async () => {
    const res = await request(app).get('/api/representatives/rep-999999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/representatives - should create new representative', async () => {
    const newRep = {
      code: 'REP-9999',
      name: 'Test Representative',
      role: 'Quality Inspector',
      email: 'test.rep@assetbridge.com',
      phone: '+1 (555) 999-0000',
      location: 'Central Region',
      address: '100 Test St',
      nic: 'NIC-11111111',
      skills: ['Audit', 'Inspection'],
      preferredAreas: ['Central Region'],
      assignedAssets: ['AST-100'],
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      joinedDate: '2026-01-01',
    };

    const res = await request(app).post('/api/representatives').send(newRep);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('REP-9999');
  });

  it('POST /api/representatives - return 400 on validation failure', async () => {
    const invalidRep = {
      code: 'R',
      name: '',
      email: 'not-an-email',
    };

    const res = await request(app).post('/api/representatives').send(invalidRep);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/representatives - return 409 on duplicate code', async () => {
    const duplicateRep = {
      code: 'REP-1001', // existing code
      name: 'Duplicate Representative',
      role: 'Inspector',
      email: 'dup@assetbridge.com',
      phone: '+1 (555) 000-1111',
      location: 'North Region',
      address: '100 North Rd',
      nic: 'NIC-00000',
      joinedDate: '2026-01-01',
    };

    const res = await request(app).post('/api/representatives').send(duplicateRep);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/representatives/:id - should update representative', async () => {
    const res = await request(app)
      .put('/api/representatives/rep-1')
      .send({ name: 'Alex Morgan Updated', role: 'Chief Field Officer' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Alex Morgan Updated');
    expect(res.body.data.role).toBe('Chief Field Officer');
  });

  it('DELETE /api/representatives/:id - should delete representative', async () => {
    const deleteRes = await request(app).delete('/api/representatives/rep-6');
    expect(deleteRes.status).toBe(200);

    const getRes = await request(app).get('/api/representatives/rep-6');
    expect(getRes.status).toBe(404);
  });
});
