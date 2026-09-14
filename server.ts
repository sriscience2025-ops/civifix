import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'issue-' + uniqueSuffix + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

// Serve uploads statically
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// IN-MEMORY DATABASE & SEED DATA
// ==========================================

interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  headOfficerName: string;
}

interface Category {
  id: number;
  departmentId: number;
  name: string;
  description: string;
  defaultPriority: string;
  defaultResolutionDays: number;
  iconName: string;
}

interface User {
  id: number;
  role: string;
  departmentId: number | null;
  departmentName?: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  area?: string;
  username?: string;
}

interface IssueLocation {
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  city: string;
  landmark?: string;
}

interface StatusHistoryItem {
  previousStatus: string | null;
  newStatus: string;
  changedBy: string;
  changeReason: string;
  timestamp: string;
}

interface Issue {
  id: number;
  ticketNumber: string;
  citizenId: number;
  citizenName: string;
  citizenPhone: string;
  categoryId: number;
  categoryName: string;
  departmentId: number;
  departmentName: string;
  title: string;
  description: string;
  subcategory: string;
  status: string;
  priority: string;
  severity: string;
  assignedOfficerId: number | null;
  assignedOfficerName: string | null;
  assignedWorkerId: number | null;
  assignedWorkerName: string | null;
  targetDeadline: string;
  deadlineStatus: 'ON_TIME' | 'OVERDUE';
  createdAt: string;
  updatedAt: string;
  location: IssueLocation;
  imageUrls: string[];
  beforeProofUrl?: string;
  afterProofUrl?: string;
  resolutionNotes?: string;
  verificationRating?: number;
  verificationComment?: string;
  followersCount: number;
  followers: number[]; // user IDs
  statusHistory: StatusHistoryItem[];
}

interface Complaint {
  id: number;
  citizenId: number;
  citizenName: string;
  issueId: number | null;
  issueTicketNumber: string | null;
  subject: string;
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  resolutionNotes: string | null;
  createdAt: string;
}

interface NotificationItem {
  id: number;
  userId: number;
  issueId: number;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}

// Initial Departments
const departments: Department[] = [
  { id: 1, name: 'Roads / Public Works Department', code: 'PWD_ROADS', description: 'Maintenance of city asphalt, potholes, footpaths, bridges', contactEmail: 'roads@civicfix.gov', contactPhone: '+1-555-0191', headOfficerName: 'Commissioner Robert Chen' },
  { id: 2, name: 'Electrical / Street Lighting Department', code: 'ELEC_LIGHT', description: 'Street lights, electrical transformers, open wires, grid power', contactEmail: 'electric@civicfix.gov', contactPhone: '+1-555-0192', headOfficerName: 'Eng. Sarah Jenkins' },
  { id: 3, name: 'Sanitation & Solid Waste Department', code: 'SANITATION', description: 'Garbage clearing, public dustbins, landfill transport', contactEmail: 'sanitation@civicfix.gov', contactPhone: '+1-555-0193', headOfficerName: 'Inspector David Kumar' },
  { id: 4, name: 'Water Supply Department', code: 'WATER_BOARD', description: 'Potable water pipelines, major main bursts, water pressure', contactEmail: 'water@civicfix.gov', contactPhone: '+1-555-0194', headOfficerName: 'Dir. Elena Rostova' },
  { id: 5, name: 'Drainage & Stormwater Department', code: 'DRAINAGE', description: 'Sewers, clogged storm drains, monsoon flood mitigation', contactEmail: 'drainage@civicfix.gov', contactPhone: '+1-555-0195', headOfficerName: 'Chief Marcus Vance' },
  { id: 6, name: 'Parks & Environment Department', code: 'PARKS_ENV', description: 'Fallen trees, dangerous branches, public park upkeep', contactEmail: 'parks@civicfix.gov', contactPhone: '+1-555-0196', headOfficerName: 'Horticulturist Anita Roy' },
  { id: 7, name: 'Traffic & Transport Department', code: 'TRAFFIC_DIV', description: 'Traffic signal repairs, road markings, regulatory signage', contactEmail: 'traffic@civicfix.gov', contactPhone: '+1-555-0197', headOfficerName: 'Officer James Miller' }
];

// Initial Categories
const categories: Category[] = [
  { id: 1, departmentId: 1, name: 'Road & Transport', description: 'Potholes, cracked asphalt, missing manhole covers, cave-ins', defaultPriority: 'HIGH', defaultResolutionDays: 3, iconName: 'road' },
  { id: 2, departmentId: 2, name: 'Street Lighting', description: 'Non-functional street lamps, flicker, dark corridors, broken poles', defaultPriority: 'MEDIUM', defaultResolutionDays: 2, iconName: 'lightbulb' },
  { id: 3, departmentId: 3, name: 'Garbage & Sanitation', description: 'Overflowing community bins, illegal dump heaps, dead animal removal', defaultPriority: 'MEDIUM', defaultResolutionDays: 1, iconName: 'trash-2' },
  { id: 4, departmentId: 4, name: 'Water Supply', description: 'Broken water mains, low pressure, water contamination, leakages', defaultPriority: 'HIGH', defaultResolutionDays: 2, iconName: 'droplets' },
  { id: 5, departmentId: 5, name: 'Drainage', description: 'Overflowing gutter, clogged stormwater drains, sewer backup', defaultPriority: 'HIGH', defaultResolutionDays: 3, iconName: 'waves' },
  { id: 6, departmentId: 1, name: 'Public Infrastructure', description: 'Damaged pedestrian railings, broken bus shelters, sidewalk tiles', defaultPriority: 'MEDIUM', defaultResolutionDays: 7, iconName: 'building' },
  { id: 7, departmentId: 6, name: 'Trees & Environment', description: 'Fallen tree blocking roads, overgrown branches, dead hazard trees', defaultPriority: 'MEDIUM', defaultResolutionDays: 2, iconName: 'trees' },
  { id: 8, departmentId: 7, name: 'Traffic Signals', description: 'Stuck traffic lights, damaged pedestrian countdown, knocked sign', defaultPriority: 'CRITICAL', defaultResolutionDays: 1, iconName: 'traffic-cone' },
  { id: 9, departmentId: 1, name: 'Other', description: 'Civic issues requiring municipal triage and review', defaultPriority: 'LOW', defaultResolutionDays: 5, iconName: 'help-circle' }
];

