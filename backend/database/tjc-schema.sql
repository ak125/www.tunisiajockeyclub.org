-- ========================================
-- TUNISIA JOCKEY CLUB - SCHÉMA COMPLET
-- ========================================

-- Suppression des tables existantes (en cascade)
DROP TABLE IF EXISTS race_results CASCADE;
DROP TABLE IF EXISTS race_entries CASCADE;
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS races CASCADE;
DROP TABLE IF EXISTS horses CASCADE;
DROP TABLE IF EXISTS jockeys CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS racecourses CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- 1. TABLE USERS (Utilisateurs améliorée)
-- ========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member', 'owner', 'trainer', 'jockey')),
    is_active BOOLEAN DEFAULT true,
    avatar_url TEXT,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'Tunisia',
    date_of_birth DATE,
    license_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. TABLE SESSIONS (Sessions utilisateurs)
-- ========================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. TABLE RACECOURSES (Hippodromes)
-- ========================================
CREATE TABLE racecourses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    location VARCHAR(255),
    track_type VARCHAR(50) CHECK (track_type IN ('turf', 'dirt', 'synthetic')),
    capacity INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 4. TABLE OWNERS (Propriétaires)
-- ========================================
CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    stable_name VARCHAR(255),
    colors_description TEXT,
    registration_number VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 5. TABLE TRAINERS (Entraîneurs)
-- ========================================
CREATE TABLE trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    years_experience INTEGER,
    specialization VARCHAR(100),
    stable_location VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 6. TABLE JOCKEYS (Jockeys)
-- ========================================
CREATE TABLE jockeys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    weight_kg DECIMAL(5,2),
    height_cm INTEGER,
    wins INTEGER DEFAULT 0,
    places INTEGER DEFAULT 0,
    shows INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 7. TABLE HORSES (Chevaux)
-- ========================================
CREATE TABLE horses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    sex VARCHAR(20) CHECK (sex IN ('stallion', 'mare', 'gelding', 'colt', 'filly')),
    color VARCHAR(50),
    breed VARCHAR(100) DEFAULT 'Thoroughbred',
    sire_name VARCHAR(255),
    dam_name VARCHAR(255),
    owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
    trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
    current_rating INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 8. TABLE RACES (Courses)
-- ========================================
CREATE TABLE races (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_number INTEGER NOT NULL,
    race_date DATE NOT NULL,
    race_time TIME NOT NULL,
    racecourse_id UUID REFERENCES racecourses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    race_type VARCHAR(50) CHECK (race_type IN ('flat', 'jump', 'harness')),
    race_class VARCHAR(50),
    distance_meters INTEGER NOT NULL,
    prize_money DECIMAL(10,2),
    conditions TEXT,
    max_runners INTEGER,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'open', 'closed', 'running', 'finished', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(race_date, racecourse_id, race_number)
);

-- ========================================
-- 9. TABLE RACE_ENTRIES (Inscriptions)
-- ========================================
CREATE TABLE race_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID REFERENCES races(id) ON DELETE CASCADE,
    horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
    jockey_id UUID REFERENCES jockeys(id) ON DELETE SET NULL,
    trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES owners(id) ON DELETE SET NULL,
    cloth_number INTEGER,
    draw_position INTEGER,
    weight_carried_kg DECIMAL(5,2),
    odds DECIMAL(6,2),
    scratched BOOLEAN DEFAULT false,
    scratched_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(race_id, horse_id)
);

-- ========================================
-- 10. TABLE RACE_RESULTS (Résultats)
-- ========================================
CREATE TABLE race_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID REFERENCES races(id) ON DELETE CASCADE,
    horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
    jockey_id UUID REFERENCES jockeys(id) ON DELETE SET NULL,
    position INTEGER NOT NULL,
    time_seconds DECIMAL(8,2),
    lengths_behind DECIMAL(5,2),
    starting_price DECIMAL(6,2),
    comments TEXT,
    disqualified BOOLEAN DEFAULT false,
    disqualification_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(race_id, position)
);

-- ========================================
-- 11. TABLE BETS (Paris)
-- ========================================
CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    race_id UUID REFERENCES races(id) ON DELETE CASCADE,
    bet_type VARCHAR(50) CHECK (bet_type IN ('win', 'place', 'show', 'exacta', 'trifecta', 'quinella')),
    selections JSONB NOT NULL,
    stake_amount DECIMAL(10,2) NOT NULL,
    potential_return DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'void', 'partial')),
    payout_amount DECIMAL(10,2),
    placed_at TIMESTAMPTZ DEFAULT NOW(),
    settled_at TIMESTAMPTZ
);

