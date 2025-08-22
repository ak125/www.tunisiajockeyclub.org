-- =====================================================
-- TUNISIA JOCKEY CLUB - SCHEMA DE BASE DE DONNÉES
-- =====================================================

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Créer la table User
CREATE TABLE "User" (
    id TEXT PRIMARY KEY DEFAULT concat('user_', replace(cast(gen_random_uuid() as text), '-', '')),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table Session
CREATE TABLE "Session" (
    id TEXT PRIMARY KEY DEFAULT concat('sess_', replace(cast(gen_random_uuid() as text), '-', '')),
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Créer les index pour optimiser les performances
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_sessionToken_idx" ON "Session"("sessionToken");
CREATE INDEX "User_email_idx" ON "User"("email");

-- Insérer des utilisateurs de test avec mots de passe hachés (bcrypt)
-- Mot de passe pour 'monia@gmail.com' = '1234'
INSERT INTO "User" (email, name, password) VALUES 
('monia@gmail.com', 'Monia Test', '$2a$10$/o4jXprQqfW8F9S/QK/kdOjx3ZsOWVyhtwb.Vk06RUtnqNREpFyKy');

-- Mot de passe pour 'admin@tjc.tn' = 'password'  
INSERT INTO "User" (email, name, password) VALUES 
('admin@tjc.tn', 'Admin TJC', '$2a$10$12BbFXfTkOuqWJhHP9lfxegCuhEvh5ZXpPXp64C3yaCQlK.qp.2QC');

-- Vérifier que les données ont été créées
SELECT 
    'Users' as table_name, 
    COUNT(*) as count 
FROM "User"
UNION ALL
SELECT 
    'Sessions' as table_name, 
    COUNT(*) as count 
FROM "Session";

-- Afficher les utilisateurs créés (sans les mots de passe)
SELECT 
    id, 
    email, 
    name, 
    "createdAt"
FROM "User"
ORDER BY "createdAt";

-- =====================================================
-- COMMANDES SUPPLÉMENTAIRES (Optionnel)
-- =====================================================

-- Activer RLS (Row Level Security) pour plus de sécurité
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS basiques (pour plus tard)
-- CREATE POLICY "Users can view own data" ON "User" FOR SELECT USING (auth.uid()::text = id);
-- CREATE POLICY "Users can update own data" ON "User" FOR UPDATE USING (auth.uid()::text = id);

-- Fonction pour nettoyer les sessions expirées (exécuter périodiquement)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() 
RETURNS void AS $$
BEGIN
    DELETE FROM "Session" 
    WHERE "createdAt" < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Nettoie les sessions expirées (plus de 24h)';