// Initial Users
const users: User[] = [
  { id: 1, role: 'ROLE_ADMIN', departmentId: null, fullName: 'Chief Administrator Arthur Vance', email: 'admin@civicfix.com', username: 'admin', phone: '+1-555-1000', city: 'Metro City', area: 'Downtown' },
  { id: 2, role: 'ROLE_DEPARTMENT_OFFICER', departmentId: 1, departmentName: 'Roads / Public Works Department', fullName: 'Officer Michael Hastings (Roads)', email: 'officer.roads@civicfix.com', username: 'officer.roads', phone: '+1-555-1001', city: 'Metro City', area: 'North Ward' },
  { id: 3, role: 'ROLE_DEPARTMENT_OFFICER', departmentId: 2, departmentName: 'Electrical / Street Lighting Department', fullName: 'Officer Elena Torres (Electrical)', email: 'officer.electric@civicfix.com', username: 'officer.electric', phone: '+1-555-1002', city: 'Metro City', area: 'Central Ward' },
  { id: 4, role: 'ROLE_DEPARTMENT_OFFICER', departmentId: 4, departmentName: 'Water Supply Department', fullName: 'Officer Alan Turing (Water)', email: 'officer.water@civicfix.com', username: 'officer.water', phone: '+1-555-1003', city: 'Metro City', area: 'South Ward' },
  { id: 5, role: 'ROLE_FIELD_WORKER', departmentId: 1, departmentName: 'Roads / Public Works Department', fullName: 'Worker Rajesh Patel (Roads Crew)', email: 'worker.roads@civicfix.com', username: 'worker.rajesh', phone: '+1-555-2001', city: 'Metro City', area: 'North Ward' },
  { id: 6, role: 'ROLE_FIELD_WORKER', departmentId: 2, departmentName: 'Electrical / Street Lighting Department', fullName: 'Worker Thomas Bradley (Electrical)', email: 'worker.thomas@civicfix.com', username: 'worker.thomas', phone: '+1-555-2002', city: 'Metro City', area: 'Central Ward' },
  { id: 7, role: 'ROLE_FIELD_WORKER', departmentId: 4, departmentName: 'Water Supply Department', fullName: 'Worker Carlos Mendez (Water Works)', email: 'worker.carlos@civicfix.com', username: 'worker.carlos', phone: '+1-555-2003', city: 'Metro City', area: 'South Ward' },
  { id: 8, role: 'ROLE_CITIZEN', departmentId: null, fullName: 'Citizen Priya Sharma', email: 'citizen@civicfix.com', username: 'priya', phone: '+1-555-3001', city: 'Metro City', area: 'Central Ward' },
  { id: 9, role: 'ROLE_CITIZEN', departmentId: null, fullName: 'Citizen Arun Patel', email: 'arun@gmail.com', username: 'arun', phone: '+1-555-3002', city: 'Metro City', area: 'North Ward' }
];

