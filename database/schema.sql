-- ============================================================================
-- VB-G RAM G SMART SYSTEM — MASTER POSTGRESQL DATABASE SCHEMA
-- Ministry of Rural Development • Government of Tamil Nadu
-- ============================================================================

-- Drop tables if exists
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS fraud_alerts CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS workers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS worksites CASCADE;

-- 1. WORKSITES TABLE
CREATE TABLE worksites (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    lat NUMERIC(10, 6) NOT NULL,
    long NUMERIC(10, 6) NOT NULL,
    geofence_radius_m INT DEFAULT 500,
    budget NUMERIC(12, 2) NOT NULL,
    start_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' -- ACTIVE, COMPLETED, SUSPENDED
);

-- 2. USERS TABLE (Role-Based Access Control)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL, -- WORKER, SUPERVISOR, BLOCK_OFFICER, ADMIN
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    worksite_id INT REFERENCES worksites(id) ON DELETE SET NULL,
    district VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. WORKERS TABLE (Aadhaar Hashed for Privacy)
CREATE TABLE workers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    aadhaar_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 Hashed
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    face_embedding JSONB, -- Biometric embedding representation
    worksite_id INT REFERENCES worksites(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ATTENDANCE TABLE (GPS & Biometric Logs)
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    worker_id INT REFERENCES workers(id) ON DELETE CASCADE,
    worksite_id INT REFERENCES worksites(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lat NUMERIC(10, 6) NOT NULL,
    long NUMERIC(10, 6) NOT NULL,
    face_match_score NUMERIC(5, 2) NOT NULL, -- Percentage (0-100)
    gps_distance_m NUMERIC(8, 2) NOT NULL,
    verified_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- 5. PAYMENTS TABLE (DBT Wage Records)
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    worker_id INT REFERENCES workers(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'PROCESSED', -- PROCESSED, HELD, REJECTED
    deviation_pct NUMERIC(5, 2) DEFAULT 0.00
);

-- 6. FRAUD ALERTS TABLE (Anti-Corruption Engine)
CREATE TABLE fraud_alerts (
    id SERIAL PRIMARY KEY,
    worker_id INT REFERENCES workers(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- FACE_MISMATCH, LOCATION_MISMATCH, UNUSUAL_PATTERN, PAYMENT_ANOMALY
    risk_score INT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    evidence_json JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, INVESTIGATING, RESOLVED, DISMISSED
    reviewed_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. AUDIT LOGS TABLE (Immutable Governance Audit Trail)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Fast Query Performance & Real-Time Alerts
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_workers_worksite ON workers(worksite_id);
CREATE INDEX idx_attendance_timestamp ON attendance(timestamp);
CREATE INDEX idx_fraud_risk ON fraud_alerts(risk_score);
CREATE INDEX idx_fraud_status ON fraud_alerts(status);

-- Seed Initial Worksites & Administrative Data
INSERT INTO worksites (code, name, location, lat, long, geofence_radius_m, budget, start_date, status) VALUES
('WK12345', 'Pond Cleaning & Restoration', 'Kothapalli, Thiruvallur', 9.292053, 77.701788, 500, 250000.00, '2024-04-12', 'ACTIVE'),
('WK12346', 'Check Dam Construction', 'Siruseri, Chengalpattu', 12.832100, 80.224500, 500, 480000.00, '2024-03-15', 'ACTIVE');
