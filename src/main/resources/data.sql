-- CIVICFIX: Production Seed Data
-- Default password for all seed users is 'password123' (BCrypt hash)
-- BCrypt: $2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq

INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_CITIZEN', 'General public citizen reporting and tracking civic issues'),
(2, 'ROLE_DEPARTMENT_OFFICER', 'Municipal department officer reviewing and managing department issues'),
(3, 'ROLE_FIELD_WORKER', 'Field technician performing on-ground repairs and uploading proof'),
(4, 'ROLE_ADMIN', 'Central municipal administrator with system-wide access and analytics');

INSERT INTO departments (id, name, code, description, contact_email, contact_phone, head_officer_name) VALUES
(1, 'Roads / Public Works Department', 'PWD_ROADS', 'Maintenance of city asphalt, potholes, footpaths, bridges', 'roads@civicfix.gov', '+1-555-0191', 'Commissioner Robert Chen'),
(2, 'Electrical / Street Lighting Department', 'ELEC_LIGHT', 'Street lights, electrical transformers, open wires, grid power', 'electric@civicfix.gov', '+1-555-0192', 'Eng. Sarah Jenkins'),
(3, 'Sanitation & Solid Waste Department', 'SANITATION', 'Garbage clearing, public dustbins, landfill transport', 'sanitation@civicfix.gov', '+1-555-0193', 'Inspector David Kumar'),
(4, 'Water Supply Department', 'WATER_BOARD', 'Potable water pipelines, major main bursts, water pressure', 'water@civicfix.gov', '+1-555-0194', 'Dir. Elena Rostova'),
(5, 'Drainage & Stormwater Department', 'DRAINAGE', 'Sewers, clogged storm drains, monsoon flood mitigation', 'drainage@civicfix.gov', '+1-555-0195', 'Chief Marcus Vance'),
(6, 'Parks & Environment Department', 'PARKS_ENV', 'Fallen trees, dangerous branches, public park upkeep', 'parks@civicfix.gov', '+1-555-0196', 'Horticulturist Anita Roy'),
(7, 'Traffic & Transport Department', 'TRAFFIC_DIV', 'Traffic signal repairs, road markings, regulatory signage', 'traffic@civicfix.gov', '+1-555-0197', 'Officer James Miller');

-- Seed Users: Admin, Officers, Workers, Citizens
INSERT INTO users (id, role_id, department_id, full_name, email, phone, password_hash, address, city, area, is_active) VALUES
(1, 4, NULL, 'Chief Administrator Arthur Vance', 'admin@civicfix.gov', '+1-555-1000', '$2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq', 'City Hall, Room 401', 'Metro City', 'Downtown', true),
(2, 2, 1, 'Officer Michael Hastings (Roads)', 'officer.roads@civicfix.gov', '+1-555-1001', '$2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq', 'PWD North Zone Depot', 'Metro City', 'North Ward', true),
(3, 2, 2, 'Officer Elena Torres (Electrical)', 'officer.electric@civicfix.gov', '+1-555-1002', '$2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq', 'Power Grid Office, Bay 3', 'Metro City', 'Central Ward', true),
(4, 2, 4, 'Officer Alan Turing (Water)', 'officer.water@civicfix.gov', '+1-555-1003', '$2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq', 'Water Works Station 5', 'Metro City', 'South Ward', true),
(5, 3, 1, 'Worker Rajesh Patel (Roads Crew)', 'worker.rajesh@civicfix.gov', '+1-555-2001', '$2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq', 'PWD Workshop Unit 2', 'Metro City', 'North Ward', true),
(6, 3, 2, 'Worker Thomas Bradley (Electrical)', 'worker.thomas@civicfix.gov', '+1-555-2002', '$2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq', 'Substation Field Yard', 'Metro City', 'Central Ward', true),
(7, 3, 4, 'Worker Carlos Mendez (Water Works)', 'worker.carlos@civicfix.gov', '+1-555-2003', '$2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq', 'Main Pumping Station', 'Metro City', 'South Ward', true),
(8, 1, NULL, 'Citizen Priya Sharma', 'priya@gmail.com', '+1-555-3001', '$2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq', '42 Maple Street, Apt 3B', 'Metro City', 'Central Ward', true),
(9, 1, NULL, 'Citizen Arun Patel', 'arun@gmail.com', '+1-555-3002', '$2a$10$w8T0zHqQ9v6.YqF0Q9yEre9f1n7iYyU0G5jC3c3Zc9p1E2l4w6zKq', '118 Oakridge Boulevard', 'Metro City', 'North Ward', true);