// Seed Issues
let issues: Issue[] = [
  {
    id: 1,
    ticketNumber: 'CF-2026-1001',
    citizenId: 8,
    citizenName: 'Priya Sharma',
    citizenPhone: '+1-555-3001',
    categoryId: 1,
    categoryName: 'Road & Transport',
    departmentId: 1,
    departmentName: 'Roads / Public Works Department',
    title: 'Dangerous Deep Pothole on Main Intersection',
    description: 'Large pothole measuring approx 3 feet wide and 6 inches deep causing vehicle damage and traffic swerving.',
    subcategory: 'Potholes',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    severity: 'HIGH',
    assignedOfficerId: 2,
    assignedOfficerName: 'Officer Michael Hastings (Roads)',
    assignedWorkerId: 5,
    assignedWorkerName: 'Worker Rajesh Patel (Roads Crew)',
    targetDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineStatus: 'ON_TIME',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    location: {
      latitude: 37.774929,
      longitude: -122.419416,
      address: 'Corner of 5th Ave & Market St',
      area: 'Central Ward',
      city: 'Metro City',
      landmark: 'Near Central Metro Station'
    },
    imageUrls: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'],
    beforeProofUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    followersCount: 14,
    followers: [8, 9],
    statusHistory: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedBy: 'Priya Sharma', changeReason: 'Citizen initial submission', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'SUBMITTED', newStatus: 'UNDER_REVIEW', changedBy: 'Officer Michael Hastings', changeReason: 'Verified priority HIGH', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'UNDER_REVIEW', newStatus: 'ASSIGNED', changedBy: 'Officer Michael Hastings', changeReason: 'Assigned to field worker Rajesh Patel with 48h deadline', timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'ASSIGNED', newStatus: 'IN_PROGRESS', changedBy: 'Worker Rajesh Patel', changeReason: 'Reached site and initiated cold-mix asphalt prep', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 2,
    ticketNumber: 'CF-2026-1002',
    citizenId: 8,
    citizenName: 'Priya Sharma',
    citizenPhone: '+1-555-3001',
    categoryId: 2,
    categoryName: 'Street Lighting',
    departmentId: 2,
    departmentName: 'Electrical / Street Lighting Department',
    title: 'Flickering and Blacked Out Street Lights for 3 Blocks',
    description: 'Entire residential stretch on Pine Blvd is completely pitch dark at night creating serious safety hazards for pedestrians.',
    subcategory: 'Non-functional lamps',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    severity: 'MEDIUM',
    assignedOfficerId: 3,
    assignedOfficerName: 'Officer Elena Torres (Electrical)',
    assignedWorkerId: 6,
    assignedWorkerName: 'Worker Thomas Bradley (Electrical)',
    targetDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineStatus: 'ON_TIME',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    location: {
      latitude: 37.783333,
      longitude: -122.416667,
      address: '842 Pine Boulevard',
      area: 'North Ward',
      city: 'Metro City',
      landmark: 'Opposite Community Library'
    },
    imageUrls: ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'],
    followersCount: 8,
    followers: [8],
    statusHistory: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedBy: 'Priya Sharma', changeReason: 'Citizen initial report', timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'SUBMITTED', newStatus: 'ASSIGNED', changedBy: 'Officer Elena Torres', changeReason: 'Dispatched electric field crew', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 3,
    ticketNumber: 'CF-2026-1003',
    citizenId: 9,
    citizenName: 'Arun Patel',
    citizenPhone: '+1-555-3002',
    categoryId: 4,
    categoryName: 'Water Supply',
    departmentId: 4,
    departmentName: 'Water Supply Department',
    title: 'High Pressure Water Pipe Burst Flooding Road',
    description: 'Potable water pipeline ruptured underground, water is gushing out rapidly and beginning to enter residential driveways.',
    subcategory: 'Pipeline rupture',
    status: 'VERIFICATION_PENDING',
    priority: 'CRITICAL',
    severity: 'CRITICAL',
    assignedOfficerId: 4,
    assignedOfficerName: 'Officer Alan Turing (Water)',
    assignedWorkerId: 7,
    assignedWorkerName: 'Worker Carlos Mendez (Water Works)',
    targetDeadline: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    deadlineStatus: 'OVERDUE',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: {
      latitude: 37.765000,
      longitude: -122.430000,
      address: '312 Willow Creek Rd',
      area: 'South Ward',
      city: 'Metro City',
      landmark: 'Behind Primary School #4'
    },
    imageUrls: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'],
    beforeProofUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    afterProofUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    resolutionNotes: 'High pressure valve replaced and road resurfaced with cold mix seal. Water pressure restored to nominal 45 PSI.',
    followersCount: 29,
    followers: [8, 9],
    statusHistory: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedBy: 'Arun Patel', changeReason: 'Citizen emergency submission', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'SUBMITTED', newStatus: 'ASSIGNED', changedBy: 'Officer Alan Turing', changeReason: 'Critical pipeline burst assigned immediately', timestamp: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'ASSIGNED', newStatus: 'IN_PROGRESS', changedBy: 'Worker Carlos Mendez', changeReason: 'Excavation and pipe weld started', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'IN_PROGRESS', newStatus: 'RESOLVED', changedBy: 'Worker Carlos Mendez', changeReason: 'High pressure valve replaced and road resurfaced', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'RESOLVED', newStatus: 'VERIFICATION_PENDING', changedBy: 'Worker Carlos Mendez', changeReason: 'Awaiting citizen verification confirmation', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 4,
    ticketNumber: 'CF-2026-1004',
    citizenId: 8,
    citizenName: 'Priya Sharma',
    citizenPhone: '+1-555-3001',
    categoryId: 3,
    categoryName: 'Garbage & Sanitation',
    departmentId: 3,
    departmentName: 'Sanitation & Solid Waste Department',
    title: 'Overflowing Garbage Dump Near Public Park',
    description: 'Community bins have not been emptied in 5 days, stray animals scattering waste onto pedestrian walkway.',
    subcategory: 'Dump clearing',
    status: 'SUBMITTED',
    priority: 'MEDIUM',
    severity: 'MEDIUM',
    assignedOfficerId: null,
    assignedOfficerName: null,
    assignedWorkerId: null,
    assignedWorkerName: null,
    targetDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineStatus: 'ON_TIME',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    location: {
      latitude: 37.750000,
      longitude: -122.420000,
      address: '19 Industrial Expressway',
      area: 'East Ward',
      city: 'Metro City',
      landmark: 'Next to Warehouse #9'
    },
    imageUrls: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'],
    followersCount: 5,
    followers: [8],
    statusHistory: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedBy: 'Priya Sharma', changeReason: 'Citizen report', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

// Seed Complaints (Grievances)
let complaints: Complaint[] = [
  {
    id: 1,
    citizenId: 8,
    citizenName: 'Priya Sharma',
    issueId: 1,
    issueTicketNumber: 'CF-2026-1001',
    subject: 'Recurring pothole delay in Central Ward',
    description: 'The pothole repair was scheduled 3 days ago, but heavy peak traffic is still worsening it and no barricades are up.',
    status: 'PENDING',
    resolutionNotes: null,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    citizenId: 9,
    citizenName: 'Arun Patel',
    issueId: 3,
    issueTicketNumber: 'CF-2026-1003',
    subject: 'Water pipe leakage emergency escalation',
    description: 'Water flow reached residential foundation level before repair crew arrived. Requesting civic integrity inspection.',
    status: 'INVESTIGATING',
    resolutionNotes: 'Senior civil engineer assigned to inspect surrounding foundations and audit response time.',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
  }
];

// Seed Notifications
let notifications: NotificationItem[] = [
  { id: 1, userId: 8, issueId: 1, title: 'Worker Dispatched to Your Issue', message: 'Worker Rajesh Patel has been assigned to fix Pothole #CF-2026-1001.', notificationType: 'ISSUE_ASSIGNED', isRead: false, createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() },
  { id: 2, userId: 9, issueId: 3, title: 'Work Complete - Please Verify', message: 'Repair work is complete on #CF-2026-1003. Please confirm if the water issue is resolved.', notificationType: 'VERIFICATION_PENDING', isRead: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 3, userId: 2, issueId: 1, title: 'High Priority Issue Logged', message: 'A HIGH priority road damage issue was reported on 5th Ave.', notificationType: 'HIGH_PRIORITY_ISSUE', isRead: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 4, userId: 1, issueId: 3, title: 'Critical Water Burst SLA Notice', message: 'CRITICAL issue #CF-2026-1003 exceeded initial SLA response window.', notificationType: 'CRITICAL_ALERT', isRead: false, createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
];

// Helper: Extract current user from Bearer token
function getAuthUser(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  // Token format: "civicfix-user-{id}-{timestamp}" or standard string
  const match = token.match(/^civicfix-user-(\d+)/);
  if (match) {
    const userId = parseInt(match[1]);
    return users.find(u => u.id === userId) || null;
  }
  // Default fallback user if token is present
  return users[7]; // Priya Sharma (Citizen)
}

// Distance helper (Haversine formula in meters)
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. Auth Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Normalize email lookup: match exact or match prefix (e.g. citizen@civicfix.com or citizen@civicfix.gov)
  const normEmail = email.toLowerCase().trim();
  let user = users.find(u => u.email.toLowerCase() === normEmail);

  if (!user) {
    // Check aliases
    if (normEmail.startsWith('citizen@') || normEmail.startsWith('priya@')) user = users.find(u => u.id === 8);
    else if (normEmail.startsWith('officer.roads@') || normEmail.startsWith('officer@')) user = users.find(u => u.id === 2);
    else if (normEmail.startsWith('officer.electric@')) user = users.find(u => u.id === 3);
    else if (normEmail.startsWith('officer.water@')) user = users.find(u => u.id === 4);
    else if (normEmail.startsWith('worker.roads@') || normEmail.startsWith('worker.rajesh@') || normEmail.startsWith('worker@')) user = users.find(u => u.id === 5);
    else if (normEmail.startsWith('worker.thomas@')) user = users.find(u => u.id === 6);
    else if (normEmail.startsWith('worker.carlos@')) user = users.find(u => u.id === 7);
    else if (normEmail.startsWith('admin@')) user = users.find(u => u.id === 1);
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User account not found.' });
  }

  const token = `civicfix-user-${user.id}-${Date.now()}`;
  return res.json({
    success: true,
    data: {
      token,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      departmentId: user.departmentId,
      departmentName: user.departmentName,
      phone: user.phone
    },
    message: 'Authentication successful'
  });
});

// 3. Auth Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { fullName, email, password, phone, address, city, area } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ success: false, message: 'Full name and email are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: users.length + 1,
    role: 'ROLE_CITIZEN',
    departmentId: null,
    fullName,
    email,
    username: email.split('@')[0],
    phone: phone || '+1-555-0000',
    address: address || '',
    city: city || 'Metro City',
    area: area || 'Downtown'
  };
  users.push(newUser);

  const token = `civicfix-user-${newUser.id}-${Date.now()}`;
  return res.json({
    success: true,
    data: {
      token,
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      phone: newUser.phone
    },
    message: 'Account registered successfully'
  });
});

