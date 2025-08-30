-- Script pour supprimer la table des paris
DROP TABLE IF EXISTS bets CASCADE;

-- Vérifier que la table a été supprimée
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'bets';
