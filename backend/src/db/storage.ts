import fs from 'fs';
import path from 'path';
import { Representative } from '../modules/representatives/types.js';
import { ServiceProvider } from '../modules/providers/types.js';
import { ProviderAvailability } from '../modules/availability/types.js';

export interface DatabaseSchema {
  representatives: Representative[];
  providers: ServiceProvider[];
  availability: ProviderAvailability[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_DATA: DatabaseSchema = {
  representatives: [
    {
      id: 'rep-1',
      code: 'REP-1001',
      name: 'Alex Morgan',
      role: 'Senior Field Coordinator',
      email: 'alex.morgan@assetbridge.com',
      phone: '+1 (555) 234-5678',
      location: 'North Region',
      address: '104 Industrial Parkway, North City',
      nic: 'NIC-992817263',
      skills: ['Commercial Real Estate', 'Heavy Machinery', 'Valuation'],
      preferredAreas: ['North Region', 'Greater Metro Area'],
      assignedAssets: ['AST-8001', 'AST-8004'],
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      joinedDate: '2021-03-15',
      notes: 'Lead field representative for North district.',
    },
    {
      id: 'rep-2',
      code: 'REP-1002',
      name: 'Sarah Jenkins',
      role: 'Provider Relations Manager',
      email: 'sarah.jenkins@assetbridge.com',
      phone: '+1 (555) 345-6789',
      location: 'South Region',
      address: '750 Highrise Blvd, South City',
      nic: 'NIC-882736152',
      skills: ['Vendor Quality Assurance', 'Environmental Inspection'],
      preferredAreas: ['South Region'],
      assignedAssets: ['AST-8002'],
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      joinedDate: '2020-08-01',
      notes: 'Specializes in provider onboarding and compliance.',
    },
    {
      id: 'rep-3',
      code: 'REP-1003',
      name: 'David Chen',
      role: 'Regional Logistics Coordinator',
      email: 'david.chen@assetbridge.com',
      phone: '+1 (555) 456-7890',
      location: 'East Region',
      address: '42 Wall Street Center, East City',
      nic: 'NIC-773645241',
      skills: ['Supply Chain', 'Logistics', 'Legal Compliance'],
      preferredAreas: ['East Region', 'Eastern Seaboard'],
      assignedAssets: ['AST-8003', 'AST-8005'],
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      joinedDate: '2022-01-10',
      notes: 'Coordinates high-value asset transfers.',
    },
    {
      id: 'rep-4',
      code: 'REP-1004',
      name: 'Priya Sharma',
      role: 'Asset Compliance Officer',
      email: 'priya.sharma@assetbridge.com',
      phone: '+1 (555) 567-8901',
      location: 'West Region',
      address: '88 Logistics Way, West Coast',
      nic: 'NIC-664534130',
      skills: ['Insurance Risk Audit', 'Valuation'],
      preferredAreas: ['West Region'],
      assignedAssets: [],
      status: 'PENDING',
      verificationStatus: 'PENDING',
      joinedDate: '2021-11-20',
      notes: 'Pending final regional assignment.',
    },
    {
      id: 'rep-5',
      code: 'REP-1005',
      name: 'Marcus Vance',
      role: 'Technical Operations Lead',
      email: 'marcus.vance@assetbridge.com',
      phone: '+1 (555) 678-9012',
      location: 'Central Region',
      address: '304 Factory Road, Central Hub',
      nic: 'NIC-555423019',
      skills: ['Technical Maintenance', 'Structural Audit', 'HVAC'],
      preferredAreas: ['Central Region', 'Central Corridor'],
      assignedAssets: ['AST-8006', 'AST-8007'],
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      joinedDate: '2019-05-12',
      notes: 'Senior technical operations lead.',
    },
    {
      id: 'rep-6',
      code: 'REP-1006',
      name: 'Elena Rostova',
      role: 'Junior Field Representative',
      email: 'elena.rostova@assetbridge.com',
      phone: '+1 (555) 789-0123',
      location: 'North Region',
      address: '12 Quiet Lane, North Suburbs',
      nic: 'NIC-446312908',
      skills: ['Document Verification'],
      preferredAreas: ['North Region'],
      assignedAssets: [],
      status: 'INACTIVE',
      verificationStatus: 'UNVERIFIED',
      joinedDate: '2023-04-01',
      notes: 'On extended leave.',
    },
  ],
  providers: [
    {
      id: 'prov-1',
      code: 'SP-2001',
      companyName: 'Apex Maintenance Services Ltd.',
      contactPerson: 'Robert Sterling',
      email: 'contact@apexmaintenance.com',
      phone: '+1 (555) 888-1122',
      address: '104 Industrial Parkway, Suite 400',
      location: 'North Region',
      registrationNumber: 'REG-991823',
      skills: ['Maintenance', 'HVAC', 'Electrical Repair'],
      serviceAreas: ['North Region', 'Greater Metro Area'],
      rating: 4.8,
      reviewCount: 38,
      jobsCount: 142,
      verificationStatus: 'VERIFIED',
      insuranceStatus: 'VERIFIED',
      description: 'Apex Maintenance offers 24/7 emergency repair and routine preventative maintenance for industrial and commercial facilities.',
    },
    {
      id: 'prov-2',
      code: 'SP-2002',
      companyName: 'Vanguard Structural Inspections',
      contactPerson: 'Elena Vasquez',
      email: 'info@vanguardinspect.com',
      phone: '+1 (555) 888-2233',
      address: '750 Highrise Blvd, Floor 12',
      location: 'Central Region',
      registrationNumber: 'REG-882734',
      skills: ['Inspection', 'Structural Audit', 'Thermal Scanning'],
      serviceAreas: ['Central Region', 'Central State'],
      rating: 4.9,
      reviewCount: 45,
      jobsCount: 98,
      verificationStatus: 'VERIFIED',
      insuranceStatus: 'VERIFIED',
      description: 'Premier non-destructive structural asset inspection provider utilizing thermal drone photography and laser scans.',
    },
    {
      id: 'prov-3',
      code: 'SP-2003',
      companyName: 'Precision Asset Valuations',
      contactPerson: 'Jonathan Hayes',
      email: 'jhayes@precisionvaluations.com',
      phone: '+1 (555) 888-3344',
      address: '42 Wall Street Center',
      location: 'East Region',
      registrationNumber: 'REG-773645',
      skills: ['Valuation', 'Appraisal', 'Financial Analysis'],
      serviceAreas: ['East Region', 'Eastern Seaboard'],
      rating: 4.7,
      reviewCount: 52,
      jobsCount: 215,
      verificationStatus: 'VERIFIED',
      insuranceStatus: 'VERIFIED',
      description: 'Independent financial appraiser specializing in machinery, equipment inventory, and commercial real estate portfolio valuations.',
    },
    {
      id: 'prov-4',
      code: 'SP-2004',
      companyName: 'LexShield Legal Advisors',
      contactPerson: 'Amanda Ross',
      email: 'aross@lexshield.com',
      phone: '+1 (555) 888-4455',
      address: '120 Justice Plaza',
      location: 'South Region',
      registrationNumber: 'REG-664556',
      skills: ['Legal', 'Title Clearance', 'Lien Verification'],
      serviceAreas: ['South Region'],
      rating: 4.6,
      reviewCount: 19,
      jobsCount: 76,
      verificationStatus: 'VERIFIED',
      insuranceStatus: 'VERIFIED',
      description: 'Comprehensive legal support for asset ownership disputes, title clearance, lease structuring, and lien verifications.',
    },
    {
      id: 'prov-5',
      code: 'SP-2005',
      companyName: 'OmniFreight Asset Logistics',
      contactPerson: 'Gregory Vance',
      email: 'dispatch@omnifreight.com',
      phone: '+1 (555) 888-5566',
      address: '88 Logistics Way',
      location: 'West Region',
      registrationNumber: 'REG-555467',
      skills: ['Logistics', 'Heavy Transport', 'Fleet Transfer'],
      serviceAreas: ['West Region', 'Western Network'],
      rating: 4.5,
      reviewCount: 64,
      jobsCount: 310,
      verificationStatus: 'VERIFIED',
      insuranceStatus: 'VERIFIED',
      description: 'Secure transit, heavy machinery relocation, climate-controlled warehousing, and fleet transfer services.',
    },
    {
      id: 'prov-6',
      code: 'SP-2006',
      companyName: 'Sentinel Asset Risk & Insurance',
      contactPerson: 'Karen Miller',
      email: 'kmiller@sentinelrisk.com',
      phone: '+1 (555) 888-6677',
      address: '500 Assurance Tower',
      location: 'North Region',
      registrationNumber: 'REG-446378',
      skills: ['Insurance', 'Risk Audit', 'Loss Underwriting'],
      serviceAreas: ['North Region'],
      rating: 4.85,
      reviewCount: 31,
      jobsCount: 164,
      verificationStatus: 'VERIFIED',
      insuranceStatus: 'VERIFIED',
      description: 'Specialized risk underwriting, damage loss adjustments, and comprehensive insurance coverage audits for enterprise physical assets.',
    },
    {
      id: 'prov-7',
      code: 'SP-2007',
      companyName: 'GreenTech Environmental Audits',
      contactPerson: 'Dr. Aris Thorne',
      email: 'athorne@greentechaudits.com',
      phone: '+1 (555) 888-7788',
      address: '22 Eco Park Avenue',
      location: 'South Region',
      registrationNumber: 'REG-337289',
      skills: ['Inspection', 'Environmental Audit', 'Hazard Analysis'],
      serviceAreas: ['South Region'],
      rating: 4.4,
      reviewCount: 8,
      jobsCount: 24,
      verificationStatus: 'PENDING',
      insuranceStatus: 'PENDING',
      description: 'Environmental hazard analysis, soil testing, and sustainability rating assessments for commercial properties.',
    },
    {
      id: 'prov-8',
      code: 'SP-2008',
      companyName: 'Titan Heavy Machinery Services',
      contactPerson: 'Carlsson Holm',
      email: 'service@titanmachinery.com',
      phone: '+1 (555) 888-9900',
      address: '304 Factory Road',
      location: 'Central Region',
      registrationNumber: 'REG-228190',
      skills: ['Maintenance', 'Heavy Machinery', 'Hydraulics'],
      serviceAreas: ['Central Region'],
      rating: 4.92,
      reviewCount: 42,
      jobsCount: 189,
      verificationStatus: 'VERIFIED',
      insuranceStatus: 'VERIFIED',
      description: 'On-site heavy equipment overhauls, engine rebuilding, and fleet maintenance contracts.',
    },
  ],
  availability: [
    {
      id: 'avail-1',
      providerId: 'prov-1',
      date: '2026-10-06',
      status: 'AVAILABLE',
      startTime: '09:00',
      endTime: '12:00',
      notes: 'Morning routine maintenance window.',
    },
    {
      id: 'avail-2',
      providerId: 'prov-1',
      date: '2026-10-06',
      status: 'BUSY',
      startTime: '13:00',
      endTime: '17:00',
      notes: 'HVAC Inspection & Repair at Warehouse 4',
    },
    {
      id: 'avail-3',
      providerId: 'prov-1',
      date: '2026-10-07',
      status: 'AVAILABLE',
      startTime: '08:30',
      endTime: '11:30',
      notes: 'Field technician available.',
    },
    {
      id: 'avail-4',
      providerId: 'prov-2',
      date: '2026-10-06',
      status: 'BUSY',
      startTime: '10:00',
      endTime: '14:00',
      notes: 'Structural Drone Laser Audit for Office Tower',
    },
    {
      id: 'avail-5',
      providerId: 'prov-2',
      date: '2026-10-08',
      status: 'AVAILABLE',
      startTime: '09:00',
      endTime: '13:00',
      notes: 'Open for thermal scanning assignment.',
    },
    {
      id: 'avail-6',
      providerId: 'prov-3',
      date: '2026-10-07',
      status: 'AVAILABLE',
      startTime: '09:00',
      endTime: '12:00',
      notes: 'Appraiser available for machinery inventory.',
    },
    {
      id: 'avail-7',
      providerId: 'prov-3',
      date: '2026-10-07',
      status: 'UNAVAILABLE',
      startTime: '13:30',
      endTime: '16:30',
      notes: 'Internal court appearance prep.',
    },
    {
      id: 'avail-8',
      providerId: 'prov-4',
      date: '2026-10-09',
      status: 'AVAILABLE',
      startTime: '10:00',
      endTime: '12:00',
      notes: 'Legal consult slot.',
    },
    {
      id: 'avail-9',
      providerId: 'prov-5',
      date: '2026-10-06',
      status: 'BUSY',
      startTime: '08:00',
      endTime: '16:00',
      notes: 'Heavy Machinery Transport',
    },
    {
      id: 'avail-10',
      providerId: 'prov-8',
      date: '2026-10-07',
      status: 'AVAILABLE',
      startTime: '08:00',
      endTime: '12:00',
      notes: 'Hydraulic team free for dispatch.',
    },
  ],
};

class StorageEngine {
  private inMemoryData: DatabaseSchema | null = null;

  private ensureFile(): DatabaseSchema {
    if (this.inMemoryData) {
      return this.inMemoryData;
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      this.save(INITIAL_DATA);
      this.inMemoryData = { ...INITIAL_DATA };
      return this.inMemoryData;
    }

    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      this.inMemoryData = JSON.parse(content) as DatabaseSchema;
      return this.inMemoryData;
    } catch (err) {
      console.warn('Could not parse db.json, re-initializing with seed data.', err);
      this.save(INITIAL_DATA);
      this.inMemoryData = { ...INITIAL_DATA };
      return this.inMemoryData;
    }
  }

  private save(data: DatabaseSchema): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    this.inMemoryData = data;
  }

  public read(): DatabaseSchema {
    return this.ensureFile();
  }

  public write(updater: (data: DatabaseSchema) => void): DatabaseSchema {
    const current = this.ensureFile();
    updater(current);
    this.save(current);
    return current;
  }

  public resetToSeed(): void {
    this.save(INITIAL_DATA);
  }
}

export const db = new StorageEngine();