INSERT INTO issue_categories (id, department_id, name, description, default_priority, default_resolution_days, icon_name) VALUES
(1, 1, 'Road & Transport', 'Potholes, cracked asphalt, missing manhole covers, cave-ins', 'HIGH', 3, 'road'),
(2, 2, 'Street Lighting', 'Non-functional street lamps, flicker, dark corridors, broken poles', 'MEDIUM', 2, 'lightbulb'),
(3, 3, 'Garbage & Sanitation', 'Overflowing community bins, illegal dump heaps, dead animal removal', 'MEDIUM', 1, 'trash-2'),
(4, 4, 'Water Supply', 'Broken water mains, low pressure, water contamination, leakages', 'HIGH', 2, 'droplets'),
(5, 5, 'Drainage', 'Overflowing gutter, clogged stormwater drains, sewer backup', 'HIGH', 3, 'waves'),
(6, 1, 'Public Infrastructure', 'Damaged pedestrian railings, broken bus shelters, sidewalk tiles', 'MEDIUM', 7, 'building'),
(7, 6, 'Trees & Environment', 'Fallen tree blocking roads, overgrown branches, dead hazard trees', 'MEDIUM', 2, 'trees'),
(8, 7, 'Traffic Signals', 'Stuck traffic lights, damaged pedestrian countdown, knocked sign', 'CRITICAL', 1, 'traffic-cone'),
(9, 1, 'Other', 'Civic issues requiring municipal triage and review', 'LOW', 5, 'help-circle');

-- Seed Locations
INSERT INTO locations (id, latitude, longitude, address, area, city, landmark) VALUES
(1, 37.774929, -122.419416, 'Corner of 5th Ave & Market St', 'Central Ward', 'Metro City', 'Near Central Metro Station'),
(2, 37.783333, -122.416667, '842 Pine Boulevard', 'North Ward', 'Metro City', 'Opposite Community Library'),
(3, 37.765000, -122.430000, '312 Willow Creek Rd', 'South Ward', 'Metro City', 'Behind Primary School #4'),
(4, 37.750000, -122.420000, '19 Industrial Expressway', 'East Ward', 'Metro City', 'Next to Warehouse #9');

-- Seed Issues
INSERT INTO issues (id, ticket_number, citizen_id, category_id, department_id, location_id, title, description, subcategory, status, priority, severity, assigned_officer_id, assigned_worker_id, target_deadline, deadline_status) VALUES
(1, 'CF-2026-1001', 8, 1, 1, 1, 'Dangerous Deep Pothole on Main Intersection', 'Large pothole measuring approx 3 feet wide and 6 inches deep causing vehicle damage and traffic swerving.', 'Potholes', 'IN_PROGRESS', 'HIGH', 'HIGH', 2, 5, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 'ON_TIME'),
(2, 'CF-2026-1002', 8, 2, 2, 2, 'Flickering and Blacked Out Street Lights for 3 Blocks', 'Entire residential stretch on Pine Blvd is completely pitch dark at night creating serious safety hazards for pedestrians.', 'Non-functional lamps', 'ASSIGNED', 'MEDIUM', 'MEDIUM', 3, 6, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY), 'ON_TIME'),
(3, 'CF-2026-1003', 9, 4, 4, 3, 'High Pressure Water Pipe Burst Flooding Road', 'Potable water pipeline ruptured underground, water is gushing out rapidly and beginning to enter residential driveways.', 'Pipeline rupture', 'VERIFICATION_PENDING', 'CRITICAL', 'CRITICAL', 4, 7, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -1 DAY), 'OVERDUE'),
(4, 'CF-2026-1004', 8, 3, 3, 4, 'Overflowing Garbage Dump Near Public Park', 'Community bins have not been emptied in 5 days, stray dogs scattering waste onto pedestrian walkway.', 'Dump clearing', 'SUBMITTED', 'MEDIUM', 'MEDIUM', NULL, NULL, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 'ON_TIME');

