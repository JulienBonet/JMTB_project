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
    
SELECT * FROM director