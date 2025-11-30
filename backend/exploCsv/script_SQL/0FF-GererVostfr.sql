use jmdb;

-- Etape 0 liste et compté la base de départ
SELECT * 
FROM movies 
WHERE title LIKE '%(vostfr)%' 
   OR title LIKE '%(VOSTFR)%';

SELECT COUNT(*)
FROM movies
WHERE title LIKE '%(vostfr)%' 
   OR title LIKE '%(VOSTFR)%';

-- Étape 1 : Ajouter une colonne vostfr de type BOOLEAN et l'initialiser à FALSE
ALTER TABLE movies
ADD COLUMN vostfr BOOLEAN DEFAULT FALSE;

-- Étape 2 : Mettre à jour la colonne vostfr à TRUE pour les films contenant (vostfr) ou (VOSTFR)
UPDATE movies
SET vostfr = TRUE
WHERE title LIKE '%(vostfr)%' 
   OR title LIKE '%(VOSTFR)%';

-- Étape 3 : Supprimer (vostfr) ou (VOSTFR) des titres concernés
UPDATE movies
SET title = REPLACE(REPLACE(title, '(vostfr)', ''), '(VOSTFR)', '')
WHERE title LIKE '%(vostfr)%' 
   OR title LIKE '%(VOSTFR)%';
   
-- Etape 4 vérifier la base d'arrivée
SELECT * 
FROM movies
WHERE vostfr = TRUE;

SELECT COUNT(*)
FROM movies
WHERE vostfr = TRUE;




