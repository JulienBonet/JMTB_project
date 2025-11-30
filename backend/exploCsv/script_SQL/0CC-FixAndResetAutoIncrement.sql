USE jmdb;

-- DIRECTOR TABLE
DELETE FROM director WHERE id = 1919;

SET @maxId = (SELECT MAX(id) FROM director);
SET @alterStmt = CONCAT('ALTER TABLE director AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM director;

-- CASTING TABLE
DELETE FROM casting WHERE id = 10147;

SET @maxId = (SELECT MAX(id) FROM casting);
SET @alterStmt = CONCAT('ALTER TABLE casting AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM casting;

-- SCREENWRITER TABLE
DELETE FROM screenwriter WHERE id = 4133;

SET @maxId = (SELECT MAX(id) FROM screenwriter);
SET @alterStmt = CONCAT('ALTER TABLE screenwriter AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM screenwriter;

-- MUSIC TABLE
DELETE FROM music WHERE id = 1376;

SET @maxId = (SELECT MAX(id) FROM music);
SET @alterStmt = CONCAT('ALTER TABLE music AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM music;

-- STUDIO TABLE
DELETE FROM studio WHERE id = 1052;

SET @maxId = (SELECT MAX(id) FROM studio);
SET @alterStmt = CONCAT('ALTER TABLE studio AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM studio;

-- GENRE TABLE
DELETE FROM genre WHERE id = 39;

SET @maxId = (SELECT MAX(id) FROM genre);
SET @alterStmt = CONCAT('ALTER TABLE genre AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM genre;

-- LANGUAGE TABLE
DELETE FROM language WHERE id = 46;

SET @maxId = (SELECT MAX(id) FROM language);
SET @alterStmt = CONCAT('ALTER TABLE language AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM language;

-- COUNTRY TABLE
DELETE FROM country WHERE id = 49;

SET @maxId = (SELECT MAX(id) FROM country);
SET @alterStmt = CONCAT('ALTER TABLE country AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT * FROM country;