-- ========================================
-- INDEXES pour optimisation
-- ========================================
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_horses_owner_id ON horses(owner_id);
CREATE INDEX idx_horses_trainer_id ON horses(trainer_id);
CREATE INDEX idx_races_date ON races(race_date);
CREATE INDEX idx_races_racecourse ON races(racecourse_id);
CREATE INDEX idx_race_entries_race ON race_entries(race_id);
CREATE INDEX idx_race_results_race ON race_results(race_id);
CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_bets_race ON bets(race_id);

-- ========================================
-- TRIGGER pour updated_at automatique
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_horses_updated_at 
    BEFORE UPDATE ON horses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_races_updated_at 
    BEFORE UPDATE ON races
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DONNÉES DE TEST
-- ========================================

-- Hippodromes tunisiens
INSERT INTO racecourses (name, code, location, track_type, capacity) VALUES
('Hippodrome de Kassar Saïd', 'KS', 'La Marsa, Tunis', 'turf', 5000),
('Hippodrome de Monastir', 'MON', 'Monastir', 'turf', 3000),
('Hippodrome de Sidi Thabet', 'ST', 'Sidi Thabet, Ariana', 'dirt', 2500);

-- Utilisateurs de test (mots de passe : "1234" et "admin123")
INSERT INTO users (email, password, first_name, last_name, role, phone, city) VALUES
('admin@tjc.tn', '$2a$10$jGwkY5.CkH6VGwlCCLH9vOzQ3yQ8EhGANCo6QT2YZxCVxe/gxc7tO', 'Admin', 'TJC', 'admin', '+216 70 123 456', 'Tunis'),
('monia@gmail.com', '$2a$10$/o4jXprQqfW8F9S/QK/kdOjx3ZsOWVyhtwb.Vk06RUtnqNREpFyKy', 'Monia', 'Ben Ali', 'member', '+216 50 123 456', 'Tunis'),
('trainer@tjc.tn', '$2a$10$jGwkY5.CkH6VGwlCCLH9vOzQ3yQ8EhGANCo6QT2YZxCVxe/gxc7tO', 'Ahmed', 'Benali', 'trainer', '+216 55 789 123', 'Monastir'),
('jockey@tjc.tn', '$2a$10$jGwkY5.CkH6VGwlCCLH9vOzQ3yQ8EhGANCo6QT2YZxCVxe/gxc7tO', 'Fatima', 'Sghaier', 'jockey', '+216 22 456 789', 'La Marsa');

-- Propriétaires
INSERT INTO owners (user_id, stable_name, colors_description, registration_number) 
SELECT u.id, 'Ecurie Al Andalous', 'Rouge et blanc rayé', 'OWN001'
FROM users u WHERE u.email = 'admin@tjc.tn';

-- Entraîneurs  
INSERT INTO trainers (user_id, license_number, years_experience, stable_location) 
SELECT u.id, 'TR001', 15, 'Hippodrome de Kassar Saïd'
FROM users u WHERE u.email = 'trainer@tjc.tn';

-- Jockeys
INSERT INTO jockeys (user_id, license_number, weight_kg, height_cm, wins, places, shows) 
SELECT u.id, 'JK001', 55.5, 165, 24, 18, 12
FROM users u WHERE u.email = 'jockey@tjc.tn';

-- Chevaux de test
INSERT INTO horses (name, registration_number, date_of_birth, sex, color, owner_id, trainer_id) VALUES
('Sahara Star', 'TUN001', '2020-03-15', 'colt', 'bay', 
    (SELECT id FROM owners LIMIT 1), 
    (SELECT id FROM trainers LIMIT 1)),
('Carthage Pride', 'TUN002', '2019-05-20', 'mare', 'chestnut',
    (SELECT id FROM owners LIMIT 1), 
    (SELECT id FROM trainers LIMIT 1)),
('Tunis Thunder', 'TUN003', '2021-02-10', 'colt', 'black',
    (SELECT id FROM owners LIMIT 1), 
    (SELECT id FROM trainers LIMIT 1));

-- Course de test
INSERT INTO races (race_number, race_date, race_time, racecourse_id, name, race_type, distance_meters, prize_money) VALUES
(1, CURRENT_DATE + INTERVAL '7 days', '15:30:00', 
    (SELECT id FROM racecourses WHERE code = 'KS'), 
    'Prix de Carthage', 'flat', 1600, 50000.00);

-- Message de confirmation
SELECT 'Tunisia Jockey Club - Schéma créé avec succès! 🏇🇹🇳' as message,
       COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'sessions', 'racecourses', 'owners', 'trainers', 'jockeys', 'horses', 'races', 'race_entries', 'race_results', 'bets');
