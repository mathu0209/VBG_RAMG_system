-- =============================================================================
-- MGNREGS Smart Rural Employment & Transparency System - Database Schema (MySQL 8.0)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS mgnregs_db;
USE mgnregs_db;

-- 1. State Table
CREATE TABLE IF NOT EXISTS states (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_code VARCHAR(20) UNIQUE NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. District Table
CREATE TABLE IF NOT EXISTS districts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district_code VARCHAR(20) UNIQUE NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    state_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

-- 3. Block Table
CREATE TABLE IF NOT EXISTS blocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    block_code VARCHAR(20) UNIQUE NOT NULL,
    block_name VARCHAR(100) NOT NULL,
    district_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

-- 4. Panchayat Table
CREATE TABLE IF NOT EXISTS panchayats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panchayat_code VARCHAR(20) UNIQUE NOT NULL,
    panchayat_name VARCHAR(100) NOT NULL,
    block_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE
);

-- 5. Village Table
CREATE TABLE IF NOT EXISTS villages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    village_code VARCHAR(20) UNIQUE NOT NULL,
    village_name VARCHAR(100) NOT NULL,
    panchayat_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE CASCADE
);

-- 6. Users & Roles
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(30) NOT NULL, -- WORKER, MATE, SUPERVISOR, OFFICIAL, ADMIN
    state_id BIGINT,
    district_id BIGINT,
    block_id BIGINT,
    panchayat_id BIGINT,
    village_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Workers
CREATE TABLE IF NOT EXISTS workers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_card_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    dob DATE NOT NULL,
    aadhaar_hash VARCHAR(64) NOT NULL,
    bank_account_number VARCHAR(30) NOT NULL,
    ifsc_code VARCHAR(15) NOT NULL,
    village_id BIGINT NOT NULL,
    category VARCHAR(20) NOT NULL, -- SC, ST, OBC, GENERAL
    verification_status VARCHAR(20) DEFAULT 'VERIFIED',
    qr_code_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (village_id) REFERENCES villages(id)
);

-- 8. Worksites / Projects
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    work_type VARCHAR(50) NOT NULL, -- WATER_CONSERVATION, ROAD_CONSTRUCTION, DREDGING, PLANTATION, LAND_DEVELOPMENT
    estimated_cost DECIMAL(12, 2) NOT NULL,
    sanctioned_days INT NOT NULL,
    village_id BIGINT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (village_id) REFERENCES villages(id)
);

-- 9. Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(10) NOT NULL, -- PRESENT, ABSENT, HALF_DAY
    scanned_at TIMESTAMP NULL,
    latitude DOUBLE,
    longitude DOUBLE,
    gps_verified BOOLEAN DEFAULT TRUE,
    face_verified BOOLEAN DEFAULT TRUE,
    fraud_flagged BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- 10. Face Verifications
CREATE TABLE IF NOT EXISTS face_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,
    confidence_score DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL, -- SUCCESS, MISMATCH, RETRY
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id)
);

-- 11. Worksite Photos
CREATE TABLE IF NOT EXISTS worksite_photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- 12. Work Progress (Before / After & AI Estimate)
CREATE TABLE IF NOT EXISTS work_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    before_photo_url VARCHAR(255),
    after_photo_url VARCHAR(255),
    ai_estimated_progress_pct DOUBLE NOT NULL,
    progress_status VARCHAR(30) DEFAULT 'IN_PROGRESS',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- 13. Wages & Payments
CREATE TABLE IF NOT EXISTS wages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    total_days INT NOT NULL,
    daily_wage_rate DECIMAL(8, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    wage_period_start DATE NOT NULL,
    wage_period_end DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PAID', -- PAID, PENDING, FAILED, DELAYED
    payment_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- 14. Fraud Reports & Factors
CREATE TABLE IF NOT EXISTS fraud_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alert_code VARCHAR(50) UNIQUE NOT NULL,
    anomaly_type VARCHAR(50) NOT NULL, -- FACE_MISMATCH, FAKE_GPS, UNUSUAL_PATTERN, PAYMENT_ANOMALY
    severity VARCHAR(15) NOT NULL, -- HIGH, MEDIUM, LOW
    description TEXT NOT NULL,
    worker_id BIGINT,
    project_id BIGINT,
    attendance_id BIGINT,
    confidence_score DOUBLE NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, FLAGGED, INVESTIGATING, APPROVED, DISMISSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Admin Reviews
CREATE TABLE IF NOT EXISTS admin_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fraud_report_id BIGINT NOT NULL,
    reviewed_by_user VARCHAR(50) NOT NULL,
    decision VARCHAR(30) NOT NULL, -- APPROVED, REJECTED, DISMISSED
    comments TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fraud_report_id) REFERENCES fraud_reports(id)
);

-- 16. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Government Sync Logs
CREATE TABLE IF NOT EXISTS government_sync_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    endpoint_name VARCHAR(100) NOT NULL,
    sync_type VARCHAR(50) NOT NULL, -- JOB_CARD, MUSTER_ROLL, DBT_PAYMENT
    status VARCHAR(20) NOT NULL, -- SUCCESS, FAILED
    records_synced INT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
