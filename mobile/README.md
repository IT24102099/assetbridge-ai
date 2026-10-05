# AssetBridge AI Mobile (Flutter)

Mobile client for **AssetBridge AI — Agentic Remote Asset Maintenance & Continuity Platform for Overseas Owners**, focused on **Member 1 (Asset & Incident Management)**.

---

## Member 1 Mobile Workflows

### 1. My Assets Screen (`lib/screens/my_assets_screen.dart`)
- **Grid / List Views:** Toggle between responsive 2-column grid cards and comprehensive list tiles.
- **Quick Status Indicators:** Real-time visual chips for `Active`, `Under Maintenance`, and `Decommissioned` assets.
- **Search & Filters:** Instant search by code, name, city, and status filter chips.
- **Action Shortcuts:** Direct "Report Defect" button linking the selected asset.

### 2. Report Incident Screen (`lib/screens/report_incident_screen.dart`)
- **Input Fields:** Incident title, multi-line problem description, asset selector dropdown.
- **Severity Selector:** `Low`, `Medium`, `High`, `Critical`.
- **Budget & Schedule:** Target resolution date picker and estimated budget in Sri Lankan Rupees (LKR).
- **Device Image Picker Mockup:** Camera capture and photo gallery attachment options with preset incident photos (burst pipe, generator overheating, sluice gate debris).
- **Backend Dispatch:** Submits to the shared ASP.NET Core `/api/incidents` endpoint and redirects to real-time tracking.

### 3. Incident Tracking Screen (`lib/screens/incident_tracking_screen.dart`)
- **Vertical Milestone Timeline:** 6-stage lifecycle progress matching the AssetBridge AI wireframes:
  1. **Reported:** Incident registered by the owner with location and media evidence.
  2. **In Analysis:** Incident Planning Agent triages damage scope and links past maintenance knowledge.
  3. **Progress:** Local representative assigned and vetted service provider dispatched on site.
  4. **Review:** Inspection assessment report and quotation submitted.
  5. **Approved:** Human-in-the-loop authorization confirmed for work execution.
  6. **Complete:** Defect repaired, photo evidence verified, and asset status restored.
- **Stage Progression Demo:** Interactive button allowing evaluators to advance lifecycle stages in the shared backend API.

---

## Shared Backend & Secure Storage

- **API Endpoint:** Communicates directly with the ASP.NET Core Web API:
  - Android Emulator: `http://10.0.2.2:5148/api`
  - iOS Simulator / Desktop: `http://localhost:5148/api`
- **Secure Token Storage:** Uses `flutter_secure_storage` with fallback in-memory caching to securely store JWT bearer tokens (`assetbridge_auth_token`).
- **Resilient Fallback:** Automatically falls back to realistic Sri Lankan municipal infrastructure sample data if the backend is temporarily offline during testing.

---

## How to Run

Ensure Flutter SDK (3.0.0+) is installed:

```bash
cd mobile

# Get dependencies
flutter pub get

# Run on connected device or simulator
flutter run
```
