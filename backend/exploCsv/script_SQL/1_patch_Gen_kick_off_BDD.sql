USE jmdb;

-- Désactiver temporairement les checks FK
SET FOREIGN_KEY_CHECKS = 0;

-- ===========================
-- 1) Mettre en place les id auto_increment / primary keys
-- ===========================
ALTER TABLE movies
  CHANGE COLUMN `Numéro` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE casting
  CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE director
  CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE `language`
  CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE genre
  CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE music
  CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE screenwriter
  CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE studio
  CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

-- Tag : (re)création propre
CREATE TABLE IF NOT EXISTS tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NULL DEFAULT NULL
);

-- liaison movie_tag
CREATE TABLE IF NOT EXISTS movie_tag (
    tagId INT NOT NULL,
    movieId INT NOT NULL,
    PRIMARY KEY (tagId, movieId),
    FOREIGN KEY (tagId) REFERENCES tag(id) ON DELETE CASCADE,
    FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE
);

ALTER TABLE country
  CHANGE COLUMN `id` id INT AUTO_INCREMENT PRIMARY KEY;

-- ===========================
-- 2) Renommer / modifier colonnes de movies et autres tables
-- ===========================
ALTER TABLE movies
  CHANGE COLUMN `Titre` `title` TEXT NOT NULL,
  CHANGE COLUMN `Titre alternatif` `altTitle` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Année` `year` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Durée` `duration` INT NULL DEFAULT NULL,
  CHANGE COLUMN `Chemin de l'affiche` `cover` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Bande-annonce` `trailer` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Synopsis` `pitch` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Scénario` `story` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Emplacement` `location` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Conteneur` `videoFormat` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Commentaires` `comment` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Support` `videoSupport` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `Taille du fichier` `fileSize` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `ID TheMovieDb` `idTheMovieDb` TEXT NULL DEFAULT NULL,
  CHANGE COLUMN `ID IMDb` `idIMDb` DOUBLE NULL DEFAULT NULL;

-- Ajustements sur cover / idIMDb
ALTER TABLE movies
  MODIFY COLUMN cover VARCHAR(255) NOT NULL DEFAULT '00_cover_default.jpg',
  CHANGE COLUMN `idIMDb` `idIMDb` BIGINT NULL DEFAULT NULL;

-- Casting
ALTER TABLE casting
  CHANGE COLUMN `Distribution` `name` TEXT NULL DEFAULT NULL;

-- movie_casting
ALTER TABLE movie_casting
  CHANGE COLUMN `id` `castingId` INT,
  CHANGE COLUMN `Numéro` `movieId` INT;

-- Director
ALTER TABLE director
  CHANGE COLUMN `Réalisateur(s)` `name` TEXT NULL DEFAULT NULL;

-- movie_director
ALTER TABLE movie_director
  CHANGE COLUMN `id` `directorId` INT,
  CHANGE COLUMN `Numéro` `movieId` INT;

-- Language (nom "language" nécessite backticks)
ALTER TABLE `language`
  CHANGE COLUMN `Langues` `name` TEXT NULL DEFAULT NULL;

-- movie_language
ALTER TABLE movie_language
  CHANGE COLUMN `id` `languageId` INT,
  CHANGE COLUMN `Numéro` `movieId` INT;

-- Genre
ALTER TABLE genre
  CHANGE COLUMN `Genre(s)` `name` TEXT NULL DEFAULT NULL;

-- movie_genre
ALTER TABLE movie_genre
  CHANGE COLUMN `id` `genreId` INT,
  CHANGE COLUMN `Numéro` `movieId` INT;

-- Music
ALTER TABLE music
  CHANGE COLUMN `Compositeur(s)` `name` TEXT NULL DEFAULT NULL;

-- movie_music
ALTER TABLE movie_music
  CHANGE COLUMN `id` `musicId` INT,
  CHANGE COLUMN `Numéro` `movieId` INT;

-- Screenwriter
ALTER TABLE screenwriter
  CHANGE COLUMN `Scénariste(s)` `name` TEXT NULL DEFAULT NULL;

-- movie_screenwriter
ALTER TABLE movie_screenwriter
  CHANGE COLUMN `id` `screenwriterId` INT,
  CHANGE COLUMN `Numéro` `movieId` INT;

-- Studio
ALTER TABLE studio
  CHANGE COLUMN `Studio` `name` TEXT NULL DEFAULT NULL;

-- movie_studio
ALTER TABLE movie_studio
  CHANGE COLUMN `id` `studioId` INT,
  CHANGE COLUMN `Numéro` `movieId` INT;

-- Country
ALTER TABLE country
  CHANGE COLUMN `Pays` `name` TEXT NULL DEFAULT NULL;

-- movie_country
ALTER TABLE movie_country
  CHANGE COLUMN `id` `countryId` INT,
  CHANGE COLUMN `Numéro` `movieId` INT;

-- ===========================
-- 3) Ajout de colonnes image / pitch / links etc.
-- ===========================
ALTER TABLE director
  ADD COLUMN image VARCHAR(255) DEFAULT '00_item_default.png',
  ADD COLUMN pitch TEXT,
  ADD COLUMN wikilink TEXT,
  ADD COLUMN imdblink TEXT,
  ADD COLUMN senscritiquelink TEXT,
  ADD COLUMN websitelink TEXT;

ALTER TABLE casting
  ADD COLUMN image VARCHAR(255) DEFAULT '00_item_default.png',
  ADD COLUMN pitch TEXT,
  ADD COLUMN wikilink TEXT,
  ADD COLUMN imdblink TEXT;

ALTER TABLE screenwriter
  ADD COLUMN image VARCHAR(255) DEFAULT '00_item_default.png',
  ADD COLUMN pitch TEXT,
  ADD COLUMN wikilink TEXT,
  ADD COLUMN imdblink TEXT;

ALTER TABLE music
  ADD COLUMN image VARCHAR(255) DEFAULT '00_item_default.png',
  ADD COLUMN pitch TEXT,
  ADD COLUMN wikilink TEXT,
  ADD COLUMN imdblink TEXT;

ALTER TABLE studio
  ADD COLUMN image VARCHAR(255) DEFAULT '00_jmtb_item_default.jpg',
  ADD COLUMN pitch TEXT,
  ADD COLUMN wikilink TEXT,
  ADD COLUMN imdblink TEXT;

ALTER TABLE country
  ADD COLUMN image VARCHAR(255) DEFAULT '00_jmtb_flag_item_default.jpg';


-- Tag : nom plus court + unique
ALTER TABLE tag MODIFY COLUMN name VARCHAR(255);
ALTER TABLE tag ADD UNIQUE (name);

-- ===========================
-- 4) Suppressions "dernier enregistrement" + reset AUTO_INCREMENT
-- (option D : delete last ID auto)
-- ===========================
-- Director
DELETE FROM director ORDER BY id DESC LIMIT 1;
SET @maxId = (SELECT COALESCE(MAX(id),0) FROM director);
SET @alterStmt = CONCAT('ALTER TABLE director AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Casting
DELETE FROM casting ORDER BY id DESC LIMIT 1;
SET @maxId = (SELECT COALESCE(MAX(id),0) FROM casting);
SET @alterStmt = CONCAT('ALTER TABLE casting AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Screenwriter
DELETE FROM screenwriter ORDER BY id DESC LIMIT 1;
SET @maxId = (SELECT COALESCE(MAX(id),0) FROM screenwriter);
SET @alterStmt = CONCAT('ALTER TABLE screenwriter AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Music
DELETE FROM music ORDER BY id DESC LIMIT 1;
SET @maxId = (SELECT COALESCE(MAX(id),0) FROM music);
SET @alterStmt = CONCAT('ALTER TABLE music AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Studio
DELETE FROM studio ORDER BY id DESC LIMIT 1;
SET @maxId = (SELECT COALESCE(MAX(id),0) FROM studio);
SET @alterStmt = CONCAT('ALTER TABLE studio AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Genre
DELETE FROM genre ORDER BY id DESC LIMIT 1;
SET @maxId = (SELECT COALESCE(MAX(id),0) FROM genre);
SET @alterStmt = CONCAT('ALTER TABLE genre AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Language
DELETE FROM `language` ORDER BY id DESC LIMIT 1;
SET @maxId = (SELECT COALESCE(MAX(id),0) FROM `language`);
SET @alterStmt = CONCAT('ALTER TABLE `language` AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Country
DELETE FROM country ORDER BY id DESC LIMIT 1;
SET @maxId = (SELECT COALESCE(MAX(id),0) FROM country);
SET @alterStmt = CONCAT('ALTER TABLE country AUTO_INCREMENT = ', @maxId + 1);
PREPARE stmt FROM @alterStmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ===========================
-- 5) Nettoyage des tables de relation orphelines (avant ajout FK)
-- ===========================
DELETE FROM movie_casting WHERE castingId NOT IN (SELECT id FROM casting);
DELETE FROM movie_country WHERE countryId NOT IN (SELECT id FROM country);
DELETE FROM movie_director WHERE directorId NOT IN (SELECT id FROM director);
DELETE FROM movie_genre WHERE genreId NOT IN (SELECT id FROM genre);
DELETE FROM movie_language WHERE languageId NOT IN (SELECT id FROM `language`);
DELETE FROM movie_music WHERE musicId NOT IN (SELECT id FROM music);
DELETE FROM movie_screenwriter WHERE screenwriterId NOT IN (SELECT id FROM screenwriter);
DELETE FROM movie_studio WHERE studioId NOT IN (SELECT id FROM studio);
DELETE FROM movie_tag WHERE tagId NOT IN (SELECT id FROM tag);

-- ===========================
-- 6) Ajout des contraintes FOREIGN KEY (avec cascade)
-- ===========================
ALTER TABLE movie_casting
  ADD CONSTRAINT IF NOT EXISTS fk_movie_casting_casting
    FOREIGN KEY (castingId) REFERENCES casting (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS fk_movie_casting_movie
    FOREIGN KEY (movieId) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE movie_country
  ADD CONSTRAINT IF NOT EXISTS fk_movie_country_country
    FOREIGN KEY (countryId) REFERENCES country (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS fk_movie_country_movie
    FOREIGN KEY (movieId) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE movie_director
  ADD CONSTRAINT IF NOT EXISTS fk_movie_director_director
    FOREIGN KEY (directorId) REFERENCES director (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS fk_movie_director_movie
    FOREIGN KEY (movieId) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE movie_genre
  ADD CONSTRAINT IF NOT EXISTS fk_movie_genre_genre
    FOREIGN KEY (genreId) REFERENCES genre (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS fk_movie_genre_movie
    FOREIGN KEY (movieId) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE movie_language
  ADD CONSTRAINT IF NOT EXISTS fk_movie_language_language
    FOREIGN KEY (languageId) REFERENCES `language` (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS fk_movie_language_movie
    FOREIGN KEY (movieId) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE movie_music
  ADD CONSTRAINT IF NOT EXISTS fk_movie_music_music
    FOREIGN KEY (musicId) REFERENCES music (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS fk_movie_music_movie
    FOREIGN KEY (movieId) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE movie_screenwriter
  ADD CONSTRAINT IF NOT EXISTS fk_movie_screenwriter_screenwriter
    FOREIGN KEY (screenwriterId) REFERENCES screenwriter (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS fk_movie_screenwriter_movie
    FOREIGN KEY (movieId) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE movie_studio
  ADD CONSTRAINT IF NOT EXISTS fk_movie_studio_studio
    FOREIGN KEY (studioId) REFERENCES studio (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS fk_movie_studio_movie
    FOREIGN KEY (movieId) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE movie_tag
  ADD CONSTRAINT IF NOT EXISTS fk_movie_tag_tag
    FOREIGN KEY (tagId) REFERENCES tag (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT IF NOT EXISTS fk_movie_tag_movie
    FOREIGN KEY (movieId) REFERENCES movies (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- ===========================
-- 7) Nettoyage de caractères indésirables dans certains noms
-- ===========================
UPDATE studio
  SET name = REPLACE(REPLACE(name, '/', '-'), '\\', '-')
  WHERE name LIKE '%/%' OR name LIKE '%\\%';

UPDATE tag
  SET name = REPLACE(REPLACE(name, '/', '-'), '\\', '-')
  WHERE name LIKE '%/%' OR name LIKE '%\\%';

-- ===========================
-- 8) Ajouts de colonnes business (vostfr, multi, tvshow...) et population
-- ===========================
ALTER TABLE movies
  ADD COLUMN IF NOT EXISTS vostfr BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS multi BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS isTvShow BOOLEAN DEFAULT FALSE AFTER cover,
  ADD COLUMN IF NOT EXISTS tvSeasons VARCHAR(20) DEFAULT NULL AFTER isTvShow,
  ADD COLUMN IF NOT EXISTS nbTvEpisodes INT DEFAULT NULL AFTER tvSeasons,
  ADD COLUMN IF NOT EXISTS episodeDuration INT DEFAULT NULL AFTER nbTvEpisodes;

-- Remplissage des flags
UPDATE movies
  SET vostfr = TRUE
  WHERE title LIKE '%(vostfr)%' OR title LIKE '%(VOSTFR)%';

UPDATE movies
  SET title = TRIM(REPLACE(REPLACE(title, '(vostfr)', ''), '(VOSTFR)', ''));

UPDATE movies
  SET multi = TRUE
  WHERE location LIKE '%multi%' OR location LIKE '%MULTI%';

UPDATE movies
  SET isTvShow = 1
  WHERE idTheMovieDb LIKE '%tv%';

-- Trim sur les noms de director
UPDATE director SET name = TRIM(name);

-- ===========================
-- 9) Focus tables + colonnes isFocus / birthDate / deathDate
-- ===========================
CREATE TABLE IF NOT EXISTS focusCategory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

INSERT IGNORE INTO focusCategory (name) VALUES ('Thema'), ('Festival');

CREATE TABLE IF NOT EXISTS focus (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  pitch TEXT,
  image VARCHAR(255) DEFAULT '00_jmtb_item_default.jpg',
  categoryId INT,
  FOREIGN KEY (categoryId) REFERENCES focusCategory(id)
);

CREATE TABLE IF NOT EXISTS movie_focus (
  movieId INT NOT NULL,
  focusId INT NOT NULL,
  PRIMARY KEY (movieId, focusId),
  FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (focusId) REFERENCES focus(id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE director
  ADD COLUMN IF NOT EXISTS isFocus TINYINT(1) DEFAULT 0 AFTER imdblink,
  ADD COLUMN IF NOT EXISTS birthDate VARCHAR(10) NULL AFTER isFocus,
  ADD COLUMN IF NOT EXISTS deathDate VARCHAR(10) NULL AFTER birthDate;

ALTER TABLE casting
  ADD COLUMN IF NOT EXISTS isFocus TINYINT(1) DEFAULT 0 AFTER imdblink,
  ADD COLUMN IF NOT EXISTS birthDate VARCHAR(10) NULL AFTER isFocus,
  ADD COLUMN IF NOT EXISTS deathDate VARCHAR(10) NULL AFTER birthDate;

-- ===========================
-- 10) Création table user
-- ===========================
CREATE TABLE IF NOT EXISTS `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Réactiver les checks FK
SET FOREIGN_KEY_CHECKS = 1;
