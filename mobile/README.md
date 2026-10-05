# AssetBridge AI Mobile Application

Mobile client for AssetBridge AI - Field Representative & Service Provider Management (Member 2).

## Features Implemented
1. **Representative Login**: Auth & secure token/profile storage.
2. **Representative Dashboard**: Field summary stats, assigned assets, and quick navigation.
3. **Provider Search & Intelligence**: Deterministic matching & Provider Intelligence Agent recommendations (`POST /api/agents/provider-intelligence/recommend`).
4. **Provider Details**: Provider profile, skills, ratings, completed jobs, and availability slots.
5. **My Tasks**: List of field representative maintenance visits & inspection tasks.
6. **Update Visit / Photo Upload**: Update visit status, enter field notes, and attach photo evidence.

## Backend Connection
- Connected to Member 2 Express Backend (`http://localhost:5000/api` or `http://10.0.2.2:5000/api`).