// 4. Departments
app.get('/api/departments', (_req: Request, res: Response) => {
  res.json({ success: true, data: departments });
});

// 5. Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({ success: true, data: categories });
});

// 6. Issues List (Public & Filterable)
app.get('/api/issues', (req: Request, res: Response) => {
  const { departmentId, status, priority, area, search } = req.query;
  let result = [...issues];

  if (departmentId) {
    const deptId = parseInt(departmentId as string);
    result = result.filter(i => i.departmentId === deptId);
  }
  if (status && status !== 'ALL') {
    result = result.filter(i => i.status === status);
  }
  if (priority && priority !== 'ALL') {
    result = result.filter(i => i.priority === priority);
  }
  if (area && area !== 'ALL') {
    result = result.filter(i => i.location.area.toLowerCase().includes((area as string).toLowerCase()));
  }
  if (search) {
    const s = (search as string).toLowerCase();
    result = result.filter(i =>
      i.title.toLowerCase().includes(s) ||
      i.ticketNumber.toLowerCase().includes(s) ||
      i.description.toLowerCase().includes(s) ||
      i.location.address.toLowerCase().includes(s)
    );
  }

  // Recalculate deadlineStatus dynamically
  const now = new Date();
  result.forEach(issue => {
    if (issue.status !== 'CLOSED' && issue.status !== 'RESOLVED' && new Date(issue.targetDeadline) < now) {
      issue.deadlineStatus = 'OVERDUE';
    } else {
      issue.deadlineStatus = 'ON_TIME';
    }
  });

  res.json({ success: true, data: result });
});

