import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { db } from '../src/db/storage.js';

describe('Provider Intelligence Agent API', () => {
  beforeEach(() => {
    db.resetToSeed();
  });

  it('1 & 9: POST /api/agents/provider-intelligence/recommend - recommends suitable providers with valid structured schema', async () => {
    const reqBody = {
      maintenanceRequirement: 'HVAC unit failure in North facility warehouse',
      requiredSkill: 'Maintenance',
      location: 'North Region',
      requiredDate: '2026-10-06',
    };

    const res = await request(app)
      .post('/api/agents/provider-intelligence/recommend')
      .send(reqBody);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.agentRunId).toBeDefined();

    const data = res.body.data;
    expect(Array.isArray(data.recommendations)).toBe(true);
    expect(data.recommendations.length).toBeGreaterThan(0);

    const firstRec = data.recommendations[0];
    expect(firstRec.providerId).toBeDefined();
    expect(firstRec.providerName).toBeDefined();
    expect(firstRec.matchScore).toBeGreaterThanOrEqual(0.4);
    expect(firstRec.matchScore).toBeLessThanOrEqual(1.0);
    expect(Array.isArray(firstRec.reasons)).toBe(true);
    expect(firstRec.availability).toBeDefined();
  });

  it('2: excludes or marks providers missing required skill', async () => {
    const res = await request(app)
      .post('/api/agents/provider-intelligence/recommend')
      .send({
        maintenanceRequirement: 'Legal deed clearance',
        requiredSkill: 'Legal',
        location: 'South Region',
      });

    expect(res.status).toBe(200);
    const recs = res.body.data.recommendations;
    expect(recs.every((r: any) => r.reasons.some((reason: string) => reason.includes('Legal')))).toBe(true);
  });

  it('3: handles provider availability correctly', async () => {
    const res = await request(app)
      .post('/api/agents/provider-intelligence/recommend')
      .send({
        maintenanceRequirement: 'Emergency structural inspection',
        requiredSkill: 'Inspection',
        requiredDate: '2026-10-06',
      });

    expect(res.status).toBe(200);
    const recs = res.body.data.recommendations;
    expect(recs.length).toBeGreaterThan(0);
    // At least one rec should contain availability info
    expect(recs[0].availability).toBeDefined();
  });

  it('4 & 5: ranks multiple providers correctly using previous work and ratings', async () => {
    const res = await request(app)
      .post('/api/agents/provider-intelligence/recommend')
      .send({
        maintenanceRequirement: 'Routine facility repair',
        requiredSkill: 'Maintenance',
      });

    expect(res.status).toBe(200);
    const recs = res.body.data.recommendations;
    expect(recs.length).toBeGreaterThan(1);
    // Check that recommendations are sorted in descending order of matchScore
    for (let i = 0; i < recs.length - 1; i++) {
      expect(recs[i].matchScore).toBeGreaterThanOrEqual(recs[i + 1].matchScore);
    }
  });

  it('6: returns safe result when no provider matches', async () => {
    const res = await request(app)
      .post('/api/agents/provider-intelligence/recommend')
      .send({
        maintenanceRequirement: 'Deep space satellite calibration',
        requiredSkill: 'Astronautics',
        location: 'Unknown Galaxy',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.recommendations.length).toBe(0);
    expect(res.body.data.warnings.length).toBeGreaterThan(0);
  });

  it('7: rejects invalid input with 400', async () => {
    const res = await request(app)
      .post('/api/agents/provider-intelligence/recommend')
      .send({
        maintenanceRequirement: '', // empty requirement violates schema
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('11: persists AgentRun trace and tool executions', async () => {
    const recRes = await request(app)
      .post('/api/agents/provider-intelligence/recommend')
      .send({
        maintenanceRequirement: 'Hydraulics repair',
        requiredSkill: 'Maintenance',
      });

    const runId = recRes.body.data.agentRunId;
    expect(runId).toBeDefined();

    const traceRes = await request(app).get(`/api/agents/runs/${runId}`);
    expect(traceRes.status).toBe(200);
    expect(traceRes.body.success).toBe(true);
    expect(traceRes.body.data.id).toBe(runId);
    expect(traceRes.body.data.status).toBe('COMPLETED');
    expect(Array.isArray(traceRes.body.data.toolCalls)).toBe(true);
    expect(traceRes.body.data.toolCalls.length).toBeGreaterThan(0);
  });
});
