USE jmdb;

-- DIRECTOR TABLE
DELETE FROM jmdb.director WHERE id = 1832;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM director);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE director AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
;
    
SELECT * FROM director;

-- CASTING TABLE
DELETE FROM jmdb.casting WHERE id = 10157;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM casting);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE casting AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
;

SELECT * FROM casting;

-- SCREENWRITER TABLE
DELETE FROM jmdb.screenwriter WHERE id = 3996;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM screenwriter);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE screenwriter AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM screenwriter;

-- MUSIC TABLE
DELETE FROM jmdb.music WHERE id = 1318;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM music);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE music AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM music;

-- STUDIO TABLE
DELETE FROM jmdb.studio WHERE id = 1003;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM studio);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE studio AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM studio;

-- GENRE TABLE
DELETE FROM jmdb.genre WHERE id = 39;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM genre);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE genre AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM genre;

-- GENRE TABLE
DELETE FROM jmdb.language WHERE id = 46;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM language);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE language AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM language;

-- COUNTRY TABLE
DELETE FROM jmdb.country WHERE id = 47;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM country);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE country AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM country;


-- TAG TABLE
DELETE FROM jmdb.tag WHERE id = 208;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM tag);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE tag AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM tag;