// 7. Track Issue by Ticket Number
app.get('/api/issues/track/:ticketNumber', (req: Request, res: Response) => {
  const { ticketNumber } = req.params;
  const issue = issues.find(i => i.ticketNumber.toUpperCase() === ticketNumber.toUpperCase());
  if (!issue) {
    return res.status(404).json({ success: false, message: `Ticket #${ticketNumber} not found` });
  }
  res.json({ success: true, data: issue });
});

// 8. Single Issue by ID
app.get('/api/issues/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const issue = issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }
  res.json({ success: true, data: issue });
});

// 9. Create Issue
app.post('/api/issues', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[7]; // default to Citizen Priya if guest
  const {
    title,
    description,
    categoryId,
    departmentId,
    subcategory,
    priority,
    severity,
    latitude,
    longitude,
    address,
    area,
    city,
    landmark,
    imageUrls
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required' });
  }

  const category = categories.find(c => c.id === parseInt(categoryId)) || categories[0];
  const department = departments.find(d => d.id === (departmentId ? parseInt(departmentId) : category.departmentId)) || departments[0];

  const issueId = issues.length > 0 ? Math.max(...issues.map(i => i.id)) + 1 : 1;
  const ticketNumber = `CF-2026-${1000 + issueId}`;

  const daysToResolve = category.defaultResolutionDays || 3;
  const targetDeadline = new Date(Date.now() + daysToResolve * 24 * 60 * 60 * 1000).toISOString();

  const newIssue: Issue = {
    id: issueId,
    ticketNumber,
    citizenId: authUser.id,
    citizenName: authUser.fullName,
    citizenPhone: authUser.phone,
    categoryId: category.id,
    categoryName: category.name,
    departmentId: department.id,
    departmentName: department.name,
    title,
    description,
    subcategory: subcategory || 'General civic report',
    status: 'SUBMITTED',
    priority: priority || category.defaultPriority || 'MEDIUM',
    severity: severity || 'MEDIUM',
    assignedOfficerId: null,
    assignedOfficerName: null,
    assignedWorkerId: null,
    assignedWorkerName: null,
    targetDeadline,
    deadlineStatus: 'ON_TIME',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: {
      latitude: parseFloat(latitude) || 37.7749,
      longitude: parseFloat(longitude) || -122.4194,
      address: address || 'Reported Location',
      area: area || 'Central Ward',
      city: city || 'Metro City',
      landmark: landmark || ''
    },
    imageUrls: Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'],
    beforeProofUrl: Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : undefined,
    followersCount: 1,
    followers: [authUser.id],
    statusHistory: [
      {
        previousStatus: null,
        newStatus: 'SUBMITTED',
        changedBy: authUser.fullName,
        changeReason: 'Citizen initial issue submission',
        timestamp: new Date().toISOString()
      }
    ]
  };

  issues.unshift(newIssue);

  // Add notification for department officers
  const officer = users.find(u => u.role === 'ROLE_DEPARTMENT_OFFICER' && u.departmentId === department.id);
  if (officer) {
    notifications.unshift({
      id: notifications.length + 1,
      userId: officer.id,
      issueId: newIssue.id,
      title: `New ${newIssue.priority} Issue: ${newIssue.title.substring(0, 30)}`,
      message: `Ticket #${newIssue.ticketNumber} reported in ${newIssue.location.area}.`,
      notificationType: 'NEW_ISSUE',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    data: newIssue,
    message: `Issue logged successfully. Ticket reference: ${ticketNumber}`
  });
});

