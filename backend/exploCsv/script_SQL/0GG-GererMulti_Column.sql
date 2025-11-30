use jmdb;

-- Etape 0 liste et compté la base de départ
SELECT * 
FROM movies 
WHERE location LIKE '%multi%' 
   OR location LIKE '%MULTI%';

SELECT COUNT(*)
FROM movies 
WHERE location LIKE '%multi%' 
   OR location LIKE '%MULTI%';

-- Étape 1 : Ajouter une colonne multi de type BOOLEAN et l'initialiser à FALSE
ALTER TABLE movies
ADD COLUMN multi BOOLEAN DEFAULT FALSE;

-- Étape 2 : Mettre à jour la colonne multi à TRUE pour les films contenant (multi) ou (MULTI)
UPDATE movies
SET multi = TRUE
WHERE location LIKE '%multi%' 
   OR location LIKE '%MULTI%';

-- Etape 3 vérifier la base d'arrivée
SELECT * 
FROM movies
WHERE multi = TRUE;

SELECT COUNT(*)
FROM movies
WHERE multi = TRUE;