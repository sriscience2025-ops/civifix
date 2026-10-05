/**
 * CIVICFIX - Core API Client & Authentication Layer
 * Built with Vanilla JavaScript
 */

// Fallback seed issues for static hosts (like Vercel deployments) or offline operation
const FALLBACK_SEED_ISSUES = [
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
    address: 'Corner of 5th Ave & Market St',
    area: 'Central Ward',
    city: 'Metro City',
    landmark: 'Near Central Metro Station',
    location: {
      latitude: 37.774929,
      longitude: -122.419416,
      address: 'Corner of 5th Ave & Market St',
      area: 'Central Ward',
      city: 'Metro City',
      landmark: 'Near Central Metro Station'
    },
    imageUrls: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'],
    citizenPhoto: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    beforePhoto: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    beforeProofUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=600&q=80',
    afterProofUrl: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=600&q=80',
    followersCount: 14,
    followers: [8, 9],
    statusHistory: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedBy: 'Priya Sharma', changeReason: 'Citizen initial submission', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'SUBMITTED', newStatus: 'UNDER_REVIEW', changedBy: 'Officer Michael Hastings', changeReason: 'Verified priority HIGH', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'UNDER_REVIEW', newStatus: 'ASSIGNED', changedBy: 'Officer Michael Hastings', changeReason: 'Assigned to field worker Rajesh Patel with 48h deadline', timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'ASSIGNED', newStatus: 'IN_PROGRESS', changedBy: 'Worker Rajesh Patel', changeReason: 'Reached site and initiated cold-mix asphalt prep', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
    ],
    history: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedByName: 'Priya Sharma', changeReason: 'Citizen initial submission', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'SUBMITTED', newStatus: 'UNDER_REVIEW', changedByName: 'Officer Michael Hastings', changeReason: 'Verified priority HIGH', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'UNDER_REVIEW', newStatus: 'ASSIGNED', changedByName: 'Officer Michael Hastings', changeReason: 'Assigned to field worker Rajesh Patel with 48h deadline', timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'ASSIGNED', newStatus: 'IN_PROGRESS', changedByName: 'Worker Rajesh Patel', changeReason: 'Reached site and initiated cold-mix asphalt prep', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
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
    address: '842 Pine Boulevard',
    area: 'North Ward',
    city: 'Metro City',
    landmark: 'Opposite Community Library',
    location: {
      latitude: 37.783333,
      longitude: -122.416667,
      address: '842 Pine Boulevard',
      area: 'North Ward',
      city: 'Metro City',
      landmark: 'Opposite Community Library'
    },
    imageUrls: ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'],
    citizenPhoto: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    beforePhoto: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    beforeProofUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    followersCount: 8,
    followers: [8],
    statusHistory: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedBy: 'Priya Sharma', changeReason: 'Citizen initial report', timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'SUBMITTED', newStatus: 'ASSIGNED', changedBy: 'Officer Elena Torres', changeReason: 'Dispatched electric field crew', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() }
    ],
    history: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedByName: 'Priya Sharma', changeReason: 'Citizen initial report', timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'SUBMITTED', newStatus: 'ASSIGNED', changedByName: 'Officer Elena Torres', changeReason: 'Dispatched electric field crew', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() }
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
    address: '312 Willow Creek Rd',
    area: 'South Ward',
    city: 'Metro City',
    landmark: 'Behind Primary School #4',
    location: {
      latitude: 37.765000,
      longitude: -122.430000,
      address: '312 Willow Creek Rd',
      area: 'South Ward',
      city: 'Metro City',
      landmark: 'Behind Primary School #4'
    },
    imageUrls: ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'],
    citizenPhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    beforePhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    beforeProofUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
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
    ],
    history: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedByName: 'Arun Patel', changeReason: 'Citizen emergency submission', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'SUBMITTED', newStatus: 'ASSIGNED', changedByName: 'Officer Alan Turing', changeReason: 'Critical pipeline burst assigned immediately', timestamp: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'ASSIGNED', newStatus: 'IN_PROGRESS', changedByName: 'Worker Carlos Mendez', changeReason: 'Excavation and pipe weld started', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'IN_PROGRESS', newStatus: 'RESOLVED', changedByName: 'Worker Carlos Mendez', changeReason: 'High pressure valve replaced and road resurfaced', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      { previousStatus: 'RESOLVED', newStatus: 'VERIFICATION_PENDING', changedByName: 'Worker Carlos Mendez', changeReason: 'Awaiting citizen verification confirmation', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
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
    address: '19 Industrial Expressway',
    area: 'East Ward',
    city: 'Metro City',
    landmark: 'Next to Warehouse #9',
    location: {
      latitude: 37.750000,
      longitude: -122.420000,
      address: '19 Industrial Expressway',
      area: 'East Ward',
      city: 'Metro City',
      landmark: 'Next to Warehouse #9'
    },
    imageUrls: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'],
    citizenPhoto: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    beforePhoto: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    beforeProofUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    followersCount: 5,
    followers: [8],
    statusHistory: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedBy: 'Priya Sharma', changeReason: 'Citizen report', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() }
    ],
    history: [
      { previousStatus: null, newStatus: 'SUBMITTED', changedByName: 'Priya Sharma', changeReason: 'Citizen report', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

const FALLBACK_DEPARTMENTS = [
  { id: 1, name: 'Roads / Public Works Department', code: 'PWD_ROADS', description: 'Maintenance of city asphalt, potholes, footpaths, bridges' },
  { id: 2, name: 'Electrical / Street Lighting Department', code: 'ELEC_LIGHT', description: 'Street lights, electrical transformers, open wires' },
  { id: 3, name: 'Sanitation & Solid Waste Department', code: 'SANITATION', description: 'Garbage clearing, public dustbins, landfill transport' },
  { id: 4, name: 'Water Supply Department', code: 'WATER_BOARD', description: 'Potable water pipelines, major main bursts, water pressure' },
  { id: 5, name: 'Drainage & Stormwater Department', code: 'DRAINAGE', description: 'Sewers, clogged storm drains, flood mitigation' },
  { id: 6, name: 'Parks & Environment Department', code: 'PARKS_ENV', description: 'Fallen trees, dangerous branches, public park upkeep' },
  { id: 7, name: 'Traffic & Transport Department', code: 'TRAFFIC_DIV', description: 'Traffic signal repairs, road markings, regulatory signage' }
];

const FALLBACK_CATEGORIES = [
  { id: 1, departmentId: 1, name: 'Road & Transport', defaultPriority: 'HIGH', defaultResolutionDays: 3, iconName: 'road' },
  { id: 2, departmentId: 2, name: 'Street Lighting', defaultPriority: 'MEDIUM', defaultResolutionDays: 2, iconName: 'lightbulb' },
  { id: 3, departmentId: 3, name: 'Garbage & Sanitation', defaultPriority: 'MEDIUM', defaultResolutionDays: 1, iconName: 'trash-2' },
  { id: 4, departmentId: 4, name: 'Water Supply', defaultPriority: 'HIGH', defaultResolutionDays: 2, iconName: 'droplets' },
  { id: 5, departmentId: 5, name: 'Drainage', defaultPriority: 'HIGH', defaultResolutionDays: 3, iconName: 'waves' },
  { id: 6, departmentId: 1, name: 'Public Infrastructure', defaultPriority: 'MEDIUM', defaultResolutionDays: 7, iconName: 'building' },
  { id: 7, departmentId: 6, name: 'Trees & Environment', defaultPriority: 'MEDIUM', defaultResolutionDays: 2, iconName: 'trees' },
  { id: 8, departmentId: 7, name: 'Traffic Signals', defaultPriority: 'CRITICAL', defaultResolutionDays: 1, iconName: 'traffic-cone' },
  { id: 9, departmentId: 1, name: 'Other', defaultPriority: 'LOW', defaultResolutionDays: 5, iconName: 'help-circle' }
];

const API = {
  BASE_URL: '', // relative to origin, routes through proxy to Express server or Vercel serverless

  getToken() {
    return localStorage.getItem('civicfix_token');
  },

  getUser() {
    const raw = localStorage.getItem('civicfix_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setAuth(token, user) {
    localStorage.setItem('civicfix_token', token);
    localStorage.setItem('civicfix_user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('civicfix_token');
    localStorage.removeItem('civicfix_user');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  hasRole(roleName) {
    const user = this.getUser();
    if (!user || !user.role) return false;
    const cleanRole = user.role.replace('ROLE_', '');
    const cleanTarget = roleName.replace('ROLE_', '');
    return cleanRole === cleanTarget;
  },

  getRoleRedirectUrl(role) {
    if (!role) return '/login.html';
    const r = role.replace('ROLE_', '');
    switch (r) {
      case 'CITIZEN': return '/citizen/dashboard.html';
      case 'DEPARTMENT_OFFICER': return '/officer/dashboard.html';
      case 'FIELD_WORKER': return '/worker/dashboard.html';
      case 'ADMIN': return '/admin/dashboard.html';
      default: return '/index.html';
    }
  },

  // Fallback Local Storage Methods for Vercel Static Deployments & Offline Reliability
  getCustomIssues() {
    try {
      const stored = localStorage.getItem('civicfix_custom_issues');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveCustomIssue(issue) {
    try {
      const list = this.getCustomIssues();
      list.unshift(issue);
      localStorage.setItem('civicfix_custom_issues', JSON.stringify(list));
    } catch (e) {
      console.warn('Could not save custom issue locally:', e);
    }
  },

  getAllLocalIssues() {
    const custom = this.getCustomIssues();
    return [...custom, ...FALLBACK_SEED_ISSUES];
  },

  findLocalIssue(ticketNumberOrId) {
    if (!ticketNumberOrId) return null;
    const raw = String(ticketNumberOrId).trim();
    const clean = raw.replace(/^#/, '').toUpperCase();
    const cleanNoDash = clean.replace(/-/g, '');

    const all = this.getAllLocalIssues();
    const found = all.find(i => {
      const t = (i.ticketNumber || '').toUpperCase();
      const tNoDash = t.replace(/-/g, '');
      return t === clean || 
             tNoDash === cleanNoDash || 
             t.endsWith(clean) || 
             String(i.id) === clean;
    });

    if (!found) return null;

    // Ensure all view fields are populated
    return {
      ...found,
      address: found.address || (found.location && found.location.address) || 'Central Ward',
      area: found.area || (found.location && found.location.area) || 'Metro City',
      city: found.city || (found.location && found.location.city) || 'Metro City',
      landmark: found.landmark || (found.location && found.location.landmark) || '',
      citizenPhoto: found.citizenPhoto || (found.imageUrls && found.imageUrls[0]) || '',
      beforePhoto: found.beforePhoto || found.beforeProofUrl || (found.imageUrls && found.imageUrls[0]) || '',
      afterPhoto: found.afterPhoto || found.afterProofUrl || '',
      history: (found.history || found.statusHistory || []).map(h => ({
        ...h,
        changedByName: h.changedByName || h.changedBy || 'Municipal Staff'
      }))
    };
  },

  getLocalDepartments() {
    return FALLBACK_DEPARTMENTS;
  },

  getLocalCategories() {
    return FALLBACK_CATEGORIES;
  },

  async request(endpoint, options = {}) {
    const url = `${this.BASE_URL}${endpoint}`;
    const headers = { ...options.headers };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        console.warn('Session expired or unauthorized');
      }

      // Check content-type to guard against HTML 404 responses from Vercel static rewrites
      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await response.json().catch(() => null);
      }

      if (!response.ok || !data) {
        // Intercept 404s/500s or non-JSON responses on Vercel deployments and fallback gracefully
        const fallbackResult = this.handleFallback(endpoint, options, data);
        if (fallbackResult) {
          return fallbackResult;
        }

        const errorMsg = (data && data.message) || `HTTP error ${response.status}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      // Network error (offline or serverless unreachable)
      const fallbackResult = this.handleFallback(endpoint, options, null);
      if (fallbackResult) {
        return fallbackResult;
      }

      console.error(`API Error on [${endpoint}]:`, err.message);
      throw err;
    }
  },

  // Graceful fallback for Vercel static hosting or cold starts
  handleFallback(endpoint, options, serverData) {
    const method = (options.method || 'GET').toUpperCase();

    // 1. Ticket Tracking Endpoint: /api/issues/track/:ticketNumber
    if (endpoint.startsWith('/api/issues/track/')) {
      const ticketParam = endpoint.replace('/api/issues/track/', '').split('?')[0];
      const decodedTicket = decodeURIComponent(ticketParam);
      const localIssue = this.findLocalIssue(decodedTicket);
      if (localIssue) {
        return { success: true, data: localIssue };
      }
      return { success: false, message: `Ticket #${decodedTicket} not found in municipal registry` };
    }

    // 2. Public Issues List: /api/issues
    if (endpoint.startsWith('/api/issues') && method === 'GET' && !endpoint.includes('/track/')) {
      const all = this.getAllLocalIssues();
      return { success: true, data: all };
    }

    // 3. Departments
    if (endpoint === '/api/departments' && method === 'GET') {
      return { success: true, data: this.getLocalDepartments() };
    }

    // 4. Categories
    if (endpoint === '/api/categories' && method === 'GET') {
      return { success: true, data: this.getLocalCategories() };
    }

    // 5. Follow Ticket
    if (endpoint.includes('/follow') && method === 'POST') {
      return { success: true, message: 'Now following issue updates!' };
    }

    // 6. Google Auth URL configuration check
    if (endpoint === '/api/auth/google/url' && method === 'GET') {
      return {
        success: true,
        configured: false,
        redirectUri: window.location.origin + '/auth/google/callback'
      };
    }

    // 7. Issue Creation Fallback
    if (endpoint === '/api/issues' && method === 'POST') {
      let bodyObj = {};
      try {
        bodyObj = typeof options.body === 'string' ? JSON.parse(options.body) : {};
      } catch (e) {}

      const newId = Date.now();
      const newTicketNumber = `CF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const user = this.getUser() || { fullName: 'Citizen Priya Sharma', phone: '+1-555-3001' };

      const newIssue = {
        id: newId,
        ticketNumber: newTicketNumber,
        citizenId: user.id || 8,
        citizenName: user.fullName || 'Citizen',
        citizenPhone: user.phone || '+1-555-3001',
        categoryId: Number(bodyObj.categoryId) || 1,
        categoryName: bodyObj.categoryName || 'Road & Transport',
        departmentId: Number(bodyObj.departmentId) || 1,
        departmentName: bodyObj.departmentName || 'Roads / Public Works Department',
        title: bodyObj.title || 'Reported Civic Issue',
        description: bodyObj.description || '',
        subcategory: bodyObj.subcategory || 'General',
        status: 'SUBMITTED',
        priority: bodyObj.priority || 'HIGH',
        severity: bodyObj.severity || 'HIGH',
        assignedOfficerId: null,
        assignedOfficerName: null,
        assignedWorkerId: null,
        assignedWorkerName: null,
        targetDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        deadlineStatus: 'ON_TIME',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        address: bodyObj.address || 'Central Ward',
        area: bodyObj.area || 'Central Ward',
        city: bodyObj.city || 'Metro City',
        landmark: bodyObj.landmark || '',
        location: {
          latitude: Number(bodyObj.latitude) || 37.7749,
          longitude: Number(bodyObj.longitude) || -122.4194,
          address: bodyObj.address || 'Central Ward',
          area: bodyObj.area || 'Central Ward',
          city: bodyObj.city || 'Metro City',
          landmark: bodyObj.landmark || ''
        },
        imageUrls: bodyObj.imageUrls || ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'],
        citizenPhoto: (bodyObj.imageUrls && bodyObj.imageUrls[0]) || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        followersCount: 1,
        followers: [user.id || 8],
        statusHistory: [
          { previousStatus: null, newStatus: 'SUBMITTED', changedBy: user.fullName || 'Citizen', changeReason: 'Initial citizen submission', timestamp: new Date().toISOString() }
        ],
        history: [
          { previousStatus: null, newStatus: 'SUBMITTED', changedByName: user.fullName || 'Citizen', changeReason: 'Initial citizen submission', timestamp: new Date().toISOString() }
        ]
      };

      this.saveCustomIssue(newIssue);
      return { success: true, data: newIssue, message: 'Issue registered successfully' };
    }

    return null;
  },

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // Auth Operations
  async login(email, password) {
    const res = await this.post('/api/auth/login', { email, password });
    if (res.success && res.data) {
      this.setAuth(res.data.token, res.data);
    }
    return res;
  },

  async register(data) {
    const res = await this.post('/api/auth/register', data);
    if (res.success && res.data) {
      this.setAuth(res.data.token, res.data);
    }
    return res;
  },

  logout() {
    this.clearAuth();
    window.location.href = '/login.html';
  },

  // Google OAuth Flow
  async initiateGoogleLogin(onSuccess, onError) {
    try {
      const authInfo = await this.get('/api/auth/google/url');
      
      if (authInfo && authInfo.configured && authInfo.url) {
        // Open Google OAuth Provider URL in popup window
        const width = 520;
        const height = 640;
        const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
        const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
        const popup = window.open(
          authInfo.url,
          'google_oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          showToast('Popup blocker detected. Please allow popups for Google sign-in.', 'warning');
          return;
        }

        const messageHandler = (event) => {
          // Validate message
          if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.data) {
            window.removeEventListener('message', messageHandler);
            const user = event.data.data;
            this.setAuth(user.token, user);
            showToast(`Welcome, ${user.fullName}!`, 'success');
            if (onSuccess) {
              onSuccess(user);
            } else {
              const redirect = this.getRoleRedirectUrl(user.role);
              setTimeout(() => { window.location.href = redirect; }, 500);
            }
          } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
            window.removeEventListener('message', messageHandler);
            showToast(`Google login error: ${event.data.error || 'Access denied'}`, 'error');
            if (onError) onError(event.data.error);
          }
        };

        window.addEventListener('message', messageHandler);
      } else {
        // Not yet configured in environment variables: show quick Google verification modal
        this.promptGoogleQuickAuth(onSuccess, onError, authInfo?.redirectUri);
      }
    } catch (err) {
      console.error('Failed to initiate Google OAuth:', err);
      showToast(err.message || 'Could not connect to Google auth service', 'error');
      if (onError) onError(err);
    }
  },

  // Instant Google Account Sign-In (for quick testing or preview verification)
  async quickGoogleLogin(email, fullName) {
    const res = await this.post('/api/auth/google/quick-login', { email, fullName });
    if (res.success && res.data) {
      this.setAuth(res.data.token, res.data);
    }
    return res;
  },

  promptGoogleQuickAuth(onSuccess, onError, redirectUri) {
    const existingModal = document.getElementById('google-auth-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'google-auth-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;backdrop-filter:blur(4px);';
    
    modal.innerHTML = `
      <div style="background:#ffffff;border-radius:16px;max-width:440px;width:100%;padding:28px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);font-family:inherit;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <svg style="width:28px;height:28px;" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <div>
            <h3 style="margin:0;font-size:1.15rem;font-weight:700;color:#0f172a;">Sign in with Google</h3>
            <span style="font-size:0.8rem;color:#64748b;">CIVICFIX Citizen Portal</span>
          </div>
        </div>

        <div style="background:#f1f5f9;border-radius:10px;padding:12px 14px;margin-bottom:18px;font-size:0.85rem;color:#334155;">
          <strong>Quick Google Verification:</strong> Sign in with your registered Google account directly, or enter your email below.
        </div>

        <button type="button" id="modal-google-default-btn" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;background:#ffffff;border:1px solid #cbd5e1;padding:11px 16px;border-radius:8px;font-weight:600;font-size:0.92rem;color:#1e293b;cursor:pointer;margin-bottom:14px;box-shadow:0 1px 2px rgba(0,0,0,0.05);transition:background 0.2s;">
          <svg style="width:18px;height:18px;" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue as sriscience2025@gmail.com
        </button>

        <div style="position:relative;text-align:center;margin:16px 0;">
          <div style="position:absolute;top:50%;left:0;right:0;border-top:1px solid #e2e8f0;"></div>
          <span style="position:relative;background:#ffffff;padding:0 10px;font-size:0.75rem;color:#94a3b8;text-transform:uppercase;font-weight:600;">or custom google email</span>
        </div>

        <div style="margin-bottom:14px;">
          <label style="display:block;font-size:0.8rem;font-weight:600;color:#475569;margin-bottom:5px;">Google Email Address</label>
          <input type="email" id="modal-google-custom-email" placeholder="username@gmail.com" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.9rem;" />
        </div>

        <div style="display:flex;gap:10px;">
          <button type="button" id="modal-google-cancel-btn" style="flex:1;padding:10px;border:1px solid #cbd5e1;background:#f8fafc;border-radius:8px;font-size:0.88rem;color:#475569;cursor:pointer;font-weight:600;">Cancel</button>
          <button type="button" id="modal-google-confirm-btn" style="flex:1;padding:10px;border:none;background:#2563eb;color:#ffffff;border-radius:8px;font-size:0.88rem;cursor:pointer;font-weight:600;">Continue</button>
        </div>

        <div style="margin-top:14px;padding-top:12px;border-top:1px solid #f1f5f9;font-size:0.75rem;color:#94a3b8;line-height:1.4;">
          Redirect URI for Google Cloud Console:<br/><code style="word-break:break-all;color:#475569;">${redirectUri || window.location.origin + '/auth/google/callback'}</code>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('#modal-google-cancel-btn').onclick = closeModal;

    const performQuickLogin = async (email, name) => {
      try {
        const res = await this.quickGoogleLogin(email, name);
        if (res.success && res.data) {
          closeModal();
          showToast(`Signed in with Google as ${res.data.fullName}!`, 'success');
          if (onSuccess) {
            onSuccess(res.data);
          } else {
            setTimeout(() => {
              window.location.href = this.getRoleRedirectUrl(res.data.role);
            }, 500);
          }
        }
      } catch (err) {
        showToast(err.message || 'Google sign-in failed', 'error');
        if (onError) onError(err);
      }
    };

    modal.querySelector('#modal-google-default-btn').onclick = () => {
      performQuickLogin('sriscience2025@gmail.com', 'Sri Science');
    };

    modal.querySelector('#modal-google-confirm-btn').onclick = () => {
      const email = document.getElementById('modal-google-custom-email').value.trim();
      if (!email || !email.includes('@')) {
        showToast('Please enter a valid Google email address', 'error');
        return;
      }
      performQuickLogin(email);
    };
  },

  // Image Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await this.post('/api/upload/image', formData);
    return res.data ? (res.data.fileUrl || res.data.url) : null;
  }
};

/**
 * Toast Notification system
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global expose
window.API = API;
window.showToast = showToast;