// 10. AI Smart Analysis (Gemini API with robust fallback)
app.post('/api/smart-analysis/categorize', async (req: Request, res: Response) => {
  const { text } = req.body;
  const cleanText = (text || '').toLowerCase();

  // Smart fallback dictionary
  let detectedCategory = categories[0];
  let detectedDepartment = departments[0];
  let priority = 'MEDIUM';
  let severity = 'MEDIUM';
  let subcategory = 'General civic report';
  let reasoning = 'Categorized based on municipal civic keywords';

  if (cleanText.includes('pothole') || cleanText.includes('asphalt') || cleanText.includes('road') || cleanText.includes('crater')) {
    detectedCategory = categories.find(c => c.id === 1)!;
    detectedDepartment = departments.find(d => d.id === 1)!;
    priority = 'HIGH';
    severity = 'HIGH';
    subcategory = 'Potholes / Road Repair';
    reasoning = 'Detected road surface damage and asphalt degradation hazard.';
  } else if (cleanText.includes('light') || cleanText.includes('dark') || cleanText.includes('lamp') || cleanText.includes('electric') || cleanText.includes('wire')) {
    detectedCategory = categories.find(c => c.id === 2)!;
    detectedDepartment = departments.find(d => d.id === 2)!;
    priority = 'MEDIUM';
    severity = 'MEDIUM';
    subcategory = 'Street Lighting Maintenance';
    reasoning = 'Detected street illumination and electrical safety hazard.';
  } else if (cleanText.includes('garbage') || cleanText.includes('trash') || cleanText.includes('dump') || cleanText.includes('waste') || cleanText.includes('bin')) {
    detectedCategory = categories.find(c => c.id === 3)!;
    detectedDepartment = departments.find(d => d.id === 3)!;
    priority = 'MEDIUM';
    severity = 'MEDIUM';
    subcategory = 'Solid Waste Clearing';
    reasoning = 'Identified public sanitation and overflow refuse risk.';
  } else if (cleanText.includes('water') || cleanText.includes('pipe') || cleanText.includes('burst') || cleanText.includes('leak') || cleanText.includes('pressure')) {
    detectedCategory = categories.find(c => c.id === 4)!;
    detectedDepartment = departments.find(d => d.id === 4)!;
    priority = cleanText.includes('burst') || cleanText.includes('flood') ? 'CRITICAL' : 'HIGH';
    severity = priority;
    subcategory = 'Water Main Rupture / Leak';
    reasoning = 'High risk of water wastage, flooding, and property damage.';
  } else if (cleanText.includes('drain') || cleanText.includes('sewer') || cleanText.includes('gutter') || cleanText.includes('clog')) {
    detectedCategory = categories.find(c => c.id === 5)!;
    detectedDepartment = departments.find(d => d.id === 5)!;
    priority = 'HIGH';
    severity = 'HIGH';
    subcategory = 'Stormwater Drainage';
    reasoning = 'Potential monsoon backup and sewage contamination detected.';
  } else if (cleanText.includes('tree') || cleanText.includes('branch') || cleanText.includes('fallen') || cleanText.includes('park')) {
    detectedCategory = categories.find(c => c.id === 7)!;
    detectedDepartment = departments.find(d => d.id === 6)!;
    priority = 'MEDIUM';
    severity = 'MEDIUM';
    subcategory = 'Hazardous Trees & Branches';
    reasoning = 'Vegetation obstruction or falling branch hazard.';
  } else if (cleanText.includes('traffic') || cleanText.includes('signal') || cleanText.includes('light stuck') || cleanText.includes('intersection')) {
    detectedCategory = categories.find(c => c.id === 8)!;
    detectedDepartment = departments.find(d => d.id === 7)!;
    priority = 'CRITICAL';
    severity = 'CRITICAL';
    subcategory = 'Traffic Signal Malfunction';
    reasoning = 'Immediate collision hazard at public intersection.';
  }

  // Attempt server-side Gemini enhancement if API key is configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Analyze this civic complaint for city administration: "${text}".
Return strict JSON with fields:
- categoryId (number 1 to 9)
- departmentId (number 1 to 7)
- priority ("LOW" | "MEDIUM" | "HIGH" | "CRITICAL")
- severity ("LOW" | "MEDIUM" | "HIGH" | "CRITICAL")
- subcategory (string)
- reasoning (short 1-sentence explanation)`;

      const geminiRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      if (geminiRes.text) {
        const parsed = JSON.parse(geminiRes.text);
        if (parsed.categoryId) {
          const cat = categories.find(c => c.id === parsed.categoryId);
          if (cat) detectedCategory = cat;
        }
        if (parsed.departmentId) {
          const dept = departments.find(d => d.id === parsed.departmentId);
          if (dept) detectedDepartment = dept;
        }
        if (parsed.priority) priority = parsed.priority;
        if (parsed.severity) severity = parsed.severity;
        if (parsed.subcategory) subcategory = parsed.subcategory;
        if (parsed.reasoning) reasoning = parsed.reasoning;
      }
    } catch (aiErr) {
      console.warn('Gemini API call skipped or failed, using local model:', (aiErr as Error).message);
    }
  }

  res.json({
    success: true,
    data: {
      categoryId: detectedCategory.id,
      categoryName: detectedCategory.name,
      departmentId: detectedDepartment.id,
      departmentName: detectedDepartment.name,
      priority,
      severity,
      subcategory,
      confidenceScore: 0.94,
      reasoning
    }
  });
});

// 11. Duplicate Detection Check
app.post('/api/duplicate-check', (req: Request, res: Response) => {
  const { title, description, categoryId, latitude, longitude } = req.body;
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const catId = categoryId ? parseInt(categoryId) : null;
  const text = `${title || ''} ${description || ''}`.toLowerCase();

  const duplicates = issues.filter(issue => {
    // Only check active issues
    if (issue.status === 'CLOSED') return false;

    // Check distance (within 200m)
    let isClose = false;
    if (!isNaN(lat) && !isNaN(lon) && issue.location.latitude && issue.location.longitude) {
      const dist = getDistanceMeters(lat, lon, issue.location.latitude, issue.location.longitude);
      if (dist <= 250) isClose = true;
    }

    // Check category match or text keyword similarity
    const sameCat = catId ? issue.categoryId === catId : false;
    const existingTitleWords = issue.title.toLowerCase().split(/\s+/);
    const hasWordOverlap = existingTitleWords.some(w => w.length > 4 && text.includes(w));

    return (isClose && sameCat) || (isClose && hasWordOverlap);
  });

  res.json({
    success: true,
    data: {
      hasDuplicates: duplicates.length > 0,
      duplicateCount: duplicates.length,
      duplicateIssues: duplicates.map(d => ({
        id: d.id,
        ticketNumber: d.ticketNumber,
        title: d.title,
        status: d.status,
        address: d.location.address,
        area: d.location.area,
        distanceMeters: !isNaN(lat) && !isNaN(lon) ? Math.round(getDistanceMeters(lat, lon, d.location.latitude, d.location.longitude)) : null
      }))
    }
  });
});

// 12. Image Upload
app.post('/api/upload/image', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    // Return sample image if no file was uploaded
    return res.json({
      success: true,
      data: {
        fileUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
      }
    });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    data: {
      fileUrl,
      url: fileUrl,
      fileName: req.file.filename,
      size: req.file.size
    }
  });
});

// 13. Citizen Issues (Issues reported or followed by authenticated citizen)
app.get('/api/citizen/issues', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[7];
  const userIssues = issues.filter(i => i.citizenId === authUser.id || i.followers.includes(authUser.id));
  res.json({ success: true, data: userIssues });
});

// 14. Citizen Grievances / Complaints
app.get('/api/citizen/complaints', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[7];
  const userComplaints = complaints.filter(c => c.citizenId === authUser.id);
  res.json({ success: true, data: userComplaints });
});

// 15. Create Citizen Grievance
app.post('/api/citizen/complaints', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[7];
  const { issueId, subject, description } = req.body;

  if (!subject || !description) {
    return res.status(400).json({ success: false, message: 'Subject and description are required' });
  }

  let refTicket: string | null = null;
  if (issueId) {
    const issue = issues.find(i => i.id === parseInt(issueId));
    if (issue) refTicket = issue.ticketNumber;
  }

  const newComplaint: Complaint = {
    id: complaints.length + 1,
    citizenId: authUser.id,
    citizenName: authUser.fullName,
    issueId: issueId ? parseInt(issueId) : null,
    issueTicketNumber: refTicket,
    subject,
    description,
    status: 'PENDING',
    resolutionNotes: null,
    createdAt: new Date().toISOString()
  };

  complaints.unshift(newComplaint);

  // Notify admin
  const admin = users.find(u => u.role === 'ROLE_ADMIN');
  if (admin) {
    notifications.unshift({
      id: notifications.length + 1,
      userId: admin.id,
      issueId: newComplaint.issueId || 0,
      title: `Citizen Grievance Escalated: ${newComplaint.subject.substring(0, 30)}`,
      message: `Citizen ${authUser.fullName} submitted formal grievance for review.`,
      notificationType: 'CITIZEN_GRIEVANCE',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json({ success: true, data: newComplaint, message: 'Grievance registered successfully.' });
});

// 16. Verify Issue Resolution (Citizen Confirms or Reopens)
app.post('/api/issues/:id/verify', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[7];
  const issueId = parseInt(req.params.id);
  const { status, rating, comments } = req.body;

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }

  const prev = issue.status;
  const nextStatus = status === 'REOPENED' ? 'REOPENED' : 'CLOSED';

  issue.status = nextStatus;
  issue.verificationRating = rating || 5;
  issue.verificationComment = comments || '';
  issue.updatedAt = new Date().toISOString();

  issue.statusHistory.unshift({
    previousStatus: prev,
    newStatus: nextStatus,
    changedBy: authUser.fullName,
    changeReason: nextStatus === 'CLOSED' ? `Citizen verified resolution. Rating: ${rating}/5` : `Citizen rejected resolution: ${comments}`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, data: issue, message: nextStatus === 'CLOSED' ? 'Issue verified and closed!' : 'Issue has been reopened for rectification.' });
});

// 17. Citizen Follow / Upvote Issue
app.post('/api/citizen/issues/:id/follow', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[7];
  const issueId = parseInt(req.params.id);
  const issue = issues.find(i => i.id === issueId);

  if (!issue) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }

  const idx = issue.followers.indexOf(authUser.id);
  if (idx >= 0) {
    issue.followers.splice(idx, 1);
    issue.followersCount = Math.max(0, issue.followersCount - 1);
  } else {
    issue.followers.push(authUser.id);
    issue.followersCount += 1;
  }

  res.json({
    success: true,
    data: {
      followersCount: issue.followersCount,
      isFollowing: issue.followers.includes(authUser.id)
    }
  });
});

// 18. Officer Issues
app.get('/api/officer/issues', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[1]; // default Officer Michael
  let officerIssues = issues;
  if (authUser.departmentId) {
    officerIssues = issues.filter(i => i.departmentId === authUser.departmentId);
  }
  res.json({ success: true, data: officerIssues });
});

// 19. Officer Workers Directory
app.get('/api/officer/workers', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[1];
  let deptWorkers = users.filter(u => u.role === 'ROLE_FIELD_WORKER');
  if (authUser.departmentId) {
    deptWorkers = deptWorkers.filter(u => u.departmentId === authUser.departmentId);
  }
  res.json({ success: true, data: deptWorkers });
});

// 20. Officer Assign Issue
app.post('/api/issues/:id/assign', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[1];
  const issueId = parseInt(req.params.id);
  const { workerId, targetDeadline } = req.body;

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }

  const worker = users.find(u => u.id === parseInt(workerId));
  if (!worker) {
    return res.status(400).json({ success: false, message: 'Invalid worker ID' });
  }

  const prev = issue.status;
  issue.assignedOfficerId = authUser.id;
  issue.assignedOfficerName = authUser.fullName;
  issue.assignedWorkerId = worker.id;
  issue.assignedWorkerName = worker.fullName;
  issue.status = 'ASSIGNED';
  if (targetDeadline) issue.targetDeadline = targetDeadline;
  issue.updatedAt = new Date().toISOString();

  issue.statusHistory.unshift({
    previousStatus: prev,
    newStatus: 'ASSIGNED',
    changedBy: authUser.fullName,
    changeReason: `Assigned to field technician ${worker.fullName} with SLA deadline ${issue.targetDeadline.substring(0, 10)}`,
    timestamp: new Date().toISOString()
  });

  // Notify Worker
  notifications.unshift({
    id: notifications.length + 1,
    userId: worker.id,
    issueId: issue.id,
    title: 'New Work Order Dispatched',
    message: `You were assigned ticket #${issue.ticketNumber} (${issue.title}). Target completion: ${issue.targetDeadline.substring(0, 10)}.`,
    notificationType: 'TASK_ASSIGNED',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, data: issue, message: `Dispatched to ${worker.fullName}` });
});