-- Seed Images (using standard svg/image assets)
INSERT INTO issue_images (id, issue_id, image_url, image_type, uploaded_by, caption, mime_type) VALUES
(1, 1, 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80', 'CITIZEN_SUBMISSION', 8, 'Pothole on 5th Ave', 'image/jpeg'),
(2, 3, 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80', 'CITIZEN_SUBMISSION', 9, 'Burst pipe initial report', 'image/jpeg'),
(3, 3, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', 'BEFORE_PROOF', 7, 'Worker inspecting pipe break before repair', 'image/jpeg'),
(4, 3, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'AFTER_PROOF', 7, 'Repaired main valve and newly sealed asphalt', 'image/jpeg');

-- Status History
INSERT INTO issue_status_history (id, issue_id, previous_status, new_status, changed_by, change_reason) VALUES
(1, 1, NULL, 'SUBMITTED', 8, 'Citizen initial submission'),
(2, 1, 'SUBMITTED', 'UNDER_REVIEW', 2, 'Officer Michael reviewed and verified priority HIGH'),
(3, 1, 'UNDER_REVIEW', 'ASSIGNED', 2, 'Assigned to field worker Rajesh Patel with 48h deadline'),
(4, 1, 'ASSIGNED', 'IN_PROGRESS', 5, 'Worker Rajesh Patel reached site and initiated cold-mix asphalt prep'),
(5, 3, NULL, 'SUBMITTED', 9, 'Citizen emergency submission'),
(6, 3, 'SUBMITTED', 'ASSIGNED', 4, 'Critical pipeline burst assigned immediately to crew'),
(7, 3, 'ASSIGNED', 'IN_PROGRESS', 7, 'Excavation and pipe weld started'),
(8, 3, 'IN_PROGRESS', 'RESOLVED', 7, 'High pressure valve replaced and road resurfaced'),
(9, 3, 'RESOLVED', 'VERIFICATION_PENDING', 7, 'Awaiting citizen verification confirmation');

-- Notifications
INSERT INTO notifications (id, user_id, issue_id, title, message, notification_type, is_read) VALUES
(1, 8, 1, 'Worker Assigned to Your Issue', 'Worker Rajesh Patel has been dispatched to fix Pothole #CF-2026-1001.', 'ISSUE_ASSIGNED', false),
(2, 9, 3, 'Issue Resolved - Please Verify', 'Work is complete on #CF-2026-1003. Please confirm if the water issue is resolved.', 'VERIFICATION_PENDING', false),
(3, 2, 1, 'High Priority Issue Logged', 'A HIGH priority road damage issue was reported on 5th Ave.', 'HIGH_PRIORITY_ISSUE', true),
(4, 1, 3, 'Critical Water Burst Alert', 'CRITICAL issue #CF-2026-1003 was resolved in South Ward.', 'CRITICAL_ALERT', false);

-- Audit Logs
INSERT INTO audit_logs (id, user_id, user_email, action, entity_type, entity_id, details, ip_address) VALUES
(1, 8, 'priya@gmail.com', 'ISSUE_CREATED', 'ISSUE', '1', 'Citizen reported Pothole on 5th Ave', '127.0.0.1'),
(2, 2, 'officer.roads@civicfix.gov', 'WORKER_ASSIGNED', 'ISSUE', '1', 'Officer assigned Rajesh Patel (Roads)', '127.0.0.1'),
(3, 5, 'worker.rajesh@civicfix.gov', 'STATUS_CHANGE', 'ISSUE', '1', 'Changed status from ASSIGNED to IN_PROGRESS', '127.0.0.1'),
(4, 9, 'arun@gmail.com', 'ISSUE_CREATED', 'ISSUE', '3', 'Emergency burst pipe reported', '127.0.0.1'),
(5, 7, 'worker.carlos@civicfix.gov', 'PROOF_UPLOADED', 'ISSUE_IMAGE', '4', 'Uploaded Before & After photo proofs for #CF-2026-1003', '127.0.0.1');

-- System Settings
INSERT INTO system_settings (id, setting_key, setting_value, description) VALUES
(1, 'DUPLICATE_DISTANCE_THRESHOLD_METERS', '150', 'Proximity threshold in meters to flag duplicate civic complaints'),
(2, 'AUTO_ESCALATION_HOURS_HIGH', '24', 'Hours before unassigned HIGH priority issues escalate to Head Officer'),
(3, 'AUTO_ESCALATION_HOURS_CRITICAL', '6', 'Hours before unassigned CRITICAL issues trigger SMS/Email emergency dispatch'),
(4, 'MAX_REOPEN_COUNT_ALLOWED', '3', 'Maximum times a citizen can reopen before manual Admin arbitration'),
(5, 'ALLOW_PUBLIC_TRACKING', 'true', 'Permit anonymous ticket lookup by CF-Ticket number without login');
