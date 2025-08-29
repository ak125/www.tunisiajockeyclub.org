-- Migration: Système de Tournois
-- Date: 2025-08-25
-- Description: Ajouter tables pour les tournois et classements

-- Table des tournois
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, active, completed, cancelled
  prize_pool DECIMAL(10,2),
  max_participants INTEGER,
  rules JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des participations aux tournois
CREATE TABLE IF NOT EXISTS tournament_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  jockey_name VARCHAR(255) NOT NULL,
  registration_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'registered', -- registered, confirmed, withdrawn
  UNIQUE(tournament_id, horse_id)
);

-- Table des résultats de tournoi
CREATE TABLE IF NOT EXISTS tournament_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES tournament_participants(id) ON DELETE CASCADE,
  race_id UUID REFERENCES races(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  time_seconds DECIMAL(8,3),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des classements
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  races_participated INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  podium_finishes INTEGER DEFAULT 0,
  best_time DECIMAL(8,3),
  average_position DECIMAL(4,2),
  rank INTEGER,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tournament_id, horse_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_results_tournament ON tournament_results(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_results_race ON tournament_results(race_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_tournament ON leaderboard(tournament_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(tournament_id, rank);

-- Fonction pour mettre à jour le classement
CREATE OR REPLACE FUNCTION update_leaderboard(tournament_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Recalculer les statistiques du classement
  INSERT INTO leaderboard (tournament_id, horse_id, total_points, races_participated, wins, podium_finishes, best_time, average_position)
  SELECT 
    tr.tournament_id,
    tp.horse_id,
    COALESCE(SUM(tr.points), 0) as total_points,
    COUNT(tr.id) as races_participated,
    COUNT(CASE WHEN tr.position = 1 THEN 1 END) as wins,
    COUNT(CASE WHEN tr.position <= 3 THEN 1 END) as podium_finishes,
    MIN(tr.time_seconds) as best_time,
    AVG(tr.position::DECIMAL) as average_position
  FROM tournament_participants tp
  LEFT JOIN tournament_results tr ON tp.id = tr.participant_id
  WHERE tp.tournament_id = tournament_uuid
  GROUP BY tr.tournament_id, tp.horse_id
  ON CONFLICT (tournament_id, horse_id) 
  DO UPDATE SET 
    total_points = EXCLUDED.total_points,
    races_participated = EXCLUDED.races_participated,
    wins = EXCLUDED.wins,
    podium_finishes = EXCLUDED.podium_finishes,
    best_time = EXCLUDED.best_time,
    average_position = EXCLUDED.average_position,
    updated_at = NOW();

  -- Mettre à jour les rangs
  UPDATE leaderboard 
  SET rank = subquery.new_rank
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY tournament_id 
        ORDER BY total_points DESC, wins DESC, average_position ASC
      ) as new_rank
    FROM leaderboard 
    WHERE tournament_id = tournament_uuid
  ) AS subquery
  WHERE leaderboard.id = subquery.id;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le classement
CREATE OR REPLACE FUNCTION trigger_update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_leaderboard(NEW.tournament_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tournament_results_leaderboard_update
  AFTER INSERT OR UPDATE OR DELETE ON tournament_results
  FOR EACH ROW EXECUTE FUNCTION trigger_update_leaderboard();

-- Données d'exemple
INSERT INTO tournaments (name, description, start_date, end_date, status, prize_pool, max_participants) VALUES
('Tournoi de Printemps 2025', 'Grand tournoi de début de saison avec les meilleurs chevaux', '2025-03-01 10:00:00', '2025-03-15 18:00:00', 'upcoming', 50000.00, 20),
('Coupe d''Été 2025', 'Compétition estivale intensive sur 3 semaines', '2025-06-01 09:00:00', '2025-06-21 19:00:00', 'upcoming', 75000.00, 24),
('Championship d''Automne', 'Le championnat le plus prestigieux de l''année', '2025-09-10 08:00:00', '2025-10-05 20:00:00', 'upcoming', 100000.00, 16);

COMMENT ON TABLE tournaments IS 'Table des tournois et compétitions';
COMMENT ON TABLE tournament_participants IS 'Participants inscrits aux tournois';
COMMENT ON TABLE tournament_results IS 'Résultats détaillés des courses de tournoi';
COMMENT ON TABLE leaderboard IS 'Classement en temps réel des tournois';
