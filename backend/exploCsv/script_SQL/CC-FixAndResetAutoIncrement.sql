USE jmdb;

DELETE FROM jmdb.director WHERE id = 1766;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM director);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE director AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
;
    
SELECT * FROM director;

DELETE FROM jmdb.casting WHERE id = 9848;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM casting);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE casting AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
;

SELECT * FROM casting;

DELETE FROM jmdb.screenwriter WHERE id = 3866;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM screenwriter);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE screenwriter AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM screenwriter;

DELETE FROM jmdb.music WHERE id = 1271;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM music);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE music AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM music;

DELETE FROM jmdb.studio WHERE id = 948;

-- Récupérer le dernier ID utilisé dans la table director
SET @maxId = (SELECT MAX(id) FROM studio);

-- Ajuster l'incrémentation automatique pour commencer à partir du prochain ID après le dernier utilisé
SET @alterStmt = CONCAT('ALTER TABLE studio AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM studio;