// 21. Status Update (Officer or Worker)
app.put('/api/issues/:id/status', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[1];
  const issueId = parseInt(req.params.id);
  const { status, notes } = req.body;

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }

  const prev = issue.status;
  issue.status = status;
  issue.updatedAt = new Date().toISOString();

  issue.statusHistory.unshift({
    previousStatus: prev,
    newStatus: status,
    changedBy: authUser.fullName,
    changeReason: notes || `Status transitioned to ${status}`,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, data: issue, message: `Status updated to ${status}` });
});

// 22. Worker Tasks
app.get('/api/worker/tasks', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[4]; // default Worker Rajesh
  const tasks = issues.filter(i => i.assignedWorkerId === authUser.id);
  res.json({ success: true, data: tasks });
});

// 23. Worker Resolve Issue with Proof
app.post('/api/issues/:id/resolve', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[4];
  const issueId = parseInt(req.params.id);
  const { notes, afterImageUrl } = req.body;

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }

  const prev = issue.status;
  issue.status = 'VERIFICATION_PENDING';
  issue.resolutionNotes = notes || 'On-ground field repair completed.';
  if (afterImageUrl) {
    issue.afterProofUrl = afterImageUrl;
    issue.imageUrls.push(afterImageUrl);
  }
  issue.updatedAt = new Date().toISOString();

  issue.statusHistory.unshift({
    previousStatus: prev,
    newStatus: 'VERIFICATION_PENDING',
    changedBy: authUser.fullName,
    changeReason: `Field crew completed work: ${issue.resolutionNotes}`,
    timestamp: new Date().toISOString()
  });

  // Notify Citizen
  notifications.unshift({
    id: notifications.length + 1,
    userId: issue.citizenId,
    issueId: issue.id,
    title: 'Work Completed on Your Ticket',
    message: `Repair on #${issue.ticketNumber} is complete. Please verify the resolution in your citizen portal.`,
    notificationType: 'VERIFICATION_PENDING',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, data: issue, message: 'Repair logged and submitted for citizen verification!' });
});

