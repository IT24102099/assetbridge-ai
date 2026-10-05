import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/db/storage.js';

describe('Provider Search & Matching API', () => {
  beforeEach(() => {
    db.resetToSeed();
  });

  it('GET /api/providers/search - should return deterministic matching results', async () => {
    const res = await request(app).get('/api/providers/search?skill=Maintenance&location=North Region&availableDate=2026-10-06');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const firstMatch = res.body.data[0];
    expect(firstMatch.provider).toBeDefined();
    expect(firstMatch.location).toBeDefined();
    expect(firstMatch.distance).toBeDefined();
    expect(firstMatch.rating).toBeDefined();
    expect(firstMatch.verificationStatus).toBeDefined();
    expect(firstMatch.availability).toBeDefined();
  });

  it('GET /api/providers/search - should filter out providers exceeding maxDistance', async () => {
    const res = await request(app).get('/api/providers/search?location=North Region&maxDistance=10');
    expect(res.status).toBe(200);
    expect(res.body.data.every((m: any) => m.distance <= 10)).toBe(true);
  });
});