// 24. Admin Grievances List
app.get('/api/admin/complaints', (_req: Request, res: Response) => {
  res.json({ success: true, data: complaints });
});

// 25. Admin Update Grievance
app.put('/api/admin/complaints/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { status, resolutionNotes } = req.body;

  const comp = complaints.find(c => c.id === id);
  if (!comp) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  comp.status = status;
  comp.resolutionNotes = resolutionNotes || '';

  // Notify Citizen
  notifications.unshift({
    id: notifications.length + 1,
    userId: comp.citizenId,
    issueId: comp.issueId || 0,
    title: `Grievance #${comp.id} Update: ${status}`,
    message: `Administration decision: ${resolutionNotes || status}`,
    notificationType: 'GRIEVANCE_DECISION',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, data: comp, message: 'Administrative resolution applied' });
});

// 26. Admin Users List
app.get('/api/admin/users', (_req: Request, res: Response) => {
  res.json({ success: true, data: users });
});

// 27. Notifications List
app.get('/api/notifications', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[7];
  const userNotifs = notifications.filter(n => n.userId === authUser.id);
  res.json({ success: true, data: userNotifs });
});

// 28. Notifications Unread Count
app.get('/api/notifications/unread-count', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[7];
  const count = notifications.filter(n => n.userId === authUser.id && !n.isRead).length;
  res.json({ success: true, data: { count } });
});

// 29. Mark Notifications Read
app.put('/api/notifications/read-all', (req: Request, res: Response) => {
  const authUser = getAuthUser(req) || users[7];
  notifications.forEach(n => {
    if (n.userId === authUser.id) {
      n.isRead = true;
    }
  });
  res.json({ success: true, message: 'All notifications marked as read' });
});

// ==========================================
// VITE / STATIC ASSET SERVING
// ==========================================

async function startServer() {
  // Always serve public files (css, js, assets)
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[CIVICFIX] Server running at http://${HOST}:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[CIVICFIX] Fatal error starting server:', err);
  process.exit(1);
});
